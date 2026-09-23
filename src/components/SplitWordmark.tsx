"use client";

import { useEffect, useRef } from "react";

// Lettering art cut into pieces (one per letter, by clip-path on copies of
// the same image) that react to scrolling and the pointer:
//  - scrolling down, the pieces split apart and dodge away from the pointer
//    (the nearer a piece, the further it jumps), each with a small spin
//  - scrolling up, they shrink and drift towards the pointer
//  - when the scroll stops they spring back together, so the word always
//    comes back readable
// The pointer is the mouse, or on a phone the last touch; before either, the
// middle of the screen. Reduced motion: the art stays still.

export type Piece = {
  // polygon over the art, in % of its box: "x y, x y, ..."
  clip: string;
  // the piece's centre, in % of the box (where it is pushed from and scales about)
  cx: number;
  cy: number;
};

const PUSH = 90; // px a piece nearest the pointer is pushed at full speed
const SPREAD = 28; // px every piece moves out from the word's centre at full speed
const SPIN = 9; // degrees
const PULL = 0.3; // share of the way to the pointer at full speed upward
const SHRINK = 0.45; // scale lost at full speed upward

export function SplitWordmark({ src, alt, width, height, pieces }: { src: string; alt: string; width: number; height: number; pieces: Piece[] }) {
  const boxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const imgs = Array.from(box.querySelectorAll<HTMLElement>(".split__piece"));

    let pointer: { x: number; y: number } | null = null;
    let lastY = window.scrollY;
    let v = 0; // -1 (scrolling up hard) .. 1 (scrolling down hard)
    let raf = 0;
    let near = false;

    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      const target = Math.max(-1, Math.min(1, dy / 20));
      // follow the scroll quickly, settle back slowly
      v += (target - v) * (Math.abs(target) > Math.abs(v) ? 0.35 : 0.08);
      if (Math.abs(v) < 0.002) v = 0;

      const r = box.getBoundingClientRect();
      const px = pointer?.x ?? window.innerWidth / 2;
      const py = pointer?.y ?? window.innerHeight / 2;
      const wordX = r.left + r.width / 2;
      const wordY = r.top + r.height / 2;

      pieces.forEach((p, i) => {
        const cx = r.left + (p.cx / 100) * r.width;
        const cy = r.top + (p.cy / 100) * r.height;
        let tx = 0;
        let ty = 0;
        let rot = 0;
        let scale = 1;
        if (v > 0) {
          const dx = cx - px;
          const dyp = cy - py;
          const dist = Math.hypot(dx, dyp) || 1;
          const nearness = 1 / (1 + dist / 180);
          const ox = cx - wordX;
          const oy = cy - wordY;
          const odist = Math.hypot(ox, oy) || 1;
          tx = v * ((dx / dist) * PUSH * nearness + (ox / odist) * SPREAD);
          ty = v * ((dyp / dist) * PUSH * nearness + (oy / odist) * SPREAD * 0.5);
          rot = v * SPIN * (i % 2 ? -1 : 1);
        } else if (v < 0) {
          const k = -v;
          tx = (px - cx) * PULL * k;
          ty = (py - cy) * PULL * k;
          // cap the drift so a far-off pointer doesn't fling the word away
          const d = Math.hypot(tx, ty);
          if (d > 140) {
            tx *= 140 / d;
            ty *= 140 / d;
          }
          scale = 1 - SHRINK * k;
          rot = k * SPIN * 0.5 * (i % 2 ? 1 : -1);
        }
        imgs[i].style.transform = v === 0 ? "" : `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });

      if (near && (v !== 0 || dy !== 0)) raf = window.requestAnimationFrame(frame);
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
