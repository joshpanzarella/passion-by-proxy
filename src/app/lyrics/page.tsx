import type { Metadata } from "next";
import Link from "next/link";
import { band } from "@/data/band";
import { releaseTone, songsByRelease } from "@/data/lyrics";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Lyrics",
  description: `Lyrics to every ${band.name} song.`,
};

export default function LyricsIndex() {
  return (
    <>
      <SiteHeader current="lyrics" />
      <main className="lyrics-index">
        <h1 className="lyrics-index__title offset">lyrics</h1>
        {songsByRelease().map(({ release, songs }, n) => (
          <section key={release.title} className={`lyrics-index__release ${releaseTone(release)}`} aria-labelledby={`rel-${n}`}>
            <div className="lyrics-index__art">
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
              <img src={release.cover ?? release.art} alt="" loading="lazy" />
            </div>
            <div>
              <p className="release__kind">{release.kind}</p>
              <h2 id={`rel-${n}`} className="lyrics-index__release-title offset">
                {release.title}
              </h2>
              <ol className="lyrics-index__songs">
                {songs.map((s, i) => (
                  <li key={s.slug}>
                    {/* its place on this release: U&I is 02 on the album, 01 as the single */}
                    <span className="lyrics-index__track">{String(s.release === release ? s.track : i + 1).padStart(2, "0")}</span>
                    <Link href={`/lyrics/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
