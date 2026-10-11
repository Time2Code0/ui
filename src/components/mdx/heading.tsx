"use client";

import { useCallback } from "react";

import { CopyCheckIcon, Link01Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { buttonVariants } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

type Types = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingProps<T extends Types> = Omit<React.ComponentProps<T>, "as"> & {
  as?: T;
};

export function Heading<T extends Types = "h1">({
  as,
  ...props
}: HeadingProps<T>) {
  const As = as ?? "h1";
  const { copyToClipboard, copied } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    if (!props.id) {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = props.id;
    copyToClipboard(url.toString());
  }, [copyToClipboard, props.id]);

  if (!props.id) {
    return <As {...props} />;
  }

  return (
    <As
      {...props}
      className={cn(
        "group/heading flex scroll-m-32 items-center gap-1",
        props.className
      )}
    >
      <a data-not-typeset href={`#${props.id}`}>
        {props.children}
      </a>
      <button
        aria-label="Copy Anchor Link"
        className={cn(
          buttonVariants({ size: "icon-xs", variant: "ghost" }),
          "not-typeset shrink-0 text-foreground-muted opacity-0 transition-opacity group-hover/heading:opacity-100"
        )}
        onClick={handleCopy}
        type="button"
      >
        <Icon icon={copied ? CopyCheckIcon : Link01Icon} />
      </button>
    </As>
  );
}
