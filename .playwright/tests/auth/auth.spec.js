const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { authFixture } = require('../../fixtures/auth.fixture');
const { loginThroughPortal } = require('../../utils/admin-session');

test.describe('Testes de Autenticacao', () => {
  let loginPage;

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  loginPage = new LoginPage(page);

  await loginPage.goto(authFixture.baseURL);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('AUTH-001 - login com credenciais validas', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters valid credentials', async () => {
      await loginPage.login(authFixture.admin.email, authFixture.admin.password);
      await loginPage.waitForIdleAfterSubmit(20000);
    });

    await test.step('Then the user should be authenticated successfully', async () => {
      await expect(loginPage.loadingIndicator).toBeHidden({ timeout: 20000 });

      const stillOnLoginScreen = await loginPage.isLoginScreenVisible();
      const hasInlineError = await loginPage.hasInlineError();
      const currentUrl = await loginPage.getCurrentUrl();

      expect.soft(stillOnLoginScreen, 'Nao deveria permanecer na tela de login apos credenciais validas.').toBeFalsy();
      expect.soft(hasInlineError, 'Nao deveria exibir erro inline apos login valido.').toBeFalsy();
      expect.soft(currentUrl, 'A URL deveria mudar apos login valido.').not.toBe(authFixture.baseURL);
    });
  });

  test('AUTH-002 - login com email inexistente', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters an email that is not registered', async () => {
      await loginPage.login(authFixture.invalid.emailNotFound, authFixture.admin.password);
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should display an authentication error message', async () => {
      await expect(loginPage.errorAlert).toBeVisible();
      await expect(loginPage.errorAlert).toContainText(authFixture.messages.invalidCredentials);
    });
  });

  test('AUTH-003 - login com senha incorreta', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters a valid email and an incorrect password', async () => {
      await loginPage.login(authFixture.admin.email, authFixture.invalid.wrongPassword);
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should deny access and display an authentication error message', async () => {
      await expect(loginPage.errorAlert).toBeVisible();
      await expect(loginPage.errorAlert).toContainText(authFixture.messages.invalidCredentials);
    });
  });


});
