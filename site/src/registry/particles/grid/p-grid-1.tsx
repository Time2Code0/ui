"use client";

import { useState } from "react";

import { Grid } from "@/registry/ui/grid";
import { Label } from "@/registry/ui/label";
import { Switch } from "@/registry/ui/switch";

export function Particle() {
  const [debug, setDebug] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Label>
        <Switch checked={debug} onCheckedChange={setDebug} />
        Debug mode
      </Label>
      <Grid.System debug={debug}>
        <Grid columns={3} rows={2}>
          <Grid.Cell>1</Grid.Cell>
          <Grid.Cell>2</Grid.Cell>
          <Grid.Cell>3</Grid.Cell>
          <Grid.Cell>4</Grid.Cell>
          <Grid.Cell>5</Grid.Cell>
          <Grid.Cell>6</Grid.Cell>
        </Grid>
      </Grid.System>
    </div>
  );
}
