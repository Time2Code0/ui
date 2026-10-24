import { useSyncExternalStore } from "react";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

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

interface Config {
  installationType: "cli" | "manual";
  packageManager: PackageManager;
}

const defaultConfig: Config = {
  installationType: "cli",
  packageManager: "pnpm",
};

const configAtom = atomWithStorage<Config>("config", defaultConfig);

// The atom already re-renders on change, so there is nothing to subscribe to.
const subscribe = () => () => undefined;

export function useConfig() {
  const [config, setConfig] = useAtom(configAtom);

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
