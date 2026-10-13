"use client";
import * as React from "react";

import { Calendar } from "@/registry/ui/calendar";

export function Particle() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      className="[--cell-size:--spacing(11)] sm:[--cell-size:--spacing(10)]"
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  );
}
