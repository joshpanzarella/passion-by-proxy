// Turns the band's artwork into web-sized files in public/media/.
//
//   npm run media -- cover=U&I.jpg wordmark=U&I-type.png bottles=bottles.png \
//                    banner=banner.jpg logo=logo-flat.png \
//                    texture-teal=… texture-gold=… texture-red=… \
//                    glitter=glitter-type.png arc=arc-type.png photo=band.jpg \
//                    album-cover=alliterate.jpg iwbl-cover=i-wont-be-long.jpg
//
// Pass only the ones that changed. Originals (up to 17 MB) stay out of the
// repo. Art with a black background is flattened onto black, the page's own
// background (--bg in globals.css), which keeps noisy art small.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BLACK = "#000000";
const out = (name) => path.join(process.cwd(), "public/media", name);

const jobs = {
  // single cover, square
  cover: (src) => sharp(src).resize(1000, 1000).webp({ quality: 82 }).toFile(out("u-and-i-cover.webp")),
  // U&I lettering: keep transparency, trim the empty edges
  wordmark: (src) => sharp(src).trim().resize({ width: 900 }).webp({ quality: 88 }).toFile(out("u-and-i-wordmark.webp")),
  // Alliterate bottles. The file's glow is partly transparent, but the art
  // is meant to be seen at full colour (as it previews), so the alpha is
  // dropped rather than blended onto black, which dims it by a third.
  bottles: async (src) => {
    const opaque = await sharp(src).removeAlpha().png().toBuffer();
    // the file has a faint grey frame at its edges: shave it before trimming
    const { width, height } = await sharp(opaque).metadata();
    const inset = Math.round(Math.min(width, height) * 0.02);
    const shaved = await sharp(opaque).extract({ left: inset, top: inset, width: width - 2 * inset, height: height - 2 * inset }).png().toBuffer();
    const trimmed = await sharp(shaved).trim({ background: BLACK, threshold: 24 }).png().toBuffer();
    const pad = 60;
    await sharp(trimmed).extend({ top: pad, bottom: pad, left: pad, right: pad, background: BLACK }).resize({ height: 1100 }).webp({ quality: 80 }).toFile(out("alliterate-bottles.webp"));
  },
  // purple banner: page strip, plus the 1200x630 link preview image
  banner: async (src) => {
    await sharp(src).resize({ width: 2000 }).webp({ quality: 78 }).toFile(out("banner.webp"));
    await sharp(src).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 84 }).toFile(path.join(process.cwd(), "src/app/opengraph-image.jpg"));
  },
  // square textures for the strips between sections; grainy art, so a
  // modest size and quality keep them light
  "texture-teal": (src) => texture(src, "texture-teal.webp"),
  "texture-gold": (src) => texture(src, "texture-gold.webp"),
  "texture-red": (src) => texture(src, "texture-red.webp"),
  // "PASSION BY PROXY" glitter lettering (footer): transparent, trimmed
  glitter: (src) => sharp(src).trim().resize({ width: 1100 }).webp({ quality: 85 }).toFile(out("wordmark-glitter.webp")),
  // arched "passion -by- proxy" (404 page): transparent, trimmed
  arc: (src) => sharp(src).trim().resize({ width: 1000 }).webp({ quality: 85 }).toFile(out("wordmark-arc.webp")),
  // Alliterate's official cover, square
  "album-cover": (src) => sharp(src).resize(1000, 1000).webp({ quality: 82 }).toFile(out("alliterate-cover.webp")),
  // I Won't Be(Long), the first single: its cover, square (Bandcamp has it)
  "iwbl-cover": (src) => sharp(src).resize(1000, 1000).webp({ quality: 82 }).toFile(out("i-wont-be-long-cover.webp")),
  // band photo (about section): never enlarged, at most 1600 px wide
  photo: (src) =>
    sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out("band-photo.webp")),
  // flat logo: just the pill (top part of the square) for the header
  logo: async (src) => {
    const { width, height } = await sharp(src).metadata();
    // crop, then trim, as two passes: sharp runs trim before extract in one
    const band = await sharp(src)
      .extract({ left: 0, top: Math.round(height * 0.09), width, height: Math.round(height * 0.53) })
      .png()
      .toBuffer();
    const pill = await sharp(band).trim().png().toBuffer();
    await sharp(pill).resize({ height: 96 }).webp({ quality: 90 }).toFile(out("logo-pill.webp"));
    // favicon: the pill on black
    const small = await sharp(pill).resize({ width: 440 }).png().toBuffer();
    await sharp({ create: { width: 512, height: 512, channels: 4, background: BLACK } })
      .composite([{ input: small, gravity: "center" }])
      .png()
      .toFile(path.join(process.cwd(), "src/app/icon.png"));
  },
};

function texture(src, name) {
  return sharp(src).resize(1100, 1100).webp({ quality: 50, effort: 6 }).toFile(out(name));
}

fs.mkdirSync(path.join(process.cwd(), "public/media"), { recursive: true });
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`usage: npm run media -- ${Object.keys(jobs).map((k) => `${k}=<file>`).join(" ")}`);
  process.exit(1);
}
for (const arg of args) {
  const [key, src] = arg.split(/=(.*)/s);
  if (!jobs[key]) throw new Error(`unknown artwork "${key}"; expected one of ${Object.keys(jobs).join(", ")}`);
  await jobs[key](src);
  console.log(`${key} <- ${path.basename(src)}`);
}
for (const f of fs.readdirSync(path.join(process.cwd(), "public/media"))) {
  if (f.endsWith(".webp")) console.log(`  ${f}  ${Math.round(fs.statSync(out(f)).size / 1024)} KB`);
}
