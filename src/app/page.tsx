import { band, single } from "@/data/band";
import { openSongs, parseLyrics } from "@/data/lyrics";
import { HeroSingle } from "@/components/HeroSingle";
import { HeroLogo } from "@/components/HeroLogo";
import { ScrollEffects } from "@/components/ScrollEffects";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ZoetropeSplash } from "@/components/ZoetropeSplash";
import { Melt } from "@/components/Melt";
import { structuredDataJson } from "@/lib/structuredData";
import { Ticker } from "@/components/Ticker";
import { Banner } from "@/components/Banner";
import { SocialStrip } from "@/components/SocialStrip";
import { Music } from "@/components/sections/Music";
import { Videos } from "@/components/sections/Videos";
import { Shows } from "@/components/sections/Shows";
import { Merch } from "@/components/sections/Merch";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

// every open song's stanzas (real words only: no placeholders, nothing
// sealed), captioned over the static as the page melts
const captions = openSongs
  .filter((s) => !s.placeholder)
  .map((s) => ({ title: s.title, stanzas: parseLyrics(s.lyrics).map((stanza) => stanza.lines) }));

export default function Home() {
  return (
    <>
      {/* the splash plays on the home page only: a link straight to a lyrics
          page opens straight onto the lyrics */}
      <ZoetropeSplash />
      <ScrollEffects />
      <Melt captions={captions} />
      <div className="static" aria-hidden="true">
        <div className="static__wave" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson() }} />
      <SiteHeader home />

      {/* what melts (Melt.tsx): the page and its footer, not the header */}
      <div className="melts">
      <main>
        <section id="top" className="hero stage-dark">
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
        <SocialStrip />
        <Music />
        <Banner kind="strip" src="/media/texture-gold.webp" />
        <Videos />
        <Banner kind="strip" src="/media/texture-teal.webp" />
        <Shows />
        <Merch />
        <Banner kind="strip" src="/media/banner.webp" />
        <About />
        <Banner kind="strip" src="/media/texture-red.webp" />
        <Contact />
      </main>

      <SiteFooter home />
      </div>
    </>
  );
}
