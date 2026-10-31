export const COLOR_PALETTE_VAR_NAMES = [
  "background",
  "background-muted",
  "foreground",
  "foreground-muted",
  "accent",
  "primary",
  "secondary",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export const COLOR_PALETTE_VAR_LABELS: Record<ColorPaletteVarName, string> = {
  accent: "Accent",
  background: "Background",
  "background-muted": "Background muted",
  "chart-1": "Chart 1",
  "chart-2": "Chart 2",
  "chart-3": "Chart 3",
  "chart-4": "Chart 4",
  "chart-5": "Chart 5",
  foreground: "Foreground",
  "foreground-muted": "Foreground muted",
  primary: "Primary",
  secondary: "Secondary",
};

export type ColorPaletteVarName = (typeof COLOR_PALETTE_VAR_NAMES)[number];

export type ColorPaletteColors = Record<ColorPaletteVarName, string>;

export type ColorPaletteMode = "light" | "dark";

export interface ColorPalette {
  dark: ColorPaletteColors;
  id: string;
  light: ColorPaletteColors;
  name: string;
}

export type ColorThemePreview = {
  mode: ColorPaletteMode;
  vars: Partial<Record<ColorPaletteVarName, string>>;
} | null;

const primaryColorPalette: ColorPalette = {
  dark: {
    accent: "oklch(0.248 0 0)",
    background: "oklch(0.191 0 0)",
    "background-muted": "oklch(0.218 0 0)",
    "chart-1": "oklch(0.585 0.233 277.117)", // indigo-500
    "chart-2": "oklch(0.852 0.199 91.936)", // yellow-400
    "chart-3": "oklch(0.667 0.295 322.15)", // fuchsia-500
    "chart-4": "oklch(0.56 0.021 213.5)", // mist-500 (Tailwind v4.2)
    "chart-5": "oklch(1 0 0)", // white
    foreground: "oklch(0.96 0.004 295)",
    "foreground-muted": "oklch(0.64 0.004 295)",
    primary: "oklch(0.739 0.104 258)",
    secondary: "oklch(0.7 0.17 297)",
  },
  id: "primary",
  light: {
    accent: "oklch(0.94 0.003 295)",
    background: "oklch(0.99 0.003 295)",
    "background-muted": "oklch(0.98 0.003 295)",
    "chart-1": "oklch(0.585 0.233 277.117)", // indigo-500
    "chart-2": "oklch(0.852 0.199 91.936)", // yellow-400
    "chart-3": "oklch(0.667 0.295 322.15)", // fuchsia-500
    "chart-4": "oklch(0.56 0.021 213.5)", // mist-500 (Tailwind v4.2)
    "chart-5": "oklch(0 0 0)", // black
    foreground: "oklch(0.22 0.014 295)",
    "foreground-muted": "oklch(0.54 0.014 295)",
    primary: "oklch(0.739 0.104 258)",
    secondary: "oklch(0.7 0.17 297)",
  },
  name: "Primary",
};

const monochromeColorPalette: ColorPalette = {
  dark: {
    accent: "oklch(0.269 0 0)", // neutral-800
    background: "oklch(0.145 0 0)", // neutral-950
    "background-muted": "oklch(0.205 0 0)", // neutral-900
    "chart-1": "oklch(0.967 0.001 286.375)", // zinc-100
    "chart-2": "oklch(0.871 0.006 286.286)", // zinc-300
    "chart-3": "oklch(0.705 0.015 286.067)", // zinc-400
    "chart-4": "oklch(0.552 0.016 285.938)", // zinc-500
    "chart-5": "oklch(0.442 0.017 285.786)", // zinc-600
    foreground: "oklch(0.97 0 0)", // neutral-100
    "foreground-muted": "oklch(0.708 0 0)", // neutral-400
    primary: "oklch(0.87 0 0)", // neutral-300
    secondary: "oklch(0.556 0 0)", // neutral-500
  },
  id: "monochrome",
  light: {
    accent: "oklch(0.922 0 0)", // neutral-200
    background: "oklch(0.985 0 0)", // neutral-50
    "background-muted": "oklch(0.97 0 0)", // neutral-100
    "chart-1": "oklch(0.268 0.007 34.298)", // stone-800
    "chart-2": "oklch(0.444 0.011 73.639)", // stone-600
    "chart-3": "oklch(0.709 0.01 56.259)", // stone-400
    "chart-4": "oklch(0.869 0.005 56.366)", // stone-300
    "chart-5": "oklch(0.923 0.003 48.717)", // stone-200
    foreground: "oklch(0.205 0 0)", // neutral-900
    "foreground-muted": "oklch(0.556 0 0)", // neutral-500
    primary: "oklch(0.371 0 0)", // neutral-700
    secondary: "oklch(0.708 0 0)", // neutral-400
  },
  name: "Monochrome",
};

const oceanColorPalette: ColorPalette = {
  dark: {
    accent: "oklch(0.274 0.006 286.033)", // zinc-800
    background: "oklch(0.141 0.005 285.823)", // zinc-950
    "background-muted": "oklch(0.21 0.006 285.885)", // zinc-900
    "chart-1": "oklch(0.623 0.214 259.815)", // blue-500
    "chart-2": "oklch(0.789 0.154 211.53)", // cyan-400
    "chart-3": "oklch(0.855 0.138 181.071)", // teal-300
    "chart-4": "oklch(0.785 0.115 274.713)", // indigo-300
    "chart-5": "oklch(0.901 0.058 230.902)", // sky-200
    foreground: "oklch(0.967 0.001 286.375)", // zinc-100
    "foreground-muted": "oklch(0.705 0.015 286.067)", // zinc-400
    primary: "oklch(0.871 0.006 286.286)", // zinc-300
    secondary: "oklch(0.552 0.016 285.938)", // zinc-500
  },
  id: "ocean",
  light: {
    accent: "oklch(0.92 0.004 286.32)", // zinc-200
    background: "oklch(0.985 0 0)", // zinc-50
    "background-muted": "oklch(0.967 0.001 286.375)", // zinc-100
    "chart-1": "oklch(0.546 0.245 262.881)", // blue-600
    "chart-2": "oklch(0.715 0.143 215.221)", // cyan-500
    "chart-3": "oklch(0.777 0.152 181.912)", // teal-400
    "chart-4": "oklch(0.673 0.182 276.935)", // indigo-400
    "chart-5": "oklch(0.828 0.111 230.318)", // sky-300
    foreground: "oklch(0.21 0.006 285.885)", // zinc-900
    "foreground-muted": "oklch(0.552 0.016 285.938)", // zinc-500
    primary: "oklch(0.37 0.013 285.805)", // zinc-700
    secondary: "oklch(0.705 0.015 286.067)", // zinc-400
  },
  name: "Ocean",
};

const sunsetColorPalette: ColorPalette = {
  dark: {
    accent: "oklch(0.268 0.011 36.5)", // taupe-800 (Tailwind v4.2)
    background: "oklch(0.147 0.004 49.3)", // taupe-950 (Tailwind v4.2)
    "background-muted": "oklch(0.214 0.009 43.1)", // taupe-900 (Tailwind v4.2)
    "chart-1": "oklch(0.75 0.183 55.934)", // orange-400
    "chart-2": "oklch(0.712 0.194 13.428)", // rose-400
    "chart-3": "oklch(0.879 0.169 91.605)", // amber-300
    "chart-4": "oklch(0.714 0.203 305.504)", // purple-400
    "chart-5": "oklch(0.899 0.061 343.231)", // pink-200
    foreground: "oklch(0.96 0.002 17.2)", // taupe-100 (Tailwind v4.2)
    "foreground-muted": "oklch(0.714 0.014 41.2)", // taupe-400 (Tailwind v4.2)
    primary: "oklch(0.868 0.007 39.5)", // taupe-300 (Tailwind v4.2)
    secondary: "oklch(0.547 0.021 43.1)", // taupe-500 (Tailwind v4.2)
  },
  id: "sunset",
  light: {
    accent: "oklch(0.922 0.005 34.3)", // taupe-200 (Tailwind v4.2)
    background: "oklch(0.986 0.002 67.8)", // taupe-50 (Tailwind v4.2)
    "background-muted": "oklch(0.96 0.002 17.2)", // taupe-100 (Tailwind v4.2)
    "chart-1": "oklch(0.705 0.213 47.604)", // orange-500
    "chart-2": "oklch(0.645 0.246 16.439)", // rose-500
    "chart-3": "oklch(0.828 0.189 84.429)", // amber-400
    "chart-4": "oklch(0.627 0.265 303.9)", // purple-500
    "chart-5": "oklch(0.823 0.12 346.018)", // pink-300
    foreground: "oklch(0.214 0.009 43.1)", // taupe-900 (Tailwind v4.2)
    "foreground-muted": "oklch(0.547 0.021 43.1)", // taupe-500 (Tailwind v4.2)
    primary: "oklch(0.367 0.016 35.7)", // taupe-700 (Tailwind v4.2)
    secondary: "oklch(0.714 0.014 41.2)", // taupe-400 (Tailwind v4.2)
  },
  name: "Sunset",
};

const groveColorPalette: ColorPalette = {
  dark: {
    accent: "oklch(0.268 0.007 34.298)", // stone-800
    background: "oklch(0.147 0.004 49.25)", // stone-950
    "background-muted": "oklch(0.216 0.006 56.043)", // stone-900
    "chart-1": "oklch(0.765 0.177 163.223)", // emerald-400
    "chart-2": "oklch(0.841 0.238 128.85)", // lime-400
    "chart-3": "oklch(0.6 0.118 184.704)", // teal-600
    "chart-4": "oklch(0.828 0.189 84.429)", // amber-400
    "chart-5": "oklch(0.709 0.01 56.259)", // stone-400
    foreground: "oklch(0.97 0.001 106.424)", // stone-100
    "foreground-muted": "oklch(0.709 0.01 56.259)", // stone-400
    primary: "oklch(0.869 0.005 56.366)", // stone-300
    secondary: "oklch(0.553 0.013 58.071)", // stone-500
  },
  id: "grove",
  light: {
    accent: "oklch(0.923 0.003 48.717)", // stone-200
    background: "oklch(0.985 0.001 106.423)", // stone-50
    "background-muted": "oklch(0.97 0.001 106.424)", // stone-100
    "chart-1": "oklch(0.596 0.145 163.225)", // emerald-600
    "chart-2": "oklch(0.768 0.233 130.85)", // lime-500
    "chart-3": "oklch(0.511 0.096 186.391)", // teal-700
    "chart-4": "oklch(0.769 0.188 70.08)", // amber-500
    "chart-5": "oklch(0.709 0.01 56.259)", // stone-400
    foreground: "oklch(0.216 0.006 56.043)", // stone-900
    "foreground-muted": "oklch(0.553 0.013 58.071)", // stone-500
    primary: "oklch(0.374 0.01 67.558)", // stone-700
    secondary: "oklch(0.709 0.01 56.259)", // stone-400
  },
  name: "Grove",
};

const vividColorPalette: ColorPalette = {
  dark: {
    accent: "oklch(0.263 0.024 320.12)", // mauve-800 (Tailwind v4.2)
    background: "oklch(0.145 0.008 326)", // mauve-950 (Tailwind v4.2)
    "background-muted": "oklch(0.212 0.019 322.12)", // mauve-900 (Tailwind v4.2)
    "chart-1": "oklch(0.702 0.183 293.541)", // violet-400
    "chart-2": "oklch(0.718 0.202 349.761)", // pink-400
    "chart-3": "oklch(0.865 0.127 207.078)", // cyan-300
    "chart-4": "oklch(0.897 0.196 126.665)", // lime-300
    "chart-5": "oklch(0.75 0.183 55.934)", // orange-400
    foreground: "oklch(0.96 0.003 325.6)", // mauve-100 (Tailwind v4.2)
    "foreground-muted": "oklch(0.711 0.019 323.02)", // mauve-400 (Tailwind v4.2)
    primary: "oklch(0.865 0.012 325.68)", // mauve-300 (Tailwind v4.2)
    secondary: "oklch(0.542 0.034 322.5)", // mauve-500 (Tailwind v4.2)
  },
  id: "vivid",
  light: {
    accent: "oklch(0.922 0.005 325.62)", // mauve-200 (Tailwind v4.2)
    background: "oklch(0.985 0 0)", // mauve-50 (Tailwind v4.2)
    "background-muted": "oklch(0.96 0.003 325.6)", // mauve-100 (Tailwind v4.2)
    "chart-1": "oklch(0.606 0.25 292.717)", // violet-500
    "chart-2": "oklch(0.656 0.241 354.308)", // pink-500
    "chart-3": "oklch(0.715 0.143 215.221)", // cyan-500
    "chart-4": "oklch(0.768 0.233 130.85)", // lime-500
    "chart-5": "oklch(0.705 0.213 47.604)", // orange-500
    foreground: "oklch(0.212 0.019 322.12)", // mauve-900 (Tailwind v4.2)
    "foreground-muted": "oklch(0.542 0.034 322.5)", // mauve-500 (Tailwind v4.2)
    primary: "oklch(0.364 0.029 323.89)", // mauve-700 (Tailwind v4.2)
    secondary: "oklch(0.711 0.019 323.02)", // mauve-400 (Tailwind v4.2)
  },
  name: "Vivid",
};

export const DEFAULT_COLOR_PALETTE_ID = primaryColorPalette.id;
export const CUSTOM_COLOR_PALETTE_ID = "custom";

export const COLOR_PALETTES: ColorPalette[] = [
  primaryColorPalette,
  monochromeColorPalette,
  oceanColorPalette,
  sunsetColorPalette,
  groveColorPalette,
  vividColorPalette,
];

export const colorPalettesById: Record<string, ColorPalette> =
  Object.fromEntries(COLOR_PALETTES.map((palette) => [palette.id, palette]));

export function getColorPalette(id: string): ColorPalette {
  return colorPalettesById[id] ?? primaryColorPalette;
}
