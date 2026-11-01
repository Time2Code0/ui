# time2code/ui

A pnpm workspace with two packages:

- `site/` is the Next.js docs site and the shadcn registry (`site/registry.json`, built into `site/public/r` by `pnpm build:registry`). Read `site/AGENTS.md` before working on it.
  - Registry items reference each other through the `@time2code` namespace (`"registryDependencies": ["@time2code/icon"]`), so the built registry contains no URLs. shadcn CLI users map the namespace in their `components.json`; the `time2code` CLI maps it internally.
- `cli/` is the `time2code` CLI (`add`, `create`, `mcp`). It installs registry items with `@shadcn/registry` and detects the project setup instead of reading a `components.json`. Build it with `pnpm --filter time2code build` and test it with `pnpm --filter time2code test` (vitest). It uses `https://ui.time2code.dev/r` by default; set `REGISTRY_URL=http://localhost:3000/r` to use the local site.

`skills/` holds agent skills for using the library, in the [Agent Skills](https://agentskills.io) format (`skills/<name>/SKILL.md`, with the directory name matching `name`). The [skills CLI](https://skills.sh) finds them there (`npx skills add . --list`). It isn't a workspace package. There are three skills: `time2code-ui` (primary), `time2code-charts` and `time2code-particles`. The particle index is generated: run `pnpm build:skills` after adding, removing or renaming particles. Update the hand-written component guides when a component's API changes. Read `skills/README.md` before adding a skill.

Project templates for `time2code create` live in their own repositories (e.g. `time2code0/next-starter-template`), listed in `TEMPLATES` in `cli/src/commands/create.ts`. This lets templates and the CLI/registry be updated independently.

Run `pnpm check` and `pnpm fix` (Biome via ultracite) from the root.
