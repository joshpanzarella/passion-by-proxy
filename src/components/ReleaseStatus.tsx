"use client";

import type { Release } from "@/data/band";
import { formatDate, localMidnight } from "@/lib/dates";
import { useNowMinute } from "@/lib/useNow";

// "out now" flips on by itself on release day, in the visitor's time zone.
export function ReleaseStatus({ release }: { release: Release }) {
  const now = useNowMinute();
  const released = release.date && now !== null && now >= localMidnight(release.date);
  const label = release.date ? formatDate(release.date) : release.dateLabel ?? "coming soon";

  if (released) return <span className="status status--out">out now</span>;
  return <span className="status">out {label}</span>;
}

// "new album coming soon" until its day, then "new album", flipping the
// same way
export function ReleaseKind({ release }: { release: Release }) {
  const now = useNowMinute();
  const released = release.date && now !== null && now >= localMidnight(release.date);
  return (
    <p className="release__kind">
      new {release.kind}
      {released ? "" : " coming soon"}
    </p>
  );
}
