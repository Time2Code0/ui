"use client";

import type { FileTree } from "@/lib/blocks";

import { useCallback, useId, useRef, useState } from "react";

import {
  ArrowRight01Icon,
  ComputerIcon,
  Copy01Icon,
  File01Icon,
  Folder01Icon,
  LinkSquare02Icon,
  RefreshIcon,
  SmartPhone01Icon,
  Tablet01Icon,
  Tick01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { AnimatePresence, motion } from "motion/react";

import { BunIcon, NpmIcon, PnpmIcon, YarnIcon } from "@/components/brand-icons";
import {
  type PackageManager,
  PM_EXECUTE_COMMANDS,
  packageManagers,
  useConfig,
} from "@/hooks/use-config";
import { siteConfig } from "@/lib/config";
import { useCopyToClipboard } from "@/registry/hooks/use-copy-to-clipboard";
import { Button, buttonVariants } from "@/registry/ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible";
import { Group, GroupSeparator } from "@/registry/ui/group";
import { Icon } from "@/registry/ui/icon";
import { Link } from "@/registry/ui/link";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/registry/ui/menu";
import { Separator } from "@/registry/ui/separator";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/registry/ui/toggle-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/registry/ui/tooltip";

type View = "preview" | "code";

// `null` lets the preview fill the available space.
const viewports = [
  { icon: ComputerIcon, label: "Desktop", value: "desktop", width: null },
  { icon: Tablet01Icon, label: "Tablet", value: "tablet", width: 768 },
  { icon: SmartPhone01Icon, label: "Mobile", value: "mobile", width: 390 },
] as const;

const MIN_PREVIEW_WIDTH = 320;
const RESIZE_STEP = 16;

const packageManagerIcons: Record<
  PackageManager,
  (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
> = {
  bun: BunIcon,
  npm: NpmIcon,
  pnpm: PnpmIcon,
  yarn: YarnIcon,
};

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
          <ToggleGroup
            aria-label="Preview size"
            className="max-md:hidden"
            onValueChange={handleViewportChange}
            size="sm"
            value={viewport ? [viewport.value] : []}
            variant="outline"
          >
            {viewports.map((item) => (
              <ToolbarTooltip key={item.value} label={item.label}>
                <ToggleGroupItem aria-label={item.label} value={item.value}>
                  <Icon icon={item.icon} />
                </ToggleGroupItem>
              </ToolbarTooltip>
            ))}
          </ToggleGroup>

          <Separator className="h-4 max-md:hidden" orientation="vertical" />

          <Group aria-label="Preview actions">
            <ToolbarTooltip label="Refresh preview">
              <Button
                aria-label="Refresh preview"
                onClick={handleRefresh}
                size="icon-sm"
                variant="outline"
              >
                <Icon icon={RefreshIcon} />
              </Button>
            </ToolbarTooltip>

            <GroupSeparator />

            <ToolbarTooltip label="Open in new tab">
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
            </ToolbarTooltip>
          </Group>

          <Separator className="h-4" orientation="vertical" />

          <BlockInstallButton name={name} />
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

function ToolbarTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipPopup>{label}</TooltipPopup>
    </Tooltip>
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

function BlockInstallButton({ name }: { name: string }) {
  const [config, setConfig] = useConfig();
  const { copied, copyToClipboard } = useCopyToClipboard();

  const packageManager = config.packageManager || "pnpm";

  const PackageManagerIcon = packageManagerIcons[packageManager];

  const handleCopy = useCallback(
    () =>
      copyToClipboard(
        `${PM_EXECUTE_COMMANDS[packageManager]} shadcn@latest add ${siteConfig.url}/r/${name}`
      ),
    [copyToClipboard, name, packageManager]
  );

  const handlePackageManagerChange = useCallback(
    (value: PackageManager) => setConfig({ ...config, packageManager: value }),
    [config, setConfig]
  );

  return (
    <Group aria-label="Install block">
      <Menu>
        <MenuTrigger
          render={
            <Button
              aria-label={`Package manager: ${packageManager}`}
              className="gap-1 px-2"
              size="sm"
              variant="outline"
            >
              <PackageManagerIcon className="size-4" />
              <Icon className="size-3.5" icon={UnfoldMoreIcon} />
            </Button>
          }
        />
        <MenuPopup align="start">
          <MenuGroup>
            <MenuGroupLabel>Package manager</MenuGroupLabel>
            <MenuRadioGroup
              onValueChange={handlePackageManagerChange}
              value={packageManager}
            >
              {packageManagers.map((pm) => {
                const ItemIcon = packageManagerIcons[pm];

                return (
                  <MenuRadioItem key={pm} value={pm}>
                    <span className="flex items-center gap-2">
                      <ItemIcon className="size-4" />
                      {pm}
                    </span>
                  </MenuRadioItem>
                );
              })}
            </MenuRadioGroup>
          </MenuGroup>
        </MenuPopup>
      </Menu>

      <GroupSeparator />

      <ToolbarTooltip label={copied ? "Copied" : "Copy install command"}>
        <Button
          aria-label={copied ? "Copied" : "Copy install command"}
          onClick={handleCopy}
          size="sm"
          variant="outline"
        >
          <span className="font-mono font-normal text-xs max-sm:hidden">
            shadcn add {name}
          </span>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              exit={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              initial={{ filter: "blur(4px)", opacity: 0, scale: 0.25 }}
              key={copied ? "copied" : "copy"}
              transition={{ bounce: 0, duration: 0.3, type: "spring" }}
            >
              <Icon
                className="text-foreground-muted"
                icon={copied ? Tick01Icon : Copy01Icon}
              />
            </motion.span>
          </AnimatePresence>
        </Button>
      </ToolbarTooltip>
    </Group>
  );
}
