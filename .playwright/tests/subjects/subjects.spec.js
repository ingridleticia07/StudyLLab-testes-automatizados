const { test, expect } = require('../../fixtures/admin-auth.fixture');
const { LoginPage } = require('../../pages/login.page');
const { SubjectsPage } = require('../../pages/subjects.page');
const { TopicsPage } = require('../../pages/topics.page');
const { authFixture } = require('../../fixtures/auth.fixture');
const { subjectsFixture, buildTestSubject, buildAutoSubjectSuffix } = require('../../fixtures/subjects.fixture');
const { topicsFixture, buildTestTopic } = require('../../fixtures/topics.fixture');
const { loginThroughPortal, ensureProtectedPageReady } = require('../../utils/admin-session');

test.describe('Testes de Disciplinas', () => {
  test.setTimeout(90000);

  let loginPage;
  let subjectsPage;
  let topicsPage;
  let cachedAdminAuthToken = null;
  let createdSubject = null;
  let duplicateBaseSubject = null;
  let duplicateSubject = null;
  const subjectsToCleanup = new Set();

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

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function normalizeText(value = '') {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  async function getAdminAuthHeaders(pageContext = subjectsPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken')).catch(() => cachedAdminAuthToken);
    cachedAdminAuthToken = token ?? cachedAdminAuthToken;

    return {
      Authorization: `Bearer ${cachedAdminAuthToken}`,
      'x-api-key': topicsFixture.apiKey,
    };
  }

  async function getAdminUserId(pageContext = subjectsPage.page) {
    const token = await pageContext.evaluate(() => window.sessionStorage.getItem('authToken'));
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'));
    return Number(payload.unique_name);
  }

  async function apiGetAllSubjects(pageContext = subjectsPage.page) {
    const response = await pageContext.request.get(
      `${topicsFixture.apiBaseURL}/disciplina/listarDisciplinas`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );

    expect(response.ok(), 'A consulta da lista de disciplinas pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindSubjectByCode(subject, pageContext = subjectsPage.page) {
    const subjects = await apiGetAllSubjects(pageContext);
    return subjects.find((item) => item.codigoDisciplina === subject.code);
  }

  async function apiCreateDependentTopic(subject, topic, pageContext = subjectsPage.page) {
    const createdSubjectModel = await apiFindSubjectByCode(subject, pageContext);
    expect(createdSubjectModel, 'A disciplina dependente deveria existir antes de criar o topico.').toBeTruthy();

    const adminUserId = await getAdminUserId(pageContext);
    expect(adminUserId, 'O id do usuario admin deveria estar disponivel para criar o topico dependente.').toBeTruthy();
    const response = await pageContext.request.post(
      `${topicsFixture.apiBaseURL}/forum/criarTopicoDiscussao`,
      {
        headers: {
          ...(await getAdminAuthHeaders(pageContext)),
          'Content-Type': 'application/json',
        },
        data: {
          nomeTopico: topic.name,
          dataTopico: todayIsoDate(),
          disciplina: createdSubjectModel.idDisciplina,
          idUsuario: adminUserId,
        },
      },
    );

    const responseBody = await response.text();
    expect(
      response.ok(),
      `O cadastro do topico dependente pela API deveria retornar sucesso. Status ${response.status()}: ${responseBody}`,
    ).toBeTruthy();
  }

  async function apiGetAllTopics(pageContext = subjectsPage.page) {
    const response = await pageContext.request.get(
      `${topicsFixture.apiBaseURL}/forum/listarTopicosDiscussao`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );

    expect(response.ok(), 'A consulta da lista de topicos pela API deveria retornar sucesso.').toBeTruthy();
    return response.json();
  }

  async function apiFindTopicByNameAndSubject(topic, pageContext = subjectsPage.page) {
    const topics = await apiGetAllTopics(pageContext);
    return topics.find((item) =>
      item.nomeTopico === topic.name &&
      item.disciplina?.nomeDisciplina === topic.subjectName);
  }

  async function apiDeleteTopicById(topicId, pageContext = subjectsPage.page) {
    const response = await pageContext.request.delete(
      `${topicsFixture.apiBaseURL}/forum/deletarTopicoDiscussao?idTopicoDiscussao=${topicId}`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );

    expect(response.ok(), 'A exclusao do topico dependente pela API deveria retornar sucesso.').toBeTruthy();
  }

  async function apiDeleteSubjectById(subjectId, pageContext = subjectsPage.page) {
    return pageContext.request.delete(
      `${topicsFixture.apiBaseURL}/disciplina/excluirDisciplina?disciplinaIdentifier=${subjectId}`,
      { headers: await getAdminAuthHeaders(pageContext) },
    );
  }

  async function fillRegisterFormExcept(missingField, overrides = {}) {
    const subject = {
      ...buildTestSubject(),
      course: subjectsFixture.register.defaultCourse,
      professor: subjectsFixture.register.defaultProfessor,
      studentsCount: subjectsFixture.register.defaultStudentsCount,
      ...overrides,
    };

    if (missingField !== 'code') await subjectsPage.fillRegisterCode(subject.code);
    if (missingField !== 'name') await subjectsPage.fillRegisterName(subject.name);
    if (missingField !== 'professor') await subjectsPage.fillRegisterProfessor(subject.professor);
    if (missingField !== 'studentsCount') await subjectsPage.fillRegisterStudentsCount(subject.studentsCount);
    if (missingField !== 'course') await subjectsPage.selectRegisterCourse(subject.course);
  }

  function buildUniqueSubjectCode(prefix) {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-6);
    return `${prefix}${suffix}`;
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
    for (let attempt = 1; attempt <= 7; attempt += 1) {
      const row = await findSubjectRowAcrossPages(subject.code);
      const visible = await row.isVisible().catch(() => false);

      if (visible) {
        await expect(row).toContainText(subject.name);
        await expect(row).toContainText(subject.professor);
        const normalizedRowText = (await row.innerText())
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        const normalizedCourseLabel = subject.courseLabel
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        expect(normalizedRowText).toContain(normalizedCourseLabel);
        return row;
      }

      await subjectsPage.waitForTableData();
    }

    const row = await findSubjectRowAcrossPages(subject.code);
    await expect(row).toBeVisible();
    return row;
  }

  async function deleteSubjectByCodeIfExists(code) {
    const row = await findSubjectRowAcrossPages(code);
    const rowExists = await row.count();

    if (rowExists === 0) {
      return false;
    }

    const visible = await row.isVisible().catch(() => false);
    if (!visible) {
      return false;
    }

    await subjectsPage.openDeletePopupByCode(code);
    await expect(subjectsPage.deleteModalHeading).toBeVisible();
    await subjectsPage.confirmDeletePopup();
    await subjectsPage.waitForDeletePopupClosed();
    await subjectsPage.waitForTableData();
    return true;
  }

  async function registerSubject(subject) {
    await ensureSubjectsPageReady();
    await subjectsPage.openRegisterModal();
    await expect(subjectsPage.registerModalHeading).toBeVisible();
    await subjectsPage.fillRegisterForm(subject);
    const refreshedListPromise = subjectsPage.waitForSubjectsListResponse();
    await subjectsPage.submitRegisterModal();
    await subjectsPage.waitForRegisterModalClosed();
    await refreshedListPromise;
    await subjectsPage.waitForTableData();
    subjectsToCleanup.add(subject.code);
  }

  async function createAndAssertSubject(subject) {
    await registerSubject(subject);
    await expect(subjectsPage.registerModalHeading).toBeHidden();
    await assertSubjectVisibleOnList(subject);
  }

  async function ensureDuplicateBaseSubject() {
    if (duplicateBaseSubject) {
      return duplicateBaseSubject;
    }

    duplicateBaseSubject = buildTestSubject({
      code: buildUniqueSubjectCode('DUP'),
      name: `[AUTO] Disciplina Duplicidade ${buildAutoSubjectSuffix()}`,
      professor: subjectsFixture.register.defaultProfessor,
      course: subjectsFixture.courses.software.value,
      courseLabel: subjectsFixture.courses.software.label,
    });

    await createAndAssertSubject(duplicateBaseSubject);
    return duplicateBaseSubject;
  }

  async function ensureEditableSubject({ forceCreate = false } = {}) {
    if (createdSubject && !forceCreate) {
      return createdSubject;
    }

    createdSubject = buildTestSubject({
      code: buildUniqueSubjectCode('EDT'),
      name: `[AUTO] Disciplina Edição ${buildAutoSubjectSuffix()}`,
      professor: subjectsFixture.register.defaultProfessor,
      course: subjectsFixture.courses.production.value,
      courseLabel: subjectsFixture.courses.production.label,
    });

    await createAndAssertSubject(createdSubject);
    return createdSubject;
  }

  async function createDependentTopicForSubject(subject, topic) {
    await createAndAssertSubject(subject);
    await apiCreateDependentTopic(subject, topic);
  }

  async function attemptDeleteSubjectWithDependency(subject) {
    await ensureSubjectsPageReady();
    await assertSubjectVisibleOnList(subject);
    await subjectsPage.openDeletePopupByCode(subject.code);
    await expect(subjectsPage.deleteModalHeading).toBeVisible();
    const deleteResponsePromise = subjectsPage.page.waitForResponse((response) =>
      response.url().includes('/disciplina/excluirDisciplina?') &&
      response.request().method() === 'DELETE',
    );
    await subjectsPage.confirmDeletePopup();
    const deleteResponse = await deleteResponsePromise;
    expect(deleteResponse.ok(), 'A exclusao da disciplina vinculada deveria ser bloqueada.').toBeFalsy();
  }

  async function cleanupDependentSubjectScenario(subject, topic) {
    const dependentTopicModel = await apiFindTopicByNameAndSubject(topic);
    if (dependentTopicModel) {
      await apiDeleteTopicById(dependentTopicModel.idTopico);
    }
    const createdSubjectModel = await apiFindSubjectByCode(subject);
    if (createdSubjectModel) {
      await apiDeleteSubjectById(createdSubjectModel.idDisciplina);
    }
    subjectsToCleanup.delete(subject.code);
  }

  async function cleanupSubjects(pageContext = subjectsPage.page) {
    if (subjectsToCleanup.size === 0) {
      createdSubject = null;
      duplicateBaseSubject = null;
      duplicateSubject = null;
      return;
    }

    for (const code of [...subjectsToCleanup]) {
      const subjectModel = await apiFindSubjectByCode({ code }, pageContext).catch(() => null);
      if (!subjectModel?.idDisciplina) {
        subjectsToCleanup.delete(code);
        continue;
      }

      await apiDeleteSubjectById(subjectModel.idDisciplina, pageContext);
      subjectsToCleanup.delete(code);
    }

    createdSubject = null;
    duplicateBaseSubject = null;
    duplicateSubject = null;
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    subjectsPage = new SubjectsPage(page);
    topicsPage = new TopicsPage(page);

    await ensureSubjectsPageReady();
    await subjectsPage.selectCourseFilter(subjectsFixture.filters.all);
  });


});
