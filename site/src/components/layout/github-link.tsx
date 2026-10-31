import { Suspense } from "react";
import { cacheLife } from "next/cache";

import { GithubIcon } from "@hugeicons/core-free-icons";

import { siteConfig } from "@/lib/config";
import { buttonVariants } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";
import { Skeleton } from "@/registry/ui/skeleton";

export function GitHubLink() {
  return (
    <Link
      className={buttonVariants({ variant: "ghost" })}
      href={siteConfig.socials.github}
    >
      <Icon icon={GithubIcon} />
      <span className="text-foreground-muted text-xs tabular-nums empty:hidden max-sm:sr-only">
        <Suspense fallback={<Skeleton className="h-4 w-[25.5px]" />}>
          <StarsCount />
        </Suspense>
      </span>
    </Link>
  );
}

async function getStarsCount() {
  "use cache";
  cacheLife("days");

  try {
    const res = await fetch("https://api.github.com/repos/time2code0/ui");

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const json = (await res.json()) as { stargazers_count?: unknown };
    const starsCount = json.stargazers_count;

    if (typeof starsCount !== "number" || starsCount < 0) {
      throw new Error("Invalid stars count");
    }

    return starsCount;
  } catch {
    return null;
  }
}

async function StarsCount() {
  const starsCount = await getStarsCount();

  // Render nothing when GitHub API is unavailable or repo doesn't exist
  if (starsCount === null) {
    return null;
  }

  return starsCount >= 1000
    ? `${(starsCount / 1000).toFixed(1)}k`
    : starsCount.toLocaleString();
}
