import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <Grid.System>
      <Grid columns={4} rows={4}>
        <Grid.Cross column={1} row={1} />
        <Grid.Cross column={5} row={1} />
        <Grid.Cross column={2} row={2} />
        <Grid.Cross column={4} row={2} />
        <Grid.Cross column={3} row={3} />
        <Grid.Cross column={2} row={4} />
        <Grid.Cross column={4} row={4} />
        <Grid.Cross column={1} row={5} />
        <Grid.Cross column={5} row={5} />
      </Grid>
    </Grid.System>
  );
}
