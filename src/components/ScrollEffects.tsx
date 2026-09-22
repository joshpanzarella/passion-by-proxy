"use client";

import { useEffect } from "react";

// Page-wide scroll behaviour, in one place:
//  - [data-reveal] elements slide in the first time they reach the screen
//    (headings also close their offset colour, see .offset in globals.css)
//  - the header nav marks the section under the middle of the screen and
//    takes on that section's colours
//  - the ticker strip slides with the scroll
//  - the hero's contents drift up slower than the page and fade out
// Renders nothing. Reduced motion: everything is shown at once, nothing moves.
export function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // ---- reveal
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
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

    // ---- ticker and hero drift
    const track = document.querySelector<HTMLElement>(".ticker__track");
    const heroInner = document.querySelector<HTMLElement>(".hero__inner");
    const arrow = document.querySelector<HTMLElement>(".hero__scroll");
    if (track && heroInner && !reduce) {
      let raf = 0;
      const move = () => {
        raf = 0;
        const y = window.scrollY;
        const half = track.scrollWidth / 2;
        track.style.transform = `translateX(${-((y * 0.5) % half)}px)`;
        if (y < window.innerHeight * 1.2) {
          heroInner.style.transform = `translateY(${y * 0.35}px)`;
          heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
          if (arrow) arrow.style.opacity = String(Math.max(0, 1 - y / 120));
        }
      };
      const onScroll = () => {
        if (!raf) raf = window.requestAnimationFrame(move);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      move();
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.cancelAnimationFrame(raf);
      });
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
