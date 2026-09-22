import { useSyncExternalStore } from "react";

// The current minute, or null while the server renders. Anything that
// depends on today's date renders a neutral fallback on the server and
// fills in on the client, so the static build never goes stale.

const MINUTE = 60_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

export function useNowMinute(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / MINUTE) * MINUTE,
    () => null,
  );
}
