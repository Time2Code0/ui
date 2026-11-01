import { CornerUpLeftIcon, StarIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "@/registry/ui/preview-card";

export function Particle() {
  return (
    <PreviewCard>
      <PreviewCardTrigger
        render={<Button variant="ghost">ui.time2code.dev</Button>}
      />
      <PreviewCardPopup>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium text-sm">ui.time2code.dev</h4>
            <p className="text-foreground-muted text-sm">
              Beautifully designed components that you can copy and paste into
              your apps.
            </p>
          </div>
          <div className="flex items-center gap-4 text-foreground-muted text-xs">
            <div className="flex items-center gap-1">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-blue-500"
              />
              <span>TypeScript</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon className="size-3" icon={StarIcon} />
              <span>58.2k</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon className="size-3" icon={CornerUpLeftIcon} />
              <span>5.1k</span>
            </div>
          </div>
        </div>
      </PreviewCardPopup>
    </PreviewCard>
  );
}
