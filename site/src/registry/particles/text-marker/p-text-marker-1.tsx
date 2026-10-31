import { TextMarker } from "@/registry/marketing/text-marker";

export function Particle() {
  return (
    <p className="max-w-md text-center font-semibold text-3xl tracking-tight">
      Components that are <TextMarker>easy to use</TextMarker> and fun to build
      with.
    </p>
  );
}
