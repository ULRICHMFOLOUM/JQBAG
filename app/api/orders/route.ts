import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      notes,
      paymentMethod = "WHATSAPP",
    } = body;

    if (!items || !items.length || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Veuillez renseigner toutes les informations requises." },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const formattedItems = [];

    for (const item of items) {
      const unitPrice = item.promoPrice ?? item.price;
      totalAmount += unitPrice * item.quantity;

      let validProductId: string | null = null;
      if (item.id) {
        const prodExists = await prisma.product.findUnique({
          where: { id: item.id },
          select: { id: true },
        });
        if (prodExists) validProductId = prodExists.id;
      }

      formattedItems.push({
        productId: validProductId,
        name: item.name,
        price: unitPrice,
        quantity: item.quantity,
        imageUrl: item.imageUrl || null,
      });
    }

    const orderNumber = `CMD-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: (session?.user as any)?.id || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone ? customerPhone.trim() : "",
        shippingAddress: shippingAddress ? shippingAddress.trim() : "À préciser",
        city: city ? city.trim() : "Douala",
        notes: notes ? notes.trim() : null,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === "CASH" ? "PENDING" : "PENDING",
        orderStatus: "PROCESSING",
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Erreur création commande:", error);
    return NextResponse.json(
      { error: "Impossible de créer la commande." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Si admin, renvoyer toutes les commandes ou celles de l'utilisateur
    const where = userRole === "ADMIN" ? {} : { userId };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur récupération commandes" },
      { status: 500 }
    );
  }
}
