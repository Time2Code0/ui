"use client";

import { useCallback } from "react";

import { LayerMask01Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

export function ToggleThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      className="hitbox-1"
      onClick={handleToggleTheme}
      size="icon"
      variant="ghost"
    >
      <Icon className="-rotate-45" icon={LayerMask01Icon} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
