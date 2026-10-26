"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumb";

import { useSunburstBreadcrumbItems } from "../_charts";

export function SunburstDrillBreadcrumb() {
  const { items, zoomTo } = useSunburstBreadcrumbItems();

  return (
    <BreadcrumbList>
      {items.map((item, index) => (
        <span className="contents" key={item.id}>
          {index > 0 ? <BreadcrumbSeparator /> : null}
          <BreadcrumbItem>
            {item.isCurrent ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                render={
                  <button onClick={() => zoomTo(item.id)} type="button" />
                }
              >
                {item.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </span>
      ))}
    </BreadcrumbList>
  );
}
