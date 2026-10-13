import { BookIcon, RouteIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={RouteIcon} />
        </EmptyMedia>
        <EmptyTitle>No upcoming meetings</EmptyTitle>
        <EmptyDescription>Create a meeting to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button size="sm">Create meeting</Button>
          <Button size="sm" variant="outline">
            <Icon icon={BookIcon} />
            View docs
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
