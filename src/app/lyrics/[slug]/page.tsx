import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { band, isLive } from "@/data/band";
import { neighbours, openSongs, parseLyrics, releaseTone } from "@/data/lyrics";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LyricsReader } from "@/components/LyricsReader";

// One page per song, written out at build time; none for a sealed one.
export const dynamicParams = false;
export function generateStaticParams() {
  return openSongs.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const song = openSongs.find((s) => s.slug === slug);
  if (!song) return {};
  return {
    title: `${song.title} lyrics`,
    description: `Lyrics to “${song.title}” by ${band.name}, from ${song.release.title}.`,
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const song = openSongs.find((s) => s.slug === slug);
  if (!song) notFound();
  const { prev, next } = neighbours(song.slug);
  // the song's own release first, then any other it is on (U&I: the album
  // has no link yet, the single does)
  const listen = [song.release, ...(song.alsoOn ?? [])].map((r) => r.listen ?? r.links.find(isLive)?.href).find(Boolean);

  return (
    <>
      <SiteHeader current="lyrics" />
      <main className={`lyrics ${releaseTone(song.release)}`}>
        <nav className="lyrics__crumbs" aria-label="breadcrumb">
          <Link href="/lyrics">lyrics</Link> <span aria-hidden="true">/</span> {song.release.title}
        </nav>
        <header className="lyrics__head">
          <p className="release__kind">
            {song.release.kind === "album" ? `track ${song.track} · ${song.release.title}` : `${song.release.kind} · ${song.release.title}`}
            {song.alsoOn?.map((r) => ` · also the ${r.kind}`).join("")}
          </p>
          <h1 className="lyrics__title offset">{song.title}</h1>
          {song.credits && <p className="lyrics__credits">{song.credits}</p>}
        </header>

        <LyricsReader stanzas={parseLyrics(song.lyrics)} />

        <footer className="lyrics__foot">
          {listen && (
            <a className="button" href={listen} rel="noopener noreferrer" target="_blank">
              listen to {song.title}
            </a>
          )}
          <nav className="lyrics__pager" aria-label="more songs">
            {prev ? (
              <Link href={`/lyrics/${prev.slug}`} rel="prev">
                ←{"\u00a0"}{prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/lyrics/${next.slug}`} rel="next">
                {next.title}{"\u00a0"}→
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </footer>
      </main>
      <SiteFooter />
    </>
  );
}
