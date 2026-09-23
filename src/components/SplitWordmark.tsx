"use client";

import { useEffect, useRef } from "react";

// Lettering art cut into pieces (one per letter, by clip-path on copies of
// the same image) that react to scrolling and the pointer, each on its own
// spring so they move with momentum rather than jumping:
//  - scrolling down, the pieces fly off the screen, away from the pointer
//    and outward from the word, spinning
//  - scrolling up, they shrink to a tiny cluster at the pointer
//  - a moment after the scroll stops they spring back together, so the
//    word always comes back readable
// The pointer is the mouse, or on a phone the last touch; before either, the
// middle of the screen. Reduced motion: the art stays still.

export type Piece = {
  // polygon over the art, in % of its box: "x y, x y, ..."
  clip: string;
  // the piece's centre, in % of the box (where it is pushed from and scales about)
  cx: number;
  cy: number;
};

const SETTLE_MS = 450; // no scrolling this long: go home
const SPIN = 140; // degrees a piece turns flying off (alternating direction)
const TINY = 0.06; // scale at the pointer when scrolling up

// spring constants per move: [stiffness, damping]
const FLY: [number, number] = [80, 12];
const SHRINK: [number, number] = [140, 20];
const HOME: [number, number] = [90, 12]; // a little under-damped: lands with a small bounce

type Body = { x: number; y: number; r: number; s: number; vx: number; vy: number; vr: number; vs: number };

export function SplitWordmark({ src, alt, width, height, pieces }: { src: string; alt: string; width: number; height: number; pieces: Piece[] }) {
  const boxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const imgs = Array.from(box.querySelectorAll<HTMLElement>(".split__piece"));
    const bodies: Body[] = pieces.map(() => ({ x: 0, y: 0, r: 0, s: 1, vx: 0, vy: 0, vr: 0, vs: 0 }));

    let pointer: { x: number; y: number } | null = null;
    let lastY = window.scrollY;
    let mode: "home" | "down" | "up" = "home";
    let lastScroll = 0;
    let lastT = 0;
    let raf = 0;
    let near = false;
    // where each piece flies to, fixed at the start of a flight so it does
    // not wobble as the pointer moves
    let flight: { x: number; y: number; r: number }[] = [];

    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min(0.034, lastT ? (t - lastT) / 1000 : 0.016);
      lastT = t;

      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      const r = box.getBoundingClientRect();
      const px = pointer?.x ?? window.innerWidth / 2;
      const py = pointer?.y ?? window.innerHeight / 2;

      if (Math.abs(dy) > 0.5) {
        const next = dy > 0 ? "down" : "up";
        if (next === "down" && mode !== "down") {
          // aim each piece off screen: away from the pointer, out from the word
          const far = Math.hypot(window.innerWidth, window.innerHeight);
          flight = pieces.map((p, i) => {
            const cx = r.left + (p.cx / 100) * r.width;
            const cy = r.top + (p.cy / 100) * r.height;
            let ax = cx - px;
            let ay = cy - py;
            const ad = Math.hypot(ax, ay) || 1;
            const ox = cx - (r.left + r.width / 2);
            const oy = cy - (r.top + r.height / 2);
            const od = Math.hypot(ox, oy) || 1;
            ax = ax / ad + (ox / od) * 0.8;
            ay = ay / ad + (oy / od) * 0.8 - 0.25; // a little lift
            const n = Math.hypot(ax, ay) || 1;
            const dist = far * (1 + 0.15 * i);
            return { x: (ax / n) * dist, y: (ay / n) * dist, r: SPIN * (i % 2 ? -1 : 1) * (1 + 0.3 * i) };
          });
        }
        mode = next;
        lastScroll = t;
      } else if (mode !== "home" && t - lastScroll > SETTLE_MS) {
        mode = "home";
      }

      let moving = false;
      pieces.forEach((p, i) => {
        const b = bodies[i];
        let tx = 0;
        let ty = 0;
        let tr = 0;
        let ts = 1;
        let k = HOME;
        if (mode === "down") {
          ({ x: tx, y: ty, r: tr } = flight[i]);
          k = FLY;
        } else if (mode === "up") {
          const cx = r.left + (p.cx / 100) * r.width;
          const cy = r.top + (p.cy / 100) * r.height;
          // the pieces meet at the pointer, side by side in miniature
          tx = px - cx + (i - (pieces.length - 1) / 2) * 7;
          ty = py - cy;
          ts = TINY;
          k = SHRINK;
        }
        const [stiff, damp] = k;
        b.vx += (stiff * (tx - b.x) - damp * b.vx) * dt;
        b.vy += (stiff * (ty - b.y) - damp * b.vy) * dt;
        b.vr += (stiff * (tr - b.r) - damp * b.vr) * dt;
        b.vs += (stiff * (ts - b.s) - damp * b.vs) * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.r += b.vr * dt;
        b.s = Math.max(0.02, b.s + b.vs * dt);

        const still =
          mode === "home" &&
          Math.abs(b.x) + Math.abs(b.y) < 0.3 &&
          Math.abs(b.r) < 0.1 &&
          Math.abs(b.s - 1) < 0.002 &&
          Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.vr) + Math.abs(b.vs) < 0.5;
        if (still) {
          Object.assign(b, { x: 0, y: 0, r: 0, s: 1, vx: 0, vy: 0, vr: 0, vs: 0 });
          imgs[i].style.transform = "";
        } else {
          moving = true;
          imgs[i].style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${b.r.toFixed(2)}deg) scale(${b.s.toFixed(3)})`;
        }
      });

      if (moving || mode !== "home") raf = window.requestAnimationFrame(frame);
      else lastT = 0;
    };

    const kick = () => {
      if (near && !raf) raf = window.requestAnimationFrame(frame);
    };
    const onPointer = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        lastY = window.scrollY;
        if (near) kick();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(box);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.cancelAnimationFrame(raf);
    };
  }, [pieces]);

  return (
    <span className="split" ref={boxRef} role="img" aria-label={alt} style={{ aspectRatio: `${width} / ${height}` }}>
      {pieces.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- the same small image, clipped per letter
        <img
          key={i}
          className="split__piece"
          src={src}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          style={{ clipPath: `polygon(${p.clip})`, transformOrigin: `${p.cx}% ${p.cy}%` }}
        />
      ))}
    </span>
  );
}
