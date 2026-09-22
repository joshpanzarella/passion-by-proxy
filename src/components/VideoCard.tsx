"use client";

import { useState } from "react";
import type { Video } from "@/data/band";

// Shows YouTube's thumbnail until clicked, then swaps in the player. Loading
// a player up front costs every visitor about 1 MB of YouTube script.
export function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (!video.youtubeId) {
    return (
      <figure className="video">
        <div className="video__frame video__frame--empty">
          <span>video coming soon</span>
        </div>
        <figcaption>{video.title}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="video">
      <div className="video__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video__play" onClick={() => setPlaying(true)} aria-label={`play ${video.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail */}
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
            <svg viewBox="0 0 68 48" aria-hidden="true">
              <path d="M4 8 Q4 2 10 2 H58 Q64 2 64 8 V40 Q64 46 58 46 H10 Q4 46 4 40 Z" />
              <path d="M27 15 L45 24 L27 33 Z" className="video__triangle" />
            </svg>
          </button>
        )}
      </div>
      <figcaption>{video.title}</figcaption>
    </figure>
  );
}
