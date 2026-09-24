"use client";

import { useEffect, useRef, useState } from "react";
import type { Stanza } from "@/data/lyrics";

// ⅋ (a turned &, as in "U⅋I") isn't in the site's font: the font's own &,
// turned over (.turned-amp)
const withTurnedAmps = (line: string) =>
  line.split("⅋").flatMap((part, i) => (i ? [<span key={i} className="turned-amp">&amp;</span>, part] : [part]));

// The lyrics column with its reading light and film strip.
//
// Reading light: the stanza under the middle of the screen is full
// strength and the rest ease back, like the one frame lit in a zoetrope's
// slit. Film strip (wide screens): a frame per stanza in the margin, the
// current one lit; tap a frame to go to that stanza.
//
// Both are extras. Without JavaScript, or with reduced motion, every stanza
// is full strength and nothing moves (the dimming is switched on by
// data-focus, which only this script sets).
export function LyricsReader({ stanzas }: { stanzas: Stanza[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-stanza]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.stanza));
      },
      // a band across the middle of the screen
      { rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // the last stanza or two can never reach the middle of the screen (the
    // page ends first): at the bottom of the page, light the last one
    const atEnd = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setCurrent(els.length - 1);
    };
    window.addEventListener("scroll", atEnd, { passive: true });
    queueMicrotask(() => setFocus(true));
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", atEnd);
    };
  }, []);

  const go = (i: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCurrent(i);
    rootRef.current?.querySelector(`[data-stanza="${i}"]`)?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="lyrics__body" ref={rootRef} data-focus={focus ? "" : undefined}>
      <ol className="lyrics__reel" aria-label="jump to a part of the song">
        {stanzas.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              className={`lyrics__frame lyrics__frame--${s.kind}`}
              aria-current={focus && i === current ? "true" : undefined}
              aria-label={`${s.label ?? "verse"} ${i + 1}`}
              title={s.label ?? "verse"}
              onClick={() => go(i)}
            />
          </li>
        ))}
      </ol>
      <div className="lyrics__text">
        {stanzas.map((s, i) => (
          <section
            key={i}
            className={`stanza stanza--${s.kind}`}
            data-stanza={i}
            data-current={focus && i === current ? "" : undefined}
            aria-label={s.label}
          >
            {s.label && s.kind !== "verse" && <p className="stanza__label">{s.label}</p>}
            <p className="stanza__lines">
              {s.lines.map((line, j) => (
                <span key={j} className="stanza__line">
                  {withTurnedAmps(line)}
                </span>
              ))}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
