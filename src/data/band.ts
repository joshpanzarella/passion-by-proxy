// Every name, date and link on the site lives here. Edit this file, not the
// components, when a title, price or URL changes. A section with nothing
// filled in shows a "coming soon" state rather than disappearing.

export const band = {
  name: "Passion by Proxy",
  // How people search for and write the name; used in metadata only.
  aliases: ["Passion-by-Proxy", "PbP"],
  short: "PbP",
  // Under the hero logo, shown as written.
  tagline: "DEAD END CLOUT",
  // What search results and link previews say about the site: plain words
  // for someone who has never heard of the band.
  description:
    "Passion by Proxy is a band from Phoenixville, PA. New single U&I out September 25, 2026; album Alliterate out November 20, 2026. Shows, merch, lyrics.",
  bio: [
    "Placeholder bio. Who is in the band, where you are from, what it sounds like.",
    "Second paragraph if you want one. Delete this line if not.",
  ],
  // Where the band started (the band's word): given to search engines.
  foundedIn: { town: "Phoenixville", state: "PA" },
  // Band photo for the about section, built by `npm run media -- photo=…`.
  // Empty hides it. photoAlt describes it for screen readers.
  photo: "/media/band-photo.webp",
  photoAlt:
    "The band playing live: three members on guitar and bass, the drummer behind them, and a Philadelphia city flag hanging on the wall",
  members: [
    // { name: "Name", role: "guitar, vocals" },
  ] as { name: string; role: string }[],
  email: "passionbyproxyband@gmail.com",
  bookingEmail: "", // falls back to `email` when empty
  pressEmail: "",
  // Mailing list on Kit: the form's id, the number in its embed code
  // (app.kit.com/forms/THIS_NUMBER/subscriptions). Shows a sign-up box in
  // "message in a bottle" (the contact section). Empty hides it.
  kitFormId: "",
  // Or a sign-up page on another service: shows a button instead. Used only
  // when kitFormId is empty.
  newsletterHref: "",
  // Spotify artist id (open.spotify.com/artist/THIS_PART). Drives the
  // player in the music section.
  spotifyArtistId: "4g8s6vZBEsGST2PkMqaFoR",
  // Bandcamp player. On any Bandcamp track or album page: Share / Embed →
  // Embed this track → pick "Standard", small artwork → copy the code, and
  // paste the web address inside src="..." here (it starts with
  // https://bandcamp.com/EmbeddedPlayer/). Empty hides the player.
  bandcampPlayer: "",
  // Set once the domain is bought; used for social cards and the sitemap.
  url: "https://passionbyproxy.com",
};

// A link whose href is empty or "#" is a placeholder and is never shown.
export type Link = { label: string; href: string };

export const isLive = (l: Link) => l.href !== "" && l.href !== "#";

const spotifyArtist = "https://open.spotify.com/artist/4g8s6vZBEsGST2PkMqaFoR";
const bandcampPage = "https://passion-by-proxy.bandcamp.com/";

export type Release = {
  kind: "single" | "album";
  title: string;
  // ISO date (YYYY-MM-DD). Leave `date` empty and fill `dateLabel` when the
  // day is not set yet.
  date: string;
  dateLabel?: string;
  // Images under /public/media, built by `npm run media`.
  cover?: string; // square cover art
  wordmark?: string; // the title as lettering; shown in place of typed text
  art?: string; // feature image, any shape
  // Looping video of the title, built by scripts/build-video.sh. The hero
  // plays it right after the splash.
  // `small`/`large` are paths without extension: .mp4 and .webm both exist.
  video?: { small: string; large: string; poster: string; width: number; height: number };
  blurb: string;
  // Where the hero's big "listen" button goes once the release is out. A
  // link page that lists every service (DistroKid HyperFollow, Linkfire,
  // song.link) suits fans on different apps. Falls back to the first link.
  listen?: string;
  links: Link[]; // streaming / pre-save links; placeholders ("#") are hidden
  // Player embed URL (Spotify "Embed track" or Bandcamp "Embed this
  // album" src). Shows a player under the release once set.
  embed?: string;
  // Its colourway (.tone--* in globals.css), sampled from its art, when not
  // the one for its kind (tone--single, tone--album).
  tone?: string;
};

