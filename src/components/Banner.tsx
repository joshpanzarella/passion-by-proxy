// Full-width artwork strip between sections. The image is a little taller
// than its frame so ScrollEffects can drift it (data-parallax).
export function Banner({ src }: { src: string }) {
  return (
    <div className="banner" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, pre-sized webp */}
      <img src={src} alt="" width={2000} height={1000} loading="lazy" data-parallax="0.18" />
    </div>
  );
}
