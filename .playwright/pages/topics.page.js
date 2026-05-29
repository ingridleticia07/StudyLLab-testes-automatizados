const { PaginatedPage } = require('./paginated.page');

class TopicsPage extends PaginatedPage {
  constructor(page) {
    super(page);
    this.page = page;
    this.sidebarTopicsItem = page.getByRole('link', { name: 'item sidebar topicos' });
    this.heading = page.getByRole('heading', { name: /t.picos/i });
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');
    this.filterButton = page.locator('.hidden-selector .rs-picker-toggle').first();
    this.registerTopicButton = page.getByRole('button', { name: /Cadastrar T.pico/i }).first();
    this.registerModalHeading = page.getByRole('heading', { name: /Cadastrar T.pico/i });
    this.editModalHeading = page.getByRole('heading', { name: /Editar T.pico/i });
    this.deleteModalHeading = page.getByRole('heading', { name: /Confirmar exclus/i });
    this.topicNameInput = page.locator('#nome');
    this.modalSubjectPicker = page.locator('.custom-select .rs-picker-toggle').first();
    this.modalSubmitButton = page.getByRole('button', { name: /Cadastrar nova disciplina/i });
    this.modalCancelButton = page.getByRole('button', { name: /Cancelar cadastro da disciplina/i });
    this.inlineAlert = page.locator('.bg-red-500').last();
    this.toast = page.locator('.Toastify__toast').last();
    this.deleteDialogCancelButton = page.getByRole('button', { name: 'Cancelar' }).last();
    this.deleteDialogConfirmButton = page.getByRole('button', { name: 'Excluir' });
    this.paginationButtons = page.locator('tfoot button');
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
    await this.sidebarTopicsItem.click();
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

  async openRegisterModal() {
    await this.registerTopicButton.click();
  }

  async closeRegisterModal() {
    await this.modalCancelButton.click();
  }

  async submitRegisterModal() {
    await this.modalSubmitButton.click();
  }

  async waitForRegisterModalClosed(timeout = 10000) {
    await this.registerModalHeading.waitFor({ state: 'hidden', timeout });
  }

  async fillTopicName(name) {
    await this.topicNameInput.fill(name);
  }

  async clearTopicName() {
    await this.topicNameInput.click();
    await this.topicNameInput.press('Control+A');
    await this.topicNameInput.press('Delete');
  }

  async openModalSubjectPicker() {
    await this.modalSubjectPicker.click();
  }

  async selectModalSubject(subjectName) {
    await this.openModalSubjectPicker();
    await this.page.getByRole('option', { name: subjectName, exact: true }).click();
  }

  async getSelectedModalSubjectText() {
    return (await this.modalSubjectPicker.innerText()).trim();
  }

  async selectSubjectFilter(subjectName) {
    const currentLabel = await this.getFilterLabel().catch(() => '');
    if (currentLabel.includes(subjectName)) {
      return;
    }

    await this.filterButton.click();
    const responsePromise = this.page.waitForResponse((response) =>
      response.url().includes('/forum/listarTopicosDiscussaoWithPagination?') &&
      response.request().method() === 'GET',
    ).catch(() => null);

    await this.page.getByRole('option', { name: subjectName, exact: true }).click();
    await responsePromise;
    await this.waitForTableData();
  }

  async getFilterLabel() {
    return (await this.filterButton.innerText()).trim();
  }

  getRowByTopicName(name) {
    return this.tableRows.filter({
      has: this.page.locator('td', { hasText: name }),
    }).first();
  }

  getRowByTopicAndSubject(name, subjectName) {
    let row = this.tableRows.filter({
      has: this.page.locator('td', { hasText: name }),
    });

    if (subjectName) {
      row = row.filter({
        has: this.page.locator('td', { hasText: subjectName }),
      });
    }

    return row.first();
  }

  async openEditTopicByName(name, subjectName = '') {
    const row = this.getRowByTopicAndSubject(name, subjectName);
    await row.getByRole('button', { name: /editar (?:t.pico|disciplina)/i }).click();
  }

  async saveEditModal() {
    await this.modalSubmitButton.click();
  }

  async closeEditModal() {
    await this.modalCancelButton.click();
  }

  async waitForEditModalClosed(timeout = 10000) {
    await this.editModalHeading.waitFor({ state: 'hidden', timeout });
  }

  async openDeletePopupByTopicName(name, subjectName = '') {
    const row = this.getRowByTopicAndSubject(name, subjectName);
    await row.getByRole('button', { name: /deletar t.pico/i }).click();
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

module.exports = { TopicsPage };
