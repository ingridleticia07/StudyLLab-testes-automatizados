const { PaginatedPage } = require('./paginated.page');

class SubjectsPage extends PaginatedPage {
  constructor(page) {
    super(page);
    this.page = page;
    this.sidebarSubjectsItem = page.getByRole('link', { name: 'item sidebar disciplinas' });
    this.heading = page.getByRole('heading', { name: /disciplinas/i });
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');
    this.courseFilterButton = page.locator('button').filter({ has: page.locator('img[alt="Filtro"]') }).first();
    this.registerSubjectButton = page.getByRole('button', { name: /Cadastrar Disciplina/i }).first();
    this.registerModalHeading = page.getByRole('heading', { name: /Cadastrar Disciplina/i });
    this.editModalHeading = page.getByRole('heading', { name: /Editar Disciplina/i });
    this.deleteModalHeading = page.getByRole('heading', { name: /Confirmar exclus/i });
    this.codeInput = page.locator('#codigo');
    this.nameInput = page.locator('#nome');
    this.professorInput = page.locator('#professor');
    this.studentsCountInput = page.locator('#quantidade');
    this.courseSelect = page.locator('#curso');
    this.registerSubmitButton = page.getByRole('button', { name: /Cadastrar nova disciplina/i });
    this.registerCancelButton = page.getByRole('button', { name: /Cancelar cadastro da disciplina/i });
    this.editSubmitButton = page.getByRole('button', { name: /Salvar edi/i });
    this.editCancelButton = page.getByRole('button', { name: /Cancelar edi/i });
    this.inlineAlert = page.locator('.bg-red-500').last();
    this.toast = page.locator('.Toastify__toast').last();
    this.deleteDialogCancelButton = page.getByRole('button', { name: 'Cancelar' }).last();
    this.deleteDialogConfirmButton = page.getByRole('button', { name: 'Excluir' });
    this.paginationButtons = page
      .locator('button')
      .filter({ hasText: /^(?:←|→|\d+)$/ });
  }

  async goto(url) {
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      if (!`${error}`.includes('ERR_ABORTED')) {
        throw error;
      }

      await this.page.waitForLoadState('domcontentloaded', { timeout: 3000 }).catch(() => null);
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
  }

  async openFromSidebar() {
    await this.sidebarSubjectsItem.click();
  }

  async waitForListReady() {
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
    await this.table.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForTableData();
  }

  async waitForToast(text, timeout = 5000) {
    if (text) {
      await this.page.getByText(text, { exact: false }).waitFor({ state: 'visible', timeout });
      return;
    }

    await this.toast.waitFor({ state: 'visible', timeout });
  }

  async getVisibleRowsCount() {
    return this.tableRows.count();
  }

  async getColumnTexts(columnIndex) {
    const texts = await this.page.locator(`tbody tr td:nth-child(${columnIndex + 1})`).allTextContents();
    return texts.map((text) => text.trim()).filter(Boolean);
  }

  async openCourseFilter() {
    await this.courseFilterButton.click();
  }

  async selectCourseFilter(optionName) {
    const currentLabel = await this.getCourseFilterLabel();
    if (this.normalizeText(currentLabel).includes(this.normalizeText(optionName))) {
      return;
    }

    await this.openCourseFilter();
    const responsePromise = this.page.waitForResponse((response) =>
      this.isSubjectsListResponse(response) &&
      response.url().includes(`idCurso=${this.getCourseQueryValue(optionName)}`),
    );
    await this.page.getByRole('menuitem', { name: optionName, exact: false }).click();
    await responsePromise.catch(() => null);
    await this.waitForTableData();
  }

  async getCourseFilterLabel() {
    return (await this.courseFilterButton.innerText()).trim();
  }

  normalizeText(value) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  getCourseQueryValue(optionName) {
    const courseMap = {
      'Todos os curso': 0,
      'Engenharia de Software': 1,
      'Ciência da Computação': 2,
      'Engenharia Civil': 3,
      'Engenharia de Produção': 4,
      'Engenharia Mecânica': 5,
      'Engenharia de software': 1,
      'Ciência da computação': 2,
      'Engenharia civil': 3,
      'Engenharia de produção': 4,
      'Engenharia mecânica': 5,
    };

    return courseMap[optionName] ?? 0;
  }

  isSubjectsListResponse(response, pageNumber) {
    return (
      response.url().includes('/disciplina/listarDisciplinasWithPagination?') &&
      response.request().method() === 'GET' &&
      (pageNumber ? response.url().includes(`page=${pageNumber}`) : true)
    );
  }

  async waitForSubjectsListResponse(pageNumber) {
    await this.page.waitForResponse((response) =>
      this.isSubjectsListResponse(response, pageNumber),
    );
  }

  async openRegisterModal() {
    await this.registerSubjectButton.click();
  }

  async closeRegisterModal() {
    await this.registerCancelButton.click();
  }

  async submitRegisterModal() {
    await this.registerSubmitButton.click();
  }

