// Splash screen settings. Frames are built from the logo art by
// `npm run zoetrope` (see scripts/build-zoetrope.mjs) and play in this order.

export const zoetrope = {
  frames: [
    "/zoetrope/01.webp", // teal
    "/zoetrope/02.webp", // orange
    "/zoetrope/03.webp", // pink
    "/zoetrope/04.webp", // blue, coral lettering
    "/zoetrope/05.webp", // purple
    "/zoetrope/06.webp", // red
  ],
  // Each frame's "passion -by- proxy®" colour, sampled from it (the median
  // of the lettering's solid pixels): the katakana under the splash's logo
  // takes the colour of the frame showing.
  lettering: ["#d262d1", "#61bf74", "#7fc160", "#c3695e", "#c1b060", "#80bc60"],
  // The frame the drum stops on.
  landOn: 0,

  // The drum spins up, holds full speed, then slows and stops.
  // Frame times (ms) run from `slowestMs` down to `fastestMs` and back.
  slowestMs: 240,
  fastestMs: 55,
  spinUpMs: 900,
  fullSpeedMs: 600,
  spinDownMs: 900,
  // How long the stopped logo holds before the site fades in.
  holdMs: 500,
  // The site fading in while the logo glides into its place in the hero.
  fadeMs: 900,
  leaveEase: "cubic-bezier(0.65, 0, 0.35, 1)",
  // Longest wait for the frames to download before playing anyway.
  loadTimeoutMs: 2500,
};

// sessionStorage key that marks the splash as played this visit.
export const SPLASH_KEY = "pbp-splash-seen";

export type Step = { frame: number; ms: number; speed: number };

// The whole run as a list of steps, worked out once. Counted backwards from
// the end so the last step always lands on `landOn`, whatever the timings.
export function buildSchedule(cfg = zoetrope): Step[] {
  const { slowestMs: slow, fastestMs: fast } = cfg;
  const speedOf = (ms: number) => (slow - ms) / (slow - fast); // 0 slow .. 1 fast
  const ramp = (total: number, from: number, to: number) => {
    const out: number[] = [];
    let t = 0;
    while (t < total) {
      const ms = from + (to - from) * easeInOut(t / total);
      out.push(ms);
      t += ms;
    }
    return out;
  };

  const times = [
    ...ramp(cfg.spinUpMs, slow, fast),
    ...ramp(cfg.fullSpeedMs, fast, fast),
    ...ramp(cfg.spinDownMs, fast, slow),
  ];

  const n = cfg.frames.length;
  const last = times.length - 1;
  return times.map((ms, i) => ({
    frame: (((cfg.landOn - (last - i)) % n) + n) % n,
    ms,
    speed: i === last ? 0 : speedOf(ms),
  }));
}

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

// Slits move this share of one slit's pitch per step: the drum turning.
export const SLIT_STEP = 0.37;

// The splash as CSS keyframes, generated from the schedule. The browser runs
// CSS opacity/transform animations itself, so the drum keeps an even beat
// while the page's code is busy loading (a script-timed version stuttered
// on phones). Steps are hard cuts: each value holds until a hair before the
// next step, then jumps (linear, which Safari accelerates; steps() it may
// not). The slits' darkness ramps smoothly instead.
export function splashCss(schedule: Step[] = buildSchedule()): { css: string; totalMs: number } {
  const starts: number[] = [];
  let t = 0;
  for (const s of schedule) {
    starts.push(t);
    t += s.ms;
  }
  const total = t;
  const pct = (ms: number) => `${((ms / total) * 100).toFixed(4)}%`;
  const EPS = 0.02; // ms before the next step where a held value ends

  // a value per step, held for the step and cut at the next
  const held = (name: string, prop: string, value: (i: number) => string) => {
    const frames = schedule.map((_, i) => {
      const end = i + 1 < schedule.length ? starts[i + 1] - EPS : total;
      return `${pct(starts[i])},${pct(end)}{${prop}:${value(i)}}`;
    });
    return `@keyframes ${name}{${frames.join("")}}`;
  };

  const css = [
    ...zoetrope.frames.map((_, f) => held(`pbp-frame-${f}`, "opacity", (i) => (schedule[i].frame === f ? "1" : "0"))),
    // a frame seen through a moving slit never sits in quite the same place
    held("pbp-stage", "transform", (i) => {
      const jitter = schedule[i].speed > 0 ? ((i * 7919) % 5) - 2 : 0;
      return `translate3d(${(jitter * schedule[i].speed * 0.4).toFixed(3)}%,0,0)`;
    }),
    held("pbp-slit-shift", "transform", (i) => `translate3d(calc(var(--slit-pitch) * ${((i * SLIT_STEP) % 1).toFixed(3)}),0,0)`),
    `@keyframes pbp-slit-dark{${schedule.map((s, i) => `${pct(starts[i])}{opacity:${s.speed.toFixed(3)}}`).join("")}100%{opacity:0}}`,
    ...zoetrope.frames.map(
      (_, f) => `.splash--play .splash__frame:nth-of-type(${f + 1}){animation:pbp-frame-${f} ${total}ms linear both}`,
    ),
    // the katakana under the logo: a copy per frame, on the frames' own beat
    ...zoetrope.frames.map(
      (_, f) => `.splash--play .splash__ja span:nth-of-type(${f + 1}){animation:pbp-frame-${f} ${total}ms linear both}`,
    ),
    `.splash--play .splash__stage{animation:pbp-stage ${total}ms linear both}`,
    `.splash--play .slits{animation:pbp-slit-shift ${total}ms linear both,pbp-slit-dark ${total}ms linear both}`,
  ].join("\n");

  return { css, totalMs: total };
}
