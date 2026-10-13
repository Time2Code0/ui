"use client";

import { useState } from "react";

import { CalendarIcon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";

import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Icon } from "@/registry/ui/icon";
import { Popover, PopoverPopup, PopoverTrigger } from "@/registry/ui/popover";

export function Particle() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className="w-full justify-start" variant="outline">
            <Icon aria-hidden="true" icon={CalendarIcon} />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        }
      />
      <PopoverPopup>
        <Calendar
          defaultMonth={date}
          mode="single"
          onSelect={setDate}
          selected={date}
        />
      </PopoverPopup>
    </Popover>
  );
}
