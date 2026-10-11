"use client";

import { DayPicker } from "@daypicker/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Icon } from "./icon";

export type {
  DateRange,
  DayOfWeek,
  DropdownProps,
} from "@daypicker/react";

const buttonClassNames = cn(
  "relative flex size-(--cell-size) items-center justify-center rounded-lg text-foreground text-sm not-in-data-selected:hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
  "[&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
);

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: userComponents,
  mode = "single",
  ...props
}: React.ComponentProps<typeof DayPicker>): React.ReactElement {
  const defaultClassNames = {
    button_next: buttonClassNames,
    button_previous: buttonClassNames,
    caption_label: "text-sm font-medium flex items-center gap-2 h-full",
    day: "size-(--cell-size) text-sm py-px",
    day_button: cn(
      buttonClassNames,
      "in-data-disabled:pointer-events-none in-[.range-middle]:rounded-none in-[.range-end:not(.range-start)]:rounded-s-none in-[.range-start:not(.range-end)]:rounded-e-none in-[.range-middle]:in-data-selected:bg-accent in-data-selected:bg-foreground in-[.range-middle]:in-data-selected:text-foreground in-data-disabled:text-foreground-muted/72 in-data-outside:text-foreground-muted/72 in-data-selected:in-data-outside:text-background in-data-selected:text-background in-data-disabled:line-through outline-none in-[[data-selected]:not(.range-middle)]:transition-[color,background-color,border-radius,box-shadow] focus-visible:z-1 focus-visible:ring-[3px] focus-visible:ring-foreground/50"
    ),
    dropdown: "absolute bg-background inset-0 opacity-0",
    dropdown_root: cn(
      "relative h-8 rounded-lg border px-[calc(--spacing(3)-1px)] has-focus:border-foreground has-focus:ring-[3px] has-focus:ring-foreground/50",
      "[&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-me-1"
    ),
    dropdowns:
      "w-full flex items-center text-sm justify-center h-(--cell-size) gap-1.5 *:[span]:font-medium",
    hidden: "invisible",
    month: "w-full",
    month_caption:
      "relative mx-(--cell-size) px-1 mb-1 flex h-(--cell-size) items-center justify-center z-2",
    months: "relative flex flex-col sm:flex-row gap-2",
    nav: "absolute top-0 flex w-full justify-between z-1",
    outside:
      "text-foreground-muted data-selected:bg-accent/50 data-selected:text-foreground-muted",
    range_end: "range-end",
    range_middle: "range-middle",
    range_start: "range-start",
    today:
      "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-1 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-foreground [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
    week_number:
      "size-(--cell-size) p-0 text-xs font-medium text-foreground-muted/72",
    weekday:
      "size-(--cell-size) p-0 text-xs font-medium text-foreground-muted/72",
  };
  const mergedClassNames: typeof defaultClassNames = Object.keys(
    defaultClassNames
  ).reduce(
    (acc, key) => {
      const userClass = classNames?.[key as keyof typeof classNames];
      const baseClass =
        defaultClassNames[key as keyof typeof defaultClassNames];

      acc[key as keyof typeof defaultClassNames] = userClass
        ? cn(baseClass, userClass)
        : baseClass;

      return acc;
    },
    { ...defaultClassNames } as typeof defaultClassNames
  );

  const defaultComponents = {
    // biome-ignore lint/correctness/noNestedComponentDefinitions: we follow the official implementation
    Chevron: ({
      className: chevronClassName,
      orientation,
      ...chevronProps
    }: {
      className?: string;
      orientation?: "left" | "right" | "up" | "down";
    }): React.ReactElement => {
      if (orientation === "left") {
        return (
          <Icon
            aria-hidden="true"
            className={cn(chevronClassName, "rtl:rotate-180")}
            icon={ChevronLeftIcon}
            {...chevronProps}
          />
        );
      }

      if (orientation === "right") {
        return (
          <Icon
            aria-hidden="true"
            className={cn(chevronClassName, "rtl:rotate-180")}
            icon={ChevronRightIcon}
            {...chevronProps}
          />
        );
      }

      return (
        <Icon
          aria-hidden="true"
          className={chevronClassName}
          icon={UnfoldMoreIcon}
          {...chevronProps}
        />
      );
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  };

  const dayPickerProps = {
    className: cn("w-fit [--cell-size:--spacing(9)]", className),
    classNames: mergedClassNames,
    components: mergedComponents,
    "data-slot": "calendar",
    formatters: {
      formatMonthDropdown: (date: Date) =>
        date.toLocaleString("default", { month: "short" }),
    } as React.ComponentProps<typeof DayPicker>["formatters"],
    mode,
    showOutsideDays,
    ...props,
  };

  return (
    <DayPicker
      {...(dayPickerProps as React.ComponentProps<typeof DayPicker>)}
    />
  );
}
