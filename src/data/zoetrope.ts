// Splash screen settings. Drop frame images in public/zoetrope/ and list them
// here in order; while the list is empty the splash plays a drawn placeholder.

export const zoetrope = {
  frames: [] as string[], // e.g. ["/zoetrope/01.png", "/zoetrope/02.png", ...]
  fps: 12,
  // How long the splash plays before it fades out on its own.
  durationMs: 3200,
  fadeMs: 700,
};

// sessionStorage key that marks the splash as played this visit.
export const SPLASH_KEY = "pbp-splash-seen";
