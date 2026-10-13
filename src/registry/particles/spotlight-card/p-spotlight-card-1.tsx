import {
  SpotlightCard,
  SpotlightContainer,
} from "@/registry/marketing/spotlight-card";

const cards = [
  { description: "Every component follows WAI-ARIA.", title: "Accessible" },
  { description: "Build anything from small parts.", title: "Composable" },
  { description: "Restyle everything with tokens.", title: "Themeable" },
];

export function Particle() {
  return (
    <SpotlightContainer className="grid w-full gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <SpotlightCard className="p-px" key={card.title}>
          <div className="flex h-full flex-col gap-1 rounded-xl p-5">
            <span className="font-semibold">{card.title}</span>
            <span className="text-foreground-muted text-sm">
              {card.description}
            </span>
          </div>
        </SpotlightCard>
      ))}
    </SpotlightContainer>
  );
}
