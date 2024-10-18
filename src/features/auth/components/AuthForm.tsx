"use client";

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
import { useAuthForm } from "../hooks/useAuthForm";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const { mutation, form, handleSubmit, serverError } = useAuthForm();
  const router = useRouter();

  useEffect(() => {
    if (mutation.isSuccess == true) {
      router.refresh();
    }
  }, [mutation.isSuccess, router]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 min-w-fit">
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
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={mutation.isPending}
          disabled={mutation.isSuccess}
          type="submit"
          size="lg"
        >
          Login
        </Button>
        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      </form>
    </Form>
  );
};

export default AuthForm;
