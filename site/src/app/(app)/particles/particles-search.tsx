"use client";

import { Fragment, useCallback, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { LabelIcon, Search01Icon } from "@hugeicons/core-free-icons";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxValue,
} from "@/registry/ui/combobox";
import { Icon } from "@/registry/ui/icon";

interface ParticleCategory {
  label: string;
  value: string;
}

interface ParticleCategoryGroup {
  items: ParticleCategory[];
  value: string;
}

function isSameCategory(a: ParticleCategory, b: ParticleCategory) {
  return a.value === b.value;
}

export function ParticlesSearch({
  categories,
}: {
  categories: ParticleCategoryGroup[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(true);

  const selectedItems = useMemo(() => {
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
    const items = categories.flatMap((group) => group.items);

    return tags
      .map((tag) => items.find((item) => item.value === tag))
      .filter((category) => category !== undefined);
  }, [categories, searchParams]);

  const handleValueChange = useCallback(
    (items: ParticleCategory[]) => {
      setOpen(false);

      startTransition(() => {
        const tags = items.map((item) => item.value).join(",");

        router.push(
          tags ? `${pathname}?tags=${encodeURIComponent(tags)}` : pathname,
          { scroll: false }
        );
      });
    },
    [pathname, router]
  );

  return (
    <Combobox
      aria-label="Filter particles"
      autoHighlight
      isItemEqualToValue={isSameCategory}
      items={categories}
      multiple
      onOpenChange={setOpen}
      onValueChange={handleValueChange}
      open={open}
      value={selectedItems}
    >
      <ComboboxChips
        className="rounded-xl p-[calc(--spacing(2)-1px)]"
        startAddon={<Icon className="size-5" icon={Search01Icon} />}
      >
        <ComboboxValue>
          {(value: ParticleCategory[]) => (
            <>
              {value.map((item) => (
                <ComboboxChip aria-label={item.label} key={item.value}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="opacity-80" icon={LabelIcon} />
                    <span>{item.label}</span>
                  </div>
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Search particles"
                placeholder={
                  value.length === 0 ? "Filter by component or tag…" : undefined
                }
                size="lg"
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxPopup>
        <ComboboxEmpty>No filters found.</ComboboxEmpty>
        <ComboboxList>
          {(group: ParticleCategoryGroup, index: number) => (
            <Fragment key={group.value}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxGroup items={group.items}>
                <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                <ComboboxCollection>
                  {(item: ParticleCategory) => (
                    <ComboboxItem key={item.value} value={item}>
                      <div className="flex items-center gap-2">
                        <Icon className="opacity-80" icon={LabelIcon} />
                        <span>{item.label}</span>
                      </div>
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </Fragment>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
