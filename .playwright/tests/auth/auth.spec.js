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


});
