"use client";

import type { SankeyLink } from "d3-sankey";
import type { Transition } from "motion/react";

import {
  memo,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { localPoint } from "@visx/event";
import { sankey, sankeyCenter, sankeyLinkHorizontal } from "@visx/sankey";
import { cn } from "cn";

import { ParentSize } from "../chart-parent-size";
import { useRevealReplay } from "../use-reveal-replay";
import {
  type Margin,
  type SankeyLinkDatum,
  type SankeyNodeDatum,
  SankeyProvider,
  type SankeyTooltipData,
} from "./sankey-context";

export interface SankeyData {
  links: SankeyLinkDatum[];
  nodes: SankeyNodeDatum[];
}

export interface SankeyChartProps {
  /** Animation duration in milliseconds. Default: 1100 */
  animationDuration?: number;
  /** Aspect ratio as "width / height". Default: "2 / 1" */
  aspectRatio?: string;
  /** Child components (SankeyNode, SankeyLink, SankeyTooltip) */
  children: ReactNode;
  /** Additional class name for the container */
  className?: string;
  /** Sankey data with nodes and links */
  data: SankeyData;
  /** Motion enter transition (spring or cubic-bezier tween). */
  enterTransition?: Transition;
  /** Controlled hovered node index (e.g. from ChartLegend). */
  hoveredNodeIndex?: number | null;
  /** Chart margins */
  margin?: Partial<Margin>;
  /** Node padding in pixels. Default: 24 */
  nodePadding?: number;
  /** Node width in pixels. Default: 16 */
  nodeWidth?: number;
  /** Called when node hover changes from the chart surface. */
  onNodeHoverChange?: (index: number | null) => void;
  /** Signature of motion URL state — triggers enter replay when it changes. */
  revealSignature?: string;
}

const DEFAULT_MARGIN: Margin = { bottom: 40, left: 180, right: 180, top: 40 };

interface SankeyChartInnerProps {
  animationDuration: number;
  children: ReactNode;
  data: SankeyData;
  enterTransition?: Transition;
  height: number;
  hoveredNodeIndexProp?: number | null;
  margin: Margin;
  nodePadding: number;
  nodeWidth: number;
  onNodeHoverChange?: (index: number | null) => void;
  revealSignature?: string;
  width: number;
}

function SankeyChartInner(props: SankeyChartInnerProps) {
  const { width, height } = props;

  if (width < 10 || height < 10) {
    return null;
  }

  return <SankeyChartCore {...props} />;
}

const SankeyChartCore = memo(function SankeyChartCore({
  data,
  width,
  height,
  margin,
  animationDuration,
  enterTransition,
  revealSignature = "",
  nodeWidth,
  nodePadding,
  children,
  hoveredNodeIndexProp,
  onNodeHoverChange,
}: SankeyChartInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded, revealEpoch } = useRevealReplay({
    delayMs: animationDuration,
    replayKey: [animationDuration, revealSignature],
  });
  const [internalHoveredNodeIndex, setInternalHoveredNodeIndex] = useState<
    number | null
  >(null);
  const isNodeHoverControlled = hoveredNodeIndexProp !== undefined;
  const hoveredNodeIndex = isNodeHoverControlled
    ? hoveredNodeIndexProp
    : internalHoveredNodeIndex;
  const setHoveredNodeIndex = useCallback(
    (index: number | null) => {
      if (isNodeHoverControlled) {
        onNodeHoverChange?.(index);
      } else {
        setInternalHoveredNodeIndex(index);
      }
    },
    [isNodeHoverControlled, onNodeHoverChange]
  );
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<SankeyTooltipData | null>(
    null
  );
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const sankeyGenerator = useMemo(
    () =>
      sankey<SankeyNodeDatum, SankeyLinkDatum>()
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeAlign(sankeyCenter)
        .extent([
          [0, 0],
          [innerWidth, innerHeight],
        ]),
    [innerWidth, innerHeight, nodeWidth, nodePadding]
  );

  const graph = useMemo(() => {
    const clonedData = {
      links: data.links.map((link) => ({ ...link })),
      nodes: data.nodes.map((node) => ({ ...node })),
    };
    return sankeyGenerator(clonedData);
  }, [data, sankeyGenerator]);

  const createPath = useCallback(
    (link: SankeyLink<SankeyNodeDatum, SankeyLinkDatum>) => {
      try {
        const pathGenerator = sankeyLinkHorizontal();
        return pathGenerator(link) || "";
      } catch {
        return "";
      }
    },
    []
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const point = localPoint(event);
    if (point) {
      setMousePos({ x: point.x, y: point.y });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeIndex(null);
    setHoveredLinkIndex(null);
    setTooltipData(null);
    setMousePos(null);
  }, [setHoveredNodeIndex]);

  const contextValue = {
    animationDuration,
    containerRef,
    createPath,
    enterTransition,
    graph,
    height,
    hoveredLinkIndex,
    hoveredNodeIndex,
    innerHeight,
    innerWidth,
    isLoaded,
    links: graph.links,
    margin,
    mousePos,
    nodes: graph.nodes,
    revealEpoch,
    setHoveredLinkIndex,
    setHoveredNodeIndex,
    setTooltipData,
    tooltipData,
    width,
  };

  return (
    <SankeyProvider value={contextValue}>
      <div className="relative h-full w-full" ref={containerRef}>
        <svg
          aria-hidden="true"
          className="overflow-visible"
          height={height}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          width={width}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {children}
          </g>
        </svg>
      </div>
    </SankeyProvider>
  );
});

export function SankeyChart({
  data,
  margin: marginProp,
  animationDuration = 1100,
  enterTransition,
  revealSignature,
  aspectRatio = "2 / 1",
  nodeWidth = 16,
  nodePadding = 24,
  className = "",
  children,
  hoveredNodeIndex,
  onNodeHoverChange,
}: SankeyChartProps) {
  const margin = { ...DEFAULT_MARGIN, ...marginProp };

  return (
    <div className={cn("relative w-full", className)} style={{ aspectRatio }}>
      <ParentSize>
        {({ width, height }) => (
          <SankeyChartInner
            animationDuration={animationDuration}
            data={data}
            enterTransition={enterTransition}
            height={height}
            hoveredNodeIndexProp={hoveredNodeIndex}
            margin={margin}
            nodePadding={nodePadding}
            nodeWidth={nodeWidth}
            onNodeHoverChange={onNodeHoverChange}
            revealSignature={revealSignature}
            width={width}
          >
            {children}
          </SankeyChartInner>
        )}
      </ParentSize>
    </div>
  );
}

SankeyChart.displayName = "SankeyChart";
