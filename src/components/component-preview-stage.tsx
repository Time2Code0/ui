"use client";

import { Fragment, useCallback, useState } from "react";

import { RefreshIcon } from "@hugeicons/core-free-icons";

import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

export function ComponentPreviewStage({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const [key, setKey] = useState(0);

  const handleRefresh = useCallback(() => setKey((prev) => prev + 1), []);

  return (
    <div
      className="relative flex min-h-72 items-center justify-center bg-white px-4 py-12 sm:px-6 dark:bg-[oklch(0.159_0_0)]"
      data-slot="preview"
    >
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
        <OpenInV0Button name={name} />

        <Button
          aria-label="Refresh preview"
          onClick={handleRefresh}
          size="icon-sm"
          variant="ghost"
        >
          <Icon icon={RefreshIcon} />
        </Button>
      </div>

      <Fragment key={key}>{children}</Fragment>
    </div>
  );
}
