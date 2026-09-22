# Passion by Proxy

Band site. Same stack as shapetaker-site: Next.js App Router, TypeScript,
Tailwind v4, built for Cloudflare.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm run preview  # serve the production build
```

## Where things live

| What | File |
| --- | --- |
| Band name, bio, email, single, album, socials, shows | `src/data/band.ts` |
| Splash frames, speed, length | `src/data/zoetrope.ts` |
| Splash component | `src/components/ZoetropeSplash.tsx` |
| Page sections | `src/app/page.tsx` |
| Colours and fonts (tokens at the top) | `src/app/globals.css` |
| Cover art, audio | `public/media/` |
| Splash frame images | `public/zoetrope/` |

## Splash screen

Plays once per browser session, then fades. Click, Escape, Enter, Space or
the skip button end it early. Visitors with reduced motion turned on never
see it. While `zoetrope.frames` is empty it plays a drawn placeholder.

To test it again locally, clear session storage or open a new tab in a
private window.

## Release dates

A release's badge reads "out September 25, 2026" until that day, then "out
now" in the visitor's own time zone. The album has no date yet, so it shows
`dateLabel` ("November 2026"); fill in `date` once it is set.

Past shows drop off at build time, so rebuild after a show date passes.
