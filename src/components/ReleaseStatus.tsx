"use client";

import { useSyncExternalStore } from "react";
import type { Release } from "@/data/band";

const noop = () => () => {};

// "out now" flips on by itself on release day, in the visitor's own time zone.
// The server renders the plain date, so the static build never goes stale.
export function ReleaseStatus({ release }: { release: Release }) {
  const released = useSyncExternalStore(
    noop,
    () => (release.date ? Date.now() >= localMidnight(release.date) : false),
    () => null,
  );

  const label = release.date ? formatDate(release.date) : release.dateLabel ?? "coming soon";

  if (released) return <span className="status status--out">out now</span>;
  return <span className="status">out {label}</span>;
}

function localMidnight(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
