import type { MetadataRoute } from "next";
import { band } from "@/data/band";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: band.url, lastModified: new Date() }];
}
