export type DemoId =
  | "sign-up"
  | "verify"
  | "members"
  | "command"
  | "tasks"
  | "schedule"
  | "plans"
  | "checkout"
  | "usage"
  | "waitlist"
  | "changelog"
  | "proof";

export const LANE = 360;
export const GAP = 16;
export const WIDE = LANE * 2 + GAP;

export const demoSizes: Record<DemoId, { height: number; wide?: boolean }> = {
  changelog: { height: 452 },
  checkout: { height: 516 },
  command: { height: 392 },
  members: { height: 424, wide: true },
  plans: { height: 472 },
  proof: { height: 372, wide: true },
  schedule: { height: 516 },
  "sign-up": { height: 564 },
  tasks: { height: 440, wide: true },
  usage: { height: 380, wide: true },
  verify: { height: 348 },
  waitlist: { height: 356 },
};

type TileSpec = DemoId | { demo: DemoId; live: true };

interface Lane {
  /** Bottom-align a short lane with its taller neighbour. */
  align?: "end";
  stack: TileSpec[];
}

type Band =
  | {
      lanes: Lane[];
      /** Which lane sets the band height. Defaults to the tallest. */
      advance?: number;
    }
  | { wide: TileSpec };

interface Column {
  bands: Band[];
  top: number;
  x: number;
}

const live = (demo: DemoId) => ({ demo, live: true }) as const;

/*
 * Five columns: a single-lane spine (b) with a two-lane column on each side,
 * and filler columns at the far edges so the backdrop never runs out.
 */
const columns: Record<string, Column> = {
  a: {
    bands: [
      {
        lanes: [{ stack: ["changelog"] }, { align: "end", stack: ["command"] }],
      },
      { wide: live("members") },
      {
        lanes: [
          { stack: ["schedule", "verify", "changelog"] },
          { stack: ["waitlist", "sign-up", "command"] },
        ],
      },
      { wide: live("proof") },
      { lanes: [{ stack: ["checkout"] }, { stack: ["waitlist"] }] },
    ],
    top: -40,
    x: 0,
  },
  b: {
    bands: [
      {
        lanes: [
          {
            stack: [
              "checkout",
              live("sign-up"),
              live("verify"),
              live("plans"),
              live("checkout"),
              live("waitlist"),
              "verify",
            ],
          },
        ],
      },
    ],
    top: -480,
    x: WIDE + GAP,
  },
  c: {
    bands: [
      {
        lanes: [
          { stack: ["plans", live("command")] },
          { stack: ["waitlist", live("schedule")] },
        ],
      },
      { wide: live("tasks") },
      {
        lanes: [
          { stack: ["schedule", "verify"] },
          { stack: ["plans", "command"] },
        ],
      },
      { wide: live("usage") },
      { lanes: [{ stack: [live("changelog")] }, { stack: ["schedule"] }] },
    ],
    top: -620,
    x: WIDE + GAP + LANE + GAP,
  },
  d: {
    bands: [
      { lanes: [{ stack: ["verify", "command"] }, { stack: ["sign-up"] }] },
      { wide: "members" },
      {
        lanes: [
          { stack: ["checkout", "verify"] },
          { stack: ["command", "plans"] },
        ],
      },
      { wide: "proof" },
    ],
    top: -380,
    x: 2 * (WIDE + GAP) + LANE + GAP,
  },
  z: {
    bands: [
      {
        lanes: [
          { stack: ["plans", "verify"] },
          { align: "end", stack: ["command", "waitlist"] },
        ],
      },
      { wide: "usage" },
      {
        lanes: [
          { stack: ["schedule", "sign-up"] },
          { stack: ["checkout", "changelog"] },
        ],
      },
    ],
    top: -260,
    x: -(WIDE + GAP),
  },
};

export interface Tile {
  demo: DemoId;
  height: number;
  key: string;
  live: boolean;
  width: number;
  x: number;
  y: number;
}

const specDemo = (spec: TileSpec) =>
  typeof spec === "string" ? spec : spec.demo;
const specLive = (spec: TileSpec) => typeof spec !== "string";

/*
 * Every lane is topped up with filler past these edges, so even the outermost
 * demos sit in an endless field. They cover the widest, tallest stage the
 * camera can show around the highest and lowest live tiles.
 */
const WORLD_TOP = -360;
const WORLD_BOTTOM = 3140;

