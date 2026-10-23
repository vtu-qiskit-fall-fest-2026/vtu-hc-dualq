const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const FRAMES_DIR = path.join(__dirname, 'demo_frames');
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

let frameCount = 0;

async function captureFrame(page, label, delayMs = 1500) {
  frameCount++;
  const numStr = String(frameCount).padStart(3, '0');
  const filename = path.join(FRAMES_DIR, `frame_${numStr}.png`);
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`[Frame ${numStr}] Captured: ${label}`);
  if (delayMs > 0) {
    await new Promise(r => setTimeout(r, delayMs));
  }
}

async function runDemo() {
  console.log('--- Starting DualQ Silent 2-Minute Screen Recording ---');
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();

  // 1. SCENE 1: LOGIN PORTAL (Clean, unauthenticated state)
  console.log('\n>> Scene 1: Banking Authentication Portal');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.removeItem('dualq_auth_user');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await captureFrame(page, 'Scene 1: Institutional Sign-In Page (PostgreSQL Node Live)', 2000);

  // Focus on Officer Email and type credentials
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    await emailInput.click();
    await emailInput.type('');
    await captureFrame(page, 'Scene 1: Credentials & 2FA OTP Verified', 1200);
  }

  // Click "Authenticate & Enter Portal"
  console.log('>> Authenticating as Senior Fraud Risk Officer...');
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await captureFrame(page, 'Scene 1: Verifying credentials against PostgreSQL dualq_db...', 1500);
  }

  // 2. SCENE 2: BANKING GATEWAY HOME PAGE
  console.log('\n>> Scene 2: Executive Banking Gateway Home Page');
  await page.waitForSelector('.page-content', { timeout: 5000 });
  await captureFrame(page, 'Scene 2: Executive Gateway Loaded (vQPU-01 Live & RBI 2026 Compliant)', 2500);

  // Scroll to Domestic Payment Rails Telemetry
  await page.evaluate(() => window.scrollBy({ top: 320, behavior: 'smooth' }));
  await captureFrame(page, 'Scene 2: Domestic Payment Rails Ticker (UPI 2.0, 4G Soundbox, RuPay, RTGS)', 2500);

  // Scroll to Core Banking Pillars
  await page.evaluate(() => window.scrollBy({ top: 360, behavior: 'smooth' }));
  await captureFrame(page, 'Scene 2: Three Core Banking Operational Workspaces', 2500);

  // 3. SCENE 3: LIVE BANK TRANSFER SIMULATOR
  console.log('\n>> Scene 3: Live Bank Transfer Simulator');
  await page.evaluate(() => window.scrollBy({ top: 480, behavior: 'smooth' }));
  await captureFrame(page, 'Scene 3: Bank Transfer Simulator Ready', 2000);

  // Test Case A: Safe Kirana QR (₹35)
  console.log('>> Testing Case A: Safe Kirana QR (₹35)');
  const safeButton = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Safe Kirana QR') || b.textContent.includes('35'));
  });
  if (safeButton && safeButton.asElement()) {
    await safeButton.asElement().click();
    await captureFrame(page, 'Scene 3: Selected Safe Kirana QR (₹35)', 1500);
  }

  const execBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Execute Transfer'));
  });
  if (execBtn && execBtn.asElement()) {
    await execBtn.asElement().click();
    await new Promise(r => setTimeout(r, 800));
    await captureFrame(page, 'Scene 3: Transfer APPROVED (Legitimate - Quantum Safe Confirmed)', 3000);
  }

  // Test Case B: Midnight Fraud Drain (₹1,42,050)
  console.log('>> Testing Case B: Midnight Drain (₹1,42,050)');
  const fraudButton = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Midnight Drain') || b.textContent.includes('1,42,050'));
  });
  if (fraudButton && fraudButton.asElement()) {
    await fraudButton.asElement().click();
    await captureFrame(page, 'Scene 3: Loaded High-Risk Midnight Drain (₹1,42,050)', 1500);
  }

  const execBtn2 = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Execute Transfer'));
  });
  if (execBtn2 && execBtn2.asElement()) {
    await execBtn2.asElement().click();
    await new Promise(r => setTimeout(r, 800));
    await captureFrame(page, 'Scene 3: PAYMENT BLOCKED! Critical Hilbert Space Boundary Violation (6.2ms Latency)', 3500);
  }

  // Expand API Payload Inspector
  const inspectorBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Technical Payload') || b.textContent.includes('API'));
  });
  if (inspectorBtn && inspectorBtn.asElement()) {
    await inspectorBtn.asElement().click();
    await page.evaluate(() => window.scrollBy({ top: 200, behavior: 'smooth' }));
    await captureFrame(page, 'Scene 3: Raw FastAPI Payload Inspector (/api/screen response)', 2500);
  }

  // 4. SCENE 4: UNIFIED PAYMENT AUDIT LEDGER
  console.log('\n>> Scene 4: Unified Payment Audit Ledger');
  await page.evaluate(() => window.scrollTo(0, 0));
  const ledgerNav = await page.evaluateHandle(() => {
    const navs = Array.from(document.querySelectorAll('aside button, .sidebar button, nav button'));
    return navs.find(b => b.textContent.includes('Audit Ledger') || b.textContent.includes('Transactions'));
  });
  if (ledgerNav && ledgerNav.asElement()) {
    await ledgerNav.asElement().click();
    await page.waitForSelector('.card', { timeout: 5000 });
    await captureFrame(page, 'Scene 4: Audited Transactions Ledger (PostgreSQL dualq_db Synchronized)', 3000);
  }

  // 5. SCENE 5: RBI BENCHMARKS & MODEL PERFORMANCE
  console.log('\n>> Scene 5: RBI Benchmarks & Model Performance');
  const perfNav = await page.evaluateHandle(() => {
    const navs = Array.from(document.querySelectorAll('aside button, .sidebar button, nav button'));
    return navs.find(b => b.textContent.includes('Performance') || b.textContent.includes('Benchmarks'));
  });
  if (perfNav && perfNav.asElement()) {
    await perfNav.asElement().click();
    await new Promise(r => setTimeout(r, 1000));
    await captureFrame(page, 'Scene 5: RBI Benchmarks: QSVC vs Classical ML (ROC-AUC 1.0000, Alignment 0.7459)', 3000);
    
    await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
    await captureFrame(page, 'Scene 5: Statistical Separation Curves & Geometric Difference Bound', 3000);
  }

  // 6. SCENE 6: QUANTUM HILBERT SPACE & KERNEL TOPOLOGIES
  console.log('\n>> Scene 6: Quantum Hilbert Space Topologies');
  const kernelNav = await page.evaluateHandle(() => {
    const navs = Array.from(document.querySelectorAll('aside button, .sidebar button, nav button'));
    return navs.find(b => b.textContent.includes('Kernel') || b.textContent.includes('Hilbert'));
  });
  if (kernelNav && kernelNav.asElement()) {
    await kernelNav.asElement().click();
    await new Promise(r => setTimeout(r, 1000));
    await captureFrame(page, 'Scene 6: Quantum Hilbert Space & Gram Matrix Topologies', 3000);
  }

  // 7. SCENE 7: SECURE SIGN OUT FLOW
  console.log('\n>> Scene 7: Clean Sign Out');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const btns = Array.from(document.querySelectorAll('button'));
    const signOutBtn = btns.find(b => b.textContent.includes('Sign Out'));
    if (signOutBtn) signOutBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await captureFrame(page, 'Scene 7: Session Safely Closed (Returned to Official Login Portal)', 2500);

  await browser.close();
  console.log(`\nSUCCESS: Captured ${frameCount} high-resolution frames into ${FRAMES_DIR}!`);
}

runDemo().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
