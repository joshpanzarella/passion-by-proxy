// Every name, date and link on the site lives here. Edit this file, not the
// components, when a title or URL changes.

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
  email: "hello@example.com",
  // Set once the domain is bought; used for social cards and the sitemap.
  url: "https://passionbyproxy.com",
};

export type Link = { label: string; href: string };

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
};

export const single: Release = {
  kind: "single",
  title: "Single Title",
  date: "2026-09-25",
  blurb: "Placeholder: a sentence about the single.",
  links: [
    { label: "Spotify", href: "#" },
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

export const socials: Link[] = [
  { label: "Instagram", href: "#" },
  { label: "Bandcamp", href: "#" },
  { label: "YouTube", href: "#" },
];

export type Show = { date: string; venue: string; city: string; ticketHref?: string };

// Newest last. Past shows drop off the page automatically.
export const shows: Show[] = [];
