import { cacheLife } from "next/cache";

import { cn } from "cn";
import { type HighlightOptions, highlight } from "fumadocs-core/highlight";

import { CodeBlock, type CodeBlockProps, Pre } from "./codeblock";

export type DynamicCodeBlockProps = HighlightOptions & {
  code: string;

  /**
   * Extra props for the underlying `<CodeBlock />` component.
   *
   * Ignored if you defined your own `pre` component in `components`.
   */
  codeblock?: CodeBlockProps;
};

export async function DynamicCodeBlock({
  code,
  codeblock,
  lang,
  ...options
}: DynamicCodeBlockProps) {
  // Shiki reads the current time while highlighting, so the output is cached
  // to keep it in the prerendered page.
  "use cache";
  cacheLife("max");

  return await highlight(code, {
    defaultColor: false,
    ...options,
    components: {
      pre: (props) => (
        <CodeBlock
          {...props}
          {...codeblock}
          className={cn("my-0", props.className, codeblock?.className)}
          lang={lang}
        >
          <Pre>{props.children}</Pre>
        </CodeBlock>
      ),
      ...options.components,
    },
    lang,
  });
}
