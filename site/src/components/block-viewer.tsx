"use client";

import type { FileTree } from "@/lib/blocks";

import { useCallback, useId, useRef, useState } from "react";

import {
  ArrowRight01Icon,
  ComputerIcon,
  File01Icon,
  Folder01Icon,
  LinkSquare02Icon,
  RefreshIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { siteConfig } from "@/lib/config";
import { Button, buttonVariants } from "@/registry/ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";
import { Separator } from "@/registry/ui/separator";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";

import { CopyRegistryButton } from "./copy-registry-button";

type View = "preview" | "code";

// `null` lets the preview fill the available space.
const viewports = [
  { icon: ComputerIcon, label: "Desktop", value: "desktop", width: null },
  { icon: Tablet01Icon, label: "Tablet", value: "tablet", width: 768 },
  { icon: SmartPhone01Icon, label: "Mobile", value: "mobile", width: 390 },
] as const;

const MIN_PREVIEW_WIDTH = 320;
const RESIZE_STEP = 16;

export interface BlockViewerFile {
  /** Highlighted source, rendered on the server. */
  code: React.ReactNode;
  path: string;
}

export interface BlockViewerProps {
  files: BlockViewerFile[];
  /** Height of the preview and code panels, e.g. `800px`. */
  height: string;
  name: string;
  title: string;
  tree: FileTree[];
}

export function BlockViewer({
  name,
  title,
  height,
  tree,
  files,
}: BlockViewerProps) {
  const [view, setView] = useState<View>("preview");
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [activeFile, setActiveFile] = useState(files[0]?.path);

  const viewport = viewports.find((item) => item.width === previewWidth);
  const file = files.find((candidate) => candidate.path === activeFile);

  const handleViewChange = useCallback((value: View) => setView(value), []);

  const handleViewportChange = useCallback((value: string[]) => {
    const next = viewports.find((item) => item.value === value[0]);
    if (next) {
      setPreviewWidth(next.width);
      setView("preview");
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setPreviewKey((key) => key + 1);
    setView("preview");
  }, []);

  return (
    <Tabs
      className="gap-0 border-t bg-background-muted md:mx-px"
      onValueChange={handleViewChange}
      style={{ "--height": height } as React.CSSProperties}
      value={view}
    >
      <div className="flex h-12 items-center gap-2 border-b px-4">
        <TabsList className="min-w-0 gap-0.5 bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-md *:data-[slot=tab-indicator]:bg-accent">
          <TabsTab
            className="h-7 grow-0 rounded-md px-2 font-mono font-normal text-[0.8125rem] text-foreground-muted hover:text-foreground"
            value="preview"
          >
            Preview
          </TabsTab>
          <TabsTab
            className="h-7 grow-0 rounded-md px-2 font-mono font-normal text-[0.8125rem] text-foreground-muted hover:text-foreground"
            value="code"
          >
            Code
          </TabsTab>
        </TabsList>

        <div className="ms-auto flex items-center gap-2">
          <TooltipProvider>
            <ToggleGroup
              aria-label="Preview size"
              className="max-md:hidden"
              onValueChange={handleViewportChange}
              size="sm"
              value={viewport ? [viewport.value] : []}
              variant="outline"
            >
              {viewports.map((item) => (
                <Tooltip key={item.value}>
                  <TooltipTrigger
                    render={
                      <ToggleGroupItem
                        aria-label={item.label}
                        value={item.value}
                      >
                        <Icon icon={item.icon} />
                      </ToggleGroupItem>
                    }
                  />
                  <TooltipPopup>{item.label}</TooltipPopup>
                </Tooltip>
              ))}
            </ToggleGroup>
          </TooltipProvider>

          <Separator className="h-4 max-md:hidden" orientation="vertical" />

          <TooltipProvider>
            <Group aria-label="Preview actions">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label="Refresh preview"
                      onClick={handleRefresh}
                      size="icon-sm"
                      variant="outline"
                    >
                      <Icon icon={RefreshIcon} />
                    </Button>
                  }
                />
                <TooltipPopup>Refresh preview</TooltipPopup>
              </Tooltip>

              <GroupSeparator />

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      aria-label="Open in new tab"
                      className={buttonVariants({
                        size: "icon-sm",
                        variant: "outline",
                      })}
                      data-slot="button"
                      href={`/view/${name}`}
                      rel="noopener"
                      target="_blank"
                    >
                      <Icon icon={LinkSquare02Icon} />
                    </Link>
                  }
                />
                <TooltipPopup>Open in new tab</TooltipPopup>
              </Tooltip>

              <GroupSeparator />

              <CopyRegistryButton value={`${siteConfig.url}/r/${name}.json`} />
            </Group>
          </TooltipProvider>

          <Separator className="h-4" orientation="vertical" />
        </div>
      </div>

      <TabsPanel keepMounted value="preview">
        <BlockViewerPreview
          name={name}
          onWidthChange={setPreviewWidth}
          previewKey={previewKey}
          title={title}
          width={previewWidth}
        />
      </TabsPanel>

      <TabsPanel keepMounted value="code">
        <div className="flex h-(--height) flex-col bg-background-muted md:flex-row">
          <div className="flex max-h-48 shrink-0 flex-col border-b md:max-h-none md:w-64 md:border-e md:border-b-0">
            <div className="flex h-9.5 shrink-0 items-center border-b px-4 text-foreground-muted text-sm">
              Files
            </div>
            <ul className="flex-1 overflow-auto py-2">
              {tree.map((node) => (
                <FileTreeItem
                  activeFile={activeFile}
                  depth={0}
                  key={node.name}
                  node={node}
                  onSelect={setActiveFile}
                />
              ))}
            </ul>
          </div>

          <div className="min-h-0 min-w-0 flex-1">{file?.code}</div>
        </div>
      </TabsPanel>
    </Tabs>
  );
}

