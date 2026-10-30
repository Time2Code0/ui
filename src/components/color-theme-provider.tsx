"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useTheme } from "next-themes";

import {
  COLOR_PALETTE_VAR_NAMES,
  type ColorPalette,
  type ColorPaletteColors,
  type ColorPaletteMode,
  type ColorPaletteVarName,
  type ColorThemePreview,
  CUSTOM_COLOR_PALETTE_ID,
  colorPalettesById,
  DEFAULT_COLOR_PALETTE_ID,
  getColorPalette,
} from "@/lib/color-theme";

const themeIdAtom = atomWithStorage("color-palette", DEFAULT_COLOR_PALETTE_ID);

interface ColorThemeContextValue {
  customTheme: ColorPalette | null;
  editMode: ColorPaletteMode;
  previewColor: (name: ColorPaletteVarName, value: string) => void;
  resetCustomTheme: () => void;
  setColor: (name: ColorPaletteVarName, value: string) => void;
  setThemeId: (id: string) => void;
  style: React.CSSProperties;
  theme: ColorPalette;
  themeId: string;
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

export function useColorTheme() {
  const context = use(ColorThemeContext);

  if (!context) {
    throw new Error("useColorTheme must be used within <ColorThemeProvider />");
  }

  return context;
}

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  const previewRef = useRef<ColorThemePreview>(null);
  const [customTheme, setCustomTheme] = useState<ColorPalette | null>(null);
  const [storedThemeId, setThemeId] = useAtom(themeIdAtom);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const themeId =
    (storedThemeId === CUSTOM_COLOR_PALETTE_ID && customTheme) ||
    Object.hasOwn(colorPalettesById, storedThemeId)
      ? storedThemeId
      : DEFAULT_COLOR_PALETTE_ID;

  const editMode: ColorPaletteMode =
    resolvedTheme === "dark" ? "dark" : "light";
  const theme = customTheme ?? getColorPalette(themeId);

  const applyTheme = useCallback(
    (nextTheme: ColorPalette) => {
      const vars = resolveVars(
        nextTheme,
        resolvedTheme === "dark" ? "dark" : "light",
        previewRef.current
      );
      const nextStyle = Object.fromEntries(
        COLOR_PALETTE_VAR_NAMES.map((name) => [`--color-${name}`, vars[name]])
      );

      setStyle(nextStyle);
    },
    [resolvedTheme]
  );

  const previewColor = useCallback(
    (name: ColorPaletteVarName, value: string) => {
      const { current } = previewRef;
      previewRef.current = {
        mode: editMode,
        vars: {
          ...(current?.mode === editMode ? current.vars : {}),
          [name]: value,
        },
      };
      applyTheme(theme);
    },
    [editMode, theme, applyTheme]
  );

  const setColor = useCallback(
    (name: ColorPaletteVarName, value: string) => {
      const nextTheme = {
        dark: { ...theme.dark },
        id: CUSTOM_COLOR_PALETTE_ID,
        light: { ...theme.light },
        name: "Custom",
      };
      nextTheme[editMode] = { ...nextTheme[editMode], [name]: value };
      setThemeId(CUSTOM_COLOR_PALETTE_ID);
      setCustomTheme(nextTheme);
      applyTheme(nextTheme);
    },
    [editMode, theme, applyTheme, setThemeId]
  );

  const resetCustomTheme = useCallback(() => {
    setCustomTheme(null);
    if (themeId === CUSTOM_COLOR_PALETTE_ID) {
      setThemeId(DEFAULT_COLOR_PALETTE_ID);
      applyTheme(getColorPalette(DEFAULT_COLOR_PALETTE_ID));
    }
  }, [themeId, setThemeId, applyTheme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `resolvedTheme` re-applies the palette when the site light/dark mode changes.
  useEffect(() => {
    applyTheme(theme);
  }, [applyTheme, theme, resolvedTheme]);

  const values = useMemo(
    () => ({
      customTheme,
      editMode,
      previewColor,
      resetCustomTheme,
      setColor,
      setThemeId,
      style,
      theme,
      themeId,
    }),
    [
      editMode,
      previewColor,
      resetCustomTheme,
      setColor,
      theme,
      customTheme,
      themeId,
      style,
      setThemeId,
    ]
  );

  return <ColorThemeContext value={values}>{children}</ColorThemeContext>;
}

function resolveVars(
  theme: ColorPalette,
  mode: ColorPaletteMode,
  preview: ColorThemePreview
): ColorPaletteColors {
  const base = mode === "dark" ? theme.dark : theme.light;

  if (!preview || preview.mode !== mode) {
    return base;
  }

  return { ...base, ...preview.vars };
}
