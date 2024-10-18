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
import PasswordChangeForm from "./PasswordChangeForm";

interface Props {
  user: Partial<User>;
  sameUser: boolean;
}

export const PasswordChangeModal: FC<Props> = ({ sameUser, user }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-2">Change Password</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Change your password.</DialogDescription>
          </DialogHeader>
          <PasswordChangeForm
            sameUser={sameUser}
            user={user}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="mb-2">Edit Password</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Change Password</DrawerTitle>
          <DrawerDescription>Change your password.</DrawerDescription>
        </DrawerHeader>
        <PasswordChangeForm
          sameUser={sameUser}
          user={user}
          onClose={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  );
};
