"use client";

import { useEffect, useRef } from "react";

// Left alone long enough, the home page melts: everything on screen slides
// down in drips of different lengths, slowly and then faster, uncovering the
// static behind (stronger while it melts), then sinks off the bottom
// altogether, leaving only the static and captions. Cues at both edges say how
// to fix it. Halfway through, the static starts carrying closed captions: a
// random song's lines from a random place, one at a time, each typed in
// uneven bursts of a word or a few, as live TV captions come in, with the
// song's title by the logo in the header. Any scroll, tap or key puts it all back at
// once.
//
// It is an SVG displacement filter on <main> (html[data-melting] in
// globals.css), so the real page melts, text and all. The filter covers only
// the screen, in <main>'s own coordinates; the drip map is drawn fresh each
// time, full size, with a second, fine map that adds the part of each fall
// the first cannot hold (a map has only 256 steps), so edges fall to a
// fraction of a pixel and the melt stays liquid, not stair-stepped. Home
// page only, never for reduced motion, not during the splash, and not while
// someone is using an embedded player (focus in an iframe).
//
// Safari (and so every browser on iOS) works a displacement map out on the
// processor, a few frames a second on a phone's dense screen. There the page
// falls in thin columns instead (html[data-melting="columns"]), each the
// same page simply moved down, which it does at full speed: the same drips,
// waves and round tips, without the stretch.

const IDLE_MS = 7_000; // this long without scrolling, and it starts
const MELT_MS = 9_000; // to melt all the way
const DEPTH = 1.2; // how far the longest drip falls, of the screen's height (past the bottom)
const STRETCH = 0.75; // the fall at the top of the screen, as a share of that at the bottom
const FINE = 4 / 255; // the fine map's scale, as a share of the main one's
const ROUND_PX = 32; // the largest drip tip or shoulder
const ROUND_BY = 0.25; // tips and shoulders are fully formed by this share of the melt
const SINK = 4; // after the melt, everything sinks this many screens × (time past it, in melts)²
const COLUMN_PX = 4; // in columns, the width of each
const COLUMNS_MAX = 190; // Safari drops a filter of over 200 parts
const SVG_NS = "http://www.w3.org/2000/svg";
const BURST_MS = [80, 400] as const; // the gap between bursts of words, at random
const HOLD_MS = [1_400, 3_000] as const; // a finished line stays up this long, at random
const between = ([lo, hi]: readonly [number, number]) => lo + Math.random() * (hi - lo);

