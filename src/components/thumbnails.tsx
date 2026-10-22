import type { IconSvgElement } from "@hugeicons/react";

import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CursorTextIcon,
  InformationCircleIcon,
  LinkSquare02Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Icon } from "@/registry/ui/icon";

const primary = "bg-linear-to-b from-foreground/85 to-foreground";

function Glyph({
  icon,
  className,
}: {
  icon: IconSvgElement;
  className?: string;
}) {
  return (
    <Icon
      className={cn("shrink-0 text-foreground-muted", className)}
      icon={icon}
      size={16}
    />
  );
}

function Bar({
  className,
  variant = "main",
}: {
  className?: string;
  variant?: "main" | "secondary";
}) {
  return (
    <div
      className={cn(
        "h-1.5 rounded-full",
        variant === "main"
          ? "bg-foreground-muted/40"
          : "bg-foreground-muted/20",
        className
      )}
    />
  );
}

function Action({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <div
      className={cn(
        "w-7 rounded-sm",
        variant === "primary"
          ? cn("h-4", primary)
          : "h-1.5 bg-foreground-muted/20",
        className
      )}
    />
  );
}

function Surface({
  children,
  className,
  flat = false,
}: {
  children?: React.ReactNode;
  className?: string;
  flat?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full max-w-72 flex-col rounded-2xl border bg-clip-padding shadow-foreground/5 shadow-md",
        flat
          ? "bg-background dark:bg-background-muted"
          : "bg-linear-to-b from-background to-background-muted dark:from-accent dark:to-background-muted",
        className
      )}
    >
      {children}
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 p-6", className)}>{children}</div>;
}

function Region({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-foreground/15 border-dashed",
        className
      )}
    />
  );
}

function CheckboxItem({
  checked = false,
  className,
}: {
  checked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-4 shrink-0 rounded",
          checked ? primary : "bg-foreground-muted/20"
        )}
      />
      <Bar className="w-full" variant="secondary" />
    </div>
  );
}

function RadioItem({ checked = false }: { checked?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full",
          checked ? primary : "bg-foreground-muted/20"
        )}
      >
        {checked ? (
          <div className="size-1.5 rounded-full bg-background" />
        ) : null}
      </div>
      <Bar className="w-full" variant="secondary" />
    </div>
  );
}

function FormField({
  labelClassName = "w-16",
  error = false,
}: {
  labelClassName?: string;
  error?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Bar className={labelClassName} />
      <Surface className="rounded-[10px]" flat>
        <Panel className="py-3.5" />
      </Surface>
      {error ? (
        <Bar className="w-[80%] bg-destructive/40" variant="secondary" />
      ) : null}
    </div>
  );
}

function TableRow({ header = false }: { header?: boolean }) {
  const variant = header ? "main" : "secondary";

  return (
    <div className="flex items-center gap-2 p-3">
      <Bar className="size-2.5 rounded-xs" />
      <Bar className="flex-1" />
      <Bar className="flex-1" variant={variant} />
      <Bar className="flex-1" variant={variant} />
      <Bar className="flex-1" variant={variant} />
    </div>
  );
}

function CommandItem() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Bar className="w-[65%]" variant="secondary" />
      <Bar className="w-4" variant="secondary" />
    </div>
  );
}

function SegmentedControl() {
  return (
    <div className="flex rounded-lg bg-foreground-muted/12 p-0.5">
      <div className="rounded-[calc(var(--radius-lg)-2px)] bg-background p-3 shadow-foreground/5 shadow-xs dark:bg-accent">
        <Bar className="w-6 bg-foreground" />
      </div>
      <div className="p-3">
        <Bar className="w-6" variant="secondary" />
      </div>
      <div className="p-3">
        <Bar className="w-6" variant="secondary" />
      </div>
    </div>
  );
}

const calendarWeeks: ("main" | "secondary" | "today" | null)[][] = [
  ["secondary", "secondary", "main", null, "main"],
  ["main", null, "main", "main", "main"],
  [null, "main", "today", "main", null],
  ["main", "main", null, "secondary", "secondary"],
];

