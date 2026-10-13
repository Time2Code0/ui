import { ImageComparison } from "@/registry/marketing/image-comparison";

export function Particle() {
  return (
    <ImageComparison
      after="/images/comparison-after.svg"
      before="/images/comparison-before.svg"
      className="aspect-video w-full overflow-hidden rounded-xl"
    />
  );
}
