import { cancel, log } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";

import packageJson from "../package.json" with { type: "json" };
import { createAddCommand } from "./commands/add";
import { createCreateCommand } from "./commands/create";
import { createMcpCommand } from "./commands/mcp";
import { CliError } from "./utils/errors";

export function createProgram() {
  return new Command("time2code")
    .description("Add time2code/ui components to your project.")
    .version(packageJson.version, "-v, --version")
    .addCommand(createAddCommand())
    .addCommand(createCreateCommand())
    .addCommand(createMcpCommand());
}

export async function run(argv: string[]) {
  try {
    await createProgram().parseAsync(argv);
  } catch (error) {
    if (error instanceof CliError) {
      cancel(error.message);
      if (error.hint) {
        log.message(pc.dim(error.hint));
      }
    } else {
      cancel(error instanceof Error ? error.message : String(error));
    }
    process.exitCode = 1;
  }
}
