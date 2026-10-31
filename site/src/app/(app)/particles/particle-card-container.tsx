import { cn } from "cn";

import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardPanel,
} from "@/registry/ui/card";

export function ParticleCardContainer({
  children,
  footer,
  className,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}) {
  return (
    <CardFrame
      className={cn(
        "w-full min-w-0 after:pointer-events-none after:absolute after:-inset-[5px] after:rounded-[calc(var(--radius-2xl)+5px)] after:border after:border-foreground/5",
        className
      )}
    >
      <Card className="min-h-50 flex-1 overflow-x-auto">
        <CardPanel className="flex flex-1 items-center justify-center px-4 py-12 lg:px-8">
          {children}
        </CardPanel>
      </Card>
      <CardFrameFooter className="flex items-center gap-3 p-2">
        {footer}
      </CardFrameFooter>
    </CardFrame>
  );
}
