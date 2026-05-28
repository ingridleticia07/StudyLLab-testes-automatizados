const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');

const { LoginPage } = require('../pages/login.page');
const { authFixture } = require('./auth.fixture');
const { loginThroughPortal } = require('../utils/admin-session');

const test = base.test.extend({
  adminAuthState: [async ({ browser }, use, workerInfo) => {
    const authDir = path.join(workerInfo.project.outputDir, '.auth');
    const storagePath = path.join(authDir, `admin-${workerInfo.workerIndex}.json`);
    const sessionPath = path.join(authDir, `admin-${workerInfo.workerIndex}.session.json`);

    fs.mkdirSync(authDir, { recursive: true });

    if (!fs.existsSync(storagePath) || !fs.existsSync(sessionPath)) {
      const page = await browser.newPage();
      const loginPage = new LoginPage(page);

      await loginThroughPortal(loginPage, authFixture);
      const sessionEntries = await page.evaluate(() => {
        return Object.fromEntries(Object.entries(window.sessionStorage));
      }).catch(() => ({}));
      await page.context().storageState({ path: storagePath }).catch(() => null);
      fs.writeFileSync(sessionPath, JSON.stringify(sessionEntries, null, 2));
      await page.close().catch(() => null);
    }

    const sessionEntries = fs.existsSync(sessionPath)
      ? JSON.parse(fs.readFileSync(sessionPath, 'utf-8'))
      : {};
    await use({ storagePath, sessionEntries });
  }, { scope: 'worker', timeout: 120000 }],

  context: async ({ browser, adminAuthState }, use) => {
    const context = await browser.newContext({ storageState: adminAuthState.storagePath });
    await context.addInitScript(({ entries }) => {
      if (window.location.hostname.includes('admin.studyllab.com.br')) {
        for (const [key, value] of Object.entries(entries)) {
          window.sessionStorage.setItem(key, value);
        }
      }
    }, { entries: adminAuthState.sessionEntries });
    await use(context);
    await context.close().catch((error) => {
      if (!`${error}`.includes('ENOENT')) {
        throw error;
      }
    });
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close().catch((error) => {
      if (!`${error}`.includes('ENOENT')) {
        throw error;
      }
    });
  },
});

module.exports = {
  test,
  expect: base.expect,
};
