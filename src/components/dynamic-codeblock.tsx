import { cn } from "cn";
import { type HighlightOptions, highlight } from "fumadocs-core/highlight";

import { CodeBlock, type CodeBlockProps, Pre } from "./mdx/codeblock";

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
  ...options
}: DynamicCodeBlockProps) {
  return await highlight(code, {
    defaultColor: false,
    ...options,
    components: {
      pre: (props) => (
        <CodeBlock
          {...props}
          {...codeblock}
          className={cn("my-0", props.className, codeblock?.className)}
        >
          <Pre>{props.children}</Pre>
        </CodeBlock>
      ),
      ...options.components,
    },
  });
}
