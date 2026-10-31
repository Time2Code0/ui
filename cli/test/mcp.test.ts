import { readFile } from "node:fs/promises";
import path from "node:path";

import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { mergeConfig, writeMcpConfig } from "../src/commands/mcp";
import { createServer } from "../src/mcp/server";
import { createFixture } from "./helpers/fixtures";
import {
  type RegistryServer,
  startRegistryServer,
} from "./helpers/registry-server";

let registry: RegistryServer;
let client: Client;

beforeAll(async () => {
  registry = await startRegistryServer();
  vi.stubEnv("REGISTRY_URL", registry.url);

  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await createServer().connect(serverTransport);
  client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
});

afterAll(async () => {
  await client.close();
  await registry.close();
  vi.unstubAllEnvs();
});

async function callTool(name: string, args: Record<string, unknown> = {}) {
  const result = await client.callTool({ arguments: args, name });
  const [content] = result.content as { text: string; type: "text" }[];
  return { isError: result.isError, text: content.text };
}

describe("MCP server", () => {
  it("registers the registry tools", async () => {
    const { tools } = await client.listTools();

    expect(tools.map((tool) => tool.name).sort()).toEqual([
      "get_add_command",
      "get_audit_checklist",
      "get_item_examples",
      "list_items",
      "search_items",
      "view_items",
    ]);
  });

  it("lists and searches items", async () => {
    const list = await callTool("list_items", { kinds: ["ui"] });
    expect(list.text).toContain("Found 2 items.");
    expect(list.text).toContain("- button (ui)");

    const search = await callTool("search_items", { query: "login" });
    expect(search.text).toContain('Found 1 items matching "login"');
    expect(search.text).toContain("- login-01 (block)");
  });

  it("shows item details with the add command", async () => {
    const { text } = await callTool("view_items", {
      items: ["button", "nope"],
    });

    expect(text).toContain("**Registry dependencies:** loading");
    expect(text).toContain("time2code add button");
    expect(text).toContain("## nope\n\nNot found.");
  });

  it("returns example code", async () => {
    const { text } = await callTool("get_item_examples", { query: "button" });

    expect(text).toContain("## p-button-1");
    expect(text).toContain('import { Button } from "@/registry/ui/button"');
  });

  it("reports registry errors as tool errors", async () => {
    vi.stubEnv("REGISTRY_URL", "http://127.0.0.1:1/r");

    const result = await callTool("list_items");

    vi.stubEnv("REGISTRY_URL", registry.url);
    expect(result.isError).toBe(true);
    expect(result.text).toContain("Could not reach the registry");
  });
});

describe("mcp init", () => {
  it("adds the server and keeps existing ones", async () => {
    const cwd = await createFixture({
      ".mcp.json": { mcpServers: { other: { command: "other" } } },
    });

    const file = await writeMcpConfig(cwd, "claude");

    expect(file).toBe(path.join(cwd, ".mcp.json"));
    expect(
      JSON.parse(await readFile(path.join(cwd, ".mcp.json"), "utf8"))
    ).toEqual({
      mcpServers: {
        other: { command: "other" },
        time2code: { args: ["time2code@latest", "mcp"], command: "npx" },
      },
    });
  });

  it("creates nested config files and skips global ones", async () => {
    const cwd = await createFixture({});

    expect(await writeMcpConfig(cwd, "vscode")).toBe(
      path.join(cwd, ".vscode/mcp.json")
    );
    expect(await writeMcpConfig(cwd, "codex")).toBeNull();
  });

  it("merges objects deeply and replaces arrays", () => {
    expect(
      mergeConfig({ a: { b: 1, list: [1] } }, { a: { c: 2, list: [2] } })
    ).toEqual({ a: { b: 1, c: 2, list: [2] } });
  });
});
