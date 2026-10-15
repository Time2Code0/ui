"use client";

import type { TabsTab } from "@base-ui/react";

import { useCallback } from "react";

import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/codeblock";
import { useConfig } from "@/hooks/use-config";

import { DynamicCodeBlock } from "./dynamic-codeblock.client";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const runners: [PackageManager, string][] = [
  ["npm", "npx"],
  ["pnpm", "pnpm dlx"],
  ["yarn", "yarn dlx"],
  ["bun", "bun x"],
];

export function CodeBlockCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [config, setConfig] = useConfig();

  const packageManager = config.packageManager || "pnpm";

  const handleValueChange = useCallback(
    (value: TabsTab.Value) => {
      setConfig({ ...config, packageManager: value as PackageManager });
    },
    [config, setConfig]
  );

  return (
    <CodeBlockTabs
      className={className}
      onValueChange={handleValueChange}
      value={packageManager}
    >
      <CodeBlockTabsList>
        {runners.map(([key]) => (
          <CodeBlockTabsTrigger key={key} value={key}>
            {key}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>

      {runners.map(([key, runner]) => (
        <CodeBlockTab key={key} value={key}>
          <DynamicCodeBlock
            code={`${runner} ${command}`}
            codeblock={{ className: "my-0" }}
            lang="bash"
          />
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>
  );
}
