import { band } from "@/data/band";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="about">
      <div className={band.photo ? "about about--photo" : "about"}>
        {band.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- swap for next/image if the photo is large
          <img className="about__photo" src={band.photo} alt={band.name} data-reveal="" />
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