// captions: each song's title, and its lines in order
export function Melt({ captions }: { captions: { title: string; lines: string[] }[] }) {
  const filterRef = useRef<SVGFilterElement>(null);
  const cropRef = useRef<SVGFEOffsetElement>(null);
  const coarseRef = useRef<SVGFEImageElement>(null);
  const fineRef = useRef<SVGFEImageElement>(null);
  const shiftRef = useRef<SVGFEDisplacementMapElement>(null);
  const nudgeRef = useRef<SVGFEDisplacementMapElement>(null);
  const tipsRef = useRef<SVGFEImageElement>(null);
  const roundRef = useRef<SVGFEDisplacementMapElement>(null);
  const sinkRef = useRef<SVGFEOffsetElement>(null);
  const columnsRef = useRef<SVGFilterElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    const filter = filterRef.current;
    const columnsFilter = columnsRef.current;
    const crop = cropRef.current;
    const coarse = coarseRef.current;
    const fine = fineRef.current;
    const shift = shiftRef.current;
    const nudge = nudgeRef.current;
    const tips = tipsRef.current;
    const round = roundRef.current;
    const sink = sinkRef.current;
    const caption = captionRef.current;
    if (!main || !filter || !crop || !coarse || !fine || !shift || !nudge || !tips || !round || !sink || !columnsFilter || !caption) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const inColumns = "GestureEvent" in window; // only Safari has it
    let columns: { el: Element; length: number; tip: number }[] = [];
    let idle = 0;
    let raf = 0;
    let start = 0;
    let header = 0; // its bottom, from the top of the screen
    const playing = document.querySelector<HTMLElement>(".site-header__playing");
    let timers: number[] = []; // the captions'
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    // one line, in bursts (mostly a word, sometimes two or three at once, at
    // uneven gaps), held a while, then the song's next line
    const roll = (lines: string[], i: number) => {
      const words = lines[i % lines.length].split(/\s+/);
      let at = 0;
      for (let n = 0; n < words.length; ) {
        n = Math.min(words.length, n + 1 + (Math.random() < 0.35 ? 1 + Math.floor(Math.random() * 2) : 0));
        const shown = n;
        later(() => {
          caption.textContent = `♪ ${words.slice(0, shown).join(" ")}${shown === words.length ? " ♪" : ""}`;
        }, at);
        at += between(BURST_MS);
      }
      later(() => roll(lines, i + 1), at + between(HOLD_MS));
    };

    const reset = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      caption.textContent = "";
      if (playing) playing.textContent = "";
      if (root.dataset.melting !== undefined) {
        delete root.dataset.melting;
        for (const el of [shift, nudge, round]) el.setAttribute("scale", "0");
        sink.setAttribute("dy", "0");
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(melt, IDLE_MS);
    };

    const melt = () => {
      if (!root.dataset.splash || document.hidden || document.activeElement?.tagName === "IFRAME") return reset();
      const box = { x: 0, y: -main.getBoundingClientRect().top, width: main.clientWidth, height: window.innerHeight };
      // only what shows below the header falls; nothing flows in from above
      // it, so what melts away uncovers the static
      header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      const seen = { ...box, y: box.y + header, height: box.height - header };
      const w = Math.round(box.width);
      const shape = drips(w, DEPTH * window.innerHeight); // px, at the full melt
      if (inColumns) {
        // a column every COLUMN_PX (a pixel wider, so no seam shows between
        // two), each the page moved down by the fall at its middle; the
        // filter starts below the header, so nothing above it flows in
        const n = Math.min(COLUMNS_MAX, Math.ceil(w / COLUMN_PX));
        const merge = svg("feMerge", {});
        columns = Array.from({ length: n }, (_, i) => {
          const x0 = Math.round((i * w) / n);
          const x1 = Math.round(((i + 1) * w) / n);
          merge.append(svg("feMergeNode", { in: `c${i}` }));
          const el = svg("feOffset", { in: "SourceGraphic", result: `c${i}`, x: x0, width: x1 - x0 + 1, y: seen.y, height: seen.height });
          return { el, ...shape[Math.min(w - 1, (x0 + x1) >> 1)] };
        });
        columnsFilter.replaceChildren(...columns.map((c) => c.el), merge);
        set(columnsFilter, seen);
        root.dataset.melting = "columns";
      } else {
        for (const el of [filter, coarse, fine, tips]) set(el, box);
        set(crop, seen);
        const urls = maps(shape, Math.round(box.height));
        coarse.setAttribute("href", urls.coarse);
        fine.setAttribute("href", urls.fine);
        tips.setAttribute("href", urls.tips);
        root.dataset.melting = "";
      }
      start = performance.now();
      raf = window.requestAnimationFrame(frame);
      const sung = captions.filter((song) => song.lines.length > 0);
      if (sung.length > 0) {
        const song = sung[Math.floor(Math.random() * sung.length)];
        later(() => {
          if (playing) playing.textContent = `♪ ${song.title}`;
          roll(song.lines, Math.floor(Math.random() * song.lines.length));
        }, MELT_MS / 2);
      }
    };

    const frame = (now: number) => {
      const p = (now - start) / MELT_MS; // past 1, the melt goes on as it sinks
      // a column falls scale × its share of the map (half, at most)
      const scale = p * p * DEPTH * window.innerHeight * 2;
      // tips and shoulders form early, at full size, then ride down on the
      // drips: round the whole way, never squashed flat by the scale
      const t = Math.min(1, p / ROUND_BY);
      const rounding = t * t * (3 - 2 * t) * ROUND_PX;
      // then all of it sinks too, from a standstill, faster and faster (the
      // drips keep their own speed), until nothing is left on screen
      const past = Math.max(0, p - 1);
      const gone = SINK * past * past;
      const h = window.innerHeight;
      if (inColumns) {
        for (const c of columns) {
          // where the map would have this column's top edge: its fall grows
          // down the screen, from STRETCH of the full fall at the top
          const full = (scale / 2) * c.length;
          const left = 1 - ((1 - STRETCH) * full) / h;
          const edge = left > 0 ? Math.min(h, (header + STRETCH * full) / left - header) : h;
          c.el.setAttribute("dy", String(edge + rounding * c.tip + gone * h));
        }
      } else {
        shift.setAttribute("scale", String(scale));
        nudge.setAttribute("scale", String(scale * FINE));
        round.setAttribute("scale", String(rounding * (255 / 127)));
        sink.setAttribute("dy", String(gone * h));
      }
      raf = gone < 1.05 ? window.requestAnimationFrame(frame) : 0;
    };

    const events = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const e of events) window.addEventListener(e, reset, { passive: true });
    reset();
    return () => {
      for (const e of events) window.removeEventListener(e, reset);
      window.clearTimeout(idle);
      window.cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      delete root.dataset.melting;
    };
  }, [captions]);

  return (
    <>
      <svg className="melt" aria-hidden="true" width="0" height="0">
        <filter ref={filterRef} id="melt" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feOffset ref={cropRef} in="SourceGraphic" result="seen" />
          <feImage ref={coarseRef} preserveAspectRatio="none" result="coarse" />
          <feImage ref={fineRef} preserveAspectRatio="none" result="fine" />
          <feDisplacementMap ref={shiftRef} in="seen" in2="coarse" scale="0" xChannelSelector="R" yChannelSelector="G" result="fell" />
          <feDisplacementMap ref={nudgeRef} in="fell" in2="fine" scale="0" xChannelSelector="R" yChannelSelector="G" result="grown" />
          <feImage ref={tipsRef} preserveAspectRatio="none" result="tips" />
          <feDisplacementMap ref={roundRef} in="grown" in2="tips" scale="0" xChannelSelector="R" yChannelSelector="G" result="melted" />
          <feOffset ref={sinkRef} in="melted" dx="0" dy="0" />
        </filter>
        {/* Safari's: the columns are made for each melt */}
        <filter ref={columnsRef} id="melt-columns" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" />
      </svg>
      {/* one each side, bobbing at slightly different rates: in step, out,
          and back in */}
      <p className="melt-cue melt-cue--left" aria-hidden="true">
        scroll ↕
      </p>
      <p className="melt-cue melt-cue--right" aria-hidden="true">
        scroll ↕
      </p>
      <p className="melt-captions" aria-hidden="true">
        <span ref={captionRef} />
      </p>
    </>
  );
}

