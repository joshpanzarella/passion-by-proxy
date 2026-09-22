// Full-width artwork between sections, drifting with the scroll
// (data-parallax, see ScrollEffects).
//  - "banner": the whole picture at 2:1 (art with lettering in it)
//  - "strip": a short slice of a square texture; the image is three times
//    the strip's height so the drift has room to travel
export function Banner({ src, kind = "banner" }: { src: string; kind?: "banner" | "strip" }) {
  return (
    <div className={`banner banner--${kind}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, pre-sized webp */}
      <img src={src} alt="" loading="lazy" data-parallax={kind === "strip" ? "0.35" : "0.18"} />
    </div>
  );
}
