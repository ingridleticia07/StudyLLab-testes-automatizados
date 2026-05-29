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
      code: buildUniqueSubjectCode('TPA'),
      name: `[AUTO] Disciplina Topico ${buildAutoSubjectSuffix()}`,
      professor: `Professor Topic A ${buildAutoSubjectSuffix()}`,
      studentsCount: '50',
      course: subjectsFixture.courses.software.value,
      courseLabel: subjectsFixture.courses.software.label,
    });

    alternateSubject = buildTestSubject({
      code: buildUniqueSubjectCode('TPB'),
      name: `[AUTO] Disciplina Topico ${buildAutoSubjectSuffix()}`,
      professor: `Professor Topic B ${buildAutoSubjectSuffix()}`,
      studentsCount: '45',
      course: subjectsFixture.courses.civil.value,
      courseLabel: subjectsFixture.courses.civil.label,
    });

    emptySubject = buildTestSubject({
      code: buildUniqueSubjectCode('TPC'),
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
      code: buildUniqueSubjectCode('TPA'),
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


});

