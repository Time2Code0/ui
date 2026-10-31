"use client";

import type { BaseUIEvent } from "@base-ui/react";

import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { flushSync } from "react-dom";

import {
  ArrowDown01Icon,
  Cancel01Icon,
  ColorPickerIcon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";

import { Button, type ButtonProps } from "./button";
import { Icon } from "./icon";
import { InputGroup, InputGroupAddon } from "./input-group";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "./menu";
import { Popover, PopoverPopup, PopoverTrigger } from "./popover";
import { Separator } from "./separator";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ColorPickerColorSpace = "rgb" | "hsl" | "hsv" | "oklch";

type Channels = [number, number, number];

/**
 * A parsed color. `rgb` runs 0–255; `hsl` and `hsv` take hue 0–360 and the
 * rest 0–100; `oklch` takes lightness 0–100, chroma 0–0.4 and hue 0–360.
 */
export interface ColorPickerColor {
  alpha: number;
  channels: Channels;
  space: ColorPickerColorSpace;
}

export type ColorPickerFormat = "hex" | "rgb" | "hsl" | "hsb" | "oklch";

export type ColorPickerChannel =
  | "hue"
  | "saturation"
  | "brightness"
  | "lightness"
  | "chroma"
  | "red"
  | "green"
  | "blue"
  | "alpha";

export interface ColorPickerLabels {
  alpha: string;
  area: string;
  blue: string;
  brightness: string;
  chroma: string;
  clear: string;
  copied: string;
  copy: string;
  eyeDropper: string;
  format: string;
  green: string;
  hex: string;
  hue: string;
  lightness: string;
  openPicker: string;
  panelLabel: string;
  placeholder: string;
  red: string;
  saturation: string;
  swatches: string;
}

export interface ColorPickerI18n {
  /** A spoken name, "dark vibrant blue", for value texts and swatches. */
  getColorName: (color: ColorPickerColor) => string;
  labels: ColorPickerLabels;
}

export interface ColorPickerI18nOverrides {
  getColorName?: ColorPickerI18n["getColorName"];
  labels?: Partial<ColorPickerLabels>;
}

export const COLOR_PICKER_FORMATS: ColorPickerFormat[] = [
  "hex",
  "rgb",
  "hsl",
  "hsb",
  "oklch",
];

/* -------------------------------------------------------------------------- */
/*                                 Color math                                 */
/* -------------------------------------------------------------------------- */

const SPACES: ColorPickerColorSpace[] = ["rgb", "hsl", "hsv", "oklch"];

/** How far outside 0–1 a channel may land and still count as in gamut. */
const GAMUT_EPSILON = 0.0002;

type Mat3 = readonly [Channels, Channels, Channels];

function multiply(m: Mat3, [a, b, c]: Channels): Channels {
  return [
    m[0][0] * a + m[0][1] * b + m[0][2] * c,
    m[1][0] * a + m[1][1] * b + m[1][2] * c,
    m[2][0] * a + m[2][1] * b + m[2][2] * c,
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapHue(hue: number) {
  return ((hue % 360) + 360) % 360;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  // `|| 0` turns -0 into 0.
  return Math.round(value * factor) / factor || 0;
}

function formatNumber(value: number, digits: number) {
  return String(round(value, digits));
}

// Björn Ottosson's matrices, linear sRGB straight to OKLab and back.
const LINEAR_SRGB_TO_LMS: Mat3 = [
  [0.412_221_470_8, 0.536_332_536_3, 0.051_445_992_9],
  [0.211_903_498_2, 0.680_699_545_1, 0.107_396_956_6],
  [0.088_302_461_9, 0.281_718_837_6, 0.629_978_700_5],
];
const LMS_TO_LINEAR_SRGB: Mat3 = [
  [4.076_741_662_1, -3.307_711_591_3, 0.230_969_929_2],
  [-1.268_438_004_6, 2.609_757_401_1, -0.341_319_396_5],
  [-0.004_196_086_3, -0.703_418_614_7, 1.707_614_701],
];
const LMS_TO_OKLAB: Mat3 = [
  [0.210_454_255_3, 0.793_617_785, -0.004_072_046_8],
  [1.977_998_495_1, -2.428_592_205, 0.450_593_709_9],
  [0.025_904_037_1, 0.782_771_766_2, -0.808_675_766],
];
const OKLAB_TO_LMS: Mat3 = [
  [1, 0.396_337_777_4, 0.215_803_757_3],
  [1, -0.105_561_345_8, -0.063_854_172_8],
  [1, -0.089_484_177_5, -1.291_485_548],
];

// CSS Color 4 sample code, for the other `color()` spaces and Lab.
const XYZ_TO_LINEAR_SRGB: Mat3 = [
  [12_831 / 3959, -329 / 214, -1974 / 3959],
  [-851_781 / 878_810, 1_648_619 / 878_810, 36_519 / 878_810],
  [705 / 12_673, -2585 / 12_673, 705 / 667],
];
const LINEAR_P3_TO_XYZ: Mat3 = [
  [608_311 / 1_250_200, 189_793 / 714_400, 198_249 / 1_000_160],
  [35_783 / 156_275, 247_089 / 357_200, 198_249 / 2_500_400],
  [0, 32_229 / 714_400, 5_220_557 / 5_000_800],
];
const LINEAR_A98_TO_XYZ: Mat3 = [
  [573_536 / 994_567, 263_643 / 1_420_810, 187_206 / 994_567],
  [591_459 / 1_989_134, 6_239_551 / 9_945_670, 374_412 / 4_972_835],
  [53_769 / 1_989_134, 351_524 / 4_972_835, 4_929_758 / 4_972_835],
];
const LINEAR_REC2020_TO_XYZ: Mat3 = [
  [63_426_534 / 99_577_255, 20_160_776 / 139_408_157, 47_086_771 / 278_816_314],
  [26_158_966 / 99_577_255, 472_592_308 / 697_040_785, 8_267_143 / 139_408_157],
  [0, 19_567_812 / 697_040_785, 295_819_943 / 278_816_314],
];
const LINEAR_PROPHOTO_TO_XYZ_D50: Mat3 = [
  [0.797_766_644_900_642_3, 0.135_181_297_400_533_08, 0.031_347_734_128_392_2],
  [0.288_074_828_819_401_3, 0.711_835_234_241_873, 0.000_089_936_938_725_64],
  [0, 0, 0.825_104_602_510_460_2],
];
const D50_TO_D65: Mat3 = [
  [0.955_473_421_488_075, -0.023_098_454_948_764_71, 0.063_259_243_200_570_72],
  [
    -0.028_369_709_333_863_7, 1.009_995_398_081_304_1,
    0.021_041_441_191_917_323,
  ],
  [
    0.012_314_014_864_481_998, -0.020_507_649_298_898_964,
    1.330_365_926_242_124,
  ],
];
const D50_WHITE: Channels = [
  0.3457 / 0.3585,
  1,
  (1 - 0.3457 - 0.3585) / 0.3585,
];

function srgbToLinear(value: number) {
  const abs = Math.abs(value);
  return abs <= 0.040_45
    ? value / 12.92
    : Math.sign(value) * ((abs + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(value: number) {
  const abs = Math.abs(value);
  return abs <= 0.003_130_8
    ? value * 12.92
    : Math.sign(value) * (1.055 * abs ** (1 / 2.4) - 0.055);
}

function linearSrgbToOklab(rgb: Channels): Channels {
  const [l, m, s] = multiply(LINEAR_SRGB_TO_LMS, rgb);
  return multiply(LMS_TO_OKLAB, [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)]);
}

function oklabToLinearSrgb(lab: Channels): Channels {
  const [l, m, s] = multiply(OKLAB_TO_LMS, lab);
  return multiply(LMS_TO_LINEAR_SRGB, [l ** 3, m ** 3, s ** 3]);
}

/** OKLab with L 0–1 to OKLCH channels, L 0–100. */
function oklabToOklch([l, a, b]: Channels): Channels {
  const chroma = Math.hypot(a, b);
  return [l * 100, chroma, wrapHue((Math.atan2(b, a) * 180) / Math.PI)];
}

function oklchToOklab([l, c, h]: Channels): Channels {
  const rad = (h * Math.PI) / 180;
  return [l / 100, c * Math.cos(rad), c * Math.sin(rad)];
}

/** sRGB 0–1, unclamped, from OKLCH. */
function oklchToSrgbUnclamped(oklch: Channels): Channels {
  const [r, g, b] = oklabToLinearSrgb(oklchToOklab(oklch));
  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b)];
}

function isUnitInGamut(rgb: Channels) {
  return rgb.every(
    (value) => value >= -GAMUT_EPSILON && value <= 1 + GAMUT_EPSILON
  );
}

function clipUnit(rgb: Channels): Channels {
  return [clamp(rgb[0], 0, 1), clamp(rgb[1], 0, 1), clamp(rgb[2], 0, 1)];
}

function deltaEOK(rgb: Channels, oklch: Channels) {
  const [l1, a1, b1] = linearSrgbToOklab([
    srgbToLinear(rgb[0]),
    srgbToLinear(rgb[1]),
    srgbToLinear(rgb[2]),
  ]);
  const [l2, a2, b2] = oklchToOklab(oklch);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

/**
 * OKLCH to sRGB 0–255 with the CSS Color 4 gamut mapping: chroma comes down
 * at the same lightness and hue until clipping the rest is not noticeable.
 */
function oklchToRgb(oklch: Channels): Channels {
  const [l, c, h] = oklch;
  if (l >= 100) {
    return [255, 255, 255];
  }
  if (l <= 0) {
    return [0, 0, 0];
  }
  const jnd = 0.02;
  const epsilon = 0.0001;
  let rgb = oklchToSrgbUnclamped(oklch);
  let clipped = clipUnit(rgb);
  if (isUnitInGamut(rgb) || deltaEOK(clipped, oklch) < jnd) {
    return [clipped[0] * 255, clipped[1] * 255, clipped[2] * 255];
  }
  let min = 0;
  let max = c;
  let minInGamut = true;
  while (max - min > epsilon) {
    const chroma = (min + max) / 2;
    const current: Channels = [l, chroma, h];
    rgb = oklchToSrgbUnclamped(current);
    if (minInGamut && isUnitInGamut(rgb)) {
      min = chroma;
      continue;
    }
    clipped = clipUnit(rgb);
    const delta = deltaEOK(clipped, current);
    if (delta < jnd) {
      if (jnd - delta < epsilon) {
        break;
      }
      minInGamut = false;
      min = chroma;
    } else {
      max = chroma;
    }
  }
  return [clipped[0] * 255, clipped[1] * 255, clipped[2] * 255];
}

function rgbToOklch([r, g, b]: Channels): Channels {
  return oklabToOklch(
    linearSrgbToOklab([
      srgbToLinear(r / 255),
      srgbToLinear(g / 255),
      srgbToLinear(b / 255),
    ])
  );
}

function rgbToHsv([r, g, b]: Channels): Channels {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const delta = max - Math.min(red, green, blue);
  let hue = 0;
  if (delta > 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }
  return [wrapHue(hue), max === 0 ? 0 : (delta / max) * 100, max * 100];
}

function hsvToRgb([h, s, v]: Channels): Channels {
  const saturation = s / 100;
  const value = v / 100;
  const channel = (n: number) => {
    const k = (n + h / 60) % 6;
    return (
      (value - value * saturation * Math.max(0, Math.min(k, 4 - k, 1))) * 255
    );
  };
  return [channel(5), channel(3), channel(1)];
}

function hslToHsv([h, s, l]: Channels): Channels {
  const saturation = s / 100;
  const lightness = l / 100;
  const value = lightness + saturation * Math.min(lightness, 1 - lightness);
  return [h, value === 0 ? 0 : 2 * (1 - lightness / value) * 100, value * 100];
}

function hsvToHsl([h, s, v]: Channels): Channels {
  const saturation = s / 100;
  const value = v / 100;
  const lightness = value * (1 - saturation / 2);
  const divisor = Math.min(lightness, 1 - lightness);
  return [
    h,
    divisor === 0 ? 0 : ((value - lightness) / divisor) * 100,
    lightness * 100,
  ];
}

function toRgbChannels(color: ColorPickerColor): Channels {
  switch (color.space) {
    case "rgb":
      return color.channels;
    case "hsv":
      return hsvToRgb(color.channels);
    case "hsl":
      return hsvToRgb(hslToHsv(color.channels));
    default:
      return oklchToRgb(color.channels);
  }
}

function convertChannels(
  color: ColorPickerColor,
  space: ColorPickerColorSpace
): Channels {
  if (color.space === space) {
    return color.channels;
  }
  if (color.space === "hsl" && space === "hsv") {
    return hslToHsv(color.channels);
  }
  if (color.space === "hsv" && space === "hsl") {
    return hsvToHsl(color.channels);
  }
  const rgb = toRgbChannels(color);
  switch (space) {
    case "rgb":
      return rgb;
    case "hsv":
      return rgbToHsv(rgb);
    case "hsl":
      return hsvToHsl(rgbToHsv(rgb));
    default:
      return rgbToOklch(rgb);
  }
}

/**
 * Channels that no longer affect the color (the hue of a gray, the saturation
 * of black) keep their previous value, so the controls stay where they were.
 */
function keepChannels(
  space: ColorPickerColorSpace,
  next: Channels,
  previous: Channels | undefined
): Channels {
  if (!previous) {
    return next;
  }
  const [a, b, c] = next;
  switch (space) {
    case "hsv": {
      const black = c < 0.01;
      return [black || b < 0.01 ? previous[0] : a, black ? previous[1] : b, c];
    }
    case "hsl": {
      const extreme = c < 0.01 || c > 99.99;
      return [
        extreme || b < 0.01 ? previous[0] : a,
        extreme ? previous[1] : b,
        c,
      ];
    }
    case "oklch":
      return [a, b, b < 0.0005 ? previous[2] : c];
    default:
      return next;
  }
}

type ChannelMemory = Record<ColorPickerColorSpace, Channels>;

function rememberChannels(
  color: ColorPickerColor,
  memory?: ChannelMemory
): ChannelMemory {
  const next = {} as ChannelMemory;
  for (const space of SPACES) {
    next[space] =
      space === color.space
        ? color.channels
        : keepChannels(space, convertChannels(color, space), memory?.[space]);
  }
  return next;
}

/** Whether a color fits sRGB. Only an OKLCH color can fall outside it. */
export function isColorInSrgb(color: ColorPickerColor): boolean {
  if (color.space !== "oklch") {
    return true;
  }
  const [l] = color.channels;
  return (
    l <= 0 || l >= 100 || isUnitInGamut(oklchToSrgbUnclamped(color.channels))
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Formatting                                 */
/* -------------------------------------------------------------------------- */

const FORMAT_SPACE: Record<ColorPickerFormat, ColorPickerColorSpace> = {
  hex: "rgb",
  hsb: "hsv",
  hsl: "hsl",
  oklch: "oklch",
  rgb: "rgb",
};

const FORMAT_LABELS: Record<ColorPickerFormat, string> = {
  hex: "HEX",
  hsb: "HSB",
  hsl: "HSL",
  oklch: "OKLCH",
  rgb: "RGB",
};

function toHexByte(value: number) {
  return Math.round(clamp(value, 0, 255))
    .toString(16)
    .padStart(2, "0");
}

function alphaSuffix(alpha: number) {
  return alpha < 1 ? ` / ${formatNumber(alpha, 3)}` : "";
}

/** The color written in a format: `#3b82f6`, `rgb(59 130 246 / 0.5)`, … */
export function formatColor(
  color: ColorPickerColor,
  format: ColorPickerFormat
): string {
  const [a, b, c] = convertChannels(color, FORMAT_SPACE[format]);
  const alpha = clamp(color.alpha, 0, 1);
  switch (format) {
    case "hex":
      return `#${toHexByte(a)}${toHexByte(b)}${toHexByte(c)}${alpha < 1 ? toHexByte(alpha * 255) : ""}`;
    case "rgb":
      return `rgb(${formatNumber(clamp(a, 0, 255), 0)} ${formatNumber(clamp(b, 0, 255), 0)} ${formatNumber(clamp(c, 0, 255), 0)}${alphaSuffix(alpha)})`;
    case "hsl":
      return `hsl(${formatNumber(a, 1)} ${formatNumber(b, 1)}% ${formatNumber(c, 1)}%${alphaSuffix(alpha)})`;
    case "hsb":
      return `hsb(${formatNumber(a, 1)} ${formatNumber(b, 1)}% ${formatNumber(c, 1)}%${alphaSuffix(alpha)})`;
    default:
      return `oklch(${formatNumber(a, 2)}% ${formatNumber(b, 5)} ${formatNumber(c, 3)}${alphaSuffix(alpha)})`;
  }
}

const CHECKERBOARD =
  "repeating-conic-gradient(#d4d4d4 0% 25%, #ffffff 0% 50%) 50% / 8px 8px";

/** A CSS background for a chip: the color, on a checkerboard if translucent. */
function toChipBackground(color: ColorPickerColor) {
  const css = toCssColor(color);
  return color.alpha < 1
    ? `linear-gradient(${css}, ${css}), ${CHECKERBOARD}`
    : css;
}

/** A CSS color that paints the color, wide gamut included. */
function toCssColor(color: ColorPickerColor, opaque = false) {
  const value = opaque ? { ...color, alpha: 1 } : color;
  return formatColor(value, color.space === "oklch" ? "oklch" : "rgb");
}

/* -------------------------------------------------------------------------- */
/*                                   Parsing                                  */
/* -------------------------------------------------------------------------- */

// Name and hex of the 148 CSS named colors.
const NAMED_COLORS = new Map(
  "aliceblue f0f8ff antiquewhite faebd7 aqua 00ffff aquamarine 7fffd4 azure f0ffff beige f5f5dc bisque ffe4c4 black 000000 blanchedalmond ffebcd blue 0000ff blueviolet 8a2be2 brown a52a2a burlywood deb887 cadetblue 5f9ea0 chartreuse 7fff00 chocolate d2691e coral ff7f50 cornflowerblue 6495ed cornsilk fff8dc crimson dc143c cyan 00ffff darkblue 00008b darkcyan 008b8b darkgoldenrod b8860b darkgray a9a9a9 darkgreen 006400 darkgrey a9a9a9 darkkhaki bdb76b darkmagenta 8b008b darkolivegreen 556b2f darkorange ff8c00 darkorchid 9932cc darkred 8b0000 darksalmon e9967a darkseagreen 8fbc8f darkslateblue 483d8b darkslategray 2f4f4f darkslategrey 2f4f4f darkturquoise 00ced1 darkviolet 9400d3 deeppink ff1493 deepskyblue 00bfff dimgray 696969 dimgrey 696969 dodgerblue 1e90ff firebrick b22222 floralwhite fffaf0 forestgreen 228b22 fuchsia ff00ff gainsboro dcdcdc ghostwhite f8f8ff gold ffd700 goldenrod daa520 gray 808080 green 008000 greenyellow adff2f grey 808080 honeydew f0fff0 hotpink ff69b4 indianred cd5c5c indigo 4b0082 ivory fffff0 khaki f0e68c lavender e6e6fa lavenderblush fff0f5 lawngreen 7cfc00 lemonchiffon fffacd lightblue add8e6 lightcoral f08080 lightcyan e0ffff lightgoldenrodyellow fafad2 lightgray d3d3d3 lightgreen 90ee90 lightgrey d3d3d3 lightpink ffb6c1 lightsalmon ffa07a lightseagreen 20b2aa lightskyblue 87cefa lightslategray 778899 lightslategrey 778899 lightsteelblue b0c4de lightyellow ffffe0 lime 00ff00 limegreen 32cd32 linen faf0e6 magenta ff00ff maroon 800000 mediumaquamarine 66cdaa mediumblue 0000cd mediumorchid ba55d3 mediumpurple 9370db mediumseagreen 3cb371 mediumslateblue 7b68ee mediumspringgreen 00fa9a mediumturquoise 48d1cc mediumvioletred c71585 midnightblue 191970 mintcream f5fffa mistyrose ffe4e1 moccasin ffe4b5 navajowhite ffdead navy 000080 oldlace fdf5e6 olive 808000 olivedrab 6b8e23 orange ffa500 orangered ff4500 orchid da70d6 palegoldenrod eee8aa palegreen 98fb98 paleturquoise afeeee palevioletred db7093 papayawhip ffefd5 peachpuff ffdab9 peru cd853f pink ffc0cb plum dda0dd powderblue b0e0e6 purple 800080 rebeccapurple 663399 red ff0000 rosybrown bc8f8f royalblue 4169e1 saddlebrown 8b4513 salmon fa8072 sandybrown f4a460 seagreen 2e8b57 seashell fff5ee sienna a0522d silver c0c0c0 skyblue 87ceeb slateblue 6a5acd slategray 708090 slategrey 708090 snow fffafa springgreen 00ff7f steelblue 4682b4 tan d2b48c teal 008080 thistle d8bfd8 tomato ff6347 turquoise 40e0d0 violet ee82ee wheat f5deb3 white ffffff whitesmoke f5f5f5 yellow ffff00 yellowgreen 9acd32"
    .split(" ")
    .flatMap((token, index, tokens) =>
      index % 2 === 0 ? [[token, tokens[index + 1] ?? ""] as const] : []
    )
);

const WHITESPACE_PATTERN = /\s+/;
const CURRENT_COLOR_PATTERN = /currentcolor/i;
const HEX_PATTERN = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const FUNCTION_PATTERN = /^([a-z]+)\(\s*([^()]*)\)$/i;
const NUMBER_PATTERN =
  /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(%|deg|rad|grad|turn)?$/i;

/** A number, or a percentage where 100% is `percentOf`. `none` is 0. */
function readNumber(token: string | undefined, percentOf: number) {
  if (token === undefined) {
    return null;
  }
  if (token.toLowerCase() === "none") {
    return 0;
  }
  const match = token.match(NUMBER_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const value = Number.parseFloat(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === undefined) {
    return value;
  }
  return unit === "%" ? (value / 100) * percentOf : null;
}

function readHue(token: string | undefined) {
  if (token === undefined) {
    return null;
  }
  if (token.toLowerCase() === "none") {
    return 0;
  }
  const match = token.match(NUMBER_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const value = Number.parseFloat(match[1]);
  switch (match[2]?.toLowerCase()) {
    case undefined:
    case "deg":
      return wrapHue(value);
    case "rad":
      return wrapHue((value * 180) / Math.PI);
    case "grad":
      return wrapHue(value * 0.9);
    case "turn":
      return wrapHue(value * 360);
    default:
      return null;
  }
}

function readAlpha(token: string | undefined) {
  if (token === undefined) {
    return 1;
  }
  const value = readNumber(token, 1);
  return value === null ? null : clamp(value, 0, 1);
}

function parseHex(digits: string): ColorPickerColor {
  const full =
    digits.length <= 4
      ? [...digits].map((char) => char + char).join("")
      : digits;
  const [r = 0, g = 0, b = 0, a] = (full.match(/../g) ?? []).map((pair) =>
    Number.parseInt(pair, 16)
  );
  return {
    alpha: a === undefined ? 1 : a / 255,
    channels: [r, g, b],
    space: "rgb",
  };
}

/** Splits a function body into channels and alpha, modern or comma syntax. */
function splitArguments(body: string) {
  const parts = body.split("/");
  if (parts.length > 2) {
    return null;
  }
  const [main = "", slashAlpha] = parts;
  if (main.includes(",")) {
    if (slashAlpha !== undefined) {
      return null;
    }
    const values = main.split(",").map((value) => value.trim());
    const alpha = values.length === 4 ? values.pop() : undefined;
    return { alpha, values };
  }
  return {
    alpha: slashAlpha?.trim(),
    values: main.trim().split(WHITESPACE_PATTERN).filter(Boolean),
  };
}

function oklabColor(lab: Channels, alpha: number): ColorPickerColor {
  return { alpha, channels: oklabToOklch(lab), space: "oklch" };
}

function xyzToOklch(xyz: Channels, alpha: number): ColorPickerColor {
  return oklabColor(
    linearSrgbToOklab(multiply(XYZ_TO_LINEAR_SRGB, xyz)),
    alpha
  );
}

function labToXyzD65([l, a, b]: Channels): Channels {
  const kappa = 24_389 / 27;
  const epsilon = 216 / 24_389;
  const f1 = (l + 16) / 116;
  const f0 = a / 500 + f1;
  const f2 = f1 - b / 200;
  const xyz: Channels = [
    f0 ** 3 > epsilon ? f0 ** 3 : (116 * f0 - 16) / kappa,
    l > kappa * epsilon ? f1 ** 3 : l / kappa,
    f2 ** 3 > epsilon ? f2 ** 3 : (116 * f2 - 16) / kappa,
  ];
  return multiply(D50_TO_D65, [
    xyz[0] * D50_WHITE[0],
    xyz[1] * D50_WHITE[1],
    xyz[2] * D50_WHITE[2],
  ]);
}

function signedPower(value: number, power: number) {
  return Math.sign(value) * Math.abs(value) ** power;
}

function parsePredefined(
  space: string,
  values: Channels,
  alpha: number
): ColorPickerColor | null {
  switch (space) {
    case "srgb":
      if (isUnitInGamut(values)) {
        const [r, g, b] = clipUnit(values);
        return { alpha, channels: [r * 255, g * 255, b * 255], space: "rgb" };
      }
      return oklabColor(
        linearSrgbToOklab([
          srgbToLinear(values[0]),
          srgbToLinear(values[1]),
          srgbToLinear(values[2]),
        ]),
        alpha
      );
    case "srgb-linear":
      return oklabColor(linearSrgbToOklab(values), alpha);
    case "display-p3":
      return xyzToOklch(
        multiply(LINEAR_P3_TO_XYZ, [
          srgbToLinear(values[0]),
          srgbToLinear(values[1]),
          srgbToLinear(values[2]),
        ]),
        alpha
      );
    case "a98-rgb":
      return xyzToOklch(
        multiply(LINEAR_A98_TO_XYZ, [
          signedPower(values[0], 563 / 256),
          signedPower(values[1], 563 / 256),
          signedPower(values[2], 563 / 256),
        ]),
        alpha
      );
    case "prophoto-rgb": {
      const linear = values.map((value) =>
        Math.abs(value) <= 16 / 512 ? value / 16 : signedPower(value, 1.8)
      ) as Channels;
      return xyzToOklch(
        multiply(D50_TO_D65, multiply(LINEAR_PROPHOTO_TO_XYZ_D50, linear)),
        alpha
      );
    }
    case "rec2020": {
      const a = 1.099_296_826_809_44;
      const b = 0.018_053_968_510_807;
      const linear = values.map((value) =>
        Math.abs(value) < b * 4.5
          ? value / 4.5
          : signedPower((Math.abs(value) + a - 1) / a, 1 / 0.45) *
            Math.sign(value || 1)
      ) as Channels;
      return xyzToOklch(multiply(LINEAR_REC2020_TO_XYZ, linear), alpha);
    }
    case "xyz":
    case "xyz-d65":
      return xyzToOklch(values, alpha);
    case "xyz-d50":
      return xyzToOklch(multiply(D50_TO_D65, values), alpha);
    default:
      return null;
  }
}

function readChannels(
  tokens: (string | undefined)[],
  readers: ((token: string | undefined) => number | null)[]
): Channels | null {
  const values = readers.map((read, index) => read(tokens[index]));
  return values.every((value) => value !== null && Number.isFinite(value))
    ? (values as Channels)
    : null;
}

function hwbColor(
  [hue, whiteness, blackness]: Channels,
  alpha: number
): ColorPickerColor {
  const white = clamp(whiteness, 0, 100) / 100;
  const black = clamp(blackness, 0, 100) / 100;
  if (white + black >= 1) {
    const gray = (white / (white + black)) * 100;
    return { alpha, channels: [hue, 0, gray], space: "hsv" };
  }
  const value = 1 - black;
  return {
    alpha,
    channels: [hue, (1 - white / value) * 100, value * 100],
    space: "hsv",
  };
}

function lchColor([l, c, h]: Channels, alpha: number) {
  const rad = (h * Math.PI) / 180;
  const chroma = Math.max(0, c);
  return xyzToOklch(
    labToXyzD65([
      clamp(l, 0, 100),
      chroma * Math.cos(rad),
      chroma * Math.sin(rad),
    ]),
    alpha
  );
}

function parseFunction(name: string, body: string): ColorPickerColor | null {
  const args = splitArguments(body);
  if (!args) {
    return null;
  }
  let { values } = args;
  let space = "";
  if (name === "color") {
    space = values[0]?.toLowerCase() ?? "";
    values = values.slice(1);
  }
  if (values.length !== 3) {
    return null;
  }
  const alpha = readAlpha(args.alpha);
  if (alpha === null) {
    return null;
  }
  const percent = (of: number) => (token: string | undefined) =>
    readNumber(token, of);

  switch (name) {
    case "rgb":
    case "rgba": {
      const rgb = readChannels(values, [
        percent(255),
        percent(255),
        percent(255),
      ]);
      return (
        rgb && {
          alpha,
          channels: [
            clamp(rgb[0], 0, 255),
            clamp(rgb[1], 0, 255),
            clamp(rgb[2], 0, 255),
          ],
          space: "rgb",
        }
      );
    }
    case "hsl":
    case "hsla":
    case "hsb":
    case "hsv": {
      const hs = readChannels(values, [readHue, percent(100), percent(100)]);
      return (
        hs && {
          alpha,
          channels: [hs[0], clamp(hs[1], 0, 100), clamp(hs[2], 0, 100)],
          space: name.startsWith("hsl") ? "hsl" : "hsv",
        }
      );
    }
    case "hwb": {
      const hwb = readChannels(values, [readHue, percent(100), percent(100)]);
      return hwb && hwbColor(hwb, alpha);
    }
    case "lab": {
      const lab = readChannels(values, [
        percent(100),
        percent(125),
        percent(125),
      ]);
      return (
        lab &&
        xyzToOklch(labToXyzD65([clamp(lab[0], 0, 100), lab[1], lab[2]]), alpha)
      );
    }
    case "lch": {
      const lch = readChannels(values, [percent(100), percent(150), readHue]);
      return lch && lchColor(lch, alpha);
    }
    case "oklab": {
      const lab = readChannels(values, [
        percent(1),
        percent(0.4),
        percent(0.4),
      ]);
      return lab && oklabColor([clamp(lab[0], 0, 1), lab[1], lab[2]], alpha);
    }
    case "oklch": {
      const lch = readChannels(values, [percent(1), percent(0.4), readHue]);
      return (
        lch && {
          alpha,
          channels: [clamp(lch[0], 0, 1) * 100, Math.max(0, lch[1]), lch[2]],
          space: "oklch",
        }
      );
    }
    case "color": {
      const rgb = readChannels(values, [percent(1), percent(1), percent(1)]);
      return rgb && parsePredefined(space, rgb, alpha);
    }
    default:
      return null;
  }
}

/**
 * Reads hex, the 148 named colors, `transparent`, `rgb()`, `hsl()`, `hwb()`,
 * `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`, `hsb()` and `hsv()`.
 * `lab()`, `lch()`, `oklab()` and wide-gamut `color()` are kept as OKLCH.
 */
export function parseColor(
  value: string | null | undefined
): ColorPickerColor | null {
  const input = value?.trim().toLowerCase();
  if (!input) {
    return null;
  }
  if (input === "transparent") {
    return { alpha: 0, channels: [0, 0, 0], space: "rgb" };
  }
  const named = NAMED_COLORS.get(input);
  if (named) {
    return parseHex(named);
  }
  const hex = input.match(HEX_PATTERN)?.[1];
  if (hex) {
    return parseHex(hex);
  }
  const match = input.match(FUNCTION_PATTERN);
  if (!(match?.[1] && match[2] !== undefined)) {
    return null;
  }
  return parseFunction(match[1], match[2]);
}

const CSS_WIDE_KEYWORDS = new Set([
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
]);

/**
 * Reads what only a page can resolve, `color-mix()`, relative colors,
 * `light-dark()` and `var()`, through the computed style of a probe next to
 * `element`. Keywords, `currentColor` and an empty `var()` are rejected.
 */
function resolveCssColor(value: string, element: Element | null) {
  const parsed = parseColor(value);
  if (parsed) {
    return parsed;
  }
  const text = value.trim();
  if (
    !(element?.parentElement && typeof CSS !== "undefined") ||
    CSS_WIDE_KEYWORDS.has(text.toLowerCase()) ||
    CURRENT_COLOR_PATTERN.test(text) ||
    !(CSS.supports("color", text) || text.includes("var("))
  ) {
    return null;
  }
  const host = document.createElement("span");
  const probe = document.createElement("span");
  host.hidden = true;
  host.append(probe);
  element.parentElement.append(host);
  try {
    probe.style.setProperty("color", text);
    // A `var()` with no value makes the color inherit, so it would follow
    // the host; two hosts that differ tell that case apart.
    const read = (fallback: string) => {
      host.style.color = fallback;
      return getComputedStyle(probe).color;
    };
    const first = read("rgb(1, 2, 3)");
    if (first !== read("rgb(4, 5, 6)")) {
      return null;
    }
    return parseColor(first);
  } finally {
    host.remove();
  }
}

/* -------------------------------------------------------------------------- */
/*                               Contrast, names                              */
/* -------------------------------------------------------------------------- */

function relativeLuminance([r, g, b]: Channels) {
  return (
    0.2126 * srgbToLinear(r / 255) +
    0.7152 * srgbToLinear(g / 255) +
    0.0722 * srgbToLinear(b / 255)
  );
}

function toColor(color: string | ColorPickerColor | null | undefined) {
  return typeof color === "string" || !color ? parseColor(color) : color;
}

/** The WCAG 2 contrast ratio, 1 to 21, or `null` for a color it cannot read. */
export function getContrastRatio(
  text: string | ColorPickerColor,
  background: string | ColorPickerColor
): number | null {
  const fg = toColor(text);
  const bg = toColor(background);
  if (!(fg && bg)) {
    return null;
  }
  const back = toRgbChannels(bg);
  const front = toRgbChannels(fg);
  const alpha = clamp(fg.alpha, 0, 1);
  const blended: Channels = [
    front[0] * alpha + back[0] * (1 - alpha),
    front[1] * alpha + back[1] * (1 - alpha),
    front[2] * alpha + back[2] * (1 - alpha),
  ];
  const a = relativeLuminance(blended);
  const b = relativeLuminance(back);
  return round((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), 2);
}

/**
 * The text color that reads better on `background`: `light` while it keeps
 * 3:1, else `dark`.
 */
export function getForegroundColor(
  background: string | ColorPickerColor,
  {
    light = "#ffffff",
    dark = "#0a0a0a",
  }: { light?: string; dark?: string } = {}
): string | null {
  const ratio = getContrastRatio(light, background);
  if (ratio === null) {
    return null;
  }
  return ratio >= 3 ? light : dark;
}

/** Black or white, whichever contrasts more, for a check on a chip. */
function getCheckColor(color: ColorPickerColor) {
  const white = getContrastRatio("#ffffff", color) ?? 0;
  const black = getContrastRatio("#000000", color) ?? 0;
  return white >= black ? "#ffffff" : "#000000";
}

const HUE_NAMES: [number, string][] = [
  [10, "pink"],
  [40, "red"],
  [70, "orange"],
  [105, "yellow"],
  [135, "lime"],
  [170, "green"],
  [200, "teal"],
  [230, "cyan"],
  [270, "blue"],
  [300, "violet"],
  [320, "purple"],
  [345, "magenta"],
  [360, "pink"],
];

function getGrayName(lightness: number) {
  if (lightness < 0.15) {
    return "black";
  }
  if (lightness > 0.97) {
    return "white";
  }
  if (lightness < 0.4) {
    return "dark gray";
  }
  return lightness > 0.8 ? "light gray" : "gray";
}

function getHueName(lightness: number, chroma: number, h: number) {
  let hue = HUE_NAMES.find(([end]) => h < end)?.[1] ?? "pink";
  if (lightness < 0.55 && (hue === "orange" || hue === "yellow")) {
    hue = "brown";
  }
  const tone = [
    lightness < 0.3 && "very dark",
    lightness >= 0.3 && lightness < 0.5 && "dark",
    lightness > 0.9 && "very light",
    lightness > 0.78 && lightness <= 0.9 && "light",
  ].find(Boolean);
  const strength = [
    chroma < 0.05 && "grayish",
    chroma >= 0.05 && chroma < 0.1 && "muted",
    chroma > 0.18 && "vibrant",
  ].find(Boolean);
  return [tone, strength, hue].filter(Boolean).join(" ");
}

function getDefaultColorName(color: ColorPickerColor) {
  const [l, c, h] = convertChannels(color, "oklch");
  const lightness = l / 100;
  const name = c < 0.02 ? getGrayName(lightness) : getHueName(lightness, c, h);
  return color.alpha < 1
    ? `${name}, ${Math.round(color.alpha * 100)}% opaque`
    : name;
}

export const DEFAULT_COLOR_PICKER_I18N: ColorPickerI18n = {
  getColorName: getDefaultColorName,
  labels: {
    alpha: "Opacity",
    area: "Color",
    blue: "Blue",
    brightness: "Brightness",
    chroma: "Chroma",
    clear: "Clear color",
    copied: "Copied",
    copy: "Copy color",
    eyeDropper: "Pick a color from the screen",
    format: "Color format",
    green: "Green",
    hex: "Hex",
    hue: "Hue",
    lightness: "Lightness",
    openPicker: "Open color picker",
    panelLabel: "Choose color",
    placeholder: "Select color",
    red: "Red",
    saturation: "Saturation",
    swatches: "Swatches",
  },
};

/** The full i18n config, the overrides merged over the defaults per section. */
export function mergeColorPickerI18n(
  overrides?: ColorPickerI18nOverrides
): ColorPickerI18n {
  return {
    getColorName:
      overrides?.getColorName ?? DEFAULT_COLOR_PICKER_I18N.getColorName,
    labels: { ...DEFAULT_COLOR_PICKER_I18N.labels, ...overrides?.labels },
  };
}

/* -------------------------------------------------------------------------- */
/*                                  Channels                                  */
/* -------------------------------------------------------------------------- */

interface ChannelInfo {
  /** Digits shown in a field. */
  digits: number;
  index: 0 | 1 | 2;
  max: number;
  step: number;
}

const CHANNELS: Record<
  ColorPickerColorSpace,
  Partial<Record<ColorPickerChannel, ChannelInfo>>
> = {
  hsl: {
    hue: { digits: 1, index: 0, max: 360, step: 1 },
    lightness: { digits: 1, index: 2, max: 100, step: 1 },
    saturation: { digits: 1, index: 1, max: 100, step: 1 },
  },
  hsv: {
    brightness: { digits: 1, index: 2, max: 100, step: 1 },
    hue: { digits: 1, index: 0, max: 360, step: 1 },
    saturation: { digits: 1, index: 1, max: 100, step: 1 },
  },
  oklch: {
    chroma: { digits: 3, index: 1, max: 0.4, step: 0.004 },
    hue: { digits: 1, index: 2, max: 360, step: 1 },
    lightness: { digits: 2, index: 0, max: 100, step: 1 },
  },
  rgb: {
    blue: { digits: 0, index: 2, max: 255, step: 1 },
    green: { digits: 0, index: 1, max: 255, step: 1 },
    red: { digits: 0, index: 0, max: 255, step: 1 },
  },
};

const DEFAULT_CHANNEL_SPACE: Record<
  Exclude<ColorPickerChannel, "alpha">,
  ColorPickerColorSpace
> = {
  blue: "rgb",
  brightness: "hsv",
  chroma: "oklch",
  green: "rgb",
  hue: "hsv",
  lightness: "hsl",
  red: "rgb",
  saturation: "hsv",
};

const ALPHA_INFO: ChannelInfo = { digits: 0, index: 0, max: 100, step: 1 };

function resolveChannel(
  channel: ColorPickerChannel,
  colorSpace: ColorPickerColorSpace | undefined
) {
  if (channel === "alpha") {
    return { info: ALPHA_INFO, space: null };
  }
  const requested = colorSpace && CHANNELS[colorSpace][channel];
  const space = requested
    ? (colorSpace as ColorPickerColorSpace)
    : DEFAULT_CHANNEL_SPACE[channel];
  return { info: CHANNELS[space][channel] as ChannelInfo, space };
}

function formatChannelText(
  channel: ColorPickerChannel | "hex",
  info: ChannelInfo,
  value: number
) {
  if (channel === "alpha") {
    return `${Math.round(value)}%`;
  }
  return formatNumber(value, info.digits);
}

/** Characters in the widest value a field shows. */
function getWidestText(channel: ColorPickerChannel | "hex", info: ChannelInfo) {
  if (channel === "hex") {
    return 6;
  }
  if (channel === "alpha") {
    return 4;
  }
  const integer = String(Math.floor(info.max)).length;
  return integer + (info.digits > 0 ? info.digits + 1 : 0);
}

const CHANNEL_TEXT_PATTERN =
  /^([+-]?(?:\d+\.?\d*|\.\d+))\s*(%|deg|rad|grad|turn)?$/i;

/**
 * One number with a comma or dot decimal. `%` is a share of the channel's
 * range; a hue takes `deg`, `rad`, `grad` or `turn` and wraps.
 */
function parseChannelText(
  text: string,
  channel: ColorPickerChannel,
  info: ChannelInfo
) {
  const match = text.trim().replace(",", ".").match(CHANNEL_TEXT_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const number = Number.parseFloat(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === "%") {
    return clamp((number / 100) * info.max, 0, info.max);
  }
  if (channel === "hue") {
    return readHue(`${number}${unit ?? ""}`);
  }
  if (unit) {
    return null;
  }
  return clamp(number, 0, info.max);
}

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

const FALLBACK_COLOR: ColorPickerColor = {
  alpha: 1,
  channels: [0, 0, 0],
  space: "rgb",
};
const FALLBACK_MEMORY = rememberChannels(FALLBACK_COLOR);

interface UpdateOptions {
  commit?: boolean;
}

interface ColorPickerContextValue {
  alpha: boolean;
  anchorRef: React.RefObject<HTMLFieldSetElement | null>;
  areaRef: React.RefObject<HTMLDivElement | null>;
  ariaDescribedBy?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  clear: () => void;
  color: ColorPickerColor | null;
  commit: () => void;
  copied: boolean;
  copy: (format?: ColorPickerFormat) => void;
  disabled: boolean;
  displayFormat: ColorPickerFormat;
  format: ColorPickerFormat;
  formatValue: (format: ColorPickerFormat) => string | null;
  getChannels: (space: ColorPickerColorSpace) => Channels;
  hasInput: boolean;
  i18n: ColorPickerI18n;
  id: string;
  interactive: boolean;
  invalid: boolean;
  open: boolean;
  readOnly: boolean;
  setDisplayFormat: (format: ColorPickerFormat | null) => void;
  setHasInput: (hasInput: boolean) => void;
  setOpen: (open: boolean) => void;
  setValue: (value: string | null) => void;
  swatches?: string[];
  textInputRef: React.RefObject<HTMLInputElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  update: (color: ColorPickerColor | null, options?: UpdateOptions) => void;
  value: string | null;
}

const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);
const ColorPickerContentContext = createContext(false);

function useColorPickerContext(part: string) {
  const context = useContext(ColorPickerContext);
  if (!context) {
    throw new Error(`<${part}> must be used within <ColorPicker>.`);
  }
  return context;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };
}

function joinIds(...ids: (string | false | null | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

const noop = () => undefined;

function normalizeValue(value: string | null | undefined) {
  return value ? value : null;
}

/** Copies with ⌘C or Ctrl+C, unless a field holds a text selection. */
function handleCopyShortcut(event: React.KeyboardEvent, copy: () => void) {
  if (
    !(event.metaKey || event.ctrlKey) ||
    event.altKey ||
    event.shiftKey ||
    event.key.toLowerCase() !== "c"
  ) {
    return;
  }
  const { target } = event;
  if (
    target instanceof HTMLInputElement &&
    target.selectionStart !== target.selectionEnd
  ) {
    return;
  }
  event.preventDefault();
  copy();
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

interface PickerState {
  color: ColorPickerColor | null;
  memory: ChannelMemory;
  /** The last value emitted or received. */
  value: string | null;
}

function createState(
  value: string | null | undefined,
  alpha: boolean,
  memory = FALLBACK_MEMORY
): PickerState {
  const parsed = parseColor(value);
  const color = parsed && (alpha ? parsed : { ...parsed, alpha: 1 });
  return {
    color,
    memory: color ? rememberChannels(color, memory) : memory,
    value: normalizeValue(value),
  };
}

export interface ColorPickerProps {
  /** Adds the opacity slider and field, and lets the value carry alpha. @default false */
  alpha?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: React.ReactNode;
  /** Classes for the default trigger. */
  className?: string;
  /** Initial popover state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Initial value when uncontrolled, and what a form reset restores. @default null */
  defaultValue?: string | null;
  /** Disables every part and stops the popover opening. @default false */
  disabled?: boolean;
  /** Associates the field with a form elsewhere in the page. */
  form?: string;
  /** How the value is written. @default "hex" */
  format?: ColorPickerFormat;
  /** Labels and the color namer, merged over the defaults. */
  i18n?: ColorPickerI18nOverrides;
  /** Lands on the trigger or the input. @default generated */
  id?: string;
  /** The hidden form field. */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Sets `aria-invalid` on the trigger or the input. @default false */
  invalid?: boolean;
  /** Submits the value with a native form under this name. */
  name?: string;
  /** Fires when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Fires on every change, a drag included, with the value in `format`. */
  onValueChange?: (value: string | null) => void;
  /** Fires once an interaction ends, when the value changed during it. */
  onValueCommit?: (value: string | null) => void;
  /** Controlled popover state. */
  open?: boolean;
  /** Text of the default trigger while empty. */
  placeholder?: string;
  /** The popover opens, but nothing changes the value. @default false */
  readOnly?: boolean;
  /** Fails native form validation while empty. @default false */
  required?: boolean;
  /** Preset colors under the default panel. */
  swatches?: string[];
  /** Controlled value, any color `parseColor` reads. `null` is empty. */
  value?: string | null;
}

export function ColorPicker({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  onValueCommit,
  format = "hex",
  alpha = false,
  swatches,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  readOnly = false,
  invalid = false,
  name,
  form,
  required = false,
  inputRef,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  i18n: i18nProp,
  placeholder,
  className,
  children,
}: ColorPickerProps): React.ReactElement {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const i18n = useMemo(() => mergeColorPickerI18n(i18nProp), [i18nProp]);

  const controlled = valueProp !== undefined;
  const [state, setState] = useState(() =>
    createState(controlled ? valueProp : defaultValue, alpha)
  );
  // A value from outside that differs from the last one replaces the color.
  if (controlled && normalizeValue(valueProp) !== state.value) {
    setState(createState(valueProp, alpha, state.memory));
  }
  const value = controlled ? normalizeValue(valueProp) : state.value;

  // Pointer events can outpace renders, so handlers read the latest here.
  const stateRef = useRef(state);
  const valueRef = useRef(value);
  const committedRef = useRef(value);
  // Widened, or the linter reads `current` as always `false`.
  const pendingRef = useRef(false as boolean);
  useLayoutEffect(() => {
    stateRef.current = state;
    valueRef.current = value;
    if (!pendingRef.current) {
      committedRef.current = value;
    }
  });

  const [openState, setOpenState] = useState(defaultOpen);
  const open = !disabled && (openProp ?? openState);
  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled && next) {
        return;
      }
      setOpenState(next);
      onOpenChange?.(next);
    },
    [disabled, onOpenChange]
  );

  const [displayFormatState, setDisplayFormat] =
    useState<ColorPickerFormat | null>(null);
  const displayFormat = displayFormatState ?? format;
  const [hasInput, setHasInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLFieldSetElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);

  const interactive = !(disabled || readOnly);

  const write = useCallback(
    (color: ColorPickerColor | null, memory: ChannelMemory) => {
      if (!color) {
        return null;
      }
      const space = FORMAT_SPACE[format];
      return formatColor(
        { alpha: alpha ? color.alpha : 1, channels: memory[space], space },
        format
      );
    },
    [alpha, format]
  );

  const commit = useCallback(() => {
    pendingRef.current = false;
    if (valueRef.current !== committedRef.current) {
      committedRef.current = valueRef.current;
      onValueCommit?.(valueRef.current);
    }
  }, [onValueCommit]);

  const emit = useCallback(
    (next: PickerState, options?: UpdateOptions) => {
      stateRef.current = next;
      setState(next);
      if (next.value !== valueRef.current) {
        valueRef.current = next.value;
        onValueChange?.(next.value);
      }
      if (options?.commit) {
        commit();
      } else {
        pendingRef.current = true;
      }
    },
    [commit, onValueChange]
  );

  const update = useCallback(
    (color: ColorPickerColor | null, options?: UpdateOptions) => {
      if (!interactive) {
        return;
      }
      const { memory } = stateRef.current;
      const next = color && {
        ...color,
        alpha: alpha ? clamp(color.alpha, 0, 1) : 1,
      };
      const nextMemory = next ? rememberChannels(next, memory) : memory;
      emit(
        { color: next, memory: nextMemory, value: write(next, nextMemory) },
        options
      );
    },
    [alpha, emit, interactive, write]
  );

  const setValue = useCallback(
    (next: string | null) => {
      if (!next) {
        update(null, { commit: true });
        return;
      }
      const parsed = parseColor(next);
      if (parsed) {
        update(parsed, { commit: true });
      }
    },
    [update]
  );

  const clear = useCallback(() => update(null, { commit: true }), [update]);

  const formatValue = useCallback(
    (target: ColorPickerFormat) => {
      const { color, memory } = state;
      if (!color) {
        return null;
      }
      const space = FORMAT_SPACE[target];
      return formatColor(
        { alpha: color.alpha, channels: memory[space], space },
        target
      );
    },
    [state]
  );

  const copy = useCallback(
    (target?: ColorPickerFormat) => {
      const text = formatValue(target ?? displayFormat);
      if (!(text && navigator.clipboard)) {
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          clearTimeout(copiedTimer.current);
          copiedTimer.current = setTimeout(() => setCopied(false), 1500);
        },
        () => undefined
      );
    },
    [displayFormat, formatValue]
  );

  const getChannels = useCallback(
    (space: ColorPickerColorSpace) => state.memory[space],
    [state.memory]
  );

  // A form reset restores `defaultValue`, unless a listener cancels it.
  const defaultValueRef = useRef(defaultValue);
  useLayoutEffect(() => {
    defaultValueRef.current = defaultValue;
  });
  // biome-ignore lint/correctness/useExhaustiveDependencies: `form` moves the field to another form, so the listener follows it
  useEffect(() => {
    const owner = fieldRef.current?.form;
    if (!owner) {
      return;
    }
    const onReset = (event: Event) => {
      setTimeout(() => {
        if (event.defaultPrevented) {
          return;
        }
        emit(
          createState(defaultValueRef.current, alpha, stateRef.current.memory),
          { commit: true }
        );
      });
    };
    owner.addEventListener("reset", onReset);
    return () => owner.removeEventListener("reset", onReset);
  }, [alpha, emit, form]);

  // A failed `required` check focuses the hidden field; hand it on.
  const focusControl = useCallback(
    () =>
      (triggerRef.current ?? textInputRef.current ?? areaRef.current)?.focus(),
    []
  );

  const context = useMemo<ColorPickerContextValue>(
    () => ({
      alpha,
      anchorRef,
      areaRef,
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      clear,
      color: state.color,
      commit,
      copied,
      copy,
      disabled,
      displayFormat,
      format,
      formatValue,
      getChannels,
      hasInput,
      i18n,
      id,
      interactive,
      invalid,
      open,
      readOnly,
      setDisplayFormat,
      setHasInput,
      setOpen,
      setValue,
      swatches,
      textInputRef,
      triggerRef,
      update,
      value,
    }),
    [
      alpha,
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      clear,
      commit,
      copied,
      copy,
      disabled,
      displayFormat,
      format,
      formatValue,
      getChannels,
      hasInput,
      i18n,
      id,
      interactive,
      invalid,
      open,
      readOnly,
      setOpen,
      setValue,
      state.color,
      swatches,
      update,
      value,
    ]
  );

  return (
    <ColorPickerContext.Provider value={context}>
      <Popover modal="trap-focus" onOpenChange={setOpen} open={open}>
        {children ?? (
          <>
            <ColorPickerTrigger
              className={className}
              placeholder={placeholder}
            />
            <ColorPickerContent />
          </>
        )}
      </Popover>
      <input
        aria-hidden
        className="sr-only"
        data-slot="color-picker-field"
        disabled={disabled}
        form={form}
        name={name}
        onChange={noop}
        onFocus={focusControl}
        ref={mergeRefs(fieldRef, inputRef)}
        required={required}
        tabIndex={-1}
        value={write(state.color, state.memory) ?? ""}
      />
      <span aria-live="polite" className="sr-only" role="status">
        {copied ? i18n.labels.copied : ""}
      </span>
    </ColorPickerContext.Provider>
  );
}

/** The picker's state and actions, for a custom readout or action. */
export function useColorPicker() {
  const context = useColorPickerContext("useColorPicker");
  return {
    clear: context.clear,
    color: context.color,
    format: context.format,
    open: context.open,
    setOpen: context.setOpen,
    setValue: context.setValue,
    value: context.value,
  };
}

/* -------------------------------------------------------------------------- */
/*                              Trigger and value                             */
/* -------------------------------------------------------------------------- */

export function ColorPickerValue({
  className,
  placeholder,
  ...props
}: Omit<React.ComponentProps<"span">, "placeholder"> & {
  placeholder?: React.ReactNode;
}): React.ReactElement {
  const context = useColorPickerContext("ColorPickerValue");
  const formatted = context.formatValue(context.format);
  const text = context.format === "hex" ? formatted?.toUpperCase() : formatted;
  return (
    <span
      className={cn(
        "truncate data-placeholder:text-foreground-muted",
        className
      )}
      data-placeholder={text ? undefined : ""}
      data-slot="color-picker-value"
      {...props}
    >
      {text ?? placeholder ?? context.i18n.labels.placeholder}
    </span>
  );
}

export type ColorPickerTriggerProps = Omit<ButtonProps, "placeholder"> & {
  /** Shown while there is no value. @default labels.placeholder */
  placeholder?: React.ReactNode;
};

export function ColorPickerTrigger({
  className,
  variant = "outline",
  size,
  shape,
  placeholder,
  children,
  id,
  ref,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: ColorPickerTriggerProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerTrigger");
  const triggerId = id ?? context.id;
  const labelledBy = ariaLabelledBy ?? context.ariaLabelledBy;
  const { copy } = context;
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event as never);
      handleCopyShortcut(event, () => copy());
    },
    [copy, onKeyDown]
  );
  return (
    <PopoverTrigger
      aria-describedby={ariaDescribedBy ?? context.ariaDescribedBy}
      aria-invalid={context.invalid || undefined}
      aria-label={ariaLabel ?? context.ariaLabel}
      // Your label, then the trigger's own text, so the value stays in the name.
      aria-labelledby={labelledBy ? joinIds(labelledBy, triggerId) : undefined}
      data-invalid={context.invalid ? "" : undefined}
      data-placeholder={context.color ? undefined : ""}
      data-slot="color-picker-trigger"
      disabled={context.disabled}
      id={triggerId}
      onKeyDown={handleKeyDown}
      ref={mergeRefs(context.triggerRef, ref as React.Ref<HTMLButtonElement>)}
      render={
        <Button
          className={cn(
            "justify-start font-normal data-invalid:border-destructive/30",
            className
          )}
          shape={shape}
          size={size}
          variant={variant}
        />
      }
      {...(props as React.ComponentProps<typeof PopoverTrigger>)}
    >
      {children ?? (
        <>
          <ColorPickerSwatch />
          <ColorPickerValue placeholder={placeholder} />
          <Icon className="ms-auto opacity-60" icon={ArrowDown01Icon} />
        </>
      )}
    </PopoverTrigger>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Input                                   */
/* -------------------------------------------------------------------------- */

export type ColorPickerInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue"
>;

export function ColorPickerInput({
  className,
  id,
  placeholder,
  ref,
  onBlur,
  onChange,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: ColorPickerInputProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerInput");
  const { setHasInput } = context;
  useLayoutEffect(() => {
    setHasInput(true);
    return () => setHasInput(false);
  }, [setHasInput]);

  const formatted = context.formatValue(context.format);
  const text =
    formatted && context.format === "hex" ? formatted.toUpperCase() : formatted;
  const [draft, setDraft] = useState<string | null>(null);

  const { copy, setOpen, textInputRef, update } = context;
  const read = useCallback(() => {
    if (draft === null) {
      return;
    }
    setDraft(null);
    const trimmed = draft.trim();
    if (!trimmed) {
      update(null, { commit: true });
      return;
    }
    if (trimmed === text) {
      return;
    }
    const color = resolveCssColor(trimmed, textInputRef.current);
    if (color) {
      update(color, { commit: true });
    }
  }, [draft, text, textInputRef, update]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      read();
    },
    [onBlur, read]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      setDraft(event.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Enter") {
        // Flush, so a form submitted by this Enter sends the new value.
        flushSync(read);
      } else if (event.key === "Escape" && draft !== null && draft !== text) {
        event.stopPropagation();
        setDraft(null);
      } else if (event.altKey && event.key === "ArrowDown") {
        event.preventDefault();
        read();
        setOpen(true);
      } else {
        handleCopyShortcut(event, () => copy());
      }
    },
    [copy, draft, onKeyDown, read, setOpen, text]
  );

  return (
    <InputGroup
      className={cn("data-disabled:opacity-50", className)}
      data-disabled={context.disabled ? "" : undefined}
      data-slot="color-picker-input"
      ref={context.anchorRef}
    >
      <InputGroupAddon>
        <PopoverTrigger
          aria-label={context.i18n.labels.openPicker}
          data-slot="color-picker-input-trigger"
          disabled={context.disabled}
          render={<Button size="icon-xs" variant="ghost" />}
        >
          <ColorPickerSwatch className="size-4" />
        </PopoverTrigger>
      </InputGroupAddon>
      <input
        aria-describedby={joinIds(context.ariaDescribedBy, ariaDescribedBy)}
        aria-invalid={context.invalid || undefined}
        aria-label={ariaLabel ?? context.ariaLabel}
        aria-labelledby={ariaLabelledBy ?? context.ariaLabelledBy}
        autoComplete="off"
        className="h-7.5 w-full min-w-0 bg-transparent px-2 text-sm tabular-nums leading-7.5 outline-none placeholder:text-foreground-muted/70 max-md:text-base"
        data-slot="input"
        disabled={context.disabled}
        id={id ?? context.id}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? context.i18n.labels.placeholder}
        readOnly={context.readOnly}
        ref={mergeRefs(context.textInputRef, ref)}
        spellCheck={false}
        value={draft ?? text ?? ""}
        {...props}
      />
    </InputGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Content, panel                               */
/* -------------------------------------------------------------------------- */

export function ColorPickerContent({
  className,
  align = "start",
  children,
  ...props
}: React.ComponentProps<typeof PopoverPopup>): React.ReactElement {
  const context = useColorPickerContext("ColorPickerContent");
  return (
    <PopoverPopup
      align={align}
      anchor={context.hasInput ? context.anchorRef : undefined}
      aria-label={
        context.ariaLabelledBy
          ? undefined
          : (context.ariaLabel ?? context.i18n.labels.panelLabel)
      }
      aria-labelledby={context.ariaLabelledBy}
      className={cn(
        context.alpha ? "w-96 md:w-84" : "w-72",
        "max-w-[calc(100vw-1rem)]",
        className
      )}
      {...props}
    >
      <ColorPickerContentContext.Provider value>
        {children ?? <ColorPickerPanel />}
      </ColorPickerContentContext.Provider>
    </PopoverPopup>
  );
}

export function ColorPickerPanel({
  className,
  children,
  onKeyDown,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  const context = useColorPickerContext("ColorPickerPanel");
  const inContent = useContext(ColorPickerContentContext);
  const labelled = !inContent && {
    "aria-label": context.ariaLabelledBy
      ? undefined
      : (context.ariaLabel ?? context.i18n.labels.panelLabel),
    "aria-labelledby": context.ariaLabelledBy,
    role: "group",
  };
  const { copy } = context;
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      handleCopyShortcut(event, () => copy());
    },
    [copy, onKeyDown]
  );
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: catches ⌘C from the controls inside
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: see above
    <div
      className={cn("flex min-w-0 flex-col gap-3", className)}
      data-disabled={context.disabled ? "" : undefined}
      data-slot="color-picker-panel"
      onKeyDown={handleKeyDown}
      {...labelled}
      {...props}
    >
      {children ?? (
        <>
          <ColorPickerArea />
          <div className="flex items-center gap-2">
            <ColorPickerEyeDropper />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <ColorPickerSlider channel="hue" />
              {context.alpha ? <ColorPickerSlider channel="alpha" /> : null}
            </div>
            <ColorPickerCopy />
          </div>
          <ColorPickerFields />
          {context.swatches?.length ? (
            <ColorPickerSwatches colors={context.swatches} />
          ) : null}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Area, slider, wheel                           */
/* -------------------------------------------------------------------------- */

interface KeyStep {
  /** Ticks along x: ±1 per arrow, ±10 with Shift, ±Infinity for Home/End. */
  x: number;
  /** Ticks along y, positive upwards: arrows and Page keys. */
  y: number;
}

/**
 * Pointer and keyboard handling for a picking surface. A click focuses it
 * without the keyboard ring; `onEnd` commits once a drag or key press is done.
 */
function useSurface<T extends HTMLElement>({
  context,
  onPick,
  onStep,
  canStart,
}: {
  context: ColorPickerContextValue;
  onPick: (event: React.PointerEvent<T>, rect: DOMRect) => void;
  onStep: (step: KeyStep) => void;
  canStart?: (event: React.PointerEvent<T>, rect: DOMRect) => boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  // Widened, or the linter reads `current` as always `false`.
  const draggingRef = useRef(false as boolean);
  const steppedRef = useRef(false as boolean);
  const pointerFocusRef = useRef(false as boolean);

  const endDrag = () => {
    if (!draggingRef.current) {
      return;
    }
    draggingRef.current = false;
    setDragging(false);
    context.commit();
  };

  const endKeys = () => {
    if (steppedRef.current) {
      steppedRef.current = false;
      context.commit();
    }
  };

  const handlers = {
    onBlur: () => {
      setFocusVisible(false);
      endKeys();
    },
    // A popover opened by a click focuses its first control from code, which
    // the browser does not count as `:focus-visible`.
    onFocus: (event: React.FocusEvent<T>) =>
      setFocusVisible(
        !pointerFocusRef.current &&
          event.currentTarget.matches(":focus-visible")
      ),
    onKeyDown: (event: React.KeyboardEvent<T>) => {
      const size = event.shiftKey ? 10 : 1;
      const steps: Record<string, KeyStep> = {
        ArrowDown: { x: 0, y: -size },
        ArrowLeft: { x: -size, y: 0 },
        ArrowRight: { x: size, y: 0 },
        ArrowUp: { x: 0, y: size },
        End: { x: Number.POSITIVE_INFINITY, y: 0 },
        Home: { x: Number.NEGATIVE_INFINITY, y: 0 },
        PageDown: { x: 0, y: -10 },
        PageUp: { x: 0, y: 10 },
      };
      const step = steps[event.key];
      if (!step || context.disabled) {
        return;
      }
      event.preventDefault();
      setFocusVisible(true);
      if (context.interactive) {
        steppedRef.current = true;
        onStep(step);
      }
    },
    onKeyUp: endKeys,
    onLostPointerCapture: endDrag,
    onPointerCancel: endDrag,
    onPointerDown: (event: React.PointerEvent<T>) => {
      if (context.disabled || event.button !== 0) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      if (canStart && !canStart(event, rect)) {
        return;
      }
      event.preventDefault();
      pointerFocusRef.current = true;
      event.currentTarget.focus({ preventScroll: true });
      pointerFocusRef.current = false;
      setFocusVisible(false);
      if (!context.interactive) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      draggingRef.current = true;
      setDragging(true);
      onPick(event, rect);
    },
    onPointerMove: (event: React.PointerEvent<T>) => {
      if (draggingRef.current) {
        onPick(event, event.currentTarget.getBoundingClientRect());
      }
    },
    onPointerUp: endDrag,
  };

  return { dragging, focusVisible, handlers };
}

function toRatio(value: number, start: number, size: number) {
  return size > 0 ? clamp((value - start) / size, 0, 1) : 0;
}

function stepValue(value: number, ticks: number, step: number, max: number) {
  if (ticks === Number.POSITIVE_INFINITY) {
    return max;
  }
  if (ticks === Number.NEGATIVE_INFINITY) {
    return 0;
  }
  return clamp(value + ticks * step, 0, max);
}

function Thumb({
  className,
  dragging,
  focusVisible,
  style,
  slot,
}: {
  className?: string;
  dragging: boolean;
  focusVisible: boolean;
  slot: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.4),inset_0_0_0_1px_rgb(0_0_0/0.15)] outline-foreground transition-[scale] duration-100 ease-out motion-reduce:transition-none forced-colors:outline-2 forced-colors:outline-[CanvasText]",
        "data-dragging:scale-115 data-focus-visible:outline-2 data-focus-visible:outline-offset-2",
        className
      )}
      data-dragging={dragging ? "" : undefined}
      data-focus-visible={focusVisible ? "" : undefined}
      data-slot={slot}
      style={style}
    />
  );
}

export function ColorPickerArea({
  className,
  style,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  const context = useColorPickerContext("ColorPickerArea");
  const { labels, getColorName } = context.i18n;
  const [hue, saturation, brightness] = context.getChannels("hsv");
  const color = context.color ?? FALLBACK_COLOR;

  const set = (s: number, v: number) =>
    context.update({
      alpha: color.alpha,
      channels: [hue, clamp(s, 0, 100), clamp(v, 0, 100)],
      space: "hsv",
    });

  const { dragging, focusVisible, handlers } = useSurface<HTMLDivElement>({
    context,
    onPick: (event, rect) =>
      set(
        toRatio(event.clientX, rect.left, rect.width) * 100,
        (1 - toRatio(event.clientY, rect.top, rect.height)) * 100
      ),
    onStep: ({ x, y }) =>
      set(stepValue(saturation, x, 1, 100), clamp(brightness + y, 0, 100)),
  });

  return (
    <div
      aria-disabled={context.disabled || undefined}
      aria-label={labels.area}
      aria-readonly={context.readOnly || undefined}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(saturation)}
      aria-valuetext={`${labels.saturation} ${Math.round(saturation)}%, ${labels.brightness} ${Math.round(brightness)}%, ${getColorName({ ...color, alpha: 1 })}`}
      className={cn(
        "relative h-40 w-full shrink-0 touch-none select-none rounded-md outline-none forced-color-adjust-none",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      data-dragging={dragging ? "" : undefined}
      data-slot="color-picker-area"
      dir="ltr"
      ref={context.areaRef}
      role="slider"
      style={{
        backgroundColor: `hsl(${hue} 100% 50%)`,
        backgroundImage:
          "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.1)",
        ...style,
      }}
      tabIndex={context.disabled ? -1 : 0}
      {...handlers}
      {...props}
    >
      <Thumb
        dragging={dragging}
        focusVisible={focusVisible}
        slot="color-picker-area-thumb"
        style={{
          backgroundColor: toCssColor(color, true),
          left: `${saturation}%`,
          top: `${100 - brightness}%`,
        }}
      />
    </div>
  );
}

/** The track's gradient: what the channel can reach from the current color. */
function getTrackGradient(
  space: ColorPickerColorSpace,
  info: ChannelInfo,
  channels: Channels,
  channel: ColorPickerChannel
) {
  const base = [...channels] as Channels;
  if (channel === "hue" && space !== "oklch") {
    // A hue track shows the pure hues, or a gray would show a gray track.
    base[1] = 100;
    base[2] = space === "hsl" ? 50 : 100;
  } else if (channel === "hue" && base[1] < 0.03) {
    base[1] = 0.1;
  }
  let count = 2;
  if (space === "oklch") {
    count = 25;
  } else if (channel === "hue") {
    count = 7;
  } else if (channel === "lightness") {
    count = 3;
  }
  const stops = Array.from({ length: count }, (_, index) => {
    const at = index / (count - 1);
    const next = [...base] as Channels;
    next[info.index] = at * info.max;
    return formatColor(
      {
        alpha: 1,
        channels: toRgbChannels({ alpha: 1, channels: next, space }),
        space: "rgb",
      },
      "hex"
    );
  });
  return stops.join(", ");
}

function formatSliderValue(
  channel: ColorPickerChannel,
  space: ColorPickerColorSpace | null,
  value: number
) {
  if (channel === "chroma") {
    return formatNumber(value, 3);
  }
  return space === "rgb" ? String(Math.round(value)) : `${Math.round(value)}%`;
}

export type ColorPickerSliderProps = React.ComponentProps<"div"> & {
  /** The channel the slider moves. */
  channel: ColorPickerChannel;
  /** The space the channel belongs to. @default per channel */
  colorSpace?: ColorPickerColorSpace;
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
};

export function ColorPickerSlider({
  channel,
  colorSpace,
  orientation = "horizontal",
  className,
  style,
  ...props
}: ColorPickerSliderProps): React.ReactElement | null {
  const context = useColorPickerContext("ColorPickerSlider");
  const { labels, getColorName } = context.i18n;
  const { info, space } = resolveChannel(channel, colorSpace);
  const vertical = orientation === "vertical";
  const color = context.color ?? FALLBACK_COLOR;
  const channels = space ? context.getChannels(space) : color.channels;
  const value = space ? channels[info.index] : color.alpha * 100;

  const set = (next: number) => {
    const clamped = clamp(next, 0, info.max);
    if (!space) {
      context.update({ ...color, alpha: clamped / 100 });
      return;
    }
    const nextChannels = [...channels] as Channels;
    nextChannels[info.index] = clamped;
    context.update({ alpha: color.alpha, channels: nextChannels, space });
  };

  const { dragging, focusVisible, handlers } = useSurface<HTMLDivElement>({
    context,
    onPick: (event, rect) =>
      set(
        (vertical
          ? 1 - toRatio(event.clientY, rect.top, rect.height)
          : toRatio(event.clientX, rect.left, rect.width)) * info.max
      ),
    onStep: ({ x, y }) => set(stepValue(value, x + y, info.step, info.max)),
  });

  if (!(space || context.alpha)) {
    return null;
  }

  const position = (value / info.max) * 100;
  const direction = vertical ? "to top" : "to right";
  let background: string;
  let thumbColor: string;
  if (space) {
    background = `linear-gradient(${direction}, ${getTrackGradient(space, info, channels, channel)})`;
    thumbColor =
      channel === "hue" && space !== "oklch"
        ? `hsl(${value} 100% 50%)`
        : toCssColor(color, true);
  } else {
    const opaque = toCssColor(color, true);
    background = `linear-gradient(${direction}, transparent, ${opaque}), ${CHECKERBOARD}`;
    thumbColor = toCssColor(color);
  }

  const label = labels[channel];
  const valueText =
    channel === "hue"
      ? `${Math.round(value)}°, ${getColorName({ ...color, alpha: 1 })}`
      : formatSliderValue(channel, space, value);

  return (
    <div
      aria-disabled={context.disabled || undefined}
      aria-label={label}
      aria-orientation={orientation}
      aria-readonly={context.readOnly || undefined}
      aria-valuemax={info.max}
      aria-valuemin={0}
      aria-valuenow={round(value, info.digits)}
      aria-valuetext={valueText}
      className={cn(
        "relative shrink-0 touch-none select-none rounded-full outline-none forced-color-adjust-none",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        vertical ? "h-40 w-3" : "h-3 w-full",
        className
      )}
      data-channel={channel}
      data-dragging={dragging ? "" : undefined}
      data-orientation={orientation}
      data-slot="color-picker-slider"
      dir="ltr"
      role="slider"
      style={{
        background,
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.1)",
        ...style,
      }}
      tabIndex={context.disabled ? -1 : 0}
      {...handlers}
      {...props}
    >
      <Thumb
        dragging={dragging}
        focusVisible={focusVisible}
        slot="color-picker-slider-thumb"
        style={
          vertical
            ? {
                backgroundColor: thumbColor,
                left: "50%",
                top: `${100 - position}%`,
              }
            : { backgroundColor: thumbColor, left: `${position}%`, top: "50%" }
        }
      />
    </div>
  );
}

export function ColorPickerWheel({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  const context = useColorPickerContext("ColorPickerWheel");
  const { labels, getColorName } = context.i18n;
  const [hue, saturation, brightness] = context.getChannels("hsv");
  const color = context.color ?? FALLBACK_COLOR;
  const holeRef = useRef<HTMLDivElement>(null);

  const set = (next: number) =>
    context.update({
      alpha: color.alpha,
      channels: [next, saturation, brightness],
      space: "hsv",
    });

  const { dragging, focusVisible, handlers } = useSurface<HTMLDivElement>({
    // Only the ring picks; the hole is for the children.
    canStart: (event, rect) => {
      const hole = holeRef.current?.getBoundingClientRect();
      const radius = hole ? hole.width / 2 : 0;
      return (
        Math.hypot(
          event.clientX - (rect.left + rect.width / 2),
          event.clientY - (rect.top + rect.height / 2)
        ) >= radius
      );
    },
    context,
    onPick: (event, rect) => {
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      set(wrapHue((Math.atan2(x, -y) * 180) / Math.PI));
    },
    onStep: ({ x, y }) => {
      const ticks = x + y;
      if (ticks === Number.POSITIVE_INFINITY) {
        set(359);
      } else if (ticks === Number.NEGATIVE_INFINITY) {
        set(0);
      } else {
        set(wrapHue(hue + ticks));
      }
    },
  });

  const angle = (hue * Math.PI) / 180;
  return (
    <div
      className={cn(
        "relative size-48 shrink-0 select-none [--color-picker-wheel-thickness:--spacing(4)]",
        className
      )}
      data-slot="color-picker-wheel"
      style={style}
      {...props}
    >
      <div
        aria-disabled={context.disabled || undefined}
        aria-label={labels.hue}
        aria-readonly={context.readOnly || undefined}
        aria-valuemax={360}
        aria-valuemin={0}
        aria-valuenow={Math.round(hue)}
        aria-valuetext={`${Math.round(hue)}°, ${getColorName({ ...color, alpha: 1 })}`}
        className="absolute inset-0 touch-none rounded-full outline-none forced-color-adjust-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
        data-dragging={dragging ? "" : undefined}
        data-slot="color-picker-wheel-track"
        dir="ltr"
        role="slider"
        tabIndex={context.disabled ? -1 : 0}
        {...handlers}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - var(--color-picker-wheel-thickness)), #000 calc(100% - var(--color-picker-wheel-thickness) + 0.5px))",
          }}
        />
        <Thumb
          dragging={dragging}
          focusVisible={focusVisible}
          slot="color-picker-wheel-thumb"
          style={{
            backgroundColor: `hsl(${hue} 100% 50%)`,
            left: `calc(50% + ${Math.sin(angle)} * (50% - var(--color-picker-wheel-thickness) / 2))`,
            top: `calc(50% - ${Math.cos(angle)} * (50% - var(--color-picker-wheel-thickness) / 2))`,
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-(--color-picker-wheel-thickness) flex items-center justify-center rounded-full"
        ref={holeRef}
      >
        {children ? (
          // The square inscribed in the hole, with a little air.
          <div className="pointer-events-auto flex size-[calc(70.71%-0.5rem)] items-center justify-center">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Fields                                   */
/* -------------------------------------------------------------------------- */

const FORMAT_FIELDS: Record<
  ColorPickerFormat,
  { channel: ColorPickerChannel | "hex"; colorSpace?: ColorPickerColorSpace }[]
> = {
  hex: [{ channel: "hex" }],
  hsb: [
    { channel: "hue", colorSpace: "hsv" },
    { channel: "saturation", colorSpace: "hsv" },
    { channel: "brightness", colorSpace: "hsv" },
  ],
  hsl: [
    { channel: "hue", colorSpace: "hsl" },
    { channel: "saturation", colorSpace: "hsl" },
    { channel: "lightness", colorSpace: "hsl" },
  ],
  oklch: [
    { channel: "lightness", colorSpace: "oklch" },
    { channel: "chroma", colorSpace: "oklch" },
    { channel: "hue", colorSpace: "oklch" },
  ],
  rgb: [
    { channel: "red", colorSpace: "rgb" },
    { channel: "green", colorSpace: "rgb" },
    { channel: "blue", colorSpace: "rgb" },
  ],
};

export type ColorPickerFieldsProps = Omit<
  React.ComponentProps<typeof InputGroup>,
  "defaultValue"
> & {
  /** The shown format, uncontrolled. @default root `format` */
  defaultFormat?: ColorPickerFormat;
  /** The shown format, controlled. */
  format?: ColorPickerFormat;
  /** The menu's formats. 1 format hides the menu. @default all 5 */
  formats?: ColorPickerFormat[];
  /** Fires when the menu changes the shown format. */
  onFormatChange?: (format: ColorPickerFormat) => void;
};

export function ColorPickerFields({
  format: formatProp,
  defaultFormat,
  onFormatChange,
  formats = COLOR_PICKER_FORMATS,
  className,
  ...props
}: ColorPickerFieldsProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerFields");
  const { setDisplayFormat } = context;
  const [formatState, setFormatState] = useState(
    defaultFormat ??
      (formats.includes(context.format) ? context.format : formats[0])
  );
  const shown = formatProp ?? formatState ?? "hex";

  useEffect(() => {
    setDisplayFormat(shown);
    return () => setDisplayFormat(null);
  }, [setDisplayFormat, shown]);

  const handleFormatChange = useCallback(
    (next: ColorPickerFormat) => {
      setFormatState(next);
      onFormatChange?.(next);
    },
    [onFormatChange]
  );

  return (
    <InputGroup
      className={cn("data-disabled:opacity-50", className)}
      data-disabled={context.disabled ? "" : undefined}
      data-slot="color-picker-fields"
      dir="ltr"
      {...props}
    >
      {formats.length > 1 ? (
        <>
          <Menu>
            <MenuTrigger
              aria-label={`${context.i18n.labels.format}, ${FORMAT_LABELS[shown]}`}
              className="h-7.5 shrink-0 rounded-s-[calc(var(--radius-lg)-1px)] rounded-e-none px-2 text-xs"
              data-slot="color-picker-format-trigger"
              disabled={context.disabled}
              render={<Button size="xs" variant="ghost" />}
            >
              {FORMAT_LABELS[shown]}
              <Icon className="opacity-60" icon={ArrowDown01Icon} />
            </MenuTrigger>
            <MenuPopup align="start">
              <MenuRadioGroup onValueChange={handleFormatChange} value={shown}>
                {formats.map((format) => (
                  <MenuRadioItem key={format} value={format}>
                    <span className="flex items-baseline gap-3">
                      <span className="w-12 font-medium text-xs">
                        {FORMAT_LABELS[format]}
                      </span>
                      <span className="text-foreground-muted text-xs tabular-nums">
                        {context.formatValue(format)}
                      </span>
                    </span>
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
            </MenuPopup>
          </Menu>
          <Separator orientation="vertical" />
        </>
      ) : null}
      {FORMAT_FIELDS[shown].map(({ channel, colorSpace }, index) => (
        <Fragment key={channel}>
          {index > 0 ? <Separator orientation="vertical" /> : null}
          <ColorPickerChannelInput
            channel={channel}
            className="flex-1"
            colorSpace={colorSpace}
          />
        </Fragment>
      ))}
      {context.alpha ? (
        <>
          <Separator orientation="vertical" />
          <ColorPickerChannelInput channel="alpha" />
        </>
      ) : null}
    </InputGroup>
  );
}

export type ColorPickerChannelInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue"
> & {
  /** A channel, or `"hex"` for the 6 hex digits. */
  channel: ColorPickerChannel | "hex";
  /** The space the channel belongs to. @default per channel */
  colorSpace?: ColorPickerColorSpace;
};

const HEX_INFO: ChannelInfo = { digits: 0, index: 0, max: 0, step: 0 };

export function ColorPickerChannelInput({
  channel,
  colorSpace,
  className,
  style,
  onBlur,
  onChange,
  onKeyDown,
  ...props
}: ColorPickerChannelInputProps): React.ReactElement | null {
  const context = useColorPickerContext("ColorPickerChannelInput");
  const { labels } = context.i18n;
  const [draft, setDraft] = useState<string | null>(null);

  const hex = channel === "hex";
  const { info, space } = hex
    ? { info: HEX_INFO, space: "rgb" as const }
    : resolveChannel(channel, colorSpace);
  const { color } = context;
  const base = color ?? FALLBACK_COLOR;
  const channels = space ? context.getChannels(space) : base.channels;
  const value = space ? channels[info.index] : base.alpha * 100;

  let text = "";
  if (color && hex) {
    text = formatColor({ ...color, alpha: 1 }, "hex")
      .slice(1)
      .toUpperCase();
  } else if (color) {
    text = formatChannelText(channel, info, value);
  }

  const { interactive, update } = context;
  const set = useCallback(
    (next: number) => {
      if (!space) {
        update({ ...base, alpha: next / 100 }, { commit: true });
        return;
      }
      const nextChannels = [...channels] as Channels;
      nextChannels[info.index] = next;
      update(
        { alpha: base.alpha, channels: nextChannels, space },
        { commit: true }
      );
    },
    [base, channels, info.index, space, update]
  );

  const read = useCallback(() => {
    if (draft === null) {
      return;
    }
    setDraft(null);
    if (draft.trim() === text) {
      return;
    }
    if (hex) {
      const digits = draft.trim().match(HEX_PATTERN)?.[1];
      if (digits) {
        const parsed = parseHex(digits);
        update(
          {
            ...parsed,
            alpha:
              digits.length === 4 || digits.length === 8
                ? parsed.alpha
                : base.alpha,
          },
          { commit: true }
        );
      }
      return;
    }
    const next = parseChannelText(draft, channel, info);
    if (next !== null) {
      set(next);
    }
  }, [base.alpha, channel, draft, hex, info, set, text, update]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      read();
    },
    [onBlur, read]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      setDraft(event.target.value);
    },
    [onChange]
  );

  const step = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const ticks: Record<string, number> = {
        ArrowDown: event.shiftKey ? -10 : -1,
        ArrowUp: event.shiftKey ? 10 : 1,
        PageDown: -10,
        PageUp: 10,
      };
      if (!(event.key in ticks)) {
        return;
      }
      event.preventDefault();
      setDraft(null);
      const next = value + (ticks[event.key] ?? 0) * info.step;
      set(channel === "hue" ? wrapHue(next) : clamp(next, 0, info.max));
    },
    [channel, info.max, info.step, set, value]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Enter") {
        flushSync(read);
        return;
      }
      if (event.key === "Escape") {
        if (draft !== null && draft !== text) {
          event.stopPropagation();
          setDraft(null);
        }
        return;
      }
      if (interactive && !hex) {
        step(event);
      }
    },
    [draft, hex, interactive, onKeyDown, read, step, text]
  );

  if (channel === "alpha" && !context.alpha) {
    return null;
  }

  const label = hex ? labels.hex : labels[channel];
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: the range goes with role="spinbutton", set for every channel but hex
    <input
      aria-invalid={context.invalid || undefined}
      aria-label={label}
      aria-valuemax={hex ? undefined : info.max}
      aria-valuemin={hex ? undefined : 0}
      aria-valuenow={hex || !color ? undefined : round(value, info.digits)}
      aria-valuetext={hex || !color ? undefined : text}
      autoComplete="off"
      className={cn(
        "h-7.5 w-[calc(var(--color-picker-input-width)+--spacing(4))] min-w-0 bg-transparent px-2 text-sm tabular-nums leading-7.5 outline-none max-md:text-base",
        className
      )}
      data-channel={channel}
      data-slot="color-picker-channel-input"
      dir="ltr"
      disabled={context.disabled}
      inputMode={hex ? "text" : "decimal"}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      readOnly={context.readOnly}
      role={hex ? undefined : "spinbutton"}
      spellCheck={false}
      style={
        {
          "--color-picker-input-width": `${getWidestText(channel, info)}ch`,
          ...style,
        } as React.CSSProperties
      }
      value={draft ?? text}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Swatches                                  */
/* -------------------------------------------------------------------------- */

export type ColorPickerSwatchProps = React.ComponentProps<"span"> & {
  /** The color to show. @default picker's value */
  color?: string | null;
  /** `square` follows each style's radius. @default "square" */
  shape?: "square" | "circle";
};

export function ColorPickerSwatch({
  color: colorProp,
  shape = "square",
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: ColorPickerSwatchProps): React.ReactElement {
  const context = useContext(ColorPickerContext);
  const color =
    colorProp === undefined ? (context?.color ?? null) : parseColor(colorProp);
  let background =
    "linear-gradient(to top right, transparent calc(50% - 0.75px), var(--color-foreground-muted) calc(50% - 0.75px), var(--color-foreground-muted) calc(50% + 0.75px), transparent calc(50% + 0.75px))";
  if (color) {
    background = toChipBackground(color);
  }
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: with a label it is role="img"
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(
        "inline-block size-5 shrink-0 forced-color-adjust-none",
        shape === "circle" ? "rounded-full" : "rounded-sm",
        className
      )}
      data-empty={color ? undefined : ""}
      data-slot="color-picker-swatch"
      role={ariaLabel ? "img" : undefined}
      style={{
        background,
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)",
        ...style,
      }}
      {...props}
    />
  );
}

interface SwatchesContextValue {
  active: string | null;
  baseId: string;
  pick: (value: string, id: string) => void;
  shape: "square" | "circle";
}

const SwatchesContext = createContext<SwatchesContextValue | null>(null);

function getOptions(list: HTMLElement) {
  return Array.from(
    list.querySelectorAll<HTMLElement>(
      '[role="option"]:not([aria-disabled="true"])'
    )
  );
}

/** Two colors match when they write the same hex, alpha included. */
function sameColor(a: ColorPickerColor | null, b: ColorPickerColor | null) {
  return !!(a && b) && formatColor(a, "hex") === formatColor(b, "hex");
}

export type ColorPickerSwatchesProps = React.ComponentProps<"div"> & {
  /** The presets. Children replace them. */
  colors?: (string | { value: string; label?: string })[];
  /** `square` follows each style's radius. @default "square" */
  shape?: "square" | "circle";
};

export function ColorPickerSwatches({
  colors,
  shape = "square",
  className,
  children,
  style,
  onKeyDown,
  onFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ColorPickerSwatchesProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerSwatches");
  const baseId = useId();
  const [active, setActive] = useState<string | null>(null);

  const swatches = useMemo<SwatchesContextValue>(
    () => ({
      active,
      baseId,
      pick: (value, id) => {
        setActive(id);
        const parsed = parseColor(value);
        if (parsed) {
          context.update(parsed, { commit: true });
        }
      },
      shape,
    }),
    [active, baseId, context, shape]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
      if (!active && event.target === event.currentTarget) {
        const selected = getOptions(event.currentTarget).find((option) =>
          option.hasAttribute("data-selected")
        );
        if (selected) {
          setActive(selected.id);
        }
      }
    },
    [active, onFocus]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      const list = getOptions(event.currentTarget);
      const index = list.findIndex((item) => item.id === active);
      const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
      let next = index;
      switch (event.key) {
        case "ArrowRight":
          next = rtl ? index - 1 : index + 1;
          break;
        case "ArrowLeft":
          next = rtl ? index + 1 : index - 1;
          break;
        case "ArrowDown":
          next = index + 1;
          break;
        case "ArrowUp":
          next = index - 1;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = list.length - 1;
          break;
        case "Enter":
        case " ": {
          event.preventDefault();
          list[index]?.click();
          return;
        }
        default:
          return;
      }
      event.preventDefault();
      if (index === -1 && next < 0) {
        next = list.length - 1;
      }
      const option = list[clamp(next, 0, list.length - 1)];
      if (option) {
        setActive(option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    },
    [active, onKeyDown]
  );

  return (
    <SwatchesContext.Provider value={swatches}>
      <div
        aria-activedescendant={active ?? undefined}
        aria-disabled={context.disabled || undefined}
        aria-label={
          ariaLabelledBy
            ? undefined
            : (ariaLabel ?? context.i18n.labels.swatches)
        }
        aria-labelledby={ariaLabelledBy}
        aria-orientation="horizontal"
        aria-readonly={context.readOnly || undefined}
        className={cn(
          "group/swatches grid grid-cols-[repeat(auto-fill,var(--color-picker-swatch-size))] justify-between gap-1.5 rounded-md outline-none [--color-picker-swatch-size:--spacing(6)]",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        data-empty={active ? undefined : ""}
        data-slot="color-picker-swatches"
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        role="listbox"
        style={style}
        tabIndex={context.disabled ? -1 : 0}
        {...props}
      >
        {children ??
          colors?.map((item) => {
            const option = typeof item === "string" ? { value: item } : item;
            return (
              <ColorPickerSwatchItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            );
          })}
      </div>
    </SwatchesContext.Provider>
  );
}

export type ColorPickerSwatchItemProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  disabled?: boolean;
  /** Read out instead of the generated color name. */
  label?: string;
  /** Any color `parseColor` reads. */
  value: string;
};

export function ColorPickerSwatchItem({
  value,
  label,
  disabled = false,
  className,
  style,
  onClick,
  ...props
}: ColorPickerSwatchItemProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerSwatchItem");
  const swatches = useContext(SwatchesContext);
  const color = useMemo(() => parseColor(value), [value]);
  const id = `${swatches?.baseId}-${value.replace(/[^\w-]/g, "")}`;
  const pick = swatches?.pick;
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (!(disabled || event.defaultPrevented)) {
        pick?.(value, id);
      }
    },
    [disabled, id, onClick, pick, value]
  );
  if (!swatches) {
    throw new Error(
      "<ColorPickerSwatchItem> must be used within <ColorPickerSwatches>."
    );
  }
  const selected = sameColor(color, context.color);
  const isActive = swatches.active === id;
  return (
    // Options take no focus; the listbox points at them.
    // biome-ignore lint/a11y/useKeyWithClickEvents: the listbox handles keys
    // biome-ignore lint/a11y/useFocusableInteractive: see above
    <div
      aria-disabled={disabled || undefined}
      aria-label={label ?? (color ? context.i18n.getColorName(color) : value)}
      aria-selected={selected}
      className={cn(
        "relative flex size-(--color-picker-swatch-size) cursor-pointer items-center justify-center forced-color-adjust-none",
        "outline-foreground outline-offset-2 group-focus-visible/swatches:data-active:outline-2",
        "aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
        swatches.shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      data-active={isActive ? "" : undefined}
      data-selected={selected ? "" : undefined}
      data-slot="color-picker-swatch-item"
      id={id}
      onClick={handleClick}
      role="option"
      style={{
        background: color ? toChipBackground(color) : undefined,
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)",
        ...style,
      }}
      {...props}
    >
      {selected && color ? (
        <Icon
          aria-hidden
          className="size-3.5"
          color={getCheckColor(color)}
          icon={Tick02Icon}
          strokeWidth={2.5}
        />
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Actions                                  */
/* -------------------------------------------------------------------------- */

interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperInstance {
  open: () => Promise<EyeDropperResult>;
}
declare global {
  interface Window {
    EyeDropper?: new () => EyeDropperInstance;
  }
}

const subscribeNothing = () => noop;

export function ColorPickerEyeDropper({
  variant = "ghost",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: ButtonProps): React.ReactElement | null {
  const context = useColorPickerContext("ColorPickerEyeDropper");
  const supported = useSyncExternalStore(
    subscribeNothing,
    () => typeof window.EyeDropper === "function",
    () => false
  );
  const { color, update } = context;
  const handleClick = useCallback(
    (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>) => {
      onClick?.(event);
      const { EyeDropper } = window;
      if (!EyeDropper || event.defaultPrevented) {
        return;
      }
      new EyeDropper().open().then(
        ({ sRGBHex }) => {
          const parsed = parseColor(sRGBHex);
          if (parsed) {
            update({ ...parsed, alpha: color?.alpha ?? 1 }, { commit: true });
          }
        },
        // Escape cancels the dropper; nothing to do.
        noop
      );
    },
    [color?.alpha, onClick, update]
  );
  if (!supported) {
    return null;
  }
  return (
    <Button
      aria-label={context.i18n.labels.eyeDropper}
      data-slot="color-picker-eye-dropper"
      disabled={!context.interactive}
      onClick={handleClick}
      size={size}
      title={context.i18n.labels.eyeDropper}
      variant={variant}
      {...props}
    >
      {children ?? <Icon icon={ColorPickerIcon} />}
    </Button>
  );
}

export type ColorPickerCopyProps = ButtonProps & {
  /** The format to copy. @default the format on screen */
  format?: ColorPickerFormat;
};

export function ColorPickerCopy({
  format,
  variant = "ghost",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: ColorPickerCopyProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerCopy");
  const { labels } = context.i18n;
  const { copy } = context;
  const handleClick = useCallback(
    (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        copy(format);
      }
    },
    [copy, format, onClick]
  );
  return (
    <Button
      aria-label={context.copied ? labels.copied : labels.copy}
      data-copied={context.copied ? "" : undefined}
      data-slot="color-picker-copy"
      disabled={context.disabled || !context.color}
      onClick={handleClick}
      size={size}
      title={labels.copy}
      variant={variant}
      {...props}
    >
      {children ?? <Icon icon={context.copied ? Tick02Icon : Copy01Icon} />}
    </Button>
  );
}

export function ColorPickerClear({
  variant = "ghost",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: ButtonProps): React.ReactElement {
  const context = useColorPickerContext("ColorPickerClear");
  const { clear } = context;
  const handleClick = useCallback(
    (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement>>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        clear();
      }
    },
    [clear, onClick]
  );
  return (
    <Button
      aria-label={context.i18n.labels.clear}
      data-slot="color-picker-clear"
      disabled={!(context.interactive && context.color)}
      onClick={handleClick}
      size={size}
      title={context.i18n.labels.clear}
      variant={variant}
      {...props}
    >
      {children ?? <Icon icon={Cancel01Icon} />}
    </Button>
  );
}
