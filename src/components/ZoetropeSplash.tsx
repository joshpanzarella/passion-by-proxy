"use client";

import { useEffect, useState } from "react";
import { band } from "@/data/band";
import { SPLASH_KEY, zoetrope } from "@/data/zoetrope";

// Plays once per browser session. The inline script in layout.tsx marks
// <html data-splash="seen"> before first paint for a returning visit or a
// reduced-motion visitor, and CSS hides the splash, so it never flashes.

const PLACEHOLDER_FRAMES = 12;

export function ZoetropeSplash() {
  const [frame, setFrame] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const frameCount = zoetrope.frames.length || PLACEHOLDER_FRAMES;

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.splash) return;

    try {
      window.sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // storage blocked: the splash still plays, just every visit
    }

    const tick = window.setInterval(() => setFrame((f) => (f + 1) % frameCount), 1000 / zoetrope.fps);
    const leave = window.setTimeout(() => setLeaving(true), zoetrope.durationMs);
    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") setLeaving(true);
    };
    window.addEventListener("keydown", skip);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(leave);
      window.removeEventListener("keydown", skip);
    };
  }, [frameCount]);

  useEffect(() => {
    if (!leaving) return;
    const done = window.setTimeout(() => {
      document.documentElement.dataset.splash = "seen";
    }, zoetrope.fadeMs);
    return () => window.clearTimeout(done);
  }, [leaving]);

  return (
    <div
      className={`splash${leaving ? " splash--leaving" : ""}`}
      style={{ transitionDuration: `${zoetrope.fadeMs}ms` }}
      role="presentation"
      onClick={() => setLeaving(true)}
    >
      <div className="splash__stage" aria-hidden="true">
        {zoetrope.frames.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element -- frames swap every tick; next/image adds nothing here
          <img className="splash__frame" src={zoetrope.frames[frame]} alt="" />
        ) : (
          <PlaceholderFrame index={frame} count={frameCount} />
        )}
      </div>
      <p className="splash__name">{band.name}</p>
      <button className="splash__skip" type="button" onClick={() => setLeaving(true)}>
        skip
      </button>
    </div>
  );
}

// A ball bouncing inside a zoetrope slit: stands in until the real frames exist.
function PlaceholderFrame({ index, count }: { index: number; count: number }) {
  const t = index / count;
  const y = 70 - Math.abs(Math.sin(t * Math.PI)) * 50;
  const squash = index === 0 ? 1.25 : 1;
  return (
    <svg viewBox="0 0 100 100" className="splash__frame">
      <line x1="10" y1="82" x2="90" y2="82" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <ellipse cx="50" cy={y} rx={10 * squash} ry={10 / squash} fill="currentColor" />
    </svg>
  );
}
