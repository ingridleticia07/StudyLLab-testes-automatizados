class LoginPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /entrar na sua conta/i });
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#senha');
    this.submitButton = page.getByRole('button', { name: 'Entrar' });
    this.errorAlert = page.locator('.bg-red-500');
    this.loadingIndicator = page.locator('.animate-spin');
    this.registerLink = page.getByRole('link', { name: /cadastre-se/i });
    this.dashboardRoot = page.locator('text=Total de Usuários').first();
    this.sidebarLogoutItem = page
      .locator('li')
      .filter({ has: page.locator('img[alt="item sidebar logout"]') })
      .last();
  }

  async goto(baseURL) {
    try {
      await this.page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      if (!`${error}`.includes('ERR_ABORTED')) {
        throw error;
      }

      await this.page.waitForLoadState('domcontentloaded', { timeout: 3000 }).catch(() => null);
      await this.page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    }
  }

  async isLoginScreenVisible() {
    return this.heading.isVisible().catch(() => false);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async waitForIdleAfterSubmit(timeout = 15000) {
    await Promise.race([
      this.page.waitForLoadState('networkidle', { timeout }).catch(() => null),
      this.loadingIndicator.waitFor({ state: 'hidden', timeout }).catch(() => null),
      this.errorAlert.waitFor({ state: 'visible', timeout }).catch(() => null),
    ]);
  }

  async waitForAuthSession(timeout = 15000) {
    await this.page.waitForFunction(() => {
      return document.cookie.includes('authToken=') || window.sessionStorage.getItem('authToken');
    }, { timeout }).catch(() => null);
  }

  async hasInlineError() {
    return this.errorAlert.isVisible().catch(() => false);
  }

  async getInlineErrorText() {
    return this.errorAlert.textContent();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async isAuthenticatedAreaVisible() {
    return this.dashboardRoot.isVisible().catch(() => false);
  }

  async gotoAdmin(baseURL) {
    await this.page.goto(baseURL, { waitUntil: 'load' });
  }

  async clickSidebarLogout() {
    await this.sidebarLogoutItem.click({ force: true });
  }

  async getEmailValidationMessage() {
    return this.emailInput.evaluate((input) => input.validationMessage);
  }

  async getPasswordValidationMessage() {
    return this.passwordInput.evaluate((input) => input.validationMessage);
  }

  async isEmailValid() {
    return this.emailInput.evaluate((input) => input.checkValidity());
  }

  async isPasswordValid() {
    return this.passwordInput.evaluate((input) => input.checkValidity());
  }
}

module.exports = { LoginPage };
