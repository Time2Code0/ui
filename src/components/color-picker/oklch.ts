/**
 * OKLab / OKLCh helpers for the color picker (Björn Ottosson matrices).
 * Ported from bklit-ui's studio color picker.
 */

export interface Oklch {
  c: number;
  h: number;
  l: number;
}

/** Picker state in OKLCh, alpha 0–1. */
export interface OklchPickerState extends Oklch {
  alpha: number;
}

export interface SrgbBytes {
  b: number;
  g: number;
  r: number;
}

/** Right edge of the chroma axis; covers the sRGB / P3 gamut. */
export const OKLCH_PICKER_CHROMA_MAX = 0.4;

type Mat3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

const LMS_TO_OKLAB: Mat3 = [
  [0.210_454_255_3, 0.793_617_785, -0.004_072_046_8],
  [1.977_998_495_1, -2.428_592_205, 0.450_593_709_9],
  [0.025_904_037_1, 0.782_771_766_2, -0.808_675_766],
];

const OKLAB_TO_LMS_ROOT: Mat3 = [
  [1, 0.396_337_777_4, 0.215_803_757_3],
  [1, -0.105_561_345_8, -0.063_854_172_8],
  [1, -0.089_484_177_5, -1.291_485_548],
];

const LINEAR_RGB_TO_LMS: Mat3 = [
  [0.412_221_470_8, 0.536_332_536_3, 0.051_445_992_9],
  [0.211_903_498_2, 0.680_699_545_1, 0.107_396_956_6],
  [0.088_302_461_9, 0.281_718_837_6, 0.629_978_700_5],
];

const LMS_TO_LINEAR_RGB: Mat3 = [
  [4.076_741_662_1, -3.307_711_591_3, 0.230_969_929_2],
  [-1.268_438_004_6, 2.609_757_401_1, -0.341_319_396_5],
  [-0.004_196_086_3, -0.703_418_614_7, 1.707_614_701],
];