const accordion = (
  <Surface className="max-w-50">
    <Panel className="divide-y p-0">
      <div className="flex items-center gap-2 p-3">
        <Glyph icon={ArrowDown01Icon} />
        <Bar className="w-[60%]" />
      </div>
      <div className="flex items-start gap-2 p-3">
        <Glyph className="rotate-180" icon={ArrowDown01Icon} />
        <div className="flex flex-1 flex-col gap-2 pt-1.5">
          <Bar className="w-[50%]" />
          <Bar className="w-[90%]" variant="secondary" />
        </div>
      </div>
      <div className="flex items-center gap-2 p-3">
        <Glyph icon={ArrowDown01Icon} />
        <Bar className="w-[60%]" />
      </div>
    </Panel>
  </Surface>
);

const alert = (
  <Surface>
    <Panel className="flex items-center gap-2 p-3">
      <Glyph icon={AlertCircleIcon} />
      <Bar className="w-[70%]" variant="secondary" />
    </Panel>
  </Surface>
);

const alertDialog = (
  <Surface className="max-w-50">
    <Panel className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-2">
        <Bar className="w-[50%]" />
        <Bar className="w-[90%]" variant="secondary" />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Action />
        <Action
          className="from-destructive/85 to-destructive"
          variant="primary"
        />
      </div>
    </Panel>
  </Surface>
);

const autocomplete = (
  <div className="flex max-w-50 flex-1 flex-col gap-2">
    <Surface className="rounded-xl" flat>
      <Panel className="flex items-center gap-2 px-4 py-2">
        <Bar className="w-[40%]" />
        <Glyph className="-ms-1.5" icon={CursorTextIcon} />
      </Panel>
    </Surface>
    <Surface className="rounded-[10px]">
      <Panel className="flex flex-col gap-4 p-4">
        <Bar variant="secondary" />
        <Bar variant="secondary" />
        <Bar variant="secondary" />
      </Panel>
    </Surface>
  </div>
);

const avatar = (
  <div className="flex -space-x-2">
    {[0, 1, 2].map((index) => (
      <Surface
        className="size-12 items-center justify-center rounded-full ring-2 ring-background"
        key={index}
      >
        <Glyph icon={UserIcon} />
      </Surface>
    ))}
  </div>
);

const badge = (
  <div className="flex items-center gap-2">
    <Surface className="w-auto rounded-full">
      <Panel className="flex items-center gap-1.5 px-2.5 py-2">
        <div className="size-1.5 rounded-full bg-success" />
        <Bar className="w-8" />
      </Panel>
    </Surface>
    <Surface className="w-auto rounded-full">
      <Panel className="flex items-center gap-1.5 px-2.5 py-2">
        <div className="size-1.5 rounded-full bg-foreground-muted/60" />
        <Bar className="w-10" />
      </Panel>
    </Surface>
  </div>
);

const breadcrumb = (
  <Surface>
    <Panel className="flex items-center gap-1 p-3">
      <Bar className="flex-1" variant="secondary" />
      <Glyph icon={ArrowRight01Icon} />
      <Bar className="flex-1" variant="secondary" />
      <Glyph icon={ArrowRight01Icon} />
      <Bar className="flex-1" />
    </Panel>
  </Surface>
);

const button = (
  <div className="flex items-center gap-2">
    <Surface className="w-auto rounded-[14px]">
      <Panel className="px-6 py-4">
        <Bar className="w-8" />
      </Panel>
    </Surface>
    <div className={cn("rounded-[14px] px-6 py-4 shadow-md", primary)}>
      <Bar className="w-8 bg-background/50" />
    </div>
  </div>
);

