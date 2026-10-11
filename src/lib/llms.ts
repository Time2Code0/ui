import { Children, isValidElement } from "react";

import { asMarkdown, md } from "fumadocs-core/server";
import { llms } from "fumadocs-core/source";

import { ComponentSource } from "@/components/mdx/component-source";

import { source } from "./source";

export const docsLlms = llms(source, {
  renderPage: async (
    page
  ) => `# ${page.data.title} ${page.data.description ? `- ${page.data.description}` : ""}
URL: ${page.url}
Source: https://raw.githubusercontent.com/time2code0/design-system/refs/heads/main/content/docs/${page.path}

${await page.data.getText("processed", { components: { CodeBlockTabs: MarkdownCodeBlockTabs, ComponentSource } })}`,
});

function MarkdownCodeBlockTabs({ children }: { children?: React.ReactNode }) {
  if (!asMarkdown()) {
    return null;
  }

  // Find CodeBlockTab with value "npm" to extract the children containg the install command
  const selectedTab = Children.toArray(children).find(
    (child) =>
      isValidElement<{ value?: string }>(child) && child.props.value === "npm"
  );

  if (!isValidElement<{ children?: React.ReactNode }>(selectedTab)) {
    return null;
  }

  return md`${selectedTab.props.children}`;
}
