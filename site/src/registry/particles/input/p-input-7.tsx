import { Button } from "@/registry/ui/button";
import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";

export function Particle() {
  return (
    <Group aria-label="Email subscription" className="gap-2">
      <Input
        aria-label="Email"
        className="flex-1"
        placeholder="you@example.com"
        type="email"
      />
      <div>
        <Button variant="outline">Send</Button>
      </div>
    </Group>
  );
}
