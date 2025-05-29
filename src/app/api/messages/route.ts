import { NextRequest } from "next/server";
import { z } from "zod";
import payload from "@/lib/payload";
import { contactSchema } from "@/blocks/Contact/validation/contactSchema";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const validatedData = contactSchema.parse(body);

    await payload.create({
      collection: "messages",
      data: {
        name: validatedData.fullname,
        email: validatedData.email,
        message: validatedData.message,
        phone: validatedData.phone,
      },
    });

    return Response.json(validatedData, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          message: "Validation errors",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
  }

  return Response.json({ message: "Internal server error" }, { status: 500 });
}
