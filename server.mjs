// server.mjs - Lightweight server for Learn Arduino (Thai Edition)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.join(__dirname, 'app');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function serveFile(req, res) {
  let parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Default to index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  let filePath = path.join(APP_DIR, pathname);

  // Security check - prevent path traversal
  if (!filePath.startsWith(APP_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Check if file exists, else fallback to index.html for SPA
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Check if it was an asset or a SPA route
      if (pathname.startsWith('/assets/')) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
      filePath = path.join(APP_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error: ' + readErr.message);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
}

function startServer(port = 3000) {
  const server = http.createServer(serveFile);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(` พอร์ต ${port} ถูกใช้งานอยู่ กำลังลองพอร์ต ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('\n=============================================================');
    console.log('   🚀 Learn Arduino (ฉบับภาษาไทยสำหรับนักเรียนมัธยม) พร้อมใช้งานแล้ว!');
    console.log('=============================================================');
    console.log(`\n  🌐 เปิดใช้งานได้ที่: \x1b[36m${url}\x1b[0m`);
    console.log('  📚 พร้อม 16 บทเรียนจำลอง 3 มิติ โค้ดตัวอย่าง และคำอธิบายภาษาไทย');
    console.log('  💡 กด Ctrl + C ในหน้าต่างนี้เพื่อหยุดเซิร์ฟเวอร์\n');

    // Automatically open browser on Windows
    const startCmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
    exec(startCmd, () => {});
  });
}

startServer(3000);
