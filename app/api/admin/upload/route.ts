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
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format non supporté. Veuillez envoyer une image (PNG, JPG, WEBP, ICO, SVG) ou une vidéo (MP4, WEBM)." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mediaType = file.type.startsWith("video") ? "video" : "image";
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `media_${Date.now()}_${safeName}`;

    let publicUrl = "";

    // 1. Tenter l'écriture locale sur disque (serveur local ou hébergement avec FS inscriptible)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const destinationPath = path.join(uploadsDir, uniqueFileName);
      await fs.promises.writeFile(destinationPath, buffer);
      publicUrl = `/uploads/${uniqueFileName}`;
    } catch (fsErr) {
      console.warn("Disque read-only (serverless) détecté, encodage direct en Data URL:", fsErr);
      // 2. Bascule transparente en Data URL Base64 (100% compatible Netlify/Vercel serverless)
      const mimeType = file.type || "image/png";
      const base64 = buffer.toString("base64");
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

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
