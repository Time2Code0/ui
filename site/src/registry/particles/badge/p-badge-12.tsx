import Link from "next/link";

import { Badge } from "@/registry/ui/badge";

export function Particle() {
  return <Badge render={<Link href="/" />}>Badge</Badge>;
}
