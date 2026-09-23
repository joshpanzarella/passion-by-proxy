import { BannerWarp } from "./BannerWarp";

// Full-width artwork between sections, drifting with the scroll (a CSS
// scroll-driven animation, see "scroll-linked motion" in globals.css) and
// slowly undulating (BannerWarp, drawn over the image).
//  - "banner": the whole picture at 2:1 (its lettering painted out by
//    npm run media, like the strips it is only pattern); it undulates at
//    half strength
//  - "strip": a short slice of a square texture; the image is three times
//    the strip's height so the drift has room to travel
export function Banner({ src, kind = "banner" }: { src: string; kind?: "banner" | "strip" }) {
  return (
    <div className={`banner banner--${kind}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, pre-sized webp */}
      <img src={src} alt="" loading="lazy" data-melt-flat="" />
      <BannerWarp src={src} amount={kind === "banner" ? 0.5 : 1} />
    </div>
  );
}
