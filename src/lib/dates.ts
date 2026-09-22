// Release and show dates are plain YYYY-MM-DD strings, read as the
// visitor's own calendar day.

export function localMidnight(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  // Formatted in UTC from a UTC date so the server and every browser agree.
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function todayIso(now = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}
