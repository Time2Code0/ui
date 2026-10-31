import { Badge } from "@/registry/ui/badge";

export function Particle() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge shape="full">Full</Badge>
      <Badge shape="default">Default</Badge>
      <Badge shape="none">None</Badge>
    </div>
  );
}
