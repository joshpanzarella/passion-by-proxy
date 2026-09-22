// Every name, date and link on the site lives here. Edit this file, not the
// components, when a title, price or URL changes. A section with nothing
// filled in shows a "coming soon" state rather than disappearing.

export const band = {
  name: "Passion by Proxy",
  // How people search for and write the name; used in metadata only.
  aliases: ["Passion-by-Proxy", "PbP"],
  short: "PbP",
  tagline: "placeholder tagline — one line about the band.",
  bio: [
    "Placeholder bio. Who is in the band, where you are from, what it sounds like.",
    "Second paragraph if you want one. Delete this line if not.",
  ],
  // Band photo for the about section, path under /public. Optional.
  photo: "",
  members: [
    // { name: "Name", role: "guitar, vocals" },
  ] as { name: string; role: string }[],
  email: "passionbyproxyband@gmail.com",
  bookingEmail: "", // falls back to `email` when empty
  pressEmail: "",
  // Sign-up page on your mailing list service (Mailchimp, Buttondown,
  // Bandcamp follow, Laylo...). The button hides until this is set.
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

export type Release = {
  kind: "single" | "album";
  title: string;
  // ISO date (YYYY-MM-DD). Leave `date` empty and fill `dateLabel` when the
  // day is not set yet.
  date: string;
  dateLabel?: string;
  cover?: string; // path under /public, e.g. "/media/single-cover.jpg"
  blurb: string;
  links: Link[]; // streaming / pre-save links; empty until they exist
  // Player embed URL (Spotify "Embed track" or Bandcamp "Embed this
  // album" src). Shows a player under the card once set.
  embed?: string;
};

export const single: Release = {
  kind: "single",
  title: "Single Title",
  date: "2026-09-25",
  blurb: "Placeholder: a sentence about the single.",
  // Swap Spotify for the track's own link once it is out; add the rest
  // as they go live. Placeholders ("#") are hidden.
  links: [
    { label: "Spotify", href: spotifyArtist },
    { label: "Apple Music", href: "#" },
    { label: "Bandcamp", href: "#" },
  ],
};

export const album: Release = {
  kind: "album",
  title: "Album Title",
  date: "",
  dateLabel: "November 2026",
  blurb: "Placeholder: a sentence about the album. Features “Zoe’s Zoetrope.”",
  links: [],
};

export type Video = {
  title: string;
  // The id from the YouTube URL: youtube.com/watch?v=THIS_PART
  youtubeId: string;
};

// Empty ids show as "coming soon" cards.
export const videos: Video[] = [
  { title: "Single Title (official video)", youtubeId: "" },
  { title: "Live session", youtubeId: "" },
];

export type Show = {
  date: string; // YYYY-MM-DD
  venue: string;
  city: string;
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
  { label: "Bandcamp", href: "https://passion-by-proxy.bandcamp.com/" },
  { label: "Spotify", href: spotifyArtist },
  { label: "YouTube", href: "#" },
  { label: "TikTok", href: "#" },
];
