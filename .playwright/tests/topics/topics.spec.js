const { test, expect } = require('../../fixtures/admin-auth.fixture');
const { LoginPage } = require('../../pages/login.page');
const { SubjectsPage } = require('../../pages/subjects.page');
const { TopicsPage } = require('../../pages/topics.page');
const { authFixture } = require('../../fixtures/auth.fixture');
const { subjectsFixture, buildTestSubject, buildAutoSubjectSuffix } = require('../../fixtures/subjects.fixture');
const { topicsFixture, buildTestTopic, buildTestForumResponse } = require('../../fixtures/topics.fixture');
const { loginThroughPortal, ensureProtectedPageReady, getCookieValue } = require('../../utils/admin-session');

test.describe('Testes de Topicos', () => {
  test.setTimeout(90000);

  let loginPage;
  let subjectsPage;
  let topicsPage;
  let adminUserId = null;
  let cachedAdminAuthToken = null;

  let primarySubject = null;
  let alternateSubject = null;
  let emptySubject = null;

  let createdTopic = null;
  let alternateTopic = null;
  let siblingTopic = null;

  const subjectCodesToCleanup = new Set();
  const topicsToCleanup = new Map();
  const responsesToCleanup = new Map();

  function topicKey(name, subjectName) {
    return `${subjectName}::${name}`;
  }

  function responseKey(text, topicName, subjectName) {
    return `${subjectName}::${topicName}::${text}`;
  }

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function buildUniqueSubjectCode(prefix) {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-6);
    return `${prefix}${suffix}`;
  }

  function registerTopicForCleanup(topic) {
    topicsToCleanup.set(topicKey(topic.name, topic.subjectName), {
      name: topic.name,
      subjectName: topic.subjectName,
    });
  }

  function unregisterTopicFromCleanup(topic) {
    topicsToCleanup.delete(topicKey(topic.name, topic.subjectName));
  }

  function registerResponseForCleanup(responseText, topic) {
    responsesToCleanup.set(responseKey(responseText, topic.name, topic.subjectName), {
      text: responseText,
      topicName: topic.name,
      subjectName: topic.subjectName,
    });
  }

  async function ensureSubjectsPageReady() {
    await ensureProtectedPageReady({
      loginPage,
      protectedPage: subjectsPage,
      protectedUrl: subjectsFixture.adminSubjectsURL,
      authFixture,
    });
  }

  async function ensureTopicsPageReady() {
    await ensureProtectedPageReady({
      loginPage,
      protectedPage: topicsPage,
      protectedUrl: topicsFixture.adminTopicsURL,
      authFixture,
    });
  }

  async function getAdminAuthHeaders(pageContext = topicsPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken')).catch(() => cachedAdminAuthToken);
    cachedAdminAuthToken = token ?? cachedAdminAuthToken;

    return {
      Authorization: `Bearer ${cachedAdminAuthToken}`,
      'x-api-key': topicsFixture.apiKey,
    };
  }
  async function getAdminUserIdFromToken(pageContext = topicsPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken'));
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'));
    return Number(payload.unique_name);
  }

  async function ensureAdminUserCookie(pageContext = topicsPage.page) {
    adminUserId = Number(await getCookieValue(pageContext, 'id-user')) || await getAdminUserIdFromToken(pageContext);

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

  async function apiGetAllTopics(pageContext = topicsPage.page) {
    const response = await pageContext.request.get(`${topicsFixture.apiBaseURL}/forum/listarTopicosDiscussao`, {
      headers: await getAdminAuthHeaders(pageContext),
    });

    expect(response.ok(), 'A consulta da lista de topicos pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindTopicByNameAndSubject(topic, pageContext = topicsPage.page) {
    for (let attempt = 1; attempt <= 8; attempt += 1) {
      const topics = await apiGetAllTopics(pageContext);
      const exactMatch = topics.find((item) =>
        item.nomeTopico === topic.name &&
        item.disciplina?.nomeDisciplina === topic.subjectName);

      if (exactMatch) {
        return exactMatch;
      }

      const sameNameMatches = topics.filter((item) => item.nomeTopico === topic.name);
      if (sameNameMatches.length === 1) {
        return sameNameMatches[0];
      }

      await pageContext.waitForTimeout(1000);
    }

    return undefined;
  }

  async function apiDeleteTopicById(topicId, pageContext = topicsPage.page) {
    return pageContext.request.delete(`${topicsFixture.apiBaseURL}/forum/deletarTopicoDiscussao?idTopicoDiscussao=${topicId}`, {
      headers: await getAdminAuthHeaders(pageContext),
    });
  }

  async function apiCreateForumResponse(topicId, responseText, pageContext = topicsPage.page) {
    const response = await pageContext.request.post(`${topicsFixture.apiBaseURL}/forum/cadastrarRespostaForum`, {
      headers: {
        ...(await getAdminAuthHeaders(pageContext)),
        'Content-Type': 'application/json',
      },
      data: {
        resposta: responseText,
        dataResposta: todayIsoDate(),
        topicoDiscussao: topicId,
        usuario: Number(adminUserId),
      },
    });

    expect(response.ok(), 'O cadastro da resposta vinculada ao topico deveria retornar sucesso.').toBeTruthy();
  }

  async function apiListResponsesByTopic(topicId, pageContext = topicsPage.page) {
    const response = await pageContext.request.get(
      `${topicsFixture.apiBaseURL}/forum/listarRespostasForumByDisciplinaOrTopico?page=1&pageSize=50&idDisciplina=0&idTopico=${topicId}`,
      {
        headers: await getAdminAuthHeaders(pageContext),
      },
    );

    expect(response.ok(), 'A listagem de respostas do forum deveria retornar sucesso.').toBeTruthy();
    const payload = await response.json();
    return payload.respostasForum ?? [];
  }

  async function apiDeleteResponseById(responseId, pageContext = topicsPage.page) {
    return pageContext.request.delete(
      `${topicsFixture.apiBaseURL}/forum/DeletarRespostaForum?idRespostaForum=${responseId}&idUsuario=${adminUserId}`,
      {
        headers: await getAdminAuthHeaders(pageContext),
      },
    );
  }

  async function apiGetAllSubjects(pageContext = topicsPage.page) {
    const response = await pageContext.request.get(
      `${topicsFixture.apiBaseURL}/disciplina/listarDisciplinas`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );

    expect(response.ok(), 'A consulta da lista de disciplinas pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindSubjectByCode(subject, pageContext = topicsPage.page) {
    for (let attempt = 1; attempt <= 6; attempt += 1) {
      const subjects = await apiGetAllSubjects(pageContext);
      const matchedSubject = subjects.find((item) => item.codigoDisciplina === subject.code);

      if (matchedSubject) {
        return matchedSubject;
      }

      await pageContext.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => null);
    }

    return undefined;
  }

  async function apiDeleteSubjectById(subjectId, pageContext = topicsPage.page) {
    return pageContext.request.delete(
      `${topicsFixture.apiBaseURL}/disciplina/excluirDisciplina?disciplinaIdentifier=${subjectId}`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );
  }

  async function findSubjectRowAcrossPages(code) {
    await ensureSubjectsPageReady();
    const foundOnExpectedPage = await subjectsPage.openPageContainingSubject(code);
    if (foundOnExpectedPage) {
      return subjectsPage.getRowByCode(code);
    }

    return subjectsPage.getRowByCode(code);
  }

  async function assertSubjectVisibleOnList(subject) {
    for (let attempt = 1; attempt <= 6; attempt += 1) {
      const row = await findSubjectRowAcrossPages(subject.code);
      const visible = await row.isVisible().catch(() => false);

      if (visible) {
        await expect(row).toContainText(subject.name);
        return row;
      }

      await subjectsPage.waitForTableData();
    }

    const row = await findSubjectRowAcrossPages(subject.code);
    await expect(row).toBeVisible();
    return row;
  }

  async function createSubjectIfMissing(subject) {
    const existingSubject = await apiFindSubjectByCode(subject);
    if (existingSubject) {
      return;
    }

    await ensureSubjectsPageReady();
    await subjectsPage.openRegisterModal();
    await expect(subjectsPage.registerModalHeading).toBeVisible();
    await subjectsPage.fillRegisterForm(subject);
    const refreshedListPromise = subjectsPage.waitForSubjectsListResponse();
    await subjectsPage.submitRegisterModal();
    await subjectsPage.waitForRegisterModalClosed();
    await refreshedListPromise;
    await subjectsPage.waitForTableData();
    subjectCodesToCleanup.add(subject.code);
    await expect(subjectsPage.registerModalHeading).toBeHidden();
    const createdSubject = await apiFindSubjectByCode(subject);
    expect(createdSubject, 'A disciplina de apoio deveria existir antes de criar topicos pela UI.').toBeTruthy();
  }

  async function ensureTestSubjectsCreated() {
    if (primarySubject && alternateSubject && emptySubject) {
      return;
    }

    primarySubject = buildTestSubject({
      code: buildUniqueSubjectCode('RUS'),
      name: `[AUTO] Disciplina Topico ${buildAutoSubjectSuffix()}`,
      professor: `Professor Topic A ${buildAutoSubjectSuffix()}`,
      studentsCount: '50',
      course: subjectsFixture.courses.software.value,
      courseLabel: subjectsFixture.courses.software.label,
    });

    alternateSubject = buildTestSubject({
      code: buildUniqueSubjectCode('RUS'),
      name: `[AUTO] Disciplina Topico ${buildAutoSubjectSuffix()}`,
      professor: `Professor Topic B ${buildAutoSubjectSuffix()}`,
      studentsCount: '45',
      course: subjectsFixture.courses.civil.value,
      courseLabel: subjectsFixture.courses.civil.label,
    });

    emptySubject = buildTestSubject({
      code: buildUniqueSubjectCode('RUS'),
      name: `[AUTO] Disciplina Filtro ${buildAutoSubjectSuffix()}`,
      professor: `Professor Topic Empty ${buildAutoSubjectSuffix()}`,
      studentsCount: '50',
      course: subjectsFixture.courses.software.value,
      courseLabel: subjectsFixture.courses.software.label,
    });

    await createSubjectIfMissing(primarySubject);
    await createSubjectIfMissing(alternateSubject);
    await createSubjectIfMissing(emptySubject);
    await ensureTopicsPageReady();
  }

  async function ensurePrimarySubjectCreated() {
    if (primarySubject) {
      return;
    }
    primarySubject = buildTestSubject({
      code: buildUniqueSubjectCode('RUS'),
      name: `[AUTO] Disciplina Topico ${buildAutoSubjectSuffix()}`,
      professor: `Professor Topic A ${buildAutoSubjectSuffix()}`,
      studentsCount: '50',
      course: subjectsFixture.courses.software.value,
      courseLabel: subjectsFixture.courses.software.label,
    });

    await createSubjectIfMissing(primarySubject);
    await ensureTopicsPageReady();
  }

  async function findTopicRowAcrossPages(topic) {
    await topicsPage.goToLastPage();

    return topicsPage.getRowByTopicAndSubject(topic.name, topic.subjectName);
  }

  async function assertTopicVisibleOnList(topic) {
    await ensureTopicsPageReady();

    if (topic.subjectName) {
      await topicsPage.selectSubjectFilter(topic.subjectName);
    }

    for (let attempt = 1; attempt <= 7; attempt += 1) {
      const row = await findTopicRowAcrossPages(topic);
      const visible = await row.isVisible().catch(() => false);

      if (visible) {
        await expect(row).toContainText(topic.name);
        await expect(row).toContainText(topic.subjectName);
        return row;
      }

      await topicsPage.waitForTableData();
    }

    const row = await findTopicRowAcrossPages(topic);
    await expect(row).toBeVisible();
    return row;
  }

  async function createTopicViaUi(topic) {
    await ensureTopicsPageReady();
    await topicsPage.openRegisterModal();
    await expect(topicsPage.registerModalHeading).toBeVisible();
    await topicsPage.fillTopicName(topic.name);
    await topicsPage.selectModalSubject(topic.subjectName);
    await topicsPage.submitRegisterModal();
    await topicsPage.waitForRegisterModalClosed();
    registerTopicForCleanup(topic);
  }

  async function createAndAssertTopic(topic) {
    await createTopicViaUi(topic);
    await expect(topicsPage.registerModalHeading).toBeHidden();
    await assertTopicVisibleOnList(topic);
  }

  async function assertTopicRegisterBlocked() {
    await expect(topicsPage.inlineAlert).toBeVisible();
    const alertText = await topicsPage.inlineAlert.innerText();
    expect([
      topicsFixture.messages.duplicateTopic,
      topicsFixture.messages.registerFallbackError,
    ]).toContain(alertText.trim());
    await expect(topicsPage.registerModalHeading).toBeVisible();
  }

  async function ensureAlternateTopicCreated() {
    if (alternateTopic) {
      return;
    }

    alternateTopic = buildTestTopic({
      name: `Topico Alt ${Date.now().toString().slice(-5)}`,
      subjectName: alternateSubject.name,
    });

    await createAndAssertTopic(alternateTopic);
  }

  async function ensureSiblingTopicCreated() {
    if (siblingTopic) {
      return;
    }

    siblingTopic = buildTestTopic({
      name: `Topico irmao ${Date.now().toString().slice(-5)}`,
      subjectName: primarySubject.name,
    });

    await createAndAssertTopic(siblingTopic);
  }

  async function createLinkedForumResponseScenario(topic, responseText) {
    await createAndAssertTopic(topic);
    const createdTopicModel = await apiFindTopicByNameAndSubject(topic);
    expect(createdTopicModel, 'O topico dependente deveria existir antes de vincular uma resposta.').toBeTruthy();
    await apiCreateForumResponse(createdTopicModel.idTopico, responseText);
    registerResponseForCleanup(responseText, topic);
  }

  async function attemptDeleteLinkedTopic(topic) {
    await topicsPage.selectSubjectFilter(topic.subjectName);
    await topicsPage.openDeletePopupByTopicName(topic.name, topic.subjectName);
    await expect(topicsPage.deleteModalHeading).toBeVisible();
    await topicsPage.confirmDeletePopup();
    await topicsPage.waitForDeletePopupClosed();
  }

  async function cleanupCreatedData(pageContext = topicsPage.page) {
    if (subjectCodesToCleanup.size === 0 && topicsToCleanup.size === 0 && responsesToCleanup.size === 0) {
      primarySubject = null;
      alternateSubject = null;
      emptySubject = null;
      createdTopic = null;
      alternateTopic = null;
      siblingTopic = null;
      return;
    }

    adminUserId = Number(await getCookieValue(pageContext, 'id-user')) || adminUserId;

    const topicsList = await apiGetAllTopics(pageContext);

    for (const responseData of responsesToCleanup.values()) {
      const relatedTopic = topicsList.find((topic) =>
        topic.nomeTopico === responseData.topicName &&
        (!topic.disciplina || topic.disciplina?.nomeDisciplina === responseData.subjectName));

      if (!relatedTopic) {
        continue;
      }

      const responses = await apiListResponsesByTopic(relatedTopic.idTopico, pageContext);
      const relatedResponse = responses.find((response) => response.resposta === responseData.text);

      if (!relatedResponse) {
        responsesToCleanup.delete(responseKey(responseData.text, responseData.topicName, responseData.subjectName));
        continue;
      }

      await apiDeleteResponseById(relatedResponse.idResposta, pageContext);
      responsesToCleanup.delete(responseKey(responseData.text, responseData.topicName, responseData.subjectName));
    }

    const refreshedTopics = await apiGetAllTopics(pageContext);
    for (const topicData of topicsToCleanup.values()) {
      const relatedTopic = refreshedTopics.find((topic) =>
        topic.nomeTopico === topicData.name &&
        (!topic.disciplina || topic.disciplina?.nomeDisciplina === topicData.subjectName));

      if (!relatedTopic) {
        topicsToCleanup.delete(topicKey(topicData.name, topicData.subjectName));
        continue;
      }

      await apiDeleteTopicById(relatedTopic.idTopico, pageContext);
      topicsToCleanup.delete(topicKey(topicData.name, topicData.subjectName));
    }

    for (const code of [...subjectCodesToCleanup]) {
      const subject = await apiFindSubjectByCode({ code }, pageContext);
      if (!subject) {
        subjectCodesToCleanup.delete(code);
        continue;
      }

      await apiDeleteSubjectById(subject.idDisciplina, pageContext);
      subjectCodesToCleanup.delete(code);
    }

    primarySubject = null;
    alternateSubject = null;
    emptySubject = null;
    createdTopic = null;
    alternateTopic = null;
    siblingTopic = null;
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    subjectsPage = new SubjectsPage(page);
    topicsPage = new TopicsPage(page);

    await ensureTopicsPageReady();
    await ensureAdminUserCookie();
  });

  test('TOP-001 - acessar tela de topicos', async () => {
    await test.step('Given that the admin user is on the initial admin page', async () => {
      await topicsPage.goto(authFixture.adminURL);
    });

    await test.step('When the user clicks the topics option in the sidebar', async () => {
      await topicsPage.openFromSidebar();
    });

    await test.step('Then the topics screen should be displayed with listing, filter and actions', async () => {
      await expect(topicsPage.heading).toBeVisible();
      await expect(topicsPage.table).toBeVisible();
      await expect(topicsPage.filterButton).toBeVisible();
      await expect(topicsPage.registerTopicButton).toBeVisible();
    });
  });

  test('TOP-002 - abrir modal de cadastro de topico', async () => {
    await test.step('Given that the admin user is on the topics page', async () => {
      await expect(topicsPage.heading).toBeVisible();
    });

    await test.step('When the user opens the register topic modal', async () => {
      await topicsPage.openRegisterModal();
    });

    await test.step('Then the register topic modal should be displayed', async () => {
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });
  });

  test('TOP-003 - paginacao de topicos', async () => {
    await test.step('Given that the admin user is authenticated on the topics page', async () => {
      await expect(topicsPage.heading).toBeVisible();
      await expect(topicsPage.table).toBeVisible();
    });

    await test.step('When the first page is loaded and the user navigates to another available page', async () => {
      expect(await topicsPage.getVisibleRowsCount()).toBeGreaterThan(0);

      const paginationCount = await topicsPage.paginationButtons.count();
      if (paginationCount > 1) {
        await topicsPage.goToPage(2);
      }
    });

    await test.step('Then the system should keep the topics list paginated and populated', async () => {
      await expect(topicsPage.table).toBeVisible();
      expect(await topicsPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('TOP-004 - fechar modal de cadastro pelo botao cancelar', async () => {
    await test.step('Given that the register topic modal is open', async () => {
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user cancels the register modal', async () => {
      await topicsPage.closeRegisterModal();
    });

    await test.step('Then the modal should be closed without creating a new topic', async () => {
      await expect(topicsPage.registerModalHeading).toBeHidden();
      await expect(topicsPage.table).toBeVisible();
    });
  });

  test('TOP-005 - cadastrar topico com dados validos', async () => {
    await test.step('Given that there is a test subject available and the register topic modal is open', async () => {
      await ensurePrimarySubjectCreated();
      createdTopic = buildTestTopic({
        name: `Topico automação ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the topic form with valid data and submits it', async () => {
      await topicsPage.fillTopicName(createdTopic.name);
      await topicsPage.selectModalSubject(createdTopic.subjectName);
      await topicsPage.submitRegisterModal();
      await topicsPage.waitForRegisterModalClosed();
      registerTopicForCleanup(createdTopic);
    });

    await test.step('Then the topic should be created and displayed in the listing', async () => {
      await expect(topicsPage.registerModalHeading).toBeHidden();
      await assertTopicVisibleOnList(createdTopic);
    });
  });

  test('TOP-006 - cadastro com nome do topico vazio', async () => {
    await test.step('Given that the register topic modal is open', async () => {
      await ensureTestSubjectsCreated();
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without filling the topic name', async () => {
      await topicsPage.selectModalSubject(primarySubject.name);
      await topicsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for topic name', async () => {
      await expect(topicsPage.page.getByText(topicsFixture.messages.requiredName, { exact: true })).toBeVisible();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });
  });

  test('TOP-007 - cadastro com disciplina nao selecionada', async () => {
    await test.step('Given that the register topic modal is open', async () => {
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the form without selecting the subject', async () => {
      await topicsPage.fillTopicName(`Sem Disciplina ${Date.now().toString().slice(-4)}`);
      await topicsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required validation message for subject', async () => {
      await expect(topicsPage.page.getByText(topicsFixture.messages.requiredSubject, { exact: true })).toBeVisible();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });
  });

  test('TOP-008 - cadastro com nome do topico contendo apenas espacos', async () => {

    await test.step('Given that the register topic modal is open', async () => {
      await ensureTestSubjectsCreated();
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills the topic name with only spaces and submits the form', async () => {
      await topicsPage.fillTopicName('   ');
      await topicsPage.selectModalSubject(primarySubject.name);
      await topicsPage.submitRegisterModal();
    });

    await test.step('Then the system should block the form and display the topic name validation message', async () => {
      await expect(topicsPage.page.getByText(topicsFixture.messages.requiredName, { exact: true })).toBeVisible();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });
  });

  test('TOP-009 - cadastro de topico duplicado na mesma disciplina', async () => {
    await test.step('Given that a topic with the same name already exists in the same subject', async () => {
      await ensurePrimarySubjectCreated();
      createdTopic = buildTestTopic({
        name: `Topico Duplicado ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(createdTopic);
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits another topic with the same name in the same subject', async () => {
      await topicsPage.fillTopicName(createdTopic.name);
      await topicsPage.selectModalSubject(primarySubject.name);
      await topicsPage.submitRegisterModal();
      await expect(topicsPage.inlineAlert).toBeVisible();
    });

    await test.step('Then the system should display the duplicate topic message and keep the modal open', async () => {
      await assertTopicRegisterBlocked();
    });
  });

  test('TOP-010 - cadastro de topico com nome ja existente em disciplina diferente', async () => {
    let crossSubjectTopic;

    await test.step('Given that there is already a topic with this name in another subject', async () => {
      await ensureTestSubjectsCreated();
      createdTopic = buildTestTopic({
        name: `Topico Duplicado ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(createdTopic);
      crossSubjectTopic = buildTestTopic({
        name: createdTopic.name,
        subjectName: alternateSubject.name,
      });
      await topicsPage.openRegisterModal();
      await expect(topicsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits the same topic name under a different subject', async () => {
      await topicsPage.fillTopicName(crossSubjectTopic.name);
      await topicsPage.selectModalSubject(crossSubjectTopic.subjectName);
      await topicsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the generic register error and keep the modal open', async () => {
      await assertTopicRegisterBlocked();
    });
  });

  test('TOP-011 - atualizacao da listagem apos cadastro', async () => {
    let listedTopic;

    await test.step('Given that a valid topic was created for this scenario', async () => {
      await ensurePrimarySubjectCreated();
      listedTopic = buildTestTopic({
        name: `Topico Listagem ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(listedTopic);
    });

    await test.step('When the admin opens the listing filtered by the created subject', async () => {
      await topicsPage.selectSubjectFilter(listedTopic.subjectName);
      await topicsPage.goToLastPage();
    });

    await test.step('Then the created topic should appear in the topics listing', async () => {
      await assertTopicVisibleOnList(listedTopic);
    });
  });

  test('TOP-012 - aplicar filtro todas as disciplinas', async () => {
    await test.step('Given that the topics listing is loaded and a filter can be applied', async () => {
      await expect(topicsPage.heading).toBeVisible();
    });

    await test.step('When the user selects the all subjects option in the filter', async () => {
      await topicsPage.selectSubjectFilter(topicsFixture.filters.all);
    });

    await test.step('Then the listing should display the general topics list', async () => {
      expect(await topicsPage.getFilterLabel()).toContain(topicsFixture.filters.all);
      expect(await topicsPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('TOP-013 - filtrar topicos por disciplina com resultado', async () => {
    let filteredTopic;

    await test.step('Given that the topics listing contains at least one topic for the primary subject', async () => {
      await ensurePrimarySubjectCreated();
      filteredTopic = buildTestTopic({
        name: `Topico Filtro ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(filteredTopic);
    });

    await test.step('When the user filters the listing by the primary subject', async () => {
      await topicsPage.selectSubjectFilter(filteredTopic.subjectName);
    });

    await test.step('Then the system should display only topics linked to the selected subject', async () => {
      expect(await topicsPage.getFilterLabel()).toContain(filteredTopic.subjectName);
      expect(await topicsPage.getVisibleRowsCount()).toBeGreaterThan(0);
      const subjectTexts = await topicsPage.getColumnTexts(1);
      subjectTexts.forEach((text) => {
        expect(text).toContain(filteredTopic.subjectName);
      });
    });
  });

  test('TOP-014 - filtrar topicos por disciplina sem resultado', async () => {
    let emptyFilterSubject;

    await test.step('Given that there is a support subject without registered topics', async () => {
      emptyFilterSubject = buildTestSubject({
        code: buildUniqueSubjectCode('RUS'),
        name: `[AUTO] Disciplina Filtro ${buildAutoSubjectSuffix()}`,
        professor: `Professor Topic Empty ${buildAutoSubjectSuffix()}`,
        studentsCount: '50',
        course: subjectsFixture.courses.software.value,
        courseLabel: subjectsFixture.courses.software.label,
      });
      await createSubjectIfMissing(emptyFilterSubject);
      await ensureTopicsPageReady();
    });

    await test.step('When the user filters the listing by the empty subject', async () => {
      await topicsPage.selectSubjectFilter(emptyFilterSubject.name);
    });

    await test.step('Then the system should keep the listing empty for that subject', async () => {
      expect(await topicsPage.getFilterLabel()).toContain(emptyFilterSubject.name);
      await expect(topicsPage.page.getByText('Nenhum registro encontrado!', { exact: true })).toBeVisible();
    });
  });

  test('TOP-015 - trocar de uma disciplina filtrada para outra', async () => {
    let firstFilterTopics = [];
    let firstTopic;
    let secondTopic;

    await test.step('Given that there are topics available in more than one support subject', async () => {
      await ensureTestSubjectsCreated();
      firstTopic = buildTestTopic({
        name: `Topico Primeiro Filtro ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      secondTopic = buildTestTopic({
        name: `Topico Segundo Filtro ${Date.now().toString().slice(-5)}`,
        subjectName: alternateSubject.name,
      });
      await createAndAssertTopic(firstTopic);
      await createAndAssertTopic(secondTopic);
    });

    await test.step('When the user filters first by the primary subject and then by the alternate subject', async () => {
      await topicsPage.selectSubjectFilter(firstTopic.subjectName);
      firstFilterTopics = await topicsPage.getColumnTexts(0);
      await topicsPage.selectSubjectFilter(secondTopic.subjectName);
    });

    await test.step('Then the listing should update to reflect the last selected subject', async () => {
      expect(await topicsPage.getFilterLabel()).toContain(secondTopic.subjectName);
      const secondFilterTopics = await topicsPage.getColumnTexts(0);
      const subjectTexts = await topicsPage.getColumnTexts(1);
      subjectTexts.forEach((text) => {
        expect(text).toContain(secondTopic.subjectName);
      });
      expect.soft(JSON.stringify(secondFilterTopics), 'A troca entre disciplinas deveria atualizar a listagem de topicos.').not.toBe(JSON.stringify(firstFilterTopics));
    });
  });

  test('TOP-016 - editar topico com dados validos', async () => {
    let topicToEdit;
    let editedTopic;

    await test.step('Given that the admin opens the edit modal for the created topic', async () => {
      await ensurePrimarySubjectCreated();
      topicToEdit = buildTestTopic({
        name: `Topico Editar ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(topicToEdit);
      editedTopic = {
        ...topicToEdit,
        name: `${topicToEdit.name} Editado`,
      };
      await topicsPage.openEditTopicByName(topicToEdit.name, topicToEdit.subjectName);
      await expect(topicsPage.editModalHeading).toBeVisible();
    });

    await test.step('When the admin updates the topic name with valid data and saves the modal', async () => {
      await topicsPage.fillTopicName(editedTopic.name);
      await topicsPage.saveEditModal();
      await topicsPage.waitForEditModalClosed();
    });

    await test.step('Then the updated topic should appear in the listing with the new values', async () => {
      unregisterTopicFromCleanup(topicToEdit);
      registerTopicForCleanup(editedTopic);
      await expect(topicsPage.editModalHeading).toBeHidden();
      await assertTopicVisibleOnList(editedTopic);
    });
  });

  test('TOP-017 - editar topico deixando nome vazio', async () => {
    let topicToEdit;

    await test.step('Given that the edit modal is open for the created topic', async () => {
      await ensurePrimarySubjectCreated();
      topicToEdit = buildTestTopic({
        name: `Tópico Nome Obrigatorio ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(topicToEdit);
      await topicsPage.openEditTopicByName(topicToEdit.name, topicToEdit.subjectName);
      await expect(topicsPage.editModalHeading).toBeVisible();
    });

    await test.step('When the user clears the topic name and tries to save the modal', async () => {
      await topicsPage.clearTopicName();
      await topicsPage.saveEditModal();
    });

    await test.step('Then the system should display the required validation message and keep the modal open', async () => {
      await expect(topicsPage.page.getByText(topicsFixture.messages.requiredName, { exact: true })).toBeVisible();
      await expect(topicsPage.editModalHeading).toBeVisible();
      await topicsPage.closeEditModal();
    });
  });

  test('TOP-018 - editar topico para nome duplicado na mesma disciplina', async () => {
    let topicToEdit;
    let duplicateTopic;

    await test.step('Given that another topic exists in the same subject to create a duplicate conflict', async () => {
      await ensurePrimarySubjectCreated();
      topicToEdit = buildTestTopic({
        name: `Tópico Editar Base ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      duplicateTopic = buildTestTopic({
        name: `Tópico Editar Duplicado ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(topicToEdit);
      await createAndAssertTopic(duplicateTopic);
      await topicsPage.openEditTopicByName(topicToEdit.name, topicToEdit.subjectName);
      await expect(topicsPage.editModalHeading).toBeVisible();
    });

    await test.step('When the user tries to save the edited topic with the duplicate sibling name', async () => {
      await topicsPage.fillTopicName(duplicateTopic.name);
      await topicsPage.saveEditModal();
      await expect(topicsPage.inlineAlert).toBeVisible();
    });

    await test.step('Then the system should display the duplicate topic message and keep the edit modal open', async () => {
      await expect(topicsPage.inlineAlert).toBeVisible();
      await expect(topicsPage.inlineAlert).toContainText(topicsFixture.messages.duplicateTopic);
      await expect(topicsPage.editModalHeading).toBeVisible();
      await topicsPage.closeEditModal();
    });
  });

  test('TOP-019 - excluir topico existente', async () => {
    let disposableTopic;

    await test.step('Given that a disposable topic exists for deletion', async () => {
      await ensurePrimarySubjectCreated();
      disposableTopic = buildTestTopic({
        name: `Tópico Delete ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(disposableTopic);
      await topicsPage.openDeletePopupByTopicName(disposableTopic.name, disposableTopic.subjectName);
      await expect(topicsPage.deleteModalHeading).toBeVisible();
    });

    await test.step('When the user confirms the deletion', async () => {
      await topicsPage.confirmDeletePopup();
      await topicsPage.waitForDeletePopupClosed();
      await topicsPage.waitForTableData();
    });

    await test.step('Then the deleted topic should no longer appear in the listing', async () => {
      unregisterTopicFromCleanup(disposableTopic);
      await topicsPage.selectSubjectFilter(disposableTopic.subjectName);
      const row = await findTopicRowAcrossPages(disposableTopic);
      await expect(row).toHaveCount(0);
    });
  });

  test('TOP-020 - cancelar exclusao de topico', async () => {
    let topicToKeep;

    await test.step('Given that the delete confirmation popup is open for the created topic', async () => {
      await ensurePrimarySubjectCreated();
      topicToKeep = buildTestTopic({
        name: `Tópico Cancelar Exclusao ${Date.now().toString().slice(-5)}`,
        subjectName: primarySubject.name,
      });
      await createAndAssertTopic(topicToKeep);
      await topicsPage.openDeletePopupByTopicName(topicToKeep.name, topicToKeep.subjectName);
      await expect(topicsPage.deleteModalHeading).toBeVisible();
    });

    await test.step('When the user cancels the deletion', async () => {
      await expect(topicsPage.page.getByText(topicsFixture.messages.deleteConfirmationText, { exact: false })).toBeVisible();
      await expect(topicsPage.page.getByText(topicsFixture.messages.irreversibleAction, { exact: false })).toBeVisible();
      await topicsPage.cancelDeletePopup();
    });

    await test.step('Then the topic should remain visible in the listing without changes', async () => {
      await expect(topicsPage.deleteModalHeading).toBeHidden();
      await assertTopicVisibleOnList(topicToKeep);
    });
  });

  test('TOP-021 - excluir topico vinculado a conteudos ou respostas', async () => {
    let dependentTopic;
    const linkedResponse = buildTestForumResponse();
    await test.step('Given that a topic exists with a linked forum response', async () => {
      const dependentSubject = buildTestSubject({
        code: buildUniqueSubjectCode('RUS'),
        name: `[AUTO] Disciplina Dependencia ${buildAutoSubjectSuffix()}`,
        professor: `Professor Topico Vinculado ${buildAutoSubjectSuffix()}`,
        studentsCount: '50',
        course: subjectsFixture.courses.software.value,
        courseLabel: subjectsFixture.courses.software.label,
      });

      await createSubjectIfMissing(dependentSubject);
      dependentTopic = buildTestTopic({
        name: `Topico Vinculado ${Date.now().toString().slice(-5)}`,
        subjectName: dependentSubject.name,
      });
      await createLinkedForumResponseScenario(dependentTopic, linkedResponse.text);
    });

    await test.step('When the user tries to delete the linked topic', async () => {
      await attemptDeleteLinkedTopic(dependentTopic);
    });

    await test.step('Then the system should keep the topic in the listing because of the dependency', async () => {
      await assertTopicVisibleOnList(dependentTopic);
    });
  });

});

