import { Fragment } from "react";

import {
  AndroidIcon,
  ArrowDownIcon,
  ArrowRight01Icon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  CreditCardIcon,
  Download04Icon,
  GithubIcon,
  GoogleIcon,
  Mail01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Search01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Counter } from "@/registry/marketing/counter";
import { Marquee } from "@/registry/marketing/marquee";
import { Pill } from "@/registry/marketing/pill";
import { ShinyText } from "@/registry/marketing/shiny-text";
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Card, CardDescription, CardTitle } from "@/registry/ui/card";
import { Checkbox } from "@/registry/ui/checkbox";
import {
  Command,
  CommandCollection,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandShortcut,
} from "@/registry/ui/command";
import { Field, FieldLabel } from "@/registry/ui/field";
import { Icon } from "@/registry/ui/icon";
import { Input } from "@/registry/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Kbd, KbdGroup } from "@/registry/ui/kbd";
import { Label } from "@/registry/ui/label";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
} from "@/registry/ui/meter";
import {
  OTPField,
  OTPFieldInput,
  OTPFieldSeparator,
} from "@/registry/ui/otp-field";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/registry/ui/progress";
import { Radio, RadioGroup } from "@/registry/ui/radio-group";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";
import { Separator } from "@/registry/ui/separator";
import { Switch } from "@/registry/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group";

const people = {
  ines: { initials: "ID", name: "Ines Duarte" },
  kenji: { initials: "KS", name: "Kenji Sato" },
  mara: { initials: "ML", name: "Mara Lind" },
  priya: { initials: "PR", name: "Priya Raman" },
  sam: { initials: "SW", name: "Sam Whitfield" },
  theo: { initials: "TO", name: "Theo Okafor" },
};

type PersonId = keyof typeof people;

type StatusId = "todo" | "in-progress" | "in-review" | "done";

const statusLabels: Record<StatusId, string> = {
  done: "Done",
  "in-progress": "In progress",
  "in-review": "In review",
  todo: "Todo",
};

interface Task {
  assignee: PersonId;
  due: string;
  id: string;
  status: StatusId;
  title: string;
}

const tasks: Task[] = [
  {
    assignee: "priya",
    due: "Oct 16",
    id: "CHK-139",
    status: "in-review",
    title: "Apple Pay sheet loses focus on cancel",
  },
  {
    assignee: "theo",
    due: "Oct 17",
    id: "CHK-142",
    status: "in-progress",
    title: "Address autocomplete for EU postcodes",
  },
  {
    assignee: "sam",
    due: "Oct 20",
    id: "CHK-147",
    status: "in-progress",
    title: "Round tax lines correctly in CHF",
  },
  {
    assignee: "kenji",
    due: "Oct 22",
    id: "CHK-151",
    status: "todo",
    title: "Collapse order summary on mobile",
  },
  {
    assignee: "ines",
    due: "Oct 24",
    id: "CHK-155",
    status: "todo",
    title: "Confirm before deleting a saved card",
  },
  {
    assignee: "mara",
    due: "Oct 14",
    id: "CHK-128",
    status: "done",
    title: "Rewrite error copy for declined cards",
  },
  {
    assignee: "priya",
    due: "Oct 13",
    id: "CHK-131",
    status: "done",
    title: "Keyboard path through the payment step",
  },
];

export function SignUpDemo() {
  return (
    <Card className="size-full overflow-hidden">
      <div className="flex flex-1 flex-col gap-6 px-8 pt-8 pb-7">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span
            aria-hidden="true"
            className="mb-2 flex size-8 items-center justify-center rounded-lg bg-foreground font-semibold text-background text-sm"
          >
            F
          </span>
          <CardTitle>Create your Fieldnote account</CardTitle>
          <CardDescription>
            Welcome! Fill in the details to get started.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-2">
          <Button className="w-full" variant="outline">
            <Icon icon={GoogleIcon} />
            Continue with Google
          </Button>
          <Button className="w-full" variant="outline">
            <Icon icon={GithubIcon} />
            Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3 text-foreground-muted text-xs">
          <Separator className="flex-1" />
          or
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-col gap-4">
          <Field>
            <div className="flex w-full items-center justify-between">
              <FieldLabel>Email address</FieldLabel>
              <Badge size="sm" variant="secondary">
                Last used
              </Badge>
            </div>
            <Input
              autoComplete="off"
              placeholder="Enter your email address"
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              autoComplete="off"
              placeholder="Enter your password"
              type="password"
            />
          </Field>
        </div>

        <Button className="mt-1 w-full">
          Continue
          <Icon icon={ArrowRight01Icon} />
        </Button>
      </div>

      <p className="border-t bg-background-muted px-8 py-4 text-center text-foreground-muted text-sm">
        Already have an account?{" "}
        <span className="font-medium text-foreground">Sign in</span>
      </p>
    </Card>
  );
}

