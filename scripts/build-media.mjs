// Turns the band's artwork into web-sized files in public/media/.
//
//   npm run media -- cover=U&I.jpg wordmark=U&I-type.png bottles=bottles.png \
//                    banner=banner.jpg logo=logo-flat.png \
//                    texture-teal=… texture-gold=… texture-red=… \
//                    glitter=glitter-type.png arc=arc-type.png photo=band.jpg \
//                    album-cover=alliterate.jpg iwbl-cover=i-wont-be-long.jpg \
//                    shirt-1=tee.jpg shirt-2=boxy-tee.jpg
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
  // purple banner: page strip (its green lettering painted out, as the other
  // strips are only pattern), plus the 1200x630 link preview image (which
  // keeps it)
  banner: async (src) => {
    const page = await sharp(src).resize({ width: 2000 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { data, info } = await paintOutGreen(page);
    await sharp(data, { raw: info }).webp({ quality: 78 }).toFile(out("banner.webp"));
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
  // merch shirts: product shots on white, cut out of it (white would glare
  // on the dark page), for the merch cards' own background
  "shirt-1": (src) => cutOut(src, "shirt-1.webp"),
  "shirt-2": (src) => cutOut(src, "shirt-2.webp"),
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

// The green lettering, painted over with the art's own pattern from higher
// up and to the left (FROM), through a soft mask: the green (and the faint
// green spray about it) grown to cover the letters' shadows, then blurred at
// the rim. Worked out on the 2000 px copy.
const FROM = { x: -150, y: -350 };
async function paintOutGreen({ data, info }) {
  const { width: w, height: h, channels: c } = info;
  const n = w * h;
  const strong = new Uint8Array(n);
  const faint = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const [r, g, b] = [data[i * c], data[i * c + 1], data[i * c + 2]];
    const lead = g - Math.max(r, b);
    strong[i] = lead > 50 && g > 110 ? 255 : 0;
    faint[i] = lead > 12 ? 255 : 0;
  }
  const near = grow(strong, w, h, 60);
  const green = strong.map((v, i) => (v || (faint[i] && near[i]) ? 255 : 0));
  const mask = await sharp(grow(green, w, h, 20), { raw: { width: w, height: h, channels: 1 } }).blur(10).extractChannel(0).raw().toBuffer();
  const res = Buffer.from(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const a = Math.min(255, mask[i] * 2) / 255; // solid inside, soft at the rim
      if (!a) continue;
      const j = Math.min(h - 1, Math.max(0, y + FROM.y)) * w + Math.min(w - 1, Math.max(0, x + FROM.x));
      for (let k = 0; k < 3; k++) res[i * c + k] = Math.round(data[j * c + k] * a + data[i * c + k] * (1 - a));
    }
  }
  return { data: res, info };
}

// a square max filter: each pixel takes the largest value within r of it
function grow(src, w, h, r) {
  const across = new Uint8Array(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r) && m < 255; k++) m = Math.max(m, src[y * w + k]);
      across[y * w + x] = m;
    }
  }
  const out = new Uint8Array(src.length);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let m = 0;
      for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r) && m < 255; k++) m = Math.max(m, across[k * w + x]);
      out[y * w + x] = m;
    }
  }
  return out;
}

// A dark garment on white, cut out. The white joined to the edges goes
// clear (a flood from the border, so any white in a print stays), and the
// rim, a blend of garment and white, keeps as much as the garment shows
// through: pixel = a * garment + (1 - a) * white, solved for a.
const GARMENT = 18; // the shirts' black, at its edges
async function cutOut(src, name) {
  const { data, info } = await sharp(src).resize(900, 900).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;
  const lum = (i) => 0.2126 * data[i * 3] + 0.7152 * data[i * 3 + 1] + 0.0722 * data[i * 3 + 2];
  const back = new Uint8Array(n);
  const todo = [];
  for (let x = 0; x < w; x++) todo.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) todo.push(y * w, y * w + w - 1);
  while (todo.length) {
    const i = todo.pop();
    if (back[i] || lum(i) < 200) continue;
    back[i] = 255;
    const x = i % w;
    if (x > 0) todo.push(i - 1);
    if (x < w - 1) todo.push(i + 1);
    if (i >= w) todo.push(i - w);
    if (i < n - w) todo.push(i + w);
  }
  const rim = grow(back, w, h, 2);
  const res = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    let a = 255;
    let rgb = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    if (rim[i]) {
      a = Math.round(Math.max(0, Math.min(1, (255 - lum(i)) / (255 - GARMENT))) * 255);
      rgb = [GARMENT, GARMENT, GARMENT];
    }
    res.set([...rgb, a], i * 4);
  }
  await sharp(res, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 82, alphaQuality: 90 }).toFile(out(name));
}

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
