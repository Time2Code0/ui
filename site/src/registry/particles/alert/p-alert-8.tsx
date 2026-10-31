import { InformationCircleIcon } from "@hugeicons/core-free-icons";

import {
  Alert,
  AlertDescription,
  AlertFrame,
  AlertFrameAction,
  AlertFrameDescription,
  AlertFrameFooter,
  AlertTitle,
} from "@/registry/ui/alert";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <AlertFrame variant="info">
      <Alert variant="info">
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The dashboard will be read-only on Sunday between 02:00 and 04:00 UTC
          while we migrate the database.
        </AlertDescription>
      </Alert>
      <AlertFrameFooter>
        <Icon icon={InformationCircleIcon} />
        <AlertFrameDescription>No action is required.</AlertFrameDescription>
        <AlertFrameAction>
          <Button size="xs" variant="ghost">
            Learn more
          </Button>
        </AlertFrameAction>
      </AlertFrameFooter>
    </AlertFrame>
  );
}
