"use client";

import { useEffect, useRef, useState } from "react";
import { band } from "@/data/band";
import { SPLASH_KEY, splashCss, zoetrope } from "@/data/zoetrope";

// Plays once per browser session. The inline script in layout.tsx marks
// <html data-splash="seen"> before first paint for a returning visit or a
// reduced-motion visitor, and CSS hides the splash, so it never flashes.
//
// The spin itself is CSS keyframes built from the schedule (splashCss), so
// the browser keeps its beat even while the page is busy loading. Script
// only decides when it starts (every frame decoded) and when it ends.

type Phase = "loading" | "spinning" | "holding" | "leaving";

const { css, totalMs } = splashCss();

export function ZoetropeSplash() {
  const [phase, setPhase] = useState<Phase>("loading");
  const stageRef = useRef<HTMLDivElement>(null);
  const landed = useRef(false); // the drum has stopped on the hero's frame

  // Decode every frame (not just download it) before the first beat, so no
  // frame stalls the first time it shows; then start.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.splash) return;

    try {
      window.sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // storage blocked: the splash still plays, just every visit
    }

    let cancelled = false;
    const imgs = Array.from(stageRef.current?.querySelectorAll("img") ?? []);
    const ready = Promise.all(imgs.map((img) => img.decode().catch(() => {})));
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, zoetrope.loadTimeoutMs));
    Promise.race([ready, timeout]).then(() => {
      // one more frame so the decoded images are painted before the beat starts
      window.requestAnimationFrame(() => {
        if (!cancelled) setPhase((p) => (p === "loading" ? "spinning" : p));
      });
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

  // End of the spin. The stage's animation ending is the signal; the timer
  // is a backstop in case the browser drops the event.
  useEffect(() => {
    if (phase !== "spinning") return;
    const id = window.setTimeout(() => setPhase((p) => (p === "spinning" ? "holding" : p)), totalMs + 250);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "holding") return;
    landed.current = true;
    const id = window.setTimeout(() => setPhase("leaving"), zoetrope.holdMs);
    return () => window.clearTimeout(id);
  }, [phase]);

  // The black behind the drum fades (CSS). Once the drum has stopped, it is
  // showing the hero logo's frame, so it glides and shrinks onto the hero
  // logo, which stays hidden until it arrives: one logo throughout, never
  // two. Skipped mid-spin, or with the hero logo off screen, it fades out
  // with the black instead.
  useEffect(() => {
    if (phase !== "leaving") return;
    const stage = stageRef.current;
    const logo = document.querySelector<HTMLElement>(".hero-logo");
    const from = stage?.getBoundingClientRect();
    const to = logo?.getBoundingClientRect();
    const timing: KeyframeAnimationOptions = { duration: zoetrope.fadeMs, easing: zoetrope.leaveEase, fill: "forwards" };

    let anim: Animation | undefined;
    if (landed.current && stage && logo && from && to && to.width > 0 && to.bottom > 0 && to.top < window.innerHeight) {
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      logo.style.visibility = "hidden";
      // a script animation outranks the stage's CSS one, so no fight over transform
      anim = stage.animate(
        [{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})` }],
        timing,
      );
    } else {
      anim = stage?.animate([{ opacity: 1 }, { opacity: 0 }], timing);
    }

    // hand over the moment the glide ends; the timer is a backstop
    let done = false;
    const handOver = () => {
      if (done) return;
      done = true;
      if (logo) logo.style.visibility = "";
      document.documentElement.dataset.splash = "seen";
    };
    anim?.finished.then(handOver, () => {});
    const id = window.setTimeout(handOver, zoetrope.fadeMs + 250);
    return () => window.clearTimeout(id);
  }, [phase]);

  const playing = phase !== "loading";

  return (
    <div
      className={`splash${playing ? " splash--play" : ""}${phase === "leaving" ? " splash--leaving" : ""}`}
      style={{ "--leave-ms": `${zoetrope.fadeMs}ms`, "--leave-ease": zoetrope.leaveEase } as React.CSSProperties}
      role="presentation"
      onClick={() => setPhase("leaving")}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className="splash__stage"
        ref={stageRef}
        aria-hidden="true"
        onAnimationEnd={(e) => {
          if (e.animationName === "pbp-stage") setPhase((p) => (p === "spinning" ? "holding" : p));
        }}
      >
        {zoetrope.frames.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element -- frames swap by opacity; next/image adds nothing here
          <img key={src} className="splash__frame" src={src} alt="" decoding="async" />
        ))}
        <div className="slits" />
      </div>
      {/* the name in katakana under the logo, a copy in each frame's
          lettering colour, shown with its frame; it stays behind (fades)
          when the logo glides off to the hero */}
      <p className="splash__ja" lang="ja" aria-hidden="true">
        {zoetrope.frames.map((src, f) => (
          <span key={src} style={{ color: zoetrope.lettering[f] }}>
            {band.nameJapanese}
          </span>
        ))}
      </p>
      <button className="splash__skip" type="button" onClick={() => setPhase("leaving")}>
        skip
      </button>
    </div>
  );
}
