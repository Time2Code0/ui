import type { CatalogColumn } from "./catalog-stage";

import {
  ArrowUp02Icon,
  Attachment01Icon,
  Calendar03Icon,
  ChartHistogramIcon,
  ChartUpIcon,
  DashboardSquare01Icon,
  File01Icon,
  Folder01Icon,
  MoreHorizontalIcon,
  SparklesIcon,
  Task01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Avatar, AvatarFallback } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";
import { Icon } from "@/registry/ui/icon";
import { Input } from "@/registry/ui/input";
import { Kbd, KbdGroup } from "@/registry/ui/kbd";
import { Radio, RadioGroup } from "@/registry/ui/radio-group";
import { SelectButton } from "@/registry/ui/select";
import { Switch } from "@/registry/ui/switch";
import { Textarea } from "@/registry/ui/textarea";

const people = {
  camila: { initials: "CR", name: "Camila Reyes", role: "Product lead" },
  elias: { initials: "EB", name: "Elias Berg", role: "Engineer" },
  jonah: { initials: "JK", name: "Jonah Kim", role: "Designer" },
  lea: { initials: "LN", name: "Lea Novak", role: "Engineer" },
  noor: { initials: "NH", name: "Noor Haddad", role: "Engineer" },
};

type PersonId = keyof typeof people;

const focusRing = "ring-2 ring-foreground ring-offset-1 ring-offset-background";

const fieldFocus = "border-foreground ring-[3px] ring-foreground/30";

function Tile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-background p-4 shadow-foreground/[0.04] shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function repeat(count: number, render: (index: number) => React.ReactNode) {
  return Array.from({ length: count }, (_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static repeats
    <div className="contents" key={index}>
      {render(index)}
    </div>
  ));
}

const hoverFill = {
  default: "bg-foreground/80",
  destructive:
    "bg-[color-mix(in_oklab,var(--color-destructive)_90%,var(--color-foreground)_10%)]",
  outline: "bg-accent",
  secondary: "bg-accent",
};

function ButtonStates({
  label,
  variant,
}: {
  label: string;
  variant: keyof typeof hoverFill;
}) {
  const hover = hoverFill[variant];

  return (
    <>
      <Button size="lg" variant={variant}>
        {label}
      </Button>
      <Button className={hover} size="lg" variant={variant}>
        {label}
      </Button>
      <Button className={focusRing} size="lg" variant={variant}>
        {label}
      </Button>
      <Button loading size="lg" variant={variant}>
        {label}
      </Button>
      <Button disabled size="lg" variant={variant}>
        {label}
      </Button>
    </>
  );
}

function NotificationTile({
  person,
  time,
  body,
}: {
  person: PersonId;
  time: string;
  body: string;
}) {
  return (
    <Tile className="flex gap-3">
      <span className="relative h-fit">
        <Avatar className="[--avatar-size:--spacing(9)]">
          <AvatarFallback>{people[person].initials}</AvatarFallback>
        </Avatar>
        <span className="absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full bg-success ring-2 ring-background" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm">
          <span className="font-medium">{people[person].name}</span>{" "}
          <span className="text-foreground-muted">{time}</span>
        </p>
        <p className="text-foreground-muted text-sm">{body}</p>
        <div className="mt-2 flex gap-1">
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
          <Button size="sm" variant="outline">
            Reply
          </Button>
        </div>
      </div>
    </Tile>
  );
}

function AssistantTile() {
  return (
    <Tile className="flex flex-col gap-4 p-5">
      <p className="text-balance text-center font-medium text-[0.9375rem] leading-snug">
        Hi Camila,
        <br />
        what are we shipping today?
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {["Summarize week 42", "Draft release notes", "Plan the sprint"].map(
          (label) => (
            <Button key={label} size="xs" variant="outline">
              <Icon icon={SparklesIcon} />
              {label}
            </Button>
          )
        )}
      </div>
      <div className="flex flex-col rounded-xl border bg-background-muted p-1">
        <Textarea placeholder="Ask anything…" />
        <div className="flex items-center justify-between px-1.5 pt-1.5 pb-0.5">
          <span className="inline-flex items-center gap-1.5 text-foreground-muted text-xs">
            <Avatar className="text-[0.5rem] [--avatar-size:--spacing(4)]">
              <AvatarFallback>{people.camila.initials}</AvatarFallback>
            </Avatar>
            Camila
          </span>
          <span className="flex items-center gap-1">
            <Button size="xs" variant="ghost">
              <Icon icon={Attachment01Icon} />
              Attach
            </Button>
            <Button size="icon-xs">
              <Icon icon={ArrowUp02Icon} />
            </Button>
          </span>
        </div>
      </div>
    </Tile>
  );
}

