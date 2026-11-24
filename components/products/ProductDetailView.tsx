"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import {
  ShoppingBag,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Truck,
  Award,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface ProductDetailViewProps {
  product: any;
  relatedProducts: any[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedImg, setSelectedImg] = useState(product.imageUrl);
  const [quantity, setQuantity] = useState(1);

  const images = [
    product.imageUrl,
    product.imageUrl2,
    product.imageUrl3,
  ].filter(Boolean);

  const hasDiscount =
    product.promoPrice !== null &&
    product.promoPrice !== undefined &&
    product.promoPrice < product.price;

  const currentPrice = hasDiscount ? product.promoPrice : product.price;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        promoPrice: product.promoPrice,
        imageUrl: product.imageUrl,
      },
      quantity
    );
    toast.success(`${quantity}x "${product.name}" ajouté(s) au panier`);
  };

  const handleBuyNowFapshi = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        promoPrice: product.promoPrice,
        imageUrl: product.imageUrl,
      },
      quantity
    );
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828";
    const msg = `Bonjour JQ BAGS,\nJe souhaite commander l'article : *${product.name}*\nQuantité : ${quantity}\nPrix unitaire : ${formatPrice(currentPrice)}\nTotal : ${formatPrice(currentPrice * quantity)}\nLien : ${window.location.href}\n\nMerci de me confirmer la disponibilité.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-gold-400">
          Accueil
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/produits" className="hover:text-gold-400">
          Créations
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link
              href={`/produits?cat=${product.category.slug}`}
              className="hover:text-gold-400"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-white truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-obsidian-900 border border-gold-500/30 shadow-2xl">
            <Image
              src={selectedImg}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gold-500 text-obsidian-950 shadow-lg">
                <Award className="w-3.5 h-3.5" />
                Pièce Iconique
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === img
                      ? "border-gold-400 shadow-md shadow-gold-500/20 scale-105"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying Flow */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block mb-2">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="font-serif text-3xl font-bold text-gold-400">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {hasDiscount && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                  Économie de {formatPrice(product.price - currentPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">
                {product.stock > 0
                  ? `En stock (${product.stock} pièce(s) disponible(s))`
                  : "Confection sur commande sous 3 à 5 jours"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert text-zinc-300 text-sm leading-relaxed font-light">
            <p>{product.description}</p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 text-xs">
            {product.dimensions && (
              <div>
                <span className="text-zinc-500 block">Dimensions</span>
                <span className="text-white font-medium">{product.dimensions}</span>
              </div>
            )}
            {product.material && (
              <div>
                <span className="text-zinc-500 block">Matériaux</span>
                <span className="text-white font-medium">{product.material}</span>
              </div>
            )}
            <div>
              <span className="text-zinc-500 block">Fabrication</span>
              <span className="text-white font-medium">100% Brodé Main (Douala)</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Finition</span>
              <span className="text-white font-medium">Fils renforcés &amp; fermoir or</span>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-zinc-300">Quantité :</span>
              <div className="flex items-center border border-white/15 rounded-xl bg-obsidian-850 px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 text-zinc-400 hover:text-white"
                  aria-label="Diminuer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                  aria-label="Augmenter"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 rounded-xl bg-obsidian-850 border border-gold-500/40 hover:bg-gold-500/10 text-gold-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au Panier</span>
              </button>

              <button
                onClick={handleBuyNowFapshi}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-gold-500/30"
              >
                <CreditCard className="w-4 h-4" />
                <span>Acheter (Fapshi)</span>
              </button>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander directement via WhatsApp (+237 72 36 28 28)</span>
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="p-4 rounded-2xl bg-obsidian-900 border border-white/5 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Livraison express à Douala &amp; Yaoundé en 24h à 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Paiement sécurisé Fapshi (Orange Money, MTN MoMo, Visa/Mastercard)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

