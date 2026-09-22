"use client";

import { useEffect, useState } from "react";
import { THEME_KEY } from "@/lib/theme";

// Header switch: system → light → dark → system. "system" follows the
// visitor's device setting. The choice is kept per browser, and the inline
// script in layout.tsx applies it before first paint (THEME_KEY).

type Mode = "system" | "light" | "dark";
const next: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  // read what the head script already applied
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    if (t === "light" || t === "dark") queueMicrotask(() => setMode(t));
  }, []);

  const choose = (m: Mode) => {
    setMode(m);
    const root = document.documentElement;
    if (m === "system") delete root.dataset.theme;
    else root.dataset.theme = m;
    try {
      if (m === "system") window.localStorage.removeItem(THEME_KEY);
      else window.localStorage.setItem(THEME_KEY, m);
    } catch {
      // storage blocked: the choice lasts for this page view
    }
  };

  const label = { system: "matches your device", light: "light", dark: "dark" }[mode];

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => choose(next[mode])}
      aria-label={`colour theme: ${label}. switch to ${next[mode] === "system" ? "your device's setting" : next[mode]}.`}
      title={`theme: ${label}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {mode === "light" ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
          </>
        ) : mode === "dark" ? (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" fill="currentColor" stroke="none" />
        ) : (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" />
          </>
        )}
      </svg>
    </button>
  );
}
