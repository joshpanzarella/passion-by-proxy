import { isLive, merch } from "@/data/band";
import { Section, stagger } from "./Section";

export function Merch() {
  return (
    <Section id="merch" title="merch">
      <div className="merch">
        {merch.map((item, i) => (
          <article key={item.name} className="merch__item" data-reveal="" style={stagger(i)}>
            <div className="merch__image">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- swap for next/image if photos get large
                <img src={item.image} alt={item.name} />
              ) : (
                <ShirtOutline />
              )}
            </div>
            <div className="merch__body">
              <h3>{item.name}</h3>
              <p className="muted">
                {item.price}
                {item.note ? ` · ${item.note}` : ""}
              </p>
            </div>
            {isLive({ label: item.name, href: item.href }) ? (
              <a className="button" href={item.href} rel="noopener noreferrer" target="_blank">
                buy
              </a>
            ) : (
              <span className="muted">coming soon</span>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

// Stand-in until there are shirt photos.
function ShirtOutline() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="merch__shirt">
      <path d="M36 14 L20 20 L8 38 L22 46 L28 38 L28 88 L72 88 L72 38 L78 46 L92 38 L80 20 L64 14 Q50 26 36 14 Z" />
    </svg>
  );
}