// The drips, across the screen: how far each column falls. Slow waves
// across the screen, and a few drips that fall much further. A drip is
// shaped like one of paint, worked out in screen pixels (w px across;
// depthPx is the full fall): straight sides, a round tip (a half circle),
// and rounded shoulders where it leaves the surface (a quarter circle each
// side), so no corner is square. Drips that meet merge (the larger fall
// wins), so none is ever cut off flat.
//
// Each column's fall is split in two, so the round parts keep their shape
// while the drips grow: its length (scaled up through the melt) and its tip
// or shoulder (at full size from early on).
function drips(w: number, depthPx: number) {
  const r = () => Math.random() * Math.PI * 2;
  const phase = [r(), r(), r()];
  // the surface: slow waves, in px of fall
  const surface = (px: number) => {
    const a = (px / w) * Math.PI * 2;
    return (0.3 + 0.15 * Math.sin(a * 1.3 + phase[0]) + 0.1 * Math.sin(a * 3.7 + phase[1]) + 0.05 * Math.sin(a * 9.1 + phase[2])) * depthPx;
  };
  const drops = Array.from({ length: 9 }, () => {
    const x = Math.random() * w;
    const radius = 8 + Math.random() * 22;
    const shoulder = 12 + Math.random() * 14;
    const reach = Math.min(0.97 * depthPx, surface(x) + radius + shoulder + (0.1 + Math.random() * 0.45) * depthPx);
    return { x, radius, shoulder, reach };
  });
  // per column: its length (of the full fall) and its tip (of ROUND_PX)
  const shape = Array.from({ length: w }, (_, px) => {
    const base = surface(px);
    let length = base;
    let tip = 0;
    for (const d of drops) {
      const dx = Math.abs(px - d.x);
      const out = dx - d.radius; // past the drip's side
      let l = 0;
      let t = -1;
      if (dx < d.radius) {
        l = d.reach - d.radius;
        t = Math.sqrt(d.radius ** 2 - dx ** 2);
      } else if (out < d.shoulder) {
        l = base;
        t = d.shoulder - Math.sqrt(d.shoulder ** 2 - (d.shoulder - out) ** 2);
      }
      if (t >= 0 && l + t > length + tip) {
        length = l;
        tip = t;
      }
    }
    return { length: Math.min(1, Math.max(0, length / depthPx)), tip: Math.min(1, tip / ROUND_PX) };
  });

  return shape;
}