export const single: Release = {
  kind: "single",
  title: "U&I",
  date: "2026-09-25",
  cover: "/media/u-and-i-cover.webp",
  wordmark: "/media/u-and-i-wordmark.webp",
  video: {
    small: "/media/u-and-i-640",
    large: "/media/u-and-i-1200",
    poster: "/media/u-and-i-poster.webp",
    width: 1200,
    height: 520,
  },
  blurb: "Placeholder: a sentence about U&I.",
  // The track's own pages (the "listen" buttons take the first); Bandcamp
  // is the band's page until the track is up there.
  links: [
    { label: "Spotify", href: "https://open.spotify.com/album/78wvGs9FUo1ytUx5Wxrv6C" },
    { label: "Apple Music", href: "https://music.apple.com/us/album/u-i-single/6810252104" },
    { label: "Bandcamp", href: bandcampPage },
  ],
};

export const album: Release = {
  kind: "album",
  title: "Alliterate",
  date: "2026-11-20",
  cover: "/media/alliterate-cover.webp", // the official cover
  // the bottles on their own: shown by the album feature only if there is no
  // cover; kept for other uses
  art: "/media/alliterate-bottles.webp",
  blurb:
    "The truly, unbelievably, hotly anticipated freshman album from Phoenixville’s Passion by Proxy. “Alliterate” promises to show you that we’ve tried to put PbP in a box, but, like Pandora’s, they’ve escaped, and now only hope and this album remain.",
  links: [], // pre-save link goes here
};

// The first single, out before this site: in the music section after the
// album, and on the lyrics page. An empty blurb shows nothing.
export const firstSingle: Release = {
  kind: "single",
  title: "I Won’t Be(Long)",
  date: "2025-05-22",
  cover: "/media/i-wont-be-long-cover.webp",
  tone: "desert",
  blurb: "",
  links: [
    { label: "Spotify", href: "https://open.spotify.com/album/7GsBnC3nzQVTAKuzHhYO51" },
    { label: "Apple Music", href: "https://music.apple.com/us/album/i-wont-be-long-single/1816682845" },
    { label: "Bandcamp", href: "https://passion-by-proxy.bandcamp.com/track/i-wont-be-long" },
  ],
};

const tiktokProfile = "https://www.tiktok.com/@passionproxy";

// A TikTok at the top of the videos section: just the player, with a quiet
// credit line under it (the band wants it low-key: no heading, no big
// buttons). `id` is the long number in the video's link
// (tiktok.com/@passionproxy/video/THIS_NUMBER). Empty id hides it.
export const tiktok = {
  handle: "passionproxy",
  profile: tiktokProfile,
  featured: {
    id: "7684010395413105933",
    caption: "", // optional, shown quietly after the handle
  },
};

export type Video = {
  title: string;
  // The id from the YouTube URL: youtube.com/watch?v=THIS_PART
  youtubeId: string;
};

// Empty ids show as "coming soon" cards.
export const videos: Video[] = [
  { title: "U&I", youtubeId: "lB-dPUWDcrs" },
  { title: "Live session", youtubeId: "" },
];

export type Show = {
  date: string; // YYYY-MM-DD
  // Start time, 24-hour "HH:MM" in local time (e.g. "20:00"). Optional:
  // shown on the site and given to Google when set.
  time?: string;
  venue: string;
  city: string; // "Town, ST": Google reads the town and state from it
  note?: string; // "w/ Other Band", "all ages", "sold out"
  // Buttons on the row: tickets, the venue's page, "DM for address"...
  actions?: Link[];
};

// Instagram's direct-message link: opens a DM to the band in the app.
const instagramDm = "https://ig.me/m/passion_by_proxy";

// Any order. Past shows move to the "past shows" list by themselves.
export const shows: Show[] = [
  {
    date: "2026-09-25",
    venue: "House show",
    city: "West Philadelphia, PA",
    note: "message us for the address",
    actions: [
      { label: "DM for address", href: instagramDm },
      { label: "email", href: `mailto:${band.email}` },
    ],
  },
  {
    date: "2026-09-26",
    venue: "The Rat Shack",
    city: "Phoenixville, PA",
    actions: [{ label: "venue", href: "https://www.instagram.com/the_rat_shack_officially/" }],
  },
];

export type MerchItem = {
  name: string;
  price: string; // written as it should show, e.g. "$25"
  image?: string; // path under /public
  href: string; // where it is bought (Bandcamp merch, Big Cartel, Shopify...)
  note?: string; // "S–XXL", "limited run"
};

export const merch: MerchItem[] = [
  { name: "T-shirt one", price: "$25", href: "#", note: "S–XXL" },
  { name: "T-shirt two", price: "$25", href: "#", note: "S–XXL" },
];

export const socials: Link[] = [
  { label: "Instagram", href: "https://www.instagram.com/passion_by_proxy/" },
  { label: "Bandcamp", href: bandcampPage },
  { label: "Spotify", href: spotifyArtist },
  { label: "YouTube", href: "https://www.youtube.com/@PassionbyProxy" },
  { label: "TikTok", href: tiktokProfile },
];
