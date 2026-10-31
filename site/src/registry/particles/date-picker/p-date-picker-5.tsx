"use client";

import { useState } from "react";

import { CalendarIcon } from "@hugeicons/core-free-icons";
import { format, isValid, parse } from "date-fns";

import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Icon } from "@/registry/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/ui/input-group";
import { Popover, PopoverPopup, PopoverTrigger } from "@/registry/ui/popover";

export function Particle() {
  const [date, setDate] = useState<Date | undefined>();
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState<Date>(() => new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const parsedDate = parse(value, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setMonth(parsedDate);
      }
    } else {
      setDate(undefined);
    }
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setInputValue(format(selectedDate, "yyyy-MM-dd"));
      setMonth(selectedDate);
    } else {
      setInputValue("");
    }
  };

  return (
    <Popover>
      <InputGroup>
        <InputGroupInput
          aria-label="Select date"
          className="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          type="date"
          value={inputValue}
        />
        <InputGroupAddon>
          <PopoverTrigger
            aria-label="Select date"
            render={
              <Button aria-label="Select date" size="icon-xs" variant="ghost">
                <Icon aria-hidden="true" icon={CalendarIcon} />
              </Button>
            }
          />
        </InputGroupAddon>
      </InputGroup>
      <PopoverPopup align="start" alignOffset={-4} sideOffset={8}>
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
          selected={date}
        />
      </PopoverPopup>
    </Popover>
  );
}