const OTP_LENGTH = 6;

export function VerifyDemo() {
  return (
    <Card className="size-full items-center gap-6 overflow-hidden px-8 py-8 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <span className="mb-2 flex size-10 items-center justify-center rounded-xl border bg-background-muted">
          <Icon icon={Mail01Icon} size={18} />
        </span>
        <CardTitle>Check your inbox</CardTitle>
        <CardDescription className="text-pretty">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-foreground">
            mara@fieldnote.app
          </span>
          .
        </CardDescription>
      </div>

      <OTPField
        aria-label="Verification code"
        length={OTP_LENGTH}
        size="lg"
        validationType="numeric"
      >
        {Array.from({ length: OTP_LENGTH }, (_, index) => (
          <span className="contents" key={`slot-${index.toString()}`}>
            {index === 3 ? <OTPFieldSeparator /> : null}
            <OTPFieldInput
              aria-label={
                index === 0 ? undefined : `Digit ${index + 1} of ${OTP_LENGTH}`
              }
              className="size-10!"
            />
          </span>
        ))}
      </OTPField>

      <div className="flex w-full flex-col gap-3">
        <Button className="w-full">Verify email</Button>
        <p className="text-foreground-muted text-xs">
          Didn’t get a code?{" "}
          <span className="font-medium text-foreground">Resend in 0:42</span>
        </p>
      </div>
    </Card>
  );
}

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Guest", value: "guest" },
];

const members: { id: PersonId; role: string; seen: string }[] = [
  { id: "mara", role: "owner", seen: "Now" },
  { id: "theo", role: "admin", seen: "12 min ago" },
  { id: "priya", role: "member", seen: "1 hour ago" },
  { id: "kenji", role: "member", seen: "Yesterday" },
];

const invites = ["sam@fieldnote.app"];

export function MembersDemo() {
  return (
    <Card className="size-full overflow-hidden">
      <div className="flex items-start justify-between gap-6 px-6 pt-6 pb-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Team members</CardTitle>
          <CardDescription>
            {members.length + invites.length} of 10 seats used on the Team plan.
          </CardDescription>
        </div>
        <Badge variant="secondary">Fieldnote</Badge>
      </div>

      <div className="flex gap-2 px-6 pb-5">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Icon icon={Mail01Icon} />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Email to invite"
            autoComplete="off"
            placeholder="name@company.com"
            type="email"
          />
        </InputGroup>
        <Select defaultValue="member" items={roles}>
          <SelectTrigger
            aria-label="Role for the invite"
            className="min-h-8 w-28 min-w-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <Button>Send invite</Button>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto border-t *:last:border-b-0">
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
        {invites.map((invite) => (
          <InviteRow invite={invite} key={invite} />
        ))}
      </ul>
    </Card>
  );
}

function MemberRow({ member }: { member: (typeof members)[number] }) {
  const person = people[member.id];
  const email = `${person.name.split(" ")[0].toLowerCase()}@fieldnote.app`;

  return (
    <li className="flex h-14 items-center gap-3 border-b px-6">
      <Avatar className="text-[0.6875rem]">
        <AvatarFallback>{person.initials}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2 font-medium text-sm">
          {person.name}
          {member.role === "owner" ? (
            <Badge size="sm" variant="secondary">
              You
            </Badge>
          ) : null}
        </span>
        <span className="truncate text-foreground-muted text-xs">{email}</span>
      </span>
      <span className="w-24 text-foreground-muted text-xs">{member.seen}</span>
      {member.role === "owner" ? (
        <span className="w-28 px-2.5 text-foreground-muted text-sm">Owner</span>
      ) : (
        <Select defaultValue={member.role} items={roles}>
          <SelectTrigger
            aria-label={`Role for ${person.name}`}
            className="w-28 min-w-0"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      )}
      {member.role === "owner" ? (
        <span aria-hidden="true" className="size-7 shrink-0" />
      ) : (
        <Menu>
          <MenuTrigger
            aria-label={`Actions for ${person.name}`}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <Icon icon={MoreHorizontalIcon} />
          </MenuTrigger>
          <MenuPopup align="end">
            <MenuItem>Copy email</MenuItem>
            <MenuItem variant="destructive">Remove from workspace</MenuItem>
          </MenuPopup>
        </Menu>
      )}
    </li>
  );
}

