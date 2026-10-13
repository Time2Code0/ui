import { Button, buttonVariants } from "@/registry/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer";
import { Link } from "@/registry/ui/link";

export function Particle() {
  return (
    <Drawer position="left">
      <DrawerTrigger render={<Button variant="outline">Open menu</Button>} />
      <DrawerPopup showCloseButton variant="straight">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <nav className="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
            <DrawerClose
              nativeButton={false}
              render={
                <Link
                  className={buttonVariants({
                    className: "justify-start",
                    variant: "ghost",
                  })}
                  href="#"
                />
              }
            >
              Home
            </DrawerClose>
            <DrawerClose
              nativeButton={false}
              render={
                <Link
                  className={buttonVariants({
                    className: "justify-start",
                    variant: "ghost",
                  })}
                  href="#"
                />
              }
            >
              Profile
            </DrawerClose>
            <DrawerClose
              nativeButton={false}
              render={
                <Link
                  className={buttonVariants({
                    className: "justify-start",
                    variant: "ghost",
                  })}
                  href="#"
                />
              }
            >
              Settings
            </DrawerClose>
            <DrawerClose
              nativeButton={false}
              render={
                <Link
                  className={buttonVariants({
                    className: "justify-start",
                    variant: "ghost",
                  })}
                  href="#"
                />
              }
            >
              Sign out
            </DrawerClose>
          </nav>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );
}
