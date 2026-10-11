import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const alertVariants = cva(
  cn(
    "relative grid w-full items-start gap-x-2 gap-y-0.5 rounded-xl border px-3.5 py-3 text-foreground text-sm [&>svg]:h-lh [&>svg]:w-4",
    "has-[>svg]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-[>svg]:gap-x-2"
  ),
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-background [&>svg]:text-foreground-muted",
        error: cn(
          "border-destructive/30 bg-destructive-background text-destructive-foreground **:data-[slot=alert-description]:text-destructive-foreground/80 [&>svg]:text-destructive-foreground",
          "selection:bg-destructive! selection:text-white!"
        ),
        info: cn(
          "border-info/30 bg-info-background text-info-foreground **:data-[slot=alert-description]:text-info-foreground/80 [&>svg]:text-info-foreground",
          "selection:bg-info! selection:text-white!"
        ),
        success: cn(
          "border-success/30 bg-success-background text-success-foreground **:data-[slot=alert-description]:text-success-foreground/80 [&>svg]:text-success-foreground",
          "selection:bg-success! selection:text-white!"
        ),
        warning: cn(
          "border-warning/30 bg-warning-background text-warning-foreground **:data-[slot=alert-description]:text-warning-foreground/80 [&>svg]:text-warning-foreground",
          "selection:bg-warning! selection:text-white!"
        ),
      },
    },
  }
);

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium tracking-tight [svg~&]:col-start-2",
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 text-foreground-muted leading-relaxed [svg~&]:col-start-2",
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

export function AlertAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:self-center sm:[[data-slot=alert-description]~&]:col-start-2 sm:[[data-slot=alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-slot=alert-description]~&]:col-start-3 sm:[svg~[data-slot=alert-title]~&]:col-start-3",
        className
      )}
      data-slot="alert-action"
      {...props}
    />
  );
}

const alertFrameVariants = cva(
  cn(
    "relative flex flex-col rounded-xl border text-foreground",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)]",
    "[--clip-bottom:-1rem] [--clip-top:1px]",
    "data-[slot=alert]:rounded-b-lg *:data-[slot=alert]:-m-px *:data-[slot=alert]:w-auto *:data-[slot=alert]:bg-clip-padding *:data-[slot=alert]:[clip-path:inset(var(--clip-top)_1px_var(--clip-bottom)_1px_round_calc(var(--radius-xl)-1px))]"
  ),
  {
    defaultVariants: {
      ribbon: true,
      variant: "default",
    },
    variants: {
      ribbon: {
        false: null,
        true: cn(
          "before:mask-l-to-50% before:paused [&:hover:not(:has([data-slot=alert]:hover))]:before:running before:animate-ribbon before:[--ribbon-stripe-size:12px]",
          "before:bg-[repeating-linear-gradient(45deg,var(--ribbon-background)_0_var(--ribbon-stripe-size),var(--ribbon-stripe-color)_var(--ribbon-stripe-size)_calc(var(--ribbon-stripe-size)*2))]"
        ),
      },
      variant: {
        default: cn(
          "bg-background-muted",
          "before:[--ribbon-background:var(--color-background-muted)] before:[--ribbon-stripe-color:color-mix(in_oklab,var(--color-background)_100%,var(--color-foreground)_60%)]"
        ),
        error: cn(
          "border-destructive/60 bg-destructive-subtel **:data-[slot=alert-frame-description]:text-destructive-foreground **:data-[slot=alert-frame-footer]:[&>svg]:text-destructive-foreground",
          "selection:bg-destructive! selection:text-white!",
          "before:[--ribbon-background:var(--color-destructive-subtel)] before:[--ribbon-stripe-color:--alpha(var(--color-destructive)/30%)]"
        ),
        info: cn(
          "border-info/60 bg-info-subtel **:data-[slot=alert-frame-description]:text-info-foreground **:data-[slot=alert-frame-footer]:[&>svg]:text-info-foreground",
          "selection:bg-info! selection:text-white!",
          "before:[--ribbon-background:var(--color-info-subtel)] before:[--ribbon-stripe-color:--alpha(var(--color-info)/30%)]"
        ),
        success: cn(
          "border-success/60 bg-success-subtel **:data-[slot=alert-frame-description]:text-success-foreground **:data-[slot=alert-frame-footer]:[&>svg]:text-success-foreground",
          "selection:bg-success! selection:text-white!",
          "before:[--ribbon-background:var(--color-success-subtel)] before:[--ribbon-stripe-color:--alpha(var(--color-success)/30%)]"
        ),
        warning: cn(
          "border-warning/60 bg-warning-subtel **:data-[slot=alert-frame-description]:text-warning-foreground **:data-[slot=alert-frame-footer]:[&>svg]:text-warning-foreground",
          "selection:bg-warning! selection:text-white!",
          "before:[--ribbon-background:var(--color-warning-subtel)] before:[--ribbon-stripe-color:--alpha(var(--color-warning)/30%)]"
        ),
      },
    },
  }
);

export function AlertFrame({
  className,
  variant,
  ribbon,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertFrameVariants>) {
  return (
    <div
      className={cn(alertFrameVariants({ variant }), className)}
      data-slot="alert-frame"
      {...props}
    />
  );
}

export function AlertFrameFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid items-center p-3 py-2.5 text-sm has-[>svg]:has-data-[slot=alert-frame-action]:grid-cols-[--spacing(4)_1fr_auto] has-[>svg]:grid-cols-[--spacing(4)_1fr] has-data-[slot=alert-frame-action]:grid-cols-[1fr_auto] has-[>svg]:gap-x-2 [&>svg]:h-lh [&>svg]:w-4",
        className
      )}
      data-slot="alert-frame-footer"
      {...props}
    />
  );
}

export function AlertFrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-foreground-muted", className)}
      data-slot="alert-frame-description"
      {...props}
    />
  );
}

export function AlertFrameAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex gap-1", className)}
      data-slot="alert-frame-action"
      {...props}
    />
  );
}
