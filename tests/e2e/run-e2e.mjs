import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');
const distDir = resolve(rootDir, 'dist');
const harnessHtml = readFileSync(resolve(__dirname, 'mock-geofs-harness.html'), 'utf8');

function resolveLaunchOptions() {
  const explicitBin = process.env.E2E_CHROME_BIN || process.env.CHROME_BIN;
  const playwrightBin = (() => {
    try {
      const p = chromium.executablePath();
      return p && existsSync(p) ? p : null;
    } catch {
      return null;
    }
  })();

  if (playwrightBin && (!explicitBin || /google-chrome/i.test(explicitBin))) {
    return {
      label: `Playwright Chromium (${playwrightBin})`,
      options: {
        channel: 'chromium',
        headless: true
      }
    };
  }

  const candidates = [
    explicitBin,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome'
  ].filter(Boolean);

  for (const path of candidates) {
    if (existsSync(path)) {
      return {
        label: path,
        options: {
          executablePath: path,
          headless: false,
          extraArgs: ['--headless=new']
        }
      };
    }
  }

  return {
    label: 'Playwright Chromium (default)',
    options: {
      channel: 'chromium',
      headless: true
    }
  };
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
    worker = await context.waitForEvent('serviceworker', { timeout: 30000 });
  }
  const url = worker.url();
  const match = url.match(/^chrome-extension:\/\/([a-p]{32})\//);
  assert(match, `Failed to extract extension ID from service worker URL: ${url}`);
  return match[1];
}

