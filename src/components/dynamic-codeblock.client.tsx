"use client";

import { type ComponentProps, createContext, type FC, use, useId } from "react";

import { cn } from "cn";
import { defaultShikiFactory } from "fumadocs-core/highlight/shiki/full";
import {
  type UseShikiOptions,
  useShikiDynamic,
} from "fumadocs-core/highlight/shiki/react";

import { CodeBlock, type CodeBlockProps, Pre } from "./codeblock";

export interface DynamicCodeblockProps {
  code: string;
  /**
   * Extra props for the underlying `<CodeBlock />` component.
   *
   * Ignored if you defined your own `pre` component in `options.components`.
   */
  codeblock?: CodeBlockProps;
  lang: string;
  options?: DistributiveOmit<UseShikiOptions, "lang">;
  /**
   * Wrap in React `<Suspense />` and provide a fallback.
   *
   * @defaultValue true
   */
  wrapInSuspense?: boolean;
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

const PropsContext = createContext<CodeBlockProps | undefined>(undefined);

function DefaultPre(props: ComponentProps<"pre">) {
  const extraProps = use(PropsContext);

  return (
    <CodeBlock
      {...props}
      {...extraProps}
      className={cn("my-0", props.className, extraProps?.className)}
      style={{}} // Workarround to stop shiki overriding the figure`s background color
    >
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
}

export function DynamicCodeBlock({
  lang,
  code,
  codeblock,
  options = { themes: { dark: "github-dark", light: "github-light" } },
  wrapInSuspense = true,
}: DynamicCodeblockProps) {
  const id = useId();
  const shikiOptions: UseShikiOptions = {
    defaultColor: false,
    lang,
    ...options,
    components: {
      pre: DefaultPre,
      ...options?.components,
    },
  };
  let node = useShikiDynamic(
    () => defaultShikiFactory.getOrInit(),
    code,
    shikiOptions,
    [id, lang, code]
  );
  if (wrapInSuspense) {
    node ??= <Placeholder code={code} components={shikiOptions.components} />;
  }

  return <PropsContext value={codeblock}>{node}</PropsContext>;
}

function Placeholder({
  code,
  components = {},
}: {
  code: string;
  components: UseShikiOptions["components"];
}) {
  const { pre: PlaceholderPre = "pre", code: Code = "code" } =
    components as Record<string, FC>;

  return (
    <PlaceholderPre>
      <Code>
        {code.split("\n").map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static lines, and code often repeats a line (e.g. `/>`)
          <span className="line" key={index}>
            {line}
          </span>
        ))}
      </Code>
    </PlaceholderPre>
  );
}
