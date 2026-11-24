import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initiateFapshiPayment } from "@/lib/fapshi";
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
    } = body;

    if (!items || !items.length || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        { error: "Veuillez renseigner toutes les informations de livraison nécessaires." },
        { status: 400 }
      );
    }

    // Calculer le total à partir des éléments de commande
    let totalAmount = 0;
    const formattedItems = [];

    for (const item of items) {
      const unitPrice = item.promoPrice ?? item.price;
      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;

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

    // Créer la commande en base de données
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: (session?.user as any)?.id || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        city: city ? city.trim() : "Douala",
        notes: notes ? notes.trim() : null,
        totalAmount,
        paymentMethod: "FAPSHI",
        paymentStatus: "PENDING",
        orderStatus: "PROCESSING",
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Construire l'URL de redirection après paiement Fapshi
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const redirectUrl = `${origin}/checkout/success?orderNumber=${order.orderNumber}`;

    // Appeler Fapshi
    const fapshiRes = await initiateFapshiPayment({
      amount: totalAmount,
      email: customerEmail,
      externalId: order.orderNumber,
      redirectUrl,
      userId: (session?.user as any)?.id || undefined,
      message: `Commande ${order.orderNumber} - Atelier JQ BAGS`,
    });

    // Mettre à jour la commande avec l'identifiant de transaction Fapshi
    await prisma.order.update({
      where: { id: order.id },
      data: {
        fapshiTransId: fapshiRes.transId,
        fapshiLink: fapshiRes.link,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      paymentLink: fapshiRes.link,
      transId: fapshiRes.transId,
      isSimulation: fapshiRes.isSimulation,
    });
  } catch (error: any) {
    console.error("Erreur checkout Fapshi:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'initialisation du paiement Fapshi." },
      { status: 500 }
    );
  }
}
