import { album, single } from "@/data/band";
import { formatDate } from "@/lib/dates";

// Strip under the hero; it slides with the scroll (globals.css). The items
// are written twice so the loop has no seam.
export function Ticker() {
  const items = [
    `new single “${single.title}” ${single.date ? formatDate(single.date, { month: "long", day: "numeric" }) : ""}`,
    `album “${album.title}” ${album.date ? formatDate(album.date, { month: "long" }) : album.dateLabel ?? ""}`,
    "featuring “zoe’s zoetrope”",
    "passion -by- proxy",
  ];
  const run = [...items, ...items, ...items];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...run, ...run].map((t, i) => (
          <span key={i} className="ticker__item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
