import { album, band, isLive, single, type Link, type Release } from "@/data/band";
import { ReleaseStatus } from "@/components/ReleaseStatus";
import { Section } from "./Section";

// The new single leads with its cover and lettering; the album follows as
// its own feature with the bottles. Each takes its colours from its artwork.
export function Music() {
  return (
    <Section id="music" title="music">
      <Spotlight release={single} />
      <AlbumFeature release={album} />
      <Players />
    </Section>
  );
}

function Spotlight({ release }: { release: Release }) {
  return (
    <article className="spotlight">
      <div className="spotlight__cover" data-reveal="">
        {release.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp from npm run media
          <img src={release.cover} alt={`${release.title} cover art`} width={1000} height={1000} />
        ) : (
          <span aria-hidden="true">{release.kind}</span>
        )}
      </div>
      <div className="spotlight__body" data-reveal="" style={{ "--i": 1 } as React.CSSProperties}>
        <p className="release__kind">new {release.kind}</p>
        <h3 className="spotlight__title">
          {release.wordmark ? (
            // eslint-disable-next-line @next/next/no-img-element -- lettering art; alt carries the title
            <img src={release.wordmark} alt={release.title} width={900} height={358} />
          ) : (
            release.title
          )}
        </h3>
        <ReleaseStatus release={release} />
        <p>{release.blurb}</p>
        <Links links={release.links} />
      </div>
    </article>
  );
}

function AlbumFeature({ release }: { release: Release }) {
  return (
    <article className="album stage-dark">
      {release.art && (
        <div className="album__art" data-reveal="">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized webp from npm run media */}
          <img src={release.art} alt="Two glass bottles, one red and one blue, lit gold from behind" width={975} height={1220} />
        </div>
      )}
      <div className="album__body" data-reveal="" style={{ "--i": 1 } as React.CSSProperties}>
        <p className="release__kind">the {release.kind}</p>
        <h3 className="album__title offset">{release.title}</h3>
        <ReleaseStatus release={release} />
        <p>{release.blurb}</p>
        <Links links={release.links} />
      </div>
    </article>
  );
}

function Players() {
  const bandcamp = band.bandcampPlayer.startsWith("https://bandcamp.com/EmbeddedPlayer/");
  if (!bandcamp && !band.spotifyArtistId) return null;
  return (
    <div className="players">
      <p className="release__kind">listen</p>
      {bandcamp && (
        <iframe className="bandcamp" data-reveal="" src={band.bandcampPlayer} title={`${band.name} on Bandcamp`} loading="lazy" seamless />
      )}
      {band.spotifyArtistId && (
        <iframe
          className="spotify"
          data-reveal=""
          src={`https://open.spotify.com/embed/artist/${band.spotifyArtistId}?theme=0`}
          title={`${band.name} on Spotify`}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      )}
    </div>
  );
}

function Links({ links }: { links: Link[] }) {
  if (!links.some(isLive)) return null;
  return (
    <ul className="links">
      {links.filter(isLive).map((l) => (
        <li key={l.label}>
          <a className="button" href={l.href} rel="noopener noreferrer" target="_blank">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
