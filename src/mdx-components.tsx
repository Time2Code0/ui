import { cn } from "cn";

import { CodeTabs } from "@/components/mdx/code-tabs";
import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from "@/components/mdx/codeblock";
import { ComponentPreview } from "@/components/mdx/component-preview";
import { ComponentSource } from "@/components/mdx/component-source";
import { Heading } from "@/components/mdx/heading";
import { MediaQueryDemo } from "@/components/mdx/media-query-demo";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

export const mdxComponents = {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Alert: ({ className, ...props }: React.ComponentProps<typeof Alert>) => (
    <Alert className={cn("my-6", className)} {...props} />
  ),
  AlertAction,
  AlertDescription,
  AlertTitle,
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn(
        "font-medium text-foreground underline decoration-foreground underline-offset-4 transition-colors hover:text-primary hover:decoration-primary",
        className
      )}
      {...props}
    />
  ),
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeTabs,
  ComponentPreview,
  ComponentSource,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h1" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h3" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h4" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h5" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h6" {...props} />
  ),
  MediaQueryDemo,
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={cn("list-decimal text-foreground-muted", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn("text-foreground-muted leading-relaxed", className)}
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  Tabs: (props: React.ComponentProps<typeof Tabs>) => <Tabs {...props} />,
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        "bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none",
        className
      )}
      {...props}
    />
  ),
  TabsPanel: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsPanel>) => (
    <TabsPanel
      className={cn(
        "relative [&>.steps]:mt-6 [&_h3]:font-medium [&_h3]:text-base *:[figure]:first:mt-0",
        className
      )}
      {...props}
    />
  ),
  TabsTab: ({ className, ...props }: React.ComponentProps<typeof TabsTab>) => (
    <TabsTab className={cn("rounded-lg", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={cn("list-disc text-foreground-muted", className)}
      {...props}
    />
  ),
};
