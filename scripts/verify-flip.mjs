// Visual verification: header flip-word cycles through all services,
// "Pressure Washing" fits without breaking the header, and the page is error-free.
import { chromium } from 'playwright-core';

const channels = ['chrome', 'msedge'];
let browser = null;
let lastErr = null;
for (const channel of channels) {
  try {
    browser = await chromium.launch({ channel, headless: true });
    break;
  } catch (e) {
    lastErr = e;
  }
}
if (!browser) {
  console.error('Could not launch a system browser:', lastErr?.message);
  process.exit(2);
}

const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

const readState = () =>
  page.evaluate(() => {
    const el = document.querySelector('.jajd-flip-word');
    if (!el) return null;
    const spans = [...el.querySelectorAll('span')];
    const entering = spans[spans.length - 1];
    const nav = document.querySelector('nav');
    return {
      word: entering ? entering.textContent : null,
      navOverflows: nav ? nav.scrollWidth > nav.clientWidth + 1 : null,
    };
  });

const seen = [];
let pressureShot = false;
// Sample for up to ~42s: enough for one full 9-word cycle at 4.2s per word.
for (let i = 0; i < 21; i++) {
  const s = await readState();
  if (s && !seen.includes(s.word)) seen.push(s.word);
  if (s && s.word === 'Pressure Washing' && !pressureShot) {
    await page.screenshot({ path: 'scripts/flip-pressure.png', clip: { x: 0, y: 0, width: 760, height: 110 } });
    pressureShot = true;
  }
  if (s && s.navOverflows) console.log('WARNING: nav overflow while showing', s.word);
  if (seen.length >= 9 && pressureShot) break;
  await page.waitForTimeout(2100);
}

// Mobile width check: does the brand row survive 375px while the longest word shows?
await page.setViewportSize({ width: 375, height: 740 });
await page.waitForTimeout(200);
const mobile = await page.evaluate(() => {
  const nav = document.querySelector('nav');
  return { navOverflows: nav ? nav.scrollWidth > nav.clientWidth + 1 : null, bodyOverflows: document.body.scrollWidth > 376 };
});
await page.screenshot({ path: 'scripts/flip-mobile.png', clip: { x: 0, y: 0, width: 375, height: 110 } });

console.log(JSON.stringify({ wordsSeen: seen, pressureScreenshot: pressureShot, mobile, consoleErrors }, null, 2));
await browser.close();
