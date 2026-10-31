import type { AddressInfo } from "node:net";

import { createServer } from "node:http";

const itemPathRegex = /^\/r\/(.+)\.json$/;

/**
 * A small registry in the shape of `site/public/r`, with dependencies in the
 * `@time2code` namespace like the site.
 */
const ITEMS = [
  {
    dependencies: ["cn"],
    files: [
      {
        content:
          'export function Spinner() {\n  return <span aria-busy="true" />;\n}\n',
        path: "src/registry/ui/loading.tsx",
        type: "registry:ui",
      },
    ],
    name: "loading",
    type: "registry:ui",
  },
  {
    dependencies: ["cn"],
    description: "An accessible button with size and visual variants.",
    files: [
      {
        content:
          'import { cn } from "cn";\n\nimport { Spinner } from "./loading";\n\nexport function Button({ className }: { className?: string }) {\n  return (\n    <button className={cn("rounded-lg", className)} type="button">\n      <Spinner />\n    </button>\n  );\n}\n',
        path: "src/registry/ui/button.tsx",
        type: "registry:ui",
      },
    ],
    name: "button",
    registryDependencies: ["@time2code/loading"],
    title: "Button",
    type: "registry:ui",
  },
  {
    css: { "@keyframes beam": { "100%": { "offset-distance": "100%" } } },
    cssVars: { theme: { "animate-beam": "beam 2s linear infinite" } },
    files: [
      {
        content:
          'import { Button } from "@/registry/ui/button";\n\nexport function Beam() {\n  return <Button className="animate-beam" />;\n}\n',
        path: "src/registry/marketing/beam.tsx",
        target: "@components/marketing/beam.tsx",
        type: "registry:component",
      },
    ],
    name: "beam",
    registryDependencies: ["@time2code/button"],
    type: "registry:component",
  },
  {
    files: [
      {
        content:
          "export function useToggle() {\n  return [false, () => undefined] as const;\n}\n",
        path: "src/registry/hooks/use-toggle.ts",
        type: "registry:hook",
      },
    ],
    name: "use-toggle",
    type: "registry:hook",
  },
  {
    categories: ["authentication"],
    files: [
      {
        content:
          'import { LoginForm } from "@/registry/blocks/login-01/components/login-form";\n\nexport default function Page() {\n  return <LoginForm />;\n}\n',
        path: "src/registry/blocks/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        content:
          'import { Button } from "@/registry/ui/button";\n\nexport function LoginForm() {\n  return <Button />;\n}\n',
        path: "src/registry/blocks/login-01/components/login-form.tsx",
        target: "@components/login-01/login-form.tsx",
        type: "registry:component",
      },
    ],
    name: "login-01",
    registryDependencies: ["@time2code/button"],
    type: "registry:block",
  },
  {
    categories: ["button"],
    description: "Default button",
    files: [
      {
        content:
          'import { Button } from "@/registry/ui/button";\n\nexport function Particle() {\n  return <Button />;\n}\n',
        path: "src/registry/particles/p-button-1.tsx",
        type: "registry:block",
      },
    ],
    name: "p-button-1",
    registryDependencies: ["@time2code/button"],
    type: "registry:block",
  },
];

export interface RegistryServer {
  close: () => Promise<void>;
  /** base URL of the items, e.g. `http://127.0.0.1:1234/r` */
  url: string;
}

export async function startRegistryServer(): Promise<RegistryServer> {
  let url = "";

  const server = createServer((request, response) => {
    const name = request.url?.match(itemPathRegex)?.[1];
    const json = (body: unknown) => {
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify(body));
    };

    if (name === "registry") {
      json({
        homepage: url,
        items: ITEMS.map(({ files, ...rest }) => ({
          ...rest,
          files: files.map(({ content: _, ...file }) => file),
        })),
        name: "time2code",
      });
      return;
    }

    const item = ITEMS.find((candidate) => candidate.name === name);
    if (item) {
      json(item);
      return;
    }

    response.statusCode = 404;
    response.end("Not found");
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/r`;

  return {
    close: () =>
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      ),
    url,
  };
}
