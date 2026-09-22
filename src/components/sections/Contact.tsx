import { band, socials } from "@/data/band";
import { Section, stagger } from "./Section";

export function Contact() {
  const emails = [
    { label: "general", address: band.email },
    { label: "booking", address: band.bookingEmail || band.email },
    { label: "press", address: band.pressEmail },
  ].filter((e) => e.address);

  return (
    <Section id="contact" title="stay in touch">
      <div className="contact">
        <div className="contact__list" data-reveal="">
          <p className="contact__lede">new music, shows and merch drops, first.</p>
          {band.newsletterHref ? (
            <a className="button button--big" href={band.newsletterHref} rel="noopener noreferrer" target="_blank">
              join the mailing list
            </a>
          ) : (
            <p className="muted">mailing list coming soon.</p>
          )}
        </div>
        <dl className="contact__emails" data-reveal="" style={stagger(1)}>
          {emails.map((e) => (
            <div key={e.label}>
              <dt>{e.label}</dt>
              <dd>
                <a href={`mailto:${e.address}`}>{e.address}</a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <ul className="socials">
        {socials.map((s, i) => (
          <li key={s.label} data-reveal="" style={stagger(i)}>
            <a href={s.href} rel="noopener noreferrer" target="_blank">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
