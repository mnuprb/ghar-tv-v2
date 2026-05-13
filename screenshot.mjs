// Puppeteer screenshot helper — fallback for when Playwright MCP is unavailable.
// Usage: node screenshot.mjs <url> [label] [--mobile|--width=N] [--full]
// Outputs to ./screenshots/claude-screenshots/screenshot-N[-label].png

import puppeteer from 'puppeteer';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(ROOT, 'screenshots', 'claude-screenshots');

function parseArgs(argv) {
  const args = { url: null, label: '', width: 1440, height: 900, full: true };
  for (const a of argv) {
    if (a === '--mobile') { args.width = 390; args.height = 844; }
    else if (a.startsWith('--width=')) args.width = Number(a.split('=')[1]) || args.width;
    else if (a.startsWith('--height=')) args.height = Number(a.split('=')[1]) || args.height;
    else if (a === '--full') args.full = true;
    else if (a === '--no-full') args.full = false;
    else if (!args.url) args.url = a;
    else if (!args.label) args.label = a.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  }
  return args;
}

async function nextIndex() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = await fs.readdir(OUT_DIR);
  const nums = files
    .map(f => f.match(/^screenshot-(\d+)/))
    .filter(Boolean)
    .map(m => Number(m[1]));
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) {
    console.error('Usage: node screenshot.mjs <url> [label] [--mobile|--width=N] [--full|--no-full]');
    process.exit(1);
  }

  const n = await nextIndex();
  const name = `screenshot-${n}${args.label ? '-' + args.label : ''}.png`;
  const outPath = path.join(OUT_DIR, name);

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: args.width, height: args.height, deviceScaleFactor: 2 });
    await page.goto(args.url, { waitUntil: 'networkidle2', timeout: 60_000 });
    await page.screenshot({ path: outPath, fullPage: args.full });
    console.log(outPath);
  } finally {
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
