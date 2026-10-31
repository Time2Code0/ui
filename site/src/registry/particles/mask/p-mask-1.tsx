"use client";

import { Marquee } from "@/registry/marketing/marquee";
import { Mask, masks } from "@/registry/marketing/mask";

const words = ["Fast", "Accessible", "Composable", "Themeable", "Typed"];

export function Particle() {
  return (
    <Mask
      className="w-full max-w-lg overflow-hidden"
      image={masks.linear({ direction: "to-right", opacities: [0, 1, 1, 0] })}
    >
      <Marquee>
        {words.map((word) => (
          <span
            className="rounded-full border px-4 py-2 font-medium text-sm"
            key={word}
          >
            {word}
          </span>
        ))}
      </Marquee>
    </Mask>
  );
}
