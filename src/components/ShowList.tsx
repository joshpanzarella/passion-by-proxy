"use client";

import type { Show } from "@/data/band";
import { formatDate, todayIso } from "@/lib/dates";
import { useNowMinute } from "@/lib/useNow";

// Splits upcoming from past in the visitor's browser, so a show drops off
// the day after without a rebuild.
export function ShowList({ shows }: { shows: Show[] }) {
  const now = useNowMinute();
  const today = now === null ? null : todayIso(new Date(now));
  const sorted = [...shows].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = today === null ? sorted : sorted.filter((s) => s.date >= today);
  const past = today === null ? [] : sorted.filter((s) => s.date < today).reverse();

  return (
    <>
      {upcoming.length === 0 ? (
        <div className="empty" data-reveal="">
          <p>no dates yet.</p>
          <a href="#contact">get on the list to hear first →</a>
        </div>
      ) : (
        <ul className="shows">
          {upcoming.map((s, i) => (
            <ShowRow key={s.date + s.venue} show={s} index={i} />
          ))}
        </ul>
      )}
      {past.length > 0 && (
        <details className="past-shows">
          <summary>past shows ({past.length})</summary>
          <ul className="shows shows--past">
            {past.map((s) => (
              <ShowRow key={s.date + s.venue} show={s} past />
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

function ShowRow({ show, index = 0, past = false }: { show: Show; index?: number; past?: boolean }) {
  return (
    <li className="show" data-reveal={past ? undefined : ""} style={{ "--i": index } as React.CSSProperties}>
      <span className="show__date">
        <span className="show__month">{formatDate(show.date, { month: "short" })}</span>
        <span className="show__day">{formatDate(show.date, { day: "numeric" })}</span>
      </span>
      <span className="show__where">
        <strong>{show.venue}</strong>
        <span className="muted">
          {show.city}
          {show.note ? ` · ${show.note}` : ""}
        </span>
      </span>
      {!past && show.actions?.length ? (
        <span className="show__actions">
          {show.actions.map((a) => (
            <a key={a.label} className="button" href={a.href} rel="noopener noreferrer" target="_blank">
              {a.label}
            </a>
          ))}
        </span>
      ) : (
        <span />
      )}
    </li>
  );
}
