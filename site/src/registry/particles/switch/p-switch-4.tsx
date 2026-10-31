import { useId } from "react";

import { Label } from "@/registry/ui/label";
import { Switch } from "@/registry/ui/switch";

export function Particle() {
  const id = useId();

  return (
    <Label
      className="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-foreground/48 has-data-checked:bg-accent/50"
      htmlFor={id}
    >
      <div className="flex flex-col gap-1">
        <p>Enable notifications</p>
        <p className="text-foreground-muted text-xs">
          You can enable or disable notifications at any time.
        </p>
      </div>
      <Switch
        className="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
        defaultChecked
        id={id}
      />
    </Label>
  );
}
