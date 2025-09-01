// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as unknown as File | null;

    if (!file) return new NextResponse("No file", { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, bytes);

    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return new NextResponse("Upload failed", { status: 500 });
  }
};
