import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface Config {
  installationType: "cli" | "manual";
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
}

const configAtom = atomWithStorage<Config>("config", {
  installationType: "cli",
  packageManager: "pnpm",
});

export function useConfig() {
  return useAtom(configAtom);
}
