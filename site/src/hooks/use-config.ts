import { useMemo, useSyncExternalStore } from "react";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { siteConfig } from "@/lib/config";

export const packageManagers = ["npm", "pnpm", "yarn", "bun"] as const;

export type PackageManager = (typeof packageManagers)[number];

export const PM_ADD_COMMANDS: Record<PackageManager, string> = {
  bun: "bun add",
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
};

export const PM_EXECUTE_COMMANDS: Record<PackageManager, string> = {
  bun: "bun x",
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};

/** The CLI that install commands use: ours, or the shadcn CLI with our namespace. */
export const clis = ["time2code", "shadcn"] as const;

export type Cli = (typeof clis)[number];

interface Config {
  cli: Cli;
  installationType: "cli" | "manual";
  packageManager: PackageManager;
}

const defaultConfig: Config = {
  cli: "time2code",
  installationType: "cli",
  packageManager: "pnpm",
};

export function getAddCommand(
  { cli, packageManager }: Pick<Config, "cli" | "packageManager">,
  items: string[]
) {
  const run = PM_EXECUTE_COMMANDS[packageManager];

  if (cli === "shadcn") {
    const names = items.map(
      (item) => `${siteConfig.registryNamespace}/${item}`
    );
    return `${run} shadcn@latest add ${names.join(" ")}`;
  }

  return `${run} time2code@latest add ${items.join(" ")}`;
}

const configAtom = atomWithStorage<Config>("config", defaultConfig);

// The atom already re-renders on change, so there is nothing to subscribe to.
const subscribe = () => () => undefined;

export function useConfig() {
  const [storedConfig, setConfig] = useAtom(configAtom);
  // Configs stored before a field existed lack it.
  const config = useMemo(
    () => ({ ...defaultConfig, ...storedConfig }),
    [storedConfig]
  );

  // Suspense boundaries hydrate independently, so the stored config may already
  // be loaded by the time a later boundary hydrates. Render the server default
  // until this component has hydrated to keep its markup matching the server.
  const hydratedConfig = useSyncExternalStore(
    subscribe,
    () => config,
    () => defaultConfig
  );

  return [hydratedConfig, setConfig] as const;
}
