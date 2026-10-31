import { useId } from "react";

import { Label } from "@/registry/ui/label";
import { Textarea } from "@/registry/ui/textarea";

export function Particle() {
  const id = useId();
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id}>Message</Label>
      <Textarea id={id} placeholder="Type your message here" />
    </div>
  );
}
