"use client";

import { useEffect, useMemo, useState } from "react";
import { SPLASH_KEY, buildSchedule, zoetrope } from "@/data/zoetrope";

// Plays once per browser session. The inline script in layout.tsx marks
// <html data-splash="seen"> before first paint for a returning visit or a
// reduced-motion visitor, and CSS hides the splash, so it never flashes.
//
// Every frame is mounted at once and only the current one is shown, so a
// frame change never waits on a decode.

type Phase = "loading" | "spinning" | "holding" | "leaving";

// Slits move this share of one slit's pitch per frame: the drum turning.
const SLIT_STEP = 0.37;

export function ZoetropeSplash() {
  const schedule = useMemo(() => buildSchedule(), []);
  const [phase, setPhase] = useState<Phase>("loading");
  const [step, setStep] = useState(0);

  // Wait for the frames (up to loadTimeoutMs), then start the run.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.splash) return;

    try {
      window.sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // storage blocked: the splash still plays, just every visit
    }

    let cancelled = false;
    const loads = zoetrope.frames.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        }),
    );
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, zoetrope.loadTimeoutMs));
    Promise.race([Promise.all(loads), timeout]).then(() => {
      if (!cancelled) setPhase((p) => (p === "loading" ? "spinning" : p));
    });

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") setPhase("leaving");
    };
    window.addEventListener("keydown", skip);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", skip);
    };
  }, []);

  // Advance one step at a time; each step has its own duration.
  useEffect(() => {
    if (phase !== "spinning") return;
    const id = window.setTimeout(() => {
      if (step + 1 < schedule.length) setStep(step + 1);
      else setPhase("holding");
    }, schedule[step].ms);
    return () => window.clearTimeout(id);
  }, [phase, step, schedule]);

  useEffect(() => {
    if (phase !== "holding") return;
    const id = window.setTimeout(() => setPhase("leaving"), zoetrope.holdMs);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => {
      document.documentElement.dataset.splash = "seen";
    }, zoetrope.fadeMs);
    return () => window.clearTimeout(id);
  }, [phase]);

  const current = phase === "loading" ? null : schedule[step];
  const speed = phase === "spinning" && current ? current.speed : 0;
  // A frame seen through a moving slit never sits in quite the same place.
  const jitter = speed > 0 ? ((step * 7919) % 5) - 2 : 0;

  return (
    <div
      className={`splash${phase === "leaving" ? " splash--leaving" : ""}`}
      style={{ transitionDuration: `${zoetrope.fadeMs}ms` }}
      role="presentation"
      onClick={() => setPhase("leaving")}
    >
      <div
        className="splash__stage"
        aria-hidden="true"
        style={{ transform: `translateX(${jitter * speed * 0.4}%)` }}
      >
        {zoetrope.frames.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- all frames stay mounted and swap by opacity; next/image adds nothing here
          <img
            key={src}
            className="splash__frame"
            src={src}
            alt=""
            style={{ opacity: current?.frame === i ? 1 : 0 }}
          />
        ))}
        <div
          className="slits"
          style={{
            opacity: speed,
            backgroundPositionX: `calc(var(--slit-pitch) * ${(step * SLIT_STEP) % 1})`,
          }}
        />
      </div>
      <button className="splash__skip" type="button" onClick={() => setPhase("leaving")}>
        skip
      </button>
    </div>
  );
}
