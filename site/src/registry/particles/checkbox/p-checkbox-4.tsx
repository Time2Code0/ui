import { Checkbox } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/label";

export function Particle() {
  return (
    <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-foreground/48 has-data-checked:bg-accent/50">
      <Checkbox defaultChecked />
      <div className="flex flex-col gap-1">
        <p>Enable notifications</p>
        <p className="text-foreground-muted text-xs">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </Label>
  );
}