/** Narrow demos to top lanes up with, cycled from a different start per lane. */
const filler: DemoId[] = [
  "plans",
  "verify",
  "schedule",
  "waitlist",
  "checkout",
  "command",
  "changelog",
  "sign-up",
];

function layoutColumn(name: string, column: Column, order: number): Tile[] {
  const tiles: Tile[] = [];
  const counts = new Map<DemoId, number>();
  let y = column.top;

  const laneCount = Math.max(
    ...column.bands.map((band) => ("wide" in band ? 2 : band.lanes.length))
  );
  /** The first and last tile in each lane, where the filler attaches. */
  const ends = Array.from({ length: laneCount }, () => ({
    first: null as Tile | null,
    last: null as Tile | null,
  }));

  // Bands run top to bottom, so a lane's tiles always arrive in order.
  const push = (
    spec: TileSpec,
    x: number,
    top: number,
    width: number,
    lanes: number[]
  ) => {
    const demo = specDemo(spec);
    const n = counts.get(demo) ?? 0;
    counts.set(demo, n + 1);
    const tile = {
      demo,
      height: demoSizes[demo].height,
      key: `${name}:${demo}:${n}`,
      live: specLive(spec),
      width,
      x,
      y: top,
    };
    tiles.push(tile);
    for (const lane of lanes) {
      ends[lane].first ??= tile;
      ends[lane].last = tile;
    }
    return tile;
  };

  for (const band of column.bands) {
    if ("wide" in band) {
      push(band.wide, column.x, y, WIDE, [0, 1]);
      y += demoSizes[specDemo(band.wide)].height + GAP;
      continue;
    }

    const heights = band.lanes.map(({ stack }) =>
      stack.reduce(
        (sum, spec) => sum + demoSizes[specDemo(spec)].height + GAP,
        -GAP
      )
    );
    const tallest = Math.max(...heights);

    band.lanes.forEach(({ align, stack }, index) => {
      let top = y + (align === "end" ? tallest - heights[index] : 0);
      for (const spec of stack) {
        push(spec, column.x + index * (LANE + GAP), top, LANE, [index]);
        top += demoSizes[specDemo(spec)].height + GAP;
      }
    });

    y += (band.advance === undefined ? tallest : heights[band.advance]) + GAP;
  }

  ends.forEach(({ first, last }, lane) => {
    if (!(first && last)) {
      return;
    }
    const x = column.x + lane * (LANE + GAP);
    let cursor = order * 3 + lane * 5;
    // Skip the demo the new tile would touch, so no lane repeats itself.
    const next = (neighbour: DemoId) => {
      let demo = filler[cursor % filler.length];
      cursor += 1;
      if (demo === neighbour) {
        demo = filler[cursor % filler.length];
        cursor += 1;
      }
      return demo;
    };

    let above = first;
    while (above.y > WORLD_TOP) {
      const demo = next(above.demo);
      above = push(demo, x, above.y - GAP - demoSizes[demo].height, LANE, []);
    }

    let below = last;
    while (below.y + below.height < WORLD_BOTTOM) {
      const demo = next(below.demo);
      below = push(demo, x, below.y + below.height + GAP, LANE, []);
    }
  });

  return tiles;
}

const laidOut = Object.entries(columns).flatMap(([name, column], index) =>
  layoutColumn(name, column, index)
);

export const liveTiles = laidOut.filter((tile) => tile.live);

/*
 * How far the camera can see from a live tile's centre: half the widest stage
 * across, and half a phone stage zoomed out to fit a wide tile down.
 */
const REACH_X = 720;
const REACH_Y = 640;

/** Every backdrop render is a full demo, so drop the ones the camera never reaches. */
export const tiles: Tile[] = laidOut.filter((tile) =>
  liveTiles.some((target) => {
    const dx = Math.abs(
      tile.x + tile.width / 2 - (target.x + target.width / 2)
    );
    const dy = Math.abs(
      tile.y + tile.height / 2 - (target.y + target.height / 2)
    );
    return dx < REACH_X + tile.width / 2 && dy < REACH_Y + tile.height / 2;
  })
);

export const targets = Object.fromEntries(
  liveTiles.map((tile) => [
    tile.demo,
    {
      height: tile.height,
      width: tile.width,
      x: tile.x + tile.width / 2,
      y: tile.y + tile.height / 2,
    },
  ])
) as Record<DemoId, { height: number; width: number; x: number; y: number }>;
