const { test, expect } = require('../../fixtures/admin-auth.fixture');
const { LoginPage } = require('../../pages/login.page');
const { UsersPage } = require('../../pages/users.page');
const { authFixture } = require('../../fixtures/auth.fixture');
const { usersFixture, buildTestStudentUser } = require('../../fixtures/users.fixture');
const { loginThroughPortal, ensureProtectedPageReady, getCookieValue } = require('../../utils/admin-session');

test.describe('Testes de Usuarios', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(60000);

  let loginPage;
  let usersPage;
  let createdStudentUser = null;
  let cachedAdminAuthToken = null;

  const usersToCleanup = new Map();

  async function ensureUsersPageReady() {
    await ensureProtectedPageReady({
      loginPage,
      protectedPage: usersPage,
      protectedUrl: usersFixture.adminUsersURL,
      authFixture,
    });
  }

  async function fillRegisterFormExcept(missingField, overrides = {}) {
    const user = {
      ...buildTestStudentUser(),
      course: usersFixture.register.defaultCourse,
      role: usersFixture.register.defaultRole,
      password: usersFixture.register.defaultPassword,
      ...overrides,
    };

    if (missingField !== 'name') await usersPage.fillRegisterName(user.name);
    if (missingField !== 'course') await usersPage.selectRegisterCourse(user.course);
    if (missingField !== 'role') await usersPage.selectRegisterRole(user.role);
    if (missingField !== 'matricula') await usersPage.fillRegisterMatricula(user.matricula);
    if (missingField !== 'email') await usersPage.fillRegisterEmail(user.email);
    if (missingField !== 'password') await usersPage.fillRegisterPassword(user.password);
  }

  async function expectAllColumnValuesToMatch(columnIndex, expectedText) {
    const rowCount = await usersPage.getVisibleRowsCount();
    if (rowCount > 0) {
      const values = (await usersPage.getColumnTexts(columnIndex)).filter(Boolean);
      values.forEach((value) => {
        expect(value.toLowerCase()).toBe(expectedText.toLowerCase());
      });
    }
  }

  async function registerStudentUser(user) {
    await usersPage.openRegisterModal();
    await expect(usersPage.registerModalHeading).toBeVisible();
    await usersPage.fillRegisterForm(user);
    await usersPage.submitRegisterModal();
    await usersPage.waitForRegisterModalClosed();
  }

  async function assertCreatedUserVisibleInList(user) {
    await expect(usersPage.registerModalHeading).toBeHidden();
    await usersPage.page.reload(5000);
    await usersPage.waitForListReady();

    const userFoundInList = await usersPage.openPageContainingUser(user.matricula);
    expect(userFoundInList, 'O usuário criado deveria ser encontrado em alguma página da listagem.').toBeTruthy();

    const row = usersPage.getRowByMatricula(user.matricula);
    await row.waitFor({ state: 'visible', timeout: 5000 });
    await expect(row).toBeVisible();
  }

  async function assertCreatedUserCanLogIn(browser, user) {
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    const newLoginPage = new LoginPage(newPage);

    await usersPage.page.waitForTimeout(10000);

    await loginThroughPortal(newLoginPage, authFixture, {
      email: user.email,
      password: user.password,
    });

    await newPage.waitForURL(
      (url) => !url.toString().includes('/login'),
      { timeout: 20000 },
    ).catch(() => null);
    await newPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);

    expect.soft(await newLoginPage.hasInlineError(), 'O usuário criado não deveria receber erro ao tentar fazer login.').toBeFalsy();
    expect.soft(await newLoginPage.isLoginScreenVisible(), 'O usuário criado não deveria permanecer na tela de login.').toBeFalsy();

    await newContext.close();
  }

  async function cleanupCreatedStudentUser() {
    if (!createdStudentUser?.matricula) {
      return;
    }

    await ensureUsersPageReady();
    await usersPage.selectStatusOption(usersFixture.filters.status.all);
    await usersPage.selectTypeOption(usersFixture.filters.type.all);

    const userFoundInList = await usersPage.openPageContainingUser(createdStudentUser.matricula);
    if (!userFoundInList) {
      createdStudentUser = null;
      return;
    }

    await usersPage.openDeletePopupByMatricula(createdStudentUser.matricula);
    await expect(usersPage.deleteModalHeading).toBeVisible();
    await usersPage.confirmDeletePopup();
    await usersPage.waitForDeletePopupClosed();
    await usersPage.waitForTableData();
    createdStudentUser = null;
  }

  function cleanupUserKey(user) {
    return `${user.email ?? ''}::${user.matricula ?? ''}`;
  }

  function trackUserForCleanup(user, cleanupBy = 'either') {
    const key = cleanupUserKey(user);
    usersToCleanup.set(key, {
      ...(usersToCleanup.get(key) ?? {}),
      ...user,
      cleanupBy,
    });
  }

  function buildLongName(totalLength = usersFixture.limits.nameMaxLength + 20) {
    return `Usuario ${'A'.repeat(totalLength)}`.slice(0, totalLength);
  }

  function buildUpdatedStudentUser() {
    const candidate = buildTestStudentUser();

    return {
      name: `${candidate.name} Editado`,
      matricula: candidate.matricula,
      email: candidate.email,
      password: 'NovaSenha123',
      course: 'CC',
      status: 'false',
    };
  }

  async function getAdminAuthHeaders(pageContext = usersPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken')).catch(() => cachedAdminAuthToken);
    cachedAdminAuthToken = token ?? cachedAdminAuthToken;

    return {
      Authorization: `Bearer ${cachedAdminAuthToken}`,
      'x-api-key': usersFixture.apiKey,
    };
  }

  async function apiGetUsers(pageContext = usersPage.page) {
    const response = await pageContext.request.get(`${usersFixture.apiBaseURL}/user/?page=1&pageSize=500&status=0&userType=0`, {
      headers: await getAdminAuthHeaders(pageContext),
    });

    expect(response.ok(), 'A listagem de usuários pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindUser(candidate, pageContext = usersPage.page) {
    for (let attempt = 1; attempt <= 6; attempt += 1) {
      const payload = await apiGetUsers(pageContext);
      const users = payload.users ?? [];

      let foundUser = candidate.id
        ? users.find((item) => item.id === candidate.id)
        : undefined;

      if (!foundUser) {
        if (candidate.cleanupBy === 'email') {
          foundUser = users.find((item) => item.email === candidate.email);
        } else if (candidate.cleanupBy === 'matricula') {
          foundUser = users.find((item) => item.matricula === candidate.matricula);
        } else {
          foundUser = users.find((item) =>
            (candidate.email && item.email === candidate.email) ||
            (candidate.matricula && item.matricula === candidate.matricula));
        }
      }

      if (foundUser) {
        return foundUser;
      }

      await pageContext.waitForTimeout(1000);
    }

    return undefined;
  }

  async function apiDeleteUserById(userId, pageContext = usersPage.page) {
    return pageContext.request.delete(`${usersFixture.apiBaseURL}/user/${userId}`, {
      headers: await getAdminAuthHeaders(pageContext),
    });
  }

  async function apiGetUserProfileById(userId, pageContext = usersPage.page) {
    const response = await pageContext.request.get(`${usersFixture.apiBaseURL}/user/profile?idUsuario=${userId}`, {
      headers: await getAdminAuthHeaders(pageContext),
    });

    expect(response.ok(), 'A consulta do perfil do usuário pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function submitRegisterModalCapturingResponse(timeout = 7000) {
    const responsePromise = usersPage.page.waitForResponse(
      (response) =>
        response.url().includes('/auth/registerProfOrAdmin') &&
        response.request().method() === 'POST',
      { timeout },
    ).catch(() => null);

    await usersPage.submitRegisterModal();
    return responsePromise;
  }

  async function assertUserWasNotCreated(candidate, message, cleanupBy = 'either') {
    const foundUser = await apiFindUser({ ...candidate, cleanupBy }).catch(() => null);

    if (foundUser?.id) {
      trackUserForCleanup({
        ...candidate,
        id: foundUser.id,
        email: foundUser.email,
        matricula: foundUser.matricula,
      }, cleanupBy);
    }

    expect.soft(Boolean(foundUser), message).toBeFalsy();
  }

  async function createSupportStudentUser(user, cleanupBy = 'matricula') {
    await registerStudentUser(user);
    await assertCreatedUserVisibleInList(user);

    const persistedUser = await apiFindUser({ ...user, cleanupBy });
    expect(persistedUser?.id, 'O usuário de apoio deveria ser localizado pela API após o cadastro.').toBeTruthy();

    trackUserForCleanup({
      ...user,
      id: persistedUser.id,
      email: persistedUser.email,
      matricula: persistedUser.matricula,
    }, cleanupBy);

    return persistedUser;
  }

  async function cleanupTrackedUsers() {
    for (const [key, trackedUser] of Array.from(usersToCleanup.entries()).reverse()) {
      try {
        const foundUser = trackedUser.id
          ? { id: trackedUser.id }
          : await apiFindUser(trackedUser).catch(() => null);

        if (foundUser?.id) {
          await apiDeleteUserById(foundUser.id).catch(() => null);
        }
      } finally {
        usersToCleanup.delete(key);
      }
    }
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    usersPage = new UsersPage(page);

    await ensureUsersPageReady();
    await usersPage.selectStatusOption(usersFixture.filters.status.all);
    await usersPage.selectTypeOption(usersFixture.filters.type.all);
  });

  
});
