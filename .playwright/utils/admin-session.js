async function waitForPostLoginStability(page, timeout = 15000) {
  await Promise.any([
    page.waitForURL((url) => !url.toString().includes('/login'), { timeout }),
    page.waitForFunction(() => {
      return document.cookie.includes('authToken=') || window.sessionStorage.getItem('authToken');
    }, { timeout }),
    page.getByText(/Total de Usu.rios/i).first().waitFor({ state: 'visible', timeout }),
  ]).catch(() => null);
}

async function openProtectedPage(protectedPage, protectedUrl, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await protectedPage.goto(protectedUrl);
      return;
    } catch (error) {
      const message = `${error}`;
      const isRetriableNavigation =
        message.includes('ERR_ABORTED') ||
        message.includes('interrupted by another navigation');

      if (!isRetriableNavigation || attempt === maxAttempts) {
        throw error;
      }

      lastError = error;
      await protectedPage.page.waitForLoadState('domcontentloaded', { timeout: 3000 * attempt }).catch(() => null);
    }
  }

  throw lastError;
}

async function loginThroughPortal(loginPage, authFixture, credentials = authFixture.admin) {
  await loginPage.goto(authFixture.baseURL);
  await loginPage.emailInput.waitFor({ state: 'visible', timeout: 20000 });
  await loginPage.login(credentials.email, credentials.password);
  await loginPage.waitForIdleAfterSubmit(20000);
  await loginPage.waitForAuthSession(15000);
  await waitForPostLoginStability(loginPage.page, 15000);

  return await loginPage.isAuthenticatedAreaVisible();
}

async function ensureProtectedPageReady({
  loginPage,
  protectedPage,
  protectedUrl,
  authFixture,
  credentials = authFixture.admin,
}) {
  await openProtectedPage(protectedPage, protectedUrl);

  if (await loginPage.isLoginScreenVisible()) {
    await loginThroughPortal(loginPage, authFixture, credentials);
    await openProtectedPage(protectedPage, protectedUrl);
  }

  if (typeof protectedPage.waitForListReady === 'function') {
    await protectedPage.waitForListReady();
  }
}

async function getCookieValue(pageContext, name) {
  const cookies = await pageContext.context().cookies();
  return cookies.find((cookie) => cookie.name === name)?.value ?? null;
}

module.exports = {
  loginThroughPortal,
  ensureProtectedPageReady,
  getCookieValue,
};
