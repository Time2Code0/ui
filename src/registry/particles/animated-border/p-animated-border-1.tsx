import { Beam, Full, Shiny } from "@/registry/marketing/animated-border";

export function Particle() {
  return (
    <div className="flex w-72 flex-col gap-6 text-center font-medium">
      <Beam
        className="-inset-px"
        containerClassName="rounded-xl border bg-background p-4"
        size={110}
      >
        Beam
      </Beam>
      <Shiny className="rounded-xl bg-background p-4">Shiny</Shiny>
      <Full className="rounded-xl bg-background p-4">Full</Full>
    </div>
  );
}
