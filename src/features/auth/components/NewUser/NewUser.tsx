"use client";

import { FC } from "react";

import * as React from "react";
import { User } from "@prisma/client";

import useMediaQuery from "@/hooks/use-media-query";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import NewUserForm from "./NewUserForm";

interface Props {}

const NewUser: FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-2">New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
            <DialogDescription>Create new user.</DialogDescription>
          </DialogHeader>
          <NewUserForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="mb-2">New User</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create new user.</DrawerTitle>
          <DrawerDescription>Create new User.</DrawerDescription>
        </DrawerHeader>
        <NewUserForm onClose={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};

export default NewUser;
