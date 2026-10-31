import { Button } from "@/registry/ui/button";
import {
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer";

export function Particle() {
  return (
    <div className="flex flex-wrap gap-2">
      <Drawer position="right">
        <DrawerTrigger render={<Button variant="outline">Right</Button>} />
        <DrawerPopup variant="inset">
          <DrawerHeader>
            <DrawerTitle>Right</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <p className="text-foreground-muted text-sm">
              Content from the right.
            </p>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
      <Drawer position="left">
        <DrawerTrigger render={<Button variant="outline">Left</Button>} />
        <DrawerPopup variant="inset">
          <DrawerHeader>
            <DrawerTitle>Left</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <p className="text-foreground-muted text-sm">
              Content from the left.
            </p>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
      <Drawer position="top">
        <DrawerTrigger render={<Button variant="outline">Top</Button>} />
        <DrawerPopup variant="inset">
          <DrawerHeader>
            <DrawerTitle>Top</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <p className="text-foreground-muted text-sm">
              Content from the top.
            </p>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
      <Drawer>
        <DrawerTrigger render={<Button variant="outline">Bottom</Button>} />
        <DrawerPopup variant="inset">
          <DrawerHeader>
            <DrawerTitle>Bottom</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <p className="text-foreground-muted text-sm">
              Content from the bottom.
            </p>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </div>
  );
}
