"use client";

import type { SankeyLink, SankeyNode } from "d3-sankey";

import { TooltipBox } from "../chart-tooltip/tooltip-box";
import {
  TooltipContent,
  type TooltipRow,
} from "../chart-tooltip/tooltip-content";
import { intFmt } from "../chart-utils/formatters";
import {
  type SankeyLinkDatum,
  type SankeyNodeDatum,
  useSankey,
} from "./sankey-context";

// Helper to get node name from link source/target
type NodeOrIndex = SankeyNode<SankeyNodeDatum, SankeyLinkDatum> | number;

function getNodeName(nodeOrIndex: NodeOrIndex, fallbackIndex: number): string {
  if (typeof nodeOrIndex === "number") {
    return `Node ${nodeOrIndex}`;
  }
  return nodeOrIndex.name ?? `Node ${fallbackIndex}`;
}

export interface SankeyTooltipProps {
  /** Custom class name */
  className?: string;
  /** Fade the panel out when hover ends. @default true */
  exit?: boolean;
  /** Value formatter function */
  formatValue?: (value: number) => string;
  /** Custom content renderer for link tooltips */
  linkContent?: (props: {
    link: SankeyLink<SankeyNodeDatum, SankeyLinkDatum>;
    index: number;
  }) => React.ReactNode;
  /** Custom content renderer for node tooltips */
  nodeContent?: (props: {
    node: SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
    index: number;
  }) => React.ReactNode;
  /** Inline styles merged onto the tooltip panel (e.g. background, backdrop blur). */
  panelStyle?: React.CSSProperties;
}

export function SankeyTooltip({
  nodeContent,
  linkContent,
  formatValue = intFmt,
  className = "",
  panelStyle,
  exit = true,
}: SankeyTooltipProps) {
  const {
    tooltipData,
    containerRef,
    width,
    height,
    margin,
    nodes,
    links,
    mousePos,
  } = useSankey();

  let x = 0;
  let y = 0;
  if (tooltipData) {
    // Use mouse position if available, otherwise fallback to anchor point
    x = mousePos ? mousePos.x : tooltipData.x + margin.left;
    y = mousePos ? mousePos.y : tooltipData.y + margin.top;
  }

  let body: React.ReactNode = null;

  const node =
    tooltipData?.type === "node" && tooltipData.nodeIndex !== undefined
      ? nodes[tooltipData.nodeIndex]
      : undefined;
  const link =
    tooltipData?.type === "link" && tooltipData.linkIndex !== undefined
      ? links[tooltipData.linkIndex]
      : undefined;

  if (node && tooltipData?.nodeIndex !== undefined) {
    body = nodeContent ? (
      nodeContent({ index: tooltipData.nodeIndex, node })
    ) : (
      <TooltipContent
        rows={[
          {
            color: "var(--color-chart-1)",
            label: "Sessions",
            value: formatValue(node.value ?? 0),
          },
        ]}
        title={node.name}
      />
    );
  } else if (link && tooltipData?.linkIndex !== undefined) {
    const index = tooltipData.linkIndex;
    if (linkContent) {
      body = linkContent({ index, link });
    } else {
      const sourceName = getNodeName(link.source as NodeOrIndex, index);
      const targetName = getNodeName(link.target as NodeOrIndex, index);
      const rows: TooltipRow[] = [
        {
          color: "var(--color-foreground-muted)",
          label: "Flow",
          value: formatValue(link.value),
        },
      ];
      body = (
        <TooltipContent rows={rows} title={`${sourceName} → ${targetName}`} />
      );
    }
  }

  // Always mounted so the panel can fade out; `visible` drives presence.
  return (
    <TooltipBox
      className={className}
      containerHeight={height}
      containerRef={containerRef}
      containerWidth={width}
      exit={exit}
      panelStyle={panelStyle}
      visible={body !== null}
      x={x}
      y={y}
    >
      {body}
    </TooltipBox>
  );
}

SankeyTooltip.displayName = "SankeyTooltip";
