"use client";

import { FC, useEffect } from "react";
import { Input } from "@/components/ui/Input";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/Select";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useNewUser } from "../../hooks/useNewUser";
import { Role } from "@prisma/client";
import {
  createUserSchema,
  roleEnum,
} from "../../validation/userSettingsSchema";

interface Props {
  onClose?: () => void;
}

const NewUserForm: FC<Props> = ({ onClose }) => {
  const { form, handleSubmit, mutation, serverError } = useNewUser();

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
        className="space-y-4 min-w-fit container"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password for the account"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) =>
                    form.setValue("role", value as Role)
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.role && (
                <ErrorMessage className="text-red-500">
                  {form.formState.errors.role.message}
                </ErrorMessage>
              )}
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

export default NewUserForm;
