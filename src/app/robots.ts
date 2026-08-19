import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/checkout", "/login", "/register"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
