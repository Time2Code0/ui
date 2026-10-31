import { Pill } from "@/registry/marketing/pill";

export function Particle() {
  return (
    <div className="flex flex-col items-center gap-4 text-sm">
      <Pill>Introducing our new design system</Pill>
      <Pill animate>Now with animated borders</Pill>
    </div>
  );
}
