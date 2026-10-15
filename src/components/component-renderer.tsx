import { PackageSearchIcon } from "@hugeicons/core-free-icons";

import { Index } from "@/registry/__index__";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty";
import { Icon } from "@/registry/ui/icon";

export function ComponentRenderer({
  name,
  metaClassName,
}: {
  name: string;
  metaClassName?: string;
}) {
  const Component = Index[name as keyof typeof Index];

  if (!Component) {
    return (
      <Empty className="my-4 border-y bg-background-muted">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon={PackageSearchIcon} />
          </EmptyMedia>
          <EmptyTitle>Component not found</EmptyTitle>
          <EmptyDescription>
            There is no{" "}
            <code className="rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-[.8125rem] text-foreground">
              {name}
            </code>{" "}
            in the registry to preview.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      {metaClassName ? (
        <div className={metaClassName}>
          <Component />
        </div>
      ) : (
        <Component />
      )}
    </>
  );
}
