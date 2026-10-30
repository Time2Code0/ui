"use client";

import { useCallback, useState } from "react";

import {
  ChevronLeftIcon,
  DashboardSquareEditIcon,
  Refresh01Icon,
  SourceCodeSquareIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import {
  COLOR_PALETTE_VAR_LABELS,
  COLOR_PALETTE_VAR_NAMES,
  COLOR_PALETTES,
  type ColorPalette,
  type ColorPaletteColors,
  type ColorPaletteMode,
  type ColorPaletteVarName,
  CUSTOM_COLOR_PALETTE_ID,
} from "@/lib/color-theme";
import { AnimatedSizeContainer } from "@/registry/marketing/animated-size-container";
import { Button } from "@/registry/ui/button";
import { Icon } from "@/registry/ui/icon";
import { Popover, PopoverPopup, PopoverTrigger } from "@/registry/ui/popover";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/ui/tooltip";

import { ThemeColorPicker } from "./color-theme-color-picker";
import { useColorTheme } from "./color-theme-provider";

type ViewMode = "list" | "customize";

const viewVariants: Variants = {
  center: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
    x: 0,
  },
  enter: ({ direction, reduce }: { direction: number; reduce: boolean }) => ({
    filter: reduce ? "blur(0px)" : "blur(2px)",
    opacity: 0,
    x: reduce ? 0 : direction * 24,
  }),
  exit: ({ direction, reduce }: { direction: number; reduce: boolean }) => ({
    filter: reduce ? "blur(0px)" : "blur(2px)",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
    x: reduce ? 0 : direction * 24,
  }),
};

const STRIP_VARS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

function stripColors(palette: ColorPalette, mode: "light" | "dark") {
  const colors = palette[mode];
  return STRIP_VARS.map((name) => colors[name as keyof typeof colors]);
}

export function ColorThemeScope(props: React.ComponentProps<"div">) {
  const { style } = useColorTheme();

  return <div {...props} style={{ ...props.style, ...style }} />;
}

