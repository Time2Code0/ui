import { ChevronDownIcon } from "@hugeicons/core-free-icons";

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Collapsible>
      <CollapsibleTrigger className="inline-flex items-center gap-2 font-medium text-sm data-panel-open:[&_svg]:rotate-180">
        Show recovery keys
        <Icon className="size-4" icon={ChevronDownIcon} />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <ul className="flex flex-col gap-1 py-2 text-foreground-muted text-sm">
          <li className="rounded-sm bg-background-muted px-2 py-1 font-mono">
            4829-1735-6621
          </li>
          <li className="rounded-sm bg-background-muted px-2 py-1 font-mono">
            9182-6407-5532
          </li>
          <li className="rounded-sm bg-background-muted px-2 py-1 font-mono">
            3051-7924-9018
          </li>
        </ul>
      </CollapsiblePanel>
    </Collapsible>
  );
}
