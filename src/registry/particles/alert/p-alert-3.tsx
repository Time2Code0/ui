import { InfoIcon } from "@hugeicons/core-free-icons";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Alert>
      <Icon icon={InfoIcon} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="ghost">
          Dismiss
        </Button>
        <Button size="xs">Ok</Button>
      </AlertAction>
    </Alert>
  );
}
