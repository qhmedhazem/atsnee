import { NextRequest } from "next/server";
import { z } from "zod";
import { newsLetterSchema } from "@/blocks/NewsLetter/validation/newsLetterSchema";
import payload from "@/lib/payload";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const validatedData = newsLetterSchema.parse(body);

    await payload.create({
      collection: "subscribers",
      data: {
        email: validatedData.email,
      },
    });

    return Response.json(validatedData, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          message: "Validation errors",
          errors: error.issues,
        },
        { status: 400 }
      );
    }
  }

  return Response.json({ message: "Internal server error" }, { status: 500 });
}
