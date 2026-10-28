export const siteConfig = {
  author: {
    name: "Time2Code",
    url: "https://time2code.dev",
  },
  description:
    "Akari is a shadcn-compatible React component library for building production apps and the marketing sites that sell them.",
  keywords: [
    "akari",
    "design system",
    "shadcn",
    "react",
    "tailwind",
    "ui",
    "components",
  ],
  name: "Akari",
  navItems: [
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/particles",
      label: "Particles",
    },
    {
      href: "/blocks",
      label: "Blocks",
    },
    {
      href: "/charts",
      label: "Charts",
    },
  ],
  socials: {
    github: "https://github.com/time2code0/design-system",
  },
  title: "Akari — React components for apps and marketing sites",
  url: "https://design.time2code.dev",
};

export type SiteConfig = typeof siteConfig;