const calendar = (
  <Surface className="max-w-36 rounded-[14px]">
    <Panel className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Glyph icon={ArrowLeft01Icon} />
        <Bar className="flex-1" variant="secondary" />
        <Glyph icon={ArrowRight01Icon} />
      </div>
      {calendarWeeks.map((week, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static rows
        <div className="flex items-center gap-2" key={row}>
          {week.map((day, column) => (
            <Bar
              className={cn(
                "flex-1",
                day === null && "bg-transparent",
                day === "today" && "bg-foreground"
              )}
              // biome-ignore lint/suspicious/noArrayIndexKey: static cells
              key={column}
              variant={day === "secondary" ? "secondary" : "main"}
            />
          ))}
        </div>
      ))}
    </Panel>
  </Surface>
);

const card = (
  <Surface className="max-w-36 rounded-[14px]">
    <Panel className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <Bar className="w-[60%]" />
        <Bar className="w-[90%]" variant="secondary" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 rounded-sm bg-foreground-muted/8" />
        <div className="h-4 rounded-sm bg-foreground-muted/8" />
        <Action className="w-full" variant="primary" />
      </div>
    </Panel>
  </Surface>
);

const checkbox = (
  <div className="flex max-w-28 flex-1 flex-col gap-3">
    <CheckboxItem />
    <CheckboxItem checked />
  </div>
);

const checkboxGroup = (
  <div className="flex max-w-28 flex-1 flex-col gap-3">
    <CheckboxItem checked />
    <CheckboxItem className="ps-4" />
    <CheckboxItem checked className="ps-4" />
    <CheckboxItem className="ps-4" />
  </div>
);

const collapsible = (
  <Surface className="max-w-50">
    <Panel className="divide-y p-0">
      <div className="flex items-center justify-between px-4 py-3">
        <Bar className="w-[60%]" />
        <Glyph icon={ArrowDown01Icon} />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Bar className="w-[80%]" variant="secondary" />
        <Bar className="w-[70%]" variant="secondary" />
      </div>
    </Panel>
  </Surface>
);

const combobox = (
  <Surface className="max-w-56 rounded-[14px]" flat>
    <Panel className="flex items-center gap-2 px-3 py-2.5">
      {["w-6", "w-8"].map((width) => (
        <div
          className="flex h-5 items-center gap-1 rounded-sm bg-foreground-muted/8 ps-2 pe-1"
          key={width}
        >
          <Bar className={width} />
          <Glyph className="size-3" icon={Cancel01Icon} />
        </div>
      ))}
      <Glyph className="-ms-1" icon={CursorTextIcon} />
    </Panel>
  </Surface>
);

const command = (
  <Surface className="max-w-50">
    <Panel className="divide-y p-0">
      <div className="flex items-center gap-2 px-4 py-3">
        <Glyph icon={Search01Icon} />
        <Bar className="w-[40%]" />
      </div>
      <div className="flex flex-col gap-4 p-4">
        <CommandItem />
        <CommandItem />
        <CommandItem />
      </div>
    </Panel>
  </Surface>
);

const contextMenu = (
  <div className="flex max-w-50 flex-1 flex-col">
    <Region className="min-h-20 rounded-[10px]" />
    <Surface className="ms-auto -mt-3 w-fit rounded-[10px]">
      <Panel className="flex flex-col gap-3 p-3">
        <Bar className="w-16" variant="secondary" />
        <Bar className="w-16" variant="secondary" />
        <Bar className="w-16" variant="secondary" />
      </Panel>
    </Surface>
  </div>
);

const datePicker = (
  <div className="flex max-w-44 flex-1 flex-col gap-2">
    <Surface className="rounded-[14px]" flat>
      <Panel className="flex items-center gap-2 p-3">
        <Glyph icon={Calendar03Icon} />
        <Bar className="w-[60%]" />
      </Panel>
    </Surface>
    <Surface className="rounded-[14px]">
      <Panel className="grid grid-cols-5 gap-2 p-3">
        {Array.from({ length: 10 }, (_, index) => (
          <Bar
            className={cn(index === 6 && "bg-foreground")}
            // biome-ignore lint/suspicious/noArrayIndexKey: static cells
            key={index}
            variant={index < 2 ? "secondary" : "main"}
          />
        ))}
      </Panel>
    </Surface>
  </div>
);

