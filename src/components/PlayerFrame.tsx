"use client";

import { useEffect, useState } from "react";
import { whenSettled } from "@/lib/settled";

// A player from another site (Spotify, Bandcamp) in its frame: lazy (the
// browser loads it as it is scrolled near) until the page has settled, then
// loaded wherever it is, so it is ready by the time anyone reaches it.
export function PlayerFrame(props: Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "loading">) {
  const [warm, setWarm] = useState(false);
  useEffect(() => whenSettled(() => setWarm(true)), []);
  return <iframe {...props} loading={warm ? "eager" : "lazy"} />;
}
