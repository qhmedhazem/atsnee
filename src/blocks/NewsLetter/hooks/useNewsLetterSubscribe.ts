import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import fetch from "@/lib/fetch";
import { AxiosError } from "axios";
import { newsLetterSchema } from "../validation/newsLetterSchema";

export const useNewsLetterSubscribe = () => {
  const form = useForm<newsLetterSchema>({
    resolver: zodResolver(newsLetterSchema),
  });
  const [serverError, setServerError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: newsLetterSchema) => {
      const response = await fetch({
        method: "POST",
        url: "/newsletter/subscribe",
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

  const onSubmit = (data: z.infer<typeof newsLetterSchema>) => {
    mutation.mutate(data);
  };

  return {
    form,
    mutation,
    handleSubmit: form.handleSubmit(onSubmit),
    serverError,
  };
};