function InviteRow({ invite }: { invite: string }) {
  return (
    <li className="flex h-14 items-center gap-3 border-b px-6">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed text-foreground-muted">
        <Icon icon={Mail01Icon} size={14} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{invite}</span>
      <Badge size="sm" variant="warning">
        Invite sent
      </Badge>
      <Button size="xs" variant="ghost">
        Revoke
      </Button>
    </li>
  );
}

interface CommandEntry {
  label: string;
  shortcut?: string;
  value: string;
}

const commandGroups: { items: CommandEntry[]; value: string }[] = [
  {
    items: [
      {
        label: "CHK-139 Apple Pay sheet loses focus",
        value: "chk-139",
      },
      {
        label: "Book a design review",
        shortcut: "⌘B",
        value: "review",
      },
    ],
    value: "Suggestions",
  },
  {
    items: [
      { label: "Task list", shortcut: "G T", value: "tasks" },
      {
        label: "Team members",
        shortcut: "G M",
        value: "members",
      },
      {
        label: "Billing and usage",
        shortcut: "G B",
        value: "usage",
      },
      {
        label: "Changelog",
        shortcut: "G C",
        value: "changelog",
      },
    ],
    value: "Jump to",
  },
];

export function CommandDemo() {
  return (
    <Card className="size-full overflow-hidden bg-background-muted">
      <Command items={commandGroups}>
        <CommandInput
          aria-label="Search Fieldnote"
          autoFocus={false}
          placeholder="Search or jump to…"
        />
        <CommandPanel className="mx-0 flex-1 rounded-t-xl">
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          <CommandList>
            {(group: (typeof commandGroups)[number]) => (
              <Fragment key={group.value}>
                <CommandGroup items={group.items}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <CommandCollection>
                    {(item: CommandEntry) => (
                      <CommandItem key={item.value} value={item}>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.shortcut ? (
                          <CommandShortcut>{item.shortcut}</CommandShortcut>
                        ) : null}
                      </CommandItem>
                    )}
                  </CommandCollection>
                </CommandGroup>
              </Fragment>
            )}
          </CommandList>
        </CommandPanel>
        <CommandFooter>
          <span className="flex items-center gap-2">
            <KbdGroup>
              <Kbd>
                <Icon icon={ArrowUpIcon} />
              </Kbd>
              <Kbd>
                <Icon icon={ArrowDownIcon} />
              </Kbd>
            </KbdGroup>
            Navigate
          </span>
          <span className="flex items-center gap-2">
            <Kbd>
              <Icon icon={CornerDownLeftIcon} />
            </Kbd>
            Open
          </span>
        </CommandFooter>
      </Command>
    </Card>
  );
}

const EARLIER_DONE = 12;
const TOTAL_TASKS = 22;

