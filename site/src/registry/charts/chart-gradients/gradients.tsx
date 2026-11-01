import type { ReactNode, SVGProps } from "react";

interface GradientStopProps {
  /** Overrides the two `from` / `to` stops. */
  children?: ReactNode;
  /** Start color. */
  from?: string;
  /** Position of the start color. @default "0%" */
  fromOffset?: string | number;
  /** Opacity of the start color. @default 1 */
  fromOpacity?: string | number;
  /** Unique id, referenced as `url(#id)`. */
  id: string;
  /** End color. */
  to?: string;
  /** Position of the end color. @default "100%" */
  toOffset?: string | number;
  /** Opacity of the end color. @default 1 */
  toOpacity?: string | number;
}

export type LinearGradientProps = GradientStopProps &
  Omit<SVGProps<SVGLinearGradientElement>, keyof GradientStopProps> & {
    /** Run top → bottom when no `x1` / `x2` / `y1` / `y2` is set (else left → right). @default true */
    vertical?: boolean;
  };

export type RadialGradientProps = GradientStopProps &
  Omit<SVGProps<SVGRadialGradientElement>, keyof GradientStopProps>;

function GradientStops({
  children,
  from,
  fromOffset = "0%",
  fromOpacity = 1,
  to,
  toOffset = "100%",
  toOpacity = 1,
}: Omit<GradientStopProps, "id">) {
  if (children) {
    return children;
  }
  return (
    <>
      <stop offset={fromOffset} stopColor={from} stopOpacity={fromOpacity} />
      <stop offset={toOffset} stopColor={to} stopOpacity={toOpacity} />
    </>
  );
}

/** Two-stop `<linearGradient>` in its own `<defs>`; drop it into any chart. */
export function LinearGradient({
  children,
  from,
  fromOffset,
  fromOpacity,
  to,
  toOffset,
  toOpacity,
  vertical = true,
  ...props
}: LinearGradientProps) {
  const useVertical =
    vertical && !(props.x1 || props.x2 || props.y1 || props.y2);
  return (
    <defs>
      <linearGradient
        {...(useVertical ? { x1: "0", x2: "0", y1: "0", y2: "1" } : null)}
        {...props}
      >
        <GradientStops
          from={from}
          fromOffset={fromOffset}
          fromOpacity={fromOpacity}
          to={to}
          toOffset={toOffset}
          toOpacity={toOpacity}
        >
          {children}
        </GradientStops>
      </linearGradient>
    </defs>
  );
}

/** Two-stop `<radialGradient>` in its own `<defs>`; drop it into any chart. */
export function RadialGradient({
  children,
  from,
  fromOffset,
  fromOpacity,
  to,
  toOffset,
  toOpacity,
  ...props
}: RadialGradientProps) {
  return (
    <defs>
      <radialGradient {...props}>
        <GradientStops
          from={from}
          fromOffset={fromOffset}
          fromOpacity={fromOpacity}
          to={to}
          toOffset={toOffset}
          toOpacity={toOpacity}
        >
          {children}
        </GradientStops>
      </radialGradient>
    </defs>
  );
}
