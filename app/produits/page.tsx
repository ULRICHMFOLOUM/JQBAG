import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductCatalogView } from "@/components/products/ProductCatalogView";
import { Gem } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    }),
  ]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-semibold mb-3">
          <Gem className="w-3.5 h-3.5" />
          <span>Haute Joaillerie &amp; Perles Fait Main</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3">
          Nos <span className="gold-gradient-text italic font-serif">Collections</span>
        </h1>
        <p className="text-sm text-zinc-300 font-light leading-relaxed">
          Explorez l'ensemble de nos créations artisanales : des sacs d'apparat étincelants aux
          porte-clés personnalisés d'une finesse incomparable.
        </p>
      </div>

      {/* Catalog View with Interactive Filters */}
      <ProductCatalogView
        initialProducts={products}
        categories={categories}
        initialCategorySlug={searchParams.cat}
      />
    </div>
  );
}
