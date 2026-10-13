import { Body, Container, Item } from "@/registry/marketing/tilt-card";

export function Particle() {
  return (
    <Container containerClassName="py-0">
      <Body className="relative flex h-80 w-72 flex-col gap-4 rounded-xl border bg-background p-6">
        <Item className="font-semibold text-xl" translateZ={50}>
          Tilt Card
        </Item>
        <Item className="text-foreground-muted text-sm" translateZ={60}>
          Move your cursor over the card. Each item floats at its own depth.
        </Item>
        <Item
          className="mt-auto h-32 w-full rounded-lg bg-linear-to-br from-primary to-secondary"
          translateZ={100}
        />
      </Body>
    </Container>
  );
}
