/** biome-ignore-all lint/performance/noImgElement: static demo image */
import { ProgressiveBlur } from "@/registry/marketing/progressive-blur";

export function Particle() {
  return (
    <ProgressiveBlur className="overflow-hidden rounded-xl border">
      <img
        alt="Product screenshot"
        className="block h-auto w-full"
        height={630}
        src="/images/banner.png"
        width={1200}
      />
    </ProgressiveBlur>
  );
}
