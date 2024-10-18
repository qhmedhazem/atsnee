"use client";

import { FC, useEffect } from "react";
import { Button } from "@/components/ui/Button";
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
import { usePasswordChange } from "@/features/auth/hooks/usePasswordChange";
import { User } from "@prisma/client";

interface Props {
  onClose?: () => void;
  user: Partial<User>;
  sameUser: boolean;
}

const PasswordChangeForm: FC<Props> = ({ sameUser, user, onClose }) => {
  const { mutation, form, handleSubmit, serverError } = usePasswordChange(user);

  useEffect(() => {
    if (mutation.isSuccess && onClose) {
      onClose();
    }
  }, [mutation.isSuccess, onClose]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        onReset={() => onClose?.()}
        className="container space-y-4 min-w-fit"
      >
        {sameUser && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your old password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter new password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

export default PasswordChangeForm;
