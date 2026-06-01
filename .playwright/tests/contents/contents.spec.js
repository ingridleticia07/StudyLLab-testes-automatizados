const { test, expect } = require('../../fixtures/admin-auth.fixture');
const { LoginPage } = require('../../pages/login.page');
const { MaterialsPage } = require('../../pages/contents.page');
const { authFixture } = require('../../fixtures/auth.fixture');
const { subjectsFixture, buildTestSubject, buildAutoSubjectSuffix } = require('../../fixtures/subjects.fixture');
const { buildTestTopic } = require('../../fixtures/topics.fixture');
const { contentsFixture } = require('../../fixtures/contents.fixture');
const { ensureProtectedPageReady, getCookieValue } = require('../../utils/admin-session');

test.describe('Testes de Conteudos', () => {
  test.setTimeout(120000);

  let loginPage;
  let materialsPage;
  let adminUserId = null;
  let cachedAdminAuthToken = null;

  let primarySubject = null;
  let emptySubject = null;

  const subjectCodesToCleanup = new Set();
  const topicsToCleanup = new Map();
  const materialsToCleanup = new Map();

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function buildUniqueCode(prefix) {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-6);
    return `${prefix}${suffix}`;
  }

  function topicKey(topic) {
    return `${topic.subjectName}::${topic.name}`;
  }

  function materialKey(entry) {
    return `${entry.subjectName}::${entry.topicName}`;
  }

  function getCourseCode(courseValue) {
    return {
      ES: 1,
      CC: 2,
      EC: 3,
      EP: 4,
      EM: 5,
    }[courseValue] ?? courseValue;
  }

  async function ensureMaterialsPageReady() {
    await ensureProtectedPageReady({
      loginPage,
      protectedPage: materialsPage,
      protectedUrl: contentsFixture.adminContentsURL,
      authFixture,
    });
  }

  async function reloadMaterialsPage() {
    await materialsPage.goto(contentsFixture.adminContentsURL);
    await materialsPage.waitForListReady();
  }


  async function getAdminAuthHeaders(pageContext = materialsPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken')).catch(() => cachedAdminAuthToken);
    cachedAdminAuthToken = token ?? cachedAdminAuthToken;
    return {
      Authorization: `Bearer ${cachedAdminAuthToken}`,
      'x-api-key': contentsFixture.apiKey,
    };
  }

  async function getAdminUserIdFromToken(pageContext = materialsPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken'));
    if (!token) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'));
    return Number(payload.unique_name);
  }

  async function ensureAdminUserCookie(pageContext = materialsPage.page) {
    adminUserId =
      adminUserId ||
      Number(await getCookieValue(pageContext, 'id-user')) ||
      await getAdminUserIdFromToken(pageContext);

    if (!adminUserId) {
      return;
    }

    await pageContext.context().addCookies([{
      name: 'id-user',
      value: String(adminUserId),
      domain: 'admin.studyllab.com.br',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    }]);
  }

  async function apiGetAllSubjects(pageContext = materialsPage.page) {
    const response = await pageContext.request.get(`${contentsFixture.apiBaseURL}/disciplina/listarDisciplinas`, {
      headers: { 'x-api-key': contentsFixture.apiKey },
    });
    expect(response.ok(), 'A listagem de disciplinas de apoio deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindSubjectByCode(subject, pageContext = materialsPage.page) {
    const subjects = await apiGetAllSubjects(pageContext);
    return subjects.find((item) => item.codigoDisciplina === subject.code);
  }

  async function apiCreateSubject(subject, pageContext = materialsPage.page) {
    const response = await pageContext.request.post(`${contentsFixture.apiBaseURL}/disciplina/cadastrarDisciplina`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': contentsFixture.apiKey,
      },
      data: {
        nomeDisciplina: subject.name,
        professorDisciplina: subject.professor,
        curso: getCourseCode(subject.course),
        quantidadeAluno: Number(subject.studentsCount),
        codigoDisciplina: subject.code,
      },
    });

    expect(response.ok(), 'O cadastro da disciplina de apoio deveria retornar sucesso.').toBeTruthy();
  }

  async function apiDeleteSubjectById(subjectId, pageContext = materialsPage.page) {
    return pageContext.request.delete(
      `${contentsFixture.apiBaseURL}/disciplina/excluirDisciplina?disciplinaIdentifier=${subjectId}`,
      { headers: { 'x-api-key': contentsFixture.apiKey } },
    );
  }

  async function createSubjectIfMissing(subject) {
    const existing = await apiFindSubjectByCode(subject);
    if (existing) {
      return existing;
    }

    await apiCreateSubject(subject);
    subjectCodesToCleanup.add(subject.code);
    return apiFindSubjectByCode(subject);
  }

  async function apiGetAllTopics(pageContext = materialsPage.page) {
    const response = await pageContext.request.get(`${contentsFixture.apiBaseURL}/forum/listarTopicosDiscussao`, {
      headers: { 'x-api-key': contentsFixture.apiKey },
    });
    expect(response.ok(), 'A listagem de topicos de apoio deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindTopicByNameAndSubject(topic, pageContext = materialsPage.page) {
    const topics = await apiGetAllTopics(pageContext);
    return topics.find((item) =>
      item.nomeTopico === topic.name &&
      item.disciplina?.nomeDisciplina === topic.subjectName);
  }

  async function apiCreateTopic(topic, pageContext = materialsPage.page) {
    const subjectModel = await apiFindSubjectByCode({ code: topic.subjectCode }, pageContext);
    expect(subjectModel, 'A disciplina de apoio deveria existir antes da criacao do topico.').toBeTruthy();

    const response = await pageContext.request.post(`${contentsFixture.apiBaseURL}/forum/criarTopicoDiscussao`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': contentsFixture.apiKey,
      },
      data: {
        nomeTopico: topic.name,
        dataTopico: todayIsoDate(),
        disciplina: subjectModel.idDisciplina,
        idUsuario: adminUserId,
      },
    });

    expect(response.ok(), 'O cadastro do topico de apoio deveria retornar sucesso.').toBeTruthy();
  }

  async function apiDeleteTopicById(topicId, pageContext = materialsPage.page) {
    return pageContext.request.delete(
      `${contentsFixture.apiBaseURL}/forum/deletarTopicoDiscussao?idTopicoDiscussao=${topicId}`,
      { headers: { 'x-api-key': contentsFixture.apiKey } },
    );
  }

  async function createTopicIfMissing(topic) {
    const existing = await apiFindTopicByNameAndSubject(topic);
    if (existing) {
      return existing;
    }

    await apiCreateTopic(topic);
    topicsToCleanup.set(topicKey(topic), { ...topic });
    return apiFindTopicByNameAndSubject(topic);
  }

  async function getFirstVisibleContentRow() {
    await expect(materialsPage.tableRows.first()).toBeVisible();
    const firstRow = materialsPage.tableRows.first();
    const cells = firstRow.locator('td');

    return {
      title: (await cells.nth(0).innerText()).trim(),
      subjectName: (await cells.nth(1).innerText()).trim(),
    };
  }

  function getContentRowByTitleAndSubject(title, subjectName) {
    return materialsPage.tableRows
      .filter({ has: materialsPage.page.locator('td', { hasText: title }) })
      .filter({ has: materialsPage.page.locator('td', { hasText: subjectName }) })
      .first();
  }

  async function loginWithFixedStudent(browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const studentLoginPage = new LoginPage(page);
    const studentMaterialsPage = new MaterialsPage(page);

    await studentLoginPage.goto(authFixture.baseURL);
    await studentLoginPage.login(contentsFixture.student.email, contentsFixture.student.password);
    await studentLoginPage.waitForIdleAfterSubmit(20000);
    await studentLoginPage.waitForAuthSession(15000);
    await page.waitForFunction(() => {
      return document.cookie.includes('authToken=') && document.cookie.includes('id-user=');
    }, { timeout: 15000 }).catch(() => null);
        await page.goto(authFixture.baseURL.replace('/login', '/'), { waitUntil: 'domcontentloaded' }).catch(() => null);
        await studentMaterialsPage.goto(contentsFixture.studentContentsURL);
    await studentMaterialsPage.waitForListReady();

    return { context, page, studentMaterialsPage };
  }

  async function apiListMaterials({ pageNumber = 1, pageSize = 100, subjectId = 0, topicId = 0, anyStatus = true } = {}, pageContext = materialsPage.page) {
    const response = await pageContext.request.get(
      `${contentsFixture.apiBaseURL}/material/ListarDocumentosWithPagination?page=${pageNumber}&pageSize=${pageSize}&idDisciplina=${subjectId}&idTopico=${topicId}&isAnyStatus=${anyStatus}`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );

    expect(response.ok(), 'A listagem de conteudos pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindMaterialByTopicAndSubject(entry, options = {}, pageContext = materialsPage.page) {
    const { anyStatus = true } = options;

    for (let attempt = 1; attempt <= 8; attempt += 1) {
      const payload = await apiListMaterials({ pageNumber: 1, pageSize: 200, anyStatus }, pageContext);
      const found = payload.documentos.find((item) =>
        item.topico?.nomeTopico === entry.topicName &&
        item.topico?.disciplina?.nomeDisciplina === entry.subjectName);

      if (found) {
        return found;
      }

      await pageContext.waitForTimeout(750);
    }

    return undefined;
  }

  async function apiDeleteMaterialById(materialId, userId = adminUserId, pageContext = materialsPage.page) {
    return pageContext.request.delete(
      `${contentsFixture.apiBaseURL}/material/DeleteDocumento?idDocumento=${materialId}&idUsuario=${userId}`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );
  }

  async function registerMaterialForCleanup(entry) {
    materialsToCleanup.set(materialKey(entry), { ...entry });
  }

  async function ensureBaseSubjectsCreated() {
    if (primarySubject && emptySubject) {
      return;
    }

    primarySubject = buildTestSubject({
      code: buildUniqueCode('CTA'),
      name: `[AUTO] Disciplina Conteudo ${buildAutoSubjectSuffix()}`,
      professor: `Professor Conteudo A ${buildAutoSubjectSuffix()}`,
      studentsCount: '45',
      course: subjectsFixture.courses.software.value,
      courseLabel: subjectsFixture.courses.software.label,
    });

    emptySubject = buildTestSubject({
      code: buildUniqueCode('CTE'),
      name: `[AUTO] Disciplina Conteudo ${buildAutoSubjectSuffix()}`,
      professor: `Professor Conteudo Vazio ${buildAutoSubjectSuffix()}`,
      studentsCount: '35',
      course: subjectsFixture.courses.mechanics.value,
      courseLabel: subjectsFixture.courses.mechanics.label,
    });

    await createSubjectIfMissing(primarySubject);
    await createSubjectIfMissing(emptySubject);
  }

  async function createSupportTopic(subject = null, prefix = 'Conteudo Topic') {
    await ensureBaseSubjectsCreated();
    const resolvedSubject = subject ?? primarySubject;

    const topic = buildTestTopic({
      name: `${prefix} ${buildUniqueCode('')}`.trim(),
      subjectName: resolvedSubject.name,
    });

    topic.subjectCode = resolvedSubject.code;
    await createTopicIfMissing(topic);
    return topic;
  }

  async function createMaterialViaUi({ topicName, subjectName, filePaths, typeValue }) {
    await reloadMaterialsPage();
    await ensureAdminUserCookie();
    await materialsPage.selectSubjectFilter(subjectName);
    
    const uploadResponsePromise = materialsPage.page.waitForResponse((response) =>
      response.url().includes('/material/cadastrarDocumento') && response.request().method() === 'POST',
    );
    await materialsPage.openRegisterModal();
    await expect(materialsPage.registerModalHeading).toBeVisible();
    await materialsPage.fillRegisterForm({ topicName, filePaths, typeValue });
    await materialsPage.submitRegisterModal();
    const uploadResponse = await uploadResponsePromise;
    await materialsPage.waitForToast(contentsFixture.messages.uploadSuccess);
    await materialsPage.waitForRegisterModalClosed();

    return { topicName, subjectName, filePaths, typeValue, uploadResponse };
  }

  async function cleanupMaterials(pageContext = materialsPage.page) {
    if (materialsToCleanup.size === 0) {
      return;
    }

    try {
      await ensureAdminUserCookie(pageContext);

      for (const [key, entry] of [...materialsToCleanup.entries()]) {
        const material = await apiFindMaterialByTopicAndSubject(entry, pageContext).catch(() => null);
        if (material?.idDocumento) {
          await apiDeleteMaterialById(material.idDocumento, adminUserId, pageContext).catch(() => null);
        }

        materialsToCleanup.delete(key);
      }
    } finally {
      materialsToCleanup.clear();
    }
  }

  async function cleanupTopics(pageContext = materialsPage.page) {
    if (topicsToCleanup.size === 0) {
      return;
    }
    await ensureAdminUserCookie(pageContext);

    for (const [key, topic] of [...topicsToCleanup.entries()]) {
      const createdTopic = await apiFindTopicByNameAndSubject(topic, pageContext);
      if (createdTopic?.idTopico) {
        await apiDeleteTopicById(createdTopic.idTopico, pageContext);
      }

      topicsToCleanup.delete(key);
    }

    topicsToCleanup.clear();
  }

  async function cleanupSubjects(pageContext = materialsPage.page) {
    if (subjectCodesToCleanup.size === 0) {
      primarySubject = null;
      emptySubject = null;
      return;
    }
    await ensureAdminUserCookie(pageContext);

    for (const code of [...subjectCodesToCleanup]) {
      const subject = await apiFindSubjectByCode({ code }, pageContext);
      if (subject?.idDisciplina) {
        await apiDeleteSubjectById(subject.idDisciplina, pageContext);
      }

      subjectCodesToCleanup.delete(code);
    }

    subjectCodesToCleanup.clear();
    primarySubject = null;
    emptySubject = null;
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    materialsPage = new MaterialsPage(page);

    await ensureMaterialsPageReady();
    await ensureAdminUserCookie();
  });

  test('CONT-001 - cadastro de documento PDF', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo PDF');
    let createdContent;

    await test.step('Given that the admin user is on the contents page with a valid topic available', async () => {
      await expect(materialsPage.heading).toBeVisible();
    });

    await test.step('When the user registers a new PDF content', async () => {
      createdContent = await createMaterialViaUi({
        topicName: topic.name,
        subjectName: primarySubject.name,
        filePaths: [contentsFixture.files.pdf],
        typeValue: contentsFixture.materialTypes.artigo.value,
      });
      await registerMaterialForCleanup({
        subjectName: primarySubject.name,
        topicName: topic.name,
      });
    });

    await test.step('Then the system should create the PDF content and close the register modal', async () => {
      await expect(materialsPage.registerModalHeading).toBeHidden();
      await materialsPage.waitForToast(contentsFixture.messages.uploadSuccess);

      const persistedContent = await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }, { anyStatus: true });

      expect(createdContent.uploadResponse.ok(), 'A requisicao de cadastro do conteudo em PDF deveria retornar sucesso.').toBeTruthy();
      expect(persistedContent, 'O conteudo em PDF deveria ser retornado mesmo enquanto estiver pendente.').toBeTruthy();
      expect([1, 'Pendente']).toContain(persistedContent.status);
      expect(createdContent.uploadResponse.status()).toBe(200);
    });
  });

  test('CONT-002 - cadastro de uma imagem', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Imagem 1');
    let createdContent;

    await test.step('Given that the admin user has a valid topic available for content upload', async () => {
      await expect(materialsPage.heading).toBeVisible();
    });

    await test.step('When the user registers a new content with one image file', async () => {
      createdContent = await createMaterialViaUi({
        topicName: topic.name,
        subjectName: primarySubject.name,
        filePaths: [contentsFixture.files.image1],
        typeValue: contentsFixture.materialTypes.trabalho.value,
      });
      await registerMaterialForCleanup({
        subjectName: primarySubject.name,
        topicName: topic.name,
      });
    });

    await test.step('Then the system should create the image content and close the register modal', async () => {
      await expect(materialsPage.registerModalHeading).toBeHidden();
      await materialsPage.waitForToast(contentsFixture.messages.uploadSuccess);

      const persistedContent = await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }, { anyStatus: true });

      expect(createdContent.uploadResponse.ok(), 'A requisicao de cadastro do conteudo com uma imagem deveria retornar sucesso.').toBeTruthy();
      expect(persistedContent, 'O conteudo com uma imagem deveria ser retornado mesmo enquanto estiver pendente.').toBeTruthy();
      expect([1, 'Pendente']).toContain(persistedContent.status);
      expect(createdContent.uploadResponse.status()).toBe(200);
    });
  });

  test('CONT-003 - cadastro de duas imagens', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Imagem 2');
    let createdContent;

    await test.step('Given that the admin user has a valid topic available for multi-image upload', async () => {
      await expect(materialsPage.heading).toBeVisible();
    });

    await test.step('When the user registers a new content with two image files', async () => {
      createdContent = await createMaterialViaUi({
        topicName: topic.name,
        subjectName: primarySubject.name,
        filePaths: [contentsFixture.files.image1, contentsFixture.files.image2],
        typeValue: contentsFixture.materialTypes.pesquisa.value,
      });
      await registerMaterialForCleanup({
        subjectName: primarySubject.name,
        topicName: topic.name,
      });
    });

    await test.step('Then the system should create the two-image content and close the register modal', async () => {
      await expect(materialsPage.registerModalHeading).toBeHidden();
      await materialsPage.waitForToast(contentsFixture.messages.uploadSuccess);

      const persistedContent = await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }, { anyStatus: true });

      expect(createdContent.uploadResponse.ok(), 'A requisicao de cadastro do conteudo com duas imagens deveria retornar sucesso.').toBeTruthy();
      expect(persistedContent, 'O conteudo com duas imagens deveria ser retornado mesmo enquanto estiver pendente.').toBeTruthy();
      expect([1, 'Pendente']).toContain(persistedContent.status);
      expect(createdContent.uploadResponse.status()).toBe(200);
    });
  });

  test('CONT-004 - listagem paginada de conteudos', async () => {
    await test.step('Given that the admin user is on the contents page with listed records', async () => {
      await reloadMaterialsPage();
      await expect(materialsPage.table).toBeVisible();
      expect(await materialsPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });

    await test.step('When the user navigates through another page if pagination is available', async () => {
      const pageNumbers = await materialsPage.getPaginationPageNumbers();
      if (pageNumbers.length > 1) {
        await materialsPage.goToPage(2);
      }
    });

    await test.step('Then the contents list should remain visible and populated', async () => {
      await expect(materialsPage.table).toBeVisible();
      expect(await materialsPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('CONT-006 - aluno apenas visualiza conteudos', async ({ browser }) => {
    let studentSession;

    await test.step('Given that the student logs into the platform and accesses the contents page', async () => {
      studentSession = await loginWithFixedStudent(browser);
    });

    await test.step('When the contents page is displayed in the student area', async () => {
      await expect(studentSession.studentMaterialsPage.heading).toBeVisible();
      await expect(studentSession.studentMaterialsPage.table).toBeVisible();
    });

    await test.step('Then the student area should not expose content management actions', async () => {
      await expect(studentSession.studentMaterialsPage.registerContentButton).toHaveCount(0);
      await expect(studentSession.studentMaterialsPage.page.getByRole('button', { name: /Cadastrar Conteúdo/i })).toHaveCount(0);
      await expect(studentSession.studentMaterialsPage.page.getByRole('button', { name: 'editar' })).toHaveCount(0);
      await expect(studentSession.studentMaterialsPage.page.getByRole('button', { name: 'excluir' })).toHaveCount(0);

      const rowCount = await studentSession.studentMaterialsPage.getVisibleRowsCount();
      if (rowCount > 0) {
        const firstRow = studentSession.studentMaterialsPage.tableRows.first();
        await expect(firstRow.getByRole('button', { name: 'editar' })).toHaveCount(0);
        await expect(firstRow.getByRole('button', { name: 'excluir' })).toHaveCount(0);
      }
    });

    await studentSession?.page?.close().catch(() => null);
    await studentSession?.context?.close().catch(() => null);
  });

  test('CONT-010 - exibir listagem geral ao selecionar "Todas as disciplinas"', async () => {
    let firstVisibleEntry;

    await test.step('Given that the contents page has records listed before any discipline filter is applied', async () => {
      await reloadMaterialsPage();
      firstVisibleEntry = await getFirstVisibleContentRow();
    });

    await test.step('When the user filters by one visible discipline and then returns to "Todas as disciplinas"', async () => {
      await materialsPage.selectSubjectFilter(firstVisibleEntry.subjectName);
      await expect(materialsPage.table).toBeVisible();
      await materialsPage.selectSubjectFilter(contentsFixture.filters.allSubjects);
    });

    await test.step('Then the general contents list should be displayed again', async () => {
      await expect(materialsPage.table).toBeVisible();
      const row = getContentRowByTitleAndSubject(firstVisibleEntry.title, firstVisibleEntry.subjectName);
      await expect(row).toBeVisible();
    });
  });

  test('CONT-011 - filtrar disciplina sem conteudos', async () => {
    await ensureBaseSubjectsCreated();
    await reloadMaterialsPage();

    await test.step('Given that a discipline exists without registered contents', async () => {
      await materialsPage.goto(contentsFixture.adminContentsURL);
      await materialsPage.waitForListReady();
    });

    await test.step('When the user filters the list by the discipline without contents', async () => {
      await materialsPage.selectSubjectFilter(emptySubject.name);
    });

    await test.step('Then the system should display that no records were found', async () => {
      await expect(materialsPage.emptyListMessage).toBeVisible();
    });
  });

  test('CONT-012 - cadastrar conteudo sem selecionar tipo de material', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Missing Type');
    await reloadMaterialsPage();
    await materialsPage.selectSubjectFilter(primarySubject.name);
    
    await test.step('Given that the content register modal is open', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without selecting the material type', async () => {
      await materialsPage.fillRegisterFormExcept('type', {
        filePaths: [contentsFixture.files.image1],
        typeValue: contentsFixture.materialTypes.prova.value,
        topicName: topic.name,
      });
      await materialsPage.submitRegisterModal();
    });

    await test.step('Then the required validation message for material type should be displayed', async () => {
      await expect(materialsPage.page.getByText(contentsFixture.messages.requiredType, { exact: false })).toBeVisible();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      await materialsPage.closeRegisterModal();
    });
  });

  test('CONT-013 - cadastrar conteudo sem selecionar topico', async () => {
    await reloadMaterialsPage();

    await test.step('Given that the content register modal is open', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without selecting the topic', async () => {
      await materialsPage.fillRegisterFormExcept('topic', {
        filePaths: [contentsFixture.files.image1],
        typeValue: contentsFixture.materialTypes.prova.value,
        topicName: 'placeholder',
      });
      await materialsPage.submitRegisterModal();
    });

    await test.step('Then the required validation message for topic should be displayed', async () => {
      await expect(materialsPage.page.getByText(contentsFixture.messages.requiredTopic, { exact: false })).toBeVisible();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      await materialsPage.closeRegisterModal();
    });
  });

  test('CONT-014 - cadastrar conteudo sem selecionar arquivo', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Missing File');
    await reloadMaterialsPage();
    await materialsPage.selectSubjectFilter(primarySubject.name);
    
    await test.step('Given that the content register modal is open', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without selecting any file', async () => {
      await materialsPage.fillRegisterFormExcept('files', {
        filePaths: [contentsFixture.files.image1],
        typeValue: contentsFixture.materialTypes.prova.value,
        topicName: topic.name,
      });
      await materialsPage.submitRegisterModal();
    });

    await test.step('Then the required validation message for file selection should be displayed', async () => {
      await expect(materialsPage.page.getByText(contentsFixture.messages.requiredFiles, { exact: false })).toBeVisible();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      await materialsPage.closeRegisterModal();
    });
  });

  test('CONT-015 - cadastrar conteudo com mais de duas imagens', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Too Many Images');
    await reloadMaterialsPage();
    await materialsPage.selectSubjectFilter(primarySubject.name);
        let uploadResponse;
    let successToastWasShown = false;

    await test.step('Given that the content register modal is open with a valid topic available', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user tries to register a content with more than two images', async () => {
      const uploadResponsePromise = materialsPage.page.waitForResponse((response) =>
        response.url().includes('/material/cadastrarDocumento') && response.request().method() === 'POST',
      );
      const successToastPromise = materialsPage.page
        .getByText(contentsFixture.messages.uploadSuccess, { exact: false })
        .waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      await materialsPage.fillRegisterForm({
        topicName: topic.name,
        filePaths: [
          contentsFixture.files.image1,
          contentsFixture.files.image2,
          contentsFixture.files.image3,
        ],
        typeValue: contentsFixture.materialTypes.prova.value,
      });
      await materialsPage.submitRegisterModal();
      uploadResponse = await uploadResponsePromise;
      successToastWasShown = await successToastPromise;
    });

    await test.step('Then the system should prevent content creation when more than two images are uploaded', async () => {
      const contentWasCreated = Boolean(await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }).catch(() => null));
      expect(contentWasCreated, 'O sistema nao deveria criar conteudo quando mais de duas imagens sao enviadas.').toBeFalsy();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      expect(successToastWasShown,'O sistema nao deveria exibir mensagem de sucesso quando o upload com mais de duas imagens falha.',).toBeFalsy();
      expect(uploadResponse.status()).toBe(400);
    });
  });

  test('CONT-016 - cadastrar conteudo com PDF e imagem no mesmo envio', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Mixed Upload');
    await reloadMaterialsPage();
    await materialsPage.selectSubjectFilter(primarySubject.name);
        let uploadResponse;
    let successToastWasShown = false;

    await test.step('Given that the content register modal is open with a valid topic available', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user tries to register a content with a PDF and an image in the same upload', async () => {
      const uploadResponsePromise = materialsPage.page.waitForResponse((response) =>
        response.url().includes('/material/cadastrarDocumento') && response.request().method() === 'POST',
      );
      const successToastPromise = materialsPage.page
        .getByText(contentsFixture.messages.uploadSuccess, { exact: false })
        .waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      await materialsPage.fillRegisterForm({
        topicName: topic.name,
        filePaths: [contentsFixture.files.pdf, contentsFixture.files.image1],
        typeValue: contentsFixture.materialTypes.artigo.value,
      });
      await materialsPage.submitRegisterModal();
      uploadResponse = await uploadResponsePromise;
      successToastWasShown = await successToastPromise;
    });

    await test.step('Then the system should reject mixed PDF and image uploads', async () => {
      const contentWasCreated = Boolean(await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }).catch(() => null));
      expect(contentWasCreated, 'O sistema nao deveria criar conteudo quando PDF e imagem sao enviados juntos.').toBeFalsy();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      expect(successToastWasShown,'O sistema nao deveria exibir mensagem de sucesso quando o upload com PDF e imagem falha.',).toBeFalsy();
      expect(uploadResponse.status()).toBe(400);
    });
  });

  test('CONT-017 - cadastrar conteudo com arquivo acima de 2 MB', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Oversized');
    await reloadMaterialsPage();
    await materialsPage.selectSubjectFilter(primarySubject.name);
        let uploadResponse;
    let successToastWasShown = false;

    await test.step('Given that the content register modal is open with a valid topic available', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user tries to register a content with an oversized file', async () => {
      const uploadResponsePromise = materialsPage.page.waitForResponse((response) =>
        response.url().includes('/material/cadastrarDocumento') && response.request().method() === 'POST',
      { timeout: 15000 }).catch(() => null);
      const successToastPromise = materialsPage.page
        .getByText(contentsFixture.messages.uploadSuccess, { exact: false })
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      await materialsPage.fillRegisterForm({
        topicName: topic.name,
        filePaths: [contentsFixture.files.oversizedImage],
        typeValue: contentsFixture.materialTypes.prova.value,
      });
      await materialsPage.submitRegisterModal();
      [uploadResponse, successToastWasShown] = await Promise.all([
        uploadResponsePromise,
        successToastPromise,
      ]);
    });

    await test.step('Then the system should reject files larger than 2 MB', async () => {
      const contentWasCreated = Boolean(await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }).catch(() => null));
      expect(contentWasCreated, 'O sistema nao deveria criar conteudo com arquivo acima de 2 MB.').toBeFalsy();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      expect(successToastWasShown,'O sistema nao deveria exibir mensagem de sucesso quando o upload com arquivo acima de 2 MB falha.',).toBeFalsy();
      if (uploadResponse) {
        expect(uploadResponse.status()).toBe(400);
      }
    });

  });

  test('CONT-018 - cadastrar conteudo com formato de arquivo nao suportado', async () => {
    const topic = await createSupportTopic(primarySubject, 'Conteudo Unsupported');
    await reloadMaterialsPage();
    await materialsPage.selectSubjectFilter(primarySubject.name);
        let uploadResponse;
    let successToastWasShown = false;

    await test.step('Given that the content register modal is open with a valid topic available', async () => {
      await materialsPage.openRegisterModal();
      await expect(materialsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user tries to register a content with an unsupported file type', async () => {
      const uploadResponsePromise = materialsPage.page.waitForResponse((response) =>
        response.url().includes('/material/cadastrarDocumento') && response.request().method() === 'POST',
      );
      const successToastPromise = materialsPage.page
        .getByText(contentsFixture.messages.uploadSuccess, { exact: false })
        .waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      await materialsPage.fillRegisterForm({
        topicName: topic.name,
        filePaths: [contentsFixture.files.unsupported],
        typeValue: contentsFixture.materialTypes.outros.value,
      });
      await materialsPage.submitRegisterModal();
      uploadResponse = await uploadResponsePromise;
      successToastWasShown = await successToastPromise;
    });

    await test.step('Then the system should reject unsupported file formats', async () => {
      const contentWasCreated = Boolean(await apiFindMaterialByTopicAndSubject({
        subjectName: primarySubject.name,
        topicName: topic.name,
      }).catch(() => null));
      expect(contentWasCreated, 'O sistema nao deveria criar conteudo com formato de arquivo nao suportado.').toBeFalsy();
      await expect(materialsPage.registerModalHeading).toBeVisible();
      expect(
        successToastWasShown,'O sistema nao deveria exibir mensagem de sucesso quando o upload com formato nao suportado falha.',).toBeFalsy();
      expect(uploadResponse.status()).toBe(400);
    });
  });


  test('CONT-021 - cancelar cadastro de conteudo', async () => {
      const topic = await createSupportTopic(primarySubject, 'Conteudo Cancel');
      await reloadMaterialsPage();
      await materialsPage.selectSubjectFilter(primarySubject.name);
      
      await test.step('Given that the content register modal is open', async () => {
        await materialsPage.openRegisterModal();
        await expect(materialsPage.registerModalHeading).toBeVisible();
        await materialsPage.fillRegisterForm({
          topicName: topic.name,
          filePaths: [contentsFixture.files.image1],
          typeValue: contentsFixture.materialTypes.prova.value,
        });
      });

      await test.step('When the user cancels the content registration', async () => {
        await materialsPage.closeRegisterModal();
      });

      await test.step('Then the modal should be closed without creating a new content', async () => {
        await expect(materialsPage.registerModalHeading).toBeHidden();
        await expect(materialsPage.table).toBeVisible();
        await expect(materialsPage.page.getByText(contentsFixture.messages.uploadSuccess, { exact: false })).toHaveCount(0);
      });
    });

});









