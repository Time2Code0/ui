"use client";

import { useState } from "react";

import { Button } from "@/registry/ui/button";
import { Portal } from "@/registry/ui/portal";

export function Particle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen((value) => !value)} variant="outline">
        {open ? "Hide" : "Show"} portal
      </Button>
      {open ? (
        <Portal className="fixed right-4 bottom-4 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
          Rendered into document.body
        </Portal>
      ) : null}
    </>
  );
}
