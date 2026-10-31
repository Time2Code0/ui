import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <Grid.System>
      <Grid
        columns={{ lg: 3, md: 2, xs: 1 }}
        fitContent
        rows={{ lg: 2, md: 3, xs: 6 }}
      >
        <Grid.Cell
          column={{ md: "1/3", xs: 1 }}
          row={{ md: 1, xs: "1/3" }}
          solid
        >
          1 + 2
        </Grid.Cell>
        <Grid.Cell>3</Grid.Cell>
        <Grid.Cell>4</Grid.Cell>
        <Grid.Cell
          column={{ lg: "2/4", md: "1/3", xs: 1 }}
          row={{ lg: 2, md: 3, xs: "5/7" }}
          solid
        >
          5 + 6
        </Grid.Cell>
      </Grid>
    </Grid.System>
  );
}
