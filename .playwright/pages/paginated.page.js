class PaginatedPage {
  constructor(page) {
    this.page = page;
    this.paginationButtons = page.locator('tfoot button');
  }

  async waitForTableData() {
    await this.page.waitForFunction(() => {
      return document.querySelectorAll('tbody tr').length > 0 || !document.querySelector('table');
    }, { timeout: 5000 }).catch(() => null);
  }

  async goToPage(pageNumber) {
    if (pageNumber === 1) {
      await this.waitForTableData();
      return;
    }

    await this.paginationButtons.filter({ hasText: new RegExp(`^${pageNumber}$`) }).first().click();
    await this.waitForTableData();
  }

  async goToLastPage() {
    const pageNumbers = await this.getPaginationPageNumbers();
    const lastPageNumber = pageNumbers.at(-1);

    if (lastPageNumber) {
      await this.goToPage(lastPageNumber);
    }
  }

  async getPaginationPageNumbers() {
    const buttonTexts = await this.paginationButtons.allTextContents();
    const pageNumbers = [...new Set(
      buttonTexts
        .map((text) => Number.parseInt(text.trim(), 10))
        .filter((value) => Number.isInteger(value) && value > 0),
    )];

    return pageNumbers.length > 0 ? pageNumbers.sort((a, b) => a - b) : [1];
  }

  async findRowAcrossPages(getRowLocator, timeout = 5000) {
    const pageNumbers = await this.getPaginationPageNumbers();

    for (const pageNumber of pageNumbers) {
      await this.goToPage(pageNumber);
      const row = getRowLocator();

      try {
        await row.waitFor({ state: 'visible', timeout });
        return row;
      } catch {
        continue;
      }
    }

    return null;
  }
}

module.exports = { PaginatedPage };