const dialog = (
  <div className="relative flex w-full flex-1 items-center justify-center self-stretch">
    <div className="absolute inset-0 rounded-xl bg-foreground/[0.04]" />
    <Surface className="max-w-36 rounded-[14px]">
      <Panel className="flex flex-col gap-4 p-4">
        <Bar className="w-[60%]" />
        <div className="flex flex-col gap-2">
          <div className="h-4 rounded-sm bg-foreground-muted/8" />
          <div className="h-4 rounded-sm bg-foreground-muted/8" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Action />
          <Action variant="primary" />
        </div>
      </Panel>
    </Surface>
  </div>
);

const drawer = (
  <div className="flex w-full flex-1 flex-col justify-end gap-2 self-stretch">
    <Region className="flex-1" />
    <Surface className="max-w-none shrink-0 rounded-[14px]">
      <Panel className="pt-1 pb-10">
        <div className="flex justify-center py-2">
          <div className="h-1 w-12 rounded-full bg-foreground-muted/30" />
        </div>
      </Panel>
    </Surface>
  </div>
);

const empty = (
  <div className="flex w-full max-w-56 flex-col items-center gap-2 rounded-2xl border border-foreground/15 border-dashed p-6">
    <div className="mb-1 size-8 rounded-full bg-foreground-muted/20" />
    <Bar className="w-[60%]" />
    <Bar className="w-[80%]" variant="secondary" />
  </div>
);

const field = (
  <div className="flex max-w-50 flex-1 flex-col gap-3">
    <FormField error />
  </div>
);

const fieldset = (
  <div className="flex max-w-50 flex-1 flex-col gap-4">
    <FormField />
    <FormField labelClassName="w-12" />
  </div>
);

const form = (
  <div className="flex max-w-50 flex-1 flex-col gap-4">
    <FormField />
    <div className={cn("rounded-[10px] py-3.5", primary)} />
  </div>
);

const grid = (
  <div className="relative grid w-full max-w-50 grid-cols-2 gap-px overflow-hidden rounded-xl bg-foreground/10 p-px">
    {[0, 1, 2, 3].map((index) => (
      <div
        className="flex flex-col gap-2 bg-background p-4 dark:bg-background-muted"
        key={index}
      >
        <Bar className="w-[60%]" />
        <Bar variant="secondary" />
      </div>
    ))}
  </div>
);

const group = (
  <Surface className="w-auto flex-row divide-x rounded-[14px]">
    <Panel className="px-6 py-4">
      <Bar className="w-6" />
    </Panel>
    <Panel className="px-6 py-4">
      <Bar className="w-6" />
    </Panel>
    <Panel className="flex items-center px-3 py-4">
      <Glyph icon={ArrowDown01Icon} />
    </Panel>
  </Surface>
);

const input = (
  <Surface className="max-w-50 rounded-[14px]" flat>
    <Panel className="flex items-center gap-1 px-6 py-4">
      <Bar className="w-[50%]" />
      <Glyph className="-my-2" icon={CursorTextIcon} />
    </Panel>
  </Surface>
);

const inputGroup = (
  <Surface className="max-w-56 rounded-[14px]" flat>
    <Panel className="flex items-center gap-2 px-4 py-2.5">
      <Glyph icon={Search01Icon} />
      <Bar className="w-[50%]" />
      <div className="ms-auto rounded border bg-background-muted px-1.5 py-0.5 text-[0.625rem] text-foreground-muted leading-none">
        ⌘K
      </div>
    </Panel>
  </Surface>
);

const kbd = (
  <div className="flex items-center justify-center gap-2">
    {["⌘", "K"].map((key) => (
      <Surface
        className="size-10 items-center justify-center rounded-[10px] text-foreground-muted"
        key={key}
      >
        {key}
      </Surface>
    ))}
  </div>
);

