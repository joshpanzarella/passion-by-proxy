import type { MetadataRoute } from "next";
import { band } from "@/data/band";
import { openSongs } from "@/data/lyrics";

// written out as a file at build time (output: "export")
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: band.url, lastModified: now },
    { url: `${band.url}/lyrics`, lastModified: now },
    ...openSongs.map((s) => ({ url: `${band.url}/lyrics/${s.slug}`, lastModified: now })),
  ];
}
