import { DownloadIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Button>
      <Icon aria-hidden="true" icon={DownloadIcon} />
      Download
    </Button>
  );
}