function FieldTile() {
  return (
    <Tile className="flex flex-col gap-4">
      <div className="grid gap-1.5">
        <span className="font-medium text-sm">Workspace URL</span>
        <Input defaultValue="akari.dev/northwind" />
      </div>
      <div className="grid gap-1.5">
        <span className="font-medium text-sm">Workspace URL</span>
        <Input className={fieldFocus} defaultValue="akari.dev/north" />
      </div>
      <div className="grid gap-1.5">
        <span className="font-medium text-sm">Workspace URL</span>
        <Input aria-invalid defaultValue="akari.dev/north wind" />
        <span className="text-destructive-foreground text-xs">
          Use letters, numbers and dashes only.
        </span>
      </div>
    </Tile>
  );
}

const badges = [
  { label: "Done", variant: "success" },
  { label: "In review", variant: "info" },
  { label: "In progress", variant: "warning" },
  { label: "Blocked", variant: "error" },
  { label: "Draft", variant: "outline" },
  { label: "Archived", variant: "secondary" },
] as const;

/** Builds a smooth line through evenly spaced values in a 120×40 box. */
function sparkline(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * 120,
    36 - ((value - min) / (max - min || 1)) * 32,
  ]);

  let path = `M${points[0][0]},${points[0][1]}`;
  for (let index = 1; index < points.length; index += 1) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const mid = (x0 + x1) / 2;
    path += ` C${mid},${y0} ${mid},${y1} ${x1},${y1}`;
  }

  return { area: `${path} L120,40 L0,40 Z`, line: path };
}

function StatTile({
  label,
  value,
  delta,
  values,
}: {
  label: string;
  value: string;
  delta: string;
  values: number[];
}) {
  const { area, line } = sparkline(values);

  return (
    <Tile className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{label}</span>
        <Icon
          className="text-foreground-muted"
          icon={MoreHorizontalIcon}
          size={16}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-3xl tabular-nums tracking-[-0.03em]">
          {value}
        </span>
        <span className="inline-flex items-center gap-0.5 text-sm text-success-foreground tabular-nums">
          <Icon icon={ChartUpIcon} size={14} />
          {delta}
        </span>
        <span className="text-foreground-muted text-sm">vs last week</span>
      </div>
      <svg
        aria-hidden="true"
        className="h-16 w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 120 40"
      >
        <path className="fill-primary/10" d={area} />
        <path
          className="fill-none stroke-primary"
          d={line}
          strokeLinecap="round"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Tile>
  );
}

const assignees: PersonId[] = ["camila", "elias", "noor", "jonah", "lea"];