function BlockViewerPreview({
  name,
  title,
  width,
  previewKey,
  onWidthChange,
}: {
  name: string;
  title: string;
  width: number | null;
  previewKey: number;
  onWidthChange: (width: number | null) => void;
}) {
  const frameId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isResizing, setResizing] = useState(false);

  // Clamps a width to what fits, snapping back to "fill" at the maximum.
  const resize = useCallback(
    (next: number) => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;

      // The frame's 1px end border sits outside the preview width.
      const max = containerWidth - 1;
      const clamped = Math.round(
        Math.min(Math.max(next, MIN_PREVIEW_WIDTH), max)
      );
      onWidthChange(clamped >= max ? null : clamped);
    },
    [onWidthChange]
  );

  const getCurrentWidth = useCallback(
    () => width ?? (frameRef.current?.clientWidth ?? 0) - 1,
    [width]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setResizing(true);
    },
    []
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!(isResizing && container)) {
        return;
      }

      resize(event.clientX - container.getBoundingClientRect().left - 1);
    },
    [isResizing, resize]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setResizing(false);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? RESIZE_STEP * 4 : RESIZE_STEP;

      switch (event.key) {
        case "ArrowLeft":
          resize(getCurrentWidth() - step);
          break;
        case "ArrowRight":
          resize(getCurrentWidth() + step);
          break;
        case "Home":
          resize(MIN_PREVIEW_WIDTH);
          break;
        case "End":
          onWidthChange(null);
          break;
        default:
          return;
      }

      event.preventDefault();
    },
    [getCurrentWidth, onWidthChange, resize]
  );

  return (
    <div
      className="flex h-(--height) bg-[radial-gradient(color-mix(in_oklab,var(--color-foreground)_12%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] data-resizing:cursor-col-resize data-resizing:select-none"
      data-resizing={isResizing || undefined}
      ref={containerRef}
    >
      <div
        className={cn(
          "relative h-full min-w-0 shrink bg-background max-md:w-full!",
          width !== null && "md:border-e",
          !isResizing &&
            "transition-[width] duration-300 ease-out motion-reduce:transition-none"
        )}
        ref={frameRef}
        // The end border sits outside the preview width, so breakpoints like
        // `md` (768px) match exactly inside the iframe.
        style={{ width: width === null ? "100%" : `${width + 1}px` }}
      >
        {/* An iframe, so the block's breakpoints follow the preview width
            instead of the window. */}
        <iframe
          className={cn("block size-full", isResizing && "pointer-events-none")}
          id={frameId}
          key={previewKey}
          loading="lazy"
          src={`/view/${name}`}
          title={`${title} preview`}
        />

        {/* Sits just outside the frame's edge, so the preview keeps the full
            width and the handle travels with it while resizing. */}
        {/* biome-ignore lint/a11y/useSemanticElements: an <hr> cannot be focused or dragged */}
        <div
          aria-controls={frameId}
          aria-label="Resize preview"
          aria-orientation="vertical"
          aria-valuemin={MIN_PREVIEW_WIDTH}
          aria-valuenow={width ?? undefined}
          className="group absolute inset-y-0 start-full z-10 flex w-3 cursor-col-resize touch-none items-center justify-center outline-none max-md:hidden"
          data-resizing={isResizing || undefined}
          onKeyDown={handleKeyDown}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="separator"
          tabIndex={0}
        >
          <div className="h-8 w-1.5 rounded-full bg-foreground/20 transition-[height,background-color] duration-150 group-hover:h-10 group-hover:bg-foreground/40 group-focus-visible:h-10 group-focus-visible:bg-foreground group-data-resizing:h-10 group-data-resizing:bg-foreground/60 motion-reduce:transition-none" />
        </div>
      </div>
    </div>
  );
}

