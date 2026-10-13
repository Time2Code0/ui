import { Button } from "@/registry/ui/button";

export function Particle() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button shape="full">Full</Button>
      <Button shape="default">Default</Button>
      <Button shape="none">None</Button>
    </div>
  );
}
