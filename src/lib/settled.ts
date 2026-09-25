// Calls back once the home page has settled: loaded (the hero video's first
// frame too), the splash over (html[data-splash]) and the browser idle. The
// players from other sites (Spotify, TikTok) start loading then, so they are
// ready before anyone scrolls to them, without slowing the page's own first
// screen. Never for a visitor saving data (they load as they are reached).
// Returns a cancel.
export function whenSettled(cb: () => void): () => void {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return () => {};
  const root = document.documentElement;
  let cancelled = false;
  let timer = 0;
  const go = () => {
    if (!cancelled) cb();
  };
  const check = () => {
    if (root.dataset.splash === undefined || document.readyState !== "complete" || timer) return;
    watch.disconnect();
    window.removeEventListener("load", check);
    // a moment more for the hero video to get going, then the first idle
    timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 3000 });
      else go();
    }, 1000);
  };
  const watch = new MutationObserver(check);
  watch.observe(root, { attributes: true, attributeFilter: ["data-splash"] });
  window.addEventListener("load", check);
  check();
  return () => {
    cancelled = true;
    watch.disconnect();
    window.removeEventListener("load", check);
    window.clearTimeout(timer);
  };
}
