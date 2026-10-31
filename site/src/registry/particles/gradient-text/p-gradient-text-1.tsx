import { GradientText } from "@/registry/marketing/gradient-text";

export function Particle() {
  return (
    <div className="flex flex-col items-center gap-4 font-semibold text-5xl tracking-tight">
      <GradientText>Gradient Text</GradientText>
      <GradientText animate>Animated</GradientText>
    </div>
  );
}
