"use client";

import {
  Bar,
  BarChart,
  BarXAxis,
  ChartTooltip,
  Grid,
  Line,
  LineChart,
  XAxis,
} from "../_charts";

const chartData = [
  {
    date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    pageviews: 4500,
    users: 1200,
  },
  {
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    pageviews: 5100,
    users: 1450,
  },
  {
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    pageviews: 4900,
    users: 1380,
  },
  {
    date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    pageviews: 5800,
    users: 1620,
  },
  {
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    pageviews: 6800,
    users: 1850,
  },
  {
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    pageviews: 6400,
    users: 1750,
  },
  {
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    pageviews: 7800,
    users: 2100,
  },
  {
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    pageviews: 8700,
    users: 2320,
  },
];

const barData = [
  { month: "Jan", revenue: 12_000 },
  { month: "Feb", revenue: 15_500 },
  { month: "Mar", revenue: 11_000 },
  { month: "Apr", revenue: 18_500 },
  { month: "May", revenue: 16_800 },
  { month: "Jun", revenue: 21_200 },
];

export function TooltipDefaultDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}

export function TooltipCrosshairOnlyDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip showDatePill={false} showDots={false} />
      </LineChart>
    </div>
  );
}

export function TooltipMinimalDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip
          showCrosshair={false}
          showDatePill={false}
          showDots={false}
        />
      </LineChart>
    </div>
  );
}

export function TooltipCustomRowsDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
        <XAxis />
        <ChartTooltip
          rows={(point) => [
            {
              color: "var(--chart-line-primary)",
              label: "Active Users",
              value: (point.users as number)?.toLocaleString() ?? "0",
            },
            {
              color: "var(--chart-line-secondary)",
              label: "Page Views",
              value: (point.pageviews as number)?.toLocaleString() ?? "0",
            },
          ]}
        />
      </LineChart>
    </div>
  );
}

export function TooltipBarChartDemo() {
  return (
    <div className="w-full">
      <BarChart data={barData} xDataKey="month">
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="var(--chart-line-primary)"
          lineCap="round"
        />
        <BarXAxis />
        <ChartTooltip
          rows={(point) => [
            {
              color: "var(--chart-line-primary)",
              label: "Revenue",
              value: `$${((point.revenue as number) ?? 0).toLocaleString()}`,
            },
          ]}
        />
      </BarChart>
    </div>
  );
}

const crosshairLineProps = {
  showDatePill: false,
  showDots: false,
} as const;

export function TooltipSolidCrosshairDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip
          {...crosshairLineProps}
          indicatorColor="var(--chart-2)"
          indicatorFadeEdges="none"
        />
      </LineChart>
    </div>
  );
}

export function TooltipCrosshairFadeTopDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip
          {...crosshairLineProps}
          indicatorColor="var(--chart-2)"
          indicatorFadeEdges="top"
          indicatorFadeLength={22}
        />
      </LineChart>
    </div>
  );
}

export function TooltipDashedCrosshairDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip
          {...crosshairLineProps}
          indicatorColor="var(--chart-2)"
          indicatorDasharray="6,4"
        />
      </LineChart>
    </div>
  );
}

export function TooltipMatchCrosshairDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip matchCrosshair />
      </LineChart>
    </div>
  );
}

export function TooltipPanelDampingDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip damping={55} indicatorColor="var(--chart-2)" />
      </LineChart>
    </div>
  );
}

export function TooltipCustomContentDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
        <XAxis />
        <ChartTooltip
          content={({ point }) => (
            <div className="flex flex-col gap-2 p-3">
              <div className="font-medium text-sm">
                {point.date instanceof Date
                  ? point.date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      weekday: "short",
                    })
                  : "—"}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-zinc-400">Users</span>
                <span className="font-mono">
                  {(point.users as number)?.toLocaleString()}
                </span>
                <span className="text-zinc-400">Views</span>
                <span className="font-mono">
                  {(point.pageviews as number)?.toLocaleString()}
                </span>
                <span className="text-zinc-400">Ratio</span>
                <span className="font-mono">
                  {(
                    (point.pageviews as number) / (point.users as number)
                  ).toFixed(2)}
                  x
                </span>
              </div>
            </div>
          )}
        />
      </LineChart>
    </div>
  );
}