const label = (
  <div className="flex max-w-50 flex-1 flex-col gap-3">
    <Bar className="w-16 bg-foreground" />
    <Surface className="rounded-[10px]" flat>
      <Panel className="py-3.5" />
    </Surface>
  </div>
);

const link = (
  <div className="flex max-w-50 flex-1 flex-col gap-2.5">
    <Bar variant="secondary" />
    <div className="flex items-center gap-1.5">
      <Bar className="w-[30%]" variant="secondary" />
      <div className="flex flex-col gap-0.5">
        <Bar className="w-14 bg-foreground" />
        <div className="h-px w-14 bg-foreground/60" />
      </div>
      <Glyph className="size-3.5 text-foreground" icon={LinkSquare02Icon} />
    </div>
    <Bar className="w-[70%]" variant="secondary" />
  </div>
);

const loading = (
  <div className="flex items-center gap-6">
    <div className="size-8 rotate-45 rounded-full border-3 border-foreground-muted/20 border-t-foreground" />
    <div className="flex gap-1.5">
      <div className="size-2 rounded-full bg-foreground" />
      <div className="size-2 rounded-full bg-foreground/50" />
      <div className="size-2 rounded-full bg-foreground/20" />
    </div>
  </div>
);

const menu = (
  <div className="flex max-w-50 flex-1 flex-col items-end gap-2">
    <Surface className="w-fit rounded-xl">
      <Panel className="p-2">
        <Glyph icon={MoreHorizontalIcon} />
      </Panel>
    </Surface>
    <Surface className="rounded-[10px]">
      <Panel className="flex flex-col gap-4 p-4">
        <Bar className="me-6" variant="secondary" />
        <div className="flex items-center gap-4">
          <Bar className="flex-1" variant="secondary" />
          <Glyph className="-m-1" icon={ArrowRight01Icon} />
        </div>
        <Bar className="me-6" variant="secondary" />
      </Panel>
    </Surface>
  </div>
);

const meter = (
  <div className="flex max-w-50 flex-1 flex-col gap-2">
    <div className="flex items-center justify-between">
      <Bar className="w-[50%]" />
      <Bar className="w-8" />
    </div>
    <div className="h-2 w-full rounded-full bg-foreground-muted/20">
      <div className={cn("h-2 w-[65%] rounded-s-full", primary)} />
    </div>
  </div>
);

const numberField = (
  <Surface className="max-w-44 rounded-[14px]">
    <Panel className="flex items-center gap-2 px-4 py-2.5">
      <Glyph icon={MinusSignIcon} />
      <div className="flex flex-1 justify-center">
        <Bar className="w-10" />
      </div>
      <Glyph icon={PlusSignIcon} />
    </Panel>
  </Surface>
);

const otpField = (
  <div className="flex items-center gap-2">
    {[0, 1, 2].map((index) => (
      <Surface
        className="size-10 items-center justify-center rounded-xl"
        flat
        key={index}
      >
        <div className="size-1.5 rounded-full bg-foreground-muted/40" />
      </Surface>
    ))}
    <Surface
      className="size-10 items-center justify-center rounded-xl border-foreground/40 ring-2 ring-foreground/10"
      flat
    >
      <Glyph icon={CursorTextIcon} />
    </Surface>
  </div>
);

const pagination = (
  <div className="flex max-w-56 flex-1 items-center gap-2">
    <Surface className="w-fit rounded-xl">
      <Panel className="p-2">
        <Glyph icon={ArrowLeft01Icon} />
      </Panel>
    </Surface>
    <div className="flex flex-1 items-center gap-1">
      <div className="flex flex-1 justify-center p-2">
        <Bar className="w-2" variant="secondary" />
      </div>
      <Surface className="flex-1 items-center rounded-lg p-2" flat>
        <Bar className="w-2 bg-foreground" />
      </Surface>
      <div className="flex flex-1 justify-center p-2">
        <Bar className="w-2" variant="secondary" />
      </div>
    </div>
    <Surface className="w-fit rounded-xl">
      <Panel className="p-2">
        <Glyph icon={ArrowRight01Icon} />
      </Panel>
    </Surface>
  </div>
);

