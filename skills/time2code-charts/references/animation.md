# Animation

Defaults live in the installed `chart-utils/animation.ts`.

## Defaults

- **Duration:** `1100ms` (`DEFAULT_ANIMATION_DURATION_MS`) for cartesian enter reveals.
- **Easing:** `cubic-bezier(0.85, 0, 0.15, 1)` (`DEFAULT_ANIMATION_EASING`), the global default.
- **Bars:** same duration and easing, plus an automatic stagger over ~40% of the duration (`Bar` `staggerDelay` overrides it; `animationType: "grow" | "fade"`).
- Root props: `animationDuration` (ms), `animationEasing` (CSS easing for the clip reveal), `enterTransition` (motion `Transition`). Series take `animate={false}` to skip their own enter.

Don't hand-tune these per chart unless asked; consistent timing across a dashboard reads better.

## Data updates

When `data` changes (a new date range, a refresh), line and area charts morph to it and tween the y-domain (`yDomainTween`, on by default) without replaying the enter animation. Don't change `revealSignature` or `key` for data updates.

## Replay enter animations

Change `revealSignature` (line, area, bar, candlestick, scatter, composed, heatmap, sankey and choropleth roots) or remount with a new `key`.

```tsx
const [replay, setReplay] = useState(0);

<LineChart data={data} revealSignature={String(replay)}>
  {/* … */}
</LineChart>

<Button onClick={() => setReplay((n) => n + 1)} type="button">Replay</Button>
```

## Live charts

- `LiveLineChart` runs its own rAF loop: smooth `value` interpolation (`lerpSpeed`) and a scrolling `window` (seconds).
- `paused` freezes scrolling without unmounting; use it for hidden tabs.
- Append points and trim (`prev.slice(-500)`); don't rebuild the array or create new objects for unchanged points every tick.

## Reduced motion

Handled **partially**. `useReducedMotion()` is checked by data-change path and band tweens, y-domain tweens, the gauge, heatmap enter, sparklines, grid shimmer, the loading sweep and label, the trend line and the tooltip box and date pill. The cartesian clip-path reveal, bar grow/stagger, pie/ring/radar enters and live scrolling don't check it.

When the app must honor `prefers-reduced-motion`, gate it yourself:

```tsx
import { useReducedMotion } from "motion/react";

const reduce = useReducedMotion();

<BarChart data={data} xDataKey="month">
  <Bar animate={!reduce} dataKey="revenue" />
  …
</BarChart>
```

`Line`, `Area` and `Bar` take `animate`. (`animationDuration={0}` alone isn't enough for bars; the stagger falls back to the default.)

Don't tell the user the charts are fully reduced-motion safe.

## Performance

- Memoize `data` (and `rows` / `content` callbacks) so hover doesn't rebuild arrays.
- Prefer one chart with several series over many stacked charts.
- Keep datasets to hundreds, not tens of thousands, of SVG points. `decimateTimeSeries` from `time-series-data/time-series-data` downsamples.
