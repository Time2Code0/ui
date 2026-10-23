import type { Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { ThemeProvider } from "./theme-provider";

import "@/styles/globals.css";

import { env } from "@/env";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/metadata";
import { baseUrl } from "@/lib/utils";
import { AnchoredToastProvider, ToastProvider } from "@/registry/ui/toast";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const readaction = localFont({
  display: "swap",
  src: "../../public/redaction-35-regular.woff2",
  variable: "--font-redaction",
});

export const metadata = createMetadata({
  alternates: {
    canonical: "/",
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  category: "technology",
  creator: siteConfig.author.name,
  description: siteConfig.description,
  generator: "Next.js",
  keywords: siteConfig.keywords,
  metadataBase: new URL(baseUrl),
  publisher: siteConfig.author.name,
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
});

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#0a0a0a", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${readaction.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="relative scroll-smooth bg-background font-sans text-base text-foreground antialiased selection:bg-foreground selection:text-background">
        <div className="relative isolate flex min-h-svh flex-col">
          <ThemeProvider>
            <ToastProvider>
              <AnchoredToastProvider>
                {children}
                <TailwindIndicator />
              </AnchoredToastProvider>
            </ToastProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}

function TailwindIndicator() {
  if (env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-foreground p-3 font-mono text-background text-xs">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