function mat3(m: Mat3, a: number, b: number, c: number) {
  return [
    m[0][0] * a + m[0][1] * b + m[0][2] * c,
    m[1][0] * a + m[1][1] * b + m[1][2] * c,
    m[2][0] * a + m[2][1] * b + m[2][2] * c,
  ] as const;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function srgbChannelToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.040_45
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function linearToSrgbChannel(linear: number) {
  const encoded =
    linear <= 0.003_130_8
      ? 12.92 * linear
      : 1.055 * linear ** (1 / 2.4) - 0.055;
  return Math.round(clamp(encoded * 255, 0, 255));
}

export function srgbBytesToOklch(r: number, g: number, b: number): Oklch {
  const [lms0, lms1, lms2] = mat3(
    LINEAR_RGB_TO_LMS,
    srgbChannelToLinear(r),
    srgbChannelToLinear(g),
    srgbChannelToLinear(b)
  );
  const [l, labA, labB] = mat3(
    LMS_TO_OKLAB,
    Math.cbrt(lms0),
    Math.cbrt(lms1),
    Math.cbrt(lms2)
  );
  const h = (Math.atan2(labB, labA) * 180) / Math.PI;
  return { c: Math.hypot(labA, labB), h: h < 0 ? h + 360 : h, l };
}

/** Converts to sRGB, clipping out-of-gamut channels. */
export function oklchToSrgbBytes(l: number, c: number, h: number): SrgbBytes {
  const hueRad = (h * Math.PI) / 180;
  const [lRoot, mRoot, sRoot] = mat3(
    OKLAB_TO_LMS_ROOT,
    l,
    c * Math.cos(hueRad),
    c * Math.sin(hueRad)
  );
  const [r, g, b] = mat3(LMS_TO_LINEAR_RGB, lRoot ** 3, mRoot ** 3, sRoot ** 3);
  return {
    b: linearToSrgbChannel(b),
    g: linearToSrgbChannel(g),
    r: linearToSrgbChannel(r),
  };
}

export function clampPickerState(state: OklchPickerState): OklchPickerState {
  return {
    alpha: clamp(state.alpha, 0, 1),
    c: clamp(state.c, 0, OKLCH_PICKER_CHROMA_MAX),
    // Clamp rather than wrap so the thumb stays put at the right track edge.
    h: clamp(state.h, 0, 360),
    l: clamp(state.l, 0, 1),
  };
}

function formatComponent(value: number, digits = 3) {
  return Number(value.toFixed(digits)).toString();
}

/** `L C H` without the `oklch()` wrapper or alpha, e.g. for text fields. */
export function formatOklchBody({ l, c, h }: Oklch, hueDigits = 3) {
  return `${formatComponent(l)} ${formatComponent(c)} ${formatComponent(h, hueDigits)}`;
}

export function formatOklch(state: OklchPickerState) {
  const body = formatOklchBody(state);
  return state.alpha >= 0.999
    ? `oklch(${body})`
    : `oklch(${body} / ${formatComponent(state.alpha, 2)})`;
}

/** sRGB preview of a picker state for swatches and thumbs. */
export function pickerStateToCss(state: OklchPickerState) {
  const { r, g, b } = oklchToSrgbBytes(state.l, state.c, state.h);
  return state.alpha >= 0.999
    ? `rgb(${r} ${g} ${b})`
    : `rgb(${r} ${g} ${b} / ${state.alpha})`;
}

const NUMBER = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?`;
const OKLCH_RE = new RegExp(
  String.raw`^(?:oklch\(\s*)?(${NUMBER}%?)\s+(${NUMBER}%?)\s+(${NUMBER}(?:deg)?|none)\s*(?:\/\s*(${NUMBER}%?)\s*)?\)?$`,
  "i"
);
const HEX_RE = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_RE = new RegExp(
  String.raw`^rgba?\(\s*(${NUMBER})[\s,]+(${NUMBER})[\s,]+(${NUMBER})\s*(?:[,/]\s*(${NUMBER}%?)\s*)?\)$`,
  "i"
);

function parseFraction(raw: string, percentScale = 100) {
  return raw.endsWith("%")
    ? Number.parseFloat(raw) / percentScale
    : Number.parseFloat(raw);
}

function parseAlpha(raw: string | undefined) {
  return raw === undefined ? null : clamp(parseFraction(raw), 0, 1);
}

export interface ParsedColor extends Oklch {
  /** `null` when the input did not specify an alpha channel. */
  alpha: number | null;
}

function parseOklch(value: string): ParsedColor | null {
  const match = value.match(OKLCH_RE);
  if (!(match?.[1] && match[2] && match[3])) {
    return null;
  }
  const l = parseFraction(match[1]);
  // CSS maps 100% chroma to 0.4.
  const c = parseFraction(match[2], 100 / 0.4);
  const h = match[3].toLowerCase() === "none" ? 0 : Number.parseFloat(match[3]);
  if (![l, c, h].every(Number.isFinite)) {
    return null;
  }
  return { alpha: parseAlpha(match[4]), c, h: ((h % 360) + 360) % 360, l };
}

function parseHex(value: string): ParsedColor | null {
  const [, digits] = value.match(HEX_RE) ?? [];
  if (!digits) {
    return null;
  }
  const hex =
    digits.length <= 4
      ? [...digits].map((char) => char + char).join("")
      : digits;
  const bytes = hex.match(/../g)?.map((pair) => Number.parseInt(pair, 16));
  if (!bytes) {
    return null;
  }
  const [r = 0, g = 0, b = 0, a] = bytes;
  return {
    ...srgbBytesToOklch(r, g, b),
    alpha: a === undefined ? null : a / 255,
  };
}

function parseRgb(value: string): ParsedColor | null {
  const match = value.match(RGB_RE);
  if (!(match?.[1] && match[2] && match[3])) {
    return null;
  }
  const [r, g, b] = [match[1], match[2], match[3]].map(Number.parseFloat) as [
    number,
    number,
    number,
  ];
  return { ...srgbBytesToOklch(r, g, b), alpha: parseAlpha(match[4]) };
}

/** Lets the browser resolve anything else (named colors, `hsl()`, …) to rgb. */
function parseWithBrowser(value: string): ParsedColor | null {
  if (typeof document === "undefined" || !CSS.supports("color", value)) {
    return null;
  }
  const probe = document.createElement("span");
  probe.hidden = true;
  probe.style.color = value;
  document.body.append(probe);
  try {
    const computed = getComputedStyle(probe).color;
    return parseRgb(computed) ?? parseOklch(computed);
  } finally {
    probe.remove();
  }
}

/** Parses `oklch()` (or a bare `L C H` body), hex, `rgb()` and other CSS colors. */
export function parseColor(value: string): ParsedColor | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return (
    parseOklch(trimmed) ??
    parseHex(trimmed) ??
    parseRgb(trimmed) ??
    parseWithBrowser(trimmed)
  );
}

export function colorToPickerState(value: string): OklchPickerState {
  const parsed = parseColor(value);
  if (!parsed) {
    return { alpha: 1, c: 0, h: 0, l: 0.5 };
  }
  return clampPickerState({ ...parsed, alpha: parsed.alpha ?? 1 });
}

/** Hue ramp with one stop per 10° so the thumb position matches the hue. */
export function oklchHueTrackBackground() {
  const stops = Array.from({ length: 37 }, (_, index) => {
    const ratio = index / 36;
    return `oklch(0.65 0.2 ${(ratio * 360).toFixed(1)}) ${(ratio * 100).toFixed(3)}%`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

const CHECKERBOARD =
  "repeating-conic-gradient(color-mix(in oklab, var(--color-foreground) 15%, transparent) 0% 25%, var(--color-background) 0% 50%) 50% / 8px 8px";

export function oklchAlphaTrackBackground({ l, c, h }: Oklch) {
  return `linear-gradient(to right, oklch(${l} ${c} ${h} / 0), oklch(${l} ${c} ${h})), ${CHECKERBOARD}`;
}

/** Paints a chroma (x) × lightness (y) plane at a fixed hue. */
export function paintOklchPlane(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue: number
) {
  if (width <= 0 || height <= 0) {
    return;
  }

  const imageData = ctx.createImageData(width, height);
  const { data } = imageData;
  const widthMax = Math.max(1, width - 1);
  const heightMax = Math.max(1, height - 1);

  for (let y = 0; y < height; y += 1) {
    const l = 1 - y / heightMax;
    for (let x = 0; x < width; x += 1) {
      const { r, g, b } = oklchToSrgbBytes(
        l,
        (x / widthMax) * OKLCH_PICKER_CHROMA_MAX,
        hue
      );
      const offset = (y * width + x) * 4;
      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
