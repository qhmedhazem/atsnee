"use client";

import { FC, useEffect } from "react";
import { User } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";

import { useUsernameChange } from "@/features/auth/hooks/useUsernameChange";

interface Props {
  onClose?: () => void;
  user: Partial<User>;
  sameUser: boolean;
}

const UsernameChangeForm: FC<Props> = ({ sameUser, user, onClose }) => {
  const { mutation, form, handleSubmit, serverError } = useUsernameChange(user);

  useEffect(() => {
    if (mutation.isSuccess && onClose) {
      onClose();
    }
  }, [mutation.isSuccess, onClose]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="container space-y-4 min-w-fit">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {sameUser && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="py-4 flex flex-col gap-4 sm:flex-row">
          <Button
            isLoading={mutation.isPending}
            disabled={mutation.isSuccess}
            type="submit"
          >
            Confirm
          </Button>
          <Button
            disabled={mutation.isSuccess || mutation.isPending}
            onClick={onClose}
            type="reset"
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      </form>
    </Form>
  );
};

export default UsernameChangeForm;
