import { CableIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/ui/icon";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";

const items = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Astro", value: "astro" },
];

export function Particle() {
  return (
    <Select
      aria-label="Select framework with icon"
      defaultValue="next"
      items={items}
    >
      <SelectTrigger>
        <Icon aria-hidden="true" icon={CableIcon} />
        <SelectValue />
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={false}>
        {items.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
