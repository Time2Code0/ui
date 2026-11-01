import {
  Children,
  cloneElement,
  createElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/**
 * Chart roots inspect their children before rendering them: series props
 * drive the y-domain and tooltip, and each child is drawn in a fixed layer
 * (defs, grid/axes, underlay, clipped series, overlay). Children are matched
 * by display name as well as by reference, because MDX and duplicate bundles
 * can hand the chart a different `Line` reference than the one it imports.
 */

/** Display name of an element's component (`""` for host elements and fragments). */
export function getChartChildName(child: ReactElement): string {
  const type = child.type as { displayName?: string; name?: string } | null;
  if (typeof type === "function" || (typeof type === "object" && type)) {
    return type.displayName || type.name || "";
  }
  return "";
}

/** Marker on wrapper components whose single child should inherit clip classification. */
export const CHART_CLIP_PASSTHROUGH = "__chartClipPassthrough" as const;

export function isChartClipPassthrough(type: unknown): boolean {
  return (
    typeof type === "function" &&
    (type as { [CHART_CLIP_PASSTHROUGH]?: boolean })[CHART_CLIP_PASSTHROUGH] ===
      true
  );
}

const REACT_LAZY_TYPE = Symbol.for("react.lazy");

interface LazyComponentType {
  _init: (payload: unknown) => unknown;
  _payload: unknown;
  $$typeof: symbol;
}

function isLazyComponentType(type: unknown): type is LazyComponentType {
  return (
    typeof type === "object" &&
    type !== null &&
    (type as { $$typeof?: unknown }).$$typeof === REACT_LAZY_TYPE &&
    typeof (type as { _init?: unknown })._init === "function"
  );
}

/**
 * Unwrap a `React.lazy` element type to the component it resolves to.
 *
 * Chart children written in a Server Component (e.g. MDX docs) reach the
 * client chart as lazy client references, which hide `displayName` and the
 * `__isChartMarkers` / `__isPostOverlay` flags. Without unwrapping, markers,
 * axes and grids are classified as series and end up inside the reveal clip,
 * which cuts off marker count badges above the plot.
 */
export function resolveLazyChartChild(child: ReactElement): ReactElement {
  const type: unknown = child.type;
  if (!isLazyComponentType(type)) {
    return child;
  }
  let resolved: unknown;
  try {
    resolved = type._init(type._payload);
  } catch {
    // Module still loading (lazy init throws a thenable) — keep the lazy element.
    return child;
  }
  if (
    typeof resolved !== "function" &&
    !(typeof resolved === "object" && resolved !== null)
  ) {
    return child;
  }
  // Only forward a real key: `createElement` stringifies any non-undefined
  // key, so `key: null` would become the literal key "null" on every
  // unkeyed child (duplicate-key warnings, and it defeats the index fallback
  // in `partitionChartChildren`).
  return createElement(resolved as Parameters<typeof createElement>[0], {
    ...(child.props as object),
    ...(child.key == null ? {} : { key: child.key }),
  });
}

/**
 * Unwrap visibility wrappers so `Grid` / axes stay outside the series clip.
 *
 * Use the result to classify a child only — render the lazy-resolved child
 * instead, or a wrapper that hides its child (Studio layer toggles) is bypassed.
 */
export function resolveChartChildElement(child: ReactElement): ReactElement {
  const element = resolveLazyChartChild(child);
  if (isChartClipPassthrough(element.type)) {
    const inner = (element.props as { children?: unknown }).children;
    if (isValidElement(inner)) {
      return resolveChartChildElement(inner);
    }
  }
  return element;
}

/** Walk chart children, flattening React fragments (studio often groups layers in `<>...</>`). */
export function forEachChartChild(
  children: ReactNode,
  callback: (child: ReactElement, index: number) => void
) {
  let index = 0;
  const visit = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) {
        return;
      }
      if (child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children);
        return;
      }
      callback(resolveLazyChartChild(child), index);
      index += 1;
    });
  };
  visit(children);
}

/**
 * Depth-first walk over chart children and everything nested inside them
 * (fragments, wrappers). Return `true` from `visit` to skip that element's
 * own children.
 */
