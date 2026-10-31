import type { CallToolResult } from "@modelcontextprotocol/server";
import type { RegistryItem } from "@shadcn/registry/schema";

import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

import { getPackageManager, getPackageRunner } from "../utils/package-manager";
import {
  fetchRegistryIndex,
  fetchRegistryItem,
  getItemKind,
  getRegistryTemplate,
  ITEM_KINDS,
  type ItemKind,
  REGISTRY_NAMESPACE,
  searchItems,
} from "../utils/registry";

const DEFAULT_LIMIT = 50;
const MAX_EXAMPLES = 5;

const kindsField = z
  .array(z.enum(ITEM_KINDS as [ItemKind, ...ItemKind[]]))
  .optional()
  .describe(
    "Filter by kind: ui (primitives), component (charts, marketing), hook, block, style, example (usage examples)."
  );
const limitField = z
  .number()
  .optional()
  .describe(`Maximum number of items to return (defaults to ${DEFAULT_LIMIT})`);
const offsetField = z
  .number()
  .optional()
  .describe("Number of items to skip for pagination");

function textResult(text: string): CallToolResult {
  return { content: [{ text, type: "text" }] };
}

/** Turns a thrown error into an `isError` result the agent can read. */
function tool<Args>(callback: (args: Args) => Promise<string>) {
  return async (args: Args): Promise<CallToolResult> => {
    try {
      return textResult(await callback(args));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ text: `Error: ${message}`, type: "text" }],
        isError: true,
      };
    }
  };
}

function getAddCommand(items: string[]) {
  const runner = getPackageRunner(getPackageManager(process.cwd()));

  return `${runner} time2code add ${items.join(" ")}`;
}

function formatList(
  items: RegistryItem[],
  options: { limit?: number; offset?: number; query?: string }
) {
  const offset = options.offset ?? 0;
  const limit = options.limit || DEFAULT_LIMIT;
  const page = items.slice(offset, offset + limit);
  const header = `Found ${items.length} items${options.query ? ` matching "${options.query}"` : ""}.`;

  if (page.length === 0) {
    return header;
  }

  const lines = page.map((item) => {
    const description = item.description ? ` - ${item.description}` : "";
    return `- ${item.name} (${getItemKind(item)})${description}`;
  });
  const more =
    offset + limit < items.length
      ? `\n\nMore items available. Use offset: ${offset + limit} to see the next page.`
      : "";

  return `${header} Showing ${offset + 1}-${offset + page.length}:\n\n${lines.join("\n")}${more}\n\nAdd command: \`${getAddCommand(["<name>"])}\``;
}

function formatItem(item: RegistryItem) {
  return [
    `## ${item.name}`,
    item.description,
    `**Kind:** ${getItemKind(item)}`,
    item.files?.length
      ? `**Files:**\n${item.files.map((file) => `- ${file.target ?? file.path}`).join("\n")}`
      : "",
    item.dependencies?.length
      ? `**Dependencies:** ${item.dependencies.join(", ")}`
      : "",
    item.registryDependencies?.length
      ? `**Registry dependencies:** ${item.registryDependencies.map((dependency) => dependency.replace(`${REGISTRY_NAMESPACE}/`, "")).join(", ")}`
      : "",
    `**Add command:** \`${getAddCommand([item.name])}\``,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function formatExample(item: RegistryItem) {
  const code = (item.files ?? [])
    .filter((file) => file.content)
    .map((file) => `\`\`\`tsx\n${file.content}\n\`\`\``)
    .join("\n\n");

  return `## ${item.name}\n\n${item.description ?? ""}\n\n${code}`;
}

/**
 * The MCP server for the time2code/ui registry. Each connection gets its own
 * instance.
 */
export function createServer() {
  const server = new McpServer(
    { name: "time2code", version: "1.0.0" },
    { capabilities: { tools: { listChanged: false } } }
  );

  server.registerTool(
    "list_items",
    {
      description:
        "List the components, hooks, blocks and examples of the time2code/ui registry.",
      inputSchema: z.object({
        kinds: kindsField,
        limit: limitField,
        offset: offsetField,
      }),
    },
    tool(async ({ kinds, limit, offset }) => {
      const index = await fetchRegistryIndex(getRegistryTemplate());
      return formatList(searchItems(index, { kinds }), { limit, offset });
    })
  );

  server.registerTool(
    "search_items",
    {
      description:
        "Search the time2code/ui registry by name, title, description or category.",
      inputSchema: z.object({
        kinds: kindsField,
        limit: limitField,
        offset: offsetField,
        query: z.string().describe("Words to search for, e.g. 'date picker'"),
      }),
    },
    tool(async ({ kinds, limit, offset, query }) => {
      const index = await fetchRegistryIndex(getRegistryTemplate());
      return formatList(searchItems(index, { kinds, query }), {
        limit,
        offset,
        query,
      });
    })
  );

  server.registerTool(
    "view_items",
    {
      description:
        "Show details of registry items: files, dependencies and the add command.",
      inputSchema: z.object({
        items: z
          .array(z.string())
          .min(1)
          .describe("Item names, e.g. ['button', 'card']"),
      }),
    },
    tool(async ({ items }) => {
      const index = await fetchRegistryIndex(getRegistryTemplate());
      return items
        .map((name) => {
          const item = index.find((candidate) => candidate.name === name);
          return item ? formatItem(item) : `## ${name}\n\nNot found.`;
        })
        .join("\n\n---\n\n");
    })
  );

  server.registerTool(
    "get_item_examples",
    {
      description:
        "Get usage examples with full code for a component, e.g. 'button' or 'area-chart'.",
      inputSchema: z.object({
        query: z
          .string()
          .describe("Name of the component to find examples for"),
      }),
    },
    tool(async ({ query }) => {
      const registryTemplate = getRegistryTemplate();
      const index = await fetchRegistryIndex(registryTemplate);
      const examples = index
        .filter(
          (item) =>
            getItemKind(item) === "example" &&
            (item.categories?.includes(query) ||
              item.name.startsWith(`p-${query}-`))
        )
        .slice(0, MAX_EXAMPLES);

      if (examples.length === 0) {
        return `No examples found for "${query}". Use search_items to find the component name.`;
      }

      const items = await Promise.all(
        examples.map((item) => fetchRegistryItem(item.name, registryTemplate))
      );
      return `# Examples for ${query}\n\n${items.map(formatExample).join("\n\n---\n\n")}`;
    })
  );

  server.registerTool(
    "get_add_command",
    {
      description:
        "Get the command that adds registry items to the project. Run it in the project directory.",
      inputSchema: z.object({
        items: z
          .array(z.string())
          .min(1)
          .describe("Item names, e.g. ['button']"),
      }),
    },
    tool(async ({ items }) => getAddCommand(items))
  );

  server.registerTool(
    "get_audit_checklist",
    {
      description:
        "A checklist to verify components after adding them or generating code with them.",
      inputSchema: z.object({}),
    },
    tool(async () =>
      [
        "## Component Audit Checklist",
        "",
        "- [ ] Imports are correct, e.g. named vs default imports",
        "- [ ] All dependencies are installed",
        '- [ ] The global CSS file imports Tailwind CSS (`@import "tailwindcss";`) and defines the color tokens',
        "- [ ] There are no lint errors (`biome check`)",
        "- [ ] There are no TypeScript errors",
      ].join("\n")
    )
  );

  return server;
}
