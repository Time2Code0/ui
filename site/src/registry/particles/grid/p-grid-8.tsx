import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <Grid.System>
      <Grid columns={3} rows={1}>
        <Grid.Cell>1</Grid.Cell>
        <Grid.Cell>2</Grid.Cell>
        <Grid.Cell>3</Grid.Cell>
      </Grid>
      <Grid.Divider />
      <Grid columns={2} rows={1}>
        <Grid.Cell>4</Grid.Cell>
        <Grid.Cell>5</Grid.Cell>
      </Grid>
    </Grid.System>
  );
}
