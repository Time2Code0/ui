import { ArrowLeftIcon, ArrowRightIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";

export function Particle() {
  return (
    <Group aria-label="Pagination">
      <Group aria-label="Page numbers">
        <Button className="min-w-8" variant="outline">
          1
        </Button>
        <GroupSeparator />
        <Button className="min-w-8" variant="outline">
          2
        </Button>
        <GroupSeparator />
        <Button className="min-w-8" variant="outline">
          3
        </Button>
        <GroupSeparator />
        <Button className="min-w-8" variant="outline">
          4
        </Button>
        <GroupSeparator />
        <Button className="min-w-8" variant="outline">
          5
        </Button>
      </Group>
      <Group aria-label="Navigation">
        <Button aria-label="Previous" size="icon" variant="outline">
          <Icon aria-hidden="true" icon={ArrowLeftIcon} />
        </Button>
        <GroupSeparator />
        <Button aria-label="Next" size="icon" variant="outline">
          <Icon aria-hidden="true" icon={ArrowRightIcon} />
        </Button>
      </Group>
    </Group>
  );
}
