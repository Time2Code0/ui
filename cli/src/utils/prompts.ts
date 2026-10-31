import { cancel, isCancel } from "@clack/prompts";

import { CliError } from "./errors";

/** Prompts are skipped when `--yes` is passed or there is no terminal. */
export function isInteractive(yes = false) {
  return !yes && Boolean(process.stdin.isTTY) && !process.env.CI;
}

/** Returns the answer of a clack prompt, exits when the user cancels. */
export function unwrap<T>(value: T): Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  return value as Exclude<T, symbol>;
}

export function requireInteractive(interactive: boolean, message: string) {
  if (!interactive) {
    throw new CliError(message);
  }
}