const popover = (
  <div className="flex max-w-50 flex-1 flex-col items-center gap-2">
    <Surface className="w-fit rounded-xl">
      <Panel className="px-4 py-3">
        <Bar className="w-12" />
      </Panel>
    </Surface>
    <Surface className="rounded-[10px]">
      <Panel className="flex flex-col gap-3 p-4">
        <Bar className="w-[70%]" />
        <div className="flex flex-col gap-1.5">
          <Bar className="w-[80%]" variant="secondary" />
          <Bar className="w-[60%]" variant="secondary" />
        </div>
      </Panel>
    </Surface>
  </div>
);

/*
 * The trigger lives in a clipped container, the popup escapes it. That
 * overflow is the reason to reach for a portal.
 */
const portal = (
  <div className="relative w-full max-w-50">
    <div className="h-20 overflow-hidden rounded-xl border border-foreground/15 border-dashed p-3">
      <div className="flex flex-col gap-2">
        <Bar className="w-[40%]" />
        <Bar className="w-[70%]" variant="secondary" />
      </div>
    </div>
    <Surface className="absolute -end-4 top-12 w-28 rounded-[10px]">
      <Panel className="flex flex-col gap-3 p-3">
        <Bar variant="secondary" />
        <Bar className="w-[70%]" variant="secondary" />
        <Bar className="w-[85%]" variant="secondary" />
      </Panel>
    </Surface>
  </div>
);

const previewCard = (
  <div className="flex max-w-50 flex-1 flex-col items-start gap-2">
    <div className="flex flex-col gap-0.5 ps-1">
      <Bar className="w-12 bg-foreground" />
      <div className="h-px w-12 bg-foreground/60" />
    </div>
    <Surface>
      <Panel className="flex items-center gap-3 p-4">
        <div className="size-9 shrink-0 rounded-full bg-foreground-muted/20" />
        <div className="flex flex-1 flex-col gap-2">
          <Bar className="w-[70%]" />
          <Bar variant="secondary" />
          <Bar className="w-[90%]" variant="secondary" />
        </div>
      </Panel>
    </Surface>
  </div>
);

const progress = (
  <div className="flex max-w-50 flex-1 flex-col gap-2">
    <div className="flex items-center justify-between">
      <Bar className="w-[40%]" variant="secondary" />
      <Bar className="w-6" variant="secondary" />
    </div>
    <div className="h-1.5 w-full rounded-full bg-foreground-muted/20">
      <div className={cn("h-1.5 w-[45%] rounded-full", primary)} />
    </div>
  </div>
);

const radioGroup = (
  <div className="flex max-w-28 flex-1 flex-col gap-3">
    <RadioItem />
    <RadioItem checked />
    <RadioItem />
  </div>
);

const scrollArea = (
  <Surface className="max-w-36 rounded-[14px]">
    <Panel className="relative p-0">
      <div className="flex flex-col gap-2 p-3 pe-5">
        <Bar className="w-[80%]" variant="secondary" />
        <Bar className="w-[90%]" variant="secondary" />
        <Bar className="w-[70%]" variant="secondary" />
        <Bar className="w-[85%]" variant="secondary" />
        <Bar className="w-[90%]" variant="secondary" />
        <Bar className="w-[80%]" variant="secondary" />
      </div>
      <div className="absolute top-2 right-1.5 h-8 w-1 rounded-full bg-foreground-muted/40" />
    </Panel>
  </Surface>
);

const select = (
  <div className="flex max-w-44 flex-1 flex-col gap-2">
    <Surface className="rounded-[14px]" flat>
      <Panel className="flex items-center justify-between gap-2 py-2.5 ps-4 pe-2.5">
        <Bar className="w-[60%]" />
        <Glyph icon={ArrowDown01Icon} />
      </Panel>
    </Surface>
    <Surface className="rounded-[10px]">
      <Panel className="flex flex-col gap-1 p-1">
        <div className="rounded-md p-2">
          <Bar className="w-[70%]" variant="secondary" />
        </div>
        <div className="rounded-md bg-foreground-muted/10 p-2">
          <Bar className="w-[60%]" />
        </div>
      </Panel>
    </Surface>
  </div>
);

