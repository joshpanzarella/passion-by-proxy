import type { MetadataRoute } from "next";
import { band } from "@/data/band";

// written out as a file at build time (output: "export")
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${band.url}/sitemap.xml` };
}
