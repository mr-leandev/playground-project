import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";
  const now = new Date().toISOString();
  const paths = ["/", "/spc", "/garden", "/data", "/datasets", "/alerts", "/team", "/billing", "/settings", "/help"]; 
  return paths.map((p) => ({ url: base + p, lastModified: now, changeFrequency: "daily", priority: p === "/" ? 1 : 0.7 }));
}


