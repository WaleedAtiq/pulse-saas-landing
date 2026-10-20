import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/*
 * /sitemap.xml — tells search engines which pages exist. One page here.
 * lastModified is a fixed date (update it when the content changes); using
 * new Date() would change on every build for no real reason.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: "2026-10-20", changeFrequency: "monthly", priority: 1 }];
}
