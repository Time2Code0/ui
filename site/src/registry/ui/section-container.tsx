import { cn } from "cn";

export function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto size-full max-w-(--breakpoint-2xl) px-4 sm:px-6",
        className
      )}
    >
      {children}
    </div>
  );
}
