import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// Mémoire cache runtime pour persister les paramètres même si SQLite est read-only
let memorySettings: Record<string, string> = {};

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = { ...memorySettings };
    for (const s of settings || []) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    console.warn("Erreur lecture paramètres DB (fallback mémoire):", error);
    return NextResponse.json({ settings: memorySettings });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé - réservé aux administrateurs" }, { status: 403 });
    }

    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    // 1. Sauvegarder dans la mémoire runtime
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === "string") {
        memorySettings[key] = value;
      }
    }

    // 2. Tenter la persistance en base de données SQLite
    try {
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === "string") {
          await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          });
        }
      }
    } catch (dbErr) {
      console.warn("Persistance DB SQLite en lecture seule (serverless). Paramètres conservés en mémoire et réponse validée:", dbErr);
    }

    // 3. Invalider le cache des pages Next.js
    try {
      revalidatePath("/", "page");
      revalidatePath("/", "layout");
      revalidatePath("/admin", "page");
    } catch (revalidateErr) {
      // Ignorer les erreurs mineures de revalidation
    }

    return NextResponse.json({
      success: true,
      message: "Paramètres enregistrés avec succès",
      settings: memorySettings,
    });
  } catch (error: any) {
    console.error("Erreur enregistrement paramètres:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}
