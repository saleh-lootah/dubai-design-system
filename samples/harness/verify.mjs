import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import puppeteer from 'puppeteer';

const [dir, selector = 'dda-button.hydrated button'] = process.argv.slice(2);
if (!dir) {
  console.error('usage: node verify.mjs <dist-dir> [selector]');
  process.exit(2);
}

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (path.endsWith('/')) path += 'index.html';
    const file = join(dir, path);
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
let ok = false;
try {
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector(selector, { timeout: 10000 });
  ok = true;
  console.log(`PASS: found "${selector}" in ${dir}`);
} catch (err) {
  console.error(`FAIL: selector "${selector}" not found in ${dir}: ${err.message}`);
}
await browser.close();
server.close();
process.exit(ok ? 0 : 1);