function FileTreeItem({
  node,
  depth,
  activeFile,
  onSelect,
}: {
  node: FileTree;
  depth: number;
  activeFile?: string;
  onSelect: (path: string) => void;
}) {
  const indent = { paddingInlineStart: `${depth * 0.875 + 0.75}rem` };
  const itemClassName =
    "flex h-8 w-full cursor-pointer items-center gap-1.5 whitespace-nowrap pe-3 text-start text-foreground-muted text-sm outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground [&_svg]:shrink-0";

  if (!node.children) {
    return (
      <li>
        <FileTreeButton
          className={itemClassName}
          isActive={node.path === activeFile}
          name={node.name}
          onSelect={onSelect}
          path={node.path}
          style={indent}
        />
      </li>
    );
  }

  return (
    <li>
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          className={cn(itemClassName, "group")}
          style={indent}
        >
          <Icon
            className="size-3.5 transition-transform duration-200 group-data-panel-open:rotate-90 motion-reduce:transition-none"
            icon={ArrowRight01Icon}
          />
          <Icon className="size-4" icon={Folder01Icon} />
          <span className="truncate">{node.name}</span>
        </CollapsibleTrigger>
        <CollapsiblePanel render={<ul />}>
          {node.children.map((child) => (
            <FileTreeItem
              activeFile={activeFile}
              depth={depth + 1}
              key={child.name}
              node={child}
              onSelect={onSelect}
            />
          ))}
        </CollapsiblePanel>
      </Collapsible>
    </li>
  );
}

function FileTreeButton({
  name,
  path,
  isActive,
  className,
  style,
  onSelect,
}: {
  name: string;
  path?: string;
  isActive: boolean;
  className: string;
  style: React.CSSProperties;
  onSelect: (path: string) => void;
}) {
  const handleClick = useCallback(() => {
    if (path) {
      onSelect(path);
    }
  }, [onSelect, path]);

  return (
    <button
      aria-current={isActive || undefined}
      className={cn(
        className,
        "aria-current:bg-accent aria-current:text-foreground"
      )}
      onClick={handleClick}
      style={style}
      type="button"
    >
      <span aria-hidden="true" className="size-3.5 shrink-0" />
      <Icon className="size-4" icon={File01Icon} />
      <span className="truncate">{name}</span>
    </button>
  );
}
