/**
 * Code shown under each docs demo on /charts/[chart]. Snippets come from the
 * bklit-ui docs MDX; demos without one show their component source.
 */
export const docsDemoCode = {
  AreaChartBrushDemo: `<ChartBrushLayout
  data={data}
  enabled
  height={72}
  brushStrip={(layout) => (
    <AreaChart data={data} animationDuration={0} status="ready">
      <Area dataKey="value" fillOpacity={0.15} animate={false} />
      <ChartBrush
        initialSelection={layout.brushSelection ?? undefined}
        onSelectionChange={layout.onBrushSelectionChange}
      />
    </AreaChart>
  )}
>
  {(layout) => (
    <AreaChart
      data={data}
      xDomain={layout.xDomain}
      xDomainSlotCount={layout.xDomainSlotCount}
      tweenYDomainOnXDomainChange
      yDomainTween
    >
      <Grid horizontal />
      <Area dataKey="value" fillOpacity={0.35} />
      <XAxis />
      <ChartTooltip />
    </AreaChart>
  )}
</ChartBrushLayout>`,
  AreaChartPatternDemo: `function AreaChartPatternDemo() {
  return (
    <div className="w-full">
      <AreaChart data={chartData}>
        <PatternLines
          height={6}
          id="area-doc-pattern"
          orientation={["diagonal"]}
          stroke="var(--chart-1)"
          strokeWidth={1}
          width={6}
        />
        <Grid horizontal />
        <PatternArea dataKey="desktop" fill="url(#area-doc-pattern)" />
        <Area dataKey="desktop" fillOpacity={0} strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}`,
  AreaChartYDomainDemo: `const [status, setStatus] = useState<"loading" | "ready">("loading");
const [loadingStyle, setLoadingStyle] = useState<"pulse" | "sweep">("pulse");

<AreaChart
  data={data}
  status={status}
  loadingLabel="Loading revenue…"
  yDomainTween
>
  <Grid
    horizontal
    loadingStroke="color-mix(in oklch, var(--chart-grid) 50%, transparent)"
    shimmer
    shimmerSync
    stroke="var(--chart-grid)"
  />
  <Area
    dataKey="revenue"
    fadeEdges
    fill="var(--chart-line-primary)"
    fillOpacity={0.35}
    loadingStroke="var(--foreground)"
    loadingStrokeOpacity={0.5}
    loadingStyle={loadingStyle}
    strokeWidth={2}
  />
</AreaChart>`,
  AreaTooltipDemo: `<AreaChart data={chartData}>
  <Grid horizontal />
  <Area dataKey="revenue" fill="var(--chart-line-primary)" fillOpacity={0.3} fadeEdges />
  <Area dataKey="costs" fill="var(--chart-line-secondary)" fillOpacity={0.3} fadeEdges />
  <XAxis />
  <AreaTooltipDemo />
</AreaChart>

function AreaTooltipDemo() {
  return (
    <ChartTooltip
      rows={(point) => [
        {
          color: "var(--chart-line-primary)",
          label: "Revenue",
          value: \`$\${(point.revenue as number)?.toLocaleString() ?? 0}\`,
        },
        {
          color: "var(--chart-line-secondary)",
          label: "Costs",
          value: \`$\${(point.costs as number)?.toLocaleString() ?? 0}\`,
        },
      ]}
    />
  );
}`,
  AxisBothDemo: `function AxisBothDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData} margin={{ left: 50 }}>
        <Grid fadeHorizontal={false} horizontal vertical />
        <Line dataKey="value" stroke="var(--chart-line-primary)" />
        <YAxis />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}`,
  AxisXOnlyDemo: `function AxisXOnlyDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="value" stroke="var(--chart-line-primary)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}`,
  AxisYOnlyDemo: `function AxisYOnlyDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData} margin={{ left: 50 }}>
        <Grid horizontal />
        <Line dataKey="value" stroke="var(--chart-line-primary)" />
        <YAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}`,
  BackgroundCrossDemo: `function BackgroundCrossDemo() {
  return (
    <div className="w-full">
      <LineChart data={chartData}>
        <Background pattern="cross" scale={1.25} />
        <Line dataKey="value" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}`,
  BackgroundDiagonalDemo: `<LineChart data={data}>
  <Background />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  BackgroundDotsDemo: `<LineChart data={data}>
  <Background pattern="dots" opacity={0.85} />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  BackgroundNoFadeDemo: `<LineChart data={data}>
  <Background pattern="horizontal" fadeHorizontal={false} fadeVertical={false} />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  BandBollingerDemo: `import { Band, withBollingerBands } from "@bklitui/ui/charts";

// Adds priceUpper / priceLower / priceSma (null during the warm-up window)
const bollingerData = withBollingerBands(data, {
  dataKey: "price",
  period: 10,
  multiplier: 2,
});

<LineChart data={bollingerData}>
  <Grid horizontal />
  <Band
    upperKey="priceUpper"
    lowerKey="priceLower"
    label="Bollinger"
    fill="var(--chart-1)"
    fillOpacity={0.12}
    strokeOpacity={0.5}
  />
  <Band
    upperKey="priceSma"
    lowerKey="priceSma"
    label="SMA"
    fill="var(--chart-1)"
    fillOpacity={0}
    stroke="var(--chart-1)"
    strokeDasharray="4,4"
    strokeOpacity={0.8}
    lowerStroke={false}
  />
  <Line dataKey="price" strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  BandEdgeStrokesDemo: `<Band
  upperKey="valueUpper"
  lowerKey="valueLower"
  fill="var(--chart-line-primary)"
  fillType="gradient"
  fillOpacity={0.3}
  upperStroke={{ strokeDasharray: "1,3", strokeWidth: 1.5 }}
  lowerStroke={false}
/>`,
  BandFadeEdgesDemo: `<Band
  upperKey="valueUpper"
  lowerKey="valueLower"
  fill="var(--chart-3)"
  fillOpacity={0.2}
  strokeDasharray="4,4"
  strokeOpacity={0.7}
  fadeEdges={{ left: true, right: true }}
  fadeSize={0.2}
/>`,
  BandFillTypeDemo: `<Band
  upperKey="valueUpper"
  lowerKey="valueLower"
  fill="var(--chart-1)"
  fillType="gradient" // "solid" | "gradient" | "pattern"
  fillOpacity={0.4}
  pattern="diagonal"
  patternOpacity={0.6}
  strokeOpacity={0.5}
/>`,
  BandRangeAreaDemo: `const data = [
  { date: new Date("2024-06-01"), low: 13, high: 22 },
  { date: new Date("2024-06-02"), low: 14, high: 24 },
  // ...
];

<LineChart data={data}>
  <Grid horizontal />
  <Band
    upperKey="high"
    lowerKey="low"
    label="Temperature"
    fill="var(--chart-1)"
    fillOpacity={0.3}
    strokeWidth={1.5}
  />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  BandRangeComboDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Band upperKey="teamAMax" lowerKey="teamAMin" label="Team A range" fill="var(--chart-1)" fillOpacity={0.18} strokeWidth={0} />
  <Band upperKey="teamBMax" lowerKey="teamBMin" label="Team B range" fill="var(--chart-3)" fillOpacity={0.18} strokeWidth={0} />
  <Line dataKey="teamA" stroke="var(--chart-1)" strokeWidth={2} />
  <Line dataKey="teamB" stroke="var(--chart-3)" strokeWidth={2} />
  <XAxis />
  <ChartTooltip />
</LineChart>
<Legend
  className="flex-row justify-center gap-6"
  items={[
    { label: "Team A", value: 0, color: "var(--chart-1)" },
    { label: "Team B", value: 0, color: "var(--chart-3)" },
  ]}
>
  <LegendItemComponent className="flex items-center gap-2">
    <LegendMarker />
    <LegendLabel />
  </LegendItemComponent>
</Legend>`,
  BandRangeDemo: `import { Band } from "@bklitui/ui/charts";

// Each row: { date, value, valueUpper, valueLower }
<LineChart data={data}>
  <Grid horizontal />
  <Band upperKey="valueUpper" lowerKey="valueLower" strokeOpacity={0.4} />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  BarChart90DaysDemo: `function BarChart90DaysDemo() {
  return (
    <div className="w-full">
      <BarChart barGap={0.1} data={dailyData} xDataKey="day">
        <Grid horizontal />
        <Bar dataKey="value" lineCap="butt" />
        <BarXAxis maxLabels={8} />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}`,
  BarChartCustomTooltipDemo: `function BarChartCustomTooltipDemo() {
  return (
    <div className="w-full">
      <BarChart data={chartData} xDataKey="month">
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
              value: \`$\${(point.revenue as number)?.toLocaleString()}\`,
            },
          ]}
        />
      </BarChart>
    </div>
  );
}`,
  BarChartGradientDemo: `function BarChartGradientDemo() {
  return (
    <div className="w-full">
      <BarChart data={chartData} xDataKey="month">
        <LinearGradient
          from="hsl(217, 91%, 60%)"
          id="barGradient"
          to="hsl(280, 87%, 65%)"
        />
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="url(#barGradient)"
          lineCap={4}
          stroke="hsl(217, 91%, 60%)"
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}`,
  BarChartHorizontalDemo: `function BarChartHorizontalDemo() {
  return (
    <div className="w-full">
      <BarChart
        aspectRatio="4 / 3"
        data={browserData}
        margin={{ left: 80 }}
        orientation="horizontal"
        xDataKey="browser"
      >
        <Grid fadeVertical horizontal={false} vertical />
        <Bar dataKey="users" fill="hsl(217, 91%, 60%)" lineCap={4} />
        <BarYAxis />
        <ChartTooltip showCrosshair={false} />
      </BarChart>
    </div>
  );
}`,
  BarChartLoadingDemo: `const [status, setStatus] = useState<"loading" | "ready">("loading");

<BarChart data={data} status={status} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" />
  <BarXAxis />
</BarChart>`,
  BarChartNarrowGapsDemo: `function BarChartNarrowGapsDemo() {
  return (
    <div className="w-full">
      <BarChart barGap={0.1} data={chartData} xDataKey="month">
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="var(--chart-line-primary)"
          lineCap="round"
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}`,
  BarChartNoGapGradientDemo: `function BarChartNoGapGradientDemo() {
  return (
    <div className="w-full">
      <BarChart barGap={0} data={chartData} xDataKey="month">
        <LinearGradient
          from="var(--chart-3)"
          id="noGapGradient"
          to="transparent"
        />
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="url(#noGapGradient)"
          lineCap="butt"
          stroke="var(--chart-3)"
        />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} showDots={false} />
        <BarHorizontalLineIndicator data={chartData} />
      </BarChart>
    </div>
  );
}`,
  BarChartPatternDemo: `function BarChartPatternDemo() {
  return (
    <div className="w-full">
      <BarChart data={chartData} xDataKey="month">
        <PatternLines
          height={8}
          id="barPattern"
          orientation={["diagonal"]}
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          width={8}
        />
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="url(#barPattern)"
          lineCap={4}
          stroke="hsl(217, 91%, 60%)"
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}`,
  BarChartProfitLossDemo: `const data = [
  { month: "Jan", profit: 4200 },
  { month: "Feb", profit: -1800 },
  { month: "Mar", profit: 2600 },
  { month: "Apr", profit: -3400 },
  // ...
];

<BarChart data={data} xDataKey="month">
  <Grid horizontal highlightRowValues={[0]} />
  <Bar dataKey="profit" lineCap={4} />
  <BarXAxis />
  <ChartTooltip />
</BarChart>`,
  BarChartStackedDemo: `function BarChartStackedDemo() {
  return (
    <div className="w-full">
      <BarChart data={stackedData} stacked stackGap={3} xDataKey="month">
        <Grid horizontal />
        <Bar
          dataKey="desktop"
          fill="hsl(217, 91%, 60%)"
          lineCap={4}
          stackGap={3}
        />
        <Bar
          dataKey="mobile"
          fill="hsl(217, 91%, 75%)"
          lineCap={4}
          stackGap={3}
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
}`,
  BarChartStackedWithLegendDemo: `function BarChartStackedWithLegendDemo() {
  return (
    <div className="w-full">
      <BarChart data={stackedData} stacked stackGap={3} xDataKey="month">
        <Grid horizontal />
        <Bar
          dataKey="desktop"
          fill="hsl(217, 91%, 60%)"
          lineCap={4}
          stackGap={3}
        />
        <Bar
          dataKey="mobile"
          fill="hsl(217, 91%, 75%)"
          lineCap={4}
          stackGap={3}
        />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
      <Legend
        className="flex-row justify-center gap-6"
        items={stackedLegendItems}
      >
        <LegendItemComponent className="flex items-center gap-2">
          <LegendMarker />
          <LegendLabel />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}`,
  CandlestickChartDemo: `function CandlestickChartDemo() {
  return (
    <div className="w-full">
      <CandlestickChart
        data={chartData}
        margin={{ top: 16, right: 16, bottom: 40, left: 16 }}
        style={{ height: 320 }}
      >
        <Candlestick fadedOpacity={0.25} />
        <ChartTooltip content={CandlestickTooltipDemo} />
        <XAxis />
      </CandlestickChart>
    </div>
  );
}`,
  ChoroplethAnalyticsDemo: `function ChoroplethAnalyticsDemo() {
  const { worldData, isLoading } = useWorldDataStandalone();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="animate-pulse text-foreground-muted">
          Loading map data...
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="text-destructive-foreground">Failed to load map data</div>
      </div>
    );
  }

  return (
    <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
      <ChoroplethFeatureComponent getFeatureColor={getVisitorColor} />
      <ChoroplethTooltip
        getFeatureValue={getVisitorValue}
        valueLabel="Unique Visitors"
      />
      <AnalyticsZoomControls />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-lg bg-background/90 p-3 text-xs backdrop-blur-sm">
        <span className="font-medium text-foreground-muted">
          Unique Visitors
        </span>
        {legendItems.map((item) => (
          <div className="flex items-center gap-2" key={item.label}>
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </ChoroplethChart>
  );
}`,
  ChoroplethDemo: `function ChoroplethDemo() {
  const { worldData, isLoading } = useWorldDataStandalone();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="animate-pulse text-foreground-muted">
          Loading map data...
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="text-destructive-foreground">Failed to load map data</div>
      </div>
    );
  }

  return (
    <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
      <ChoroplethFeatureComponent fill="var(--chart-scale-03)" />
      <ChoroplethTooltip />
      <PreviewZoomControls />
    </ChoroplethChart>
  );
}`,
  ChoroplethLinesPatternDemo: `function ChoroplethLinesPatternDemo() {
  const { worldData, isLoading } = useWorldDataStandalone();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="animate-pulse text-foreground-muted">
          Loading map data...
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="text-destructive-foreground">Failed to load map data</div>
      </div>
    );
  }

  return (
    <ChoroplethChart aspectRatio="16 / 9" data={worldData}>
      <ChoroplethFeatureComponent
        getFeaturePattern={getLinesPattern}
        patterns={linesPatterns}
      />
      <ChoroplethTooltip />
    </ChoroplethChart>
  );
}`,
  ChoroplethZoomDemo: `function ChoroplethZoomDemo() {
  const { worldData, isLoading } = useWorldDataStandalone();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="animate-pulse text-foreground-muted">
          Loading map data...
        </div>
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <div className="text-destructive-foreground">Failed to load map data</div>
      </div>
    );
  }

  return (
    <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
      <ChoroplethFeatureComponent fill="var(--chart-1)" />
      <ChoroplethTooltip />
      <ZoomControls />
    </ChoroplethChart>
  );
}`,
  CustomIndicatorDemo: `function CustomIndicatorDemo() {
  return (
    <div className="w-full">
      <BarChart barGap={0} data={chartData} xDataKey="month">
        <LinearGradient
          from="var(--chart-3)"
          id="customIndicatorGradient"
          to="transparent"
        />
        <PatternLines
          height={6}
          id="diagonalPattern"
          orientation={["diagonal"]}
          stroke="var(--chart-4)"
          strokeWidth={1.5}
          width={6}
        />
        <Grid horizontal />
        <Bar
          dataKey="revenue"
          fill="url(#customIndicatorGradient)"
          groupGap={0}
          lineCap="butt"
          stroke="var(--chart-3)"
        />
        <Bar
          dataKey="cost"
          fill="url(#diagonalPattern)"
          groupGap={0}
          lineCap="butt"
          stroke="var(--chart-4)"
        />
        <BarXAxis />
        <ChartTooltip showCrosshair={false} showDots={false} />
        <BarHorizontalLineIndicator
          data={chartData}
          dataKeys={["revenue", "cost"]}
        />
      </BarChart>
    </div>
  );
}`,
  DateHighlightsAreaDemo: `import { Deadline, Weekends } from "@bklitui/ui/charts";

<AreaChart data={data}>
  <Grid horizontal />
  <Weekends />
  <Deadline date={new Date(2026, 9, 15)} fillType="gradient" />
  <Area dataKey="completed" fill="var(--chart-1)" />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
  DateHighlightsBarDemo: `<BarChart data={data} xDataKey="date">
  <Grid horizontal />
  <Weekends />
  <Deadline date={new Date(2026, 9, 15)} label="Due" />
  <Bar dataKey="issues" lineCap={2} />
  <BarXAxis maxLabels={7} />
  <ChartTooltip />
</BarChart>`,
  DateHighlightsBrushDemo: `<ChartBrushLayout data={data} enabled height={72} brushStrip={...}>
  {(layout) => (
    <LineChart
      data={data}
      xDomain={layout.xDomain}
      xDomainSlotCount={layout.xDomainSlotCount}
      tweenYDomainOnXDomainChange
    >
      <Grid horizontal />
      <Weekends />
      <Deadline date={new Date(2026, 9, 1)} label="Launch" />
      <Line dataKey="value" />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  )}
</ChartBrushLayout>`,
  DateHighlightsComposedDemo: `<ComposedChart data={composedDemoData} barGap={0} maxBarSize={24}>
  <Grid horizontal />
  <Weekends utc />
  <Deadline date={composedDemoData[21].date} label="Quarter close" />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={3} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
  DateHighlightsLineDemo: `import { Deadline, Weekends } from "@bklitui/ui/charts";

<LineChart data={data}>
  <Grid horizontal />
  <Weekends />
  <Deadline date={new Date(2026, 9, 15)} label="Due Oct 15" />
  <Line dataKey="scope" stroke="var(--chart-4)" />
  <Line dataKey="started" stroke="var(--chart-2)" />
  <Line dataKey="completed" stroke="var(--chart-1)" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  DeadlineFillTypesDemo: `<Deadline date={dueDate} fillType="pattern" />
<Deadline date={dueDate} fillType="gradient" />
<Deadline date={dueDate} fillType="solid" />`,
  DeadlineLineDemo: `function DeadlineLineDemo() {
  return (
    <div className="w-full">
      <LineChart data={projectProgressData}>
        <Grid horizontal />
        <Deadline date={PROJECT_DUE_DATE} label="Due Oct 15" />
        <Line curve={smooth} dataKey="scope" stroke="var(--chart-4)" />
        <Line curve={smooth} dataKey="started" stroke="var(--chart-2)" />
        <Line curve={smooth} dataKey="completed" stroke="var(--chart-1)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}`,
  DiamondMarkersDemo: `import {
  AreaChart,
  Area,
  ChartTooltip,
  chartCssVars,
  Grid,
  useChart,
  XAxis,
} from "@bklitui/ui/charts";

const markers = [
  { date: new Date(2024, 0, 5), title: "Deploy" },
  { date: new Date(2024, 0, 10), title: "Pricing change" },
];

function DiamondMarkers({ items, size = 8, y = -12 }) {
  const { xScale, innerHeight, tooltipData, isLoaded } = useChart();
  const half = size / 2;

  return (
    <g
      style={{
        pointerEvents: "none",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 300ms ease-out",
      }}
    >
      {items.map((marker) => {
        const x = xScale(marker.date) ?? 0;
        const hovered = tooltipData?.point.date as Date | undefined;
        const active =
          hovered?.toDateString() === marker.date.toDateString();
        return (
          <g key={marker.date.toISOString()} transform={\`translate(\${x}, 0)\`}>
            <line
              x1={0}
              x2={0}
              y1={y + half + 4}
              y2={innerHeight}
              stroke={chartCssVars.markerBorder}
              strokeDasharray="4,4"
              strokeOpacity={active ? 1 : 0.7}
            />
            <rect
              x={-half}
              y={-half}
              width={size}
              height={size}
              transform={\`translate(0, \${y}) rotate(45)\`}
              fill={chartCssVars.foregroundMuted}
            />
          </g>
        );
      })}
    </g>
  );
}

// Render outside the series reveal clip (above the interaction overlay)
// so the diamond in the top margin isn't cut off
DiamondMarkers.__isPostOverlay = true;

<AreaChart data={data}>
  <Grid horizontal />
  <Area dataKey="value" fill="var(--chart-line-primary)" fillOpacity={0.15} />
  <DiamondMarkers items={markers} />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
  GaugeChartDemo: `function GaugeChartDemo() {
  return (
    <div className="mx-auto w-full min-w-[300px] max-w-lg py-4">
      <Gauge
        centerValue={428_000}
        defaultLabel="ARR run rate"
        formatOptions={{
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }}
        inactiveFillOpacity={0.4}
        spacing={25}
        value={66}
      />
    </div>
  );
}`,
  GridBothDemo: `<LineChart data={data}>
  <Grid horizontal vertical fadeHorizontal={false} />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  GridDenseDemo: `<LineChart data={data}>
  <Grid horizontal vertical fadeHorizontal={false} numTicksRows={10} numTicksColumns={15} />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  GridHideEdgeLinesDemo: `<LineChart data={data}>
  <Grid horizontal hideHorizontalEdgeLines />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  GridHorizontalDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  GridNoFadeDemo: `<LineChart data={data}>
  <Grid horizontal fadeHorizontal={false} />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  GridSolidDemo: `<LineChart data={data}>
  <Grid horizontal strokeDasharray="" />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  GridVerticalDemo: `<LineChart data={data}>
  <Grid horizontal={false} vertical />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  LegendHorizontalDemo: `<Legend items={data} className="flex-row flex-wrap gap-4">
  <LegendItemComponent className="flex items-center gap-2">
    <LegendMarker className="h-2 w-2" />
    <LegendLabel className="text-xs" />
  </LegendItemComponent>
</Legend>`,
  LegendProgressDemo: `<Legend items={data} title="Sessions by Channel">
  <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
    <LegendMarker />
    <LegendLabel />
    <LegendValue showPercentage />
    <div className="col-span-full">
      <LegendProgress />
    </div>
  </LegendItemComponent>
</Legend>`,
  LegendSimpleDemo: `<Legend items={data}>
  <LegendItemComponent className="flex items-center gap-3">
    <LegendMarker />
    <LegendLabel className="flex-1" />
    <LegendValue />
  </LegendItemComponent>
</Legend>`,
  LineChartBrushDemo: `<ChartBrushLayout
  data={data}
  enabled
  height={72}
  brushStrip={(layout) => (
    <LineChart data={data} animationDuration={0} status="ready">
      <Line dataKey="value" animate={false} />
      <ChartBrush
        initialSelection={layout.brushSelection ?? undefined}
        onSelectionChange={layout.onBrushSelectionChange}
      />
    </LineChart>
  )}
>
  {(layout) => (
    <LineChart
      data={data}
      xDomain={layout.xDomain}
      xDomainSlotCount={layout.xDomainSlotCount}
      tweenYDomainOnXDomainChange
      yDomainTween
    >
      <Grid horizontal />
      <Line dataKey="value" />
      <XAxis />
      <ChartTooltip />
    </LineChart>
  )}
</ChartBrushLayout>`,
  LineChartDateRangeDemo: `const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
const filteredData = useMemo(() => {
  const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
  const days = daysMap[range];
  return fullData.slice(-days);
}, [range]);

<LineChart data={filteredData} yDomainTween>
  <Grid horizontal />
  <Line dataKey="revenue" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  LineChartLoadingDemo: `function LineChartLoadingDemo() {
  return (
    <div className="w-full">
      <LineChartLoading />
    </div>
  );
}`,
  LineChartYDomainDemo: `const [status, setStatus] = useState<"loading" | "ready">("loading");
const [loadingStyle, setLoadingStyle] = useState<"pulse" | "sweep">("pulse");

<LineChart
  data={data}
  status={status}
  loadingLabel="Loading revenue…"
  yDomainTween
>
  <Grid
    horizontal
    loadingStroke="color-mix(in oklch, var(--chart-grid) 50%, transparent)"
    shimmer
    shimmerSync
    stroke="var(--chart-grid)"
  />
  <Line
    dataKey="revenue"
    fadeEdges
    loadingStroke="var(--foreground)"
    loadingStrokeOpacity={0.5}
    loadingStyle={loadingStyle}
    stroke="var(--chart-line-primary)"
  />
</LineChart>`,
  LiveLineChartDemo: `function LiveLineChartDemo() {
  const { data, value } = useLiveData(142.5, 600);
  const formatUsd = useCallback((v: number) => \`$\${v.toFixed(2)}\`, []);

  return (
    <div className="w-full">
      <LiveLineChart
        data={data}
        margin={{ top: 16, right: 16, bottom: 40, left: 56 }}
        style={{ height: 260 }}
        value={value}
        window={30}
      >
        <LiveLine
          dataKey="value"
          formatValue={formatUsd}
          stroke="var(--chart-line-primary)"
        />
        <ChartTooltip
          content={({ point }) => {
            const date = point.date instanceof Date ? point.date : new Date();
            const time = date.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            const val = typeof point.value === "number" ? point.value : 0;
            return (
              <div className="px-3 py-2.5">
                <div className="mb-1.5 font-medium text-foreground text-xs opacity-60">
                  {time}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground-muted">Price</span>
                  <span className="ml-auto font-medium text-foreground tabular-nums">
                    {formatUsd(val)}
                  </span>
                </div>
              </div>
            );
          }}
          showDatePill={false}
        />
        <LiveXAxis />
        <LiveYAxis formatValue={formatUsd} position="left" />
      </LiveLineChart>
    </div>
  );
}`,
  MarkersCompactDemo: `<LineChart data={data} margin={{ top: 24 }}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <ChartMarkers items={markers} size={20} showLines={false} animate={false} />
  <XAxis />
  <ChartTooltip>
    <MarkerContent markers={markers} />
  </ChartTooltip>
</LineChart>`,
  MarkersDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <ChartMarkers items={markers} />
  <XAxis />
  <ChartTooltip>
    <MarkerContent markers={markers} />
  </ChartTooltip>
</LineChart>`,
  PieChartBasicDemo: `function PieChartBasicDemo() {
  return (
    <PieChart data={salesData} size={240}>
      {salesData.map((item, index) => (
        <PieSlice index={index} key={item.label} />
      ))}
    </PieChart>
  );
}`,
  PieChartCustomCenterDemo: `function PieChartCustomCenterDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <PieChart
      data={salesData}
      hoveredIndex={hoveredIndex}
      innerRadius={80}
      onHoverChange={setHoveredIndex}
      size={300}
    >
      {salesData.map((item, index) => (
        <PieSlice index={index} key={item.label} />
      ))}
      <PieCenter>
        {({ value, label, isHovered, data }) => (
          <div className="text-center">
            <div
              className="font-bold text-3xl"
              style={{ color: isHovered ? data.color : undefined }}
            >
              {value.toLocaleString()}
            </div>
            <div className="text-foreground-muted text-sm">{label}</div>
            {isHovered && (
              <div className="mt-1 text-foreground-muted text-xs">
                {(
                  (data.value / salesData.reduce((s, d) => s + d.value, 0)) *
                  100
                ).toFixed(1)}
                % of total
              </div>
            )}
          </div>
        )}
      </PieCenter>
    </PieChart>
  );
}`,
  PieChartDemo: `function PieChartDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const legendItems = toLegendItems(salesData);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      {/* Pie Chart */}
      <PieChart
        data={salesData}
        hoveredIndex={hoveredIndex}
        onHoverChange={setHoveredIndex}
        size={280}
      >
        {salesData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
      </PieChart>

      {/* Legend */}
      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Sales by Category"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue showPercentage />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}`,
  PieChartDonutDemo: `function PieChartDonutDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <PieChart
      data={salesData}
      hoveredIndex={hoveredIndex}
      innerRadius={70}
      onHoverChange={setHoveredIndex}
      size={280}
    >
      {salesData.map((item, index) => (
        <PieSlice index={index} key={item.label} />
      ))}
      <PieCenter defaultLabel="Total Sales" />
    </PieChart>
  );
}`,
  PieChartDonutLegendDemo: `function PieChartDonutLegendDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const legendItems = toLegendItems(salesData);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      <PieChart
        data={salesData}
        hoveredIndex={hoveredIndex}
        innerRadius={70}
        onHoverChange={setHoveredIndex}
        size={280}
      >
        {salesData.map((item, index) => (
          <PieSlice index={index} key={item.label} />
        ))}
        <PieCenter defaultLabel="Total Sales" />
      </PieChart>

      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Sales by Category"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue showPercentage />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}`,
  PieChartGradientsDemo: `function PieChartGradientsDemo() {
  const gradientData: PieData[] = [
    { label: "Segment A", value: 40 },
    { label: "Segment B", value: 30 },
    { label: "Segment C", value: 30 },
  ];

  return (
    <PieChart data={gradientData} size={280}>
      {/* Gradient definitions */}
      <RadialGradient
        from="#0ea5e9"
        fromOffset="0%"
        id="pie-gradient-1"
        to="#06b6d4"
        toOffset="100%"
      />
      <RadialGradient
        from="#a855f7"
        fromOffset="0%"
        id="pie-gradient-2"
        to="#ec4899"
        toOffset="100%"
      />
      <RadialGradient
        from="#f59e0b"
        fromOffset="0%"
        id="pie-gradient-3"
        to="#ef4444"
        toOffset="100%"
      />

      {/* Slices with gradient fills */}
      <PieSlice fill="url(#pie-gradient-1)" index={0} />
      <PieSlice fill="url(#pie-gradient-2)" index={1} />
      <PieSlice fill="url(#pie-gradient-3)" index={2} />
    </PieChart>
  );
}`,
  PieChartHoverEffectDemo: `function PieChartHoverEffectDemo() {
  const [hoverEffect, setHoverEffect] =
    useState<PieSliceHoverEffect>("translate");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="text-foreground-muted text-sm">Hover Effect:</span>
        <Select
          onValueChange={(v) => setHoverEffect(v as PieSliceHoverEffect)}
          value={hoverEffect}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="translate">Translate</SelectItem>
            <SelectItem value="grow">Grow</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectPopup>
        </Select>
      </div>

      <PieChart data={salesData} size={280}>
        {salesData.map((item, index) => (
          <PieSlice hoverEffect={hoverEffect} index={index} key={item.label} />
        ))}
      </PieChart>
    </div>
  );
}`,
  PieChartPatternsDemo: `function PieChartPatternsDemo() {
  const patternData: PieData[] = [
    { label: "Category A", value: 35 },
    { label: "Category B", value: 25 },
    { label: "Category C", value: 20 },
    { label: "Category D", value: 20 },
  ];

  return (
    <PieChart data={patternData} size={280}>
      {/* Pattern definitions */}
      <PatternLines
        height={6}
        id="pie-pattern-1"
        orientation={["diagonal"]}
        stroke="var(--chart-1)"
        strokeWidth={1}
        width={6}
      />
      <PatternLines
        height={6}
        id="pie-pattern-2"
        orientation={["horizontal"]}
        stroke="var(--chart-2)"
        strokeWidth={1}
        width={6}
      />
      <PatternLines
        height={6}
        id="pie-pattern-3"
        orientation={["vertical"]}
        stroke="var(--chart-3)"
        strokeWidth={1}
        width={6}
      />
      <PatternLines
        height={8}
        id="pie-pattern-4"
        orientation={["diagonalRightToLeft"]}
        stroke="var(--chart-4)"
        strokeWidth={1}
        width={8}
      />

      {/* Slices with pattern fills */}
      <PieSlice fill="url(#pie-pattern-1)" index={0} />
      <PieSlice fill="url(#pie-pattern-2)" index={1} />
      <PieSlice fill="url(#pie-pattern-3)" index={2} />
      <PieSlice fill="url(#pie-pattern-4)" index={3} />
    </PieChart>
  );
}`,
  ProfitLossLineDemo: `function ProfitLossLineDemo() {
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <LineChart data={profitLossLineDocsData}>
        <Grid
          highlightRowStroke="var(--foreground)"
          highlightRowStrokeOpacity={0.35}
          highlightRowValues={[0]}
          horizontal
        />
        <Line
          curve={curveLinear}
          dataKey={PROFIT_LOSS_DATA_KEY}
          fadeEdges={false}
          showHighlight={false}
          stroke="transparent"
          strokeWidth={0}
        />
        <ProfitLossLegendHoverProvider hoveredIndex={legendHoveredIndex}>
          <ProfitLossLine dataKey={PROFIT_LOSS_DATA_KEY} />
        </ProfitLossLegendHoverProvider>
        <XAxis />
        <ChartTooltip
          indicatorColor={(point) =>
            profitLossColor((point[PROFIT_LOSS_DATA_KEY] as number) ?? 0)
          }
          rows={(point) => {
            const value = (point[PROFIT_LOSS_DATA_KEY] as number) ?? 0;
            return [
              {
                color: profitLossColor(value),
                label: resolveProfitLossTooltipLabel(""),
                value,
              },
            ];
          }}
        />
      </LineChart>
      <ProfitLossLegend
        align="center"
        hoveredIndex={legendHoveredIndex}
        onHoverChange={setLegendHoveredIndex}
      />
    </div>
  );
}`,
  ProjectionLineGradientDemo: `  <ProjectionLine
    data={projectionPath}
    strokeStyle="gradient"
    gradientStart="oklch(0.926 0.128 16.866 / 0.73)"
    gradientEnd="oklch(0.849 0.232 16.498)"
    curveKind="bezier"
    strokeDasharray="1,4"
  />`,
  RadarChartBasicDemo: `function RadarChartBasicDemo() {
  return (
    <RadarChart data={campaignData} metrics={metrics} size={350}>
      <RadarGrid />
      <RadarAxis />
      <RadarLabels />
      {campaignData.map((item, index) => (
        <RadarArea index={index} key={item.label} />
      ))}
    </RadarChart>
  );
}`,
  RadarChartDemo: `function RadarChartDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Convert radar data to legend items
  const legendItems: LegendItemData[] = campaignData.map((d, index) => ({
    label: d.label,
    value: Object.values(d.values).reduce((a, b) => a + b, 0) / metrics.length,
    maxValue: 100,
    color: d.color ?? \`var(--chart-\${index + 1})\`,
  }));

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      {/* Chart */}
      <RadarChart
        className="w-full max-w-[400px] lg:w-[400px] lg:shrink-0"
        data={campaignData}
        hoveredIndex={hoveredIndex}
        metrics={metrics}
        onHoverChange={setHoveredIndex}
      >
        <RadarGrid />
        <RadarAxis />
        <RadarLabels interactive />
        {campaignData.map((item, index) => (
          <RadarArea index={index} key={item.label} />
        ))}
      </RadarChart>

      {/* Legend */}
      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Campaign Performance"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue formatValue={(v) => \`\${v.toFixed(0)}%\`} />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}`,
  RadarChartMinimalDemo: `function RadarChartMinimalDemo() {
  // Simpler 3-metric example
  const simpleMetrics: RadarMetric[] = [
    { key: "speed", label: "Speed" },
    { key: "power", label: "Power" },
    { key: "technique", label: "Technique" },
  ];

  const simpleData: RadarData[] = [
    {
      label: "Player A",
      color: "#6366f1",
      values: { speed: 85, power: 70, technique: 90 },
    },
    {
      label: "Player B",
      color: "#f97316",
      values: { speed: 65, power: 95, technique: 60 },
    },
  ];

  return (
    <RadarChart data={simpleData} levels={4} metrics={simpleMetrics} size={300}>
      <RadarGrid showLabels={false} />
      <RadarAxis />
      <RadarLabels fontSize={12} offset={20} />
      {simpleData.map((item, index) => (
        <RadarArea index={index} key={item.label} />
      ))}
    </RadarChart>
  );
}`,
  ReferenceAreaBandDemo: `<LineChart data={data}>
  <Grid horizontal />
  <ReferenceArea y1={160} y2={220} strokeStyle="dashed" showMarkers />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  ReferenceAreaMarkersDemo: `<LineChart data={data}>
  <Grid horizontal />
  <ReferenceArea
    y1={160}
    y2={220}
    stroke="var(--chart-1)"
    strokeStyle="dashed"
    showMarkers
    markerColor="var(--chart-1)"
  />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  ReferenceAreaPatternDemo: `<LineChart data={data}>
  <Grid horizontal />
  <ReferenceArea
    y1={160}
    y2={200}
    pattern="diagonal"
    patternColor="oklch(0.76 0.144 180.392 / 0.17)"
    patternScale={0.75}
    patternStrokeWidth={1.5}
    stroke="oklch(0.841 0.142 159.667 / 0.49)"
    axisLabelColor="oklch(0.795 0.152 164.722)"
  />
  <Line dataKey="value" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  RingChartBasicDemo: `function RingChartBasicDemo() {
  return (
    <RingChart data={sessionsData} size={280}>
      {sessionsData.map((item, index) => (
        <Ring index={index} key={item.label} />
      ))}
      <RingCenter />
    </RingChart>
  );
}`,
  RingChartCustomColorsDemo: `function RingChartCustomColorsDemo() {
  const customData: RingData[] = [
    {
      label: "Revenue",
      value: 85_000,
      maxValue: 100_000,
      color: "var(--chart-1)",
    },
    {
      label: "Expenses",
      value: 62_000,
      maxValue: 100_000,
      color: "var(--chart-2)",
    },
    {
      label: "Profit",
      value: 23_000,
      maxValue: 100_000,
      color: "var(--chart-3)",
    },
  ];

  return (
    <RingChart data={customData} ringGap={8} size={240} strokeWidth={16}>
      {customData.map((item, index) => (
        <Ring index={index} key={item.label} />
      ))}
      <RingCenter
        defaultLabel="Total"
        formatOptions={{ notation: "compact" }}
        prefix="$"
      />
    </RingChart>
  );
}`,
  RingChartDemo: `function RingChartDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Convert ring data to legend items
  const legendItems: LegendItemData[] = sessionsData.map((d) => ({
    label: d.label,
    value: d.value,
    maxValue: d.maxValue,
    color: d.color || "",
  }));

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col items-center justify-center gap-8 lg:w-auto lg:flex-row lg:gap-12">
      {/* Chart */}
      <RingChart
        data={sessionsData}
        hoveredIndex={hoveredIndex}
        onHoverChange={setHoveredIndex}
        size={320}
      >
        {sessionsData.map((item, index) => (
          <Ring index={index} key={item.label} />
        ))}
        <RingCenter defaultLabel="Total Sessions" />
      </RingChart>

      {/* Composable Legend */}
      <Legend
        hoveredIndex={hoveredIndex}
        items={legendItems}
        onHoverChange={setHoveredIndex}
        title="Sessions by Channel"
      >
        <LegendItemComponent className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
          <LegendMarker />
          <LegendLabel />
          <LegendValue showPercentage />
          <div className="col-span-full">
            <LegendProgress />
          </div>
        </LegendItemComponent>
      </Legend>
    </div>
  );
}`,
  SankeyNoLabelsDemo: `function SankeyNoLabelsDemo() {
  return (
    <SankeyChart
      aspectRatio="16 / 9"
      data={analyticsData}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      nodePadding={24}
      nodeWidth={16}
    >
      <SankeyLink />
      <SankeyNode lineCap={4} showLabels={false} />
      <SankeyTooltip />
    </SankeyChart>
  );
}`,
  SankeyPatternDemo: `function SankeyPatternDemo() {
  return (
    <SankeyChart
      aspectRatio="16 / 9"
      data={analyticsData}
      nodePadding={24}
      nodeWidth={16}
    >
      <SankeyLink
        getLinkPattern={getOutcomePattern}
        patterns={outcomePatterns}
      />
      <SankeyNode lineCap={4} />
      <SankeyTooltip />
    </SankeyChart>
  );
}`,
  ScatterChartDemo: `function ScatterChartDemo() {
  return (
    <div className="w-full">
      <ScatterChart data={chartData}>
        <Grid horizontal />
        <Scatter dataKey="sessions" />
        <Scatter dataKey="conversions" />
        <XAxis />
        <ChartTooltip />
      </ScatterChart>
    </div>
  );
}`,
  ScatterJitterDemo: `function ScatterJitterDemo() {
  return (
    <div className="w-full">
      <ScatterChart
        data={prLocData}
        formatXLabel={formatPrMonth}
        jitter={{ x: 0.6 }}
        margin={{ top: 40, right: 40, bottom: 40, left: 56 }}
      >
        <Grid
          highlightRowStrokeDasharray="4,4"
          highlightRowValues={[500]}
          horizontal
        />
        <Scatter
          dataKey="fastlane"
          fill={prLocSeries.fastlane.color}
          radius={3}
        />
        <Scatter dataKey="human" fill={prLocSeries.human.color} radius={3} />
        <YAxis formatValue={formatLoc} />
        <XAxis numTicks={12} />
        <ChartTooltip content={({ point }) => <PrLocTooltip point={point} />} />
      </ScatterChart>
    </div>
  );
}`,
  SegmentDemo: `function SegmentDemo() {
  const [stats, setStats] = useState<SegmentStats | null>(null);

  const firstVal = chartData[0]?.users ?? 0;
  const lastVal = chartData.at(-1)?.users ?? 0;

  const displayValue = stats?.value ?? lastVal;
  const displayChange = stats?.change ?? lastVal - firstVal;
  const displayPct =
    stats?.changePct ??
    (firstVal > 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0);
  const isPositive = displayChange >= 0;

  const startLabel = (
    stats?.startDate ?? chartData[0]?.date
  )?.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = (
    stats?.endDate ?? chartData.at(-1)?.date
  )?.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="w-full">
      <div className="mb-4 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-2xl tabular-nums">
            {displayValue.toLocaleString()}
          </span>
          <span className="text-foreground-muted text-sm">users</span>
        </div>
        <div className="flex items-baseline gap-2 text-sm">
          <span
            className={
              isPositive ? "text-chart-positive" : "text-chart-negative"
            }
          >
            {isPositive ? "+" : ""}
            {displayChange.toLocaleString()} ({isPositive ? "+" : ""}
            {displayPct.toFixed(1)}%)
          </span>
          <span className="text-foreground-muted">
            {startLabel} &ndash; {endLabel}
          </span>
        </div>
      </div>

      <LineChart data={chartData}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <SegmentBackground />
        <SegmentLineFrom />
        <SegmentLineTo />
        <XAxis />
        <ChartTooltip />
        <SegmentBridge onSegmentChange={setStats} />
      </LineChart>
    </div>
  );
}`,
  SparklineCrosshairDemo: `function SparklineCrosshairDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 py-4 sm:grid-cols-3">
      {crosshairs.map((crosshair) => (
        <div className="flex flex-col gap-2" key={crosshair}>
          <span className="text-foreground-muted text-xs">{crosshair}</span>
          <LineSparkline
            crosshair={crosshair}
            data={revenue}
            dataKey="value"
            height={48}
          />
        </div>
      ))}
    </div>
  );
}`,
  SparklineDemo: `function SparklineDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3 py-4 sm:grid-cols-3">
      <KpiCard data={revenue} label="Revenue">
        {(hover) => (
          <AreaSparkline
            data={revenue}
            dataKey="value"
            height={40}
            {...hover.sparklineProps}
          />
        )}
      </KpiCard>
      <KpiCard data={visitors} label="Visitors">
        {(hover) => (
          <LineSparkline
            color="var(--chart-2)"
            data={visitors}
            dataKey="value"
            endDot
            height={40}
            {...hover.sparklineProps}
          />
        )}
      </KpiCard>
      <KpiCard data={orders} label="Orders">
        {(hover) => (
          <BarSparkline
            color="var(--chart-3)"
            data={orders}
            dataKey="value"
            height={40}
            {...hover.sparklineProps}
          />
        )}
      </KpiCard>
    </div>
  );
}`,
  SparklineGridDemo: `function SparklineGridDemo() {
  return (
    <div className="grid w-full grid-cols-4 gap-x-4 gap-y-2 py-4 sm:grid-cols-8">
      {Array.from({ length: 200 }, (_, i) => {
        const data = makeSparkData(i, 20, 100, (i % 7) - 3);
        const Component = gridVariants[i % 3] ?? LineSparkline;
        return (
          <Component
            color={\`var(--chart-\${(i % 5) + 1})\`}
            data={data}
            dataKey="value"
            height={24}
            key={\`spark-\${i}\`}
          />
        );
      })}
    </div>
  );
}`,
  SparklineHoverFeelDemo: `function SparklineHoverFeelDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 py-4 sm:grid-cols-3">
      {hoverFeels.map((feel) => (
        <div className="flex flex-col gap-2" key={feel.label}>
          <span className="text-foreground-muted text-xs">{feel.label}</span>
          <LineSparkline
            data={revenue}
            dataKey="value"
            height={48}
            {...feel.props}
          />
        </div>
      ))}
      <BarSparkline
        className="sm:col-span-3"
        color="var(--chart-3)"
        data={orders}
        dataKey="value"
        height={40}
        hoverTransition={false}
      />
    </div>
  );
}`,
  SparklineSyncedDemo: `function SparklineSyncedDemo() {
  const hover = useSparklineHover<SparkPoint>();
  const series = [
    { label: "Revenue", data: revenue, color: "var(--chart-1)" },
    { label: "Visitors", data: visitors, color: "var(--chart-2)" },
    {
      label: "Orders",
      data: makeSparkData(3, 24, 120, 2),
      color: "var(--chart-3)",
    },
  ];
  return (
    <div className="flex w-full max-w-md flex-col gap-3 py-4">
      {series.map((s) => (
        <div
          className="grid grid-cols-[5rem_1fr_4rem] items-center gap-3"
          key={s.label}
        >
          <span className="text-foreground-muted text-xs">{s.label}</span>
          <LineSparkline
            color={s.color}
            data={s.data}
            dataKey="value"
            height={28}
            {...hover.sparklineProps}
          />
          <span className="text-right text-sm tabular-nums">
            {formatter.format(
              s.data[hover.index ?? s.data.length - 1]?.value ?? 0
            )}
          </span>
        </div>
      ))}
    </div>
  );
}`,
  SunburstChartDemo: `function SunburstChartDemo() {
  const { arcs, rootId } = useMemo(() => buildArcs(sunburstDemoData), []);
  const [focusId, setFocusId] = useState(rootId);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  return (
    <SunburstChart
      className="mx-auto"
      data={sunburstDemoData}
      focusId={focusId}
      onFocusChange={setFocusId}
      size={440}
    >
      <SunburstBreadcrumb>
        <SunburstDrillBreadcrumb />
      </SunburstBreadcrumb>
      {arcs.map((arc) => (
        <SunburstSegment index={arc.arcIndex} key={arc.id} />
      ))}
      <SunburstCenter />
      <SunburstLabels />
      <SunburstHint />
    </SunburstChart>
  );
}`,
  TooltipBarChartDemo: `<BarChart data={data} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" fill="var(--chart-line-primary)" />
  <BarXAxis />
  <ChartTooltip
    rows={(point) => [
      {
        color: "var(--chart-line-primary)",
        label: "Revenue",
        value: \`$\${point.revenue.toLocaleString()}\`,
      },
    ]}
  />
</BarChart>`,
  TooltipCrosshairFadeTopDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip
    showDots={false}
    showDatePill={false}
    indicatorFadeEdges="top"
    indicatorFadeLength={22}
    indicatorColor="var(--chart-2)"
  />
</LineChart>`,
  TooltipCrosshairOnlyDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip showDots={false} showDatePill={false} />
</LineChart>`,
  TooltipCustomContentDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
  <XAxis />
  <ChartTooltip
    content={({ point }) => (
      <div className="flex flex-col gap-2 p-3">
        <div className="text-sm font-medium">
          {point.date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-zinc-400">Users</span>
          <span className="font-mono">{point.users.toLocaleString()}</span>
          <span className="text-zinc-400">Views</span>
          <span className="font-mono">{point.pageviews.toLocaleString()}</span>
          <span className="text-zinc-400">Ratio</span>
          <span className="font-mono">
            {(point.pageviews / point.users).toFixed(2)}x
          </span>
        </div>
      </div>
    )}
  />
</LineChart>`,
  TooltipCustomRowsDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
  <XAxis />
  <ChartTooltip
    rows={(point) => [
      {
        color: "var(--chart-line-primary)",
        label: "Active Users",
        value: point.users.toLocaleString(),
      },
      {
        color: "var(--chart-line-secondary)",
        label: "Page Views",
        value: point.pageviews.toLocaleString(),
      },
    ]}
  />
</LineChart>`,
  TooltipDashedCrosshairDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip
    showDots={false}
    showDatePill={false}
    indicatorDasharray="6,4"
    indicatorColor="var(--chart-2)"
  />
</LineChart>`,
  TooltipDefaultDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  TooltipMatchCrosshairDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip matchCrosshair />
</LineChart>`,
  TooltipMinimalDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip 
    showCrosshair={false} 
    showDots={false} 
    showDatePill={false} 
  />
</LineChart>`,
  TooltipPanelDampingDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip
    damping={55}
    indicatorColor="var(--chart-2)"
  />
</LineChart>`,
  TooltipSolidCrosshairDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="users" stroke="var(--chart-line-primary)" />
  <XAxis />
  <ChartTooltip
    showDots={false}
    showDatePill={false}
    indicatorFadeEdges="none"
    indicatorColor="var(--chart-2)"
  />
</LineChart>`,
  TrendLineAreaDemo: `<AreaChart data={data}>
  <Grid horizontal />
  <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
  <TrendLine dataKey="desktop" stroke="var(--chart-1)" fadeEdges />
  <XAxis />
  <ChartTooltip />
</AreaChart>`,
  TrendLineBarDemo: `<BarChart data={data} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" lineCap="round" />
  <TrendLine
    dataKey="revenue"
    strokeStyle="gradient"
    gradientStart="var(--chart-3)"
    gradientEnd="var(--chart-1)"
  />
  <BarXAxis />
  <ChartTooltip showCrosshair={false} />
</BarChart>`,
  TrendLineComposedDemo: `<ComposedChart data={data} xDataKey="date" barGap={0} maxBarSize={32}>
  <Grid horizontal />
  <SeriesBar dataKey="units" fill="var(--chart-3)" radius={4} />
  <Line dataKey="revenue" stroke="var(--chart-1)" />
  <TrendLine dataKey="revenue" stroke="var(--chart-1)" fadeEdges />
  <TrendLine dataKey="units" stroke="var(--chart-3)" strokeDasharray="2,4" />
  <ChartTooltip showCrosshair={false} />
  <XAxis numTicks={8} />
</ComposedChart>`,
  TrendLineDashedDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <TrendLine dataKey="value" stroke="var(--chart-1)" />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  TrendLineDemo: `function TrendLineDemo() {
  const [strokeStyle, setStrokeStyle] =
    useState<TrendLineStrokeStyle>("dashed");

  return (
    <div className="w-full space-y-4">
      <SegmentedControl
        aria-label="Trend line stroke style"
        render={
          <RadioGroupPrimitive
            onValueChange={(value) =>
              setStrokeStyle(value as TrendLineStrokeStyle)
            }
            value={strokeStyle}
          />
        }
      >
        {STROKE_STYLES.map((option) => (
          <SegmentedControlItem
            key={option.value}
            render={<RadioPrimitive.Root value={option.value} />}
          >
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <LineTrendChart>
        <TrendLine
          dataKey="value"
          fadeEdges={strokeStyle === "gradient"}
          gradientEnd="var(--chart-1)"
          gradientStart="var(--chart-3)"
          stroke="var(--chart-1)"
          strokeStyle={strokeStyle}
        />
      </LineTrendChart>
    </div>
  );
}`,
  TrendLineFadeEdgesDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <TrendLine
    dataKey="value"
    strokeStyle="solid"
    stroke="var(--chart-1)"
    fadeEdges
    fadeEdgesLength={25}
  />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  TrendLineGradientDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <TrendLine
    dataKey="value"
    strokeStyle="gradient"
    gradientStart="var(--chart-3)"
    gradientEnd="var(--chart-1)"
    strokeWidth={2.5}
  />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  TrendLineHorizontalBarDemo: `<BarChart
  data={data}
  xDataKey="browser"
  orientation="horizontal"
  margin={{ left: 80 }}
  aspectRatio="4 / 3"
>
  <Grid horizontal={false} vertical fadeVertical />
  <Bar dataKey="users" lineCap={4} />
  <TrendLine dataKey="users" stroke="var(--chart-1)" />
  <BarYAxis />
  <ChartTooltip showCrosshair={false} />
</BarChart>`,
  TrendLineSolidDemo: `<LineChart data={data}>
  <Grid horizontal />
  <Line dataKey="value" strokeWidth={2} />
  <TrendLine
    dataKey="value"
    strokeStyle="solid"
    stroke="var(--chart-1)"
    opacity={0.8}
  />
  <XAxis />
  <ChartTooltip />
</LineChart>`,
  WeekendsLineDemo: `function WeekendsLineDemo() {
  return (
    <div className="w-full">
      <LineChart data={projectProgressData}>
        <Grid horizontal />
        <Weekends />
        <Line curve={smooth} dataKey="scope" stroke="var(--chart-4)" />
        <Line curve={smooth} dataKey="started" stroke="var(--chart-2)" />
        <Line curve={smooth} dataKey="completed" stroke="var(--chart-1)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}`,
} as const;
