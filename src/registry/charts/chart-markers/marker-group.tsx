"use client";

import type * as React from "react";

import { useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";

import {
  chartCssVars,
  useChartPortalContainer,
} from "../chart-core/chart-context";

// Fan configuration
const FAN_RADIUS = 50;
const FAN_ANGLE = 160;

export interface ChartMarker {
  /** Optional color override for the marker circle */
  color?: string;
  /** Optional custom content for tooltip (overrides title/description) */
  content?: React.ReactNode;
  /** Date for this marker (will be matched to nearest data point) */
  date: Date;
  /** Optional description */
  description?: string;
  /** URL to navigate to when clicked */
  href?: string;
  /** Icon to display in the marker circle */
  icon: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Open href in new tab. @default false */
  target?: "_blank" | "_self";
  /** Title shown in tooltip */
  title: string;
}

export interface MarkerGroupProps {
  /** Whether the marker should animate in */
  animate?: boolean;
  /** Delay before entrance animation starts */
  animationDelay?: number;
  /**
   * Override the marker circle's stroke color. Falls back to
   * `chartCssVars.markerBorder` when not set.
   */
  borderColor?: string;
  /**
   * Marker circle stroke width in px.
   * @default 1.5
   */
  borderWidth?: number;
  /** Reference to chart container for portal positioning */
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * Force the marker fan to open even when the user isn't hovering this
   * group directly. Used by parent layers (e.g. a clustered marker layer)
   * to fan out a cluster when the chart's main crosshair lands on one of
   * the cluster's buckets.
   */
  forceOpen?: boolean;
  /**
   * Make the icon `foreignObject` fill the entire circle (no 4px inset)
   * so favicon-style icons sit edge-to-edge with the marker border.
   */
  iconFill?: boolean;
  /** Whether this marker group is currently hovered (via chart hover) */
  isActive?: boolean;
  /**
   * Fade this marker group when another cluster has focus. Used by
   * parent layers to spotlight the active cluster.
   */
  isMuted?: boolean;
  /** Height of the vertical guide line below the marker */
  lineHeight?: number;
  /** Margin left offset from chart container */
  marginLeft?: number;
  /** Margin top offset from chart container */
  marginTop?: number;
  /** Markers at this position */
  markers: ChartMarker[];
  /**
   * Cap the number of markers rendered in the fan-out arc. The count
   * badge still reflects the full cluster size. Without this, large
   * clusters (e.g. 20+ spikes) collapse the fan angular spacing to
   * essentially zero and the markers stack on top of each other.
   */
  maxFanned?: number;
  /** Callback when marker group is hovered */
  onHover?: (markers: ChartMarker[] | null) => void;
  /** Whether to show the vertical guide line. @default true */
  showLine?: boolean;
  /** Size of each marker circle */
  size?: number;
  /** X position in pixels */
  x: number;
  /** Y position (top of chart area) */
  y: number;
}

// Entrance + fanned + muted variants. `fanned` shrinks and dims the
// collapsed marker while its siblings are flying out in the portal, so
// users only see the fan and not a duplicate icon sitting underneath.
// `muted` fades non-active clusters when one cluster is being focused.
const markerEntranceVariants = {
  fanned: {
    filter: "blur(2px)",
    opacity: 0,
    scale: 0.6,
  },
  hidden: {
    filter: "blur(2px)",
    opacity: 0,
    scale: 0.85,
  },
  muted: {
    filter: "blur(0px)",
    opacity: 0.4,
    scale: 1,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    scale: 1,
  },
};

export function MarkerGroup({
  x,
  y,
  markers,
  isActive = false,
  size = 28,
  onHover,
  containerRef,
  marginLeft = 0,
  marginTop = 0,
  animationDelay = 0,
  animate = true,
  lineHeight = 0,
  showLine = true,
  forceOpen = false,
  iconFill = false,
  borderColor,
  borderWidth = 1.5,
  maxFanned,
  isMuted = false,
}: MarkerGroupProps) {
  const [isHovered, setIsHovered] = useState(false);
  const portalContainer = useChartPortalContainer(containerRef);
  const shouldFan = (isHovered || forceOpen) && markers.length > 1;
  const hasMultiple = markers.length > 1;
  const fannedMarkers =
    maxFanned === undefined ? markers : markers.slice(0, maxFanned);
  let currentVariant: "fanned" | "muted" | "visible" = "visible";
  if (shouldFan) {
    currentVariant = "fanned";
  } else if (isMuted) {
    currentVariant = "muted";
  }

  const getCirclePosition = (index: number, total: number) => {
    const startAngle = -90 - FAN_ANGLE / 2;
    const angleStep = total > 1 ? FAN_ANGLE / (total - 1) : 0;
    const angle = startAngle + index * angleStep;
    const radians = (angle * Math.PI) / 180;

    return {
      x: Math.cos(radians) * FAN_RADIUS,
      y: Math.sin(radians) * FAN_RADIUS,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chart from handling this event
    setIsHovered(true);
    onHover?.(markers);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chart from handling this event
    setIsHovered(false);
    onHover?.(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chart crosshair from moving while hovering markers
  };

  const portalX = x + marginLeft;
  const portalY = y + marginTop;

  return (
    <>
      {/* Position group - no interaction */}
      <g transform={`translate(${x}, ${y})`}>
        {/* Vertical guide line - non-interactive, rendered first (behind marker) */}
        {showLine && lineHeight > 0 && (
          <motion.line
            animate={{
              strokeOpacity: (() => {
                if (isHovered) {
                  return 1;
                }
                if (isActive) {
                  return 0;
                }
                return 0.6;
              })(),
            }}
            initial={{ strokeOpacity: 0.6 }}
            stroke={chartCssVars.markerBorder}
            strokeDasharray="4,4"
            strokeLinecap="round"
            strokeWidth={1}
            style={{ pointerEvents: "none" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            x1={0}
            x2={0}
            y1={size / 2 + 4}
            y2={lineHeight + Math.abs(y)}
          />
        )}

        {/* Interactive marker group */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: Chart marker interaction */}
        <g
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          style={{ cursor: "pointer" }}
        >
          <motion.g
            animate={currentVariant}
            initial={animate ? "hidden" : currentVariant}
            transition={{
              damping: 25,
              delay: animationDelay,
              stiffness: 300,
              type: "spring",
            }}
            variants={markerEntranceVariants}
          >
            {/* Hit area - covers marker circle with padding for count badge above */}
            <rect
              fill="transparent"
              height={size * 1.5}
              width={size * 1.5}
              x={-size * 0.75}
              y={-size}
            />

            {/* Main marker */}
            <MarkerCircle
              borderColor={borderColor}
              borderWidth={borderWidth}
              color={markers[0]?.color}
              icon={markers[0]?.icon}
              iconFill={iconFill}
              size={size}
            />

            {/* Count badge */}
            <AnimatePresence>
              {hasMultiple && !shouldFan && (
                <motion.g
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  transition={{ damping: 20, stiffness: 400, type: "spring" }}
                >
                  <circle
                    cx={size / 2 + 2}
                    cy={-size / 2 - 2}
                    r={9}
                    style={{ fill: chartCssVars.badgeBackground }}
                  />
                  <text
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={600}
                    style={{ fill: chartCssVars.badgeForeground }}
                    textAnchor="middle"
                    x={size / 2 + 2}
                    y={-size / 2 - 2}
                  >
                    {markers.length}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </motion.g>
        </g>
      </g>

      {/* Portal for fanned circles */}
      {portalContainer &&
        createPortal(
          // biome-ignore lint/a11y/noStaticElementInteractions: Marker hover portal
          // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Marker hover portal
          <div
            className="absolute"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
              height: FAN_RADIUS * 2 + size,
              // Position the div so its center is at the marker position
              // The div covers the entire fan area to prevent mouseLeave when moving between markers
              left: portalX - (FAN_RADIUS + size / 2),
              pointerEvents: shouldFan ? "auto" : "none",
              top: portalY - (FAN_RADIUS + size / 2),
              width: FAN_RADIUS * 2 + size,
              zIndex: 100,
            }}
          >
            {/* Center point offset - all fanned markers are positioned relative to this */}
            <div
              className="absolute"
              style={{
                left: FAN_RADIUS + size / 2,
                top: FAN_RADIUS + size / 2,
              }}
            >
              <AnimatePresence mode="sync">
                {shouldFan &&
                  fannedMarkers.map((marker, index) => {
                    const position = getCirclePosition(
                      index,
                      fannedMarkers.length
                    );
                    return (
                      <motion.div
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: position.x,
                          y: position.y,
                        }}
                        className="absolute"
                        exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        key={`fan-${marker.title}`}
                        style={{
                          height: size,
                          left: -size / 2,
                          top: -size / 2,
                          width: size,
                        }}
                        transition={{
                          damping: 22,
                          delay: index * 0.04,
                          stiffness: 400,
                          type: "spring",
                        }}
                      >
                        <MarkerCircleHTML
                          borderColor={borderColor}
                          borderWidth={borderWidth}
                          color={marker.color}
                          href={marker.href}
                          icon={marker.icon}
                          iconFill={iconFill}
                          isClickable={!!(marker.onClick || marker.href)}
                          onClick={marker.onClick}
                          size={size}
                          target={marker.target}
                        />
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              <AnimatePresence>
                {shouldFan && (
                  <motion.div
                    animate={{ opacity: 0.5, scale: 1 }}
                    className="absolute"
                    exit={{ opacity: 0, scale: 0 }}
                    initial={{ opacity: 0, scale: 0 }}
                    style={{
                      height: size * 0.5,
                      left: -size * 0.25,
                      top: -size * 0.25,
                      width: size * 0.5,
                    }}
                    transition={{ damping: 20, stiffness: 400, type: "spring" }}
                  >
                    <div
                      className="h-full w-full rounded-full"
                      style={{ backgroundColor: chartCssVars.markerBorder }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>,
          portalContainer
        )}
    </>
  );
}

interface MarkerCircleProps {
  /** Override circle stroke color. */
  borderColor?: string;
  /** Circle stroke width. */
  borderWidth?: number;
  color?: string;
  href?: string;
  icon: React.ReactNode;
  /** Edge-to-edge icon (no 4px inset). */
  iconFill?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  size: number;
  target?: "_blank" | "_self";
}

function MarkerCircle({
  icon,
  size,
  color,
  iconFill = false,
  borderColor,
  borderWidth = 1.5,
}: MarkerCircleProps) {
  const inset = iconFill ? 0 : 4;
  return (
    <g>
      <circle cx={0} cy={2} fill="black" opacity={0.15} r={size / 2} />
      <circle
        cx={0}
        cy={0}
        fill={color || chartCssVars.markerBackground}
        r={size / 2}
        stroke={borderColor ?? chartCssVars.markerBorder}
        strokeWidth={borderWidth}
      />
      <foreignObject
        height={size - inset * 2}
        width={size - inset * 2}
        x={-size / 2 + inset}
        y={-size / 2 + inset}
      >
        <div
          style={{
            alignItems: "center",
            borderRadius: "50%",
            color: chartCssVars.markerForeground,
            display: "flex",
            fontSize: size * 0.5,
            height: "100%",
            justifyContent: "center",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {icon}
        </div>
      </foreignObject>
    </g>
  );
}

function MarkerCircleHTML({
  icon,
  size,
  color,
  onClick,
  href,
  target = "_self",
  isClickable = false,
  iconFill = false,
  borderColor,
  borderWidth = 1.5,
}: MarkerCircleProps) {
  const hasAction = isClickable || onClick || href;
  const inset = iconFill ? 0 : 4;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else if (href) {
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    }
  };

  // Note: color and CSS vars must remain inline styles as they're dynamic
  return (
    <motion.div
      className={cn(
        "relative flex h-full w-full items-center justify-center rounded-full shadow-lg",
        hasAction && "cursor-pointer"
      )}
      onClick={hasAction ? handleClick : undefined}
      style={{
        backgroundColor: color || chartCssVars.markerBackground,
        border: `${borderWidth}px solid ${borderColor ?? chartCssVars.markerBorder}`,
        color: chartCssVars.markerForeground,
        fontSize: size * 0.5,
        overflow: "hidden",
        padding: inset,
      }}
      transition={{ damping: 17, stiffness: 400, type: "spring" }}
      whileHover={
        hasAction
          ? { boxShadow: "0 4px 20px rgba(0,0,0,0.25)", scale: 1.15 }
          : undefined
      }
      whileTap={hasAction ? { scale: 0.95 } : undefined}
    >
      {icon}
    </motion.div>
  );
}

MarkerGroup.displayName = "MarkerGroup";
