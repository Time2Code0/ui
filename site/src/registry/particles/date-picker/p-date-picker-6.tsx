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
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button className="w-full justify-start" variant="outline">
            <Icon icon={CalendarIcon} />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        }
      />
      <PopoverPopup>
        <Calendar mode="single" onSelect={handleSelect} selected={date} />
      </PopoverPopup>
    </Popover>
  );
}
