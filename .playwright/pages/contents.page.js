const { PaginatedPage } = require('./paginated.page');

class MaterialsPage extends PaginatedPage {
  constructor(page) {
    super(page);
    this.page = page;
    this.sidebarContentsItem = page.getByRole('link', { name: 'item sidebar conteudos' });
    this.heading = page.getByRole('heading', { name: /conte/i }).first();
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');
    this.filterButtons = page.locator('section [aria-haspopup="listbox"]');
    this.registerContentButton = page.getByRole('button', { name: /Cadastrar Conte/i }).first();
    this.registerModalHeading = page.getByRole('heading', { name: /Cadastrar conte/i });
    this.fileInput = page.locator('#files');
    this.typeSelect = page.locator('#typeMaterial');
    this.registerCancelButton = page.getByRole('button', { name: /Cancelar cadastro/i });
    this.registerSubmitButton = page.getByRole('button', { name: /Cadastrar nova disciplina/i });
    this.inlineAlerts = page.locator('h5.text-red-500');
    this.toast = page.locator('.Toastify__toast').last();
    this.deleteDialogHeading = page.getByRole('heading', { name: /Confirmar exclus/i });
    this.deleteDialogCancelButton = page.getByRole('button', { name: 'Cancelar' }).last();
    this.deleteDialogConfirmButton = page.getByRole('button', { name: 'Excluir' }).last();
    this.viewerCloseButton = page.getByRole('button', { name: /Fechar/i });
    this.viewerPdf = page.locator('iframe');
    this.viewerImages = page.locator('img[alt^="Visualização"], img[alt^="Visualiza"]');
    this.emptyListMessage = page.getByText(/Nenhum registro encontrado!/i);
    this.loadingSpinner = page.locator('.animate-spin');
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
    await this.sidebarContentsItem.click();
  }

  isMaterialsListResponse(response, pageNumber) {
    return (
      response.url().includes('/material/ListarDocumentosWithPagination?') &&
      response.request().method() === 'GET' &&
      (pageNumber ? response.url().includes(`page=${pageNumber}`) : true)
    );
  }

  async waitForMaterialsListResponse(pageNumber) {
    await this.page.waitForResponse((response) => this.isMaterialsListResponse(response, pageNumber));
  }

  async waitForTableDataOrEmpty(timeout = 10000) {
    await this.page.waitForFunction(() => {
      return (
        document.querySelectorAll('tbody tr').length > 0 ||
        document.body.innerText.includes('Nenhum registro encontrado!')
      );
    }, { timeout }).catch(() => null);
  }

  async waitForListReady() {
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
    await this.table.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForTableDataOrEmpty(12000);
  }

  async waitForToast(text, timeout = 7000) {
    if (text) {
      await this.page.getByText(text, { exact: false }).waitFor({ state: 'visible', timeout });
      return;
    }

    await this.toast.waitFor({ state: 'visible', timeout });
  }

  async openRegisterModal() {
    await this.registerContentButton.click();
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

  async setFiles(filePaths) {
    await this.fileInput.setInputFiles(filePaths);
  }

  async selectMaterialType(value) {
    await this.typeSelect.selectOption(value);
  }

  async openSubjectFilter() {
    await this.filterButtons.nth(0).click();
  }

  async openTopicFilter() {
    await this.filterButtons.nth(1).click();
  }

  async selectSubjectFilter(label) {
    const responsePromise = this.page.waitForResponse((response) =>
      this.isMaterialsListResponse(response),
    );
    await this.openSubjectFilter();
    await this.page.getByRole('option', { name: label, exact: true }).click();
    await responsePromise;
    await this.waitForTableDataOrEmpty();
  }

  async selectTopicFilter(label) {
    const responsePromise = this.page.waitForResponse((response) =>
      this.isMaterialsListResponse(response),
    );
    await this.openTopicFilter();
    await this.page.getByRole('option', { name: label, exact: true }).click();
    await responsePromise;
    await this.waitForTableDataOrEmpty();
  }

  async selectModalTopic(label) {
    const modalFilterButton = this.page.locator('.fixed').last()
      .locator('[aria-haspopup="listbox"]')
      .first();

    await modalFilterButton.click();
    await this.page.getByRole('option', { name: label, exact: true }).click().catch(async () => {
      await this.page.getByText(label, { exact: true }).click();
    });
  }

  async fillRegisterForm({ filePaths = [], typeValue, topicName }) {
    await this.setFiles(filePaths);
    if (typeValue !== undefined) {
      await this.selectMaterialType(typeValue);
    }
    if (topicName) {
      await this.selectModalTopic(topicName);
    }
  }

  async fillRegisterFormExcept(missingField, payload) {
    if (missingField !== 'files') {
      await this.setFiles(payload.filePaths ?? []);
    }

    if (missingField !== 'type') {
      await this.selectMaterialType(payload.typeValue);
    }

    if (missingField !== 'topic') {
      await this.selectModalTopic(payload.topicName);
    }
  }

  async getVisibleRowsCount() {
    return this.tableRows.count();
  }

  getRowByTopicAndSubject(topicName, subjectName) {
    return this.tableRows.filter({
      has: this.page.locator('td', { hasText: topicName }),
    }).filter({
      has: this.page.locator('td', { hasText: subjectName }),
    }).first();
  }

  async openViewerForRow(row) {
    await row.getByRole('button', { name: 'visualizar' }).click();
  }

  async closeViewer() {
    await this.viewerCloseButton.click();
  }

  async openDeleteDialogForRow(row) {
    await row.getByRole('button', { name: 'excluir' }).click();
  }

  async confirmDeleteDialog() {
    await this.deleteDialogConfirmButton.click();
  }
}

module.exports = { MaterialsPage };
