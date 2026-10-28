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

/** A stable, uneven level for a heatmap or map cell. */
function level(row: number, column: number) {
  return (row * 7 + column * 13 + ((row * column) % 5)) % 5;
}

/** Degrees (0 = 12 o'clock, clockwise) to a point on a circle. */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;

  return {
    x: Math.round((cx + r * Math.cos(rad)) * 100) / 100,
    y: Math.round((cy + r * Math.sin(rad)) * 100) / 100,
  };
}

/**
 * An annular sector, or a pie wedge when `inner` is 0, with its straight edges pulled in by half
 * of `gap` so neighbours sit `gap` apart (no knockout stroke to match the surface underneath).
 */
function arcPath({
  cx,
  cy,
  outer,
  inner = 0,
  start,
  end,
  gap = 0,
}: {
  cx: number;
  cy: number;
  outer: number;
  inner?: number;
  start: number;
  end: number;
  gap?: number;
}) {
  const half = gap / 2;
  const inset = (r: number) => (Math.asin(half / r) * 180) / Math.PI;
  const large = end - start > 180 ? 1 : 0;
  const o0 = polar(cx, cy, outer, start + inset(outer));
  const o1 = polar(cx, cy, outer, end - inset(outer));
  const arc = `M${o0.x} ${o0.y}A${outer} ${outer} 0 ${large} 1 ${o1.x} ${o1.y}`;

  if (inner <= 0) {
    const sweep = ((end - start) * Math.PI) / 360;
    const apex = polar(cx, cy, half / Math.sin(sweep), (start + end) / 2);

    return `${arc}L${apex.x} ${apex.y}Z`;
  }

  const i0 = polar(cx, cy, inner, end - inset(inner));
  const i1 = polar(cx, cy, inner, start + inset(inner));

  return `${arc}L${i0.x} ${i0.y}A${inner} ${inner} 0 ${large} 0 ${i1.x} ${i1.y}Z`;
}

