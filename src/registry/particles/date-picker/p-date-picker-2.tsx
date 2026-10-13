"use client";

import type { DateRange } from "@daypicker/react";

import { useState } from "react";

import { CalendarIcon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";

import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Icon } from "@/registry/ui/icon";
import { Popover, PopoverPopup, PopoverTrigger } from "@/registry/ui/popover";

export function Particle() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className="w-full justify-start" variant="outline">
            <Icon aria-hidden="true" icon={CalendarIcon} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        }
      />
      <PopoverPopup>
        <Calendar
          defaultMonth={date?.from}
          mode="range"
          onSelect={setDate}
          selected={date}
        />
      </PopoverPopup>
    </Popover>
  );
}
