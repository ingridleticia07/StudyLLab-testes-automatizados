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

    await loginThroughPortal(newLoginPage, authFixture, {
      email: user.email,
      password: user.password,
    });

    await newPage.waitForURL(
      (url) => !url.toString().includes('/login'),
      { timeout: 20000 },
    ).catch(() => null);
    await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => null);

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

  test('USER-001 - acessar tela de usuarios', async () => {
    await test.step('Given that the admin user is on the initial admin page', async () => {
      await usersPage.goto(authFixture.adminURL);
    });

    await test.step('When the user clicks the users option in the sidebar', async () => {
      await usersPage.openFromSidebar();
    });

    await test.step('Then the users screen should be displayed with listing and actions', async () => {
      await expect(usersPage.heading).toBeVisible();
      await expect(usersPage.table).toBeVisible();
      await expect(usersPage.registerUserButtons.first()).toBeVisible();
    });
  });

  test('USER-002 - listagem paginada de usuarios', async () => {
    await test.step('Given that the admin user is authenticated and on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
      await expect(usersPage.table).toBeVisible();
    });

    await test.step('When the first page is loaded and the user navigates to another available page', async () => {
      expect(await usersPage.getVisibleRowsCount()).toBeGreaterThan(0);

      const paginationCount = await usersPage.paginationButtons.count();
      if (paginationCount > 1) {
        await usersPage.goToPage(2);
      }
    });

    await test.step('Then the system should keep the user list paginated and populated', async () => {
      await expect(usersPage.table).toBeVisible();
      expect(await usersPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('USER-003 - filtro por status ativo', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the status filter is changed to active', async () => {
      await usersPage.selectStatusOption(usersFixture.filters.status.active);
    });

    await test.step('Then the system should display only active users in the current list', async () => {
      expect(await usersPage.getStatusFilterLabel()).toContain(usersFixture.filters.status.active);
      await expectAllColumnValuesToMatch(3, usersFixture.filters.status.active);
    });
  });

  test('USER-004 - filtro por status inativo', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the status filter is changed to inactive', async () => {
      await usersPage.selectStatusOption(usersFixture.filters.status.inactive);
    });

    await test.step('Then the system should display only inactive users in the current list', async () => {
      expect(await usersPage.getStatusFilterLabel()).toContain(usersFixture.filters.status.inactive);
      await expectAllColumnValuesToMatch(3, usersFixture.filters.status.inactive);
    });
  });

  test('USER-005 - filtro por todos os tipos de usuario', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the type filter is changed to all user types', async () => {
      await usersPage.selectTypeOption(usersFixture.filters.type.all);
    });

    await test.step('Then the system should keep the list visible for all user types', async () => {
      expect(await usersPage.getTypeFilterLabel()).toContain(usersFixture.filters.type.all);
      expect(await usersPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('USER-006 - filtro por usuarios Admin', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the type filter is changed to Admin', async () => {
      await usersPage.selectTypeOption(usersFixture.filters.type.admin);
    });

    await test.step('Then the system should display only admin users in the current list', async () => {
      expect(await usersPage.getTypeFilterLabel()).toContain(usersFixture.filters.type.admin);
      await expectAllColumnValuesToMatch(2, usersFixture.filters.type.admin);
    });
  });

  test('USER-007 - filtro por usuarios Aluno', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the type filter is changed to Aluno', async () => {
      await usersPage.selectTypeOption(usersFixture.filters.type.student);
    });

    await test.step('Then the system should display only student users in the current list', async () => {
      expect(await usersPage.getTypeFilterLabel()).toContain(usersFixture.filters.type.student);
      await expectAllColumnValuesToMatch(2, usersFixture.filters.type.student);
    });
  });

  test('USER-008 - filtro por usuarios Professor', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the type filter is changed to Professor', async () => {
      await usersPage.selectTypeOption(usersFixture.filters.type.professor);
    });

    await test.step('Then the system should display only professor users in the current list', async () => {
      expect(await usersPage.getTypeFilterLabel()).toContain(usersFixture.filters.type.professor);
      await expectAllColumnValuesToMatch(2, usersFixture.filters.type.professor);
    });
  });

