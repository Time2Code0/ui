import { Link } from "@/registry/ui/link";

export function Particle() {
  return (
    <div className="flex flex-col items-start gap-2 text-sm">
      <Link className="underline underline-offset-4" href="/docs/ui/button">
        Internal link
      </Link>
      <Link
        className="underline underline-offset-4"
        href="https://github.com/time2code0/ui"
      >
        External link (opens in a new tab)
      </Link>
      <Link
        className="underline underline-offset-4"
        href="mailto:hello@time2code.dev"
      >
        Email link
      </Link>
    </div>
  );
}
