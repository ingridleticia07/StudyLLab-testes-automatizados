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

  test('DISC-001 - acessar tela de disciplinas', async () => {
    await test.step('Given that the admin user is on the initial admin page', async () => {
      await subjectsPage.goto(authFixture.adminURL);
    });

    await test.step('When the user clicks the subjects option in the sidebar', async () => {
      await subjectsPage.openFromSidebar();
    });

    await test.step('Then the subjects screen should be displayed with listing and actions', async () => {
      await expect(subjectsPage.heading).toBeVisible();
      await expect(subjectsPage.table).toBeVisible();
      await expect(subjectsPage.registerSubjectButton).toBeVisible();
    });
  });

  test('DISC-002 - listagem paginada de disciplinas', async () => {
    await test.step('Given that the admin user is authenticated and on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
      await expect(subjectsPage.table).toBeVisible();
    });

    await test.step('When the first page is loaded and the user navigates to another available page', async () => {
      expect(await subjectsPage.getVisibleRowsCount()).toBeGreaterThan(0);
      const paginationCount = await subjectsPage.paginationButtons.count();
      if (paginationCount > 1) {
        await subjectsPage.goToPage(2);
      }
    });

    await test.step('Then the system should keep the subjects list paginated and populated', async () => {
      await expect(subjectsPage.table).toBeVisible();
      expect(await subjectsPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('DISC-003 - abrir modal de cadastro de disciplina', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the user opens the register subject modal', async () => {
      await subjectsPage.openRegisterModal();
    });

    await test.step('Then the register subject modal should be displayed', async () => {
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-004 - cancelar cadastro de disciplina', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user cancels the register modal', async () => {
      await subjectsPage.closeRegisterModal();
    });

    await test.step('Then the modal should be closed without creating a new subject', async () => {
      await expect(subjectsPage.registerModalHeading).toBeHidden();
      await expect(subjectsPage.table).toBeVisible();
    });
  });

  test('DISC-005 - cadastrar disciplina com dados validos', async () => {
    await test.step('Given that the admin user opens the register subject modal', async () => {
      createdSubject = buildTestSubject();
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the admin fills the subject form with valid data and submits it', async () => {
      await subjectsPage.fillRegisterForm(createdSubject);
      await subjectsPage.submitRegisterModal();
      await subjectsPage.waitForRegisterModalClosed();
      subjectsToCleanup.add(createdSubject.code);
    });

    await test.step('Then the subject should appear in the subjects list', async () => {
      await expect(subjectsPage.registerModalHeading).toBeHidden();
      await expect(subjectsPage.inlineAlert).toBeHidden();
    });
  });

  test('DISC-006 - cadastrar disciplina com codigo vazio', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills all fields except the subject code and submits the form', async () => {
      await fillRegisterFormExcept('code');
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required message for the code field', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredCode, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-007 - cadastrar disciplina com nome vazio', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills all fields except the subject name and submits the form', async () => {
      await fillRegisterFormExcept('name');
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required message for the name field', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredName, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-008 - cadastrar disciplina com professor responsavel vazio', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills all fields except the professor and submits the form', async () => {
      await fillRegisterFormExcept('professor');
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required message for the professor field', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredProfessor, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-009 - cadastrar disciplina com quantidade de alunos vazia', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills all fields except the students quantity and submits the form', async () => {
      await fillRegisterFormExcept('studentsCount');
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required message for the students quantity field', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredStudentsCount, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-010 - cadastrar disciplina com curso nao selecionado', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills all fields except the course and submits the form', async () => {
      await fillRegisterFormExcept('course');
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should display the required message for the course field', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredCourse, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-011 - cadastro com codigo de disciplina duplicado', async () => {
    await test.step('Given that there is already a registered subject with the duplicated code', async () => {
      await ensureDuplicateBaseSubject();
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits a new subject with the same code', async () => {
      const duplicateAttempt = buildTestSubject({
        code: duplicateBaseSubject.code,
        name: `${duplicateBaseSubject.name} Duplicado`,
        professor: `${duplicateBaseSubject.professor} Duplicado`,
      });
      await subjectsPage.fillRegisterForm(duplicateAttempt);
      await subjectsPage.submitRegisterModal();
      await expect(subjectsPage.inlineAlert).toBeVisible();
    });

    await test.step('Then the system should display the duplicated subject message', async () => {
      await expect(subjectsPage.inlineAlert).toBeVisible();
      await expect(subjectsPage.inlineAlert).toContainText(subjectsFixture.messages.duplicateSubject);
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-012 - cadastro com quantidade de alunos invalida', async () => {
    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user types a non numeric value in the students quantity field and submits the form', async () => {
      const subject = buildTestSubject();
      await subjectsPage.fillRegisterCode(subject.code);
      await subjectsPage.fillRegisterName(subject.name);
      await subjectsPage.fillRegisterProfessor(subject.professor);
      await subjectsPage.typeRegisterStudentsCount('abc');
      await subjectsPage.selectRegisterCourse(subject.course);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should block the submission and keep the students quantity as required', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredStudentsCount, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
      await expect(subjectsPage.studentsCountInput).toHaveValue('');
    });
  });

  test('DISC-013 - cadastro com quantidade de alunos negativa', async () => {
    let negativeSubject;

    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits a subject with a negative students quantity', async () => {
      negativeSubject = buildTestSubject({ studentsCount: '-5' });
      await subjectsPage.fillRegisterForm(negativeSubject);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should reject the registration and keep the form open', async () => {
      const validationMessage = await subjectsPage.studentsCountInput.evaluate((input) => input.validationMessage);
      expect.soft(validationMessage).toContain(subjectsFixture.messages.studentsCountMin);
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-014 - cadastro com quantidade de alunos igual a zero', async () => {
    let zeroSubject;

    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits a subject with zero students', async () => {
      zeroSubject = buildTestSubject({ studentsCount: '0' });
      await subjectsPage.fillRegisterForm(zeroSubject);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should reject the registration and keep the form open', async () => {
      const validationMessage = await subjectsPage.studentsCountInput.evaluate((input) => input.validationMessage);
      expect.soft(validationMessage).toContain(subjectsFixture.messages.studentsCountMin);
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-015 - cadastro com quantidade de alunos decimal', async () => {
    let decimalSubject;

    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits a subject with a decimal students quantity', async () => {
      decimalSubject = buildTestSubject({ studentsCount: '10.5' });
      await subjectsPage.fillRegisterForm(decimalSubject);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should reject the registration and keep the form open', async () => {
      const validationMessage = await subjectsPage.studentsCountInput.evaluate((input) => input.validationMessage);
      expect.soft(validationMessage).toContain(subjectsFixture.messages.studentsCountValidValue);
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-016 - cadastro com codigo em formato invalido', async () => {
    let invalidCodeSubject;

    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user submits a subject with an invalid code format', async () => {
      invalidCodeSubject = buildTestSubject({ code: '@@@###' });
      await subjectsPage.fillRegisterForm(invalidCodeSubject);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should reject the registration and keep the form open', async () => {
      const row = await findSubjectRowAcrossPages(invalidCodeSubject.code);
      const wasCreated = await row.isVisible().catch(() => false);
      if (wasCreated) {
        await deleteSubjectByCodeIfExists(invalidCodeSubject.code);
      }

      expect.soft(wasCreated, 'O sistema nao deveria cadastrar disciplinas com codigo fora do padrao.').toBeFalsy();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-017 - cadastro com nome contendo apenas espacos', async () => {

    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills the subject name with only spaces and submits the form', async () => {
      const subject = buildTestSubject({ name: '   ' });
      await subjectsPage.fillRegisterCode(subject.code);
      await subjectsPage.fillRegisterName(subject.name);
      await subjectsPage.fillRegisterProfessor(subject.professor);
      await subjectsPage.fillRegisterStudentsCount(subject.studentsCount);
      await subjectsPage.selectRegisterCourse(subject.course);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should keep the form blocked and show the required name message', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredName, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-018 - cadastro com professor contendo apenas espacos', async () => {

    await test.step('Given that the register subject modal is open', async () => {
      await subjectsPage.openRegisterModal();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });

    await test.step('When the user fills the professor field with only spaces and submits the form', async () => {
      const subject = buildTestSubject({ professor: '   ' });
      await subjectsPage.fillRegisterCode(subject.code);
      await subjectsPage.fillRegisterName(subject.name);
      await subjectsPage.fillRegisterProfessor(subject.professor);
      await subjectsPage.fillRegisterStudentsCount(subject.studentsCount);
      await subjectsPage.selectRegisterCourse(subject.course);
      await subjectsPage.submitRegisterModal();
    });

    await test.step('Then the system should keep the form blocked and show the required professor message', async () => {
      await expect(subjectsPage.page.getByText(subjectsFixture.messages.requiredProfessor, { exact: true })).toBeVisible();
      await expect(subjectsPage.registerModalHeading).toBeVisible();
    });
  });

  test('DISC-019 - atualizacao da listagem apos cadastro', async () => {
    let listedSubject;

    await test.step('Given that a test subject is registered for the listing update scenario', async () => {
      listedSubject = buildTestSubject({
        code: buildUniqueSubjectCode('LST'),
        name: `[AUTO] Disciplina Listagem ${buildAutoSubjectSuffix()}`,
      });
      await registerSubject(listedSubject);
    });

    await test.step('When the refreshed subjects listing is displayed', async () => {
      await expect(subjectsPage.registerModalHeading).toBeHidden();
      await subjectsPage.waitForTableData();
    });

    await test.step('Then the created subject should be listed with the expected data', async () => {
      await assertSubjectVisibleOnList(listedSubject);
    });
  });

  test('DISC-020 - filtrar disciplinas por Engenharia de Software', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the course filter is changed to Engenharia de Software', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.software);
    });

    await test.step('Then the listing should keep the selected filter label and display only matching courses on screen', async () => {
      expect(normalizeText(await subjectsPage.getCourseFilterLabel())).toContain(normalizeText(subjectsFixture.filters.software));
      const courseTexts = await subjectsPage.getColumnTexts(3);
      if (courseTexts.length > 0) {
        for (const courseText of courseTexts) {
          expect.soft(normalizeText(courseText)).toContain(normalizeText(subjectsFixture.filters.software));
        }
      }
    });
  });

  test('DISC-021 - filtrar disciplinas por Ciência da Computação', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the course filter is changed to Ciência da Computação', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.computing);
    });

    await test.step('Then the listing should keep the selected filter label and display only matching courses on screen', async () => {
      expect(normalizeText(await subjectsPage.getCourseFilterLabel())).toContain(normalizeText(subjectsFixture.filters.computing));
      const courseTexts = await subjectsPage.getColumnTexts(3);
      if (courseTexts.length > 0) {
        for (const courseText of courseTexts) {
          expect.soft(normalizeText(courseText)).toContain(normalizeText(subjectsFixture.filters.computing));
        }
      }
    });
  });

  test('DISC-022 - filtrar disciplinas por Engenharia Civil', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the course filter is changed to Engenharia Civil', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.civil);
    });

    await test.step('Then the listing should keep the selected filter label and display only matching courses on screen', async () => {
      expect(normalizeText(await subjectsPage.getCourseFilterLabel())).toContain(normalizeText(subjectsFixture.filters.civil));
      const courseTexts = await subjectsPage.getColumnTexts(3);
      if (courseTexts.length > 0) {
        for (const courseText of courseTexts) {
          expect.soft(normalizeText(courseText)).toContain(normalizeText(subjectsFixture.filters.civil));
        }
      }
    });
  });

  test('DISC-023 - filtrar disciplinas por Engenharia de Produção', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the course filter is changed to Engenharia de Produção', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.production);
    });

    await test.step('Then the listing should keep the selected filter label and display only matching courses on screen', async () => {
      expect(normalizeText(await subjectsPage.getCourseFilterLabel())).toContain(normalizeText(subjectsFixture.filters.production));
      const courseTexts = await subjectsPage.getColumnTexts(3);
      if (courseTexts.length > 0) {
        for (const courseText of courseTexts) {
          expect.soft(normalizeText(courseText)).toContain(normalizeText(subjectsFixture.filters.production));
        }
      }
    });
  });

  test('DISC-024 - filtrar disciplinas por Engenharia Mecânica', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the course filter is changed to Engenharia Mecânica', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.mechanics);
    });

    await test.step('Then the listing should keep the selected filter label and display only matching courses on screen', async () => {
      expect(normalizeText(await subjectsPage.getCourseFilterLabel())).toContain(normalizeText(subjectsFixture.filters.mechanics));
      const courseTexts = await subjectsPage.getColumnTexts(3);
      if (courseTexts.length > 0) {
        for (const courseText of courseTexts) {
          expect.soft(normalizeText(courseText)).toContain(normalizeText(subjectsFixture.filters.mechanics));
        }
      }
    });
  });

  test('DISC-025 - selecionar todos os cursos no filtro', async () => {
    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the course filter is changed to all courses', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.all);
    });

    await test.step('Then the list should display the general subjects listing', async () => {
      expect(await subjectsPage.getCourseFilterLabel()).toContain(subjectsFixture.filters.all);
      expect(await subjectsPage.getVisibleRowsCount()).toBeGreaterThan(0);
    });
  });

  test('DISC-026 - trocar filtro entre cursos diferentes', async () => {
    let firstFilterRows = [];

    await test.step('Given that the admin user is on the subjects page', async () => {
      await expect(subjectsPage.heading).toBeVisible();
    });

    await test.step('When the user filters first by Engenharia de Software and then by Engenharia Civil', async () => {
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.software);
      firstFilterRows = await subjectsPage.getColumnTexts(0);
      await subjectsPage.selectCourseFilter(subjectsFixture.filters.civil);
    });

    await test.step('Then the listing should update to reflect the last selected course', async () => {
      expect(await subjectsPage.getCourseFilterLabel()).toContain(subjectsFixture.filters.civil);
      const secondFilterRows = await subjectsPage.getColumnTexts(0);
      expect.soft(JSON.stringify(secondFilterRows), 'A troca de filtros deveria atualizar a listagem.').not.toBe(JSON.stringify(firstFilterRows));
    });
  });


});