test('USER-009 - cadastro com dados validos', async ({ browser }) => {
  await test.step('Given that the admin user opens the register user modal', async () => {
    createdStudentUser = buildTestStudentUser();
  });

  await test.step('When the admin fills the form with valid student data and submits it', async () => {
    await registerStudentUser(createdStudentUser);
  });

  await test.step('Then the created user should appear in the users list and should be able to log in', async () => {
    await assertCreatedUserVisibleInList(createdStudentUser);
    await assertCreatedUserCanLogIn(browser, createdStudentUser);
  });
});

test('USER-010 - exclusao de usuario', async ({ browser }) => {
    await test.step('Given that a test user was created and the admin is authenticated on the users flow', async () => {
      createdStudentUser = buildTestStudentUser();
      await registerStudentUser(createdStudentUser);
      await assertCreatedUserVisibleInList(createdStudentUser);
      await ensureUsersPageReady();
    });

    await test.step('When the admin deletes the created test user', async () => {
      const userFoundInList = await usersPage.openPageContainingUser(createdStudentUser.matricula);
      expect(userFoundInList, 'O usuario criado deveria ser encontrado antes da exclusao.').toBeTruthy();

      await usersPage.openDeletePopupByMatricula(createdStudentUser.matricula);
      await expect(usersPage.deleteModalHeading).toBeVisible();
      await usersPage.confirmDeletePopup();
      await usersPage.waitForDeletePopupClosed();
    });

    await test.step('Then the created user should no longer be able to log in', async () => {
      
      const newContext = await browser.newContext();
      const newPage = await newContext.newPage();
      const deletedUserLoginPage = new LoginPage(newPage);

      await deletedUserLoginPage.goto(authFixture.baseURL);
      const loginResponsePromise = newPage.waitForResponse(
        (response) =>
          response.url().includes('/auth/login') &&
          response.request().method() === 'POST',
      );

      await deletedUserLoginPage.login(
        createdStudentUser.email,
        createdStudentUser.password,
      );

      const loginResponse = await loginResponsePromise;
      expect(loginResponse.status(), 'O login do usuario excluido deveria ser rejeitado.').toBe(404);
      await expect(deletedUserLoginPage.heading).toBeVisible();
      expect(
        await newPage.evaluate(() => window.sessionStorage.getItem('authToken')),
        'O usuario excluido nao deveria receber sessao autenticada.',
      ).toBeNull();

      await newContext.close();
      createdStudentUser = null;
    });
});

  test('USER-011 - cancelar cadastro', async () => {
    await test.step('Given that the admin user is on the users page', async () => {
      await expect(usersPage.heading).toBeVisible();
    });

    await test.step('When the register user modal is opened and then cancelled', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await usersPage.closeRegisterModal();
      await usersPage.page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => null);
    });

    await test.step('Then the modal should be closed without creating a new user', async () => {
      await expect(usersPage.registerModalHeading).toBeHidden();
      await expect(usersPage.table).toBeVisible();
    });
  });

  test('USER-012 - cadastro com nome vazio', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without filling the name field', async () => {
      await fillRegisterFormExcept('name');
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for name', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredName, { exact: true })).toBeVisible();
    });
  });

  test('USER-013 - cadastro com curso nao selecionado', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without selecting the course', async () => {
      await fillRegisterFormExcept('course');
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for course', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredCourse, { exact: true })).toBeVisible();
    });
  });

  test('USER-014 - cadastro com tipo de usuario nao selecionado', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without selecting the user type', async () => {
      await fillRegisterFormExcept('role');
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for user type', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredRole, { exact: true })).toBeVisible();
    });
  });

  test('USER-015 - cadastro com matricula/siape vazia', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without filling the matricula field', async () => {
      await fillRegisterFormExcept('matricula');
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for matricula', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredMatricula, { exact: true })).toBeVisible();
    });
  });

  test('USER-016 - cadastro com email institucional vazio', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without filling the institutional email', async () => {
      await fillRegisterFormExcept('email');
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for email', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredEmailInstitutional, { exact: true })).toBeVisible();
    });
  });

  test('USER-017 - cadastro com senha vazia', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without filling the password', async () => {
      await fillRegisterFormExcept('password');
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for password', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredPassword, { exact: true })).toBeVisible();
    });
  });

  test('USER-018 - cadastro com email fora do dominio institucional', async () => {
    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills the form with a non-institutional email', async () => {
      await fillRegisterFormExcept(null, { email: usersFixture.register.invalidEmail });
      await usersPage.submitRegisterModal();
    });

    await test.step('Then the system should display the institutional email validation message', async () => {
      await expect(usersPage.page.getByText(usersFixture.messages.requiredEmailInstitutional, { exact: true })).toBeVisible();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });
  });

  test('USER-019 - cadastro com email em formato inválido', async () => {
    const invalidUser = buildTestStudentUser();

    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the form with an invalid institutional email format', async () => {
      await fillRegisterFormExcept(null, {
        ...invalidUser,
        email: usersFixture.register.malformedInstitutionalEmail,
      });
      invalidUser.email = usersFixture.register.malformedInstitutionalEmail;
      invalidUser.password = usersFixture.register.defaultPassword;
      invalidUser.course = usersFixture.register.defaultCourse;
      invalidUser.role = usersFixture.register.defaultRole;
      invalidUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration and display the invalid email message', async () => {
      expect.soft(
        invalidUser.registerResponse?.status() ?? 0,
        'O sistema não deveria aceitar cadastro com email em formato inválido.',
      ).not.toBe(200);
      await expect(usersPage.page.getByText(usersFixture.messages.requiredEmailInstitutional, { exact: true })).toBeVisible();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        invalidUser,
        'O sistema não deveria cadastrar usuário com email em formato inválido.',
        'matricula',
      );
    });
  });

  test('USER-020 - cadastro com senha menor que o mínimo permitido', async () => {
    const invalidUser = buildTestStudentUser();

    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the form with a password shorter than the minimum allowed', async () => {
      await fillRegisterFormExcept(null, {
        ...invalidUser,
        password: usersFixture.register.shortPassword,
      });
      invalidUser.password = usersFixture.register.shortPassword;
      invalidUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration and display the password validation message', async () => {
      expect.soft(
        invalidUser.registerResponse,
        'O sistema deveria bloquear o envio antes de chegar à API quando a senha é menor que o mínimo.',
      ).toBeNull();
      await expect(usersPage.page.getByText(usersFixture.messages.requiredPassword, { exact: true })).toBeVisible();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        invalidUser,
        'O sistema não deveria cadastrar usuário com senha menor que o mínimo permitido.',
        'matricula',
      );
    });
  });

  test('USER-021 - cadastro com senha fora dos critérios de composição', async () => {
    const invalidUser = buildTestStudentUser();

    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the form with a password that does not meet the composition rules', async () => {
      await fillRegisterFormExcept(null, {
        ...invalidUser,
        password: usersFixture.register.weakPassword,
      });
      invalidUser.password = usersFixture.register.weakPassword;
      invalidUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration and display the password criteria message', async () => {
      expect.soft(
        invalidUser.registerResponse,
        'O sistema deveria bloquear o envio antes de chegar à API quando a senha não atende aos critérios de composição.',
      ).toBeNull();
      await expect(usersPage.page.getByText(usersFixture.messages.requiredPassword, { exact: true })).toBeVisible();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        invalidUser,
        'O sistema não deveria cadastrar usuário com senha fora dos critérios de composição.',
        'matricula',
      );
    });
  });



  test('USER-023 - cadastro com email duplicado', async () => {
    const existingUser = buildTestStudentUser();
    const duplicateEmailUser = {
      ...buildTestStudentUser(),
      email: existingUser.email,
    };

    await test.step('Given that an existing student user already uses the target email', async () => {
      await createSupportStudentUser(existingUser, 'matricula');
      await ensureUsersPageReady();
    });

    await test.step('When the admin tries to register a new user with the duplicated email', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await fillRegisterFormExcept(null, duplicateEmailUser);
      duplicateEmailUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration and inform that the email is duplicated', async () => {
      expect(duplicateEmailUser.registerResponse?.status()).toBe(400);
      await expect(usersPage.inlineAlert).toContainText(usersFixture.messages.duplicateUser);
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        duplicateEmailUser,
        'O sistema não deveria cadastrar um segundo usuário com email duplicado.',
        'matricula',
      );
    });
  });

  test('USER-024 - cadastro com matrícula/siape duplicado', async () => {
    const existingUser = buildTestStudentUser();
    const duplicateMatriculaUser = {
      ...buildTestStudentUser(),
      matricula: existingUser.matricula,
    };

    await test.step('Given that an existing student user already uses the target matricula/siape', async () => {
      await createSupportStudentUser(existingUser, 'matricula');
      await ensureUsersPageReady();
    });

    await test.step('When the admin tries to register a new user with the duplicated matricula/siape', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await fillRegisterFormExcept(null, duplicateMatriculaUser);
      duplicateMatriculaUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration and inform that the matricula/siape is duplicated', async () => {
      expect(duplicateMatriculaUser.registerResponse?.status()).toBe(400);
      await expect(usersPage.inlineAlert).toContainText(usersFixture.messages.duplicateUser);
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        duplicateMatriculaUser,
        'O sistema não deveria cadastrar um segundo usuário com matrícula/siape duplicado.',
        'email',
      );
    });
  });

  test('USER-025 - limite máximo de caracteres no nome', async () => {
    const longName = buildLongName();

    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the name field with more characters than the supported limit', async () => {
      await usersPage.fillRegisterName(longName);
    });

    await test.step('Then the system should limit the input according to the defined maximum length', async () => {
      const storedValue = await usersPage.nameInput.inputValue();
      expect(storedValue.length).toBe(usersFixture.limits.nameMaxLength);
      expect(storedValue).toBe(longName.slice(0, usersFixture.limits.nameMaxLength));
      await expect(usersPage.registerModalHeading).toBeVisible();
    });
  });

  test('USER-026 - cadastro com matrícula/siape com apenas letras', async () => {
    const invalidUser = buildTestStudentUser();

    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the form with a matricula/siape containing only letters', async () => {
      await fillRegisterFormExcept(null, {
        ...invalidUser,
        matricula: usersFixture.register.lettersOnlyMatricula,
      });
      invalidUser.matricula = usersFixture.register.lettersOnlyMatricula;
      invalidUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration of the invalid matricula/siape', async () => {
      expect.soft(
        invalidUser.registerResponse?.status() ?? 0,
        'O sistema não deveria aceitar cadastro com matrícula/siape contendo apenas letras.',
      ).not.toBe(200);
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        invalidUser,
        'O sistema não deveria cadastrar usuário com matrícula/siape contendo apenas letras.',
        'email',
      );
    });
  });

  test('USER-027 - atualização de usuário', async ({ browser }) => {
    test.slow();
    const originalUser = buildTestStudentUser();
    const updatedUser = buildUpdatedStudentUser();
    let persistedOriginalUser = null;

    await test.step('Given that a valid student user exists in the list for edition', async () => {
      persistedOriginalUser = await createSupportStudentUser(originalUser, 'matricula');
      await ensureUsersPageReady();
    });

    await test.step('When the admin updates the user data and saves the changes', async () => {
      await ensureUsersPageReady();
      await usersPage.selectStatusOption(usersFixture.filters.status.all);
      await usersPage.selectTypeOption(usersFixture.filters.type.all);
      const userFoundInList = await usersPage.openPageContainingUser(originalUser.matricula);
      expect(userFoundInList, 'O usuário criado para edição deveria ser encontrado na listagem antes da atualização.').toBeTruthy();

      await usersPage.openEditUserByMatricula(originalUser.matricula);
      await expect(usersPage.editModalHeading).toBeVisible();

      const updateResponsePromise = usersPage.page.waitForResponse(
        (response) =>
          response.url().includes(`/user/${persistedOriginalUser.id}`) &&
          response.request().method() === 'PUT',
        { timeout: 10000 },
      ).catch(() => null);

      await usersPage.fillRegisterName(updatedUser.name);
      await usersPage.selectRegisterCourse(updatedUser.course);
      await usersPage.selectEditStatus(updatedUser.status);
      await usersPage.fillEditPassword(updatedUser.password);
      await usersPage.saveEditModal();

      updatedUser.updateResponse = await updateResponsePromise;
      if (updatedUser.updateResponse) {
        expect.soft(updatedUser.updateResponse.ok(), 'A atualização do usuário deveria retornar sucesso.').toBeTruthy();
      }
      await usersPage.waitForEditModalClosed();
    });

    await test.step('Then the saved changes should be persisted and reflected in the list', async () => {
      const persistedUpdatedUser = await apiGetUserProfileById(persistedOriginalUser.id);
      trackUserForCleanup({
        id: persistedOriginalUser.id,
        email: persistedUpdatedUser.email,
        matricula: persistedUpdatedUser.matricula,
      }, 'either');

      expect.soft(persistedUpdatedUser.username).toBe(updatedUser.name);
      expect.soft((persistedUpdatedUser.curso?.nome ?? '').toLowerCase()).toBe(usersFixture.courses[updatedUser.course].toLowerCase());
      expect.soft(persistedUpdatedUser.active).toBe(false);
      expect.soft(persistedUpdatedUser.email).toBe(originalUser.email);
      expect.soft(persistedUpdatedUser.matricula).toBe(originalUser.matricula);

      const persistedMatchesExpected =
        persistedUpdatedUser.username === updatedUser.name &&
        (persistedUpdatedUser.curso?.nome ?? '').toLowerCase() === usersFixture.courses[updatedUser.course].toLowerCase() &&
        persistedUpdatedUser.active === false &&
        persistedUpdatedUser.email === originalUser.email &&
        persistedUpdatedUser.matricula === originalUser.matricula;

      if (!persistedMatchesExpected) {
        return;
      }

      await ensureUsersPageReady();
      await usersPage.selectStatusOption(usersFixture.filters.status.all);
      await usersPage.selectTypeOption(usersFixture.filters.type.all);
      const userFoundInList = await usersPage.openPageContainingUser(originalUser.matricula);
      expect.soft(userFoundInList, 'O usuário atualizado deveria continuar visível na listagem.').toBeTruthy();

      if (userFoundInList) {
        const updatedRow = usersPage.getRowByMatricula(originalUser.matricula);
        await expect(updatedRow).toContainText(updatedUser.name);
        const updatedRowText = ((await updatedRow.textContent()) ?? '').toLowerCase();
        expect.soft(updatedRowText).toContain(usersFixture.courses[updatedUser.course].toLowerCase());
        await expect(updatedRow).toContainText(originalUser.email);
        await expect(updatedRow).toContainText(usersFixture.filters.status.inactive);
      }
    });
  });

    test('USER-022 - cadastro com nome contendo apenas espaços', async () => {
    const invalidUser = buildTestStudentUser();

    await test.step('Given that the register user modal is open', async () => {
      await usersPage.openRegisterModal();
      await expect(usersPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the form with a name containing only spaces', async () => {
      await fillRegisterFormExcept(null, {
        ...invalidUser,
        name: '     ',
      });
      invalidUser.name = '     ';
      invalidUser.registerResponse = await submitRegisterModalCapturingResponse();
    });

    await test.step('Then the system should block the registration and display the invalid name message', async () => {
      expect.soft(
        invalidUser.registerResponse?.status() ?? 0,
        'O sistema não deveria aceitar cadastro com nome contendo apenas espaços.',
      ).not.toBe(200);
      await expect(usersPage.page.getByText(usersFixture.messages.requiredName, { exact: true })).toBeVisible();
      await expect(usersPage.registerModalHeading).toBeVisible();
      await assertUserWasNotCreated(
        invalidUser,
        'O sistema não deveria cadastrar usuário com nome contendo apenas espaços.',
        'matricula',
      );
    });
  });

});
