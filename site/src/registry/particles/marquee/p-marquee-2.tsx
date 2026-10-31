import { Marquee } from "@/registry/marketing/marquee";

const items = ["Design", "Develop", "Ship", "Iterate", "Repeat"];

export function Particle() {
  return (
    <Marquee className="h-64" pauseOnHover vertical>
      {items.map((item) => (
        <div
          className="w-48 rounded-xl border bg-background px-6 py-4 text-center font-semibold"
          key={item}
        >
          {item}
        </div>
      ))}
    </Marquee>
  );
}
