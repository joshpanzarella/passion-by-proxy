// A page section: anchor id, colourway (see .section--* in globals.css) and
// a heading that reveals with the logo's offset effect.
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`section section--${id}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section__label offset" data-reveal="">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Staggered reveal index for items in a grid or list.
export const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;
