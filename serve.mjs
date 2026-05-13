// Static dev server for Ghar.tv — serves project root on http://localhost:3000
// Usage: node serve.mjs

import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm':  'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.eot':  'application/vnd.ms-fontobject',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.map':  'application/json; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.pdf':  'application/pdf',
};

function safeResolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const resolved = path.normalize(path.join(ROOT, decoded));
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

async function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

async function tryFile(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile() ? stat : null;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    let target = safeResolve(req.url || '/');
    if (!target) return send(res, 403, 'Forbidden');

    let stat = await tryFile(target);

    // If the path resolves to a directory, try index.html inside it.
    if (!stat) {
      try {
        const dirStat = await fs.stat(target);
        if (dirStat.isDirectory()) {
          const indexPath = path.join(target, 'index.html');
          const indexStat = await tryFile(indexPath);
          if (indexStat) { target = indexPath; stat = indexStat; }
        }
      } catch {}
    }

    // Extensionless fallback (e.g. /design -> /design.html).
    if (!stat && !path.extname(target)) {
      const htmlPath = target + '.html';
      const htmlStat = await tryFile(htmlPath);
      if (htmlStat) { target = htmlPath; stat = htmlStat; }
    }

    if (!stat) return send(res, 404, `Not found: ${req.url}`);

    const ext = path.extname(target).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const body = await fs.readFile(target);
    return send(res, 200, body, { 'Content-Type': type, 'Content-Length': body.length });
  } catch (err) {
    console.error('serve error:', err);
    return send(res, 500, 'Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`ghar.tv dev server: http://localhost:${PORT}`);
});
