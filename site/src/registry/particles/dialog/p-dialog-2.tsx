"use client";

import { useState } from "react";

import { Button } from "@/registry/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/registry/ui/dialog";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/ui/menu";

export function Particle() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="outline">Open menu</Button>} />
        <MenuPopup align="start">
          <MenuItem onClick={() => setDialogOpen(true)}>Open dialog</MenuItem>
        </MenuPopup>
      </Menu>
      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Change your preferences</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost">Close</Button>} />
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </>
  );
}
