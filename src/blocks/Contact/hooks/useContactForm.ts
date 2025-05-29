import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import fetch from "@/lib/fetch";
import { contactSchema } from "../validation/contactSchema";

export const useContactForm = () => {
  const form = useForm<contactSchema>({
    resolver: zodResolver(contactSchema),
  });
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: contactSchema) => {
      const response = await fetch({
        method: "POST",
        url: "/messages",
        data: data,
      });
      return response;
    },
    onSuccess: () => {
      setServerError("");
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.status === 400) {
        setServerError(
          "There was an error with your submission. Please try again."
        );
      } else {
        setServerError("An unexpected error occurred. Please try again later.");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    mutation.mutate(data);
  };

  return {
    form,
    mutation,
    handleSubmit: form.handleSubmit(onSubmit),
    serverError,
  };
};
