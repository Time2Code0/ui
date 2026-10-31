import { buttonVariants } from "@/registry/ui/button";
import { Link } from "@/registry/ui/link";

export function Particle() {
  return (
    <Link className={buttonVariants()} href="/">
      Link
    </Link>
  );
}
