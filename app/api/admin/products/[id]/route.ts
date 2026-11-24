import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.description && { description: body.description.trim() }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.promoPrice !== undefined && {
          promoPrice: body.promoPrice ? parseFloat(body.promoPrice) : null,
        }),
        ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.imageUrl && { imageUrl: body.imageUrl }),
        ...(body.dimensions !== undefined && { dimensions: body.dimensions }),
        ...(body.material !== undefined && { material: body.material }),
        ...(body.categoryId && { categoryId: body.categoryId }),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur mise à jour produit" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { id } = params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur suppression produit" }, { status: 500 });
  }
}

