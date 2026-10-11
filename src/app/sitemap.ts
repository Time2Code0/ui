import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 1,
      url: baseUrl,
    },
  ];
}
