"use client";

import { useEffect, useRef, useState } from "react";
import { whenSettled } from "@/lib/settled";

// TikTok's player, mounted once the page has settled (whenSettled: after
// the page's own loading and the splash, so it is ready before anyone
// scrolls to it), or sooner if the visitor scrolls within about a screen
// of it. (loading="lazy" alone let Chrome fetch it from the top of the
// page, competing with the first screen.) Until then the frame shows the
// section's empty card.
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
    const cancel = whenSettled(() => setNear(true));
    return () => {
      io.disconnect();
      cancel();
    };
  }, []);

  return (
    <div ref={ref} className="tiktok__player">
      {near && <iframe src={src} title={title} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen />}
    </div>
  );
}
