"use client";

import { useCallback, useRef } from "react";

import {
  ComputerTerminal01Icon,
  Copy01Icon,
  CssFile01Icon,
  Folder01Icon,
  ThirdBracketIcon,
  Tick01Icon,
  Typescript02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";

import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import { ScrollArea } from "@/registry/ui/scroll-area";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";

export function Pre(props: React.ComponentProps<"pre">) {
  return (
    <pre
      {...props}
      className={cn(
        "w-max min-w-full py-3.5 text-[0.8125rem] *:flex *:flex-col",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-inset",
        props.className
      )}
    >
      {props.children}
    </pre>
  );
}

export interface CodeBlockProps
  extends Omit<React.ComponentProps<"figure">, "title"> {
  /**
   * Allow to copy code with copy button
   *
   * @defaultValue true
   */
  allowCopy?: boolean | "true" | "false";

  /**
   * show line numbers
   */
  "data-line-numbers"?: boolean;

  /**
   * @defaultValue 1
   */
  "data-line-numbers-start"?: number;

  /**
   * Icon of code block
   *
   * When passed as a string, it assumes the value is the HTML of icon
   */
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

export function CodeBlock({
  title,
  allowCopy = true,
  icon,
  children,
  className,
  ...props
}: CodeBlockProps) {
  const areaRef = useRef<HTMLDivElement>(null);

  if (allowCopy === "true") {
    allowCopy = true;
  } else if (allowCopy === "false") {
    allowCopy = false;
  }

  const renderIcon = icon ?? getIconForLanguageExtension(props.lang ?? "");

  return (
    <figure
      className={cn(
        "shiki relative my-4 border-y bg-background-muted text-sm",
        className
      )}
      dir="ltr"
      tabIndex={-1}
      {...props}
      data-slot="codeblock"
    >
      {title ? (
        <div className="flex h-9.5 items-center gap-2 border-b px-4 text-foreground-muted">
          {typeof renderIcon === "string" ? (
            <div
              className="[&_svg]:size-3.5"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: icon is html svg
              dangerouslySetInnerHTML={{
                __html: renderIcon,
              }}
            />
          ) : (
            renderIcon
          )}

          <figcaption className="flex-1 truncate font-mono">{title}</figcaption>
          <div className="-me-2 empty:hidden">
            {allowCopy ? <CopyButton containerRef={areaRef} /> : null}
          </div>
        </div>
      ) : (
        <div className="absolute top-1.5 right-1.5 z-10 empty:hidden">
          {allowCopy ? <CopyButton containerRef={areaRef} /> : null}
        </div>
      )}

      <ScrollArea
        className="**:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2 **:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2 **:data-[slot=scroll-area-viewport]:max-h-[600px]"
        ref={areaRef}
        scrollFade
        style={{
          counterSet: props["data-line-numbers"]
            ? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}`
            : undefined,
        }}
      >
        {children}
      </ScrollArea>
    </figure>
  );
}

function CopyButton({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}): React.ReactElement {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    const pre = containerRef.current?.getElementsByTagName("pre").item(0);
    if (!pre) {
      return;
    }

    const clone = pre.cloneNode(true) as HTMLElement;
    for (const node of clone.querySelectorAll(".nd-copy-ignore")) {
      node.replaceWith("\n");
    }

    copyToClipboard(clone.textContent ?? "");
  }, [containerRef, copyToClipboard]);

  return (
    <Button
      aria-label={copied ? "Copied" : "Copy"}
      className="hitbox-2 text-foreground-muted hover:text-foreground"
      data-slot="copy-button"
      onClick={handleCopy}
      size="icon-xs"
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
          key={copied ? "copied" : "copy"}
          transition={{
            bounce: 0,
            duration: 0.3,
            type: "spring",
          }}
        >
          <Icon icon={copied ? Tick01Icon : Copy01Icon} />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

export function CodeBlockTabs({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs
      className={cn("my-4 gap-0 border-y bg-background-muted", className)}
      {...props}
    >
      {props.children}
    </Tabs>
  );
}

export function CodeBlockTabsList({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <div className="flex h-10 items-center gap-2 border-b px-4 text-foreground-muted [&_svg]:size-3.5">
      <Icon icon={ComputerTerminal01Icon} />

      <TabsList
        className={cn(
          "min-w-0 gap-0.5 overflow-x-auto bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-md *:data-[slot=tab-indicator]:bg-accent",
          className
        )}
        {...props}
      >
        {children}
      </TabsList>
    </div>
  );
}

export function CodeBlockTabsTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof TabsTab>) {
  return (
    <TabsTab
      className={cn(
        "h-7 grow-0 rounded-md px-2 font-mono font-normal text-[0.8125rem] hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </TabsTab>
  );
}

export function CodeBlockTab({
  className,
  ...props
}: React.ComponentProps<typeof TabsPanel>) {
  return (
    <TabsPanel
      className={cn(
        "**:data-[slot=codeblock]:my-0 **:data-[slot=codeblock]:border-y-0",
        className
      )}
      {...props}
    />
  );
}

function getIconForLanguageExtension(language: string) {
  switch (language) {
    case "json":
      return <Icon icon={ThirdBracketIcon} />;
    case "css":
      return <Icon icon={CssFile01Icon} />;
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "typescript":
      return <Icon icon={Typescript02Icon} />;
    default:
      return <Icon icon={Folder01Icon} />;
  }
}
