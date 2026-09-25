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
    lyrics: `
We’re competing
Open season
May the best man sin

I’ll concede it
I’m conceited
Still, I’m planning the whim

Feeling weakened
Losing weekends
But I’d do it again
(Do it again...)

Who needs sleeping?
I’ve been steeping
In a passenger van

Canning preachings
Reaping weepings
Yeah, I do what I can

What you on about?
No ones to deep
To understand
(To understand...)

If I was supposed to watch my tongue like you keep saying
Then put my eyes in my mouth, come on, I’m waiting

[chorus]
Come on I’m waiting
Come on I’m waiting

Do you call it “lo-fi” when its just the best you can do?
Do you scream out your lungs ’cause you can’t sing a tune?

[outro]
Can’t sing a tune
Can’t sing a tune
Can’t sing a tune.... No....
Can’t sing a tune.... Now....
`,
  },
  {
    slug: "u-and-i",
    title: "U&I",
    release: album,
    track: 2,
    alsoOn: [single], // the single too
    credits: "words and music by Passion by Proxy",
    lyrics: `
Yesterday I was thinking about
All the things I can’t do without
Like motor rides down the country side
I could live or die, just you decide

I laughed in the face of a runaway train
I shrugged it off, ’cause I was done away with that pain
I’ll take you out tonight
We could feel up the turbines
You danced and danced at the chance of rain
You chalked it up to some unbalancing in your brain
Some things can’t be denied
Come on baby, that’s U⅋I

[chorus]
U&I
U⅋I

[bridge]
Time... feels like old clothes...
Right... under your nose...
Never half as good when you pose
But perfect in it’s dose
In it’s dose..
In it’s dose...
In it’s dose....
(I laughed in the face of a runaway train)
In it’s dose.....
(I shrugged it off, ’cause I was done away with that pain)
In it’s dose........
(I’ll take you out tonight)

[chorus]
Come on baby, that’s U⅋I
Come on baby, that’s U&I
U⅋I
U&I
`,
  },
  {
    slug: "one-die-snake-eyes",
    title: "One Die, Snake Eyes",
    release: album,
    track: 3,
    lyrics: `
Desire no desire
Then you need no need
Do you want to not want now?
Do you dream of no sleep?

Keep moving towards stasis
Then you steal whats free
And I know you won’t believe it
Limelights not green

So go on and catch a gasp..
Better roll up the sleeves on your tank top

And I know you won’t believe it
I screenshot the cracks on my phone
Found solace since my soul split
The whole things overblown

[chorus]
Your hips don’t lie, but hypocrites lie twice
How did I get snake eyes with only one die?

Are you starving for hunger?
Are you Achin’ to Be?
Well I know you’re not an atheist
That’s too much to believe

I’ve given up on reasons
I sharpen it until it’s dull
Hoarding all your empty vessels
And husking the hulls

Gunpoint kindness I admit..
Russian roulette with stones and sticks
Can’t get enough of this trial

[chorus]
Your hips don’t lie, but hypocrites lie twice
How did I get snake eyes with only one die?

[bridge]
How did I get it, how did I get?
How did I get it, how did I get?
How did I get it, how did I get?
How did I get it, how did I get?

[chorus]
Your hips don’t lie, but hypocrites lie twice
How did I get snake eyes with only one die?
`,
  },
  {
    slug: "sick-stability",
    title: "Sick Stability",
    release: album,
    track: 4,
    lyrics: `
I’ve been going straight
From coffee to booze
I’ve been staying up late
& I never hit snooze
I swear that I’m getting up
But then I’m refreshing the news
(refreshing the news)
As told by two cartoons
Who fake argue
and they say....

[pre-chorus]
“Fix your car, fix your door, fix your animals”
“Fix your friends, fix your foes, fix that hole in your heart”
“Fix the game”
“The game is fixed”
“Get your mind right out the ditch”
Already halfway there
Don’t even know how to start

[chorus]
But maybe it’s not broken
Maybe it’s just easier this way
The only thing that stays the same
Is how much I want things to change

I’ve been raising the stakes
To keep myself petrified
I’ve been on a spending spree
Ever since a nickel cost a dime
I don’t have much left
(nothing left, nothing left)
Since I gave you a piece of my mind
(piece of my mind)
I’ll just replay it in my head until I feel justified

[pre-chorus]
Fix your car
Fix your door
Fix your animals
Fix your friends
Fix your foes
Fix that hole in my heart
Fix the game, the game is fixed
Get your mind right out the ditch
Already halfway there
Don’t even know how to start

[chorus]
But maybe it’s not broken
Maybe it’s just easier this way
The only thing that stays the same
Is how much I want things to change
Maybe it’s not
(it’s not!) (it’s not!)
Maybe it’s not
(it’s not!) (it’s not!)
Maybe it’s not broken
The only thing that stays the same
Is how much I want things to change

[outro]
My sick stability, it’s killing me I know
My sick stability, it’s killing me I know
I know, I know
It’s killing me I know...
`,
  },
  {
    slug: "the-runner-up",
    title: "The Runner Up",
    release: album,
    track: 5,
    lyrics: `
So- so sorry I missed your call
I made it so my phone don’t ring at all
& I leveled the earth
So I don’t fall again
How ya- How ya doing?
Yeah, how it’s been?
All I do is repeat- repeat and rinse
Hows life decaying in decadence my friend?

You drank the water from the wishing well
What’s another synonym for “ill”
You’re taking every color pill
Until you brown out on your sofa
Collapsing all the multitudes
Brainstorming new ways to be rude
Open is the mouth that chews
The fat, the ring on your coaster

My whole life I’ve been a drip away
From a glass half full, it evaporates
On the bright side it looks like rain again
The ebb, the flow
The wax, the wayne
The cheaters win a loser’s game
I’m starting to have faith in fate again

Not too much man, how ’bout you?
I’m trying my best not to blow a fuse
Yeah, I’m trying my best not to throw a fuss
It’s never ever ever enough
& the solution comes in a topical gel
A gun sound effect would go hear well
Call my name, ring my bell
& we’ll move back to Minnesota

My whole life I’ve been a drip away
From a glass half full, it evaporates
On the bright side it looks like rain again
The six of wands, the knight of cups
Running up on the runner up
I tried to erase what I should have let fade

I know I should have let it fade
I know I should have let it fade
Let it fade...
Let it fade...

Every night, I have fake litigations
In my-
Fake litigations in my mind..
I realize, it’s a poor imitation
’Cause you’d never listen

Never listen, no you never listen
Never listen, no you never listen
Never listen, no you never listen
Never listen, oh no, you never listen
Never listen, no you never listen
Never listen, no you never listen
Never listen, no you never listen
Never listen, oh no, you never listen
`,
  },
  {
    slug: "zoes-zoetrope",
    title: "Zoe’s Zoetrope",
    release: album,
    track: 6,
    credits: "words and music by Passion by Proxy",
    lyrics: `
Nah I ain’t gonna look at Zoe’s Zoetrope no more
Nah I ain’t gonna look at Zoe’s Zoetrope no more
The morning condensation’s
Tasting kinda condescending
Copy my copy pastings
The truth is never ending
But the end, she says, is closer
Than it’s been before
But I’m not going to be looking at Zoe’s Zoetrope no more

I ain’t gonna look at Zoe’s Zoetrope no more
I ain’t gonna look at Zoe’s Zoetrope no more
She swears it’s not so simple
As the darkness verses the light
Yeah, it might be 4D chess to you
But it’s still just black and white
Call up your RoundUp Ready friends
And face the children of the corn
That don’t want to look at Zoe’s Zoetrope anymore

Yeah, yeah, yeah you got it
Got it got it wrong
A tale as old as time,
The finger wags the dog
When the fruit of your labor
Is rotten at the core-
I don’t think I’ll be looking at Zoe’s Zoetrope anymore
More…
More…
More, more, more…

No I don’t think I’ll stare at Zoe’s Zoetrope anymore
No I don’t think I’ll stare at Zoe’s Zoetrope anymore
She’s getting kinda giddy
When a new bomb drops
GoFundMe for a kidney
Never mind — her mom’s a cop!
Should’ve grown a classy conscious
And made herself a whore
Nah - I don’t want to stare at Zoe’s Zoetrope anymore

No I don’t think I’ll stare at Zoe’s Zoetrope anymore
I don’t want to look at Zoe’s Zoetrope anymore
Freebase the associations
I guess you gotta learn
The shelf life of the
Self-consciously self-assured
When the verge and the edge
Are always pounding at the door-
And your scab picking arm
Somehow never gettin’ sore-
Don’t think I’ll be looking at Zoe’s Zoetrope no more
I don’t think I’m looking at Zoe’s Zoetrope no more!
`,
  },
  {
    slug: "dead-end-clout",
    title: "Dead End Clout",
    release: album,
    track: 7,
    lyrics: `
Such sad.. Such sad, awful, terrible, and horrible news
The worst people you know want nothing to do with you
The most middling of the middlemen in the crew

Has sung a tune

Now you’re finding out
It’s dead end clout

I sang my heart out

Now I’m done, can’t play in this town
Someone just beat me with their brow
Succumb to the suckers and their thumbs

Or change your name to mud

What you talking about?

I swear I don’t know nothing about it now

And anyhow (anyhow!)
If I did… would it be the kind of thing that I’d say out loud?
(out loud!)
I’d keep it buried in the ground

Now you’re finding out
It’s dead end clout

I’ll tear your heart out

I’m done, can’t play in this town
Someone just beat me with their brow
Succumb to the suckers and the thumbs

Or change your name and

Go insane and
They’ll pick your brain
But never to your face
`,
  },
  {
    slug: "wet-street-causes-rain",
    title: "Wet Street Causes Rain",
    release: album,
    track: 8,
    lyrics: `
I’m sick of everything now
The taste of blood got old
On my tongue is copper green
How did I reach the eighth fold?
Tried to be a decent person
Now everyone’s the worst
Tried sewing seeds of glory
But they only want to see the dirt

& how come the wet streets cause the rain?
Gotta wonder if it’s thunder and...
How come the outcome stays the same anyway...

If it’s so easy for me to say?
Why’s it so hard?
Why’s it so hard?
If it’s so easy for me to say
Why’s it so hard for me to be heard?

For me to be heard...

I was eighteen at ground zero
I watched the world implode
Questions answered the questions
Everybody got diagnosed
I don’t know how you can figure
That you can feel things more
Rattle off your list of treasons
Didn’t know we were keeping score and
How come the wet streets cause the rain?
God I wonder whose thumb your under now?

If it’s so easy for me to say?
Why’s it so hard?
Why’s it so hard?
If it’s so easy for me to say
Why’s it so hard for me to be heard?

Yeah why’s it so hard?
Why’s it so hard?

If it’s so easy for me to say?
Why’s it so hard?
Why’s it so hard?
If it’s so easy for me to say
Why’s it so hard for me to be heard?
`,
  },
  {
    slug: "cut-corners-run-in-circles",
    title: "Cut Corners (Run in Circles)",
    release: album,
    track: 9,
    lyrics: `
Yeah I was giving up “up” to keep you down
I was cutting off my head to not wear a crown
I’d feed myself to the wolves to starve all the hounds
& I’d run for the hills to escape the mounds

You keep on cutting corners and you’ll run in circles
All the way down, you see no turtles
“It’s not a diary, it’s called a journal”
Yeah right...

Though I can choke down the news
I persists at what I presume
Illiterate at reading rooms
I just lit a rag off your perfume

Your perfume...
Your perfume....

Doesn’t make a difference if no one’s around
I’m cutting all the trees, they won’t make a sound
You only pick your poison in mils or ounces
Strong enough to kill a horse, forgive me, a stallion

You keep on cutting corners and you’ll run in circles
All the way down, you see no turtles
Your leather bound spine meets it’s final hurdle tonight

Though I can choke down the news
I persists at what I presume
Illiterate at reading rooms
I just lit a rag off your perfume

Your perfume...
Your perfume....
`,
  },
  {
    slug: "placid-pastiche",
    title: "Placid Pastiche",
    release: album,
    track: 10,
    lyrics: `
You don’t believe in hell
But you make it well
Don’t believe in laws
But you still keep me in a cell

Don’t believe in walls
You just stack blocks tall
For as far as the eye can see
The same eyes that cry when they fall

Well you can change your tune
& still find an excuse
Maybe sing a drone
Or maybe play your monotonal lute

You say you aren’t free
You seem it to me
When you can say whatever you want
& expect me to agree

NOW EVERY SCENES
A PLACID PASTICHE
EVERYBODY RAISE A TOAST
TO THE KING OF THE ROYALTY FREE

COME NOW ALL LEPERS
AND LEAPERS OF FAITH
IT’S FINALLY HATCHING
THE EGG ON MY FACE

YOU SAY YOU CAN’T BREATHE
BUT I CAN HEAR YOU SCREAM
I JUDGE YOU NOT BY WHAT YOU ASK FOR
BUT FROM WHAT YOU RECEIVE

I JUDGE YOU NOT BY WHAT YOU ASK FOR
BUT FROM WHAT YOU RECEIVE
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
