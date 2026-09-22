"use client";

import type { Release } from "@/data/band";
import { formatDate, localMidnight } from "@/lib/dates";
import { useNowMinute } from "@/lib/useNow";

// Hero announcement: counts down to release day, then says "out now".
export function Countdown({ release }: { release: Release }) {
  const now = useNowMinute();
  const title = `“${release.title}”`;

  if (!release.date) {
    return (
      <p className="countdown">
        new {release.kind} {title} — {release.dateLabel ?? "coming soon"}
      </p>
    );
  }

  const at = localMidnight(release.date);
  if (now !== null && now >= at) {
    return (
      <a className="countdown countdown--out" href="#music">
        new {release.kind} {title} — out now. listen →
      </a>
    );
  }

  let left = "";
  if (now !== null) {
    const mins = Math.max(0, Math.round((at - now) / 60_000));
    const d = Math.floor(mins / 1440);
    const h = Math.floor((mins % 1440) / 60);
    const m = mins % 60;
    left = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <p className="countdown">
      new {release.kind} {title} — out {formatDate(release.date, { month: "long", day: "numeric" })}
      {left && <span className="countdown__left">{left}</span>}
    </p>
  );
}
