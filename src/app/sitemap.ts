import type { MetadataRoute } from "next";
import { band } from "@/data/band";

// written out as a file at build time (output: "export")
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: band.url, lastModified: new Date() }];
}
