import { band, isLive, socials } from "@/data/band";
import { EmailSignup } from "@/components/EmailSignup";
import { Section, stagger } from "./Section";

export function Contact() {
  // One row per address: jobs that share an address share a row
  // ("general / booking"), so the same email never shows twice.
  const emails: { label: string; address: string }[] = [];
  for (const [label, address] of [
    ["general", band.email],
    ["booking", band.bookingEmail || band.email],
    ["press", band.pressEmail],
  ]) {
    if (!address) continue;
    const row = emails.find((e) => e.address === address);
    if (row) row.label += ` / ${label}`;
    else emails.push({ label, address });
  }

  return (
    <Section id="contact" title="message in a bottle">
      <div className="contact">
        <div className="contact__list" data-reveal="">
          <p className="contact__lede">throw yours in. we&apos;ll write soon.</p>
          {band.kitFormId ? (
            <EmailSignup formId={band.kitFormId} />
          ) : band.newsletterHref ? (
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
        {socials.filter(isLive).map((s, i) => (
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
