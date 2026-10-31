import path from "node:path";

import {
  autocompleteMultiselect,
  intro,
  log,
  outro,
  select,
  text,
} from "@clack/prompts";
import { addRegistryItems } from "@shadcn/registry";
import { Command } from "commander";
import pc from "picocolors";

import { CliError } from "../utils/errors";
import { getWorkspaceTargets, isMonorepoRoot } from "../utils/monorepo";
import { createRegistryConfig, getProjectInfo } from "../utils/project";
import { isInteractive, requireInteractive, unwrap } from "../utils/prompts";
import {
  fetchRegistryIndex,
  getItemKind,
  getRegistryTemplate,
  resolveItem,
} from "../utils/registry";

export interface AddOptions {
  cwd: string;
  interactive: boolean;
  overwrite: boolean;
  /** directory or file to install into, instead of the default location */
  path?: string;
  registry?: string;
  silent: boolean;
}

/** select value of the free-form path option, never a valid path */
const OTHER_PATH = "\0other";

async function selectWorkspace(root: string, options: AddOptions) {
  const targets = await getWorkspaceTargets(root);
  const hint = targets
    .map((target) => `  time2code add <component> --cwd ${target.name}`)
    .join("\n");

  if (!options.interactive) {
    throw new CliError(
      "You are in a monorepo root. Choose the workspace to add components to.",
      { hint: targets.length > 0 ? `Pass it with --cwd:\n${hint}` : undefined }
    );
  }

  const choice = unwrap(
    await select<string>({
      message: "Which workspace should the components be added to?",
      options: [
        ...targets.map((target) => ({
          label: target.name,
          value: target.path,
        })),
        { label: "Other (enter a path)", value: OTHER_PATH },
      ],
    })
  );

  if (choice !== OTHER_PATH) {
    return choice;
  }

  const input = unwrap(
    await text({
      message: "Path to the workspace, relative to the monorepo root",
      placeholder: "apps/web",
      validate: (value) => (value ? undefined : "Enter a path."),
    })
  );

  return path.resolve(root, input);
}

async function selectItems(registryTemplate: string) {
  const index = await fetchRegistryIndex(registryTemplate);
  const items = index.filter((item) => getItemKind(item) !== "example");

  return unwrap(
    await autocompleteMultiselect({
      message: "Which components would you like to add?",
      options: items.map((item) => ({
        hint: getItemKind(item),
        label: item.name,
        value: item.name,
      })),
      placeholder: "Type to search",
      required: true,
    })
  );
}

/**
 * Installs registry items with the shadcn registry engine. The project
 * config is detected on every run, so no `components.json` is written.
 */
export async function runAdd(items: string[], options: AddOptions) {
  const registryTemplate = getRegistryTemplate(options.registry);
  let cwd = path.resolve(options.cwd);

  if (await isMonorepoRoot(cwd)) {
    cwd = await selectWorkspace(cwd, options);
  }

  const project = await getProjectInfo(cwd);
  let selected = items;

  if (selected.length === 0) {
    requireInteractive(
      options.interactive,
      "Name the components to add, e.g. `time2code add button`."
    );
    selected = await selectItems(registryTemplate);
  }

  await addRegistryItems(selected.map(resolveItem), {
    config: createRegistryConfig(project, registryTemplate),
    cwd,
    overwrite: options.overwrite,
    path: options.path,
    silent: options.silent,
  });

  return { cwd, items: selected };
}

export function createAddCommand() {
  return new Command("add")
    .description("add components to your project")
    .argument("[components...]", "names of the components to add")
    .option("-c, --cwd <path>", "the project directory", process.cwd())
    .option("-o, --overwrite", "overwrite existing files", false)
    .option("-p, --path <path>", "install into this directory instead")
    .option("-y, --yes", "skip prompts", false)
    .option("-s, --silent", "hide output", false)
    .option(
      "--registry <url>",
      "registry URL, e.g. http://localhost:3000/r (or REGISTRY_URL)"
    )
    .action(
      async (
        components: string[],
        options: Omit<AddOptions, "interactive"> & { yes: boolean }
      ) => {
        if (!options.silent) {
          intro(pc.bgCyan(pc.black(" time2code add ")));
        }

        const result = await runAdd(components, {
          ...options,
          interactive: isInteractive(options.yes),
        });

        if (!options.silent) {
          const count = result.items.length;
          if (result.cwd !== path.resolve(options.cwd)) {
            log.info(`Workspace: ${path.relative(options.cwd, result.cwd)}`);
          }
          outro(`Added ${count} component${count === 1 ? "" : "s"}.`);
        }
      }
    );
}
