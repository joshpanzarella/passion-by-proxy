// Turns the logo artwork into splash frames.
//
//   npm run zoetrope -- path/to/teal.png path/to/orange.png ...
//
// Frames play in the order given. Each source is square with the logo in
// the middle band; every file is scaled to one size and cropped to the same
// band, so the frames line up exactly. Output: public/zoetrope/NN.webp.
// The source PNGs are large (2-8 MB) and stay out of the repo.
//
// The art's fill is semi-transparent and noisy, which webp cannot store
// small with an alpha channel, so every frame is flattened onto BACKGROUND.
// The splash's background (--splash-bg in globals.css) must be the same colour.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const sources = process.argv.slice(2);
if (sources.length === 0) {
  console.error("usage: npm run zoetrope -- <frame1.png> <frame2.png> ...");
  process.exit(1);
}

const WIDTH = 900;
const BACKGROUND = "#000000";
// The logo spans about 16%-81% of the square's height; keep a margin.
const TOP = 0.14;
const BOTTOM = 0.83;

const outDir = path.join(process.cwd(), "public/zoetrope");
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith(".webp")) fs.unlinkSync(path.join(outDir, f));
}

for (const [i, src] of sources.entries()) {
  const name = `${String(i + 1).padStart(2, "0")}.webp`;
  const square = await sharp(src).resize(WIDTH, WIDTH, { fit: "fill" }).png().toBuffer();
  await sharp(square)
    .extract({ left: 0, top: Math.round(WIDTH * TOP), width: WIDTH, height: Math.round(WIDTH * (BOTTOM - TOP)) })
    .flatten({ background: BACKGROUND })
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(outDir, name));
  const kb = Math.round(fs.statSync(path.join(outDir, name)).size / 1024);
  console.log(`${name}  ${kb} KB  <- ${path.basename(src)}`);
}
