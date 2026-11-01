# time2code

Add [time2code/ui](https://ui.time2code.dev) components to your project, start new apps, and give AI agents access to the registry.

```bash
npx time2code add button
```

## Commands

### `add [components...]`

Adds components and their dependencies. No config file is needed: the CLI reads the import alias from your `tsconfig.json` (e.g. `"@/*": ["./src/*"]`) and finds the CSS file that imports Tailwind CSS. Components go to the usual places:

| Kind | Location |
| --- | --- |
| UI primitives | `components/ui/*` |
| Charts, marketing | `components/charts/*`, `components/marketing/*` |
| Hooks | `hooks/*` |
| Pages of blocks | `app/*` |

All of these are under `src/` when your alias points there.

In a monorepo root, the CLI asks which workspace to install into. You can also pass it with `--cwd apps/web`.

| Option | |
| --- | --- |
| `-c, --cwd <path>` | the project directory |
| `-o, --overwrite` | overwrite existing files |
| `-p, --path <path>` | install into this directory instead |
| `-y, --yes` | skip prompts |
| `--registry <url>` | registry URL, overrides `REGISTRY_URL` |

Run it without names to pick components from a list.

Names resolve to the `@time2code` registry namespace (`button` → `@time2code/button`), which the CLI configures internally. Items of other namespaces, URLs and local `.json` files work too.

### `create [name]`

Creates a project from a template repository: [next-starter-template](https://github.com/time2code0/next-starter-template) sets up Next.js with Biome, Tailwind CSS v4 and the color tokens, ready for `time2code add`. Only the latest commit is cloned, without its history.

| Option | |
| --- | --- |
| `-t, --template <name>` | the template (`next`) |
| `--package-manager <name>` | `pnpm`, `npm`, `yarn` or `bun` |
| `--no-install` | skip installing dependencies |
| `--no-git` | skip `git init` |

### `mcp`

Starts an MCP server on stdio, with tools to list, search and view components, get usage examples, and get the add command.

```bash
npx time2code mcp init --client claude   # or cursor, vscode, opencode, codex
```

## Development

```bash
pnpm --filter time2code build
pnpm --filter time2code test
```

| Environment variable | |
| --- | --- |
| `REGISTRY_URL` | registry URL, e.g. `http://localhost:3000/r` or `http://localhost:3000/r/{name}.json`. Defaults to `https://ui.time2code.dev/r` |
| `TIME2CODE_TEMPLATE_DIR` | copy a local template checkout instead, e.g. `~/dev/next-starter-template` |
| `TIME2CODE_TEMPLATE_REPO` | clone this git repository instead of the template's |
