import { ShinyText } from "@/registry/marketing/shiny-text";

export function Particle() {
  return (
    <div className="flex flex-col items-center gap-4 font-medium text-lg">
      <ShinyText>✨ Introducing our new design system</ShinyText>
      <ShinyText onlyOnHover>Hover me to shine</ShinyText>
    </div>
  );
}
