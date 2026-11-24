import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé - réservé aux administrateurs" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Autoriser images et vidéos
    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté. Veuillez envoyer une image (JPEG, PNG, WEBP) ou une vidéo (MP4, WEBM)." },
        { status: 400 }
      );
    }

    // Répertoire cible : public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `media_${Date.now()}_${safeName}`;
    const destinationPath = path.join(uploadsDir, uniqueFileName);

    await fs.promises.writeFile(destinationPath, buffer);

    const mediaType = file.type.startsWith("video") ? "video" : "image";
    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      type: mediaType,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error("Erreur téléversement:", error);
    return NextResponse.json(
      { error: "Erreur lors du téléversement du média" },
      { status: 500 }
    );
  }
}

