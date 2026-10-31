"use client";

import { RadioGroupPrimitive, RadioPrimitive } from "@/registry/ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";

export function Particle() {
  return (
    <SegmentedControl
      aria-label="Billing period"
      render={<RadioGroupPrimitive defaultValue="monthly" />}
      size="lg"
    >
      <SegmentedControlItem
        className="grow"
        render={<RadioPrimitive.Root value="monthly" />}
      >
        Monthly
      </SegmentedControlItem>
      <SegmentedControlItem
        className="grow"
        render={<RadioPrimitive.Root value="yearly" />}
      >
        Yearly
      </SegmentedControlItem>
    </SegmentedControl>
  );
}
