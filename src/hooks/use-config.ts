import { useSyncExternalStore } from "react";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const runners: [PackageManager, string][] = [
  ["npm", "npx"],
  ["pnpm", "pnpm dlx"],
  ["yarn", "yarn dlx"],
  ["bun", "bun x"],
];

interface Config {
  installationType: "cli" | "manual";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
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
