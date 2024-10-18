import "server-only";
import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import path from "path";
import { put } from "@vercel/blob"; // Import Vercel Blob
import { db } from "../db";
import { User, Attachment } from "@prisma/client";

export const storageMiddleware = async (
  req: NextRequest,
  user: Partial<User>
): Promise<Attachment | null> => {
  if (!user.id) return null;

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;

  if (file) {
    const id = new ObjectId();
    const ext = path.extname((file as File).name);
    const filename = id.toString() + ext;
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const blob = await put("cdn/" + filename, buffer, {
        access: "public",
      });

      return db.attachment.create({
        data: {
          id: id.toString(),
          userId: user.id,
          extension: ext,
          url: blob.url,
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return null;
};
