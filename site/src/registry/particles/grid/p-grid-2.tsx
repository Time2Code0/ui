import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <Grid.System>
      <Grid columns={{ lg: 3, md: 2, xs: 1 }} rows={{ lg: 2, md: 3, xs: 6 }}>
        <Grid.Cell>1</Grid.Cell>
        <Grid.Cell>2</Grid.Cell>
        <Grid.Cell>3</Grid.Cell>
        <Grid.Cell>4</Grid.Cell>
        <Grid.Cell>5</Grid.Cell>
        <Grid.Cell>6</Grid.Cell>
      </Grid>
    </Grid.System>
  );
}
