import { existsSync } from "node:fs";
import {
  cp,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { intro, log, outro, select, spinner, text } from "@clack/prompts";
import { Command, Option } from "commander";
import pc from "picocolors";
import { x } from "tinyexec";

import { CliError } from "../utils/errors";
import {
  getUserAgentPackageManager,
  type PackageManager,
} from "../utils/package-manager";
import { isInteractive, requireInteractive, unwrap } from "../utils/prompts";

const packageNameRegex =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/** Each template is a standalone repository, versioned apart from the CLI. */
export const TEMPLATES = {
  next: {
    description: "Next.js app with Biome, Tailwind CSS v4 and the color tokens",
    repo: "https://github.com/time2code0/next-starter-template.git",
    title: "Next.js",
  },
} as const;

/** Not copied from a local template checkout. */
const IGNORED_TEMPLATE_FILES = new Set([
  ".DS_Store",
  ".git",
  ".next",
  "node_modules",
]);

export type TemplateName = keyof typeof TEMPLATES;

export interface CreateOptions {
  cwd: string;
  git: boolean;
  install: boolean;
  interactive: boolean;
  packageManager?: PackageManager;
  template?: string;
}

function validateName(name: string): string | undefined {
  return packageNameRegex.test(name)
    ? undefined
    : "Use lowercase letters, numbers, dashes, dots or underscores.";
}

async function isEmptyDir(dir: string) {
  if (!existsSync(dir)) {
    return true;
  }

  return (await readdir(dir)).length === 0;
}

/**
 * Copies the latest commit of the template repository into `projectPath`,
 * without its git history.
 *
 * For developing templates, `TIME2CODE_TEMPLATE_DIR` copies a local checkout
 * instead and `TIME2CODE_TEMPLATE_REPO` clones another repository.
 */
export async function fetchTemplate(
  template: TemplateName,
  projectPath: string
) {
  const localDir = process.env.TIME2CODE_TEMPLATE_DIR;

  if (localDir) {
    await cp(path.resolve(localDir), projectPath, {
      filter: (source) => !IGNORED_TEMPLATE_FILES.has(path.basename(source)),
      recursive: true,
    });
    return;
  }

  const repo = process.env.TIME2CODE_TEMPLATE_REPO ?? TEMPLATES[template].repo;
  const checkout = await mkdtemp(path.join(os.tmpdir(), "time2code-"));

  try {
    const result = await x("git", ["clone", "--depth", "1", repo, checkout]);

    if (result.exitCode !== 0) {
      throw new CliError(`Could not clone the template from ${repo}.`, {
        hint: result.stderr.trim() || undefined,
      });
    }

    await rm(path.join(checkout, ".git"), { force: true, recursive: true });
    await cp(checkout, projectPath, { recursive: true });
  } finally {
    await rm(checkout, { force: true, recursive: true });
  }
}

/** Renames the project and drops pnpm-only files for other package managers. */
export async function prepareProject(
  projectPath: string,
  name: string,
  packageManager: PackageManager
) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

  packageJson.name = path.basename(name);

  if (packageManager !== "pnpm") {
    packageJson.packageManager = undefined;
    await rm(path.join(projectPath, "pnpm-workspace.yaml"), { force: true });
  }

  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function initGit(projectPath: string) {
  try {
    const git = (args: string[]) =>
      x("git", args, { nodeOptions: { cwd: projectPath }, throwOnError: true });

    await git(["init"]);
    await git(["add", "-A"]);
    await git(["commit", "-m", "feat: initial commit"]);
    return true;
  } catch {
    return false;
  }
}

async function resolveTemplate(options: CreateOptions): Promise<TemplateName> {
  const names = Object.keys(TEMPLATES) as TemplateName[];

  if (options.template) {
    if (!names.includes(options.template as TemplateName)) {
      throw new CliError(`Unknown template "${options.template}".`, {
        hint: `Available templates: ${names.join(", ")}`,
      });
    }
    return options.template as TemplateName;
  }

  if (names.length === 1 || !options.interactive) {
    return names[0];
  }

  return unwrap(
    await select({
      message: "Which template would you like to use?",
      options: names.map((value) => ({
        hint: TEMPLATES[value].description,
        label: TEMPLATES[value].title,
        value,
      })),
    })
  );
}

export async function runCreate(
  inputName: string | undefined,
  options: CreateOptions
) {
  let name = inputName;

  if (!name) {
    requireInteractive(
      options.interactive,
      "Name the project, e.g. `time2code create my-app`."
    );
    name = unwrap(
      await text({
        message: "What is your project named?",
        placeholder: "my-app",
        validate: (value) => validateName(path.basename(value ?? "")),
      })
    );
  }

  const nameError = validateName(path.basename(name));
  if (nameError) {
    throw new CliError(`Invalid project name "${name}".`, { hint: nameError });
  }

  const projectPath = path.resolve(options.cwd, name);
  if (!(await isEmptyDir(projectPath))) {
    throw new CliError(`The directory ${projectPath} is not empty.`);
  }

  const template = await resolveTemplate(options);
  const packageManager =
    options.packageManager ?? getUserAgentPackageManager() ?? "pnpm";
  const progress = spinner();

  progress.start(`Creating a ${TEMPLATES[template].title} project`);
  try {
    await fetchTemplate(template, projectPath);
    await prepareProject(projectPath, name, packageManager);
  } catch (error) {
    progress.error("Could not create the project");
    await rm(projectPath, { force: true, recursive: true });
    throw error;
  }
  progress.stop(`Created ${pc.cyan(path.relative(options.cwd, projectPath))}`);

  let installed = false;
  if (options.install) {
    progress.start(`Installing dependencies with ${packageManager}`);
    const result = await x(packageManager, ["install"], {
      nodeOptions: { cwd: projectPath },
    });
    installed = result.exitCode === 0;
    if (installed) {
      progress.stop("Installed dependencies");
    } else {
      progress.error(`${packageManager} install failed`);
      log.message(result.stderr || result.stdout);
    }
  }

  if (options.git && (await initGit(projectPath))) {
    log.success("Initialized a git repository");
  }

  return { installed, packageManager, projectPath, template };
}

export function createCreateCommand() {
  return new Command("create")
    .description("create a new project from a template")
    .argument("[name]", "the project name and directory")
    .addOption(
      new Option("-t, --template <name>", "the template to use").choices(
        Object.keys(TEMPLATES)
      )
    )
    .addOption(
      new Option(
        "--package-manager <name>",
        "the package manager to install with"
      ).choices(["pnpm", "npm", "yarn", "bun"])
    )
    .option("-c, --cwd <path>", "where to create the project", process.cwd())
    .option("--no-install", "skip installing dependencies")
    .option("--no-git", "skip initializing a git repository")
    .option("-y, --yes", "skip prompts", false)
    .action(
      async (
        name: string | undefined,
        options: Omit<CreateOptions, "interactive"> & { yes: boolean }
      ) => {
        intro(pc.bgCyan(pc.black(" time2code create ")));

        const result = await runCreate(name, {
          ...options,
          interactive: isInteractive(options.yes),
        });
        const { installed, packageManager, projectPath } = result;
        const steps = [
          `cd ${path.relative(options.cwd, projectPath)}`,
          installed ? null : `${packageManager} install`,
          `${packageManager === "npm" ? "npm run" : packageManager} dev`,
        ].filter(Boolean);

        outro(
          `${installed ? "Done!" : "Created the project."} Next steps:\n\n  ${steps.join("\n  ")}`
        );
      }
    );
}
