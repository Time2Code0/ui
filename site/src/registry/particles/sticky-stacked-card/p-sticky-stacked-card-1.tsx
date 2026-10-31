import { Root, StackedCard } from "@/registry/marketing/sticky-stacked-card";

const steps = [
  { description: "Install the components you need.", title: "Install" },
  { description: "Adapt them to your design tokens.", title: "Customize" },
  { description: "Ship your product with confidence.", title: "Ship" },
];

export function Particle() {
  return (
    <Root className="w-full max-w-md">
      {steps.map((step, index) => (
        <StackedCard className="h-56 p-8" index={index + 1} key={step.title}>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-foreground-muted text-sm">
              0{index + 1}
            </span>
            <span className="font-semibold text-2xl">{step.title}</span>
            <span className="text-foreground-muted">{step.description}</span>
          </div>
        </StackedCard>
      ))}
    </Root>
  );
}