function strokeArc(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number
) {
  const large = end - start > 180 ? 1 : 0;
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);

  return `M${a.x} ${a.y}A${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

function ChartSvg({
  className,
  children,
  viewBox,
}: {
  className?: string;
  children: React.ReactNode;
  viewBox: string;
}) {
  const [, , width, height] = viewBox.split(" ");

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-auto w-full min-w-0 overflow-visible text-foreground-muted",
        className
      )}
      fill="none"
      // Holds the height to the viewBox ratio: an SVG sized only by its width can fall back to
      // the 150px replaced-element default in WebKit.
      style={{ aspectRatio: `${width} / ${height}` }}
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

/** Vertical currentColor fade for area fills. */
function FadeGradient({ id, from = 0.32 }: { id: string; from?: number }) {
  return (
    <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="currentColor" stopOpacity={from} />
      <stop offset="1" stopColor="currentColor" stopOpacity={0} />
    </linearGradient>
  );
}

function Dot({
  accent = false,
  className,
}: {
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "size-2 shrink-0 rounded-full",
        accent ? primary : "bg-foreground-muted/40",
        className
      )}
    />
  );
}

function ChartSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Surface className={cn("max-w-50 rounded-[14px]", className)}>
      <Panel className="flex flex-col gap-4 p-4">{children}</Panel>
    </Surface>
  );
}

/** Title line and a small value on the right. */
function ChartHeader() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Bar className="w-[40%]" />
      <Bar className="w-5" variant="secondary" />
    </div>
  );
}

const areaLine =
  "M0 40C12 38 20 26 32 27S52 38 64 31S88 12 100 15S114 22 120 18";

const areaChart = (
  <ChartSurface>
    <ChartHeader />
    <ChartSvg viewBox="0 0 120 56">
      <defs>
        <FadeGradient id="thumbnail-area-fill" />
      </defs>
      <path d={`${areaLine}L120 56L0 56Z`} fill="url(#thumbnail-area-fill)" />
      <path
        d={areaLine}
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.72}
        strokeWidth={1.5}
      />
    </ChartSvg>
  </ChartSurface>
);

const barHeights = [42, 64, 50, 86, 58, 74, 36];

const barChart = (
  <ChartSurface>
    <ChartHeader />
    <div className="flex h-16 items-end gap-1.5 border-b">
      {barHeights.map((height, index) => (
        <div
          className={cn(
            "flex-1 rounded-t-[3px]",
            index === 3 ? primary : "bg-foreground-muted/24"
          )}
          key={height}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  </ChartSurface>
);

/** [open, close, high, low] in SVG units (smaller is higher). */
const candles = [
  [42, 34, 30, 48],
  [34, 38, 28, 42],
  [38, 26, 22, 40],
  [26, 30, 20, 34],
  [30, 16, 10, 32],
  [16, 22, 12, 28],
  [22, 10, 4, 24],
  [10, 18, 6, 22],
] as const;

const candlestickChart = (
  <ChartSurface>
    <ChartHeader />
    <ChartSvg viewBox="0 0 120 50">
      {candles.map(([open, close, high, low], index) => {
        const x = 8 + index * 14.5;
        const rising = close < open;

        return (
          <g key={x}>
            <line
              stroke="currentColor"
              strokeOpacity={0.4}
              x1={x}
              x2={x}
              y1={high}
              y2={low}
            />
            <rect
              fill="currentColor"
              fillOpacity={rising ? 0.56 : 0.12}
              height={Math.abs(open - close)}
              rx="1.5"
              stroke="currentColor"
              strokeOpacity={rising ? 0 : 0.4}
              width="8"
              x={x - 4}
              y={Math.min(open, close)}
            />
          </g>
        );
      })}
    </ChartSvg>
  </ChartSurface>
);

/** A tile cartogram: reads as a map without real geometry. */
const mapTiles = [
  "..XXXX....X.",
  ".XXXXXXX.XX.",
  "XXXXXXXXXXX.",
  "XXXXXXXXXXXX",
  ".XXXXXXXXXX.",
  "..XXXXXXXX..",
  "....XX...X..",
].flatMap((row, r) =>
  [...row].flatMap((cell, c) => (cell === "X" ? [{ c, r }] : []))
);

const choroplethChart = (
  <ChartSurface className="gap-3">
    <ChartSvg viewBox="0 0 120 70">
      {mapTiles.map(({ r, c }) => {
        const accent = r === 3 && c === 7;

        return (
          <rect
            className={accent ? "text-foreground" : undefined}
            fill="currentColor"
            fillOpacity={
              accent ? 0.88 : [0.08, 0.16, 0.28, 0.44, 0.64][level(r, c)]
            }
            height="9"
            key={`${r}-${c}`}
            rx="1.5"
            width="9"
            x={c * 10}
            y={r * 10}
          />
        );
      })}
    </ChartSvg>
    <div className="flex items-center gap-2">
      <Bar className="w-4" variant="secondary" />
      <div className="h-1.5 flex-1 rounded-full bg-linear-to-r from-foreground-muted/8 to-foreground-muted/64" />
      <Bar className="w-4" variant="secondary" />
    </div>
  </ChartSurface>
);

const composedBars = [18, 26, 20, 32, 24, 36, 30];
const composedLine = "M8 30C20 26 28 20 40 22S60 14 72 16S96 6 112 8";

const composedChart = (
  <ChartSurface>
    <div className="flex items-center gap-2">
      <div className="size-2 rounded-[2px] bg-foreground-muted/24" />
      <Bar className="w-7" variant="secondary" />
      <Dot accent className="ms-1" />
      <Bar className="w-7" />
    </div>
    <ChartSvg viewBox="0 0 120 50">
      <defs>
        <FadeGradient from={0.16} id="thumbnail-composed-fill" />
      </defs>
      {composedBars.map((height, index) => (
        <rect
          fill="currentColor"
          fillOpacity={0.22}
          height={height}
          key={height}
          rx="2"
          width="10"
          x={3 + index * 17}
          y={50 - height}
        />
      ))}
      <path
        d={`${composedLine}L112 50L8 50Z`}
        fill="url(#thumbnail-composed-fill)"
      />
      <path
        className="text-foreground"
        d={composedLine}
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.88}
        strokeWidth={1.5}
      />
    </ChartSvg>
  </ChartSurface>
);

const funnelHeights = [44, 32, 22, 15, 10];

/** The funnel's outline, `pad` wider on each side (for the halo rings). */
function funnelPath(pad: number) {
  const step = 120 / (funnelHeights.length - 1);
  const points = funnelHeights.map((height, index) => ({
    bottom: 26 + height / 2 + pad,
    top: 26 - height / 2 - pad,
    x: index * step,
  }));
  const curve = (edge: "top" | "bottom", list: typeof points) =>
    list
      .slice(1)
      .map((point, index) => {
        const previous = list[index];
        const mid = (previous.x + point.x) / 2;

        return `C${mid} ${previous[edge]} ${mid} ${point[edge]} ${point.x} ${point[edge]}`;
      })
      .join("");
  const reversed = points.toReversed();

  return `M0 ${points[0].top}${curve("top", points)}L120 ${reversed[0].bottom}${curve("bottom", reversed)}Z`;
}

const funnelChart = (
  <ChartSurface>
    <div className="flex justify-between gap-2">
      {[0, 1, 2, 3].map((index) => (
        <div className="flex-1" key={index}>
          <Bar
            className="w-[70%]"
            variant={index === 0 ? "main" : "secondary"}
          />
        </div>
      ))}
    </div>
    <ChartSvg viewBox="0 0 120 52">
      <defs>
        <mask id="thumbnail-funnel-dividers">
          <rect fill="white" height="52" width="120" />
          {[30, 60, 90].map((x) => (
            <line key={x} stroke="black" x1={x} x2={x} y1="0" y2="52" />
          ))}
        </mask>
      </defs>
      <g mask="url(#thumbnail-funnel-dividers)">
        <path d={funnelPath(6)} fill="currentColor" fillOpacity={0.05} />
        <path d={funnelPath(3)} fill="currentColor" fillOpacity={0.08} />
        <path d={funnelPath(0)} fill="currentColor" fillOpacity={0.3} />
      </g>
    </ChartSvg>
  </ChartSurface>
);

const gaugeNotches = Array.from(
  { length: 25 },
  (_, index) => -135 + index * 11.25
);

const gaugeChart = (
  <ChartSurface className="items-center">
    <div className="relative w-full max-w-28">
      <ChartSvg viewBox="0 0 80 66">
        {gaugeNotches.map((deg, index) => {
          const from = polar(40, 40, 26, deg);
          const to = polar(40, 40, 36, deg);
          const filled = index < 18;

          return (
            <line
              className={filled ? "text-foreground" : undefined}
              key={deg}
              stroke="currentColor"
              strokeLinecap="round"
              strokeOpacity={filled ? 0.24 + (index / 18) * 0.64 : 0.14}
              strokeWidth={2.5}
              x1={from.x}
              x2={to.x}
              y1={from.y}
              y2={to.y}
            />
          );
        })}
      </ChartSvg>
      <div className="absolute inset-x-0 top-[48%] flex flex-col items-center gap-1.5">
        <Bar className="h-2.5 w-[34%] bg-foreground-muted/56" />
        <Bar className="w-[24%]" variant="secondary" />
      </div>
    </div>
  </ChartSurface>
);

const heatmapCells = Array.from({ length: 7 * 15 }, (_, cell) => ({
  column: cell % 15,
  row: Math.floor(cell / 15),
}));

const levelBackgrounds = [
  "bg-foreground-muted/8",
  "bg-foreground-muted/16",
  "bg-foreground-muted/28",
  "bg-foreground-muted/44",
  "bg-foreground-muted/64",
] as const;

const heatmapChart = (
  <ChartSurface className="gap-3">
    <div className="grid grid-cols-15 gap-0.5">
      {heatmapCells.map(({ row, column }) => (
        <div
          className={cn(
            "aspect-square rounded-[2px]",
            row === 3 && column === 10
              ? primary
              : levelBackgrounds[level(row, column)]
          )}
          key={`${row}-${column}`}
        />
      ))}
    </div>
    <div className="flex items-center justify-end gap-0.5">
      <Bar className="me-1 w-4" variant="secondary" />
      {levelBackgrounds.map((background) => (
        <div
          className={cn("size-1.5 rounded-[1px]", background)}
          key={background}
        />
      ))}
      <Bar className="ms-1 w-4" variant="secondary" />
    </div>
  </ChartSurface>
);

const lineA = "M0 44C14 40 22 30 34 32S54 22 66 24S92 10 120 8";
const lineB = "M0 30C16 34 26 42 40 38S62 30 76 36S102 40 120 32";

const lineChart = (
  <ChartSurface>
    <div className="flex items-center gap-2">
      <Dot accent />
      <Bar className="w-8" />
      <Dot className="ms-1 bg-foreground-muted/24" />
      <Bar className="w-6" variant="secondary" />
    </div>
    <ChartSvg viewBox="0 0 120 56">
      <line
        stroke="currentColor"
        strokeDasharray="2 2"
        strokeOpacity={0.32}
        x1="66"
        x2="66"
        y1="0"
        y2="56"
      />
      <path
        d={lineB}
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.28}
        strokeWidth={1.5}
      />
      <path
        className="text-foreground"
        d={lineA}
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.88}
        strokeWidth={1.5}
      />
      <circle
        className="fill-background text-foreground dark:fill-background-muted"
        cx="66"
        cy="24"
        r="2.5"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <circle
        className="fill-background dark:fill-background-muted"
        cx="66"
        cy="32.6"
        r="2"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth={1.25}
      />
    </ChartSvg>
  </ChartSurface>
);

const liveLine =
  "M0 34C8 30 14 36 22 32S34 22 42 26S54 36 62 30S76 14 84 18S96 22 100 16";

const liveLineChart = (
  <ChartSurface>
    <div className="flex items-center justify-between gap-2">
      <Bar className="w-[36%]" />
      <div className="flex items-center gap-1 rounded-full bg-foreground-muted/8 px-1.5 py-1">
        <div className={cn("size-1.5 rounded-full", primary)} />
        <Bar className="w-4" variant="secondary" />
      </div>
    </div>
    <ChartSvg viewBox="0 0 120 50">
      <defs>
        <linearGradient id="thumbnail-live-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="white" stopOpacity={0} />
          <stop offset="0.35" stopColor="white" stopOpacity={1} />
        </linearGradient>
        <mask id="thumbnail-live-mask">
          <rect fill="url(#thumbnail-live-fade)" height="50" width="120" />
        </mask>
      </defs>
      <path
        className="text-foreground"
        d={liveLine}
        mask="url(#thumbnail-live-mask)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.88}
        strokeWidth={1.5}
      />
      <line
        stroke="currentColor"
        strokeDasharray="2 2"
        strokeOpacity={0.24}
        x1="0"
        x2="120"
        y1="16"
        y2="16"
      />
      <g className="text-foreground">
        <circle cx="100" cy="16" fill="currentColor" fillOpacity={0.16} r="6" />
        <circle cx="100" cy="16" fill="currentColor" r="2.5" />
      </g>
    </ChartSvg>
  </ChartSurface>
);

const pieSlices = [
  { end: 130, opacity: 0.88, start: 0 },
  { end: 215, opacity: 0.32, start: 130 },
  { end: 290, opacity: 0.2, start: 215 },
  { end: 360, opacity: 0.12, start: 290 },
];

const pieChart = (
  <Surface className="max-w-50 rounded-[14px]">
    <Panel className="flex items-center gap-3 p-4">
      <ChartSvg className="w-1/2 max-w-20 shrink-0" viewBox="0 0 64 64">
        {pieSlices.map((slice, index) => {
          // The accent slice is pulled out of the pie.
          const offset = polar(
            0,
            0,
            index === 0 ? 3 : 0,
            (slice.start + slice.end) / 2
          );

          return (
            <path
              className={index === 0 ? "text-foreground" : undefined}
              d={arcPath({
                cx: 32,
                cy: 32,
                end: slice.end,
                gap: 1.5,
                outer: 28,
                start: slice.start,
              })}
              fill="currentColor"
              fillOpacity={slice.opacity}
              key={slice.start}
              transform={`translate(${offset.x} ${offset.y})`}
            />
          );
        })}
      </ChartSvg>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {pieSlices.map((slice, index) => (
          <div className="flex items-center gap-1.5" key={slice.start}>
            <Dot accent={index === 0} className="size-1.5" />
            <Bar
              className="flex-1"
              variant={index === 0 ? "main" : "secondary"}
            />
          </div>
        ))}
      </div>
    </Panel>
  </Surface>
);

const profitLossLine =
  "M0 22C10 14 18 12 28 18S40 38 52 40S66 34 72 26S86 6 98 10S112 24 120 30";

const profitLossChart = (
  <ChartSurface>
    <ChartHeader />
    <ChartSvg viewBox="0 0 120 50">
      <defs>
        <clipPath id="thumbnail-profit">
          <rect height="28" width="120" y="-4" />
        </clipPath>
        <clipPath id="thumbnail-loss">
          <rect height="30" width="120" y="24" />
        </clipPath>
      </defs>
      <line
        stroke="currentColor"
        strokeDasharray="2 2"
        strokeOpacity={0.32}
        x1="0"
        x2="120"
        y1="24"
        y2="24"
      />
      <path
        className="text-foreground"
        clipPath="url(#thumbnail-profit)"
        d={profitLossLine}
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.88}
        strokeWidth={1.75}
      />
      <path
        clipPath="url(#thumbnail-loss)"
        d={profitLossLine}
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity={0.36}
        strokeWidth={1.75}
      />
    </ChartSvg>
  </ChartSurface>
);

const radarAxes = [0, 60, 120, 180, 240, 300];
const radarValues = [0.9, 0.72, 0.5, 0.82, 0.58, 0.78];

function radarPolygon(scales: number[]) {
  return radarAxes
    .map((deg, index) => {
      const point = polar(36, 34, 28 * scales[index], deg);

      return `${point.x},${point.y}`;
    })
    .join(" ");
}

const radarChart = (
  <ChartSurface className="max-w-40 items-center">
    <ChartSvg className="max-w-28" viewBox="0 0 72 68">
      {[1, 0.66, 0.33].map((scale) => (
        <polygon
          key={scale}
          points={radarPolygon(radarAxes.map(() => scale))}
          stroke="currentColor"
          strokeOpacity={0.16}
        />
      ))}
      {radarAxes.map((deg) => {
        const point = polar(36, 34, 28, deg);

        return (
          <line
            key={deg}
            stroke="currentColor"
            strokeOpacity={0.12}
            x1="36"
            x2={point.x}
            y1="34"
            y2={point.y}
          />
        );
      })}
      <polygon
        fill="currentColor"
        fillOpacity={0.12}
        points={radarPolygon(radarValues.map((value) => 1.1 - value * 0.6))}
        stroke="currentColor"
        strokeOpacity={0.36}
      />
      <polygon
        className="text-foreground"
        fill="currentColor"
        fillOpacity={0.2}
        points={radarPolygon(radarValues)}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeOpacity={0.88}
        strokeWidth={1.5}
      />
    </ChartSvg>
  </ChartSurface>
);

const ringTracks = [
  { end: 290, r: 26 },
  { end: 210, r: 19 },
  { end: 140, r: 12 },
];

const ringChart = (
  <ChartSurface className="max-w-40 items-center">
    <ChartSvg className="max-w-28" viewBox="0 0 64 64">
      {ringTracks.map((track, index) => (
        <g
          className={index === 0 ? "text-foreground" : undefined}
          key={track.r}
        >
          <circle
            className="text-foreground-muted"
            cx="32"
            cy="32"
            r={track.r}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={5}
          />
          <path
            d={strokeArc(32, 32, track.r, 0, track.end)}
            stroke="currentColor"
            strokeLinecap="round"
            strokeOpacity={index === 0 ? 0.88 : 0.56 - index * 0.16}
            strokeWidth={5}
          />
        </g>
      ))}
    </ChartSvg>
  </ChartSurface>
);

/** [top, bottom] of each link's source and target. */
const sankeyLinks = [
  { from: [2, 12], opacity: 0.16, to: [2, 12] },
  { from: [12, 22], opacity: 0.28, to: [22, 32] },
  { from: [26, 34], opacity: 0.2, to: [12, 20] },
  { from: [34, 40], opacity: 0.12, to: [42, 48] },
  { from: [44, 50], opacity: 0.14, to: [32, 38] },
];

/** [x, y, height] */
const sankeyNodes = [
  [0, 2, 20],
  [0, 26, 14],
  [0, 44, 6],
  [116, 2, 18],
  [116, 22, 16],
  [116, 42, 6],
];

const sankeyChart = (
  <ChartSurface>
    <ChartHeader />
    <ChartSvg viewBox="0 0 120 52">
      {sankeyLinks.map(({ from: [a0, a1], to: [b0, b1], opacity }, index) => (
        <path
          className={index === 1 ? "text-foreground" : undefined}
          d={`M4 ${a0}C60 ${a0} 60 ${b0} 116 ${b0}L116 ${b1}C60 ${b1} 60 ${a1} 4 ${a1}Z`}
          fill="currentColor"
          fillOpacity={opacity}
          key={a0}
        />
      ))}
      {sankeyNodes.map(([x, y, height]) => (
        <rect
          fill="currentColor"
          fillOpacity={0.48}
          height={height}
          key={`${x}-${y}`}
          rx="1.5"
          width="4"
          x={x}
          y={y}
        />
      ))}
    </ChartSvg>
  </ChartSurface>
);

/** [x, y, r, opacity] */
const scatterPoints = [
  [10, 40, 2.5, 0.3],
  [20, 30, 3.5, 0.44],
  [28, 42, 2, 0.24],
  [36, 24, 3, 0.36],
  [46, 34, 4, 0.28],
  [54, 18, 2.5, 0.44],
  [62, 28, 3, 0.24],
  [84, 26, 2, 0.3],
  [92, 10, 3, 0.44],
  [102, 20, 2.5, 0.28],
  [110, 8, 3.5, 0.36],
];

const scatterChart = (
  <ChartSurface>
    <ChartHeader />
    <ChartSvg viewBox="0 0 120 50">
      <path d="M0 0V50H120" stroke="currentColor" strokeOpacity={0.16} />
      {scatterPoints.map(([cx, cy, r, opacity]) => (
        <circle
          cx={cx}
          cy={cy}
          fill="currentColor"
          fillOpacity={opacity}
          key={cx}
          r={r}
        />
      ))}
      <g className="text-foreground">
        <circle
          cx="74"
          cy="14"
          r="7"
          stroke="currentColor"
          strokeOpacity={0.4}
        />
        <circle cx="74" cy="14" fill="currentColor" r="3.5" />
      </g>
    </ChartSvg>
  </ChartSurface>
);

const sparkLine = "M0 11L6 9L12 10L18 6L24 8L30 4L36 6L42 3L48 2";
const sparkArea = "M0 4L6 6L12 5L18 8L24 7L30 10L36 9L42 11L48 10";
const sparkBars = [6, 9, 5, 11, 8, 12, 7, 10, 13];

function SparkRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Bar className="w-5" />
      <ChartSvg className="flex-1" viewBox="0 0 48 14">
        {children}
      </ChartSvg>
      <Bar className="w-4" variant="secondary" />
    </div>
  );
}

const sparkline = (
  <ChartSurface className="gap-3">
    <SparkRow>
      <g className="text-foreground">
        <path
          d={sparkLine}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.88}
          strokeWidth={1.25}
        />
        <circle
          className="fill-background dark:fill-background-muted"
          cx="48"
          cy="2"
          r="1.75"
          stroke="currentColor"
          strokeWidth={1.25}
        />
      </g>
    </SparkRow>
    <SparkRow>
      <defs>
        <FadeGradient id="thumbnail-sparkline-fill" />
      </defs>
      <path
        d={`${sparkArea}L48 14L0 14Z`}
        fill="url(#thumbnail-sparkline-fill)"
      />
      <path
        d={sparkArea}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.48}
        strokeWidth={1.25}
      />
    </SparkRow>
    <SparkRow>
      {sparkBars.map((height, index) => (
        <rect
          fill="currentColor"
          fillOpacity={0.32}
          height={height}
          // biome-ignore lint/suspicious/noArrayIndexKey: static bars
          key={index}
          rx="0.75"
          width="3.5"
          x={index * 5.5 + 0.25}
          y={14 - height}
        />
      ))}
    </SparkRow>
  </ChartSurface>
);

const sunburstRings = [
  {
    inner: 9,
    outer: 19,
    slices: [
      { end: 150, opacity: 0.88, start: 0 },
      { end: 255, opacity: 0.32, start: 150 },
      { end: 360, opacity: 0.2, start: 255 },
    ],
  },
  {
    inner: 20.5,
    outer: 30,
    slices: [
      { end: 70, opacity: 0.44, start: 0 },
      { end: 115, opacity: 0.36, start: 70 },
      { end: 150, opacity: 0.28, start: 115 },
      { end: 210, opacity: 0.24, start: 150 },
      { end: 255, opacity: 0.18, start: 210 },
      { end: 320, opacity: 0.14, start: 255 },
      { end: 360, opacity: 0.1, start: 320 },
    ],
  },
];

const sunburstChart = (
  <ChartSurface className="max-w-40 items-center gap-3">
    <div className="flex w-full items-center gap-1">
      <Bar className="w-6" variant="secondary" />
      <div className="size-1 rounded-full bg-foreground-muted/32" />
      <Bar className="w-8" />
    </div>
    <ChartSvg className="max-w-24" viewBox="0 0 64 64">
      {sunburstRings.flatMap(({ inner, outer, slices }, ring) =>
        slices.map((slice, index) => (
          <path
            className={
              ring === 0 && index === 0 ? "text-foreground" : undefined
            }
            d={arcPath({
              cx: 32,
              cy: 32,
              end: slice.end,
              gap: 1.25,
              inner,
              outer,
              start: slice.start,
            })}
            fill="currentColor"
            fillOpacity={slice.opacity}
            key={`${outer}-${slice.start}`}
          />
        ))
      )}
    </ChartSvg>
  </ChartSurface>
);

const thumbnails: Record<string, React.ReactNode> = {
  accordion,
  alert,
  "alert-dialog": alertDialog,
  "area-chart": areaChart,
  autocomplete,
  avatar,
  badge,
  "bar-chart": barChart,
  breadcrumb,
  button,
  calendar,
  "candlestick-chart": candlestickChart,
  card,
  checkbox,
  "checkbox-group": checkboxGroup,
  "choropleth-chart": choroplethChart,
  collapsible,
  combobox,
  command,
  "composed-chart": composedChart,
  "context-menu": contextMenu,
  "date-picker": datePicker,
  dialog,
  drawer,
  empty,
  field,
  fieldset,
  form,
  "funnel-chart": funnelChart,
  "gauge-chart": gaugeChart,
  grid,
  group,
  "heatmap-chart": heatmapChart,
  input,
  "input-group": inputGroup,
  kbd,
  label,
  "line-chart": lineChart,
  link,
  "live-line-chart": liveLineChart,
  loading,
  menu,
  meter,
  "number-field": numberField,
  "otp-field": otpField,
  pagination,
  "pie-chart": pieChart,
  popover,
  portal,
  "preview-card": previewCard,
  "profit-loss-line": profitLossChart,
  progress,
  "radar-chart": radarChart,
  "radio-group": radioGroup,
  "ring-chart": ringChart,
  "sankey-chart": sankeyChart,
  "scatter-chart": scatterChart,
  "scroll-area": scrollArea,
  select,
  separator,
  sheet,
  sidebar,
  skeleton,
  slider,
  sparkline,
  "sunburst-chart": sunburstChart,
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
