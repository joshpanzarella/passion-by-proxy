"use client";

import { useEffect, useRef } from "react";
import { zoetrope } from "@/data/zoetrope";

// The splash's drum, driven by the scroll wheel: every STEP_PX of scroll is
// one frame, and the slits show while the page is moving. At the top of the
// page it rests on the frame the splash stopped on.

const STEP_PX = 70;
const SLIT_STEP = 0.37;

export function HeroLogo({ alt }: { alt: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    const imgs = Array.from(stage.querySelectorAll<HTMLImageElement>(".hero-logo__frame"));
    const slits = stage.querySelector<HTMLElement>(".slits");
    const n = imgs.length;

    let lastY = window.scrollY;
    let frame = zoetrope.landOn;
    let speed = 0;
    let slitOffset = 0;
    let raf = 0;

    const loop = () => {
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      lastY = y;
      speed = speed * 0.82 + Math.min(dy, 40) * 0.18;

      const visible = y < window.innerHeight * 1.2;
      if (visible) {
        const f = (((zoetrope.landOn + Math.floor(y / STEP_PX)) % n) + n) % n;
        if (f !== frame) {
          imgs[frame].style.opacity = "0";
          imgs[f].style.opacity = "1";
          frame = f;
          slitOffset = (slitOffset + SLIT_STEP) % 1;
          if (slits) slits.style.backgroundPositionX = `calc(var(--slit-pitch) * ${slitOffset})`;
        }
        if (slits) slits.style.opacity = String(Math.min(1, speed / 10));
      }

      raf = speed > 0.05 || dy > 0 ? window.requestAnimationFrame(loop) : 0;
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(loop);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-logo" ref={stageRef}>
      {zoetrope.frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- already cached by the splash; frames swap by opacity
        <img
          key={src}
          className="hero-logo__frame"
          src={src}
          alt={i === zoetrope.landOn ? alt : ""}
          aria-hidden={i === zoetrope.landOn ? undefined : true}
          width={900}
          height={621}
          style={{ opacity: i === zoetrope.landOn ? 1 : 0 }}
        />
      ))}
      <div className="slits" aria-hidden="true" />
    </div>
  );
}
