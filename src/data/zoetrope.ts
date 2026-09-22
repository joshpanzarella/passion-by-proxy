// Splash screen settings. Frames are built from the logo art by
// `npm run zoetrope` (see scripts/build-zoetrope.mjs) and play in this order.

export const zoetrope = {
  frames: [
    "/zoetrope/01.webp", // teal
    "/zoetrope/02.webp", // orange
    "/zoetrope/03.webp", // pink
    "/zoetrope/04.webp", // purple
    "/zoetrope/05.webp", // red
  ],
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
  fadeMs: 700,
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
