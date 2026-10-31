import { CircleCheckIcon } from "@hugeicons/core-free-icons";

import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Alert variant="success">
      <Icon icon={CircleCheckIcon} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
    </Alert>
  );
}
