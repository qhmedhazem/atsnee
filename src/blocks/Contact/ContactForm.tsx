"use client";
import React from "react";
import { Contact as ContactInterface } from "@/payload-types";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";

import { useContactForm } from "./hooks/useContactForm";

const ContactForm: React.FC<ContactInterface["form"]> = ({
  email,
  emailPlaceholder,
  message,
  messagePlaceholder,
  name,
  namePlaceholder,
  phone,
  phonePlaceholder,
  sendButton: { send, sent },
}) => {
  const { mutation, form, handleSubmit, serverError } = useContactForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 min-w-fit">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{name}</FormLabel>
              <FormControl>
                <Input
                  placeholder={namePlaceholder || "Your full name"}
                  {...field}
                />
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
              <FormLabel>{email}</FormLabel>
              <FormControl>
                <Input
                  placeholder={emailPlaceholder || "user@example.com"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{phone}</FormLabel>
              <FormControl>
                <Input
                  placeholder={phonePlaceholder || "(+20) 100-000-0000"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{message}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={messagePlaceholder || "Your message here."}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          isLoading={mutation.isPending}
          disabled={mutation.isSuccess || mutation.isError}
          type="submit"
          size="lg"
        >
          {mutation.isSuccess ? sent : send}
        </Button>
        {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      </form>
    </Form>
  );
};

export default ContactForm;
