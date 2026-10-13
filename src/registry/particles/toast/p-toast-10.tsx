"use client";

import { Button } from "@/registry/ui/button";
import { toastManager } from "@/registry/ui/toast";

const DEDUP_ID = "demo-dedup-toast";

export function Particle() {
  return (
    <Button
      onClick={() => {
        toastManager.add({
          description:
            "Repeated clicks update this toast instead of stacking another.",
          id: DEDUP_ID,
          title: "Saved",
          type: "success",
        });
      }}
      variant="outline"
    >
      One Success Toast
    </Button>
  );
}
