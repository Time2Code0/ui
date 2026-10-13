"use client";

import { Button } from "@/registry/ui/button";
import { toastManager } from "@/registry/ui/toast";

export function Particle() {
  return (
    <Button
      onClick={() => {
        toastManager.add({
          description: "Monday, January 3rd at 6:00pm",
          title: "Event has been created",
        });
      }}
      variant="outline"
    >
      Default Toast
    </Button>
  );
}