const separator = (
  <div className="max-w-50 flex-1 divide-y">
    <div className="flex flex-col gap-2 py-3">
      <Bar className="w-[60%]" />
      <Bar variant="secondary" />
    </div>
    <div className="flex items-center divide-x py-3">
      {[0, 1, 2, 3].map((index) => (
        <div className="flex-1 px-2 py-1 first:ps-0 last:pe-0" key={index}>
          <Bar variant="secondary" />
        </div>
      ))}
    </div>
  </div>
);

const sheet = (
  <div className="flex w-full flex-1 gap-2 self-stretch">
    <Region className="flex-1" />
    <Surface className="max-w-1/3 rounded-[14px]">
      <Panel className="flex flex-col gap-4 p-3">
        <div className="flex flex-1 flex-col gap-2">
          <Bar className="w-[60%]" />
          <Bar variant="secondary" />
        </div>
        <div className="flex justify-end">
          <Action variant="primary" />
        </div>
      </Panel>
    </Surface>
  </div>
);

const sidebar = (
  <Surface className="max-w-56 flex-row self-stretch overflow-hidden rounded-[14px]">
    <div className="flex w-[42%] flex-col gap-1 border-e bg-foreground-muted/[0.04] p-2">
      <div className="flex items-center gap-1.5 p-1.5">
        <div className="size-3 rounded bg-foreground" />
        <Bar className="flex-1" />
      </div>
      <div className="flex items-center gap-1.5 rounded-md bg-foreground-muted/12 p-1.5">
        <div className="size-2.5 rounded-sm bg-foreground-muted/50" />
        <Bar className="flex-1" />
      </div>
      {["w-[80%]", "w-[60%]", "w-[70%]"].map((width) => (
        <div className="flex items-center gap-1.5 p-1.5" key={width}>
          <div className="size-2.5 rounded-sm bg-foreground-muted/25" />
          <Bar className={width} variant="secondary" />
        </div>
      ))}
    </div>
    <Panel className="flex flex-col gap-2 p-3">
      <Bar className="w-[50%]" />
      <div className="mt-1 flex-1 rounded-md bg-foreground-muted/8" />
    </Panel>
  </Surface>
);

const skeleton = (
  <div className="flex max-w-50 flex-1 items-center gap-3 [mask-image:linear-gradient(100deg,black_0%,rgb(0_0_0/0.25)_25%,rgb(0_0_0/0.25)_75%,rgb(0_0_0/0.6)_100%)]">
    <div className="size-8 shrink-0 rounded-full bg-foreground-muted/25" />
    <div className="flex flex-1 flex-col gap-2">
      <Bar className="h-2" />
      <Bar className="h-2 w-[70%]" />
    </div>
  </div>
);

const slider = (
  <div className="flex w-full max-w-50 flex-col gap-3">
    <div className="flex items-center justify-between">
      <Bar className="w-[40%]" />
      <Bar className="w-6" variant="secondary" />
    </div>
    <div className="relative flex h-4 items-center">
      <div className="h-1.5 w-full rounded-full bg-foreground-muted/20" />
      <div className={cn("absolute h-1.5 w-[45%] rounded-full", primary)} />
      <div className="absolute start-[45%] size-4 -translate-x-1/2 rounded-full border bg-background shadow-foreground/10 shadow-sm dark:bg-foreground" />
    </div>
  </div>
);

const switchThumbnail = (
  <div className="flex flex-col gap-3">
    <div className="h-6 w-10 rounded-full bg-foreground-muted/20 p-0.5">
      <div className="size-5 rounded-full bg-background shadow-foreground/10 shadow-sm" />
    </div>
    <div className="h-6 w-10 rounded-full bg-foreground p-0.5">
      <div className="ms-auto size-5 rounded-full bg-background shadow-sm" />
    </div>
  </div>
);

