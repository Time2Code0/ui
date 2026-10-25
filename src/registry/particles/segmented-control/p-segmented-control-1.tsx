"use client";

import { type MouseEvent, useCallback, useState } from "react";

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#activity", label: "Activity" },
  { href: "#settings", label: "Settings" },
];

export default function Particle() {
  const [current, setCurrent] = useState("#overview");

  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    setCurrent(event.currentTarget.getAttribute("href") ?? "#overview");
  }, []);

  return (
    <SegmentedControl aria-label="Project sections" render={<nav />}>
      {links.map((link) => (
        <SegmentedControlItem
          key={link.href}
          render={
            <a
              aria-current={link.href === current ? "page" : undefined}
              href={link.href}
              onClick={handleClick}
            />
          }
        >
          {link.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
