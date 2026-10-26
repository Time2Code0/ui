export interface SunburstNode {
  children?: SunburstNode[];
  color?: string;
  /** Optional fill override for patterns/gradients (e.g., "url(#patternId)") */
  fill?: string;
  name: string;
  value?: number;
}
