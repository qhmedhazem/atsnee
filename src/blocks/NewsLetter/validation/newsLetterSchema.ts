import { z } from "zod";

export const newsLetterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

export type newsLetterSchema = z.infer<typeof newsLetterSchema>;
