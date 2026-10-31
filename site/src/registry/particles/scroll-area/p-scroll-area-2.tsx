import { ScrollArea } from "@/registry/ui/scroll-area";

export function Particle() {
  return (
    <ScrollArea className="max-w-96 rounded-lg border">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-background-muted"
            key={String(i)}
          >
            <span className="font-medium text-sm">Item {i + 1}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
