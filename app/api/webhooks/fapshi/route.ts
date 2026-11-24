import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔔 Webhook Fapshi reçu :", body);

    const { transId, status, externalId } = body;

    if (!transId && !externalId) {
      return NextResponse.json({ error: "Données de webhook invalides" }, { status: 400 });
    }

    // Trouver la commande associée
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { fapshiTransId: transId },
          { orderNumber: externalId },
        ],
      },
    });

    if (!order) {
      console.warn(`Commande introuvable pour le webhook Fapshi (transId: ${transId}, externalId: ${externalId})`);
      return NextResponse.json({ message: "Commande introuvable" }, { status: 404 });
    }

    // Mettre à jour l'état de la commande
    const newPaymentStatus =
      status === "SUCCESSFUL"
        ? "SUCCESSFUL"
        : status === "FAILED" || status === "EXPIRED"
        ? "FAILED"
        : "PENDING";

    const newOrderStatus = status === "SUCCESSFUL" ? "CONFIRMED" : order.orderStatus;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        orderStatus: newOrderStatus,
      },
    });

    return NextResponse.json({ success: true, message: "Statut mis à jour avec succès" });
  } catch (error: any) {
    console.error("Erreur webhook Fapshi:", error);
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 });
  }
}

