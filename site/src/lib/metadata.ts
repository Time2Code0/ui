import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import { baseUrl } from "@/lib/utils";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      description: override.description ?? siteConfig.description,
      images: "/banner.png",
      locale: "en_US",
      siteName: siteConfig.name,
      title: override.title ?? siteConfig.title,
      type: "website",
      url: baseUrl,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@time2code",
      description: override.description ?? siteConfig.description,
      images: "/banner.png",
      title: override.title ?? siteConfig.title,
      ...override.twitter,
    },
  };
}
