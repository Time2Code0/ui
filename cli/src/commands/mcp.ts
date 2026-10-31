import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { intro, log, outro, select } from "@clack/prompts";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { Command, Option } from "commander";
import pc from "picocolors";

import { createServer } from "../mcp/server";
import { CliError } from "../utils/errors";
import { isInteractive, requireInteractive, unwrap } from "../utils/prompts";

const SERVER_NAME = "time2code";
const COMMAND = "npx";
const ARGS = ["time2code@latest", "mcp"];

interface McpClient {
  /** config to merge into the file, or text to show for global configs */
  config: Record<string, unknown> | string;
  /** config file relative to the project, `null` for a global config */
  configPath: string | null;
  label: string;
}

export const MCP_CLIENTS = {
  claude: {
    config: { mcpServers: { [SERVER_NAME]: { args: ARGS, command: COMMAND } } },
    configPath: ".mcp.json",
    label: "Claude Code",
  },
  codex: {
    config: `[mcp_servers.${SERVER_NAME}]\ncommand = "${COMMAND}"\nargs = [${ARGS.map((arg) => `"${arg}"`).join(", ")}]`,
    configPath: null,
    label: "Codex",
  },
  cursor: {
    config: { mcpServers: { [SERVER_NAME]: { args: ARGS, command: COMMAND } } },
    configPath: ".cursor/mcp.json",
    label: "Cursor",
  },
  opencode: {
    config: {
      $schema: "https://opencode.ai/config.json",
      mcp: {
        [SERVER_NAME]: {
          command: [COMMAND, ...ARGS],
          enabled: true,
          type: "local",
        },
      },
    },
    configPath: "opencode.json",
    label: "OpenCode",
  },
  vscode: {
    config: { servers: { [SERVER_NAME]: { args: ARGS, command: COMMAND } } },
    configPath: ".vscode/mcp.json",
    label: "VS Code",
  },
} satisfies Record<string, McpClient>;

export type McpClientName = keyof typeof MCP_CLIENTS;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Merges objects deeply, arrays and other values of `source` win. */
export function mergeConfig(
  target: Record<string, unknown>,
  source: Record<string, unknown>
) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];
    result[key] =
      isObject(existing) && isObject(value)
        ? mergeConfig(existing, value)
        : value;
  }

  return result;
}

/**
 * Adds the server to the client's project config, keeping other servers.
 * Returns the written file, `null` for clients configured globally.
 */
export async function writeMcpConfig(cwd: string, clientName: McpClientName) {
  const client: McpClient = MCP_CLIENTS[clientName];

  if (client.configPath === null || typeof client.config === "string") {
    return null;
  }

  const file = path.join(cwd, client.configPath);
  let existing: Record<string, unknown> = {};

  if (existsSync(file)) {
    try {
      existing = JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      throw new CliError(`Could not parse ${client.configPath}.`, {
        cause: error,
        hint: "Fix the JSON and run the command again.",
      });
    }
  }

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    `${JSON.stringify(mergeConfig(existing, client.config), null, 2)}\n`
  );

  return file;
}

export function createMcpCommand() {
  const mcp = new Command("mcp")
    .description("start the MCP server for AI agents (stdio)")
    .action(() => {
      // Stdout carries the protocol, so errors go to stderr.
      serveStdio(createServer, { onerror: (error) => console.error(error) });
    });

  mcp
    .command("init")
    .description("add the MCP server to your editor or agent config")
    .addOption(
      new Option("--client <name>", "the MCP client").choices(
        Object.keys(MCP_CLIENTS)
      )
    )
    .option("-c, --cwd <path>", "the project directory", process.cwd())
    .option("-y, --yes", "skip prompts", false)
    .action(
      async (options: {
        client?: McpClientName;
        cwd: string;
        yes: boolean;
      }) => {
        intro(pc.bgCyan(pc.black(" time2code mcp init ")));

        let clientName = options.client;
        if (!clientName) {
          requireInteractive(
            isInteractive(options.yes),
            `Choose a client with --client (${Object.keys(MCP_CLIENTS).join(", ")}).`
          );
          clientName = unwrap(
            await select({
              message: "Which MCP client are you using?",
              options: Object.entries(MCP_CLIENTS).map(([value, entry]) => ({
                label: entry.label,
                value: value as McpClientName,
              })),
            })
          );
        }

        const file = await writeMcpConfig(
          path.resolve(options.cwd),
          clientName
        );
        const client: McpClient = MCP_CLIENTS[clientName];

        if (file) {
          outro(
            `Added the MCP server to ${pc.cyan(path.relative(options.cwd, file))}.`
          );
          return;
        }

        log.message(
          `Add this to ${pc.cyan("~/.codex/config.toml")}, then restart ${client.label}:`
        );
        log.message(String(client.config));
        outro("Done.");
      }
    );

  return mcp;
}
