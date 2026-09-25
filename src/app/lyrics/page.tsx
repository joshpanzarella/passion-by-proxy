import type { Metadata } from "next";
import Link from "next/link";
import { band } from "@/data/band";
import { isSealed, releaseTone, sealed, songsByRelease } from "@/data/lyrics";
import { formatDate } from "@/lib/dates";
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
          <section
            key={release.title}
            className={`lyrics-index__release ${releaseTone(release)}${sealed.includes(release) ? " lyrics-index__release--sealed" : ""}`}
            aria-labelledby={`rel-${n}`}
          >
            <div className="lyrics-index__art">
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp */}
              <img src={release.cover ?? release.art} alt="" loading="lazy" />
            </div>
            <div>
              <p className="release__kind">{release.kind}</p>
              <h2 id={`rel-${n}`} className="lyrics-index__release-title offset">
                {release.title}
              </h2>
              {sealed.includes(release) && (
                <p className="lyrics-index__sealed-note">
                  words out with the {release.kind}
                  {release.date ? `, ${formatDate(release.date, { month: "long", day: "numeric" })}` : ""}
                </p>
              )}
              <ol className="lyrics-index__songs">
                {songs.map((s, i) => (
                  <li key={s.slug}>
                    {/* its place on this release: U&I is 02 on the album, 01 as the single */}
                    <span className="lyrics-index__track">{String(s.release === release ? s.track : i + 1).padStart(2, "0")}</span>
                    {isSealed(s) ? (
                      <span className="lyrics-index__sealed-song">{s.title}</span>
                    ) : (
                      <Link href={`/lyrics/${s.slug}`}>{s.title}</Link>
                    )}
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
