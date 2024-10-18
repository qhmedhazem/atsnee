import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  try {
    const fileMetadata = await db.attachment.findUnique({
      where: { id: filename.split(".")[0] },
    });

    if (!fileMetadata || !fileMetadata.url) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const blobUrl = fileMetadata.url;

    const response = await fetch(blobUrl);
    if (!response.ok) {
      return NextResponse.json(
        { message: "Error retrieving file" },
        { status: 500 }
      );
    }

    const fileBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";

    return new NextResponse(fileBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving file" },
      { status: 500 }
    );
  }
}
