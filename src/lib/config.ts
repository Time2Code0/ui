export const siteConfig = {
  author: {
    name: "Time2Code",
    url: "https://time2code.dev",
  },
  description: "A design system for the modern web",
  keywords: [
    "design system",
    "shadcn",
    "react",
    "tailwind",
    "ui",
    "components",
  ],
  name: "Design System",
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
  ],
  socials: {
    github: "https://github.com/time2code0/design-system",
  },
  title: "Design System",
  url: "https://design.time2code.dev",
};

export type SiteConfig = typeof siteConfig;
