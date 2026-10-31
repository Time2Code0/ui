"use client";

import { ArrowRightIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/registry/ui/button";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@/registry/ui/number-field";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select";

interface Currency {
  label: string;
  value: string;
}

const currencies: Currency[] = [
  {
    label: "US Dollar",
    value: "$",
  },
  {
    label: "Euro",
    value: "€",
  },
  {
    label: "British Pound",
    value: "£",
  },
];

export function Particle() {
  return (
    <Group aria-label="Payment amount">
      <Group aria-label="Amount input">
        <Select
          defaultValue={currencies[0]}
          itemToStringValue={(currency) => currency.value}
        >
          <SelectTrigger className="w-fit min-w-none">
            <SelectValue>{(currency: Currency) => currency.value}</SelectValue>
          </SelectTrigger>
          <SelectPopup className="min-w-48">
            {currencies.map((curr) => (
              <SelectItem key={curr.value} value={curr}>
                {curr.value} <span className="ms-1">{curr.label}</span>
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <GroupSeparator />
        <NumberField
          aria-label="Enter the amount"
          className="gap-0"
          defaultValue={10}
          render={<NumberFieldGroup />}
        >
          <NumberFieldInput className="text-left" />
        </NumberField>
      </Group>
      <Group aria-label="Submit">
        <Button aria-label="Send" size="icon" variant="outline">
          <Icon aria-hidden="true" icon={ArrowRightIcon} />
        </Button>
      </Group>
    </Group>
  );
}
