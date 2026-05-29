const { test, expect } = require('../../fixtures/admin-auth.fixture');
const { LoginPage } = require('../../pages/login.page');
const { MaterialsPage } = require('../../pages/contents.page');
const { authFixture } = require('../../fixtures/auth.fixture');
const { subjectsFixture, buildTestSubject, buildAutoSubjectSuffix } = require('../../fixtures/subjects.fixture');
const { buildTestTopic } = require('../../fixtures/topics.fixture');
const { contentsFixture } = require('../../fixtures/contents.fixture');
const { ensureProtectedPageReady, getCookieValue } = require('../../utils/admin-session');

test.describe('Testes de Conteúdos', () => {
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
    expect(response.ok(), 'A listagem de tópicos de apoio deveria retornar sucesso.').toBeTruthy();
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
    expect(subjectModel, 'A disciplina de apoio deveria existir antes da criação do tópico.').toBeTruthy();

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

    expect(response.ok(), 'O cadastro do tópico de apoio deveria retornar sucesso.').toBeTruthy();
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
    await page.waitForTimeout(2500);
    await page.goto(authFixture.baseURL.replace('/login', '/'), { waitUntil: 'domcontentloaded' }).catch(() => null);
    await page.waitForTimeout(1500);
    await studentMaterialsPage.goto(contentsFixture.studentContentsURL);
    await studentMaterialsPage.waitForListReady();

    return { context, page, studentMaterialsPage };
  }

  async function apiListMaterials({ pageNumber = 1, pageSize = 100, subjectId = 0, topicId = 0, anyStatus = true } = {}, pageContext = materialsPage.page) {
    const response = await pageContext.request.get(
      `${contentsFixture.apiBaseURL}/material/ListarDocumentosWithPagination?page=${pageNumber}&pageSize=${pageSize}&idDisciplina=${subjectId}&idTopico=${topicId}&isAnyStatus=${anyStatus}`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );

    expect(response.ok(), 'A listagem de conteúdos pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindMaterialByTopicAndSubject(entry, pageContext = materialsPage.page) {
    for (let attempt = 1; attempt <= 8; attempt += 1) {
      const payload = await apiListMaterials({ pageNumber: 1, pageSize: 200 }, pageContext);
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
    await materialsPage.page.waitForTimeout(1000);

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

    await test.step('Then the upload should be submitted successfully', async () => {
      expect(createdContent.uploadResponse.status()).toBe(200);
      await expect(materialsPage.registerModalHeading).toBeHidden();
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

    await test.step('Then the upload should be submitted successfully', async () => {
      expect(createdContent.uploadResponse.status()).toBe(200);
      await expect(materialsPage.registerModalHeading).toBeHidden();
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

    await test.step('Then the upload should be submitted successfully', async () => {
      expect(createdContent.uploadResponse.status()).toBe(200);
      await expect(materialsPage.registerModalHeading).toBeHidden();
    });
  });


  
});
