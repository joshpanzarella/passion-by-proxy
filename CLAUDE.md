# Passion by Proxy site

One-page band site: Next.js App Router, TypeScript, Tailwind v4, built as a
static export (`out/`) and hosted on Cloudflare Pages from `main`.
`npm run lint` and `npm run build` must both pass before a push.

## Rules that bite

- **All content lives in `src/data/band.ts`.** Components read from it;
  never hard-code a title, date, price or link in a component.
- **A link whose href is `""` or `"#"` is a placeholder and is hidden**
  (`isLive`). Keep new link lists going through it so nothing dead ships.
- **Dates are `YYYY-MM-DD`, read in the visitor's own time zone, on the
  client** (`useNowMinute`). The build is static, so anything that depends
  on today (countdown, "out now", past shows) must not be decided at build
  time.
- **Artwork originals stay out of the repo.** `npm run media` and
  `scripts/build-video.sh` build the web copies in `public/media/`; the
  original U&I video is on this repo's `media` release.
- **Art on black is flattened onto `#000000`, the page's `--bg`.** The
  zoetrope frames, bottles and video depend on the two matching. The
  bottles are used at full colour (alpha dropped), as the band previews it.
- **Motion respects `prefers-reduced-motion`** everywhere: no splash, no
  scroll effects, video shows its poster. Without JS everything is visible
  (`html[data-js]` gates the hidden reveal state).
- **The splash plays once per session**; the inline script in `layout.tsx`
  marks `<html data-splash>` before first paint. The hero video waits for
  that attribute before playing.
- **Colours are sampled from the band's art** and live as tokens at the top
  of `globals.css`; each section picks a colourway through `--c`/`--c2`.
  New art: sample it, don't guess.
- **Two themes, dark first.** Every visitor starts dark (the band's call,
  not the device setting); light is the header switch
  (`<html data-theme="light">`, applied before paint from localStorage
  `pbp-theme`, key in `src/lib/theme.ts`). Light
  colours are darker cuts of the same hues, each 4.5:1 or better on the
  light background: add a light value for every new colour token. Art that
  sits on black lives inside `.stage-dark` (the hero, the album panel),
  which keeps the dark tokens in both themes. A constant a server file
  needs must not live in a `"use client"` file (it arrives as a stub).
- **Lyrics are data** (`src/data/lyrics.ts`, plain text with `[label]`
  lines); pages are generated per song. Reading comes first: the column
  stays ~40ch, nothing animates behind the words, and the reading light
  (dimming the other stanzas) must stay subtle and off for reduced motion.
- **The header and footer are shared** (`SiteHeader`, `SiteFooter`); the
  home page passes `home` so its section links stay plain anchors. The
  splash is mounted by the home page only.
- **The home page melts when left alone** (`Melt.tsx`): an SVG filter on
  `<main>` while it runs, over the static (`.static`, a fixed layer behind
  everything that shows only where a block has no background of its own).
  Nothing inside `<main>` may be `position: fixed` (the filter would pin it
  to `<main>`); overlays go outside it, as the splash, cues and captions do.
  The captions are the lyrics (`lyrics.ts`), passed in by `page.tsx`;
  songs marked `placeholder` (still lorem ipsum) are left out.
- **Every nav tab has its own colourway**, main and offset both unique and
  unlike the top of the page's teal/magenta (the header takes the colours
  of the section in view). A new section needs a new pair.
