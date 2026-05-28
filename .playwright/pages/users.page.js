const { PaginatedPage } = require('./paginated.page');

class UsersPage extends PaginatedPage {
  constructor(page) {
    super(page);
    this.page = page;
    this.sidebarUsersItem = page.getByRole('link', { name: 'item sidebar usuarios' });
    this.heading = page.getByRole('heading', { name: /Usuários/i });
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');
    this.filterButtons = page.locator('button').filter({ has: page.locator('img[alt="Filtro"]') });
    this.statusFilterButton = this.filterButtons.first();
    this.typeFilterButton = this.filterButtons.nth(1);
    this.registerUserButtons = page.getByRole('button', { name: /Cadastrar usuário/i });
    this.registerModalHeading = page.getByRole('heading', { name: /Cadastrar Usuário/i });
    this.editModalHeading = page.getByRole('heading', { name: /Editar Usuário/i });
    this.deleteModalHeading = page.getByRole('heading', { name: /Confirmar exclusão/i });
    this.nameInput = page.locator('#nome');
    this.courseSelect = page.locator('#curso');
    this.roleSelect = page.locator('#role');
    this.statusSelect = page.locator('#status');
    this.matriculaInput = page.locator('#matricula');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#senha');
    this.editPasswordInput = page.locator('#password');
    this.registerSubmitButton = page.getByRole('button', { name: /Cadastrar novo usuário/i });
    this.registerCancelButton = page.getByRole('button', { name: /Cancelar cadastro/i });
    this.editSubmitButton = page.getByRole('button', { name: /Salvar edição de usuário/i });
    this.editCancelButton = page.getByRole('button', { name: /Cancelar edição de usuário/i });
    this.inlineAlert = page.locator('.bg-red-500').last();
    this.deleteDialog = page.locator('text=Confirmar exclusão').first();
    this.deleteDialogCancelButton = page.getByRole('button', { name: 'Cancelar' });
    this.deleteDialogConfirmButton = page.getByRole('button', { name: 'Excluir' });
    this.firstEditButton = page.getByRole('button', { name: /editar (?:aluno|usuário|usu.rio)/i }).first();
    this.firstDeleteButton = page.getByRole('button', { name: /(?:excluir aluno|deletar usuário|deletar usuario)/i }).first();
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
    await this.sidebarUsersItem.click();
  }

  async waitForListReady() {
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
    await this.table.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForTableData();
  }

  async openStatusFilter() {
    await this.statusFilterButton.click();
  }

  async openTypeFilter() {
    await this.typeFilterButton.click();
  }

  async selectStatusOption(optionName) {
    const currentLabel = await this.getStatusFilterLabel();
    if (currentLabel.includes(optionName)) {
      return;
    }

    await this.openStatusFilter();
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/user?') &&
        response.request().method() === 'GET' &&
        response.url().includes(`status=${this.getStatusQueryValue(optionName)}`),
    );

    await this.page.getByRole('link', { name: optionName, exact: true }).click();
    await responsePromise;
    await this.waitForTableData();
  }

  async selectTypeOption(optionName) {
    const currentLabel = await this.getTypeFilterLabel();
    if (currentLabel.includes(optionName)) {
      return;
    }

    await this.openTypeFilter();
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/user?') &&
        response.request().method() === 'GET' &&
        response.url().includes(`userType=${this.getTypeQueryValue(optionName)}`),
    );

    await this.page.getByRole('link', { name: optionName, exact: true }).click();
    await responsePromise;
    await this.waitForTableData();
  }

  async getStatusFilterLabel() {
    return (await this.statusFilterButton.innerText()).trim();
  }

  getStatusQueryValue(optionName) {
    const statusMap = {
      'Todos os status': 0,
      Ativo: 2,
      Inativo: 1,
    };

    return statusMap[optionName];
  }

  async getTypeFilterLabel() {
    return (await this.typeFilterButton.innerText()).trim();
  }

  getTypeQueryValue(optionName) {
    const typeMap = {
      'Todos os tipos': 0,
      Admin: 1,
      Aluno: 3,
      Professor: 2,
    };

    return typeMap[optionName];
  }

  async getVisibleRowsCount() {
    return this.tableRows.count();
  }

  async getColumnTexts(columnIndex) {
    const texts = await this.page.locator(`tbody tr td:nth-child(${columnIndex + 1})`).allTextContents();
    return texts.map((text) => text.trim()).filter(Boolean);
  }

  async openRegisterModal() {
    await this.registerUserButtons.first().click();
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

  async fillRegisterForm(user) {
    await this.fillRegisterName(user.name);
    await this.selectRegisterCourse(user.course);
    await this.selectRegisterRole(user.role);
    await this.fillRegisterMatricula(user.matricula);
    await this.fillRegisterEmail(user.email);
    await this.fillRegisterPassword(user.password);
  }

  async fillRegisterName(value) {
    await this.nameInput.fill(value);
  }

  async selectRegisterCourse(value) {
    await this.courseSelect.selectOption(value);
  }

  async selectRegisterRole(value) {
    await this.roleSelect.selectOption(value);
  }

  async selectEditStatus(value) {
    await this.statusSelect.selectOption(value);
  }

  async fillRegisterMatricula(value) {
    await this.matriculaInput.fill(value);
  }

  async fillRegisterEmail(value) {
    await this.emailInput.fill(value);
  }

  async fillRegisterPassword(value) {
    await this.passwordInput.fill(value);
  }

  async fillEditPassword(value) {
    await this.editPasswordInput.fill(value);
  }

  async openFirstEditableUser() {
    await this.firstEditButton.click();
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

  async openFirstDeletePopup() {
    await this.firstDeleteButton.click();
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

  getRowByMatricula(matricula) {
    return this.tableRows.filter({
      has: this.page.locator('td', { hasText: matricula }),
    }).first();
  }

  async waitForUserVisibleByMatricula(matricula, timeout = 15000) {
    await this.page.waitForFunction((targetMatricula) => {
      return [...document.querySelectorAll('tbody tr')].some((row) =>
        row.textContent?.includes(targetMatricula),
      );
    }, matricula, { timeout });
  }

  async openEditUserByMatricula(matricula) {
    const row = this.getRowByMatricula(matricula);
    await row.getByRole('button', { name: /editar (?:aluno|usuário|usu.rio)/i }).click();
  }

  async openDeletePopupByMatricula(matricula) {
    const row = this.getRowByMatricula(matricula);
    await row.getByRole('button', { name: /(?:excluir aluno|deletar usuário|deletar usu.rio)/i }).click();
  }

  async openPageContainingUser(matricula) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.goToLastPage();

      const newestRow = this.getRowByMatricula(matricula);
      try {
        await newestRow.waitFor({ state: 'visible', timeout: 5000 });
        return true;
      } catch {
        if (attempt < 2) {
          await this.page.reload();
          await this.waitForListReady();
        }
      }
    }

    const row = await this.findRowAcrossPages(
      () => this.getRowByMatricula(matricula),
      3000,
    );
    return Boolean(row);
  }
}

module.exports = { UsersPage };
