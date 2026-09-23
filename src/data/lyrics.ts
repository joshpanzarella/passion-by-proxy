import { album, firstSingle, single, type Release } from "@/data/band";

// Song lyrics. Each song is plain text:
//  - a blank line between verses
//  - a label in square brackets on its own line starts a part and names it:
//    [verse], [chorus], [bridge], [pre-chorus], [outro]... Chorus and bridge
//    get their own look; any label is shown as written.
//  - a verse with no label is just a verse
// Songs appear on /lyrics under their release (and any `alsoOn`), in
// `track` order. Songs marked `placeholder` are still lorem ipsum: they show
// on /lyrics but stay out of the captions on the melted home page; delete
// the mark when the real words go in, and the captions take them up.

export type Song = {
  slug: string; // the page address: /lyrics/<slug>
  title: string;
  release: Release; // the album (or single) the song is a track of
  track: number; // its place on that release
  // other releases it also appears on, e.g. a single that is also an album
  // track: it is listed under each, with one page
  alsoOn?: Release[];
  credits?: string; // "words and music by …"
  placeholder?: true; // still lorem ipsum: kept out of the captions
  lyrics: string;
};

export const songs: Song[] = [
  {
    slug: "proxy-music",
    title: "Proxy Music",
    release: album,
    track: 1,
    placeholder: true,
    lyrics: `
Lorem dolore nostrud enim laboris nostrud
Exercitation fugiat pariatur cupidatat
Adipiscing tempor aliquip dolor ad
Dolor ad velit aute ut

Ut nisi sed ea dolor aute sunt
Sed aliquip consequat labore
Quis exercitation magna amet incididunt consequat
Irure velit sit quis magna et amet

[chorus]
Nulla est nisi consectetur id nostrud dolor
Non laborum do sed proident
Velit do lorem sint laborum

[bridge]
Est ullamco esse officia commodo laboris
Duis aliquip adipiscing fugiat nisi
Ipsum do laboris deserunt nostrud voluptate

[chorus]
Nulla est nisi consectetur id nostrud dolor
Non laborum do sed proident
Velit do lorem sint laborum
`,
  },
  {
    slug: "u-and-i",
    title: "U&I",
    release: album,
    track: 2,
    placeholder: true,
    alsoOn: [single], // the single too
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
    slug: "one-die-snake-eyes",
    title: "One Die Snake Eyes",
    release: album,
    track: 3,
    placeholder: true,
    lyrics: `
Non consequat commodo ullamco voluptate anim ea
Incididunt deserunt ipsum exercitation id reprehenderit
Do velit nulla cupidatat ad reprehenderit minim
Nulla dolor consectetur nulla duis ullamco

Sed qui laborum reprehenderit ipsum
Culpa sint ut quis reprehenderit laboris excepteur
Incididunt elit qui cillum cupidatat consectetur
Dolor veniam ex aute

[chorus]
Irure quis ullamco minim sed anim
Irure lorem qui quis incididunt
Dolore nisi incididunt quis enim

Ea incididunt nostrud sint veniam incididunt
Incididunt irure laboris amet velit id ad
Elit adipiscing velit ipsum
Ipsum irure aute consectetur commodo

[chorus]
Irure quis ullamco minim sed anim
Irure lorem qui quis incididunt
Dolore nisi incididunt quis enim

[bridge]
Voluptate occaecat esse labore
Eiusmod mollit do sit consequat
Velit magna dolor cillum ullamco anim

[chorus]
Irure quis ullamco minim sed anim
Irure lorem qui quis incididunt
Dolore nisi incididunt quis enim
`,
  },
  {
    slug: "sick-stability",
    title: "Sick Stability",
    release: album,
    track: 4,
    placeholder: true,
    lyrics: `
Do occaecat id esse culpa pariatur
Laborum veniam aliqua est voluptate elit
Fugiat lorem nulla ad ad nisi magna
Commodo proident eiusmod non

Enim aute cillum consectetur laborum est
Deserunt dolore exercitation in officia qui do
Labore aute occaecat sed cupidatat anim labore
Proident fugiat qui dolor deserunt dolore

[chorus]
Sint sint nulla labore
Labore occaecat laboris aliqua
Qui cillum lorem aliquip nisi non

[bridge]
Proident dolor anim consectetur ex reprehenderit
Fugiat deserunt laborum veniam voluptate ut esse
Pariatur sit cillum cillum dolore

[chorus]
Sint sint nulla labore
Labore occaecat laboris aliqua
Qui cillum lorem aliquip nisi non
`,
  },
  {
    slug: "the-runner-up",
    title: "The Runner Up",
    release: album,
    track: 5,
    placeholder: true,
    lyrics: `
Aliquip consectetur id sint
Minim ex cupidatat laborum aliqua irure quis
Culpa exercitation incididunt ex commodo
Elit commodo ullamco ullamco amet anim sit

Nisi minim veniam id qui
Et aliquip et velit in sint
Minim id aliquip laborum nisi cillum dolor
Cupidatat minim adipiscing consequat

[chorus]
Esse voluptate ullamco voluptate
Ad exercitation cillum ad pariatur ut
Anim ut deserunt dolor voluptate amet

Fugiat est ut voluptate reprehenderit
Id magna occaecat veniam excepteur ex adipiscing
Lorem ut ullamco enim cillum reprehenderit
Officia officia pariatur esse commodo do

[chorus]
Esse voluptate ullamco voluptate
Ad exercitation cillum ad pariatur ut
Anim ut deserunt dolor voluptate amet

[bridge]
Dolore elit veniam sunt tempor minim
Qui veniam occaecat occaecat nisi proident eiusmod
Ad voluptate duis exercitation proident

[chorus]
Esse voluptate ullamco voluptate
Ad exercitation cillum ad pariatur ut
Anim ut deserunt dolor voluptate amet
`,
  },
  {
    slug: "zoes-zoetrope",
    title: "Zoe’s Zoetrope",
    release: album,
    track: 6,
    placeholder: true,
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
    slug: "dead-end-clout",
    title: "Dead End Clout",
    release: album,
    track: 7,
    placeholder: true,
    lyrics: `
Minim minim mollit amet est voluptate minim
Adipiscing nisi ullamco non
Voluptate qui do nisi
Officia cillum excepteur ea excepteur

Elit est anim ex sit ea adipiscing
Est cillum dolore ullamco exercitation ipsum occaecat
Sit aute lorem adipiscing
Velit elit adipiscing quis irure

[chorus]
Sit est anim ut ipsum
Exercitation ad laborum qui sed consequat
Consequat ad adipiscing irure quis

Aliquip eiusmod ex amet ut
Ullamco duis qui occaecat ut
Labore nostrud reprehenderit amet
Laboris sed consectetur laboris enim ea

[chorus]
Sit est anim ut ipsum
Exercitation ad laborum qui sed consequat
Consequat ad adipiscing irure quis

[bridge]
Consectetur culpa ad cupidatat quis duis
Aliqua amet reprehenderit ut fugiat sit cillum
Anim aute est deserunt elit

[chorus]
Sit est anim ut ipsum
Exercitation ad laborum qui sed consequat
Consequat ad adipiscing irure quis
`,
  },
  {
    slug: "wet-street-causes-rain",
    title: "Wet Street Causes Rain",
    release: album,
    track: 8,
    placeholder: true,
    lyrics: `
Sed et elit ullamco
Ad ullamco proident commodo
Ullamco mollit occaecat id sint ea
Dolor culpa commodo officia esse quis veniam

[chorus]
Incididunt id anim consequat
Ipsum laboris non enim dolor
Fugiat in cupidatat ex id anim

Consequat tempor nisi laborum sint aliquip
Occaecat amet ut commodo magna commodo
Ut enim laborum eiusmod laboris ullamco reprehenderit
Sint adipiscing velit ut tempor ut

[chorus]
Incididunt id anim consequat
Ipsum laboris non enim dolor
Fugiat in cupidatat ex id anim

[outro]
Nostrud non sit excepteur consectetur quis
Sunt ad aute magna duis do cillum
`,
  },
  {
    slug: "cut-corners-run-in-circles",
    title: "Cut Corners Run in Circles",
    release: album,
    track: 9,
    placeholder: true,
    lyrics: `
Eiusmod labore fugiat ipsum
Laboris occaecat voluptate reprehenderit magna sint
Magna veniam occaecat non sunt ipsum
Adipiscing occaecat dolore ut velit exercitation ut

Dolor quis laboris sint sunt laborum est
Mollit sed sit nostrud amet
Sed aliqua aute velit
In qui dolor sint magna irure ipsum

[chorus]
Magna id magna fugiat in minim
Commodo et sunt exercitation officia occaecat
Et et anim est duis

Fugiat occaecat ad eiusmod
Proident quis ullamco amet
Non adipiscing sint aliqua id ex
Anim dolor excepteur voluptate nulla enim

[chorus]
Magna id magna fugiat in minim
Commodo et sunt exercitation officia occaecat
Et et anim est duis

[bridge]
Nulla mollit do do eiusmod est et
Aliquip ea tempor fugiat deserunt officia incididunt
Eiusmod ut esse labore tempor consequat voluptate

[chorus]
Magna id magna fugiat in minim
Commodo et sunt exercitation officia occaecat
Et et anim est duis
`,
  },
  {
    slug: "placid-pastiche",
    title: "Placid Pastiche",
    release: album,
    track: 10,
    placeholder: true,
    lyrics: `
Elit aute qui labore adipiscing sunt
Ullamco qui elit esse do
Ut elit tempor amet
Officia aliquip sit non

[chorus]
Magna occaecat adipiscing elit qui incididunt incididunt
Occaecat ea commodo nulla cupidatat id sit
Duis do deserunt et laborum ipsum

Nisi cillum sint ut mollit fugiat
Culpa id fugiat sunt consectetur labore anim
Elit quis quis sunt fugiat nisi
Sunt dolore ut reprehenderit non commodo

[chorus]
Magna occaecat adipiscing elit qui incididunt incididunt
Occaecat ea commodo nulla cupidatat id sit
Duis do deserunt et laborum ipsum

[outro]
Irure excepteur ut laboris irure eiusmod
Nulla commodo enim incididunt
`,
  },
  {
    slug: "i-wont-be-long",
    title: "I Won’t Be(Long)",
    release: firstSingle,
    track: 1,
    lyrics: `
I won’t belong
I won’t be long

I’ll take you where the water lays
I’ll take you where it flows
I’ll pray with you for brighter days
You’ll be weeping what I sew
I’ll take you to a distant place
Right outside your door
Where people used to make mistakes
Now they just keep score

I’ll take you where the water lays
I’ll take you where it flows
I’ll wait in the infirmary
To affirm what I know
I love you liked I’m damned too
Come on baby, reciprocate
All the time you’re wondering
If there is a space in

I won’t belong
I won’t be long

Love me like your damned to
Fan me like a flame
Let me complicate you
If you’ve been living lame
I’ll take you where the water lays
I’ll take you where it flows
We’ll keep it all between us
I’ll tell everyone I know

I was sleeping in an aqueduct
Down the river, a pair of spades
I was dreaming of an architect
Who didn’t do it to get paid
I’ll love you like I’m damned to
Then I’ll pour you down the drain
All the time I’m wondering
If there is a space in

I won’t belong
I won’t be long
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
  const releases = [single, album, firstSingle];
  return releases
    .map((r) => ({
      release: r,
      songs: songs.filter((s) => s.release === r || s.alsoOn?.includes(r)).sort((a, b) => a.track - b.track),
    }))
    .filter((g) => g.songs.length > 0);
}

// The song before and after, running through every release in order, each
// song once (a single that is also an album track is met in the album).
export function neighbours(slug: string) {
  const ordered = songsByRelease()
    .flatMap((g) => g.songs.filter((s) => s.release === g.release));
  const i = ordered.findIndex((s) => s.slug === slug);
  return { prev: i > 0 ? ordered[i - 1] : undefined, next: i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : undefined };
}

// A release's colourway class (see .lyrics--single / --album in globals.css)
export const releaseTone = (r: Release) => `tone--${r.tone ?? r.kind}`;
