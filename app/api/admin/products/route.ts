import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    const categories = await prisma.category.findMany();
    return NextResponse.json({ products, categories });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur récupération" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      promoPrice,
      categoryId,
      imageUrl,
      imageUrl2,
      imageUrl3,
      stock,
      isFeatured,
      dimensions,
      material,
    } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        price: parseFloat(price),
        promoPrice: promoPrice ? parseFloat(promoPrice) : null,
        categoryId,
        imageUrl: imageUrl || "/images/placeholder.png",
        imageUrl2: imageUrl2 || null,
        imageUrl3: imageUrl3 || null,
        stock: stock ? parseInt(stock) : 10,
        isFeatured: Boolean(isFeatured),
        dimensions: dimensions || null,
        material: material || null,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Erreur création produit:", error);
    return NextResponse.json({ error: "Erreur création produit" }, { status: 500 });
  }
}

