/**
 * Regenerate public/og.png (1200×630 at 2× = 2400×1260) from scripts/og-template.html.
 *
 *   npm run og
 *
 * The template uses the same fonts and palette as the site, so the card stays
 * visually consistent with the pages it previews.
 */
import puppeteer from "puppeteer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDir } from "./lib/static-server.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = path.join(root, "public/og.png");

const server = await serveDir(root);
const browser = await puppeteer.launch();

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.goto(`${server.url}/scripts/og-template.html`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  const overflow = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    width: document.documentElement.scrollWidth,
  }));
  if (overflow.height > 630 || overflow.width > 1200) {
    throw new Error(
      `OG template overflows 1200×630 (${overflow.width}×${overflow.height}). Shorten the headline or reduce type size.`
    );
  }

  await page.screenshot({ path: output, type: "png" });
  console.log(`Wrote ${path.relative(root, output)} (2400×1260)`);
} finally {
  await browser.close();
  await server.close();
}
