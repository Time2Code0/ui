import type { Page } from "fumadocs-core/source";

import { env } from "@/env";
import { siteConfig } from "@/lib/config";

export function getPageImageUrl(page: Page) {
  const segments = [...page.slugs, "image.webp"];

  return {
    segments,
    url: `/${[page.locale, "og", ...segments].filter(Boolean).join("/")}`,
  };
}

export const baseUrl =
  env.NODE_ENV === "development" ? "http://localhost:3000" : siteConfig.url;
