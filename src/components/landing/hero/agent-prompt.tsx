"use client";

import { useCallback, useId } from "react";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";

import {
  ClaudeIcon,
  CodexIcon,
  CursorMarkIcon,
} from "@/components/brand-icons";
import { siteConfig } from "@/lib/config";
import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";

const prompt = `Build with Akari: ${siteConfig.url.replace(/^https?:\/\//, "")}/llms.txt`;

const lightBubble =
  "shadow-[inset_0_0.5px_0_0_rgb(255_255_255/0.7),0_0_0_0.5px_rgb(0_0_0/0.22),0_1px_2px_-1px_rgb(0_0_0/0.45)]";

const agents = [
  {
    className: cn(
      "bg-linear-to-b from-[#e0876a] to-[#d97757] [&_path]:fill-white",
      lightBubble
    ),
    icon: ClaudeIcon,
    name: "Claude",
  },
  {
    className: cn("bg-linear-to-b from-white to-[#ededed]", lightBubble),
    icon: CodexIcon,
    name: "Codex",
  },
  {
    className:
      "bg-linear-to-b from-[#262626] to-black shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.2),0_0_0_0.5px_rgb(0_0_0/0.9),0_1px_2px_-1px_rgb(0_0_0/0.6)]",
    icon: CursorMarkIcon,
    name: "Cursor",
  },
];

export function AgentPrompt({ className }: { className?: string }) {
  const { copied, copyToClipboard } = useCopyToClipboard();
  const labelId = useId();
  const promptId = useId();

  const handleCopy = useCallback(() => {
    copyToClipboard(prompt);
  }, [copyToClipboard]);

  return (
    <div
      className={cn(
        "grid w-full max-w-[30rem] grid-cols-[minmax(0,1fr)] grid-rows-[var(--label-h)_auto] [--bubble-step:calc(0.66*var(--bubble))] [--bubble:1.125rem] [--cap:0.5rem] [--label-h:1.75rem] [--sweep:1.5rem] [--tab-r:0.875rem] [--tab-w:11.25rem] [--tray-r:0.75rem]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="rounded-tl-(--tab-r) bg-foreground [grid-area:1/1/3/2]"
        style={{
          clipPath:
            "shape(from 0 0, line to calc(var(--tab-w) - var(--sweep)) 0, curve to var(--tab-w) var(--label-h) with calc(var(--tab-w) - 0.333 * var(--sweep)) 0 / calc(var(--tab-w) - 0.667 * var(--sweep)) var(--label-h), line to calc(100% - var(--tray-r)) var(--label-h), arc to 100% calc(var(--label-h) + var(--tray-r)) of var(--tray-r) cw, line to 0 calc(var(--label-h) + var(--tray-r)), close)",
        }}
      />

      <div className="relative flex items-center gap-2 ps-(--cap) font-medium text-background/85 text-xs [grid-area:1/1]">
        <span
          aria-hidden="true"
          className="grid flex-none"
          style={{ width: "calc(2 * var(--bubble-step) + var(--bubble))" }}
        >
          {agents.map(({ className: bubble, icon: AgentIcon, name }, index) => (
            <span
              className={cn(
                "grid size-(--bubble) place-items-center rounded-full [grid-area:1/1]",
                bubble
              )}
              key={name}
              style={{
                translate: `calc(${index} * var(--bubble-step))`,
                zIndex: agents.length - index,
              }}
            >
              <AgentIcon className="size-[calc(0.6*var(--bubble))]" />
            </span>
          ))}
        </span>
        <span className="select-none" id={labelId}>
          Build with agents
        </span>
      </div>

      <Button
        aria-describedby={`${labelId} ${promptId}`}
        aria-label={copied ? "Copied" : "Copy agent prompt"}
        className="-m-[0.5px] h-auto justify-start rounded-[calc(var(--tray-r)+0.5px)] py-1.5 ps-3 pe-2.5 font-normal shadow-[0_1px_2px_rgb(0_0_0/0.04)] [grid-area:2/1]"
        onClick={handleCopy}
        variant="secondary"
      >
        <span
          aria-hidden="true"
          className="font-mono text-[0.8125rem] text-foreground-muted leading-6"
        >
          ❯
        </span>
        <span
          className="h-6 min-w-0 flex-1 overflow-x-auto pe-1.5 text-start font-mono text-[0.8125rem] leading-6 [mask-image:linear-gradient(to_right,#000_calc(100%-1rem),transparent)] [scrollbar-width:none]"
          id={promptId}
        >
          {prompt}
        </span>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            className="grid size-6 shrink-0 place-items-center text-foreground-muted transition-colors group-hover:text-foreground"
            exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
            initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
            key={copied ? "copied" : "copy"}
            transition={{
              bounce: 0,
              duration: 0.3,
              type: "spring",
            }}
          >
            <Icon icon={copied ? Tick02Icon : Copy01Icon} />
          </motion.span>
        </AnimatePresence>
      </Button>
      <span aria-live="polite" className="sr-only" role="status">
        {copied ? "Agent prompt copied" : ""}
      </span>
    </div>
  );
}
