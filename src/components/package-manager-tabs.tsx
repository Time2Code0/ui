"use client";

import type { TabsTab } from "@base-ui/react";

import { useCallback } from "react";

import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/codeblock";
import {
  type PackageManager,
  PM_ADD_COMMANDS,
  PM_EXECUTE_COMMANDS,
  packageManagers,
  useConfig,
} from "@/hooks/use-config";

import { DynamicCodeBlock } from "./dynamic-codeblock.client";

export function PackageManagerTabs({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [config, setConfig] = useConfig();

  const handleValueChange = useCallback(
    (value: TabsTab.Value) => {
      setConfig({ ...config, packageManager: value as PackageManager });
    },
    [config, setConfig]
  );

  const isExecute = command.startsWith("npx ");
  const isAdd = command.startsWith("npm ");

  if (!(isExecute || isAdd)) {
    throw new Error(`"${command}" is not a valid command!`);
  }

  const getCode = (pm: PackageManager) => {
    if (isExecute) {
      return `${PM_EXECUTE_COMMANDS[pm]} ${command.slice(4)}`;
    }

    return `${PM_ADD_COMMANDS[pm]} ${command.slice(4)}`;
  };

  return (
    <CodeBlockTabs
      className={className}
      onValueChange={handleValueChange}
      value={config.packageManager || "pnpm"}
    >
      <CodeBlockTabsList>
        {packageManagers.map((pm) => (
          <CodeBlockTabsTrigger key={pm} value={pm}>
            {pm}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>

      {packageManagers.map((pm) => (
        <CodeBlockTab key={pm} value={pm}>
          <DynamicCodeBlock
            code={getCode(pm)}
            codeblock={{ className: "my-0" }}
            lang="bash"
          />
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>
  );
}
