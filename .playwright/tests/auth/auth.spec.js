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

  test('AUTH-004 - login com email em formato invalido', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters an email outside the institutional domain', async () => {
      await loginPage.fillEmail(authFixture.invalid.invalidEmail);
      await loginPage.fillPassword(authFixture.admin.password);
      await loginPage.submit();
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should reject the email because it is not institutional', async () => {
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.errorAlert).toBeVisible();
      await expect(loginPage.errorAlert).toContainText(authFixture.messages.emptyCredentials);
    });
  });

  test('AUTH-005 - login com senha vazia', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters a valid email and leaves the password blank', async () => {
      await loginPage.fillEmail(authFixture.admin.email);
      await loginPage.submit();
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should prevent the login attempt and display an authentication error message', async () => {
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.errorAlert).toBeVisible();
      await expect(loginPage.errorAlert).toContainText(authFixture.messages.emptyCredentials);
    });
  });

  test('AUTH-006 - login com senha menor que o minimo permitido', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters a password shorter than the expected minimum', async () => {
      await loginPage.login(authFixture.admin.email, authFixture.invalid.shortPassword);
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should prevent access and display an authentication error message', async () => {
      const hasInlineError = await loginPage.hasInlineError();
      if (hasInlineError) {
        await expect(loginPage.errorAlert).toContainText(authFixture.messages.invalidCredentials);
        return;
      }

      expect(await loginPage.isPasswordValid()).toBeTruthy();
      await expect(loginPage.heading).toBeVisible();
    });
  });

  test('AUTH-007 - login com email vazio', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user leaves the email blank and enters a valid password', async () => {
      await loginPage.fillPassword(authFixture.admin.password);
      await loginPage.submit();
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should display the message for incorrectly filled email and password fields', async () => {
      await expect(loginPage.errorAlert).toBeVisible();
      await expect(loginPage.errorAlert).toContainText(authFixture.messages.emptyCredentials);
    });
  });

  test('AUTH-008 - login com email e senha vazios', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user submits the form without filling email and password', async () => {
      await loginPage.submit();
      await loginPage.waitForIdleAfterSubmit();
    });

    await test.step('Then the system should display the message for incorrectly filled email and password fields', async () => {
      await expect(loginPage.errorAlert).toBeVisible();
      await expect(loginPage.errorAlert).toContainText(authFixture.messages.emptyCredentials);
    });
  });

  test('AUTH-009 - login com email com caracteres especiais', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters an email with invalid special characters', async () => {
      await loginPage.fillEmail(authFixture.invalid.specialCharsEmail);
      await loginPage.fillPassword(authFixture.admin.password);
      await loginPage.submit();
    });

    await test.step('Then the browser should block the submission and keep the user on the login page', async () => {
      expect(await loginPage.isEmailValid()).toBeFalsy();
      expect(await loginPage.getEmailValidationMessage()).not.toBe('');
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.errorAlert).toBeHidden();
    });
  });

  test('AUTH-010 - login com email contendo espacos em branco', async () => {
    await test.step('Given that the user is on the login page', async () => {
      await loginPage.goto(authFixture.baseURL);
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('When the user enters a valid institutional email with leading and trailing spaces', async () => {
      await loginPage.login(authFixture.invalid.spacedEmail, authFixture.admin.password);
      await loginPage.waitForIdleAfterSubmit(20000);
    });

    await test.step('Then the system should trim the email and authenticate the user successfully', async () => {
      await expect(loginPage.loadingIndicator).toBeHidden({ timeout: 20000 });

      const stillOnLoginScreen = await loginPage.isLoginScreenVisible();
      const hasInlineError = await loginPage.hasInlineError();
      const currentUrl = await loginPage.getCurrentUrl();

      expect.soft(stillOnLoginScreen, 'Nao deveria permanecer na tela de login apos o trim do email.').toBeFalsy();
      expect.soft(hasInlineError, 'Nao deveria exibir erro inline apos o trim do email.').toBeFalsy();
      expect.soft(currentUrl, 'A URL deveria mudar apos login com email contendo espacos em branco.').not.toBe(authFixture.baseURL);
    });
  });

  test('AUTH-011 - logout com sucesso', async ({ page }) => {
    await test.step('Given that the user is authenticated in the admin area', async () => {
      await loginThroughPortal(loginPage, authFixture);
    });

    await test.step('When the user clicks the logout button and confirms the native dialog', async () => {
      let dialogMessage = '';
      page.once('dialog', async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });
      
      await loginPage.clickSidebarLogout();
      expect(dialogMessage).toBe(authFixture.messages.logoutConfirmation);
    });

    await test.step('Then the system should end the session and redirect the user to the login page', async () => {
      await expect(loginPage.heading).toBeVisible({ timeout: 20000 });
      await expect(loginPage.dashboardRoot).toBeHidden();
      await expect(page).toHaveURL(authFixture.baseURL);
    });
  });

  test('AUTH-012 - acessar direto com a URL sem realizar login', async ({ page }) => {
    await test.step('Given that the user is not authenticated', async () => {
      await loginPage.goto(authFixture.baseURL);
    });

    await test.step('When the user tries to access the admin URL directly', async () => {
      await loginPage.gotoAdmin(authFixture.adminURL);
    });

    await test.step('Then the system should redirect the user to the login page', async () => {
      await expect(loginPage.heading).toBeVisible({ timeout: 20000 });
      await expect(page).toHaveURL(authFixture.baseURL, { timeout: 20000 });
      await expect(loginPage.dashboardRoot).toBeHidden();
    });
  });


});
