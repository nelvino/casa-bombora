import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Generate multiple WebP widths for PNG/JPG/WebP sources.
 *
 * Defaults:
 * - input dir: src/images/villaImages/mezzanine/renders
 * - widths: 640, 1280, 1920
 * - output: <name>.w640.webp, etc (next to source)
 */

const ROOT = process.cwd();

const inputDir = process.argv[2]
  ? path.resolve(ROOT, process.argv[2])
  : path.resolve(ROOT, "src/images/villaImages/mezzanine/renders");

const widths = (process.argv[3] ? process.argv[3].split(",") : ["640", "1280", "1920"])
  .map((w) => Number(w.trim()))
  .filter((w) => Number.isFinite(w) && w > 0);

const exts = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.join(dir, e.name));
}

function outPathFor(srcPath, width) {
  const ext = path.extname(srcPath);
  const base = srcPath.slice(0, -ext.length);
  return `${base}.w${width}.webp`;
}

async function main() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input dir not found: ${inputDir}`);
    process.exit(1);
  }

  const files = listFiles(inputDir).filter((f) => exts.has(path.extname(f).toLowerCase()));
  const sources = files.filter((f) => !/\.w\d+\.webp$/i.test(f)); // ignore outputs

  let made = 0;
  let skipped = 0;

  for (const src of sources) {
    const ext = path.extname(src).toLowerCase();
    if (!exts.has(ext)) continue;

    const image = sharp(src, { failOn: "none" });
    const meta = await image.metadata();

    for (const w of widths) {
      const out = outPathFor(src, w);
      if (fs.existsSync(out) && fs.statSync(out).size > 0) {
        skipped++;
        continue;
      }

      const effectiveWidth = meta.width && meta.width < w ? meta.width : w;
      const q = w <= 640 ? 78 : w <= 1280 ? 80 : 82;

      await sharp(src, { failOn: "none" })
        .resize({ width: effectiveWidth, withoutEnlargement: true })
        .webp({ quality: q, effort: 6 })
        .toFile(out);

      made++;
    }
  }

  console.log(`Done. Created ${made} variants, skipped ${skipped} existing.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

