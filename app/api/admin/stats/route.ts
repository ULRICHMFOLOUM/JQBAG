import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      fapshiOrdersCount,
      allOrders,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.order.count({ where: { paymentMethod: "FAPSHI", paymentStatus: "SUCCESSFUL" } }),
      prisma.order.findMany({
        where: { paymentStatus: "SUCCESSFUL" },
        select: { totalAmount: true },
      }),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        fapshiOrdersCount,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error: any) {
    console.error("Erreur stats admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
