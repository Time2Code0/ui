/** biome-ignore-all lint/performance/noImgElement: static demo image */
import { ImageZoom } from "@/registry/marketing/image-zoom";

export function Particle() {
  return (
    <ImageZoom className="overflow-hidden rounded-xl border">
      <img
        alt="Product screenshot"
        className="block h-auto w-full"
        height={630}
        src="/images/banner.png"
        width={1200}
      />
    </ImageZoom>
  );
}
