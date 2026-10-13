import { Label } from "@/registry/ui/label";
import { Radio, RadioGroup } from "@/registry/ui/radio-group";

export function Particle() {
  return (
    <RadioGroup defaultValue="r-1">
      <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-foreground/48 has-data-checked:bg-accent/50">
        <Radio value="r-1" />
        <div className="flex flex-col gap-1">
          <p>Email</p>
          <p className="text-foreground-muted text-xs">
            Receive notifications via email.
          </p>
        </div>
      </Label>
      <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-foreground/48 has-data-checked:bg-accent/50">
        <Radio value="r-2" />
        <div className="flex flex-col gap-1">
          <p>SMS</p>
          <p className="text-foreground-muted text-xs">
            Receive notifications via text message.
          </p>
        </div>
      </Label>
    </RadioGroup>
  );
}
