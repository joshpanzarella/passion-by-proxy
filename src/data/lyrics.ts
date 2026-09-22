import { album, single, type Release } from "@/data/band";

// Song lyrics. Each song is plain text:
//  - a blank line between verses
//  - a label in square brackets on its own line starts a part and names it:
//    [verse], [chorus], [bridge], [pre-chorus], [outro]... Chorus and bridge
//    get their own look; any label is shown as written.
//  - a verse with no label is just a verse
// Songs appear on /lyrics under their release, in `track` order.

export type Song = {
  slug: string; // the page address: /lyrics/<slug>
  title: string;
  release: Release;
  track: number;
  credits?: string; // "words and music by …"
  lyrics: string;
};

export const songs: Song[] = [
  {
    slug: "u-and-i",
    title: "U&I",
    release: single,
    track: 1,
    credits: "words and music by Passion by Proxy",
    lyrics: `
[verse]
Lorem ipsum dolor sit amet, consectetur
adipiscing elit, sed do eiusmod
tempor incididunt ut labore
et dolore magna aliqua

Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris
nisi ut aliquip ex ea commodo
consequat, duis aute irure dolor

[chorus]
In reprehenderit in voluptate
velit esse cillum dolore
eu fugiat nulla pariatur
you and I, you and I

[verse]
Excepteur sint occaecat cupidatat
non proident, sunt in culpa
qui officia deserunt mollit
anim id est laborum

[chorus]
In reprehenderit in voluptate
velit esse cillum dolore
eu fugiat nulla pariatur
you and I, you and I

[bridge]
Sed ut perspiciatis unde omnis
iste natus error sit voluptatem
accusantium doloremque

[chorus]
In reprehenderit in voluptate
velit esse cillum dolore
eu fugiat nulla pariatur
you and I, you and I
`,
  },
  {
    slug: "track-one",
    title: "Track One",
    release: album,
    track: 1,
    lyrics: `
Nemo enim ipsam voluptatem quia voluptas
sit aspernatur aut odit aut fugit
sed quia consequuntur magni dolores
eos qui ratione voluptatem sequi nesciunt

[chorus]
Neque porro quisquam est
qui dolorem ipsum quia dolor sit amet
consectetur, adipisci velit

Ut enim ad minima veniam, quis nostrum
exercitationem ullam corporis suscipit
laboriosam, nisi ut aliquid ex ea

[chorus]
Neque porro quisquam est
qui dolorem ipsum quia dolor sit amet
consectetur, adipisci velit
`,
  },
  {
    slug: "zoes-zoetrope",
    title: "Zoe’s Zoetrope",
    release: album,
    track: 2,
    credits: "words and music by Passion by Proxy",
    lyrics: `
[verse]
At vero eos et accusamus et iusto
odio dignissimos ducimus qui blanditiis
praesentium voluptatum deleniti
atque corrupti quos dolores

Et quas molestias excepturi sint
occaecati cupiditate non provident
similique sunt in culpa qui officia
deserunt mollitia animi, id est laborum

[chorus]
Round and round, et harum quidem
rerum facilis est et expedita
distinctio, round and round

[verse]
Nam libero tempore, cum soluta nobis
est eligendi optio cumque nihil
impedit quo minus id quod maxime
placeat facere possimus

[bridge]
Temporibus autem quibusdam
et aut officiis debitis aut rerum
necessitatibus saepe eveniet

[chorus]
Round and round, et harum quidem
rerum facilis est et expedita
distinctio, round and round

[outro]
Itaque earum rerum hic tenetur
a sapiente delectus
`,
  },
  {
    slug: "track-three",
    title: "Track Three",
    release: album,
    track: 3,
    lyrics: `
Quis autem vel eum iure reprehenderit
qui in ea voluptate velit esse
quam nihil molestiae consequatur
vel illum qui dolorem eum fugiat

[chorus]
Quo voluptas nulla pariatur
quo voluptas nulla pariatur

Similique sunt in culpa qui officia
deserunt mollitia animi, id est laborum
et dolorum fuga

[chorus]
Quo voluptas nulla pariatur
quo voluptas nulla pariatur
`,
  },
];

export type Stanza = { label?: string; kind: "verse" | "chorus" | "bridge" | "other"; lines: string[] };

// Blank lines split stanzas; a [label] line names the stanza it starts.
export function parseLyrics(text: string): Stanza[] {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const m = lines[0]?.match(/^\[(.+)\]$/);
      const label = m ? m[1].trim().toLowerCase() : undefined;
      const body = m ? lines.slice(1) : lines;
      const kind: Stanza["kind"] = !label || label === "verse" ? "verse" : label === "chorus" ? "chorus" : label === "bridge" ? "bridge" : "other";
      return { label, kind, lines: body };
    })
    .filter((s) => s.lines.length > 0);
}

// Releases in the order they appear on /lyrics, each with its songs.
export function songsByRelease() {
  const releases = [single, album];
  return releases
    .map((r) => ({ release: r, songs: songs.filter((s) => s.release === r).sort((a, b) => a.track - b.track) }))
    .filter((g) => g.songs.length > 0);
}

// The song before and after, running through every release in order.
export function neighbours(slug: string) {
  const ordered = songsByRelease().flatMap((g) => g.songs);
  const i = ordered.findIndex((s) => s.slug === slug);
  return { prev: i > 0 ? ordered[i - 1] : undefined, next: i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : undefined };
}

// A release's colourway class (see .lyrics--single / --album in globals.css)
export const releaseTone = (r: Release) => `tone--${r.kind}`;
