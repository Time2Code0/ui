import { Button } from "@/registry/ui/button";
import { Spinner } from "@/registry/ui/loading";

export function Particle() {
  return (
    <Button disabled>
      <Spinner />
      Loading...
    </Button>
  );
}
