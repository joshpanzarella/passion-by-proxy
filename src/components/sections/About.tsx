import { band } from "@/data/band";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="about">
      <div className={band.photo ? "about about--photo" : "about"}>
        {band.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- pre-sized webp from npm run media
          <img className="about__photo" src={band.photo} alt={band.photoAlt || band.name} width={864} height={576} loading="lazy" data-reveal="" />
        )}
        <div className="prose" data-reveal="">
          {band.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {band.members.length > 0 && (
            <ul className="members">
              {band.members.map((m) => (
                <li key={m.name}>
                  <strong>{m.name}</strong> <span className="muted">{m.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
