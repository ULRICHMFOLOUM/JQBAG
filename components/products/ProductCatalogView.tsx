"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { Search, SlidersHorizontal, ShoppingBag } from "lucide-react";

interface ProductCatalogViewProps {
  initialProducts: any[];
  categories: any[];
  initialCategorySlug?: string;
}

export function ProductCatalogView({
  initialProducts,
  categories,
  initialCategorySlug,
}: ProductCatalogViewProps) {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategorySlug || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Filtre catégorie
        if (selectedCat !== "all" && p.category?.slug !== selectedCat) {
          return false;
        }
        // Filtre recherche
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category?.name.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.promoPrice ?? a.price;
        const priceB = b.promoPrice ?? b.price;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Vedette par défaut
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [initialProducts, selectedCat, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-obsidian-900/90 p-4 rounded-2xl border border-gold-500/20 backdrop-blur-md">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCat("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === "all"
                ? "bg-gold-500 text-obsidian-950 font-bold shadow-md shadow-gold-500/20"
                : "text-zinc-400 hover:text-white bg-obsidian-850 border border-white/5"
            }`}
          >
            Toutes les créations ({initialProducts.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat.slug
                  ? "bg-gold-500 text-obsidian-950 font-bold shadow-md shadow-gold-500/20"
                  : "text-zinc-400 hover:text-white bg-obsidian-850 border border-white/5"
              }`}
            >
              {cat.name} ({cat._count?.products || 0})
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une pochette, un sac, un porte-clé..."
              className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-obsidian-850 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-gold-400 appearance-none pr-8 cursor-pointer"
            >
              <option value="featured">En Vedette</option>
              <option value="price-asc">Prix Croissant</option>
              <option value="price-desc">Prix Décroissant</option>
              <option value="newest">Plus Récents</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Affichage de <strong className="text-gold-400">{filteredProducts.length}</strong> création(s)
        </span>
        {selectedCat !== "all" && (
          <button
            onClick={() => setSelectedCat("all")}
            className="text-gold-400 hover:underline"
          >
            Réinitialiser le filtre
          </button>
        )}
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-obsidian-900/40 rounded-3xl border border-white/5 p-8">
          <ShoppingBag className="w-12 h-12 text-gold-500/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-white mb-2">
            Aucun article ne correspond à votre recherche
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
            Essayez de modifier votre recherche ou explorez une autre catégorie d'artisanat.
          </p>
          <button
            onClick={() => {
              setSelectedCat("all");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs"
          >
            Voir tous les produits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