const table = (
  <Surface>
    <Panel className="divide-y p-0">
      <TableRow header />
      <TableRow />
      <TableRow />
      <TableRow />
    </Panel>
  </Surface>
);

const tabs = (
  <div className="flex max-w-50 flex-col gap-4">
    <SegmentedControl />
    <div className="flex flex-col gap-2">
      <Bar className="w-[70%]" />
      <Bar variant="secondary" />
    </div>
  </div>
);

const textarea = (
  <Surface className="max-w-50 rounded-[14px]" flat>
    <Panel className="flex flex-col gap-2.5 px-5 py-4">
      <Bar className="w-[80%]" />
      <div className="flex items-center gap-1">
        <Bar className="w-[45%]" />
        <Glyph className="-my-2" icon={CursorTextIcon} />
      </div>
      <div className="mt-2 self-end">
        <div className="size-2 border-foreground-muted/40 border-r border-b" />
      </div>
    </Panel>
  </Surface>
);

const toast = (
  <div className="relative flex w-full max-w-60 flex-1 justify-center pt-6">
    <Surface className="absolute top-0 h-12 scale-80" />
    <Surface className="absolute top-3 h-12 scale-90" />
    <Surface>
      <Panel className="flex items-start gap-2 p-3">
        <Glyph icon={InformationCircleIcon} />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Bar className="w-[40%]" />
          <Bar className="w-[70%]" variant="secondary" />
        </div>
      </Panel>
    </Surface>
  </div>
);

const toggle = (
  <div className="flex items-center gap-2">
    <Surface className="w-auto rounded-[14px]">
      <Panel className="p-4">
        <Bar className="w-4" />
      </Panel>
    </Surface>
    <div className="rounded-[14px] bg-foreground-muted/12 p-4">
      <Bar className="w-4 bg-foreground" />
    </div>
  </div>
);

const toggleGroup = (
  <Surface className="w-auto flex-row divide-x overflow-hidden rounded-[14px]">
    <Panel className="p-4">
      <Bar className="w-4" />
    </Panel>
    <Panel className="bg-foreground-muted/12 p-4">
      <Bar className="w-4 bg-foreground" />
    </Panel>
    <Panel className="p-4">
      <Bar className="w-4" />
    </Panel>
  </Surface>
);

const tooltip = (
  <div className="flex max-w-32 flex-1 flex-col items-center gap-1">
    <div className="rounded-[10px] bg-foreground px-4 py-3 shadow-md">
      <Bar className="w-14 bg-background/50" />
    </div>
    <div className="-mt-2 size-2 rotate-45 bg-foreground" />
    <Glyph className="mt-1" icon={InformationCircleIcon} />
  </div>
);

const thumbnails: Record<string, React.ReactNode> = {
  accordion,
  alert,
  "alert-dialog": alertDialog,
  autocomplete,
  avatar,
  badge,
  breadcrumb,
  button,
  calendar,
  card,
  checkbox,
  "checkbox-group": checkboxGroup,
  collapsible,
  combobox,
  command,
  "context-menu": contextMenu,
  "date-picker": datePicker,
  dialog,
  drawer,
  empty,
  field,
  fieldset,
  form,
  grid,
  group,
  input,
  "input-group": inputGroup,
  kbd,
  label,
  link,
  loading,
  menu,
  meter,
  "number-field": numberField,
  "otp-field": otpField,
  pagination,
  popover,
  portal,
  "preview-card": previewCard,
  progress,
  "radio-group": radioGroup,
  "scroll-area": scrollArea,
  select,
  separator,
  sheet,
  sidebar,
  skeleton,
  slider,
  switch: switchThumbnail,
  table,
  tabs,
  textarea,
  toast,
  toggle,
  "toggle-group": toggleGroup,
  tooltip,
};

export function getComponentThumbnail(slug: string): React.ReactNode {
  return thumbnails[slug];
}
