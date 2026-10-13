import { Marquee } from "@/registry/marketing/marquee";

const companies = [
  "Acme",
  "Globex",
  "Initech",
  "Umbrella",
  "Hooli",
  "Stark",
  "Wayne",
  "Wonka",
];

export function Particle() {
  return (
    <div className="flex w-full flex-col gap-2 overflow-hidden">
      <Marquee pauseOnHover>
        {companies.map((company) => (
          <div
            className="rounded-xl border bg-background px-6 py-4 font-semibold"
            key={company}
          >
            {company}
          </div>
        ))}
      </Marquee>
      <Marquee pauseOnHover reverse>
        {companies.map((company) => (
          <div
            className="rounded-xl border bg-background px-6 py-4 font-semibold"
            key={company}
          >
            {company}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
