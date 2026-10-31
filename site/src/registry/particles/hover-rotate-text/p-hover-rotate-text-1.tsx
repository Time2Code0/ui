import { HoverRotateText } from "@/registry/marketing/hover-rotate-text";

export function Particle() {
  return (
    <div className="flex flex-col items-center gap-4 font-semibold text-xl uppercase">
      <HoverRotateText splitBy="none" text="No split" />
      <HoverRotateText delay={100} splitBy="word" text="Split by word" />
      <HoverRotateText splitBy="char" text="Split by char" />
    </div>
  );
}
