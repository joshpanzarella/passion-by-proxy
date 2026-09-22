import { album, band, isLive, shows, single, socials, type Release, type Show } from "@/data/band";

// Structured data (schema.org JSON-LD): labels in the page that tell search
// engines what it is about. Google uses them for the site's name in results,
// to tie the band's profiles together (sameAs), and to list upcoming shows
// with their dates and venues. Built with the site, so a show that has
// passed drops out at the next deploy; Google ignores past events meanwhile.

const TIME_ZONE = "America/New_York"; // where the shows are

// "2026-09-25" + "20:00" -> "2026-09-25T20:00:00-04:00", with the offset
// right for that date (EDT or EST); a date alone stays a date.
function startDate(show: Show) {
  if (!show.time) return show.date;
  const [y, mo, d] = show.date.split("-").map(Number);
  const [h, mi] = show.time.split(":").map(Number);
  const probe = new Date(Date.UTC(y, mo - 1, d, h + 5, mi)); // near local time
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName")?.value; // "GMT-04:00"
  const offset = name?.replace("GMT", "") || "-05:00";
  return `${show.date}T${show.time}:00${offset}`;
}

function place(show: Show) {
  const [locality, region] = show.city.split(",").map((s) => s.trim());
  return {
    "@type": "Place",
    name: show.venue,
    address: { "@type": "PostalAddress", addressLocality: locality, addressRegion: region, addressCountry: "US" },
  };
}

function release(r: Release) {
  return {
    "@type": "MusicAlbum",
    name: r.title,
    albumReleaseType: r.kind === "single" ? "https://schema.org/SingleRelease" : "https://schema.org/AlbumRelease",
    ...(r.date ? { datePublished: r.date } : {}),
    ...(r.cover ? { image: new URL(r.cover, band.url).href } : {}),
    byArtist: { "@id": `${band.url}/#band` },
  };
}

export function structuredData(today = new Date().toISOString().slice(0, 10)) {
  const group = {
    "@type": "MusicGroup",
    "@id": `${band.url}/#band`,
    name: band.name,
    alternateName: band.aliases,
    url: band.url,
    email: band.email,
    image: `${band.url}/opengraph-image.jpg`,
    sameAs: socials.filter(isLive).map((s) => s.href),
    album: [single, album].map(release),
  };

  const events = shows
    .filter((s) => s.date >= today)
    .map((s) => {
      const ticket = s.actions?.find((a) => isLive(a) && /ticket/i.test(a.label));
      return {
        "@type": "MusicEvent",
        name: `${band.name} at ${s.venue}`,
        startDate: startDate(s),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: place(s),
        performer: { "@id": `${band.url}/#band` },
        organizer: { "@id": `${band.url}/#band` },
        ...(s.note ? { description: s.note } : {}),
        ...(ticket ? { offers: { "@type": "Offer", url: ticket.href } } : {}),
      };
    });

  const site = {
    "@type": "WebSite",
    "@id": `${band.url}/#site`,
    name: band.name,
    alternateName: band.aliases,
    url: band.url,
    publisher: { "@id": `${band.url}/#band` },
  };

  return { "@context": "https://schema.org", "@graph": [site, group, ...events] };
}

// As a <script> body: "<" escaped so nothing in the data can close the tag.
export function structuredDataJson() {
  return JSON.stringify(structuredData()).replace(/</g, "\\u003c");
}
