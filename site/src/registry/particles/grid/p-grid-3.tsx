import { Grid } from "@/registry/ui/grid";

export function Particle() {
  return (
    <Grid.System>
      <Grid columns={3} fitContent rows={4}>
        <Grid.Cell column="1/2" row="1/3" solid>
          1
        </Grid.Cell>
        <Grid.Cell column="3/4" row="1/2" solid>
          2
        </Grid.Cell>
        <Grid.Cell column="2/3" row="2/4">
          3
        </Grid.Cell>
        <Grid.Cell column="1/2" row="4/5" solid>
          4
        </Grid.Cell>
        <Grid.Cell column="3/4" row="3/5" solid>
          5
        </Grid.Cell>
      </Grid>
    </Grid.System>
  );
}
