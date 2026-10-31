import { Typewriter } from "@/registry/marketing/typewriter";

export function Particle() {
  return (
    <div className="font-semibold text-3xl">
      Build{" "}
      <Typewriter
        className="text-primary"
        text={["websites", "dashboards", "design systems"]}
      />
    </div>
  );
}
