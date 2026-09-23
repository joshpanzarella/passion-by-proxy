"use client";

import { useEffect } from "react";

// Page-wide scroll behaviour, in one place:
//  - [data-reveal] elements slide in the first time they reach the screen
//    (headings also close their offset colour, see .offset in globals.css);
//    section titles ripple like liquid as they come and settle crisp
//    (liquid, below)
//  - the header nav marks the section under the middle of the screen and
//    takes on that section's colours
// Renders nothing. Reduced motion: everything is shown at once.
//
// Motion tied to the scroll position itself (hero drift, ticker, the art
// drifting) is NOT here: it is CSS scroll-driven animation in globals.css.
// Moved by script it trailed the finger on iOS Safari, which scrolls apart
// from the page's code, and read as choppy however fast each frame was.
export function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    const ripple = reduce ? null : liquid();
    if (ripple) cleanups.push(ripple.stop);

    // ---- reveal
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            if (e.target.matches(".section__label")) ripple?.run(e.target as HTMLElement);
            reveal.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        if (reduce) el.classList.add("is-in");
        else reveal.observe(el);
      });
    watch(document);
    // client-only content (e.g. the show list once it knows today's date)
    const added = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && watch(n.parentNode ?? n));
    });
    added.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => {
      reveal.disconnect();
      added.disconnect();
    });

    // ---- active section
    const header = document.querySelector<HTMLElement>(".site-header");
    const nav = header?.querySelector<HTMLElement>("nav");
    const links = new Map<string, HTMLElement>();
    nav?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => links.set(a.hash.slice(1), a));

    const setActive = (section: HTMLElement) => {
      links.forEach((a, id) => a.toggleAttribute("data-active", id === section.id));
      if (header) {
        const cs = getComputedStyle(section);
        header.style.setProperty("--c", cs.getPropertyValue("--c"));
        header.style.setProperty("--c2", cs.getPropertyValue("--c2"));
      }
      const a = links.get(section.id);
      if (nav && a) {
        // keep the active link in view on a phone, where the nav scrolls sideways
        const left = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
        nav.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
      }
    };
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target as HTMLElement);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    document.querySelectorAll<HTMLElement>("main > section[id]").forEach((s) => spy.observe(s));
    cleanups.push(() => spy.disconnect());

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const LIQUID_MS = 1800; // the ripple dies away over this long
const LIQUID_PX = 60; // how far it pushes the element's pixels at the start

// A section title sliding in ripples like the undulating banners and
// settles as it lands: its own SVG displacement filter (slow noise, mostly sideways,
// so lines sway like liquid), pushed one way, then back, dying away to
// nothing, then taken off. It starts with the element's CSS slide (after its
// stagger delay). Not on embeds: filters and iframes do not mix.
function liquid() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  document.body.append(svg);
  let count = 0;
  const running = new Set<() => void>();

  const run = (el: HTMLElement) => {
    if (el.matches("iframe") || el.querySelector("iframe")) return;
    const id = `liquid-${count++}`;
    const m = LIQUID_PX; // room round the element for the pushed pixels
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.id = id;
    const region = { x: -m, y: -m, width: el.offsetWidth + 2 * m, height: el.offsetHeight + 2 * m };
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    for (const [k, v] of Object.entries(region)) filter.setAttribute(k, String(v));
    filter.innerHTML =
      `<feTurbulence type="fractalNoise" baseFrequency="0.008 0.05" numOctaves="2" seed="${count}" result="flow"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="flow" scale="${m}" xChannelSelector="R" yChannelSelector="G"/>`;
    svg.append(filter);
    const push = filter.lastElementChild as SVGFEDisplacementMapElement;
    const delay = (parseFloat(getComputedStyle(el).transitionDelay) || 0) * 1000;

    let raf = 0;
    let start = 0;
    const done = () => {
      window.cancelAnimationFrame(raf);
      el.style.filter = "";
      filter.remove();
      running.delete(done);
    };
    const frame = (now: number) => {
      start ||= now;
      const t = (now - start - delay) / LIQUID_MS;
      if (t >= 1) return done();
      // one way, back, and settle: a swing that dies away
      const k = t <= 0 ? 1 : (1 - t) ** 1.5 * Math.cos(t * Math.PI * 2.2);
      push.setAttribute("scale", String(m * k));
      raf = window.requestAnimationFrame(frame);
    };
    el.style.filter = `url(#${id})`;
    running.add(done);
    raf = window.requestAnimationFrame(frame);
  };

  return {
    run,
    stop: () => {
      running.forEach((done) => done());
      svg.remove();
    },
  };
}
