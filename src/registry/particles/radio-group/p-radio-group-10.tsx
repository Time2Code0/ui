"use client";

import { RadioGroup, RadioPrimitive } from "@/registry/ui/radio-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";

const palettes = [
  { colors: ["#18181B", "#A1A1AA", "#FAFAFA"], label: "Mono", value: "mono" },
  {
    colors: ["#AA8F73", "#C8B79A", "#889FA3"],
    label: "Porcelain",
    value: "porcelain",
  },
  { colors: ["#B94724", "#DB8649", "#EDD0A0"], label: "Ember", value: "ember" },
  { colors: ["#A64F3C", "#C78F70", "#896577"], label: "Terra", value: "terra" },
  { colors: ["#9B3F60", "#C98693", "#E9B9A5"], label: "Rosé", value: "rose" },
  { colors: ["#BE835B", "#8E7C9F", "#6E97AE"], label: "Dusk", value: "dusk" },
  {
    colors: ["#63794B", "#ADA66B", "#83A18A"],
    label: "Orchard",
    value: "orchard",
  },
  {
    colors: ["#326A76", "#C97868", "#C9AD81"],
    label: "Petrol",
    value: "petrol",
  },
  {
    colors: ["#247E92", "#4CAFA3", "#B6D8C7"],
    label: "Lagoon",
    value: "lagoon",
  },
  {
    colors: ["#267F69", "#527FB8", "#9A83BF"],
    label: "Borealis",
    value: "borealis",
  },
  {
    colors: ["#244E9A", "#607DA9", "#B5C9DD"],
    label: "Cobalt",
    value: "cobalt",
  },
  { colors: ["#7361A3", "#AC87A5", "#DBC3CA"], label: "Iris", value: "iris" },
];

export function Particle() {
  return (
    <fieldset className="w-full space-y-3">
      <legend className="font-medium text-sm">Color palette</legend>
      <TooltipProvider>
        <RadioGroup
          aria-label="Color palette"
          className="grid grid-cols-4 gap-2"
          defaultValue="dusk"
        >
          {palettes.map((palette) => (
            <Tooltip disableHoverablePopup key={palette.value}>
              <TooltipTrigger
                render={
                  <RadioPrimitive.Root
                    aria-label={palette.label}
                    className="flex items-center justify-center rounded-lg border p-2.5 outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-background data-checked:border-foreground/48 data-checked:bg-accent/50"
                    value={palette.value}
                  />
                }
              >
                <span aria-hidden="true" className="flex shrink-0 -space-x-1">
                  {palette.colors.map((color) => (
                    <span
                      className="size-4 rounded-full ring-1 ring-background"
                      key={color}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </TooltipTrigger>
              <TooltipPopup>{palette.label}</TooltipPopup>
            </Tooltip>
          ))}
        </RadioGroup>
      </TooltipProvider>
    </fieldset>
  );
}
