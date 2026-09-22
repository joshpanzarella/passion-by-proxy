# Passion by Proxy

Band site for Passion by Proxy (also written Passion-by-Proxy, PbP).
Next.js App Router, TypeScript, Tailwind v4. Every page is static: the build
writes plain files to `out/`, which Cloudflare serves as they are.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

To look at the finished build, serve `out/` with any static server, for
example `npx serve out`.

## Where things live

It is one page. Sections, top to bottom: hero, ticker, music, videos, shows,
merch, about, message in a bottle (contact).

| What | File |
| --- | --- |
| **All content**: names, bio, releases, videos, shows, merch, socials, emails, mailing list link | `src/data/band.ts` |
| Page order and header nav | `src/app/page.tsx` |
| One file per section | `src/components/sections/` |
| Scroll effects (reveal, active nav, ticker, hero drift) | `src/components/ScrollEffects.tsx` |
| Hero logo that spins with the scroll | `src/components/HeroLogo.tsx` |
| Splash frames, speed, length | `src/data/zoetrope.ts` |
| Splash component | `src/components/ZoetropeSplash.tsx` |
| Colours (sampled from the logo), each section's colourway | `src/app/globals.css` |
| Cover art, shirt photos, band photo | `public/media/` |
| Splash frame images (built by `npm run zoetrope`) | `public/zoetrope/` |

Empty content shows a "coming soon" state: a video with no `youtubeId`, no
shows, no mailing list link. Past shows move to a "past shows" list on their
own, in the visitor's browser, so no rebuild is needed after a gig.

## Scroll effects

- The hero logo steps through the colourways as the page scrolls (one
  frame per 70 px), with the drum's slits showing while it moves.
- Section headings arrive with their two colours apart and snap together;
  cards slide in one after another.
- The header marks the section in view and takes on its colours.
- The ticker under the hero slides with the scroll.
- Videos load YouTube only when clicked.

Visitors with reduced motion turned on get none of the motion; everything
is simply shown. Without JavaScript everything is shown too.

## Splash screen

A zoetrope made from the six logo colourways. The drum spins up, runs at
full speed with its slits showing, slows, and stops on the teal logo; then
the site fades in. About 3.5 s. It waits for the frames to download first
(at most 2.5 s).

- Plays once per browser session. Click, Escape, Enter, Space or the skip
  button end it early. Visitors with reduced motion turned on never see it.
- Timings, frame order and the frame it stops on: `src/data/zoetrope.ts`.
- To rebuild the frames from new art (originals stay out of the repo):

  ```bash
  npm run zoetrope -- teal.png orange.png pink.png blue.png purple.png red.png
  ```

  Frames are flattened onto black, because the art's semi-transparent fill
  costs 5x the file size with transparency kept. The splash background
  (`--splash-bg` in `globals.css`) must stay the same black.
- To see it again locally, open a new private window.

## U&I video

The hero plays the U&I title video right after the splash, silent and
looping, and pauses it when it is off screen. Before release day the line
under it counts down; from release day it says "out now" with a big
**listen** button that goes to `single.listen` in `band.ts`.

The original (200 MB) is on the `media` release of the passion-by-proxy
GitHub repo. To rebuild the web copies (needs `brew install ffmpeg`):

```bash
sh scripts/build-video.sh U.I.moving_layered.mp4
```

It crops to the letters, makes the loop seamless, and writes 640 px (phones)
and 1200 px versions as MP4 and WebM, plus a still poster frame.

## Release dates

A release's badge reads "out September 25, 2026" until that day, then "out
now" in the visitor's own time zone. The album has no date yet, so it shows
`dateLabel` ("November 2026"); fill in `date` once it is set.

Past shows drop off at build time, so rebuild after a show date passes.

## Deploying on Cloudflare

One-time setup, in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**, and pick
   `joshpanzarella/passion-by-proxy`.
2. Production branch: `main`.
3. Framework preset: **Next.js (Static HTML Export)**. Or set it by hand:
   build command `npm run build`, build output directory `out`.
4. **Save and Deploy.** Every push to `main` then redeploys by itself, and
   every other branch gets its own preview link.
5. **Custom domains → Set up a domain** to point the band's domain at it.
   Then set `band.url` in `src/data/band.ts` to that address: the link
   preview image and the sitemap are built from it.

