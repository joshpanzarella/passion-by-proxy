"use client";

import { useEffect, useState } from "react";
import { THEME_KEY } from "@/lib/theme";

// Header switch between dark (where every visitor starts) and light. The
// choice is kept per browser, and the inline script in layout.tsx applies
// it before first paint.
type Mode = "dark" | "light";

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  // read what the head script already applied
  useEffect(() => {
    if (document.documentElement.dataset.theme === "light") queueMicrotask(() => setMode("light"));
  }, []);

  const choose = (m: Mode) => {
    setMode(m);
    const root = document.documentElement;
    if (m === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    try {
      if (m === "light") window.localStorage.setItem(THEME_KEY, "light");
      else window.localStorage.removeItem(THEME_KEY);
    } catch {
      // storage blocked: the choice lasts for this page view
    }
  };

  const other: Mode = mode === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => choose(other)}
      aria-label={`switch to ${other} mode`}
      title={`switch to ${other} mode`}
    >
      {/* shows the mode a tap switches to */}
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {other === "light" ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
          </>
        ) : (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" fill="currentColor" stroke="none" />
        )}
      </svg>
    </button>
  );
}
