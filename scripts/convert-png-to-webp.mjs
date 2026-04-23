import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const DEFAULT_DIRS = [
  "public/images",
  "src/images",
];

function walk(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function isPng(p) {
  return p.toLowerCase().endsWith(".png");
}

function toWebpPath(p) {
  return p.slice(0, -4) + ".webp";
}

function run() {
  const dirs = process.argv.slice(2);
  const targets = (dirs.length ? dirs : DEFAULT_DIRS).map((d) => path.join(ROOT, d));

  const pngs = [];
  for (const t of targets) {
    if (!fs.existsSync(t)) continue;
    for (const f of walk(t)) if (isPng(f)) pngs.push(f);
  }

  if (pngs.length === 0) {
    console.log("No PNGs found.");
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const png of pngs) {
    const webp = toWebpPath(png);
    if (fs.existsSync(webp) && fs.statSync(webp).size > 0) {
      skipped++;
      continue;
    }

    const res = spawnSync("cwebp", ["-q", "82", "-m", "6", png, "-o", webp], {
      stdio: "inherit",
    });
    if (res.status !== 0) process.exit(res.status ?? 1);
    converted++;
  }

  console.log(`Done. Converted: ${converted}, skipped (already exists): ${skipped}`);
}

run();

