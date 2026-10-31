import { Button } from "@/registry/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer";

export function Particle() {
  return (
    <Drawer>
      <DrawerTrigger
        render={<Button variant="outline">Scrollable content</Button>}
      />
      <DrawerPopup showBar>
        <DrawerHeader>
          <DrawerTitle>Scrollable content</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 48 }, (_, i) => `box-${i}`).map((key) => (
              <div
                className="h-12 shrink-0 rounded-xl border bg-background-muted"
                key={key}
              />
            ))}
          </div>
        </DrawerPanel>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Close</Button>} />
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  );
}
