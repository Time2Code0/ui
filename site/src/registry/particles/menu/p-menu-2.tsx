import { Button } from "@/registry/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";

export function Particle() {
  return (
    <Menu>
      <MenuTrigger
        openOnHover
        render={<Button variant="outline">Hover me</Button>}
      />
      <MenuPopup>
        <MenuItem>Item one</MenuItem>
        <MenuItem>Item two</MenuItem>
      </MenuPopup>
    </Menu>
  );
}
