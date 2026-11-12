/**
 * Minimal static file server for the headless render scripts.
 * Serves files from `root` on an ephemeral port and resolves once listening.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

/**
 * @param {string} root directory to serve
 * @returns {Promise<{ url: string, close: () => Promise<void> }>}
 */
export async function serveDir(root) {
  const base = path.resolve(root);

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      let filePath = path.join(base, decodeURIComponent(url.pathname));

      // Never escape the served directory.
      if (!filePath.startsWith(base)) {
        res.writeHead(403).end("Forbidden");
        return;
      }

      let info = await stat(filePath).catch(() => null);
      if (info?.isDirectory()) {
        filePath = path.join(filePath, "index.html");
        info = await stat(filePath).catch(() => null);
      }
      if (!info) {
        res.writeHead(404).end("Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
        "Content-Length": info.size,
      });
      createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = /** @type {import("node:net").AddressInfo} */ (server.address());

  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
