import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkFapshiStatus } from "@/lib/fapshi";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    // Si la commande est en attente de paiement Fapshi et possède un transId, vérifier le statut
    if (order.paymentMethod === "FAPSHI" && order.paymentStatus === "PENDING" && order.fapshiTransId) {
      try {
        const statusRes = await checkFapshiStatus(order.fapshiTransId);
        if (statusRes.status === "SUCCESSFUL") {
          const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "SUCCESSFUL",
              orderStatus: "CONFIRMED",
            },
            include: { items: true },
          });
          return NextResponse.json({ order: updated });
        }
      } catch (err) {
        console.error("Vérification statut Fapshi:", err);
      }
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Erreur récupération commande:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}

