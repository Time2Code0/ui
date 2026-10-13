"use client";

import { SearchIcon } from "@hugeicons/core-free-icons";

import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/ui/combobox";
import { Icon } from "@/registry/ui/icon";
import { SelectButton } from "@/registry/ui/select";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Mango", value: "mango" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
];

export function Particle() {
  return (
    <Combobox items={items}>
      <ComboboxTrigger render={<SelectButton />}>
        <ComboboxValue placeholder="Select a fruit" />
      </ComboboxTrigger>
      <ComboboxPopup aria-label="Select a fruit">
        <div className="border-b p-2">
          <ComboboxInput
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder="Search fruits..."
            showTrigger={false}
            startAddon={<Icon icon={SearchIcon} />}
          />
        </div>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
