"use client";

import type { TabsTab } from "@base-ui/react";

import { useCallback } from "react";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/codeblock";
import {
  type Cli,
  clis,
  getAddCommand,
  type PackageManager,
  PM_ADD_COMMANDS,
  PM_EXECUTE_COMMANDS,
  packageManagers,
  useConfig,
} from "@/hooks/use-config";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control";
import { Separator } from "@/registry/ui/separator";

import { DynamicCodeBlock } from "./dynamic-codeblock.client";

type PackageManagerTabsProps = { className?: string } & (
  | {
      /** an `npx …` or `npm …` command, translated for each package manager */
      command: string;
      items?: never;
    }
  | {
      /** registry items to add, with the CLI the reader picked */
      items: string[];
      command?: never;
    }
);

export function PackageManagerTabs({
  className,
  command,
  items,
}: PackageManagerTabsProps) {
  const [config, setConfig] = useConfig();

  const handlePackageManagerChange = useCallback(
    (value: TabsTab.Value) => {
      setConfig({ ...config, packageManager: value as PackageManager });
    },
    [config, setConfig]
  );

  const handleCliChange = useCallback(
    (value: Cli[]) => {
      // Pressing the selected item again would leave nothing selected.
      const [cli] = value;
      if (cli) {
        setConfig({ ...config, cli });
      }
    },
    [config, setConfig]
  );

  const isExecute = command?.startsWith("npx ");
  const isAdd = command?.startsWith("npm ");

  if (command !== undefined && !(isExecute || isAdd)) {
    throw new Error(`"${command}" is not a valid command!`);
  }

  const getCode = (packageManager: PackageManager) => {
    if (items) {
      return getAddCommand({ cli: config.cli, packageManager }, items);
    }

    const commands = isExecute ? PM_EXECUTE_COMMANDS : PM_ADD_COMMANDS;
    return `${commands[packageManager]} ${command?.slice(4)}`;
  };

  const cliToggle = items ? (
    <>
      <SegmentedControl
        aria-label="CLI"
        className="p-0"
        render={
          <ToggleGroup onValueChange={handleCliChange} value={[config.cli]} />
        }
        size="sm"
      >
        {clis.map((cli) => (
          <SegmentedControlItem
            className="h-7 px-2 font-mono font-normal text-[0.8125rem]"
            key={cli}
            render={<Toggle value={cli} />}
          >
            {cli}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <Separator className="h-4" orientation="vertical" />
    </>
  ) : null;

  return (
    <CodeBlockTabs
      className={className}
      onValueChange={handlePackageManagerChange}
      value={config.packageManager}
    >
      <CodeBlockTabsList prefix={cliToggle}>
        {packageManagers.map((packageManager) => (
          <CodeBlockTabsTrigger key={packageManager} value={packageManager}>
            {packageManager}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>

      {packageManagers.map((packageManager) => (
        <CodeBlockTab key={packageManager} value={packageManager}>
          <DynamicCodeBlock
            code={getCode(packageManager)}
            codeblock={{ className: "my-0" }}
            lang="bash"
          />
        </CodeBlockTab>
      ))}
    </CodeBlockTabs>
  );
}
