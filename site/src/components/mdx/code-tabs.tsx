"use client";

import type { TabsTab } from "@base-ui/react";

import { useCallback, useMemo } from "react";

import { useConfig } from "@/hooks/use-config";
import { Tabs } from "@/registry/ui/tabs";

export function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
  const [config, setConfig] = useConfig();

  const installationType = useMemo(
    () => config.installationType || "cli",
    [config]
  );

  const handleValueChange = useCallback(
    (value: TabsTab.Value) => {
      setConfig({ ...config, installationType: value as "cli" | "manual" });
    },
    [config, setConfig]
  );

  return (
    <Tabs
      className="relative mt-6 w-full"
      onValueChange={handleValueChange}
      value={installationType}
    >
      {children}
    </Tabs>
  );
}
