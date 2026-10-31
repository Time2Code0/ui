import { useId } from "react";

import { Checkbox } from "@/registry/ui/checkbox";
import { Label } from "@/registry/ui/label";

export function Particle() {
  const id = useId();

  return (
    <div className="flex items-start gap-2">
      <Checkbox defaultChecked id={id} />
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>Accept terms and conditions</Label>
        <p className="text-foreground-muted text-xs">
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
  );
}