  async waitForRegisterModalClosed(timeout = 10000) {
    await this.registerModalHeading.waitFor({ state: 'hidden', timeout });
  }

  async fillRegisterCode(value) {
    await this.codeInput.fill(value);
  }

  async fillRegisterName(value) {
    await this.nameInput.fill(value);
  }

  async fillRegisterProfessor(value) {
    await this.professorInput.fill(value);
  }

  async fillRegisterStudentsCount(value) {
    await this.studentsCountInput.fill(value);
  }

  async typeRegisterStudentsCount(value) {
    await this.studentsCountInput.click();
    await this.studentsCountInput.press('Control+A');
    await this.studentsCountInput.press('Delete');
    await this.studentsCountInput.pressSequentially(value);
  }

  async clearRegisterStudentsCount() {
    await this.studentsCountInput.fill('');
  }


  async selectRegisterCourse(value) {
    await this.courseSelect.selectOption(value);
  }

  async fillRegisterForm(subject) {
    await this.fillRegisterCode(subject.code);
    await this.fillRegisterName(subject.name);
    await this.fillRegisterProfessor(subject.professor);
    await this.fillRegisterStudentsCount(subject.studentsCount);
    await this.selectRegisterCourse(subject.course);
  }

  async clearRegisterField(locator) {
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Delete');
  }

  async clearRegisterName() {
    await this.clearRegisterField(this.nameInput);
  }

  async clearRegisterProfessor() {
    await this.clearRegisterField(this.professorInput);
  }

  async clearRegisterCode() {
    await this.clearRegisterField(this.codeInput);
  }

  async clearRegisterCourse() {
    await this.courseSelect.selectOption('');
  }

  async fillEditCode(value) {
    await this.codeInput.fill(value);
  }

  async fillEditName(value) {
    await this.nameInput.fill(value);
  }

  async fillEditProfessor(value) {
    await this.professorInput.fill(value);
  }

  async fillEditStudentsCount(value) {
    await this.studentsCountInput.fill(value);
  }

  async typeEditStudentsCount(value) {
    await this.studentsCountInput.click();
    await this.studentsCountInput.press('Control+A');
    await this.studentsCountInput.press('Delete');
    await this.studentsCountInput.pressSequentially(value);
  }

  async selectEditCourse(value) {
    await this.courseSelect.selectOption(value);
  }

  async clearEditCode() {
    await this.clearRegisterField(this.codeInput);
  }

  async clearEditName() {
    await this.clearRegisterField(this.nameInput);
  }

  async clearEditProfessor() {
    await this.clearRegisterField(this.professorInput);
  }

  async clearEditStudentsCount() {
    await this.clearRegisterField(this.studentsCountInput);
  }

  async clearEditCourse() {
    await this.courseSelect.selectOption('');
  }

  async saveEditModal() {
    await this.editSubmitButton.click();
  }

  async closeEditModal() {
    await this.editCancelButton.click();
  }

  async waitForEditModalClosed(timeout = 10000) {
    await this.editModalHeading.waitFor({ state: 'hidden', timeout });
  }

  async goToPage(pageNumber) {
    if (pageNumber === 1) {
      await this.waitForTableData();
      return;
    }

    const responsePromise = this.page.waitForResponse((response) =>
      this.isSubjectsListResponse(response, pageNumber),
    );

    await this.paginationButtons.filter({ hasText: new RegExp(`^${pageNumber}$`) }).first().click();
    await responsePromise;
    await this.waitForTableData();
  }

  getRowByCode(code) {
    return this.tableRows.filter({
      has: this.page.locator('td', { hasText: code }),
    }).first();
  }

  async isRowVisibleByCode(code) {
    return this.getRowByCode(code).isVisible().catch(() => false);
  }

  async openPageContainingSubject(code) {
    // A listagem publicada de disciplinas é alfabética. Começar da primeira
    // página combina com a ordenação real e evita gastar vários segundos no fim
    // da tabela antes de procurar onde o registro costuma aparecer.
    const pageNumbers = await this.getPaginationPageNumbers();

    for (const pageNumber of pageNumbers) {
      await this.goToPage(pageNumber);

      const row = this.getRowByCode(code);
      if (await row.isVisible().catch(() => false)) {
        return true;
      }
    }

    return false;
  }

  async openEditSubjectByCode(code) {
    const row = this.getRowByCode(code);
    await row.getByRole('button', { name: /editar disciplina/i }).click();
  }

  async openDeletePopupByCode(code) {
    const row = this.getRowByCode(code);
    await row.getByRole('button', { name: /deletar disciplina/i }).click();
  }

  async cancelDeletePopup() {
    await this.deleteDialogCancelButton.click();
  }

  async confirmDeletePopup() {
    await this.deleteDialogConfirmButton.click();
  }

  async waitForDeletePopupClosed(timeout = 10000) {
    await this.deleteModalHeading.waitFor({ state: 'hidden', timeout });
  }
}

module.exports = { SubjectsPage };
