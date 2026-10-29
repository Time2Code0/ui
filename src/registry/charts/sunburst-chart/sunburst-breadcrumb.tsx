"use client";

import type { Focus } from "./sunburst";

import { memo, type ReactNode, useMemo } from "react";

import { useSunburstStable } from "./sunburst-context";

export interface SunburstBreadcrumbItem {
  id: string;
  isCurrent: boolean;
  label: string;
}

export function useSunburstBreadcrumbItems() {
  const { data, focus, focusById, rootId, zoomTo } = useSunburstStable();
  const rootName = data.name;

  const items = useMemo((): SunburstBreadcrumbItem[] => {
    const crumbs: Focus[] = [];
    let cur: Focus | undefined = focus;
    while (cur) {
      crumbs.unshift(cur);
      cur = cur.parentId ? focusById.get(cur.parentId) : undefined;
    }

    return crumbs.map((c, index) => ({
      id: c.id,
      isCurrent: index === crumbs.length - 1,
      label: c.id === rootId ? rootName : c.name,
    }));
  }, [rootName, focus, focusById, rootId]);

  return { items, zoomTo };
}

export interface SunburstBreadcrumbProps {
  /** Breadcrumb UI composed from chart context */
  children: ReactNode;
  /** Nav wrapper class @default "mb-4" */
  className?: string;
}

export const SunburstBreadcrumb = memo(function SunburstBreadcrumb({
  className,
  children,
}: SunburstBreadcrumbProps) {
  return (
    <nav aria-label="Drill-down path" className={className ?? "mb-4"}>
      {children}
    </nav>
  );
});

SunburstBreadcrumb.displayName = "SunburstBreadcrumb";
