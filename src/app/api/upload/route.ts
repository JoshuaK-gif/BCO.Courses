import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  await requireAdmin();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use JPG, PNG, WebP, or GIF." }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `course-images/${filename}`;

  const bytes = await file.arrayBuffer();
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("course-images")
    .upload(filePath, Buffer.from(bytes), { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("course-images").getPublicUrl(filePath);
  return NextResponse.json({ url: urlData.publicUrl });
}
