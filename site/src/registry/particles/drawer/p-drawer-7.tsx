import { Button } from "@/registry/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
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
        render={<Button variant="outline">Nested drawers</Button>}
      />
      <DrawerPopup showBar>
        <DrawerHeader className="text-center">
          <DrawerTitle>First step</DrawerTitle>
          <DrawerDescription>
            This is the first step. Tap the button below to continue to the next
            screen.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter
          className="justify-center sm:justify-center"
          variant="bare"
        >
          <DrawerClose render={<Button variant="ghost">Cancel</Button>} />
          <Drawer>
            <DrawerTrigger
              render={<Button variant="outline">Continue</Button>}
            />
            <DrawerPopup showBar>
              <DrawerHeader className="text-center">
                <DrawerTitle>Second step</DrawerTitle>
                <DrawerDescription>
                  You&apos;ve reached the second step. Tap the button below to
                  continue to the next screen.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerPanel>
                <div className="flex justify-center">
                  <div className="size-48 shrink-0 rounded-xl border bg-background-muted" />
                </div>
              </DrawerPanel>
              <DrawerFooter
                className="justify-center sm:justify-center"
                variant="bare"
              >
                <DrawerClose render={<Button variant="ghost">Back</Button>} />
                <Drawer>
                  <DrawerTrigger
                    render={<Button variant="outline">Continue</Button>}
                  />
                  <DrawerPopup showBar>
                    <DrawerHeader className="text-center">
                      <DrawerTitle>Third step</DrawerTitle>
                      <DrawerDescription>
                        You&apos;ve reached the final step. You can close this
                        drawer or go back.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerPanel>
                      <div className="flex justify-center">
                        <div className="size-32 shrink-0 rounded-full border bg-background-muted" />
                      </div>
                    </DrawerPanel>
                  </DrawerPopup>
                </Drawer>
              </DrawerFooter>
            </DrawerPopup>
          </Drawer>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  );
}
