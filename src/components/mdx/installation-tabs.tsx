import { siteConfig } from "@/lib/config";
import { getRegistryItem } from "@/lib/registry";
import { TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

import { ComponentSource } from "../component-source";
import { DynamicCodeBlock } from "../dynamic-codeblock";
import { PackageManagerTabs } from "../package-manager-tabs";
import { CodeTabs } from "./code-tabs";
import { Heading } from "./heading";

export async function InstallationTabs({ name }: { name: string }) {
  const item = await getRegistryItem(name);
  const css = getCss(item);

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
        {item.dependencies ? (
          <>
            <Heading as="h3">Install the following dependencies:</Heading>
            <PackageManagerTabs
              className="not-typeset full-width"
              command={`npm ${item.dependencies.join(" ")}`}
            />
          </>
        ) : null}

        <Heading as="h3">
          Copy and paste the following code into your project.
        </Heading>

        <ComponentSource className="not-typeset full-width" name={name} />

        {item.registryDependencies && item.registryDependencies.length > 0
          ? item.registryDependencies?.map((dep) => (
              <ComponentSource
                className="not-typeset full-width"
                key={dep}
                name={dep.split("/").pop()?.replace(".json", "") ?? ""}
              />
            ))
          : null}

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

function getCss({ cssVars, css }: RegistryItem) {
  const blocks: string[] = [];

  for (const [key, selector] of CSS_VAR_SELECTORS) {
    const vars = cssVars?.[key];

    if (vars && Object.keys(vars).length > 0) {
      const declarations = Object.fromEntries(
        Object.entries(vars).map(([name, value]) => [`--${name}`, value])
      );
      blocks.push(...printRules({ [selector]: declarations }));
    }
  }

  if (css) {
    blocks.push(...printRules(css));
  }

  return blocks.length > 0 ? blocks.join("\n\n") : null;
}
