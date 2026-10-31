import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach } from "vitest";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true }))
  );
});

/** A temporary directory with the given files, removed after each test. */
export async function createFixture(files: Record<string, string | object>) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "time2code-test-"));
  tempDirs.push(dir);

  await Promise.all(
    Object.entries(files).map(async ([file, content]) => {
      const filePath = path.join(dir, file);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(
        filePath,
        typeof content === "string" ? content : JSON.stringify(content, null, 2)
      );
    })
  );

  return dir;
}

/**
 * A Next.js app like the `next` template. Its dependencies are declared, so
 * adding components never runs a package manager.
 */
export function nextAppFiles(
  overrides: Record<string, string | object> = {}
): Record<string, string | object> {
  return {
    "next.config.ts": "export default {};\n",
    "package.json": {
      dependencies: { cn: "^0.2.6", next: "16.4.1", react: "19.3.0" },
      name: "app",
    },
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
    "src/app/layout.tsx": "export default function Layout() {}\n",
    "src/styles/globals.css": '@import "tailwindcss";\n',
    "tsconfig.json":
      '{\n  // comments are allowed\n  "compilerOptions": { "paths": { "@/*": ["./src/*"] } },\n}\n',
    ...overrides,
  };
}