export function ColorThemeSelector() {
  const {
    customTheme,
    editMode,
    previewColor,
    resetCustomTheme,
    setColor,
    theme,
    themeId,
    setThemeId,
  } = useColorTheme();

  const [view, setView] = useState<ViewMode>("list");
  const [direction, setDirection] = useState(1);

  const reduce = useReducedMotion();
  const custom = { direction, reduce };

  const options = customTheme
    ? [...COLOR_PALETTES, customTheme]
    : COLOR_PALETTES;

  const showList = useCallback(() => {
    setDirection(-1);
    setView("list");
  }, []);

  const showCustomize = useCallback(() => {
    setDirection(1);
    setView("customize");
  }, []);

  const colors = stripColors(theme, editMode);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost">
            <span aria-hidden className="inline-flex shrink-0 items-center">
              {colors.slice(0, 3).map((color, index) => (
                <span
                  className={cn(
                    "relative size-2.5 rounded-full",
                    index > 0 &&
                      "mask-[radial-gradient(circle_at_1px_50%,transparent_6.75px,#000_7.25px)] -ml-1.5"
                  )}
                  key={color}
                  style={{
                    backgroundColor: color,
                    zIndex: colors.length - index,
                  }}
                />
              ))}
            </span>
          </Button>
        }
      />
      <PopoverPopup className="w-64">
        <AnimatedSizeContainer>
          <AnimatePresence custom={custom} initial={false} mode="popLayout">
            <motion.div
              animate="center"
              custom={custom}
              exit="exit"
              initial="enter"
              key={view}
              variants={viewVariants}
            >
              {view === "list" ? (
                <div className="flex flex-col gap-2">
                  <fieldset className="flex flex-col gap-0.5">
                    <legend className="px-2 pt-1 pb-1 font-medium text-[11px] text-foreground-muted uppercase tracking-wide">
                      Chart palette
                    </legend>

                    {options.map((palette) => (
                      <PaletteOption
                        key={palette.id}
                        mode={editMode}
                        onSelect={setThemeId}
                        palette={palette}
                        selected={palette.id === themeId}
                      />
                    ))}
                  </fieldset>

                  <div className="grid grid-cols-2 gap-1 border-t pt-2">
                    <Button onClick={showCustomize} size="xs" variant="ghost">
                      <Icon icon={DashboardSquareEditIcon} />
                      <span>Edit</span>
                    </Button>

                    <Button size="xs" variant="ghost">
                      <Icon icon={SourceCodeSquareIcon} />
                      <span>Export</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-1">
                  <div className="flex items-center gap-1">
                    <Button onClick={showList} size="icon-xs" variant="ghost">
                      <Icon icon={ChevronLeftIcon} />
                    </Button>

                    <p className="flex-1 font-medium text-foreground text-xs">
                      {theme.id === CUSTOM_COLOR_PALETTE_ID
                        ? "Custom palette"
                        : `Customize ${theme.name}`}
                    </p>

                    {customTheme ? (
                      <Button size="icon-xs" variant="ghost">
                        <Icon icon={Refresh01Icon} onClick={resetCustomTheme} />
                      </Button>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-foreground-muted leading-snug">
                    Editing {editMode} mode colors. Switch the site theme to
                    edit the {editMode === "dark" ? "light" : "dark"} mode
                    values.
                  </p>

                  <ColorPaletteEditor
                    colors={theme[editMode]}
                    onChange={setColor}
                    onPreview={previewColor}
                  />

                  <Button size="xs" variant="secondary">
                    <Icon icon={SourceCodeSquareIcon} />
                    Export CSS
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedSizeContainer>
      </PopoverPopup>
    </Popover>
  );
}

function PaletteOption({
  palette,
  mode,
  selected,
  onSelect,
}: {
  palette: ColorPalette;
  mode: ColorPaletteMode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const handleClick = useCallback(
    () => onSelect(palette.id),
    [onSelect, palette.id]
  );

  return (
    <Button
      aria-pressed={selected}
      className={cn(
        "text-left text-xs",
        selected ? "text-foreground" : "text-foreground-muted"
      )}
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      <ColorPaletteStrip
        colors={stripColors(palette, mode)}
        dotClassName="shadow-none not-last:[mask-image:radial-gradient(circle_at_11px_50%,transparent_6.25px,#000_6.75px)]"
      />
      <span className="flex-1 truncate">{palette.name}</span>
      {selected ? <Icon icon={Tick01Icon} /> : null}
    </Button>
  );
}

function ColorPaletteStrip({
  colors,
  className,
  dotClassName,
}: {
  colors: readonly string[];
  className?: string;
  dotClassName?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      {colors.map((color) => (
        <span
          className={cn(
            "not-first:-ml-1 size-2.5 rounded-full shadow-[0_0_0_1.5px_var(--color-background)]",
            dotClassName
          )}
          key={color}
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

function ColorPaletteEditor({
  colors,
  onPreview,
  onChange,
  className,
}: {
  colors: ColorPaletteColors;
  onPreview: (name: ColorPaletteVarName, value: string) => void;
  onChange: (name: ColorPaletteVarName, value: string) => void;
  className?: string;
}) {
  const [selected, setSelected] = useState<ColorPaletteVarName>("chart-1");

  const handleChange = useCallback(
    (value: string) => {
      if (value) {
        onChange(selected, value);
      }
    },
    [onChange, selected]
  );

  const handlePreview = useCallback(
    (value: string) => onPreview(selected, value),
    [onPreview, selected]
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <fieldset className="grid grid-cols-6 gap-1.5">
        <legend className="sr-only">Palette color to edit</legend>

        <TooltipProvider>
          {COLOR_PALETTE_VAR_NAMES.map((name) => (
            <ColorPaletteSwatch
              color={colors[name]}
              key={name}
              name={name}
              onSelect={setSelected}
              selected={name === selected}
            />
          ))}
        </TooltipProvider>
      </fieldset>

      <p className="flex items-center justify-between font-mono text-[11px] text-foreground-muted">
        <span>--{selected}</span>
        <span>{COLOR_PALETTE_VAR_LABELS[selected]}</span>
      </p>

      <ThemeColorPicker
        color={colors[selected]}
        onChange={handleChange}
        onPreview={handlePreview}
      />
    </div>
  );
}

function ColorPaletteSwatch({
  name,
  color,
  selected,
  onSelect,
}: {
  name: ColorPaletteVarName;
  color: string;
  selected: boolean;
  onSelect: (name: ColorPaletteVarName) => void;
}) {
  const handleClick = useCallback(() => onSelect(name), [onSelect, name]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            className={cn(
              "aspect-square w-full rounded-md border outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-foreground",
              selected &&
                "ring-2 ring-foreground ring-offset-2 ring-offset-background"
            )}
            onClick={handleClick}
            style={{ backgroundColor: color }}
            type="button"
          />
        }
      />
      <TooltipPopup>{COLOR_PALETTE_VAR_LABELS[name]}</TooltipPopup>
    </Tooltip>
  );
}
