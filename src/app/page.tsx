import { band, single } from "@/data/band";
import { HeroSingle } from "@/components/HeroSingle";
import { HeroLogo } from "@/components/HeroLogo";
import { ScrollEffects } from "@/components/ScrollEffects";
import { Ticker } from "@/components/Ticker";
import { Banner } from "@/components/Banner";
import { Music } from "@/components/sections/Music";
import { Videos } from "@/components/sections/Videos";
import { Shows } from "@/components/sections/Shows";
import { Merch } from "@/components/sections/Merch";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

const nav = [
  { href: "#music", label: "music" },
  { href: "#videos", label: "videos" },
  { href: "#shows", label: "shows" },
  { href: "#merch", label: "merch" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <header className="site-header">
        <a className="site-header__mark" href="#top" aria-label={`${band.name}, back to top`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 8 KB logo */}
          <img src="/media/logo-pill.webp" alt="" width={174} height={96} />
        </a>
        <nav aria-label="sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="top" className="hero">
          <div className="hero__inner">
            <h1 className="hero__logo">
              <HeroLogo alt={band.name} />
            </h1>
            <HeroSingle release={single} />
            <p className="hero__tagline">{band.tagline}</p>
          </div>
          <a className="hero__scroll" href="#music" aria-label="scroll to music">
            ↓
          </a>
        </section>
        <Ticker />
        <Music />
        <Banner kind="strip" src="/media/texture-gold.webp" />
        <Videos />
        <Banner kind="strip" src="/media/texture-teal.webp" />
        <Shows />
        <Merch />
        <Banner src="/media/banner.webp" />
        <About />
        <Banner kind="strip" src="/media/texture-red.webp" />
        <Contact />
      </main>

      <footer className="site-footer">
        {/* eslint-disable-next-line @next/next/no-img-element -- lettering art */}
        <img className="site-footer__wordmark" src="/media/wordmark-glitter.webp" alt={band.name} width={1100} height={142} loading="lazy" />
        <span>
          © {new Date().getFullYear()} {band.name}
        </span>
        <a href="#top">back to top ↑</a>
      </footer>
    </>
  );
}