export function TasksDemo() {
  const done =
    EARLIER_DONE + tasks.filter((task) => task.status === "done").length;

  return (
    <Card className="size-full overflow-hidden">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-5">
        <CardTitle>Checkout v3</CardTitle>
        <Badge size="sm" variant="success">
          On track
        </Badge>
        <div className="ms-auto flex items-center gap-4">
          <Progress className="w-28" value={(done / TOTAL_TASKS) * 100}>
            <ProgressTrack className="h-1.5">
              <ProgressIndicator className="bg-success" />
            </ProgressTrack>
          </Progress>
          <span className="text-foreground-muted text-xs tabular-nums">
            {done}/{TOTAL_TASKS}
          </span>
          <AvatarGroup>
            {(["mara", "theo", "priya", "kenji"] as const).map((id) => (
              <Avatar
                className="size-6 text-[0.625rem]"
                key={id}
                title={people[id].name}
              >
                <AvatarFallback>{people[id].initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>

      <div className="flex h-13 shrink-0 items-center gap-2 px-5">
        <InputGroup className="w-56">
          <InputGroupAddon>
            <Icon icon={Search01Icon} />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search tasks"
            autoComplete="off"
            placeholder="Search tasks"
            size="sm"
          />
        </InputGroup>
        <ToggleGroup
          aria-label="Filter tasks"
          defaultValue={["all"]}
          size="sm"
          variant="outline"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="done">Done</ToggleGroupItem>
        </ToggleGroup>
        <Button className="ms-auto" size="sm">
          <Icon icon={PlusSignIcon} />
          New task
        </Button>
      </div>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent!">
            <TableHead className="ps-5 has-[[role=checkbox]]:w-11">
              <Checkbox aria-label="Select all tasks" />
            </TableHead>
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-24">Assignee</TableHead>
            <TableHead className="w-20 pe-5 text-right">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

const statusTone: Record<StatusId, string> = {
  done: "text-success-foreground",
  "in-progress": "text-primary",
  "in-review": "text-info-foreground",
  todo: "text-foreground-muted",
};

function TaskRow({ task }: { task: Task }) {
  return (
    <TableRow>
      <TableCell className="ps-5 has-[[role=checkbox]]:w-11">
        <Checkbox aria-label={`Select ${task.id}`} />
      </TableCell>
      <TableCell className="text-foreground-muted text-xs tabular-nums">
        {task.id}
      </TableCell>
      <TableCell
        className={
          task.status === "done" ? "truncate text-foreground-muted" : "truncate"
        }
      >
        {task.title}
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-2 text-[0.8125rem]">
          <svg
            aria-hidden="true"
            className={cn("size-3.5 shrink-0", statusTone[task.status])}
            fill="none"
            viewBox="0 0 14 14"
          >
            {task.status === "todo" ? (
              <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="currentColor"
                strokeDasharray="2.2 1.8"
                strokeWidth="1.5"
              />
            ) : (
              <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )}
            {task.status === "in-progress" ? (
              <path d="M7 3.5a3.5 3.5 0 0 1 0 7Z" fill="currentColor" />
            ) : null}
            {task.status === "in-review" ? (
              <path d="M7 3.5A3.5 3.5 0 1 1 3.5 7H7Z" fill="currentColor" />
            ) : null}
            {task.status === "done" ? (
              <>
                <circle cx="7" cy="7" fill="currentColor" r="5.5" />
                <path
                  className="stroke-background"
                  d="m4.6 7.1 1.6 1.6 3.2-3.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </>
            ) : null}
          </svg>
          {statusLabels[task.status]}
        </span>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-2 text-[0.8125rem]">
          <Avatar className="size-5 text-[0.5625rem]">
            <AvatarFallback>{people[task.assignee].initials}</AvatarFallback>
          </Avatar>
          {people[task.assignee].name.split(" ")[0]}
        </span>
      </TableCell>
      <TableCell className="pe-5 text-right text-[0.8125rem] tabular-nums">
        {task.due}
      </TableCell>
    </TableRow>
  );
}

const TODAY = new Date(2026, 9, 15);
const slots = ["09:30", "11:00", "14:00", "16:30"];

export function ScheduleDemo() {
  return (
    <Card className="size-full gap-5 overflow-hidden p-6">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback>{people.kenji.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <CardTitle>Design review with Kenji</CardTitle>
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <Icon icon={Video01Icon} size={14} />
            30 min · Video call
          </CardDescription>
        </div>
      </div>

      <Calendar
        className="mx-auto [--cell-size:--spacing(10)]"
        defaultMonth={TODAY}
        disabled={[{ before: TODAY }, { dayOfWeek: [0, 6] }]}
        mode="single"
        selected={new Date(2026, 9, 20)}
        today={TODAY}
      />

      <ToggleGroup
        aria-label="Time"
        className="grid w-full grid-cols-4 gap-2"
        defaultValue={["14:00"]}
        size="sm"
      >
        {slots.map((time) => (
          <ToggleGroupItem
            className="border-foreground/10 bg-background tabular-nums data-pressed:border-foreground"
            key={time}
            value={time}
          >
            {time}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Button className="mt-auto w-full">Book a design review</Button>
    </Card>
  );
}

type PlanId = "starter" | "team" | "business";
type Period = "monthly" | "yearly";

const plans: {
  description: string;
  id: PlanId;
  name: string;
  price: Record<Period, number>;
}[] = [
  {
    description: "For side projects, up to 3 members.",
    id: "starter",
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
  },
  {
    description: "Unlimited projects and guests.",
    id: "team",
    name: "Team",
    price: { monthly: 12, yearly: 10 },
  },
  {
    description: "SSO, audit log, priority help.",
    id: "business",
    name: "Business",
    price: { monthly: 24, yearly: 20 },
  },
];

const SEATS = 6;

const formatUsd = (value: number) =>
  value.toLocaleString("en-US", { currency: "USD", style: "currency" });

export function PlansDemo() {
  return (
    <Card className="size-full overflow-hidden">
      <Tabs className="flex-1 gap-5 p-6" defaultValue="monthly">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Choose a plan</CardTitle>
          <CardDescription>
            Every plan includes unlimited tasks.
          </CardDescription>
        </div>

        <TabsList aria-label="Billing period" className="w-full">
          <TabsTab value="monthly">Monthly</TabsTab>
          <TabsTab value="yearly">
            Yearly
            <Badge size="sm" variant="success">
              −16%
            </Badge>
          </TabsTab>
        </TabsList>

        {(["monthly", "yearly"] as const).map((period) => (
          <TabsPanel className="flex flex-col" key={period} value={period}>
            <RadioGroup aria-label="Plan" className="gap-2" defaultValue="team">
              {plans.map((item) => (
                <Label
                  className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-data-checked:border-foreground/40 has-data-checked:bg-background-muted"
                  key={item.id}
                >
                  <Radio className="mt-px" value={item.id} />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2">
                      {item.name}
                      {item.id === "team" ? (
                        <Badge size="sm" variant="secondary">
                          Popular
                        </Badge>
                      ) : null}
                    </span>
                    <span className="font-normal text-foreground-muted text-xs">
                      {item.description}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1 tabular-nums">
                    {item.price[period] === 0
                      ? "Free"
                      : `$${item.price[period]}`}
                    <span className="font-normal text-foreground-muted text-xs">
                      {item.price[period] === 0 ? "forever" : "seat / mo"}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </TabsPanel>
        ))}

        <Button className="mt-auto w-full">Continue</Button>
      </Tabs>
    </Card>
  );
}

const countries = [
  { label: "Germany", value: "de" },
  { label: "Netherlands", value: "nl" },
  { label: "Switzerland", value: "ch" },
  { label: "United Kingdom", value: "gb" },
  { label: "United States", value: "us" },
];

export function CheckoutDemo() {
  const [, plan] = plans;
  const perSeat = plan.price.monthly;
  const total = perSeat * SEATS;

  return (
    <Card className="size-full gap-5 overflow-hidden p-6">
      <div className="flex flex-col gap-1.5">
        <CardTitle>Upgrade to {plan.name}</CardTitle>
        <CardDescription>Billed monthly. Cancel any time.</CardDescription>
      </div>

      <dl className="flex flex-col gap-2 rounded-xl bg-background-muted p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-foreground-muted">
            {SEATS} seats × {formatUsd(perSeat)}
          </dt>
          <dd className="tabular-nums">{formatUsd(total)}</dd>
        </div>
        <div className="flex justify-between font-medium">
          <dt>Due today</dt>
          <dd className="tabular-nums">{formatUsd(total)}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel>Card number</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Icon icon={CreditCardIcon} />
            </InputGroupAddon>
            <InputGroupInput
              autoComplete="off"
              inputMode="numeric"
              placeholder="1234 1234 1234 1234"
            />
          </InputGroup>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel>Expiry</FieldLabel>
            <Input autoComplete="off" placeholder="MM / YY" />
          </Field>
          <Field>
            <FieldLabel>CVC</FieldLabel>
            <Input autoComplete="off" inputMode="numeric" placeholder="123" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Country</FieldLabel>
          <Select defaultValue="nl" items={countries}>
            <SelectTrigger className="min-h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {countries.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </Field>
        <Label className="font-normal">
          <Checkbox defaultChecked />
          Save card for future payments
        </Label>
      </div>

      <Button className="mt-auto w-full">Pay {formatUsd(total)}</Button>
    </Card>
  );
}

const usage = [
  { label: "Seats", max: 10, unit: "", value: 6 },
  { label: "Storage", max: 50, unit: " GB", value: 18.4 },
  { label: "AI credits", max: 10_000, unit: "", value: 8120 },
];

const invoices = [
  { amount: 72, date: "Oct 1, 2026" },
  { amount: 72, date: "Sep 1, 2026" },
  { amount: 60, date: "Aug 1, 2026" },
  { amount: 60, date: "Jul 1, 2026" },
  { amount: 48, date: "Jun 1, 2026" },
];

export function UsageDemo() {
  return (
    <Card className="grid size-full grid-cols-[18rem_1fr] overflow-hidden">
      <div className="flex flex-col gap-6 border-e p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CardTitle>Team plan</CardTitle>
            <Badge size="sm" variant="success">
              Active
            </Badge>
          </div>
          <p className="font-semibold text-2xl tabular-nums tracking-[-0.02em]">
            $72
            <span className="font-normal text-foreground-muted text-sm tracking-normal">
              {" "}
              / month
            </span>
          </p>
          <CardDescription className="text-xs">
            Renews on Nov 1, 2026
          </CardDescription>
        </div>

        <div className="flex flex-col gap-4">
          {usage.map((item) => {
            const percent = (item.value / item.max) * 100;
            return (
              <Meter key={item.label} value={percent}>
                <div className="flex items-center justify-between">
                  <MeterLabel className="font-normal text-[0.8125rem]">
                    {item.label}
                  </MeterLabel>
                  <span className="text-foreground-muted text-xs tabular-nums">
                    {item.value.toLocaleString("en-US")} of{" "}
                    {item.max.toLocaleString("en-US")}
                    {item.unit}
                  </span>
                </div>
                <MeterTrack className="h-1.5 rounded-full">
                  <MeterIndicator
                    className={
                      percent > 75 ? "rounded-full bg-warning" : "rounded-full"
                    }
                  />
                </MeterTrack>
              </Meter>
            );
          })}
        </div>

        <div className="mt-auto flex gap-2">
          <Button size="sm" variant="outline">
            Change plan
          </Button>
          <Button size="sm" variant="ghost">
            Cancel plan
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-3">
          <CardTitle>Invoices</CardTitle>
          <span className="flex items-center gap-2 text-foreground-muted text-xs">
            <Icon icon={CreditCardIcon} size={14} />
            Visa ending 4242
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent!">
              <TableHead className="ps-6">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pe-6 text-right">
                <span className="sr-only">Download</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.date}>
                <TableCell className="ps-6">{invoice.date}</TableCell>
                <TableCell className="tabular-nums">
                  {formatUsd(invoice.amount)}
                </TableCell>
                <TableCell>
                  <Badge size="sm" variant="success">
                    Paid
                  </Badge>
                </TableCell>
                <TableCell className="pe-4 text-right">
                  <Button
                    aria-label={`Download invoice from ${invoice.date}`}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Icon icon={Download04Icon} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function WaitlistDemo() {
  return (
    <Card className="size-full items-center gap-6 overflow-hidden px-8 py-8 text-center">
      <Pill className="flex items-center gap-1.5 px-3 text-xs">
        <Icon icon={AndroidIcon} size={14} />
        Beta opens in November
      </Pill>

      <div className="flex flex-col gap-2">
        <CardTitle className="text-balance text-[1.375rem] leading-tight tracking-[-0.02em]">
          Fieldnote is coming to Android
        </CardTitle>
        <CardDescription className="text-pretty">
          Triage tasks and reply to threads from anywhere. Join the waitlist and
          we’ll send your invite first.
        </CardDescription>
      </div>

      <div className="flex items-center gap-3">
        <AvatarGroup>
          {(["ines", "theo", "priya", "kenji"] as const).map((id) => (
            <Avatar
              className="size-7 text-[0.625rem]"
              key={id}
              title={people[id].name}
            >
              <AvatarFallback>{people[id].initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <span className="text-foreground-muted text-sm">
          <span className="font-medium text-foreground tabular-nums">
            <Counter to={2418} />
          </span>{" "}
          people waiting
        </span>
      </div>

      <InputGroup className="mt-auto">
        <InputGroupAddon>
          <Icon icon={Mail01Icon} />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Email address"
          autoComplete="off"
          placeholder="you@company.com"
          type="email"
        />
        <InputGroupAddon align="inline-end">
          <Button size="xs">Join waitlist</Button>
        </InputGroupAddon>
      </InputGroup>
    </Card>
  );
}

const releases = [
  {
    date: "Oct 14",
    description:
      "Apple Pay, saved cards and address autocomplete for 31 countries.",
    title: "Checkout v3 beta",
    version: "3.2",
  },
  {
    date: "Sep 30",
    description: "Jump to any task, doc or setting with ⌘K.",
    title: "Command menu",
    version: "3.1",
  },
  {
    date: "Sep 16",
    description: "Write the update once and every lead gets it on Friday.",
    title: "Weekly updates",
    version: "3.0",
  },
];

export function ChangelogDemo() {
  return (
    <Card className="size-full overflow-hidden">
      <div className="flex flex-col gap-1.5 px-6 pt-6 pb-5">
        <CardTitle>Changelog</CardTitle>
        <CardDescription>New in Fieldnote, every two weeks.</CardDescription>
      </div>

      <ol className="relative flex flex-1 flex-col gap-5 px-6 before:absolute before:top-2 before:bottom-6 before:left-[1.8125rem] before:w-px before:bg-foreground/10">
        {releases.map((release, index) => (
          <li className="relative flex gap-4" key={release.version}>
            <span
              aria-hidden="true"
              className={
                index === 0
                  ? "mt-1.5 size-2.5 shrink-0 rounded-full bg-primary ring-4 ring-background"
                  : "mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-foreground/20 bg-background ring-4 ring-background"
              }
            />
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-center gap-2 text-foreground-muted text-xs">
                <Badge size="sm" variant="outline">
                  v{release.version}
                </Badge>
                {release.date}
                {index === 0 ? (
                  <ShinyText className="font-medium">Just shipped</ShinyText>
                ) : null}
              </span>
              <span className="font-medium text-sm">{release.title}</span>
              <span className="text-pretty text-[0.8125rem] text-foreground-muted leading-relaxed">
                {release.description}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <Label className="justify-between border-t bg-background-muted px-6 py-4 font-normal">
        Email me about new releases
        <Switch defaultChecked />
      </Label>
    </Card>
  );
}

const customers = [
  { className: "font-semibold tracking-[-0.04em]", name: "Northwind" },
  { className: "font-mono font-medium uppercase", name: "Lumen" },
  { className: "font-medium italic", name: "Halcyon" },
  { className: "font-bold tracking-[0.12em] uppercase", name: "Kestrel" },
  { className: "font-semibold", name: "parcel." },
  { className: "font-medium tracking-[-0.02em]", name: "Juniper" },
  { className: "font-mono font-semibold", name: "orbit/" },
];

const stats = [
  { label: "teams plan their week in Fieldnote", value: 4200 },
  { label: "tasks closed since January", value: 1_860_000 },
  { label: "countries in the new checkout", value: 31 },
];

export function ProofDemo() {
  return (
    <Card className="size-full overflow-hidden">
      <div className="flex flex-col items-center gap-3 border-b pt-6">
        <p className="text-foreground-muted text-xs">
          Trusted by product teams at
        </p>
        <Marquee
          className="w-full [--duration:28s] [--gap:3rem] [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          repeat={3}
        >
          {customers.map((customer) => (
            <span
              className={`text-foreground/60 text-lg ${customer.className}`}
              key={customer.name}
            >
              {customer.name}
            </span>
          ))}
        </Marquee>
      </div>

      <dl className="grid grid-cols-3 border-b">
        {stats.map((stat) => (
          <div
            className="flex flex-col gap-1 not-last:border-e px-6 py-5"
            key={stat.label}
          >
            <dt className="order-last text-pretty text-foreground-muted text-xs">
              {stat.label}
            </dt>
            <dd className="font-semibold text-2xl tabular-nums tracking-[-0.02em]">
              <Counter to={stat.value} />
            </dd>
          </div>
        ))}
      </dl>

      <figure className="flex flex-1 flex-col justify-center gap-4 px-6">
        <blockquote className="text-pretty text-[1.0625rem] leading-relaxed tracking-[-0.01em]">
          “We cut three tools and our Friday update went from an hour to ten
          minutes. The team actually reads it now.”
        </blockquote>
        <figcaption className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
          <span className="flex flex-col gap-0.5 text-sm">
            <span className="font-medium">Lena Brandt</span>
            <span className="text-foreground-muted text-xs">
              Head of Product, Kestrel
            </span>
          </span>
        </figcaption>
      </figure>
    </Card>
  );
}
