# CLI reference

Use this when installing components, starting a project, or connecting an agent to the registry.

## `time2code add`

```bash
npx time2code add button dialog
```

- No `components.json` is needed. The CLI reads the import alias from `tsconfig.json` (for example `"@/*": ["./src/*"]`) and finds the CSS file that imports Tailwind CSS.
- It installs npm dependencies and every component the requested ones need (`dialog` brings `button`, `icon` and `scroll-area`).
- Files go to `components/ui`, `components/charts`, `components/marketing` and `hooks` (under `src/` when the alias points there).
- Names resolve to the `@time2code` namespace (`button` → `@time2code/button`). Items of other namespaces, URLs and local `.json` files work too.
- Run it without names to pick from a list.

| Option | |
| --- | --- |
| `-c, --cwd <path>` | the project directory (use it from a monorepo root, e.g. `--cwd apps/web`) |
| `-o, --overwrite` | overwrite existing files |
| `-p, --path <path>` | install into this directory instead |
| `-y, --yes` | skip prompts |
| `-s, --silent` | hide output |
| `--registry <url>` | registry URL, overrides `REGISTRY_URL` |

Use the project's package runner: `npx`, `pnpm dlx`, `yarn dlx` or `bunx`. Don't invent flags.

Registry item names match the file names, with one exception: Form is `form-baseui`.

## `time2code create`

```bash
npx time2code create my-app
```

Creates a Next.js project from a template that already has Tailwind CSS v4, Biome and the color tokens set up. Options: `-t, --template <name>`, `--package-manager <name>`, `--no-install`, `--no-git`, `-y, --yes`.

## `time2code mcp`

```bash
npx time2code mcp init --client claude   # or cursor, vscode, opencode, codex
```

Adds an MCP server with tools to list, search and view registry items (`list_items`, `search_items`, `view_items`), get usage examples with full code (`get_item_examples`), get the add command (`get_add_command`) and an audit checklist (`get_audit_checklist`).

## shadcn CLI

Projects that already use the shadcn CLI can map the namespace in `components.json`:

```json
{
  "registries": {
    "@time2code": "https://ui.time2code.dev/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @time2code/button
```

## Reading particle source

Particles (`p-<component>-<n>`) are working examples of each component. The `time2code-particles` skill indexes all of them with descriptions. To read one:

- MCP: `get_item_examples` with the component name.
- Registry JSON: `https://ui.time2code.dev/r/p-dialog-1.json` (the code is in `files[].content`).
- Docs as Markdown, with every example on the page: `https://ui.time2code.dev/docs/ui/dialog.md`.

Particles import from `@/registry/ui/*`. In a project those files live at `@/components/ui/*`.
