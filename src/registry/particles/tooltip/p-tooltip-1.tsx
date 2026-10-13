import { Button } from "@/registry/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

export function Particle() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipPopup>Helpful hint</TooltipPopup>
    </Tooltip>
  );
}
