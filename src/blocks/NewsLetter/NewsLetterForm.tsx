"use client";
import { FC } from "react";
import { NewsLetter } from "@/payload-types";

import { Button } from "@/components/ui/Button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useNewsLetterSubscribe } from "./hooks/useNewsLetterSubscribe";

interface Props {
  newsLetter: NewsLetter;
}

const NewsLetterForm: FC<Props> = ({ newsLetter }) => {
  const { mutation, form, handleSubmit, serverError } =
    useNewsLetterSubscribe();

  const isSubscribed =
    mutation.isSuccess || mutation.isError || mutation.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full lg:w-[50%]"
        dir="auto"
      >
        <div className="flex justify-between items-center" dir="ltr">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled={isSubscribed}
                    className="text-black rounded-r-none"
                    placeholder={
                      newsLetter.emailPrompt || "Enter your email address"
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={
              mutation.isSuccess || mutation.isError || mutation.isPending
            }
            type="submit"
            size="lg"
            className="rounded-l-none"
          >
            {isSubscribed ? newsLetter.ctaLabelDone : newsLetter.ctaLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewsLetterForm;
