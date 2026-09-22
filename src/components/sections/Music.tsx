import { album, single, type Release } from "@/data/band";
import { ReleaseStatus } from "@/components/ReleaseStatus";
import { Section, stagger } from "./Section";

export function Music() {
  return (
    <Section id="music" title="music">
      <div className="releases">
        <ReleaseCard release={single} index={0} />
        <ReleaseCard release={album} index={1} />
      </div>
    </Section>
  );
}

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  return (
    <article className="release" data-reveal="" style={stagger(index)}>
      <div className="release__cover">
        {release.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- swap for next/image if covers get large
          <img src={release.cover} alt={`${release.title} cover`} />
        ) : (
          <span aria-hidden="true">{release.kind}</span>
        )}
      </div>
      <div className="release__body">
        <p className="release__kind">{release.kind}</p>
        <h3 className="release__title">{release.title}</h3>
        <ReleaseStatus release={release} />
        <p>{release.blurb}</p>
        {release.links.length > 0 && (
          <ul className="links">
            {release.links.map((l) => (
              <li key={l.label}>
                <a className="button" href={l.href} rel="noopener noreferrer" target="_blank">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {release.embed && (
        <iframe className="release__embed" src={release.embed} title={`${release.title} player`} loading="lazy" allow="encrypted-media" />
      )}
    </article>
  );
}
