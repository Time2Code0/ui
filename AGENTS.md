# time2code/ui

A pnpm workspace with two packages:

- `site/` is the Next.js docs site and the shadcn registry (`site/registry.json`, built into `site/public/r` by `pnpm build:registry`). Read `site/AGENTS.md` before working on it.
  - Registry items reference each other through the `@time2code` namespace (`"registryDependencies": ["@time2code/icon"]`), so the built registry contains no URLs. shadcn CLI users map the namespace in their `components.json`; the `time2code` CLI maps it internally.
- `cli/` is the `time2code` CLI (`add`, `create`, `mcp`). It installs registry items with `@shadcn/registry` and detects the project setup instead of reading a `components.json`. Build it with `pnpm --filter time2code build` and test it with `pnpm --filter time2code test` (vitest). It uses `https://design.time2code.dev/r` by default; set `REGISTRY_URL=http://localhost:3000/r` to use the local site.

Project templates for `time2code create` live in their own repositories (e.g. `time2code0/next-starter-template`), listed in `TEMPLATES` in `cli/src/commands/create.ts`. This lets templates and the CLI/registry be updated independently.

Run `pnpm check` and `pnpm fix` (Biome via ultracite) from the root.
