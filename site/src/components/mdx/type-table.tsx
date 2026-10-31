"use client";

import { useCallback, useEffect, useState } from "react";

import { ChevronDownIcon } from "@hugeicons/core-free-icons";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import Link from "fumadocs-core/link";

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible";
import { Icon } from "@/registry/ui/icon";

export interface ParameterNode {
  description: React.ReactNode;
  name: string;
}

export interface TypeNode {
  default?: React.ReactNode;
  deprecated?: boolean;
  /**
   * Additional description of the field
   */
  description?: React.ReactNode;

  /**
   * a list of parameters info if the type is a function.
   */
  parameters?: ParameterNode[];

  required?: boolean;

  returns?: React.ReactNode;

  /**
   * type signature (short)
   */
  type: React.ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: React.ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;
}

const fieldVariants = cva("pe-2 text-foreground-muted");

export function TypeTable({
  id,
  type,
  className,
  ...props
}: { type: Record<string, TypeNode> } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "full-width not-typeset my-6 flex flex-col overflow-hidden border-y bg-background-muted p-1! text-foreground text-sm",
        className
      )}
      id={id}
      {...props}
    >
      <div className="flex items-center px-3 py-1 font-medium text-foreground-muted">
        <p className="w-1/4">Prop</p>
        <p className="@max-xl:hidden">Type</p>
      </div>
      {Object.entries(type).map(([key, value]) => (
        <Item item={value} key={key} name={key} parentId={id} />
      ))}
    </div>
  );
}

function Item({
  parentId,
  name,
  item: {
    parameters = [],
    description,
    required = false,
    deprecated,
    typeDescription,
    default: defaultValue,
    type,
    typeDescriptionLink,
    returns,
  },
}: {
  parentId?: string;
  name: string;
  item: TypeNode;
}) {
  const [open, setOpen] = useState(false);
  const id = parentId ? `${parentId}-${name}` : undefined;

  const handleOnOpenChange = useCallback(
    (v: boolean) => {
      if (v && id) {
        window.history.replaceState(null, "", `#${id}`);
      }

      setOpen(v);
    },
    [id]
  );

  useEffect(() => {
    const { hash } = window.location;

    if (!(id && hash)) {
      return;
    }

    if (`#${id}` === hash) {
      setOpen(true);
    }
  }, [id]);

  return (
    <Collapsible
      className={cn(
        "scroll-m-20 overflow-hidden border transition-all",
        open ? "not-last:mb-2 bg-background shadow-sm" : "border-transparent"
      )}
      id={id}
      onOpenChange={handleOnOpenChange}
      open={open}
    >
      <CollapsibleTrigger className="group relative flex w-full flex-row items-center px-3 py-2 text-start hover:bg-accent">
        <code
          className={cn(
            "w-1/4 min-w-fit pe-2 font-medium font-mono text-primary",
            deprecated && "text-primary/50 line-through"
          )}
        >
          {name}
          {!required && "?"}
        </code>

        {typeDescriptionLink ? (
          <Link className="@max-xl:hidden underline" href={typeDescriptionLink}>
            {type}
          </Link>
        ) : (
          <span className="@max-xl:hidden">{type}</span>
        )}

        <Icon
          className="absolute inset-e-2 size-4 text-foreground-muted transition-transform group-data-open:rotate-180"
          icon={ChevronDownIcon}
        />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="fd-scroll-container grid grid-cols-[1fr_3fr] gap-y-4 overflow-auto border-t p-3 text-sm">
          <div className="prose prose-sm prose-no-margin col-span-full empty:hidden">
            {description}
          </div>

          {typeDescription ? (
            <>
              <p className={cn(fieldVariants())}>Type</p>
              <p className="my-auto">{typeDescription}</p>
            </>
          ) : null}

          {defaultValue ? (
            <>
              <p className={cn(fieldVariants())}>Default</p>
              <p className="my-auto">{defaultValue}</p>
            </>
          ) : null}

          {parameters.length > 0 && (
            <>
              <p className={cn(fieldVariants())}>Parameters</p>
              <div className="flex flex-col gap-2">
                {parameters.map((param) => (
                  <div
                    className="inline-flex flex-wrap items-center gap-1"
                    key={param.name}
                  >
                    <p className="text-nowrap font-medium">{param.name} -</p>
                    <div className="prose prose-sm prose-no-margin">
                      {param.description}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {returns ? (
            <>
              <p className={cn(fieldVariants())}>Returns</p>
              <div className="prose prose-sm prose-no-margin my-auto">
                {returns}
              </div>
            </>
          ) : null}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}
