// Headless verification harness for the overhauled site.
// Drives system Chrome via playwright-core: captures console errors,
// desktop + mobile screenshots, and basic interaction smoke tests.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3000';
const OUT = 'scripts/verify-output';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

const errors = [];
const run = async (name, viewport, actions) => {
  const page = await browser.newPage({ viewport });
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[${name}] console.error: ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`[${name}] pageerror: ${err.message}`));
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  if (actions) await actions(page);
  await page.close();
};

// Desktop full-page
await run('desktop', { width: 1440, height: 900 }, async (page) => {
  await page.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });

  // Smoke test: open quote modal from hero
  await page.fill('#hero-zip', '68102');
  await page.click('text=Start My Free Estimate');
  await page.waitForTimeout(600);
  const modalVisible = await page.isVisible('#modal-title');
  console.log('QUOTE_MODAL_OPENS:', modalVisible);
  await page.screenshot({ path: `${OUT}/desktop-quote-modal.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Smoke test: calendar day click opens modal with preferred date
  await page.click('#schedule >> nth=0', { position: { x: 10, y: 10 } }).catch(() => {});
  const dayButtons = page.locator('#schedule button[aria-label^="Request"]:not([disabled])');
  const count = await dayButtons.count();
  console.log('CALENDAR_CLICKABLE_DAYS:', count);
  if (count > 0) {
    await dayButtons.nth(Math.min(5, count - 1)).click();
    await page.waitForTimeout(600);
    const dateBanner = await page.textContent('body');
    console.log('PREFERRED_DATE_BANNER:', dateBanner.includes('Preferred start date'));
    await page.screenshot({ path: `${OUT}/desktop-calendar-modal.png` });
    await page.keyboard.press('Escape');
  }
});

// Mobile (iPhone-ish)
await run('mobile', { width: 375, height: 812 }, async (page) => {
  await page.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });

  // Mobile menu
  await page.click('button[aria-label="Toggle navigation menu"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/mobile-menu.png` });

  // Horizontal overflow check
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  console.log('MOBILE_HORIZONTAL_OVERFLOW:', overflow);
});

// Admin route renders (login screen)
const adminPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
adminPage.on('pageerror', err => errors.push(`[admin] pageerror: ${err.message}`));
await adminPage.goto(`${BASE}/admin`, { waitUntil: 'networkidle', timeout: 30000 });
await adminPage.waitForTimeout(1200);
const adminLoginVisible = await adminPage.isVisible('text=Command Center');
console.log('ADMIN_LOGIN_RENDERS:', adminLoginVisible);
await adminPage.screenshot({ path: `${OUT}/admin-login.png` });
await adminPage.close();

await browser.close();

if (errors.length) {
  console.log('\n=== CONSOLE/PAGE ERRORS ===');
  errors.forEach(e => console.log(e));
} else {
  console.log('\nNO_CONSOLE_ERRORS');
}
