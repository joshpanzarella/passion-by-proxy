import { album, band, shows, single, socials, type Release } from "@/data/band";
import { ReleaseStatus, formatDate } from "@/components/ReleaseStatus";
import { zoetrope } from "@/data/zoetrope";

const nav = [
  { href: "#music", label: "music" },
  { href: "#about", label: "about" },
  { href: "#shows", label: "shows" },
  { href: "#contact", label: "contact" },
];

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = shows.filter((s) => s.date >= today);

  return (
    <>
      <header className="site-header">
        <a className="site-header__mark offset" href="#top" aria-label={`${band.name} home`}>
          {band.short}
        </a>
        <nav aria-label="sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          {/* the same art the splash stops on, so the splash hands over to it */}
          <h1 className="hero__logo">
            {/* eslint-disable-next-line @next/next/no-img-element -- already cached by the splash; next/image would fetch a second copy */}
            <img src={zoetrope.frames[zoetrope.landOn]} alt={band.name} width={900} height={621} />
          </h1>
          <p className="hero__tagline">{band.tagline}</p>
        </section>

        <section id="music" className="section section--music">
          <h2 className="section__label offset">music</h2>
          <div className="releases">
            <ReleaseCard release={single} />
            <ReleaseCard release={album} />
          </div>
        </section>

        <section id="about" className="section section--about">
          <h2 className="section__label offset">about</h2>
          <div className="prose">
            {band.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section id="shows" className="section section--shows">
          <h2 className="section__label offset">shows</h2>
          {upcoming.length === 0 ? (
            <p className="muted">no dates yet.</p>
          ) : (
            <ul className="shows">
              {upcoming.map((s) => (
                <li key={s.date + s.venue}>
                  <span>{formatDate(s.date)}</span>
                  <span>{s.venue}</span>
                  <span className="muted">{s.city}</span>
                  {s.ticketHref ? <a href={s.ticketHref}>tickets</a> : <span />}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="contact" className="section section--contact">
          <h2 className="section__label offset">contact</h2>
          <p>
            <a href={`mailto:${band.email}`}>{band.email}</a>
          </p>
          <ul className="links">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} rel="noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <span>
          © {new Date().getFullYear()} {band.name}
        </span>
      </footer>
    </>
  );
}

function ReleaseCard({ release }: { release: Release }) {
  return (
    <article className="release">
      <div className="release__cover">
        {release.cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export friendly; swap for next/image if covers get large
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
                <a href={l.href} rel="noopener noreferrer" target="_blank">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
