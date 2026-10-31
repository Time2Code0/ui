"use client";

import * as React from "react";

import { Calendar } from "@/registry/ui/calendar";

export function Particle() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return <Calendar mode="single" onSelect={setDate} selected={date} />;
}
