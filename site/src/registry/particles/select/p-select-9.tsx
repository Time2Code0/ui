"use client";

import {
  SourceCodeIcon as Code2Icon,
  GlobeIcon,
  LayersIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";

const items = [
  { icon: LayersIcon, label: "Components", value: "components" },
  { icon: ZapIcon, label: "Performance", value: "performance" },
  { icon: GlobeIcon, label: "Network", value: "network" },
  { icon: Code2Icon, label: "Development", value: "development" },
];

export function Particle() {
  return (
    <Select
      aria-label="Select category"
      defaultValue={items[0]}
      itemToStringValue={(item) => item.value}
    >
      <SelectTrigger>
        <SelectValue>
          {(item) => (
            <span className="flex items-center gap-2">
              <Icon icon={item.icon} />
              <span className="truncate">{item.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item}>
            <span className="flex items-center gap-2">
              <Icon icon={item.icon} />
              <span className="truncate">{item.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
