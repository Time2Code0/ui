import { Children, Fragment, isValidElement } from "react";

import { cn } from "cn";

const breakpointsOrder = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

type Breakpoint = (typeof breakpointsOrder)[number];
type Responsive<T> = Partial<Record<Breakpoint, T>>;

interface SystemProps extends React.ComponentPropsWithRef<"div"> {
  debug?: boolean;
  guideWidth?: number;
}

function System({
  children,
  className,
  debug = false,
  guideWidth = 1,
  ...props
}: SystemProps) {
  return (
    <div
      className={cn(
        "relative w-full",
        debug
          ? "[--guide-color:rgb(255,204,109)]"
          : "[--guide-color:color-mix(in_oklab,var(--color-foreground)_10%,transparent)]",
        "[container-type:inline-size] before:pointer-events-none before:absolute before:-inset-px before:border-[var(--guide-color)] before:[border-width:var(--guide-width)]",
        className
      )}
      style={
        {
          "--guide-width": `${guideWidth}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

type GridBreakpoints = Responsive<number>;

interface GridProps extends React.ComponentPropsWithRef<"div"> {
  columns: number | GridBreakpoints;
  fitContent?: boolean;
  hideGuides?: "row" | "column";
  rows: number | GridBreakpoints;
}

function Root({
  children,
  className,
  columns,
  rows,
  hideGuides,
  fitContent = false,
  ...props
}: GridProps) {
  const colRowSpansResult = getColRowSpansFromChildren(children);
  const fixedHeight = !fitContent || hideGuides !== undefined;
  const [columnStyle, columnClassName, columnsBreakpoints] = getGridStyles(
    columns,
    "grid-columns"
  );
  const [rowStyle, rowClassName, rowsBreakpoints] = getGridStyles(
    rows,
    "grid-rows"
  );

  return (
    <div
      className={cn(
        "relative grid grid-cols-[repeat(var(--grid-columns),minmax(0,1fr))] grid-rows-[repeat(var(--grid-rows),calc(fit-content/var(--grid-rows)))] border-b-[var(--guide-color)] [border-bottom-width:var(--guide-width)] last:border-b-0",
        fixedHeight &&
          "h-[var(--height)] grid-rows-[repeat(var(--grid-rows),var(--row-height))]",
        columnClassName,
        rowClassName,
        className
      )}
      data-grid=""
      style={
        {
          ...columnStyle,
          ...rowStyle,
          ...(fixedHeight && {
            "--grid-system-width": "calc(100cqw)",
            "--height": fitContent
              ? "fit-content"
              : "calc(var(--width) / var(--grid-columns) * var(--grid-rows))",
            "--row-height": "calc(var(--height) / var(--grid-rows))",
            "--width": "calc(var(--grid-system-width) - var(--guide-width))",
            ...props.style,
          }),
        } as React.CSSProperties
      }
      {...props}
    >
      {children}

      {breakpointsOrder.map((bp, index) => (
        <Background
          className={
            [
              "block sm:hidden",
              "hidden sm:block md:hidden",
              "hidden md:block lg:hidden",
              "hidden lg:block xl:hidden",
              "hidden xl:block 2xl:hidden",
              "hidden 2xl:block",
            ][index]
          }
          colRowSpan={colRowSpansResult[bp]}
          columns={
            typeof columnsBreakpoints === "object"
              ? columnsBreakpoints[bp]
              : columnsBreakpoints
          }
          hideGuides={hideGuides}
          key={bp}
          rows={
            typeof rowsBreakpoints === "object"
              ? rowsBreakpoints[bp]
              : rowsBreakpoints
          }
        />
      ))}
    </div>
  );
}

const getGridStyles = (
  grid: GridBreakpoints | number | undefined,
  styleKey: string
): [React.CSSProperties, string, Required<GridBreakpoints> | number] => {
  let style: React.CSSProperties = {};
  let className = "";
  let breakpoints: Required<GridBreakpoints> | number = 0;

  if (typeof grid === "object") {
    style = getBreakpointStyles(grid, styleKey);
    className = getClassesNames(styleKey);
    breakpoints = getFlatBreakpointValues(grid);
  } else if (typeof grid === "number") {
    style = { [`--${styleKey}`]: grid } as React.CSSProperties;
    className = `[--${styleKey}:${grid}]`;
    breakpoints = grid;
  }

  return [style, className, breakpoints];
};

const getFlatBreakpointValues = (breakpoints: GridBreakpoints) => {
  const result: Required<GridBreakpoints> = {
    "2xl": 0,
    lg: 0,
    md: 0,
    sm: 0,
    xl: 0,
    xs: 0,
  };

  let currentValue = 0;

  for (const breakpoint of breakpointsOrder) {
    const newValue = breakpoints[breakpoint];

    if (newValue) {
      currentValue = newValue;
    }

    result[breakpoint] = currentValue;
  }

  return result;
};

interface ColRowSpans {
  colSpan: (string | number)[];
  rowSpan: (string | number)[];
}

type ColRowSpansResult = Record<Breakpoint, ColRowSpans>;

const getColRowSpansFromChildren = (children: React.ReactNode) => {
  const result: ColRowSpansResult = {
    "2xl": {
      colSpan: [],
      rowSpan: [],
    },
    lg: {
      colSpan: [],
      rowSpan: [],
    },
    md: {
      colSpan: [],
      rowSpan: [],
    },
    sm: {
      colSpan: [],
      rowSpan: [],
    },
    xl: {
      colSpan: [],
      rowSpan: [],
    },
    xs: {
      colSpan: [],
      rowSpan: [],
    },
  };

  const setValues = (
    props: CellProps,
    propName: "column" | "row",
    resulKey: "colSpan" | "rowSpan"
  ) => {
    const prop = props[propName];

    if (typeof prop === "object") {
      let currentValue: string | number = "";

      for (const bp of breakpointsOrder) {
        const newValue = prop[bp];

        if (newValue) {
          // Workarround: if input is only a single diget instead of an valid span (eg. "2" instead of "2/4") it must be handles as a number.
          // Otherwise it will create an error in the coordinates calculation of <Background />.
          // TODO: Create better solution for example by changing the coordinates calc function to handle the problem
          if (typeof newValue === "string" && !Number.isNaN(Number(newValue))) {
            currentValue = Number(newValue);
          } else {
            currentValue = newValue;
          }
        }

        result[bp][resulKey].push(currentValue);
      }
    } else if (typeof prop === "string") {
      for (const bp of breakpointsOrder) {
        result[bp][resulKey].push(prop);
      }
    }
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    const props = child.props as CellProps;
    if (!props.solid) {
      return;
    }

    setValues(props, "column", "colSpan");
    setValues(props, "row", "rowSpan");
  });

  return result;
};

function Background({
  columns,
  rows,
  hideGuides,
  className,
  colRowSpan,
}: {
  columns: number;
  rows: number;
  hideGuides?: "row" | "column" | undefined;
  className?: string;
  colRowSpan: ColRowSpans;
}) {
  const getCoordinates = (
    outer: string | number,
    inner: string | number,
    swapCoordinates: boolean
  ): number[][] => {
    const result: number[][] = [];

    const parseRange = (range: string): [number, number] => {
      const [start, end] = range.split("/").map(Number);

      if (!(start && end)) {
        throw new Error(`Invalid numbers in range: ${range}`);
      }

      return [start, end];
    };

    const [outerStart, outerEnd] =
      typeof outer === "string" ? parseRange(outer) : [outer, outer + 1];
    const [innerStart, innerEnd] =
      typeof inner === "string" ? parseRange(inner) : [inner, inner + 1];

    if (outerEnd - outerStart > 1) {
      for (let i = outerStart; i < outerEnd - 1; i += 1) {
        for (let j = innerStart; j < innerEnd; j += 1) {
          result.push(swapCoordinates ? [j, i] : [i, j]);
        }
      }
    }

    return result;
  };

  const removeBorderBottomCoordinates: number[][][] = [];
  const removeBorderRightCoordinates: number[][][] = [];

  for (let i = 0; i < colRowSpan.colSpan.length; i += 1) {
    const columnSpan = colRowSpan.colSpan[i];
    const rowSpan = colRowSpan.rowSpan[i];

    if (!(columnSpan && rowSpan)) {
      continue;
    }

    const removeBorderBottomCoordinatesTmp = getCoordinates(
      rowSpan,
      columnSpan,
      true
    );
    removeBorderBottomCoordinates.push(removeBorderBottomCoordinatesTmp);

    const removeBorderRightCoordinatesTmp = getCoordinates(
      columnSpan,
      rowSpan,
      false
    );
    removeBorderRightCoordinates.push(removeBorderRightCoordinatesTmp);
  }

  const extractCoordinates = (coordinates: number[][]) =>
    coordinates.map((i) => `${i[0]}-${i[1]}`);

  const flatRemoveBorderBottom =
    removeBorderBottomCoordinates.flatMap(extractCoordinates);
  const flatRemoveBorderRight =
    removeBorderRightCoordinates.flatMap(extractCoordinates);

  return (
    <div className={cn("pointer-events-none z-10 contents", className)}>
      {Array.from({ length: rows }, (_, y) => `row-${y + 1}`).map(
        (rowKey, y) => (
          <Fragment key={rowKey}>
            {Array.from(
              { length: columns },
              (_, x) => `cell-${x + 1}-${y + 1}`
            ).map((cellKey, x) => (
              <div
                className={cn(
                  "absolute inset-0 col-start-[var(--x)] col-end-[span_1] row-start-[var(--y)] row-end-[span_1] border-[var(--guide-color)] [border-left:none] [border-top:none] [border-width:var(--guide-width)]",
                  y + 1 === rows && "[border-bottom:none]",
                  x + 1 === columns && "[border-right:none]",
                  hideGuides === "row" && "[border-bottom:none]",
                  hideGuides === "column" && "[border-right:none]",
                  flatRemoveBorderBottom.includes(`${x + 1}-${y + 1}`) &&
                    "[border-bottom:none]",
                  flatRemoveBorderRight.includes(`${x + 1}-${y + 1}`) &&
                    "[border-right:none]"
                )}
                key={cellKey}
                style={
                  {
                    "--x": x + 1,
                    "--y": y + 1,
                  } as React.CSSProperties
                }
              />
            ))}
          </Fragment>
        )
      )}
    </div>
  );
}

type CellBreakpoints = Responsive<string | number>;

interface CellProps extends React.ComponentPropsWithRef<"div"> {
  column?: string | CellBreakpoints;
  row?: string | CellBreakpoints;
  solid?: boolean;
}

function Cell({
  children,
  className,
  column,
  row,
  solid = false,
  ...props
}: CellProps) {
  let columnStyle: Record<string, unknown> | undefined;
  if (typeof column === "object") {
    columnStyle = getBreakpointStyles(column, "grid-column");
  } else if (column === undefined) {
    columnStyle = undefined;
  } else {
    columnStyle = { "--grid-column": column };
  }

  let rowStyle: Record<string, unknown> | undefined;
  if (typeof row === "object") {
    rowStyle = getBreakpointStyles(row, "grid-row");
  } else if (row === undefined) {
    rowStyle = undefined;
  } else {
    rowStyle = { "--grid-row": row };
  }

  return (
    <div
      className={cn(
        "z-20 p-12 [grid-column:var(--grid-column)] [grid-row:var(--grid-row)]",
        typeof column === "object" && getClassesNames("grid-column"),
        typeof column === "object" && getClassesNames("grid-row"),
        className
      )}
      data-grid-cell=""
      data-grid-cell-solid={solid}
      style={{ ...columnStyle, ...rowStyle, ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
}

function Divider({ className, ...props }: React.ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "h-4 border-b-foreground/10 [border-bottom-width:var(--guide-width)]",
        className
      )}
      {...props}
    />
  );
}

interface CrossProps extends React.ComponentPropsWithRef<"div"> {
  column?: number | CellBreakpoints;
  row?: number | CellBreakpoints;
  size?: number;
}

function Cross({
  className,
  size = 16,
  style,
  column,
  row,
  ...props
}: CrossProps) {
  const columnBreakpointStyles =
    typeof column === "object"
      ? getBreakpointStyles(column, "cross-column")
      : { "--cross-column": `${column}` };
  const rowBreakpointStyles =
    typeof row === "object"
      ? getBreakpointStyles(row, "cross-row")
      : { "--cross-row": `${row}` };

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-[calc(var(--cross-half-size)_*_-1)] size-fit [grid-column-start:var(--cross-column)] [grid-row-start:var(--cross-row)]",
        typeof column === "object" && getClassesNames("cross-column"),
        typeof column === "object" && getClassesNames("cross-row"),
        className
      )}
      style={
        {
          "--cross-half-size":
            "calc((var(--cross-size) / 2) + var(--guide-width) - 0.5px)",
          "--cross-size": `${size}px`,
          ...columnBreakpointStyles,
          ...rowBreakpointStyles,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="absolute h-(--cross-size) w-(--cross-half-size) border-foreground [border-right-width:var(--guide-width)]" />
      <div className="absolute h-(--cross-half-size) w-(--cross-size) border-foreground [border-bottom-width:var(--guide-width)]" />
    </div>
  );
}

const getBreakpointStyles = (
  breakpoints: CellBreakpoints,
  property: string
) => {
  const styles: Record<string, unknown> = {};

  // Set CSS variables for each defined breakpoint
  for (const size of breakpointsOrder) {
    if (breakpoints[size] === undefined) {
      styles[`--${size}-${property}`] = "initial";
    } else {
      styles[`--${size}-${property}`] = breakpoints[size];
    }
  }

  return styles;
};

const responsiveClassNamesVariants: Record<string, string> = {
  "cross-column":
    "[--cross-column:var(--xs-cross-column)] sm:[--cross-column:var(--sm-cross-column,var(--xs-cross-column))] md:[--cross-column:var(--md-cross-column,var(--sm-cross-column,var(--xs-cross-column)))] lg:[--cross-column:var(--lg-cross-column,var(--md-cross-column,var(--sm-cross-column,var(--xs-cross-column))))] xl:[--cross-column:var(--xl-cross-column,var(--lg-cross-column,var(--md-cross-column,var(--sm-cross-column,var(--xs-cross-column)))))] 2xl:[--cross-column:var(--2xl-cross-column,var(--xl-cross-column,var(--lg-cross-column,var(--md-cross-column,var(--sm-cross-column,var(--xs-cross-column))))))]",
  "cross-row":
    "[--cross-row:var(--xs-cross-row)] sm:[--cross-row:var(--sm-cross-row,var(--xs-cross-row))] md:[--cross-row:var(--md-cross-row,var(--sm-cross-row,var(--xs-cross-row)))] lg:[--cross-row:var(--lg-cross-row,var(--md-cross-row,var(--sm-cross-row,var(--xs-cross-row))))] xl:[--cross-row:var(--xl-cross-row,var(--lg-cross-row,var(--md-cross-row,var(--sm-cross-row,var(--xs-cross-row)))))] 2xl:[--cross-row:var(--2xl-cross-row,var(--xl-cross-row,var(--lg-cross-row,var(--md-cross-row,var(--sm-cross-row,var(--xs-cross-row))))))]",
  "grid-column":
    "[--grid-column:var(--xs-grid-column)] sm:[--grid-column:var(--sm-grid-column,var(--xs-grid-column))] md:[--grid-column:var(--md-grid-column,var(--sm-grid-column,var(--xs-grid-column)))] lg:[--grid-column:var(--lg-grid-column,var(--md-grid-column,var(--sm-grid-column,var(--xs-grid-column))))] xl:[--grid-column:var(--xl-grid-column,var(--lg-grid-column,var(--md-grid-column,var(--sm-grid-column,var(--xs-grid-column)))))] 2xl:[--grid-column:var(--2xl-grid-column,var(--xl-grid-column,var(--lg-grid-column,var(--md-grid-column,var(--sm-grid-column,var(--xs-grid-column))))))]",

  "grid-columns":
    "[--grid-columns:var(--xs-grid-columns)] sm:[--grid-columns:var(--sm-grid-columns,var(--xs-grid-columns))] md:[--grid-columns:var(--md-grid-columns,var(--sm-grid-columns,var(--xs-grid-columns)))] lg:[--grid-columns:var(--lg-grid-columns,var(--md-grid-columns,var(--sm-grid-columns,var(--xs-grid-columns))))] xl:[--grid-columns:var(--xl-grid-columns,var(--lg-grid-columns,var(--md-grid-columns,var(--sm-grid-columns,var(--xs-grid-columns)))))] 2xl:[--grid-columns:var(--2xl-grid-columns,var(--xl-grid-columns,var(--lg-grid-columns,var(--md-grid-columns,var(--sm-grid-columns,var(--xs-grid-columns))))))]",
  "grid-row":
    "[--grid-row:var(--xs-grid-row)] sm:[--grid-row:var(--sm-grid-row,var(--xs-grid-row))] md:[--grid-row:var(--md-grid-row,var(--sm-grid-row,var(--xs-grid-row)))] lg:[--grid-row:var(--lg-grid-row,var(--md-grid-row,var(--sm-grid-row,var(--xs-grid-row))))] xl:[--grid-row:var(--xl-grid-row,var(--lg-grid-row,var(--md-grid-row,var(--sm-grid-row,var(--xs-grid-row)))))] 2xl:[--grid-row:var(--2xl-grid-row,var(--xl-grid-row,var(--lg-grid-row,var(--md-grid-row,var(--sm-grid-row,var(--xs-grid-row))))))]",
  "grid-rows":
    "[--grid-rows:var(--xs-grid-rows)] sm:[--grid-rows:var(--sm-grid-rows,var(--xs-grid-rows))] md:[--grid-rows:var(--md-grid-rows,var(--sm-grid-rows,var(--xs-grid-rows)))] lg:[--grid-rows:var(--lg-grid-rows,var(--md-grid-rows,var(--sm-grid-rows,var(--xs-grid-rows))))] xl:[--grid-rows:var(--xl-grid-rows,var(--lg-grid-rows,var(--md-grid-rows,var(--sm-grid-rows,var(--xs-grid-rows)))))] 2xl:[--grid-rows:var(--2xl-grid-rows,var(--xl-grid-rows,var(--lg-grid-rows,var(--md-grid-rows,var(--sm-grid-rows,var(--xs-grid-rows))))))]",
};

const getClassesNames = (property: string) =>
  responsiveClassNamesVariants[property] ?? "";

export const Grid = Object.assign(Root, {
  Cell,
  Cross,
  Divider,
  System,
});
