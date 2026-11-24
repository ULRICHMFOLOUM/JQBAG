"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Eye, Award, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    promoPrice?: number | null;
    imageUrl: string;
    stock: number;
    isFeatured?: boolean;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const hasDiscount =
    product.promoPrice !== null &&
    product.promoPrice !== undefined &&
    product.promoPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - (product.promoPrice as number)) / product.price) * 100)
    : 0;

  const currentPrice = hasDiscount ? product.promoPrice : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      promoPrice: product.promoPrice,
      imageUrl: product.imageUrl,
    });
    toast.success(`"${product.name}" ajouté à votre panier`);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828";
    const msg = `Bonjour JQ BAGS,\nJe souhaite commander l'article : *${product.name}*\nPrix : ${formatPrice(currentPrice)}\nLien : ${window.location.origin}/produits/${product.slug}\n\nEst-il disponible ?`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-obsidian-800/90 to-obsidian-850 border border-gold-500/12 hover:border-gold-500/35 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/8 flex flex-col overflow-hidden">
      {/* Top Image Showcase */}
      <Link href={`/produits/${product.slug}`} className="relative aspect-square overflow-hidden bg-obsidian-900">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-30 group-hover:opacity-15 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-gold-500/90 text-obsidian-950 shadow-md">
              <Award className="w-2.5 h-2.5" />
              VEDETTE
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-rose-600 text-white shadow-md">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick action buttons overlay */}
        <div className="absolute bottom-3 inset-x-3 flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-black/60 transition-all"
            title="Ajouter au Panier"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Panier</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-black/60 transition-all"
            title="Commander via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <div className="p-2 rounded-xl bg-obsidian-800/80 backdrop-blur-md text-white border border-white/15">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block mb-1">
              {product.category.name}
            </span>
          )}

          <Link href={`/produits/${product.slug}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-zinc-300 line-clamp-2 mt-1.5 leading-relaxed font-sans font-light">
            {product.description}
          </p>
        </div>

        {/* Price & Stock info */}
        <div className="mt-4 pt-3 border-t border-gold-500/10 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-base sm:text-lg text-gold-400">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-zinc-400">
            {product.stock > 0 ? (
              <span className="text-emerald-400">En stock</span>
            ) : (
              <span className="text-amber-400">Sur commande</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
