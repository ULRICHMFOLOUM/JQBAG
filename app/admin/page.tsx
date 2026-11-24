import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import Link from "next/link";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Charger les données pour l'administrateur
  const [products, categories, recentOrders, allOrders, dbSettings] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany(),
    prisma.order.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.findMany({
      where: { paymentStatus: "SUCCESSFUL" },
      select: { totalAmount: true },
    }),
    prisma.setting.findMany(),
  ]);

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = {
    totalRevenue,
    totalProducts: products.length,
    totalOrders: recentOrders.length,
  };

  const initialSettings: Record<string, string> = {};
  for (const s of dbSettings) {
    initialSettings[s.key] = s.value;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-obsidian-950 pt-36 pb-20 px-4 max-w-md mx-auto text-center space-y-6">
        <div className="p-8 rounded-3xl bg-obsidian-900 border border-gold-500/30 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto text-gold-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Espace d'Administration
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Cet espace est réservé à la direction et aux gestionnaires de l'Atelier JQ BAGS.
          </p>
          <div className="p-3 bg-obsidian-850 rounded-xl border border-white/5 text-[11px] text-zinc-400">
            Identifiants du compte administrateur :<br />
            Email : <strong className="text-white">admin@jqbags.com</strong><br />
            Mot de passe : <strong className="text-white">Admin@2024</strong>
          </div>
          <p className="text-[11px] text-zinc-500">
            Cliquez sur le bouton "Connexion" dans la barre de navigation pour vous connecter avec ces identifiants, puis revenez sur cette page.
          </p>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-1">
            Back-Office Atelier JQ BAGS
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">
            Tableau de Bord &amp; Gestion
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Session Administrateur active ({session.user?.email})</span>
        </div>
      </div>

      <AdminDashboardView
        initialStats={stats}
        initialProducts={products}
        categories={categories}
        initialRecentOrders={recentOrders}
        initialSettings={initialSettings}
      />
    </div>
  );
}