function SelectStates() {
  return (
    <>
      <div className="grid gap-1.5">
        <span className="font-medium text-sm">
          Assignee <span className="text-destructive-foreground">*</span>
        </span>
        <SelectButton data-placeholder="">Choose a teammate</SelectButton>
      </div>
      <div className="grid gap-1.5">
        <span className="font-medium text-sm">
          Assignee <span className="text-destructive-foreground">*</span>
        </span>
        <SelectButton className={fieldFocus}>
          <span className="inline-flex items-center gap-2">
            <Avatar className="[--avatar-size:--spacing(5)]">
              <AvatarFallback>{people.elias.initials}</AvatarFallback>
            </Avatar>
            {people.elias.name}
          </span>
        </SelectButton>
        <div className="rounded-lg border bg-background p-1 shadow-foreground/5 shadow-lg">
          {assignees.map((id) => (
            <div
              className={cn(
                "grid min-h-8 grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm",
                id === "noor" && "bg-accent"
              )}
              key={id}
            >
              {id === "elias" ? (
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
                </svg>
              ) : (
                <span />
              )}
              <span className="flex min-w-0 items-center gap-2">
                <Avatar className="[--avatar-size:--spacing(5)]">
                  <AvatarFallback>{people[id].initials}</AvatarFallback>
                </Avatar>
                <span className="truncate">{people[id].name}</span>
                <span className="truncate text-foreground-muted">
                  {people[id].role}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const navigation = [
  {
    items: [
      { active: true, icon: DashboardSquare01Icon, label: "Dashboard" },
      { icon: Folder01Icon, label: "Projects" },
      { icon: File01Icon, label: "Documents" },
      { icon: Calendar03Icon, label: "Calendar" },
    ],
    label: "Workspace",
  },
  {
    items: [
      { icon: ChartHistogramIcon, label: "Reporting" },
      { count: 8, icon: Task01Icon, label: "Tasks" },
      { icon: UserMultipleIcon, label: "Team" },
    ],
    label: "Northwind",
  },
];

function SidebarTile() {
  return (
    <Tile className="flex flex-col gap-3 p-2">
      {navigation.map((group) => (
        <div className="flex flex-col" key={group.label}>
          <span className="px-2 pt-1 pb-1.5 font-medium text-foreground-muted text-xs">
            {group.label}
          </span>
          {group.items.map((item) => (
            <span
              className={cn(
                "flex h-8 items-center gap-2 rounded-md px-2 text-sm",
                "active" in item && item.active && "bg-accent font-medium"
              )}
              key={item.label}
            >
              <Icon
                className="text-foreground-muted"
                icon={item.icon}
                size={16}
              />
              <span className="flex-1">{item.label}</span>
              {"count" in item ? (
                <Badge size="sm" variant="secondary">
                  {item.count}
                </Badge>
              ) : null}
            </span>
          ))}
        </div>
      ))}
    </Tile>
  );
}

function SettingsTile() {
  const rows = [
    { checked: true, label: "Weekly digest" },
    { checked: false, label: "Mentions" },
    { checked: true, focus: true, label: "Deploy alerts" },
    { checked: false, disabled: true, label: "SMS" },
  ];

  return (
    <Tile className="flex flex-col gap-3">
      <span className="font-medium text-sm">Notifications</span>
      {rows.map((row) => (
        <span
          className="flex items-center justify-between gap-3 text-sm"
          key={row.label}
        >
          <span className={cn(row.disabled && "text-foreground-muted")}>
            {row.label}
          </span>
          <Switch
            className={cn(row.focus && focusRing)}
            defaultChecked={row.checked}
            disabled={row.disabled}
          />
        </span>
      ))}
    </Tile>
  );
}

function ChecklistTile() {
  return (
    <Tile className="flex flex-col gap-2.5">
      <span className="flex items-center gap-2 font-medium text-sm">
        <Checkbox defaultChecked indeterminate />
        Launch checklist
      </span>
      {[
        { checked: true, label: "Pricing page copy" },
        { checked: true, label: "Billing webhooks" },
        { checked: false, focus: true, label: "Status page" },
        { checked: false, disabled: true, label: "Press kit" },
      ].map((item) => (
        <span
          className={cn(
            "flex items-center gap-2 ps-6 text-sm",
            item.checked && "text-foreground-muted line-through",
            item.disabled && "text-foreground-muted"
          )}
          key={item.label}
        >
          <Checkbox
            className={cn(item.focus && focusRing)}
            defaultChecked={item.checked}
            disabled={item.disabled}
          />
          {item.label}
        </span>
      ))}
    </Tile>
  );
}

function BillingTile() {
  return (
    <Tile className="flex flex-col gap-3">
      <span className="font-medium text-sm">Billing period</span>
      <RadioGroup defaultValue="yearly">
        <span className="flex items-center gap-2 text-sm">
          <Radio value="monthly" />
          Monthly
        </span>
        <span className="flex items-center gap-2 text-sm">
          <Radio value="yearly" />
          Yearly
          <Badge size="sm" variant="success">
            −20%
          </Badge>
        </span>
        <span className="flex items-center gap-2 text-foreground-muted text-sm">
          <Radio disabled value="lifetime" />
          Lifetime
        </span>
      </RadioGroup>
      <span className="flex items-center justify-between border-t pt-3 text-foreground-muted text-xs">
        Search plans
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </span>
    </Tile>
  );
}

export const catalogColumns: CatalogColumn[] = [
  {
    className: "w-40",
    content: repeat(3, () => (
      <>
        <ButtonStates label="Save draft" variant="outline" />
        <ButtonStates label="Publish" variant="default" />
      </>
    )),
  },
  {
    className: "w-80",
    content: repeat(2, () => (
      <>
        <NotificationTile
          body="Left a note on the checkout redesign."
          person="jonah"
          time="2 min ago"
        />
        <AssistantTile />
        <FieldTile />
        <NotificationTile
          body="Moved CHK-142 to In review."
          person="noor"
          time="12 min ago"
        />
      </>
    )),
  },
  {
    className: "w-28 items-start gap-5",
    content: repeat(5, () =>
      badges.map((badge) => (
        <Badge key={badge.label} size="lg" variant={badge.variant}>
          <span className="size-1.5 rounded-full bg-current" />
          {badge.label}
        </Badge>
      ))
    ),
  },
  {
    className: "w-72",
    content: repeat(2, () => (
      <>
        <StatTile
          delta="4.2%"
          label="Weekly active"
          value="2,418"
          values={[12, 14, 13, 17, 16, 15, 19, 22, 21, 26]}
        />
        <SettingsTile />
        <StatTile
          delta="0.6%"
          label="Checkout conversion"
          value="3.8%"
          values={[30, 28, 31, 29, 33, 32, 31, 35, 38, 37]}
        />
        <ChecklistTile />
      </>
    )),
  },
  {
    className: "w-44",
    content: repeat(3, () => (
      <>
        <ButtonStates label="Delete project" variant="destructive" />
        <ButtonStates label="Cancel" variant="secondary" />
      </>
    )),
  },
  {
    className: "w-72",
    content: repeat(2, () => (
      <>
        <SelectStates />
        <SidebarTile />
        <BillingTile />
      </>
    )),
  },
  {
    className: "w-40",
    content: repeat(3, () => (
      <>
        <ButtonStates label="Invite" variant="outline" />
        <ButtonStates label="Continue" variant="default" />
      </>
    )),
  },
];
