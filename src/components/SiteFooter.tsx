import Link from "next/link";
import { band } from "@/data/band";

const WORDMARK = "/media/wordmark-glitter.webp";

// Where the wordmark's star flares bloom (on solid parts of letters, % of the
// image), how big, and when in their turn. Neighbours never fire one after
// another, so the light never seems to travel along the word.
const STARS = [
  { x: 5.6, y: 32.4, s: 60, d: 0 },
  { x: 20.9, y: 59.2, s: 48, d: 2.4 },
  { x: 35.8, y: 34.5, s: 68, d: 1.2 },
  { x: 48.6, y: 59.9, s: 52, d: 3.6 },
  { x: 52.5, y: 26.8, s: 60, d: 0.6 },
  { x: 66.2, y: 54.9, s: 68, d: 3.0 },
  { x: 79.2, y: 32.4, s: 48, d: 1.8 },
  { x: 91.4, y: 64.1, s: 60, d: 4.2 },
];

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      {/* the wordmark as a diamond catching the light, cut to the letters by
          its own shape (see "footer glitter" in globals.css) */}
      <span className="site-footer__wordmark" style={{ "--glitter": `url(${WORDMARK})` } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element -- lettering art */}
        <img src={WORDMARK} alt={band.name} width={1100} height={142} loading="lazy" />
        <span className="glitter" aria-hidden="true">
          <span className="glitter__sparks" />
          <span className="glitter__sparks glitter__sparks--b" />
          <span className="glitter__facets" />
          <span className="glitter__facets glitter__facets--b" />
        </span>
        {STARS.map((s) => (
          <span
            key={`${s.x},${s.y}`}
            className="glitter-star"
            aria-hidden="true"
            style={{ "--x": `${s.x}%`, "--y": `${s.y}%`, "--s": `${s.s}px`, "--d": `-${s.d}s` } as React.CSSProperties}
          />
        ))}
      </span>
      <span>
        © {new Date().getFullYear()} {band.name} · <Link href="/lyrics">lyrics</Link>
      </span>
      <a href={home ? "#top" : "/"}>{home ? "back to top ↑" : "home ↑"}</a>
    </footer>
  );
}
