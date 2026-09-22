import type { MetadataRoute } from "next";
import { band } from "@/data/band";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${band.url}/sitemap.xml` };
}
