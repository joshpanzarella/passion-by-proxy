"use client";

import { useEffect, useRef, useState } from "react";

// TikTok's player, mounted only once the visitor scrolls within about a
// screen of it. (loading="lazy" alone let Chrome fetch it from the top of
// the page.) Until then the frame shows the section's empty card.
export function TikTokPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="tiktok__player">
      {near && <iframe src={src} title={title} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen />}
    </div>
  );
}
