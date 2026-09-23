"use client";

import { useEffect, useRef } from "react";

// Left alone long enough, the home page melts: everything on screen slides
// down in drips of different lengths, slowly and then faster, uncovering the
// static behind (stronger while it melts), and cues at both edges say how
// to fix it. Once it has melted, the static carries closed captions: a
// random song's lines from a random place, one at a time, each typed in word
// by word like live TV captions. Any scroll, tap or key puts it all back at
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

const IDLE_MS = 7_000; // this long without scrolling, and it starts
const MELT_MS = 9_000; // to melt all the way
const DEPTH = 0.8; // how far the longest drip falls, of the screen's height
const FINE = 4 / 255; // the fine map's scale, as a share of the main one's
const WORD_MS = 180; // a caption types in a word this often
const HOLD_MS = 2_000; // and stays up this long once it is all in

// captions: each song's lines, in order
export function Melt({ captions }: { captions: string[][] }) {
  const filterRef = useRef<SVGFilterElement>(null);
  const cropRef = useRef<SVGFEOffsetElement>(null);
  const coarseRef = useRef<SVGFEImageElement>(null);
  const fineRef = useRef<SVGFEImageElement>(null);
  const shiftRef = useRef<SVGFEDisplacementMapElement>(null);
  const nudgeRef = useRef<SVGFEDisplacementMapElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    const filter = filterRef.current;
    const crop = cropRef.current;
    const coarse = coarseRef.current;
    const fine = fineRef.current;
    const shift = shiftRef.current;
    const nudge = nudgeRef.current;
    const caption = captionRef.current;
    if (!main || !filter || !crop || !coarse || !fine || !shift || !nudge || !caption) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    let idle = 0;
    let raf = 0;
    let start = 0;
    let timers: number[] = []; // the captions'
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    // one line, word by word, then the song's next line
    const roll = (lines: string[], i: number) => {
      const words = lines[i % lines.length].split(/\s+/);
      words.forEach((_, n) =>
        later(() => {
          caption.textContent = `♪ ${words.slice(0, n + 1).join(" ")}${n === words.length - 1 ? " ♪" : ""}`;
        }, n * WORD_MS),
      );
      later(() => roll(lines, i + 1), words.length * WORD_MS + HOLD_MS);
    };

    const reset = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      caption.textContent = "";
      if (root.dataset.melting !== undefined) {
        delete root.dataset.melting;
        shift.setAttribute("scale", "0");
        nudge.setAttribute("scale", "0");
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(melt, IDLE_MS);
    };

    const melt = () => {
      if (!root.dataset.splash || document.hidden || document.activeElement?.tagName === "IFRAME") return reset();
      const box = { x: 0, y: -main.getBoundingClientRect().top, width: main.clientWidth, height: window.innerHeight };
      for (const el of [filter, coarse, fine]) {
        for (const [k, v] of Object.entries(box)) el.setAttribute(k, String(v));
      }
      // only what shows below the header falls; nothing flows in from above
      // it, so what melts away uncovers the static
      const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
      const seen = { ...box, y: box.y + header, height: box.height - header };
      for (const [k, v] of Object.entries(seen)) crop.setAttribute(k, String(v));
      const fall = DEPTH * window.innerHeight; // px, at the full melt
      const maps = drips(Math.round(box.width), Math.round(box.height), fall);
      coarse.setAttribute("href", maps.coarse);
      fine.setAttribute("href", maps.fine);
      root.dataset.melting = "";
      start = performance.now();
      raf = window.requestAnimationFrame(frame);
      const sung = captions.filter((lines) => lines.length > 0);
      if (sung.length > 0) {
        const lines = sung[Math.floor(Math.random() * sung.length)];
        later(() => roll(lines, Math.floor(Math.random() * lines.length)), MELT_MS);
      }
    };

    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / MELT_MS);
      // a column falls scale × its share of the map (half, at most)
      const scale = p * p * DEPTH * window.innerHeight * 2;
      shift.setAttribute("scale", String(scale));
      nudge.setAttribute("scale", String(scale * FINE));
      raf = p < 1 ? window.requestAnimationFrame(frame) : 0;
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
          <feDisplacementMap ref={nudgeRef} in="fell" in2="fine" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
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

// The drip map, over the screen: how far each column falls, in green
// (mid-grey stays put, darker falls further). Slow waves across the screen,
// a few drips that fall much further, and a little more fall lower down, so
// things stretch as they go. A drip is shaped like one of paint, worked out
// in screen pixels (the map is w by h px; depthPx is the full fall):
// straight sides, a round tip (a half circle, at the full melt), and
// rounded shoulders where it leaves the surface (a quarter circle each
// side), so no corner is square. Drips that meet merge (the larger fall
// wins), so none is ever cut off flat.
//
// The main map holds the nearest of its 256 steps, and the fine map (at FINE
// of the scale) holds what is left over; its red also cancels the main map's
// small sideways shift (128 is a hair past the middle).
function drips(w: number, h: number, depthPx: number) {
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
  const fall = Array.from({ length: w }, (_, px) => {
    const base = surface(px);
    let f = base;
    for (const d of drops) {
      const dx = Math.abs(px - d.x);
      const out = dx - d.radius; // past the drip's side
      if (dx < d.radius) f = Math.max(f, d.reach - d.radius + Math.sqrt(d.radius ** 2 - dx ** 2));
      else if (out < d.shoulder) f = Math.max(f, base + d.shoulder - Math.sqrt(d.shoulder ** 2 - (d.shoulder - out) ** 2));
    }
    return Math.min(1, Math.max(0, f / depthPx));
  });

  const main = canvas(w, h);
  const extra = canvas(w, h);
  if (!main || !extra) return { coarse: "", fine: "" };
  for (let y = 0; y < h; y++) {
    const stretch = 0.75 + (0.25 * y) / (h - 1);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const k = fall[x] * stretch;
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
    }
  }
  return { coarse: main.url(), fine: extra.url() };
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