export function walkChartChildren(
  children: ReactNode,
  visit: (child: ReactElement) => boolean | undefined
) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || visit(child)) {
      return;
    }
    const nested = (child.props as { children?: ReactNode } | undefined)
      ?.children;
    if (nested) {
      walkChartChildren(nested, visit);
    }
  });
}

const VISX_PATTERN_COMPONENT_NAMES = new Set([
  "Lines",
  "Circles",
  "Waves",
  "Hexagons",
  "Path",
  "Pattern",
]);

/** @visx/pattern default exports use short names (e.g. `Lines`); also match *Pattern* displayNames. */
export function isPatternDefComponent(child: ReactElement): boolean {
  const name = getChartChildName(child);
  return name.includes("Pattern") || VISX_PATTERN_COMPONENT_NAMES.has(name);
}

export function isGradientDefComponent(child: ReactElement): boolean {
  return getChartChildName(child).includes("Gradient");
}

/** Gradient or pattern definition — hoisted into the chart's `<defs>` by radial charts. */
export function isChartDefComponent(child: ReactElement): boolean {
  return isGradientDefComponent(child) || isPatternDefComponent(child);
}

/** Grid and axes stay visible during series clip reveal (e.g. loading → ready). */
const CLIP_EXCLUDED_COMPONENT_NAMES = new Set([
  "Background",
  "Grid",
  "XAxis",
  "YAxis",
  "BarXAxis",
  "BarYAxis",
  "LiveXAxis",
  "LiveYAxis",
]);

/** Renders above grid/axes but below series; excluded from grow-clip reveal. */
const UNDERLAY_COMPONENT_NAMES = new Set([
  "ReferenceArea",
  "BarColumnTrack",
  "Weekends",
  "Deadline",
]);

/** Markers render after the interaction overlay so they stay clickable. */
const POST_OVERLAY_COMPONENT_NAMES = new Set([
  "ChartMarkers",
  "MarkerGroup",
  "ChartBrush",
]);

function isPostOverlayComponent(child: ReactElement): boolean {
  const type = child.type as {
    __isChartMarkers?: boolean;
    __isPostOverlay?: boolean;
  };
  return (
    type.__isChartMarkers === true ||
    type.__isPostOverlay === true ||
    POST_OVERLAY_COMPONENT_NAMES.has(getChartChildName(child))
  );
}

export interface ChartChildLayers {
  /** Grid, axes, background — outside the series reveal clip. */
  clipExcluded: ReactElement[];
  /** Gradient definitions, rendered inside the chart's `<defs>`. */
  defs: ReactElement[];
  /** Markers and brush — drawn last so they stay interactive. */
  postOverlay: ReactElement[];
  /** Series, pattern defs (patterns wrap their own `<defs>`) and everything else. */
  series: ReactElement[];
  /** Reference areas, weekends, deadlines, column tracks. */
  underlay: ReactElement[];
}

/**
 * Sort chart children into render layers. Fragments are flattened, lazy
 * client references resolved, and clip-passthrough wrappers classified by the
 * child they wrap (but still rendered, so they can hide it). Unkeyed children
 * get an index key so the layer arrays render without key warnings.
 */
export function partitionChartChildren(children: ReactNode): ChartChildLayers {
  const layers: ChartChildLayers = {
    clipExcluded: [],
    defs: [],
    postOverlay: [],
    series: [],
    underlay: [],
  };

  forEachChartChild(children, (child, index) => {
    const keyed =
      child.key == null
        ? cloneElement(child, { key: `chart-child-${index}` })
        : child;
    const resolved = resolveChartChildElement(child);
    const name = getChartChildName(resolved);

    if (isGradientDefComponent(resolved)) {
      layers.defs.push(keyed);
    } else if (isPatternDefComponent(resolved)) {
      layers.series.push(keyed);
    } else if (isPostOverlayComponent(resolved)) {
      layers.postOverlay.push(keyed);
    } else if (CLIP_EXCLUDED_COMPONENT_NAMES.has(name)) {
      layers.clipExcluded.push(keyed);
    } else if (UNDERLAY_COMPONENT_NAMES.has(name)) {
      layers.underlay.push(keyed);
    } else {
      layers.series.push(keyed);
    }
  });

  return layers;
}
