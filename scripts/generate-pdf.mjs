/**
 * Print /resume to a two-page US Letter PDF with headless Chromium.
 *
 *   node scripts/generate-pdf.mjs              → dist/adam-miller-resume.pdf
 *   node scripts/generate-pdf.mjs --public     → also public/adam-miller-resume.pdf
 *
 * Runs as part of `npm run build`, after `astro build`. If Chromium can't be
 * launched (for example a build host that skipped its download), this warns
 * and leaves the committed public/adam-miller-resume.pdf in place instead of
 * failing the build.
 */
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDir } from "./lib/static-server.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = path.join(root, "dist");
const publicPdf = path.join(root, "public/adam-miller-resume.pdf");
const distPdf = path.join(dist, "adam-miller-resume.pdf");
const alsoPublic = process.argv.includes("--public");

/** Count pages in the PDF Chrome produced. */
async function countPages(buffer) {
  const doc = await PDFDocument.load(buffer, { updateMetadata: false });
  return doc.getPageCount();
}

async function printResume() {
  const server = await serveDir(dist);
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.goto(`${server.url}/resume`, { waitUntil: "networkidle0" });
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

try {
  await printResume();
} catch (error) {
  const committed = await stat(publicPdf).catch(() => null);
  if (process.env.PDF_STRICT === "1" || !committed) throw error;

  console.warn(
    `\n⚠️  Could not generate the resume PDF: ${error instanceof Error ? error.message : error}`
  );
  console.warn(
    `   Shipping the committed ${path.relative(root, publicPdf)} instead: the build is using ${path.relative(root, distPdf)}.`
  );
  // Make sure dist has the committed copy in case the build was cleaned.
  await copyFile(publicPdf, distPdf);
}