async function run() {
  const userDataDir = mkdtempSync(resolve(tmpdir(), 'geofs-ext-e2e-'));
  const launch = resolveLaunchOptions();
  console.log('[E2E] Launching Chromium with unpacked extension:', distDir);
  console.log('[E2E] Browser:', launch.label);

  const { extraArgs = [], ...launchOverrides } = launch.options;
  const context = await chromium.launchPersistentContext(userDataDir, {
    ...launchOverrides,
    viewport: { width: 1280, height: 800 },
    args: [
      ...extraArgs,
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

    // Intercept GeoFS V3.9 & V4.0 URLs with local simulator harness (and blank non-sim page for homepage test)
    await context.route(/^https:\/\/([a-z0-9-]+\.)?geo-fs\.com\/.*/, async (route) => {
      const url = route.request().url();
      if (url.includes('/pages/')) {
        await route.fulfill({
          status: 200,
          contentType: 'text/html; charset=utf-8',
          body: '<!doctype html><html><body>GeoFS Help Page</body></html>'
        });
        return;
      }
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
    const sideBtnVisible = await popupPage.locator('button[aria-label="Open Side Panel"]').isVisible();
    const optBtnVisible = await popupPage.locator('button[aria-label="Open Full Settings"]').isVisible();
    assert(sideBtnVisible && optBtnVisible, 'Popup missing Side Panel / Full Settings buttons');
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

    assert.deepEqual(hudAudit.tabIds, ['tab-btn-info', 'tab-btn-checks', 'tab-btn-fuel', 'tab-btn-land', 'hud-tab-add-btn']);
    assert.deepEqual(hudAudit.headerChildIds, ['geofs-ext-hud-grip', 'hud-unified-tabs', 'geofs-ext-hud-min']);
    assert.equal(hudAudit.headerText.toUpperCase(), 'INFO×CHECKS×FUEL×LAND×+−', 'HUD header must contain only the 4 tab labels with close buttons, +, and minimize symbol (no title)');
    assert.equal(hudAudit.bg, 'rgba(255, 255, 255, 0.92)');
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

    // Assert consistent grab cursor across all HUD parts (no pointer/move cursor switching)
    const hudCursorAudit = await simV3.evaluate(() => ({
      hud: getComputedStyle(document.getElementById('flightDataDisplay')).cursor,
      header: getComputedStyle(document.querySelector('#flightDataDisplay .geofs-ext-hud-header')).cursor,
      grip: getComputedStyle(document.querySelector('#flightDataDisplay .geofs-ext-hud-grip')).cursor,
      tab: getComputedStyle(document.getElementById('tab-btn-info')).cursor,
      minBtn: getComputedStyle(document.querySelector('#flightDataDisplay .geofs-ext-hud-min')).cursor,
      body: getComputedStyle(document.querySelector('#flightDataDisplay .geofs-ext-hud-body')).cursor
    }));
    for (const [part, cur] of Object.entries(hudCursorAudit)) {
      assert.equal(cur, 'grab', `HUD ${part} must consistently show grab cursor, got ${cur}`);
    }

    // Verify compact "Minimize HUD" tooltip replaces native title and anchors snugly near button
    await simV3.hover('.geofs-ext-hud-min');
    const minTipAudit = await simV3.evaluate(() => {
      const btn = document.querySelector('.geofs-ext-hud-min');
      const tipStyle = btn ? getComputedStyle(btn, '::after') : null;
      return {
        hasTitle: btn?.hasAttribute('title') ?? false,
        hudTip: btn?.getAttribute('data-hud-tip'),
        tipContent: tipStyle?.content,
        tipTop: tipStyle?.top
      };
    });
    assert.equal(minTipAudit.hasTitle, false, 'Minimize button must not use native title that triggers displaced GeoFS tooltips');
    assert.equal(minTipAudit.hudTip, 'Minimize HUD');
    assert.equal(minTipAudit.tipContent, '"Minimize HUD"');
    const tipTopPx = Number.parseFloat(minTipAudit.tipTop || '0');
    assert(tipTopPx >= 24 && tipTopPx <= 32, `Minimize HUD tooltip should anchor snugly (~26px below top edge of 22px button), got ${minTipAudit.tipTop}`);

    // Assert minimize 40x40 circle (with edge button hidden -> single HUD button only) + restore
    await simV3.click('.geofs-ext-hud-min');
    const minRect = await simV3.locator('#flightDataDisplay').boundingBox();
    assert(minRect && Math.round(minRect.width) === 40 && Math.round(minRect.height) === 40, 'Minimized HUD must be 40x40');
    assert.equal(await simV3.locator('#hudMinimizeBtn').isVisible(), false, 'Edge button must stay hidden when 40x40 HUD button is visible');
    const minCursor = await simV3.evaluate(() => ({
      hud: getComputedStyle(document.getElementById('flightDataDisplay')).cursor,
      btn: getComputedStyle(document.querySelector('#flightDataDisplay .geofs-ext-hud-min')).cursor
    }));
    assert.equal(minCursor.hud, 'grab');
    assert.equal(minCursor.btn, 'grab');
    await simV3.click('.geofs-ext-hud-min');

    // Drag HUD to left edge from header strip (must show grabbing cursor globally without flash and move WITHOUT switching off INFO tab)
    const hudGripBox = await simV3.locator('.geofs-ext-hud-grip').boundingBox();
    assert(hudGripBox);
    await simV3.mouse.move(hudGripBox.x + hudGripBox.width / 2, hudGripBox.y + hudGripBox.height / 2);
    await simV3.mouse.down();
    await simV3.mouse.move(4, 150, { steps: 6 });
    const midDragCursor = await simV3.evaluate(() => ({
      draggingClass: document.documentElement.classList.contains('geofs-ext-dragging'),
      bodyCursor: getComputedStyle(document.body).cursor,
      tabCursor: getComputedStyle(document.getElementById('tab-btn-info')).cursor
    }));
    assert.equal(midDragCursor.draggingClass, true, 'Active drag must apply global geofs-ext-dragging class');
    assert.equal(midDragCursor.bodyCursor, 'grabbing', 'Global cursor must lock to grabbing while dragging');
    assert.equal(midDragCursor.tabCursor, 'grabbing', 'Child elements must keep grabbing cursor during drag');
    await simV3.mouse.up();
    assert.equal(
      await simV3.evaluate(() => document.documentElement.classList.contains('geofs-ext-dragging')),
      false,
      'geofs-ext-dragging class must clear cleanly after mouseup'
    );
    const activeTabAfterDrag = await simV3.locator('#tab-btn-info.is-active').count();
    assert.equal(activeTabAfterDrag, 1, 'Dragging across HUD header tabs must move HUD without switching tab');

    // Minimizing near left edge swaps cleanly to a SINGLE #hudMinimizeBtn (hiding #flightDataDisplay)
    await simV3.click('.geofs-ext-hud-min');
    const edgeVisible = await simV3.locator('#hudMinimizeBtn').isVisible();
    const hudVisibleWhenDocked = await simV3.locator('#flightDataDisplay').isVisible();
    assert.equal(edgeVisible, true, 'Left-edge handle should appear when HUD minimized near left edge');
    assert.equal(hudVisibleWhenDocked, false, 'Only one HUD button must be visible when docked at left edge');

    // Vertical drag along left border keeps #hudMinimizeBtn at x=0 without expanding HUD
    const edgeBoxBefore = await simV3.locator('#hudMinimizeBtn').boundingBox();
    const edgeCursor = await simV3.evaluate(() => getComputedStyle(document.getElementById('hudMinimizeBtn')).cursor);
    assert.equal(edgeCursor, 'grab', 'Edge HUD button must show grab cursor');
    assert(edgeBoxBefore);
    await simV3.mouse.move(edgeBoxBefore.x + edgeBoxBefore.width / 2, edgeBoxBefore.y + edgeBoxBefore.height / 2);
    await simV3.mouse.down();
    await simV3.mouse.move(edgeBoxBefore.x + 8, edgeBoxBefore.y + 90, { steps: 6 });
    const edgeDraggingCursor = await simV3.evaluate(() => getComputedStyle(document.getElementById('hudMinimizeBtn')).cursor);
    assert.equal(edgeDraggingCursor, 'grabbing');
    await simV3.mouse.up();
    const edgeBoxAfter = await simV3.locator('#hudMinimizeBtn').boundingBox();
    assert(edgeBoxAfter, 'Edge HUD button should still exist after vertical border drag');
    assert.equal(Math.round(edgeBoxAfter.x), 0, `Edge HUD button must stay on x=0 during vertical drag, got x=${edgeBoxAfter.x}`);
    assert(edgeBoxAfter.y >= edgeBoxBefore.y + 70, `Edge HUD button did not move vertically (before=${edgeBoxBefore.y}, after=${edgeBoxAfter.y})`);
    assert.equal(await simV3.locator('#flightDataDisplay').isVisible(), false, 'Vertical drag of #hudMinimizeBtn must not reopen HUD');

    // Dragging #hudMinimizeBtn outside of the left border transforms it into the small 40x40 HUD circle
    await simV3.mouse.move(edgeBoxAfter.x + edgeBoxAfter.width / 2, edgeBoxAfter.y + edgeBoxAfter.height / 2);
    await simV3.mouse.down();
    await simV3.mouse.move(110, edgeBoxAfter.y + 20, { steps: 6 });
    await simV3.mouse.up();
    const pulledOutBox = await simV3.locator('#flightDataDisplay').boundingBox();
    assert.equal(await simV3.locator('#hudMinimizeBtn').isVisible(), false, 'Dragging side-button outside border must hide side-button');
    assert.equal(await simV3.locator('#flightDataDisplay.is-minimized').isVisible(), true, 'Dragging side-button outside border must show small HUD circle');
    assert(pulledOutBox && Math.round(pulledOutBox.width) === 40 && Math.round(pulledOutBox.height) === 40 && pulledOutBox.x >= 70, 'Dragged-out HUD circle should be 40x40 away from left border');

    // Dragging the 40x40 HUD circle back onto the left border returns to #hudMinimizeBtn
    await simV3.mouse.move(pulledOutBox.x + 20, pulledOutBox.y + 20);
    await simV3.mouse.down();
    await simV3.mouse.move(6, pulledOutBox.y, { steps: 6 });
    await simV3.mouse.up();
    assert.equal(await simV3.locator('#hudMinimizeBtn').isVisible(), true, 'Dragging HUD circle back to left border must dock to #hudMinimizeBtn');

    await simV3.click('#hudMinimizeBtn');
    assert.equal(await simV3.locator('#hudMinimizeBtn').isVisible(), false, 'Clicking edge handle must hide edge button and show full HUD');

    // Verify dedicated SVG grip also drags smoothly back right slightly
    const gripBox = await simV3.locator('.geofs-ext-hud-grip').boundingBox();
    assert(gripBox);
    await simV3.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
    await simV3.mouse.down();
    await simV3.mouse.move(gripBox.x + 45, gripBox.y + 5, { steps: 4 });
    await simV3.mouse.up();
    const movedLeft = await simV3.evaluate(() => Number.parseFloat(document.getElementById('flightDataDisplay').style.left || '0'));
    assert(movedLeft >= 35, `Dragging .geofs-ext-hud-grip should move HUD right, got left=${movedLeft}`);

    // Verify scaled HUD (1.35x) drags without coordinate jump
    await simV3.evaluate(() => document.documentElement.style.setProperty('--geofs-ext-scale', '1.35'));
    const scaledBefore = await simV3.locator('#flightDataDisplay').boundingBox();
    assert(scaledBefore);
    await simV3.mouse.move(scaledBefore.x + 12, scaledBefore.y + 12);
    await simV3.mouse.down();
    await simV3.mouse.move(scaledBefore.x + 32, scaledBefore.y + 22, { steps: 4 });
    await simV3.mouse.up();
    const scaledAfter = await simV3.locator('#flightDataDisplay').boundingBox();
    assert(
      scaledAfter && Math.abs(scaledAfter.x - (scaledBefore.x + 20)) <= 4,
      `Scaled HUD drag jumped unexpectedly: before=${scaledBefore.x}, after=${scaledAfter?.x}`
    );
    await simV3.evaluate(() => document.documentElement.style.setProperty('--geofs-ext-scale', '1'));

    // Resize narrow and verify HUD stays clamped inside viewport
    await simV3.setViewportSize({ width: 900, height: 650 });
    await simV3.waitForTimeout(100);
    const clampedBox = await simV3.locator('#flightDataDisplay').boundingBox();
    assert(clampedBox && clampedBox.x >= 0 && clampedBox.x + clampedBox.width <= 901, 'HUD should clamp within resized viewport');
    await simV3.setViewportSize({ width: 1280, height: 800 });

    // 4. Autothrottle Native Bar, LANDING LCD Font & OP-SYNC Prompt
    console.log('[E2E] Verifying Autothrottle, OP ENG Native AUTOPILOT Parity, LANDING font & OP-SYNC...');
    const apBarInfo = await simV3.evaluate(() => {
      const apBar = document.querySelector('.geofs-autopilot-bar');
      const nativePad = apBar?.querySelector('.geofs-autopilot-pad');
      const nativeLbl = nativePad?.querySelector('.control-pad-label');
      const atBar = apBar?.querySelector('.ext-autothrottle-bar');
      const atPad = apBar?.querySelector('#autothrottle-button');
      const atPadLbl = atPad?.querySelector('.control-pad-label');
      const opBtn = apBar?.querySelector('#opEngineBarBtn');
      const opPadLbl = opBtn?.querySelector('.control-pad-label');
      const ktsSwitch = apBar?.querySelector('[data-speed-mode="knots"]');
      const landLbl = apBar?.querySelector('.ext-autothrottle-landing-label');
      const tip = apBar?.querySelector('#autothrottle-tooltip');
      const box = (el) => el?.getBoundingClientRect().toJSON() ?? null;
      const midY = (r) => (r ? (r.top + r.bottom) / 2 : null);
      const nativeBox = box(nativePad);
      const atBox = box(atPad);
      const opBox = box(opBtn);
      return {
        mountedInApBar: Boolean(nativePad && atBar && atPad && opBtn),
        opText: opPadLbl?.textContent?.trim(),
        atText: atPadLbl?.textContent?.trim(),
        nativeWidth: nativeBox?.width ?? 0,
        nativeHeight: nativeBox?.height ?? 0,
        atWidth: atBox?.width ?? 0,
        atHeight: atBox?.height ?? 0,
        opWidth: opBox?.width ?? 0,
        opHeight: opBox?.height ?? 0,
        nativeMidY: midY(nativeBox),
        atMidY: midY(atBox),
        opMidY: midY(opBox),
        nativeRadius: nativePad ? getComputedStyle(nativePad).borderRadius : '',
        atRadius: atPad ? getComputedStyle(atPad).borderRadius : '',
        opRadius: opBtn ? getComputedStyle(opBtn).borderRadius : '',
        nativeFontSize: nativeLbl ? getComputedStyle(nativeLbl).fontSize : '',
        atFontSize: atPadLbl ? getComputedStyle(atPadLbl).fontSize : '',
        opFontSize: opPadLbl ? getComputedStyle(opPadLbl).fontSize : '',
        atPadWeight: atPadLbl ? getComputedStyle(atPadLbl).fontWeight : '',
        opPadWeight: opPadLbl ? getComputedStyle(opPadLbl).fontWeight : '',
        ktsWeight: ktsSwitch ? getComputedStyle(ktsSwitch).fontWeight : '',
        landingText: landLbl?.textContent?.trim(),
        landingFont: landLbl ? getComputedStyle(landLbl).fontFamily : '',
        mdlUpgraded: tip?.getAttribute('data-mdl-upgraded')
      };
    });
    assert.equal(apBarInfo.mountedInApBar, true, 'AUTOPILOT, A/THR and OP ENG must mount inside .geofs-autopilot-bar');
    assert.equal(apBarInfo.opText, 'OP ENG', `Expected OP ENG button text, got ${apBarInfo.opText}`);
    assert.equal(apBarInfo.atText, 'A/THR', `Expected A/THR button text, got ${apBarInfo.atText}`);
    assert(apBarInfo.atWidth >= 40 && apBarInfo.atWidth < apBarInfo.nativeWidth, `A/THR width (${apBarInfo.atWidth}) must fit its label compactly (< ${apBarInfo.nativeWidth})`);
    assert(Math.abs(apBarInfo.atHeight - apBarInfo.nativeHeight) <= 0.5, `A/THR height (${apBarInfo.atHeight}) must match AUTOPILOT (${apBarInfo.nativeHeight})`);
    assert(apBarInfo.opWidth >= 45 && apBarInfo.opWidth < apBarInfo.nativeWidth, `OP ENG width (${apBarInfo.opWidth}) must fit its label compactly (< ${apBarInfo.nativeWidth})`);
    assert(Math.abs(apBarInfo.opHeight - apBarInfo.nativeHeight) <= 0.5, `OP ENG height (${apBarInfo.opHeight}) must match AUTOPILOT (${apBarInfo.nativeHeight})`);
    assert(Math.abs(apBarInfo.atMidY - apBarInfo.nativeMidY) <= 1, `A/THR vertical alignment (${apBarInfo.atMidY}) must match AUTOPILOT (${apBarInfo.nativeMidY})`);
    assert(Math.abs(apBarInfo.opMidY - apBarInfo.nativeMidY) <= 1, `OP ENG vertical alignment (${apBarInfo.opMidY}) must match AUTOPILOT (${apBarInfo.nativeMidY})`);
    assert.equal(apBarInfo.atRadius, apBarInfo.nativeRadius, 'A/THR borderRadius must match AUTOPILOT');
    assert.equal(apBarInfo.opRadius, apBarInfo.nativeRadius, 'OP ENG borderRadius must match AUTOPILOT');
    assert.equal(apBarInfo.atFontSize, apBarInfo.nativeFontSize, 'A/THR fontSize must match AUTOPILOT');
    assert.equal(apBarInfo.opFontSize, apBarInfo.nativeFontSize, 'OP ENG fontSize must match AUTOPILOT');
    assert.equal(apBarInfo.atPadWeight, '400', `A/THR pad must not be bold, got fontWeight=${apBarInfo.atPadWeight}`);
    assert.equal(apBarInfo.opPadWeight, '400', `OP ENG pad must not be bold, got fontWeight=${apBarInfo.opPadWeight}`);
    assert.equal(apBarInfo.ktsWeight, '400', `Autothrottle switch must not be bold, got fontWeight=${apBarInfo.ktsWeight}`);
    assert.equal(apBarInfo.landingText, 'LANDING');
    assert(apBarInfo.landingFont.includes('LCD-Bold'), `Expected LANDING font LCD-Bold, got ${apBarInfo.landingFont}`);
    assert.equal(apBarInfo.mdlUpgraded, 'true', 'MDL tooltips should upgrade when componentHandler exists');

    // Engage A/THR and verify expanded Autopilot-style layout (switches beneath main controls, big LCD LANDING, matching OFF/ARM & KTS/M. buttons)
    await simV3.click('#autothrottle-button');

    const collisionCheck = await simV3.evaluate(() => {
      const box = (sel) => document.querySelector(sel)?.getBoundingClientRect().toJSON() ?? null;
      const speedBox = box('.ext-autothrottle-speed');
      const speedSwitchBox = box('.ext-autothrottle-control:not(.ext-autothrottle-landing) .ext-autothrottle-switch');
      const landLbl = document.querySelector('.ext-autothrottle-landing-label');
      const landLblBox = landLbl?.getBoundingClientRect().toJSON() ?? null;
      const landSwitchBox = box('#autothrottle-landing-mode-switch');
      const ktsBtn = document.querySelector('[data-speed-mode="knots"]');
      const offBtn = document.querySelector('[data-arm="off"]');
      const speedInput = document.querySelector('.ext-autothrottle-speed');
      const boxes = {
        apBar: box('.geofs-autopilot-bar'),
        opBtn: box('#opEngineBarBtn'),
        failPill: box('#fail-btn'),
        topHudBtn: box('[data-geofs-ext-control="top-hud-toggle"]'),
        rightChecksBtn: box('[data-geofs-ext-control="checklist-right-pad"]'),
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
        apVsFail: overlaps(boxes.apBar, boxes.failPill),
        gsVsFail: overlaps(boxes.gsWidget, boxes.failPill),
        expandedLayout: {
          speedBox,
          speedSwitchBox,
          landLblBox,
          landSwitchBox,
          speedFontSize: speedInput ? getComputedStyle(speedInput).fontSize : '',
          landFontSize: landLbl ? getComputedStyle(landLbl).fontSize : '',
          ktsRect: ktsBtn?.getBoundingClientRect().toJSON() ?? null,
          offRect: offBtn?.getBoundingClientRect().toJSON() ?? null,
          ktsBorder: ktsBtn ? getComputedStyle(ktsBtn).borderColor : '',
          offBorder: offBtn ? getComputedStyle(offBtn).borderColor : '',
          ktsBg: ktsBtn ? getComputedStyle(ktsBtn).backgroundColor : '',
          offBg: offBtn ? getComputedStyle(offBtn).backgroundColor : '',
          offWeight: offBtn ? getComputedStyle(offBtn).fontWeight : '',
          offFontSize: offBtn ? getComputedStyle(offBtn).fontSize : '',
          ktsFontSize: ktsBtn ? getComputedStyle(ktsBtn).fontSize : ''
        }
      };
    });
    const exp = collisionCheck.expandedLayout;
    assert(exp.speedBox && exp.speedSwitchBox && exp.speedSwitchBox.top >= exp.speedBox.bottom - 0.5,
      `KTS/M. switch must sit beneath speed number box (speed bottom=${exp.speedBox?.bottom}, switch top=${exp.speedSwitchBox?.top})`);
    assert(exp.landLblBox && exp.landSwitchBox && exp.landSwitchBox.top >= exp.landLblBox.bottom - 0.5,
      `OFF/ARM switch must sit beneath LANDING label (label bottom=${exp.landLblBox?.bottom}, switch top=${exp.landSwitchBox?.top})`);
    assert.equal(exp.landFontSize, exp.speedFontSize, `LANDING font size (${exp.landFontSize}) must match Autopilot number (${exp.speedFontSize})`);
    assert(exp.landLblBox.height >= 24 && Math.abs(exp.landLblBox.height - exp.speedBox.height) <= 1,
      `LANDING height (${exp.landLblBox?.height}) must match speed number box (${exp.speedBox?.height})`);
    assert(Math.abs(exp.offRect.width - exp.ktsRect.width) <= 0.5 && Math.abs(exp.offRect.height - exp.ktsRect.height) <= 0.5,
      `OFF/ARM button size (${exp.offRect?.width}x${exp.offRect?.height}) must match KTS/M. (${exp.ktsRect?.width}x${exp.ktsRect?.height})`);
    assert.equal(exp.offFontSize, exp.ktsFontSize, 'OFF/ARM and KTS/M. button font sizes must match');
    assert.equal(exp.offWeight, '400', 'OFF/ARM switch must not be bold');
    assert.equal(exp.offBorder, exp.ktsBorder, `Selected OFF border (${exp.offBorder}) must match selected KTS border (${exp.ktsBorder})`);
    assert.equal(exp.offBg, exp.ktsBg, `Selected OFF background (${exp.offBg}) must match selected KTS background (${exp.ktsBg})`);
    assert(collisionCheck.boxes.apBar.width < 700, `Autopilot bar expanded abnormally wide (${collisionCheck.boxes.apBar.width}px)`);
    assert.equal(collisionCheck.boxes.topHudBtn, null, 'Excessive unmovable top-bar HUD button must not be mounted');
    assert.equal(collisionCheck.boxes.rightChecksBtn, null, 'Unmovable right-bar CHECKS button must not be mounted');
    assert.equal(collisionCheck.boxes.fpvBtn, null, 'Unmovable corner FPV button must not be mounted');
    assert.equal(collisionCheck.opVsFail, false, '#opEngineBarBtn overlaps #fail-btn');
    assert.equal(collisionCheck.apVsFail, false, 'Autopilot bar overlaps #fail-btn');
    assert.equal(collisionCheck.gsVsFail, false, 'Glideslope widget overlaps #fail-btn');

    const speedInput = simV3.locator('.ext-autothrottle-speed');
    await speedInput.fill('450');
    await speedInput.press('Enter');
    await simV3.waitForSelector('#geofs-ext-toasts [data-prompt-id="op-sync-prompt"]', { timeout: 5000 });
    await simV3.click('[data-prompt-id="op-sync-prompt"] [data-action-id="allow-once"]');

    // Open OP ENG card, verify grab cursor & smooth drag, & toggle SAS
    await simV3.click('.geofs-ext-op-bar-btn');
    await simV3.waitForSelector('#opEngineCard', { state: 'visible' });
    const opHeaderCur = await simV3.evaluate(() => getComputedStyle(document.getElementById('opEngineHeader')).cursor);
    assert.equal(opHeaderCur, 'grab', `#opEngineHeader must show grab cursor, got ${opHeaderCur}`);
    const opHdrBox = await simV3.locator('#opEngineHeader').boundingBox();
    assert(opHdrBox);
    await simV3.mouse.move(opHdrBox.x + 40, opHdrBox.y + 12);
    await simV3.mouse.down();
    await simV3.mouse.move(opHdrBox.x + 70, opHdrBox.y + 22, { steps: 4 });
    assert.equal(await simV3.evaluate(() => document.documentElement.classList.contains('geofs-ext-dragging')), true);
    await simV3.mouse.up();
    const opHdrAfter = await simV3.locator('#opEngineHeader').boundingBox();
    assert(opHdrAfter && opHdrAfter.x >= opHdrBox.x + 20, 'OP Engine card header drag should reposition card');
    await simV3.click('#opSASBtn');
    const opCardLayout = await simV3.evaluate(() => {
      const card = document.getElementById('opEngineCard');
      const rect = card?.getBoundingClientRect();
      return { width: rect?.width ?? 0, scrollWidth: card?.scrollWidth ?? 0, clientWidth: card?.clientWidth ?? 0 };
    });
    assert(opCardLayout.width >= 319 && opCardLayout.width <= 321, `Expected fixed 320px OP card, got ${opCardLayout.width}`);
    assert(opCardLayout.scrollWidth <= opCardLayout.clientWidth + 1, 'OP card must not horizontally overflow');

    // 5. Checklists Hardware Actuation, Non-Scrolling HUD Audit & Fuel Weight Sync
    console.log('[E2E] Verifying Checklist Hardware Execution, Non-Scrolling Full HUD & Fuel Weight Sync...');
    const assertHudNoScroll = async (tabName) => {
      const hudBody = await simV3.evaluate(() => {
        const hud = document.getElementById('flightDataDisplay');
        const body = hud?.querySelector('.geofs-ext-hud-body');
        const st = body ? getComputedStyle(body) : null;
        return {
          overflowY: st?.overflowY,
          scrollHeight: body?.scrollHeight ?? 0,
          clientHeight: body?.clientHeight ?? 0,
          hudScrollWidth: hud?.scrollWidth ?? 0,
          hudClientWidth: hud?.clientWidth ?? 0
        };
      });
      assert.equal(hudBody.overflowY, 'visible', `HUD ${tabName} body must not scroll (overflowY=${hudBody.overflowY})`);
      assert(hudBody.scrollHeight <= hudBody.clientHeight + 2, `HUD ${tabName} body overflowed vertically (${hudBody.scrollHeight} > ${hudBody.clientHeight})`);
      assert(hudBody.hudScrollWidth <= hudBody.hudClientWidth + 1, `HUD ${tabName} overflowed horizontally`);
    };

    await assertHudNoScroll('INFO');
    await simV3.click('#tab-btn-checks');
    await simV3.waitForSelector('.geofs-ext-chk-phases');
    const chkCur = await simV3.evaluate(() => getComputedStyle(document.querySelector('.geofs-ext-chk-item')).cursor);
    assert.equal(chkCur, 'grab', `Checklist items inside HUD must keep grab cursor, got ${chkCur}`);
    await assertHudNoScroll('CHECKS');
    await simV3.click('.geofs-ext-chk-btn:has-text("GUIDE")');
    await simV3.waitForSelector('text=Situational Procedures Guide');
    await assertHudNoScroll('CHECKS-GUIDE');
    await simV3.click('.geofs-ext-chk-btn:has-text("GUIDE")');
    await simV3.waitForSelector('.geofs-ext-chk-item');
    const lightsBefore = await simV3.evaluate(() => window.geofs.animation.values.lights);
    await simV3.locator('.geofs-ext-chk-item', { hasText: 'Lights' }).first().click();
    const lightsAfter = await simV3.evaluate(() => window.geofs.animation.values.lights);
    assert.notEqual(lightsAfter, lightsBefore, 'Clicking hardware sync item should toggle GeoFS lights control');

    await simV3.click('#tab-btn-fuel');
    await simV3.waitForSelector('text=ALTITUDE BURN');
    await assertHudNoScroll('FUEL');
    const fuelBtnCur = await simV3.evaluate(() => getComputedStyle(document.querySelector('[data-role="fuelDynamicSfc"]')).cursor);
    assert.equal(fuelBtnCur, 'grab', `Fuel buttons inside HUD must keep grab cursor, got ${fuelBtnCur}`);
    const oldDync = await simV3.locator('text=DYN SFC').count();
    assert.equal(oldDync, 0, 'Cryptic DYN SFC label must be replaced by ALTITUDE BURN');
    await simV3.click('[data-role="fuelDynamicSfc"]');

    await simV3.click('#tab-btn-land');
    await assertHudNoScroll('LAND');
    await simV3.click('#tab-btn-info');

    // 6. Failure Simulator -> Emergency Checklist Override -> Contingency -> Restore
    console.log('[E2E] Verifying Failure Injection, Emergency QRH Override & Clean Restoration...');
    const failPillCur = await simV3.evaluate(() => getComputedStyle(document.getElementById('fail-btn')).cursor);
    assert.equal(failPillCur, 'grab', `#fail-btn pill must show grab cursor, got ${failPillCur}`);
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
    const failModalAudit = await simV3.evaluate(() => {
      const modal = document.getElementById('geofs-failure-menu');
      const sections = modal?.querySelector('[data-role="sections"]');
      const grids = Array.from(modal?.querySelectorAll('[data-section-grid-cols]') || []).map((g) => ({
        cols: Number(g.dataset.sectionGridCols),
        items: g.children.length
      }));
      return {
        width: modal?.getBoundingClientRect().width ?? 0,
        sectionsOverflowY: sections ? getComputedStyle(sections).overflowY : '',
        scrollHeight: sections?.scrollHeight ?? 0,
        clientHeight: sections?.clientHeight ?? 0,
        grids
      };
    });
    assert(failModalAudit.width >= 459 && failModalAudit.width <= 461, `Expected fixed 460px Failure modal, got ${failModalAudit.width}`);
    assert.equal(failModalAudit.sectionsOverflowY, 'visible', 'Failure modal sections must not scroll');
    assert(failModalAudit.scrollHeight <= failModalAudit.clientHeight + 2, 'Failure modal sections overflowed vertically');
    for (const g of failModalAudit.grids) {
      assert.equal(g.items % g.cols, 0, `Failure section grid (${g.items} items / ${g.cols} cols) has blank trailing cell`);
    }
    const failHdrCur = await simV3.evaluate(() => getComputedStyle(document.getElementById('fail-header')).cursor);
    assert.equal(failHdrCur, 'grab', `#fail-header must show grab cursor, got ${failHdrCur}`);
    const failHdrBox = await simV3.locator('#fail-header').boundingBox();
    assert(failHdrBox);
    await simV3.mouse.move(failHdrBox.x + 50, failHdrBox.y + 12);
    await simV3.mouse.down();
    await simV3.mouse.move(failHdrBox.x + 80, failHdrBox.y + 22, { steps: 4 });
    assert.equal(await simV3.evaluate(() => document.documentElement.classList.contains('geofs-ext-dragging')), true);
    await simV3.mouse.up();
    const failHdrAfter = await simV3.locator('#fail-header').boundingBox();
    assert(failHdrAfter && failHdrAfter.x >= failHdrBox.x + 20, 'Failure modal header drag should reposition modal');
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
      const gsStyle = gs ? getComputedStyle(gs) : null;
      const span = gs?.querySelector('span');
      const spanStyle = span ? getComputedStyle(span) : null;
      return {
        imageUrl: ent?.billboard?.image,
        gsText: gs?.textContent?.trim(),
        gsVisible: gs ? gsStyle?.display !== 'none' : false,
        gsBg: gsStyle?.backgroundColor,
        gsBorder: gsStyle?.borderStyle,
        gsShadow: gsStyle?.boxShadow,
        gsFont: gsStyle?.fontFamily,
        spanColor: spanStyle?.color
      };
    });
    assert(fpvAudit.imageUrl && fpvAudit.imageUrl.includes('assets/fpv_hires.png'), `Expected bundled hires FPV PNG, got ${fpvAudit.imageUrl}`);
    assert.equal(fpvAudit.gsVisible, true);
    assert.equal(fpvAudit.gsBg, 'rgba(0, 0, 0, 0)', `Expected transparent Glideslope background, got ${fpvAudit.gsBg}`);
    assert.equal(fpvAudit.gsBorder, 'none', `Expected borderless Glideslope widget, got ${fpvAudit.gsBorder}`);
    assert.equal(fpvAudit.gsShadow, 'none', `Expected shadowless Glideslope widget, got ${fpvAudit.gsShadow}`);
    assert.equal(fpvAudit.spanColor, 'rgb(0, 0, 0)', `Expected native black Glideslope text, got ${fpvAudit.spanColor}`);
    assert(fpvAudit.gsFont && fpvAudit.gsFont.includes('Roboto'), `Expected native Roboto font for Glideslope, got ${fpvAudit.gsFont}`);
    assert(fpvAudit.gsText && /^Glideslope\s+-?\d+\.\d+$/i.test(fpvAudit.gsText), `Expected legacy Glideslope readout, got ${fpvAudit.gsText}`);

    // Verify Glideslope text & HUD panel adapt automatically to in-game night/twilight lighting for readability
    await simV3.evaluate(() => {
      window.weather = { ...(window.weather || {}), localTime: 22.5 };
    });
    await simV3.waitForFunction(() => {
      const span = document.querySelector('#flightDataDisplay0 span');
      const hud = document.getElementById('flightDataDisplay');
      const hudStyle = hud ? getComputedStyle(hud) : null;
      return (
        span?.getAttribute('data-time-phase') === 'night' &&
        getComputedStyle(span).color === 'rgb(255, 255, 255)' &&
        hudStyle?.backgroundColor === 'rgba(0, 0, 0, 0.8)' &&
        hudStyle?.color === 'rgb(255, 255, 255)'
      );
    }, { timeout: 3000 });

    await simV3.evaluate(() => {
      window.weather = { ...(window.weather || {}), localTime: 18.4 };
    });
    await simV3.waitForFunction(() => {
      const span = document.querySelector('#flightDataDisplay0 span');
      return span?.getAttribute('data-time-phase') === 'twilight' && getComputedStyle(span).color === 'rgb(248, 250, 252)';
    }, { timeout: 3000 });

    await simV3.evaluate(() => {
      window.weather = { ...(window.weather || {}), localTime: 12.0 };
    });
    await simV3.waitForFunction(() => {
      const span = document.querySelector('#flightDataDisplay0 span');
      const hud = document.getElementById('flightDataDisplay');
      const hudStyle = hud ? getComputedStyle(hud) : null;
      return (
        span?.getAttribute('data-time-phase') === 'day' &&
        getComputedStyle(span).color === 'rgb(0, 0, 0)' &&
        hudStyle?.backgroundColor === 'rgba(255, 255, 255, 0.92)' &&
        hudStyle?.color === 'rgb(0, 0, 0)'
      );
    }, { timeout: 3000 });

    // Verify FPV color coding does not lock red during normal -3000 fpm descent or ground AoA spikes, and turns red only on valid airborne stall
    await simV3.evaluate(() => {
      window.geofs.animation.values.verticalSpeed = -3000;
      window.geofs.animation.values.aoa = 3;
      window.geofs.animation.values.kias = 260;
      window.geofs.aircraft.instance.groundContact = false;
      window.geofs.aircraft.instance.stalling = false;
    });
    await simV3.waitForFunction(() => {
      const c = window.geofs?.api?.viewer?.entities?._items?.[0]?.billboard?.color;
      return typeof c === 'string' && c.startsWith('hsl(') && !c.startsWith('hsl(0,');
    }, { timeout: 3000 });

    await simV3.evaluate(() => {
      window.geofs.animation.values.verticalSpeed = 0;
      window.geofs.animation.values.aoa = 45;
      window.geofs.animation.values.kias = 15;
      window.geofs.aircraft.instance.groundContact = true;
      window.geofs.aircraft.instance.stalling = true;
    });
    await simV3.waitForFunction(() => {
      const c = window.geofs?.api?.viewer?.entities?._items?.[0]?.billboard?.color;
      return c === 'hsl(120, 100%, 50%)';
    }, { timeout: 3000 });

    await simV3.evaluate(() => {
      window.geofs.animation.values.aoa = 18;
      window.geofs.animation.values.kias = 110;
      window.geofs.aircraft.instance.groundContact = false;
      window.geofs.aircraft.instance.stalling = true;
    });
    await simV3.waitForFunction(() => {
      const c = window.geofs?.api?.viewer?.entities?._items?.[0]?.billboard?.color;
      return c === '#ff0000';
    }, { timeout: 3000 });

    await simV3.evaluate(() => {
      window.geofs.animation.values.aoa = 4.5;
      window.geofs.animation.values.kias = 145;
      window.geofs.aircraft.instance.groundContact = false;
      window.geofs.aircraft.instance.stalling = false;
    });
    await simV3.waitForTimeout(80);

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

    // 8. Verify Chrome Side Panel (as regular tab alongside inactive GeoFS tab), Competing CSS Immunity & V4.0 Indicators
    console.log('[E2E] Testing GeoFS V4.0 Competing CSS Immunity, Expanded A/THR+OP ENG & Regular-Tab Side Panel...');
    const helpTab = await context.newPage();
    await helpTab.goto('https://www.geo-fs.com/pages/help', { waitUntil: 'domcontentloaded' });

    const simV4 = await context.newPage();
    await simV4.setViewportSize({ width: 1280, height: 800 });
    attachErrorTrap(simV4, 'geofs-v4');
    await simV4.goto('https://beta.geo-fs.com/geofs.php?version=4.0', { waitUntil: 'networkidle' });
    await simV4.waitForFunction(
      () => (window.__geofsExtDiag || []).some((e) => e.code === 'REALISM_STATE' && e.payload?.simMajor === 4),
      { timeout: 10000 }
    );

    // Inject competing legacy #flightDataDisplay CSS (230px grid) and assert .geofs-ext-hud stays 250px flex column with compact header
    await simV4.evaluate(() => {
      const conflict = document.createElement('style');
      conflict.textContent = '#flightDataDisplay { width: 230px; display: grid; grid-template-columns: 1fr 1fr; }';
      document.head.appendChild(conflict);
    });
    await simV4.click('#autothrottle-button');
    const v4LayoutAudit = await simV4.evaluate(() => {
      const hud = document.getElementById('flightDataDisplay');
      const hdr = hud?.querySelector('.geofs-ext-hud-header');
      const land = document.querySelector('.ext-autothrottle-landing-label');
      const nativePad = document.querySelector('.geofs-autopilot-bar .geofs-autopilot-pad');
      const atPad = document.getElementById('autothrottle-button');
      const opBtn = document.getElementById('opEngineBarBtn');
      return {
        hudWidth: hud?.getBoundingClientRect().width ?? 0,
        headerHeight: hdr?.getBoundingClientRect().height ?? 0,
        headerChildren: Array.from(hdr?.children || []).map((c) => c.id || c.className),
        landingVisible: land ? getComputedStyle(land).display !== 'none' : false,
        landingFont: land ? getComputedStyle(land).fontFamily : '',
        opBtnVisible: opBtn ? getComputedStyle(opBtn).display !== 'none' : false,
        opBtnText: opBtn?.textContent?.trim() ?? '',
        nativeWidth: nativePad?.getBoundingClientRect().width ?? 0,
        nativeHeight: nativePad?.getBoundingClientRect().height ?? 0,
        atWidth: atPad?.getBoundingClientRect().width ?? 0,
        atHeight: atPad?.getBoundingClientRect().height ?? 0,
        opBtnWidth: opBtn?.getBoundingClientRect().width ?? 0,
        opBtnHeight: opBtn?.getBoundingClientRect().height ?? 0
      };
    });
    assert(v4LayoutAudit.hudWidth >= 248 && v4LayoutAudit.hudWidth <= 255, `Competing CSS broke HUD width: ${v4LayoutAudit.hudWidth}`);
    assert(v4LayoutAudit.headerHeight > 18 && v4LayoutAudit.headerHeight <= 40, `Competing CSS stretched HUD header: ${v4LayoutAudit.headerHeight}`);
    assert.deepEqual(v4LayoutAudit.headerChildren, ['geofs-ext-hud-grip', 'hud-unified-tabs', 'geofs-ext-hud-min']);
    assert.equal(v4LayoutAudit.landingVisible, true);
    assert(v4LayoutAudit.landingFont.includes('LCD-Bold'));
    assert.equal(v4LayoutAudit.opBtnVisible, true);
    assert.equal(v4LayoutAudit.opBtnText, 'OP ENG');
    assert(v4LayoutAudit.opBtnHeight >= 24 && v4LayoutAudit.opBtnHeight <= 27);
    assert(v4LayoutAudit.atWidth >= 40 && v4LayoutAudit.atWidth < v4LayoutAudit.nativeWidth);
    assert(v4LayoutAudit.opBtnWidth >= 45 && v4LayoutAudit.opBtnWidth < v4LayoutAudit.nativeWidth);
    assert(Math.abs(v4LayoutAudit.atHeight - v4LayoutAudit.nativeHeight) <= 0.5);
    assert(Math.abs(v4LayoutAudit.opBtnHeight - v4LayoutAudit.nativeHeight) <= 0.5);

    // Open sidepanel in a new regular tab -> must still connect to V4 tab (NOT Offline) even though helpTab came first!
    const sidePage = await context.newPage();
    await sidePage.setViewportSize({ width: 420, height: 800 });
    attachErrorTrap(sidePage, 'sidepanel');
    await sidePage.goto(`chrome-extension://${extId}/sidepanel/index.html`, { waitUntil: 'domcontentloaded' });
    await sidePage.waitForSelector('[data-surface="sidepanel"]');
    await sidePage.waitForSelector('.badge--ok:has-text("V4")', { timeout: 10000 });
    await sidePage.click('button.tab-btn:has-text("OP / Diag")');
    await sidePage.waitForSelector('text=UI_MOUNT', { timeout: 10000 });
    await sidePage.waitForSelector('.diag-line:has-text("REALISM_FEATURE_ERROR")', { timeout: 10000 });
    const sideText = await sidePage.locator('body').textContent();
    assert(!/unavailable/i.test(sideText || ''), `Side panel must not contain 'unavailable' text, got: ${sideText}`);
    await assertNoHorizontalOverflow(sidePage, 'sidepanel');
    await simV4.close();
    await helpTab.close();
    await sidePage.close();

    // 9. Missing Anchors Fallback Case + Alternate Subdomain / Suffixed V3.9 Version
    console.log('[E2E] Testing Missing GeoFS DOM Anchors Fallback & Legacy Subdomain Suffixed V3.9...');
    const fallbackPage = await context.newPage();
    await fallbackPage.setViewportSize({ width: 1280, height: 800 });
    attachErrorTrap(fallbackPage, 'fallback');
    await fallbackPage.goto('https://legacy.geo-fs.com/geofs.php?version=3.9-beta&anchors=missing', { waitUntil: 'networkidle' });
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
