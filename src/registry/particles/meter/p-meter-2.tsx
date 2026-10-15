import { Meter } from "@/registry/ui/meter";

export function Particle() {
  return <Meter suppressHydrationWarning value={50} />;
}
