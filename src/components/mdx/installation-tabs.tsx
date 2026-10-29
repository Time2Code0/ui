import { siteConfig } from "@/lib/config";
import { getRegistryItem } from "@/lib/registry";
import { TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentSource } from "../component-source";
import { DynamicCodeBlock } from "../dynamic-codeblock";
import { PackageManagerTabs } from "../package-manager-tabs";
import { CodeTabs } from "./code-tabs";
import { Heading } from "./heading";

export async function InstallationTabs({ name }: { name: string }) {
  const items = await getRegistryTree(name);
  const dependencies = [
    ...new Set(items.flatMap((item) => item.dependencies ?? [])),
  ];
  const devDependencies = [
    ...new Set(items.flatMap((item) => item.devDependencies ?? [])),
  ];
  const css = getCss(items);

  return (
    <CodeTabs>
      <TabsList className="bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none">
        <TabsTab value="cli">CLI</TabsTab>
        <TabsTab value="manual">Manual</TabsTab>
      </TabsList>
      <TabsPanel
        className="relative [&>.steps]:mt-6 [&_h3]:font-medium [&_h3]:text-base *:[figure]:first:mt-0"
        value="cli"
      >
        <PackageManagerTabs
          className="not-typeset full-width"
          command={`npx shadcn@latest add ${siteConfig.url}/r/${name}.json`}
        />
      </TabsPanel>
      <TabsPanel
        className="relative [&>.steps]:mt-6 [&_h3]:font-medium [&_h3]:text-base *:[figure]:first:mt-0"
        value="manual"
      >
        {dependencies.length > 0 ? (
          <>
            <Heading as="h3">Install the following dependencies:</Heading>
            <PackageManagerTabs
              className="not-typeset full-width"
              command={`npm ${dependencies.join(" ")}`}
            />
            {devDependencies.length > 0 ? (
              <PackageManagerTabs
                className="not-typeset full-width"
                command={`npm -D ${devDependencies.join(" ")}`}
              />
            ) : null}
          </>
        ) : null}

        <Heading as="h3">
          Copy and paste the following code into your project.
        </Heading>

        {items.flatMap((item) =>
          (item.files ?? []).map((file) => (
            <ComponentSource
              className="not-typeset full-width"
              file={file.path}
              key={`${item.name}:${file.path}`}
              name={item.name}
            />
          ))
        )}

        {css ? (
          <>
            <Heading as="h3">Add the following to your CSS file:</Heading>
            <DynamicCodeBlock
              code={css}
              codeblock={{ className: "not-typeset full-width my-4" }}
              lang="css"
            />
          </>
        ) : null}

        <Heading as="h3">
          Update the import paths to match your project setup.
        </Heading>
      </TabsPanel>
    </CodeTabs>
  );
}

type RegistryItem = Awaited<ReturnType<typeof getRegistryItem>>;
type CssRules = NonNullable<RegistryItem["css"]>;
type CssVars = NonNullable<RegistryItem["cssVars"]>;

const REGISTRY_ITEM_URL_REGEX = /\/r\/([\w-]+)\.json$/;

// The item followed by all of its registry dependencies, breadth-first and
// de-duplicated, so the manual install lists every file the CLI would add.
async function getRegistryTree(
  name: string,
  items = new Map<string, RegistryItem>(),
  pending = [name]
): Promise<RegistryItem[]> {
  const names = [...new Set(pending)].filter(
    (pendingName) => !items.has(pendingName)
  );

  if (names.length === 0) {
    return [...items.values()];
  }

  const registryItems = await Promise.all(names.map(getRegistryItem));

  for (const item of registryItems) {
    items.set(item.name, item);
  }

  const subItems = registryItems.flatMap((item) =>
    (item.registryDependencies ?? []).map(
      (dependency) =>
        dependency.match(REGISTRY_ITEM_URL_REGEX)?.[1] ?? dependency
    )
  );

  return getRegistryTree(name, items, subItems);
}

const CSS_VAR_SELECTORS = [
  ["theme", "@theme inline"],
  ["light", ":root"],
  ["dark", ".dark"],
] as const;

function printRules(rules: CssRules, depth = 0): string[] {
  const indent = "  ".repeat(depth);

  return Object.entries(rules).map(([selector, value]) => {
    if (typeof value === "string") {
      return `${indent}${selector}: ${value};`;
    }

    // At-rules without a body, e.g. `@plugin "foo"`.
    if (Object.keys(value).length === 0 && selector.startsWith("@")) {
      return `${indent}${selector};`;
    }

    return [
      `${indent}${selector} {`,
      ...printRules(value as CssRules, depth + 1),
      `${indent}}`,
    ].join("\n");
  });
}

function getCss(items: RegistryItem[]) {
  const cssVars: CssVars = {};
  const css: CssRules = {};

  for (const item of items) {
    for (const [key] of CSS_VAR_SELECTORS) {
      if (item.cssVars?.[key]) {
        cssVars[key] = { ...cssVars[key], ...item.cssVars[key] };
      }
    }

    Object.assign(css, item.css);
  }

  const blocks: string[] = [];

  for (const [key, selector] of CSS_VAR_SELECTORS) {
    const vars = cssVars[key];

    if (vars && Object.keys(vars).length > 0) {
      const declarations = Object.fromEntries(
        Object.entries(vars).map(([name, value]) => [`--${name}`, value])
      );
      blocks.push(...printRules({ [selector]: declarations }));
    }
  }

  blocks.push(...printRules(css));

  return blocks.length > 0 ? blocks.join("\n\n") : null;
}
