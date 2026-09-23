"use client";

import { useEffect, useRef } from "react";
import { isLive, type Release } from "@/data/band";
import { formatDate, localMidnight } from "@/lib/dates";
import { useNowMinute } from "@/lib/useNow";

// The new release under the hero logo: its title video, then either a
// countdown or, from release day, "out now" and a big listen button.
//
// The video waits for the splash to finish (<html data-splash> is set when
// it has played or was skipped), pauses while off screen or while the page
// melts, and never plays for reduced motion; the poster stands in. It does
// not even download until then (preload="none"), so it never competes with
// the splash.
export function HeroSingle({ release }: { release: Release }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const now = useNowMinute();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true; // React does not always render the attribute; autoplay needs it
    const root = document.documentElement;
    let onScreen = true;
    // not while the page melts (Melt.tsx): each new frame would have the
    // whole melt redone
    const sync = () => {
      if (!root.dataset.splash) return;
      if (onScreen && root.dataset.melting === undefined) video.play().catch(() => {});
      else video.pause();
    };
    const changed = new MutationObserver(sync);
    changed.observe(root, { attributes: true, attributeFilter: ["data-splash", "data-melting"] });
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    seen.observe(video);
    sync();
    return () => {
      changed.disconnect();
      seen.disconnect();
    };
  }, []);

  const out = release.date !== "" && now !== null && now >= localMidnight(release.date);
  const listen = release.listen ?? release.links.find(isLive)?.href;

  return (
    <div className="hero-single">
      {release.video && (
        <div className="hero-single__frame">
          <video
            ref={videoRef}
            className="hero-single__video"
            poster={release.video.poster}
            width={release.video.width}
            height={release.video.height}
            muted
            loop
            playsInline
            preload="none"
            aria-label={release.title}
          >
            <source src={`${release.video.small}.mp4`} media="(max-width: 700px)" type="video/mp4" />
            <source src={`${release.video.small}.webm`} media="(max-width: 700px)" type="video/webm" />
            <source src={`${release.video.large}.mp4`} type="video/mp4" />
            <source src={`${release.video.large}.webm`} type="video/webm" />
          </video>
        </div>
      )}
      {out ? (
        <div className="hero-single__out">
          <p className="hero-single__line">
            new {release.kind} <strong>{release.title}</strong> out now
          </p>
          {listen && (
            <a className="button button--big" href={listen} rel="noopener noreferrer" target="_blank">
              listen →
            </a>
          )}
        </div>
      ) : (
        <p className="hero-single__line">
          new {release.kind} <strong>{release.title}</strong> out{" "}
          {release.date ? formatDate(release.date, { weekday: "long", month: "long", day: "numeric" }).toLowerCase() : release.dateLabel}
          {now !== null && release.date && <Left ms={localMidnight(release.date) - now} />}
        </p>
      )}
    </div>
  );
}

function Left({ ms }: { ms: number }) {
  const mins = Math.max(0, Math.round(ms / 60_000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return <span className="countdown__left">{d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`}</span>;
}
