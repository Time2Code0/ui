export const PatternOrientation = {
  diagonal: "diagonal",
  diagonalRightToLeft: "diagonalRightToLeft",
  horizontal: "horizontal",
  vertical: "vertical",
} as const;

export type PatternOrientationType =
  (typeof PatternOrientation)[keyof typeof PatternOrientation];
