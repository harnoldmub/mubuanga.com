import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

// Kept in sync with src/data/projects.ts — the file name maps to the slug in
// scripts/build-assets.py, which turns these raw captures into served assets.
//
// Each site yields:
//   <name>.png / <name>_mobile.png        hero, first viewport
//   <name>_s1..s4.png                     desktop sections further down the page
//   <name>_mobile_s1..s2.png              mobile sections
//
// Usage: `npm run captures` for everything, or `npm run captures -- <name> …`
// to recapture only some sites.
const urls = [
  ["https://salon.congonaparis.fr/", "salon_congonaparis_fr"],
  ["https://mbokahub.com/", "mbokahub_com"],
  ["https://tselemrdc.com/", "tselemrdc_com"],
  ["https://e-visa.mubuanga.com/", "e-visa_mubuanga_com"],
  ["https://blocleopards.mubuanga.com/", "blocleopards_mubuanga_com"],
  ["https://momento.wedding/", "momento_wedding"],
  ["https://u-moja.org/", "u-moja_org"],
  ["https://dgm.mubuanga.com/", "dgm_mubuanga_com"],
  ["https://fondationnoahsadiki.org/", "fondationnoahsadiki_org"],
  ["https://cozyinterieur.com/", "cozyinterieur_com"],
  ["https://malkya.co/", "malkya_co"],
  ["https://tselem.studio/", "tselem_studio"],
  ["http://awanetwork.com/", "awanetwork_com"],
  ["https://daylora.co/", "daylora_co"],
  ["https://kecha2026.com/", "kecha_2026"],
  ["https://mamisamarylin2026.com/", "mami_samarylin_2026"],
  ["https://agdtn.com/", "agdtn_com"],
  ["https://lombayo-consulting.com/", "lombayo_consulting_com"],
  ["https://amcros-institut.com/", "amcros_institut_com"],
  ["https://amcros.events/", "amcros_events"],
  ["https://parti-avc.cd/", "parti_avc_cd"],
  ["https://luxos-production.up.railway.app/", "luxos"],
  ["https://tasha-ruddy.up.railway.app/", "tasha_ruddy"],
];

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 }; // iPhone 14

// How many section shots per device, and where they land when the page has
// no usable section markup (fraction of the scrollable distance).
// The very bottom is skipped on purpose: it is almost always the footer.
const STOPS = {
  desktop: [0.18, 0.38, 0.58, 0.8],
  mobile: [0.22, 0.5],
};

const outDir = "_source-assets/screenshots";
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const only = process.argv.slice(2);
const queue = urls.filter(([, name]) => only.length === 0 || only.includes(name));

// Falls back to the installed Chrome when Playwright's own build is missing.
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));

const UA = {
  mobile:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  desktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

const scrollY = (page) => page.evaluate(() => window.scrollY);
const maxScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

/**
 * Scroll with the wheel rather than `window.scrollTo`: smooth-scroll
 * libraries (Lenis) and scroll-driven reveals only react to real input.
 */
async function wheelTo(page, target) {
  for (let i = 0; i < 40; i++) {
    const delta = target - (await scrollY(page));
    if (Math.abs(delta) < 4) break;
    await page.mouse.wheel(0, Math.max(-1200, Math.min(1200, delta)));
    await page.waitForTimeout(160);
  }
  // Fallback for pages that ignore wheel events (custom scroll containers).
  if (Math.abs(target - (await scrollY(page))) > 40) {
    await page.evaluate((y) => window.scrollTo(0, y), target);
  }
}

/**
 * Decline cookie banners (the privacy-preserving choice) so they do not sit
 * on every capture. Only buttons whose label clearly means "refuse" are hit.
 */
async function dismissConsent(page) {
  const labels = /^(tout )?refuser( tout)?$|^continuer sans accepter$|^(reject|decline)( all)?$|^nécessaires? uniquement$/i;
  const buttons = page.getByRole("button", { name: labels });
  const n = await buttons.count().catch(() => 0);
  for (let i = 0; i < n; i++) {
    const b = buttons.nth(i);
    if (await b.isVisible().catch(() => false)) {
      await b.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(500);
      return true;
    }
  }
  return false;
}

/**
 * Pick the scroll positions of real sections rather than arbitrary
 * fractions: a frame that starts on a section heading reads as a deliberate
 * crop. Falls back to evenly spaced fractions when the markup is flat.
 */
async function sectionStops(page, fractions) {
  const tops = await page.evaluate(() => {
    const vh = window.innerHeight;
    const header = [...document.querySelectorAll("header, nav")]
      .filter((el) => ["fixed", "sticky"].includes(getComputedStyle(el).position))
      .reduce((h, el) => Math.max(h, el.getBoundingClientRect().bottom), 0);
    const nodes = [...document.querySelectorAll("main section, body section, main > *, [data-section]")]
      .filter((el) => !el.closest("footer") && el.offsetHeight >= vh * 0.45);
    const max = document.documentElement.scrollHeight - vh;
    const ys = nodes
      .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY - Math.min(header, 120)))
      .filter((y) => y > vh * 0.6 && y < max - vh * 0.3)
      .sort((a, b) => a - b);
    return ys.filter((y, i) => i === 0 || y - ys[i - 1] > vh * 0.5);
  });
  const total = await maxScroll(page);
  if (tops.length < fractions.length) return fractions.map((f) => Math.round(total * f));
  return fractions.map((_, i) =>
    tops[Math.round(((i + 0.5) * tops.length) / fractions.length - 0.5)],
  );
}

async function capture(url, name, kind) {
  const viewport = kind === "mobile" ? MOBILE : DESKTOP;
  const context = await browser.newContext({
    viewport,
    userAgent: UA[kind],
    isMobile: kind === "mobile",
    hasTouch: kind === "mobile",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const base = `${outDir}/${name}${kind === "mobile" ? "_mobile" : ""}`;
  const log = [];
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2200); // loaders, intro animations
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    if (await dismissConsent(page)) log.push("cookies refusés");

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${base}.png` });
    log.push("hero");

    // Warm-up pass: walk the page once so lazy images and reveals fire.
    const max = await maxScroll(page);
    for (let y = 0; y <= max; y += viewport.height * 0.8) await wheelTo(page, y);
    await page.waitForTimeout(600);

    const total = await maxScroll(page); // may have grown during warm-up
    const stops = total < viewport.height * 0.6 ? [] : await sectionStops(page, STOPS[kind]);
    for (const [i, y] of stops.entries()) {
      await wheelTo(page, y);
      await page.waitForTimeout(2200); // let reveals finish
      await dismissConsent(page);
      await page.screenshot({ path: `${base}_s${i + 1}.png` });
      log.push(`s${i + 1}`);
    }
  } catch (err) {
    log.push(`✗ ${err.message.split("\n")[0]}`);
  }
  await context.close();
  return `[${kind.padEnd(7)}] ${log.join(" ")}`;
}

async function worker() {
  while (queue.length) {
    const [url, name] = queue.shift();
    const lines = [await capture(url, name, "desktop"), await capture(url, name, "mobile")];
    console.log(`→ ${url}\n  ${lines.join("\n  ")}`);
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
await browser.close();
console.log("\nDone — screenshots in _source-assets/screenshots/");
