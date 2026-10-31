import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <Grid.System>
      <Grid columns={12} rows={3}>
        <Grid.Cell column="1/3" row="1/3" solid>
          1
        </Grid.Cell>
        <Grid.Cell column="2/4" row="2/4">
          2
        </Grid.Cell>
        <Grid.Cell column="3/10" row="2/4">
          Cells without solid sit on top of the guides and can overlap other
          cells.
        </Grid.Cell>
        <Grid.Cell column="7/12" row="1/2" solid>
          3
        </Grid.Cell>
        <Grid.Cell column="11/13" row="1/3" solid>
          4
        </Grid.Cell>
      </Grid>
    </Grid.System>
  );
}
