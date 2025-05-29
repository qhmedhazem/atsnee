import { z } from "zod";

export const contactSchema = z.object({
  fullname: z
    .string()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name must be at most 100 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(20, { message: "Phone number must be at most 20 characters" }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(2500, { message: "Message must be at most 2500 characters" }),
});

export type contactSchema = z.infer<typeof contactSchema>;
