import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <div className="flex w-full flex-col gap-8">
      <Grid.System>
        <Grid columns={12} hideGuides="row" rows={3} />
      </Grid.System>
      <Grid.System>
        <Grid columns={12} hideGuides="column" rows={3} />
      </Grid.System>
    </div>
  );
}
