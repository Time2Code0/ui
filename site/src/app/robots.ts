import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    host: baseUrl,
    rules: {
      allow: "/",
      disallow: "/api/",
      userAgent: "*",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
