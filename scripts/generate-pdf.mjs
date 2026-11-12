/**
 * Print /resume to a two-page US Letter PDF with headless Chromium.
 *
 *   node scripts/generate-pdf.mjs              → dist/adam-miller-resume.pdf
 *   node scripts/generate-pdf.mjs --public     → also public/adam-miller-resume.pdf
 *
 * Runs as part of `npm run build`, after `astro build`. If Chromium isn't
 * installed or can't be launched, this warns and leaves the committed
 * public/adam-miller-resume.pdf in place instead of failing the build — a
 * missing browser must never block a deploy. Install it with:
 *
 *   npx puppeteer browsers install chrome
 */
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDir } from "./lib/static-server.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = path.join(root, "dist");
const publicPdf = path.join(root, "public/adam-miller-resume.pdf");
const distPdf = path.join(dist, "adam-miller-resume.pdf");
const alsoPublic = process.argv.includes("--public");
/** Refreshing the committed PDF is an explicit request, so it must not no-op silently. */
const strict = process.env.PDF_STRICT === "1" || alsoPublic;

/**
 * Path to an already-downloaded browser, or null. Checked up front because
 * `puppeteer.launch()` without one tries to fetch Chrome and can hang a build.
 */
async function installedBrowser() {
  try {
    const executable = await puppeteer.executablePath();
    return existsSync(executable) ? executable : null;
  } catch {
    return null;
  }
}

/** Count pages in the PDF Chrome produced. */
async function countPages(buffer) {
  const doc = await PDFDocument.load(buffer, { updateMetadata: false });
  return doc.getPageCount();
}

async function printResume(executablePath) {
  const server = await serveDir(dist);
  const browser = await puppeteer.launch({
    executablePath,
    timeout: 30_000,
    protocolTimeout: 60_000,
  });

  try {
    const page = await browser.newPage();
    await page.goto(`${server.url}/resume`, { waitUntil: "networkidle0", timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    const buffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true, // honors `@page { size: Letter; margin … }`
    });

    const pages = await countPages(buffer);
    if (pages > 2) {
      throw new Error(
        `Resume PDF is ${pages} pages; it must fit on two. Trim copy or adjust print styles.`
      );
    }

    await writeFile(distPdf, buffer);
    if (alsoPublic) {
      await mkdir(path.dirname(publicPdf), { recursive: true });
      await writeFile(publicPdf, buffer);
    }
    console.log(
      `Wrote ${path.relative(root, distPdf)}${alsoPublic ? ` and ${path.relative(root, publicPdf)}` : ""} (${pages} page${pages === 1 ? "" : "s"})`
    );
  } finally {
    await browser.close();
    await server.close();
  }
}

// `astro build` copies public/ into dist/ first, so the old PDF is already there.
const built = await stat(path.join(dist, "resume/index.html")).catch(() => null);
if (!built) {
  console.error("No dist/resume/index.html — run `astro build` first.");
  process.exit(1);
}

const browserPath = await installedBrowser();

if (!browserPath) {
  if (strict) {
    throw new Error(
      "No Chromium found for puppeteer. Run `npx puppeteer browsers install chrome`."
    );
  }
  console.warn(
    "\n⚠️  Skipping resume PDF generation: no Chromium for puppeteer on this machine."
  );
  console.warn(
    "   Shipping the committed public/adam-miller-resume.pdf instead. To enable it: npx puppeteer browsers install chrome"
  );
} else {
  try {
    await printResume(browserPath);
  } catch (error) {
    const committed = await stat(publicPdf).catch(() => null);
    if (strict || !committed) throw error;

    console.warn(
      `\n⚠️  Could not generate the resume PDF: ${error instanceof Error ? error.message : error}`
    );
    console.warn(`   Shipping the committed public/adam-miller-resume.pdf instead.`);
    // Make sure dist has the committed copy in case the build was cleaned.
    await copyFile(publicPdf, distPdf);
  }
}
