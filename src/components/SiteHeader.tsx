import Link from "next/link";
import { band } from "@/data/band";
import { ThemeToggle } from "@/components/ThemeToggle";

// The header on every page. On the home page the section links are plain
// anchors (#music); elsewhere they lead back to the home page (/#music).
// `current` marks a page link (e.g. "lyrics") as the page being viewed.
// On the home page a slot by the logo names the song the melt's captions
// are from, while they run (Melt.tsx fills it).
const sections = ["music", "videos", "shows", "merch", "about", "contact"];

export function SiteHeader({ home = false, current }: { home?: boolean; current?: "lyrics" }) {
  const base = home ? "" : "/";
  return (
    <header className="site-header">
      <a className="site-header__mark" href={home ? "#top" : "/"} aria-label={home ? `${band.name}, back to top` : `${band.name} home`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 8 KB logo */}
        <img src="/media/logo-pill.webp" alt="" width={174} height={96} />
      </a>
      {home && <span className="site-header__playing" aria-hidden="true" />}
      <nav aria-label="sections">
        {sections.map((id) => (
          <a key={id} href={`${base}#${id}`}>
            {id}
          </a>
        ))}
        <Link href="/lyrics" data-active={current === "lyrics" ? "" : undefined} aria-current={current === "lyrics" ? "page" : undefined}>
          lyrics
        </Link>
      </nav>
      <ThemeToggle />
    </header>
  );
}