// The drips as displacement maps over the screen (h px tall), for the
// filter: in green, mid-grey stays put and darker falls further, and a
// little more fall lower down, so things stretch as they go. The length is
// in the main and fine maps, the tip in the tips map. The main map holds the
// nearest of its 256 steps, and the fine map (at FINE of the scale) holds
// what is left over; its red also cancels the main map's small sideways
// shift (128 is a hair past the middle).
function maps(shape: { length: number; tip: number }[], h: number) {
  const w = shape.length;
  const main = canvas(w, h);
  const extra = canvas(w, h);
  const round = canvas(w, h);
  if (!main || !extra || !round) return { coarse: "", fine: "", tips: "" };
  for (let y = 0; y < h; y++) {
    const stretch = STRETCH + ((1 - STRETCH) * y) / (h - 1);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const k = shape[x].length * stretch;
      main.img.data[i] = 128; // no sideways shift
      main.img.data[i + 2] = 128;
      main.img.data[i + 3] = 255;
      // the fall as a share of the scale (up is negative), split in two
      const want = (-127 / 255) * k;
      const g = Math.min(255, Math.max(0, Math.round(127.5 + want * 255)));
      const left = want - (g / 255 - 0.5);
      main.img.data[i + 1] = g;
      extra.img.data[i] = 96; // cancels main's red of 128
      extra.img.data[i + 1] = Math.round(127.5 + (left / FINE) * 255);
      extra.img.data[i + 2] = 128;
      extra.img.data[i + 3] = 255;
      // the tip: 128 steps over ROUND_PX is fine enough
      round.img.data[i] = 128;
      round.img.data[i + 1] = Math.round(128 - 127 * shape[x].tip);
      round.img.data[i + 2] = 128;
      round.img.data[i + 3] = 255;
    }
  }
  return { coarse: main.url(), fine: extra.url(), tips: round.url() };
}

function svg(name: string, values: Record<string, string | number>) {
  return set(document.createElementNS(SVG_NS, name), values);
}

function set<T extends Element>(el: T, values: Record<string, string | number>) {
  for (const [k, v] of Object.entries(values)) el.setAttribute(k, String(v));
  return el;
}

function canvas(w: number, h: number) {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  const ctx = el.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  return {
    img,
    url: () => {
      ctx.putImageData(img, 0, 0);
      return el.toDataURL();
    },
  };
}
