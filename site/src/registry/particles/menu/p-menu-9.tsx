import { Button } from "@/registry/ui/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuPopup,
  MenuTrigger,
} from "@/registry/ui/menu";

export function Particle() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Open menu</Button>} />
      <MenuPopup>
        <MenuCheckboxItem defaultChecked variant="switch">
          Auto save
        </MenuCheckboxItem>
        <MenuCheckboxItem variant="switch">Notifications</MenuCheckboxItem>
        <MenuCheckboxItem defaultChecked variant="switch">
          Dark mode
        </MenuCheckboxItem>
      </MenuPopup>
    </Menu>
  );
}
