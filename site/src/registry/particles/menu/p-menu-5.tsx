import Link from "next/link";

import { Button } from "@/registry/ui/button";
import { Menu, MenuLinkItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";

export function Particle() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Open menu</Button>} />
      <MenuPopup>
        <MenuLinkItem render={<Link href="/docs" />}>Docs</MenuLinkItem>
        <MenuLinkItem render={<Link href="/particles" />}>
          Particles
        </MenuLinkItem>
      </MenuPopup>
    </Menu>
  );
}
