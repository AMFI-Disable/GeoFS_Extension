import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');
const distDir = resolve(rootDir, 'dist');
const harnessHtml = readFileSync(resolve(__dirname, 'mock-geofs-harness.html'), 'utf8');

function findChromiumExecutable() {
  return process.env.CHROME_BIN || '/usr/bin/chromium';
}

async function assertNoHorizontalOverflow(page, label) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  assert(
    scrollWidth <= clientWidth + 2,
    `${label}: horizontal overflow detected (scrollWidth=${scrollWidth} > clientWidth=${clientWidth})`
  );
}

async function getExtensionId(context) {
  let [worker] = context.serviceWorkers();
  if (!worker) {
    worker = await context.waitForEvent('serviceworker', { timeout: 15000 });
  }
  const url = worker.url();
  const match = url.match(/^chrome-extension:\/\/([a-p]{32})\//);
  assert(match, `Failed to extract extension ID from service worker URL: ${url}`);
  return match[1];
}

async function run() {
  const userDataDir = mkdtempSync(resolve(tmpdir(), 'geofs-ext-e2e-'));
  console.log('[E2E] Launching Chromium with unpacked extension:', distDir);

  const context = await chromium.launchPersistentContext(userDataDir, {
    executablePath: findChromiumExecutable(),
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: [
      '--headless=new',
      `--disable-extensions-except=${distDir}`,
      `--load-extension=${distDir}`,
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const errors = [];
  const attachErrorTrap = (page, name) => {
    page.on('pageerror', (err) => errors.push(`${name} pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(`${name} console.error: ${msg.text()}`);
      }
    });
  };

  try {
    const extId = await getExtensionId(context);
    console.log('[E2E] Detected Extension ID:', extId);

    // Intercept GeoFS V3.9 & V4.0 URLs with local simulator harness
    await context.route(/^https:\/\/(www|beta)\.geo-fs\.com\/geofs\.php.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: harnessHtml
      });
    });

    // 1. Verify Popup Surface
    console.log('[E2E] Testing Popup UI...');
    const popupPage = await context.newPage();
    attachErrorTrap(popupPage, 'popup');
    await popupPage.goto(`chrome-extension://${extId}/popup/index.html`, { waitUntil: 'domcontentloaded' });
    await popupPage.waitForSelector('[data-surface="popup"]');
    await assertNoHorizontalOverflow(popupPage, 'popup');

    // Verify action launcher buttons exist
    const sideBtnText = await popupPage.locator('button:has-text("Side Panel")').textContent();
    const optBtnText = await popupPage.locator('button:has-text("Full Settings")').textContent();
    assert(sideBtnText && optBtnText, 'Popup missing Side Panel / Full Settings buttons');
    await popupPage.close();

    // 2. Verify Options New-Tab Page (All 4 Tabs + Enable OP Engines & Failure Simulator)
    console.log('[E2E] Testing Options Full Settings UI...');
    const optionsPage = await context.newPage();
    await optionsPage.setViewportSize({ width: 1280, height: 800 });
    attachErrorTrap(optionsPage, 'options');
    await optionsPage.goto(`chrome-extension://${extId}/options/index.html`, { waitUntil: 'domcontentloaded' });
    await optionsPage.waitForSelector('[data-surface="options"]');
    await assertNoHorizontalOverflow(optionsPage, 'options-tab1');

    // Enable Overpowered Engines and Failure Simulator from Extension Settings tab
    for (const label of ['Overpowered Engines', 'Failure Simulator']) {
      const row = optionsPage.locator('label.switch-row', { hasText: label });
      const checkbox = row.locator('input[type="checkbox"]');
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }

    // Visit Script Parameters tab
    await optionsPage.click('button:has-text("Script Parameters")');
    await optionsPage.waitForSelector('text=OP-SYNC Engagement Policy');
    await assertNoHorizontalOverflow(optionsPage, 'options-tab2');

    // Visit Aircraft Catalog & Checklists tab
    await optionsPage.click('button:has-text("Aircraft Catalog")');
    await optionsPage.waitForSelector('input[type="search"]');
    await assertNoHorizontalOverflow(optionsPage, 'options-tab3');

    // Visit Logbook & Verification tab
    await optionsPage.click('button:has-text("Logbook & Verification")');
    await optionsPage.waitForSelector('button:has-text("Download Verification Bundle")');
    await assertNoHorizontalOverflow(optionsPage, 'options-tab4');

    // 3. Open GeoFS V3.9 Harness Tab & Verify Genuine Content Injection + Native Styling
    console.log('[E2E] Testing GeoFS V3.9 injection, Native CSS, Layout Fit & Cross-Module Mechanics...');
    const simV3 = await context.newPage();
    await simV3.setViewportSize({ width: 1280, height: 800 });
    attachErrorTrap(simV3, 'geofs-v3');
    await simV3.goto('https://www.geo-fs.com/geofs.php?version=3.9', { waitUntil: 'networkidle' });
    await simV3.waitForFunction(() => Boolean(window.__geofsExt), { timeout: 15000 });
    await simV3.waitForSelector('#flightDataDisplay', { timeout: 10000 });
    await simV3.waitForSelector('#tab-btn-land', { timeout: 10000 });
    await simV3.waitForSelector('#opEngineCard', { state: 'attached', timeout: 10000 });
    await simV3.waitForSelector('#fail-btn', { timeout: 10000 });

    // Assert Titleless 4-Tab HUD + Native GeoFS CSS + Zero Wrapping/Overlap/Truncation
    const hudAudit = await simV3.evaluate(() => {
      const hud = document.getElementById('flightDataDisplay');
      const header = hud?.querySelector('.geofs-ext-hud-header');
      const tabsWrap = document.getElementById('hud-unified-tabs');
      const tabs = Array.from(tabsWrap?.querySelectorAll('button') || []);
      const style = hud ? getComputedStyle(hud) : null;
      const hudRect = hud?.getBoundingClientRect();
      const tabRects = tabs.map((t) => ({
        id: t.id,
        text: t.textContent?.trim(),
        rect: t.getBoundingClientRect().toJSON(),
        scrollWidth: t.scrollWidth,
        clientWidth: t.clientWidth,
        lineHeight: Number.parseFloat(getComputedStyle(t).lineHeight)
      }));
      return {
        headerChildIds: Array.from(header?.children || []).map((c) => c.id || c.className),
        headerText: header?.textContent?.replace(/\s+/g, '') || '',
        tabIds: tabs.map((t) => t.id),
        bg: style?.backgroundColor,
        borderRadius: style?.borderRadius,
        backdropFilter: style?.backdropFilter,
        hudWidth: hudRect?.width,
        tabRects
      };
    });

    assert.deepEqual(hudAudit.tabIds, ['tab-btn-info', 'tab-btn-checks', 'tab-btn-fuel', 'tab-btn-land']);
    assert.deepEqual(hudAudit.headerChildIds, ['geofs-ext-hud-grip', 'hud-unified-tabs', 'geofs-ext-hud-min']);
    assert.equal(hudAudit.headerText.toUpperCase(), 'INFOCHECKSFUELLAND−', 'HUD header must contain only the 4 tab labels and minimize symbol (no title)');
    assert.equal(hudAudit.bg, 'rgba(0, 0, 0, 0.8)');
    assert.equal(hudAudit.borderRadius, '15px');
    assert.equal(hudAudit.backdropFilter, 'none');
    assert(hudAudit.hudWidth >= 248 && hudAudit.hudWidth <= 255, `Expected 250px HUD width, got ${hudAudit.hudWidth}`);
    const firstTop = Math.round(hudAudit.tabRects[0].rect.top);
    for (let i = 0; i < hudAudit.tabRects.length; i++) {
      const t = hudAudit.tabRects[i];
      assert(Math.abs(t.rect.top - firstTop) <= 2, `HUD tab ${t.id} wrapped onto another row`);
      assert(t.rect.height <= 26, `HUD tab ${t.id} height too tall (${t.rect.height}), possible text wrap`);
      assert(t.scrollWidth <= t.clientWidth + 1, `HUD tab ${t.id} text truncated (${t.scrollWidth} > ${t.clientWidth})`);
      if (i > 0) {
        assert(hudAudit.tabRects[i - 1].rect.right <= t.rect.left + 0.5, `HUD tabs overlap horizontally`);
      }
    }

    // Assert minimize 40x40 circle + edge handle + viewport clamp on resize
    await simV3.click('.geofs-ext-hud-min');
    const minRect = await simV3.locator('#flightDataDisplay').boundingBox();
    assert(minRect && Math.round(minRect.width) === 40 && Math.round(minRect.height) === 40, 'Minimized HUD must be 40x40');
    await simV3.click('.geofs-ext-hud-min');

    // Drag HUD to left edge from header strip (must move panel WITHOUT switching off active INFO tab) -> verify #hudMinimizeBtn appears when minimized
    const hdrBox = await simV3.locator('.geofs-ext-hud-header').boundingBox();
    assert(hdrBox);
    await simV3.mouse.move(hdrBox.x + 120, hdrBox.y + 8);
    await simV3.mouse.down();
    await simV3.mouse.move(4, 150, { steps: 6 });
    await simV3.mouse.up();
    const activeTabAfterDrag = await simV3.locator('#tab-btn-info.is-active').count();
    assert.equal(activeTabAfterDrag, 1, 'Dragging across HUD header tabs must move HUD without switching tab');
    await simV3.click('.geofs-ext-hud-min');
    const edgeVisible = await simV3.locator('#hudMinimizeBtn').isVisible();
    assert.equal(edgeVisible, true, 'Left-edge handle should appear when HUD minimized near left edge');
    await simV3.click('#hudMinimizeBtn');

    // Verify dedicated SVG grip also drags smoothly back right slightly
    const gripBox = await simV3.locator('.geofs-ext-hud-grip').boundingBox();
    assert(gripBox);
    await simV3.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
    await simV3.mouse.down();
    await simV3.mouse.move(gripBox.x + 45, gripBox.y + 5, { steps: 4 });
    await simV3.mouse.up();
    const movedLeft = await simV3.evaluate(() => Number.parseFloat(document.getElementById('flightDataDisplay').style.left || '0'));
    assert(movedLeft >= 35, `Dragging .geofs-ext-hud-grip should move HUD right, got left=${movedLeft}`);

    // Resize narrow and verify HUD stays clamped inside viewport
    await simV3.setViewportSize({ width: 900, height: 650 });
    await simV3.waitForTimeout(100);
    const clampedBox = await simV3.locator('#flightDataDisplay').boundingBox();
    assert(clampedBox && clampedBox.x >= 0 && clampedBox.x + clampedBox.width <= 901, 'HUD should clamp within resized viewport');
    await simV3.setViewportSize({ width: 1280, height: 800 });

    // 4. Autothrottle Native Bar, LANDING LCD Font & OP-SYNC Prompt
    console.log('[E2E] Verifying Autothrottle, LANDING font, OP ENG Card & OP-SYNC...');
    const apBarInfo = await simV3.evaluate(() => {
      const apBar = document.querySelector('.geofs-autopilot-bar');
      const atBar = apBar?.querySelector('.ext-autothrottle-bar');
      const opBtn = apBar?.querySelector('.geofs-ext-op-bar-btn');
      const landLbl = apBar?.querySelector('.ext-autothrottle-landing-label');
      const tip = apBar?.querySelector('#autothrottle-tooltip');
      return {
        mountedInApBar: Boolean(atBar && opBtn),
        landingText: landLbl?.textContent?.trim(),
        landingFont: landLbl ? getComputedStyle(landLbl).fontFamily : '',
        mdlUpgraded: tip?.getAttribute('data-mdl-upgraded')
      };
    });
    assert.equal(apBarInfo.mountedInApBar, true, 'A/THR and OP ENG must mount inside .geofs-autopilot-bar');
    assert.equal(apBarInfo.landingText, 'LANDING');
    assert(apBarInfo.landingFont.includes('LCD-Bold'), `Expected LANDING font LCD-Bold, got ${apBarInfo.landingFont}`);
    assert.equal(apBarInfo.mdlUpgraded, 'true', 'MDL tooltips should upgrade when componentHandler exists');

    // Engage A/THR and dial target speed 450 vs 145 -> should trigger OP-SYNC Ask prompt
    await simV3.click('#autothrottle-button');

    // Assert expanded autopilot bar + bottom corner pills stay within viewport with zero mutual overlap
    const collisionCheck = await simV3.evaluate(() => {
      const box = (sel) => document.querySelector(sel)?.getBoundingClientRect().toJSON() ?? null;
      const boxes = {
        apBar: box('.geofs-autopilot-bar'),
        opBtn: box('#opEngineBarBtn'),
        failPill: box('#fail-btn'),
        fpvBtn: box('[data-geofs-ext-control="fpv-pad"]'),
        gsWidget: box('#flightDataDisplay0')
      };
      const overlaps = (a, b) =>
        Boolean(a && b && !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top));
      return {
        boxes,
        vw: window.innerWidth,
        vh: window.innerHeight,
        opVsFail: overlaps(boxes.opBtn, boxes.failPill),
        fpvVsFail: overlaps(boxes.fpvBtn, boxes.failPill),
        apVsFail: overlaps(boxes.apBar, boxes.failPill),
        gsVsFail: overlaps(boxes.gsWidget, boxes.failPill)
      };
    });
    assert(collisionCheck.boxes.apBar.width < 700, `Autopilot bar expanded abnormally wide (${collisionCheck.boxes.apBar.width}px)`);
    assert.equal(collisionCheck.opVsFail, false, '#opEngineBarBtn overlaps #fail-btn');
    assert.equal(collisionCheck.fpvVsFail, false, 'FPV corner button overlaps #fail-btn');
    assert.equal(collisionCheck.apVsFail, false, 'Autopilot bar overlaps #fail-btn');
    assert.equal(collisionCheck.gsVsFail, false, 'Glideslope widget overlaps #fail-btn');

    const speedInput = simV3.locator('.ext-autothrottle-speed');
    await speedInput.fill('450');
    await speedInput.press('Enter');
    await simV3.waitForSelector('#geofs-ext-toasts [data-prompt-id="op-sync-prompt"]', { timeout: 5000 });
    await simV3.click('[data-prompt-id="op-sync-prompt"] [data-action-id="allow-once"]');

    // Open OP ENG card & toggle SAS
    await simV3.click('.geofs-ext-op-bar-btn');
    await simV3.waitForSelector('#opEngineCard', { state: 'visible' });
    await simV3.click('#opSASBtn');

    // 5. Checklists Hardware Actuation & Fuel Weight Sync
    console.log('[E2E] Verifying Checklist Hardware Execution & Fuel Weight Sync...');
    await simV3.click('#tab-btn-checks');
    await simV3.waitForSelector('.geofs-ext-chk-phases');
    const lightsBefore = await simV3.evaluate(() => window.geofs.animation.values.lights);
    await simV3.locator('.geofs-ext-chk-item', { hasText: 'Lights' }).first().click();
    const lightsAfter = await simV3.evaluate(() => window.geofs.animation.values.lights);
    assert.notEqual(lightsAfter, lightsBefore, 'Clicking hardware sync item should toggle GeoFS lights control');

    await simV3.click('#tab-btn-fuel');
    await simV3.waitForSelector('text=ALTITUDE BURN');
    const oldDync = await simV3.locator('text=DYN SFC').count();
    assert.equal(oldDync, 0, 'Cryptic DYN SFC label must be replaced by ALTITUDE BURN');
    await simV3.click('[data-role="fuelDynamicSfc"]');

    // 6. Failure Simulator -> Emergency Checklist Override -> Contingency -> Restore
    console.log('[E2E] Verifying Failure Injection, Emergency QRH Override & Clean Restoration...');
    // Drag floating #fail-btn pill slightly left -> must move without opening #geofs-failure-menu
    const pillBefore = await simV3.locator('#fail-btn').boundingBox();
    assert(pillBefore);
    await simV3.mouse.move(pillBefore.x + pillBefore.width / 2, pillBefore.y + pillBefore.height / 2);
    await simV3.mouse.down();
    await simV3.mouse.move(pillBefore.x - 24, pillBefore.y - 12, { steps: 4 });
    await simV3.mouse.up();
    const pillAfter = await simV3.locator('#fail-btn').boundingBox();
    assert(pillAfter && pillAfter.x < pillBefore.x - 15, 'Dragging #fail-btn pill should reposition it');
    assert.equal(await simV3.locator('#geofs-failure-menu').isVisible(), false, 'Dragging #fail-btn must not toggle modal');

    await simV3.click('#fail-btn');
    await simV3.waitForSelector('#geofs-failure-menu', { state: 'visible' });
    await simV3.click('#geofs-failure-menu [data-failure-type="gearLeft"] button[data-action="fail"]');

    // Verify Checks tab opened automatically with emergency QRH header
    await simV3.waitForSelector('.geofs-ext-chk-recovery', { timeout: 5000 });
    const qrhTitle = await simV3.locator('#flightDataDisplay').textContent();
    assert(qrhTitle && qrhTitle.includes('EMERGENCY QRH'), 'Failure must override CHECKS with EMERGENCY QRH');

    // Force recovery failure chance 0% temporarily -> clicking ATTEMPT RECOVERY must update checklist to CONTINGENCY SOLUTION
    await optionsPage.bringToFront();
    await optionsPage.click('button:has-text("Script Parameters")');
    const recRow = optionsPage.locator('.field-row', { hasText: 'Base Recovery Success Chance' });
    const recInput = recRow.locator('input[type="range"]');
    await recInput.fill('0');
    await recInput.dispatchEvent('input');
    await recInput.dispatchEvent('change');

    await simV3.bringToFront();
    await simV3.waitForTimeout(200);
    await simV3.click('.geofs-ext-chk-recovery');
    await simV3.waitForSelector('text=CONTINGENCY SOLUTION', { timeout: 5000 });

    // Clear all failures & verify restoration
    await simV3.click('#geofs-failure-menu button:has-text("CLEAR ALL FAILURES")');
    await simV3.waitForFunction(
      () => window.geofs.aircraft.instance.suspensions.every((s) => s.collisionPoints[0][2] === -2.5),
      { timeout: 5000 }
    );

    // 7. FPV Cesium Billboard & Touchdown ScoreCard + Logbook Persistence
    console.log('[E2E] Verifying Cesium 3D FPV Billboard, Glideslope Widget & Slide-In Touchdown Card...');
    await simV3.waitForFunction(
      () => (window.geofs?.api?.viewer?.entities?._items?.length || 0) >= 1,
      { timeout: 5000 }
    );
    const fpvAudit = await simV3.evaluate(() => {
      const ent = window.geofs.api.viewer.entities._items[0];
      const gs = document.getElementById('flightDataDisplay0');
      return {
        imageUrl: ent?.billboard?.image,
        gsText: gs?.textContent?.trim(),
        gsVisible: gs ? getComputedStyle(gs).display !== 'none' : false
      };
    });
    assert(fpvAudit.imageUrl && fpvAudit.imageUrl.includes('assets/fpv_hires.png'), `Expected bundled hires FPV PNG, got ${fpvAudit.imageUrl}`);
    assert.equal(fpvAudit.gsVisible, true);
    assert(fpvAudit.gsText && fpvAudit.gsText.includes('°'), `Expected Glideslope readout, got ${fpvAudit.gsText}`);

    // Trigger clean touchdown transition: sample short-final airborne approach frames first, then contact ground
    await simV3.evaluate(() => {
      const vals = window.geofs.animation.values;
      vals.verticalSpeed = -95;
      vals.accZ = 10.2;
      vals.altitude = 18;
      vals.haglFeet = 18;
    });
    await simV3.waitForTimeout(100);
    await simV3.evaluate(() => {
      const vals = window.geofs.animation.values;
      vals.altitude = 0;
      vals.haglFeet = 0;
      window.geofs.aircraft.instance.groundContact = true;
    });
    await simV3.waitForSelector('#statsCard.addonpack-card.active', { timeout: 5000 });
    const statsContent = await simV3.locator('#statsCard').textContent();
    assert(statsContent && statsContent.includes('SILKY'), `Expected SILKY landing badge, got ${statsContent}`);

    // Confirm logbook persisted into Options Page Logbook tab
    await optionsPage.bringToFront();
    await optionsPage.click('button:has-text("Logbook & Verification")');
    await optionsPage.waitForSelector('td:has-text("Silky")', { timeout: 8000 });
    await simV3.close();

    // 8. Verify Chrome Side Panel + V4.0 UNAVAILABLE Indicators
    console.log('[E2E] Testing GeoFS V4.0 Tab + Side Panel Diagnostics & V4 UNAVAILABLE Badges...');
    const simV4 = await context.newPage();
    await simV4.setViewportSize({ width: 1280, height: 800 });
    attachErrorTrap(simV4, 'geofs-v4');
    await simV4.goto('https://beta.geo-fs.com/geofs.php?version=4.0', { waitUntil: 'networkidle' });
    await simV4.waitForFunction(
      () => (window.__geofsExtDiag || []).some((e) => e.code === 'REALISM_STATE' && e.payload?.simMajor === 4),
      { timeout: 10000 }
    );

    const sidePage = await context.newPage();
    await sidePage.setViewportSize({ width: 420, height: 800 });
    attachErrorTrap(sidePage, 'sidepanel');
    await sidePage.goto(`chrome-extension://${extId}/sidepanel/index.html`, { waitUntil: 'domcontentloaded' });
    await sidePage.waitForSelector('[data-surface="sidepanel"]');
    await sidePage.waitForSelector('text=UNAVAILABLE ON V4', { timeout: 10000 });
    await assertNoHorizontalOverflow(sidePage, 'sidepanel');
    await simV4.close();

    // 9. Missing Anchors Fallback Case
    console.log('[E2E] Testing Missing GeoFS DOM Anchors Fallback...');
    const fallbackPage = await context.newPage();
    await fallbackPage.setViewportSize({ width: 1280, height: 800 });
    attachErrorTrap(fallbackPage, 'fallback');
    await fallbackPage.goto('https://www.geo-fs.com/geofs.php?version=3.9&anchors=missing', { waitUntil: 'networkidle' });
    await fallbackPage.waitForSelector('#geofs-ext-zone-autopilot .ext-autothrottle-bar', { timeout: 10000 });

    assert.equal(errors.length, 0, `Unexpected browser errors:\n${errors.join('\n')}`);
    console.log('[E2E] ALL REAL-BROWSER CHROME EXTENSION E2E CHECKS PASSED!');
  } finally {
    await context.close();
    rmSync(userDataDir, { recursive: true, force: true });
  }
}

run().catch((err) => {
  console.error('[E2E] FAILED:', err);
  process.exit(1);
});
