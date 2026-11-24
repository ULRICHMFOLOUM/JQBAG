import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Marquee } from "@/components/ui/marquee";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ProductCard } from "@/components/products/ProductCard";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Gem,
  Award,
  Star,
  Check,
  CreditCard,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [categories, featuredProducts, dbSettings] = await Promise.all([
    prisma.category.findMany({
      take: 3,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 8,
      include: { category: true },
    }),
    prisma.setting.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of dbSettings) {
    settingsMap[s.key] = s.value;
  }

  const heroMediaType = (settingsMap["hero_media_type"] as "image" | "video") || "image";
  const heroMediaUrl = settingsMap["hero_media_url"] || "/images/Hero1.jpeg";
  const heroTitle = settingsMap["hero_title"] || "L'Excellence du Fait Main en Perles";
  const heroDescription =
    settingsMap["hero_description"] ||
    "Sacs de soirée, minaudières, pochettes et porte-clés façonnés avec patience et précision dans notre atelier. Des créations durables pensées pour vous accompagner lors de vos plus beaux moments.";
  const heroBadge =
    settingsMap["hero_badge"] || "Atelier de Maroquinerie Perlée • Douala, Cameroun";

  const guarantees = [
    { icon: <Gem className="w-4 h-4 text-gold-400" />, text: "Atelier artisanal basé à Douala" },
    { icon: <CreditCard className="w-4 h-4 text-gold-400" />, text: "Paiements sécurisés Fapshi (Orange Money & MTN MoMo)" },
    { icon: <Truck className="w-4 h-4 text-gold-400" />, text: "Livraison express à Douala & Yaoundé" },
    { icon: <Award className="w-4 h-4 text-gold-400" />, text: "Fils renforcés et perles haute résistance" },
    { icon: <Check className="w-4 h-4 text-gold-400" />, text: "Personnalisation avec votre prénom sur demande" },
  ];

  const testimonials = [
    {
      name: "Solange Mbarga",
      city: "Yaoundé",
      rating: 5,
      comment:
        "Mon sac clutch doré est juste magnifique. Porté lors d'une réception officielle, il a fait l'admiration de tous. Les perles sont fermement fixées et la doublure en satin est soignée.",
    },
    {
      name: "Christelle T.",
      city: "Douala",
      rating: 5,
      comment:
        "Paiement très simple par Orange Money via Fapshi et commande reçue dès le lendemain à Bonapriso. Un travail d'artisanat d'une rare précision au Cameroun.",
    },
    {
      name: "Valérie K.",
      city: "Bafoussam",
      rating: 5,
      comment:
        "Le porte-clé personnalisé avec mon prénom a été confectionné exactement selon mes couleurs. Merci à l'atelier pour la disponibilité sur WhatsApp.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* ========================================================
          HERO SECTION
      ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Dynamic Background Media */}
        {heroMediaType === "video" ? (
          <video
            key={heroMediaUrl}
            src={heroMediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 pointer-events-none transition-opacity duration-500"
          />
        ) : (
          <Image
            key={heroMediaUrl}
            src={heroMediaUrl}
            alt="Atelier JQ BAGS"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45 scale-105 pointer-events-none transition-opacity duration-500"
          />
        )}

        {/* Layered gradient overlays — lighter than before */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/70 via-obsidian-950/30 to-obsidian-950/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(10,11,16,0.7)_100%)] pointer-events-none" />

        {/* Spotlight Effect */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#d4af37" />

        {/* Warm ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-obsidian-950 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-800/80 border border-gold-500/30 text-gold-300 text-xs sm:text-sm font-medium mb-6 shadow-md backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="tracking-wide">{heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-lg">
            {heroTitle.includes("en Perles") ? (
              <>
                {heroTitle.replace("en Perles", "")}{" "}
                <span className="gold-gradient-text font-serif italic">
                  en Perles
                </span>
              </>
            ) : (
              heroTitle
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-zinc-200 text-base sm:text-lg font-light leading-relaxed mb-10">
            {heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/produits">
              <ShimmerButton className="w-full sm:w-auto text-sm tracking-wide gap-2 px-8 py-3.5">
                <ShoppingBag className="w-4 h-4" />
                <span className="font-bold">Consulter le Catalogue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </ShimmerButton>
            </Link>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}?text=Bonjour%20JQ%20BAGS,%20je%20souhaite%20des%20renseignements%20sur%20vos%20créations.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-emerald-400/50 bg-emerald-900/40 hover:bg-emerald-800/50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:border-emerald-400 shadow-lg shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 w-full max-w-4xl text-left">
            <div className="section-divider col-span-full mb-2" />
            
            <div className="p-4 rounded-2xl bg-obsidian-800/70 border border-gold-500/15 hover:border-gold-500/30 transition-colors flex items-start gap-3 backdrop-blur-sm">
              <div className="p-1.5 rounded-lg bg-gold-500/10 shrink-0">
                <Gem className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <strong className="block text-white text-xs font-semibold">Tressage Artisanal</strong>
                <span className="text-[11px] text-zinc-400 leading-tight block mt-0.5">
                  Confection manuelle perle par perle
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-800/70 border border-gold-500/15 hover:border-gold-500/30 transition-colors flex items-start gap-3 backdrop-blur-sm">
              <div className="p-1.5 rounded-lg bg-gold-500/10 shrink-0">
                <CreditCard className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <strong className="block text-white text-xs font-semibold">Paiement Fapshi</strong>
                <span className="text-[11px] text-zinc-400 leading-tight block mt-0.5">
                  Orange Money &amp; MTN MoMo direct
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-800/70 border border-gold-500/15 hover:border-gold-500/30 transition-colors flex items-start gap-3 backdrop-blur-sm">
              <div className="p-1.5 rounded-lg bg-gold-500/10 shrink-0">
                <Truck className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <strong className="block text-white text-xs font-semibold">Livraison Rapide</strong>
                <span className="text-[11px] text-zinc-400 leading-tight block mt-0.5">
                  À domicile à Douala &amp; Yaoundé
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-800/70 border border-gold-500/15 hover:border-gold-500/30 transition-colors flex items-start gap-3 backdrop-blur-sm">
              <div className="p-1.5 rounded-lg bg-gold-500/10 shrink-0">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <strong className="block text-white text-xs font-semibold">Qualité Garantie</strong>
                <span className="text-[11px] text-zinc-400 leading-tight block mt-0.5">
                  Fils de nylon ultra-résistants
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MARQUEE
      ======================================================== */}
      <div className="py-3.5 bg-obsidian-850 border-y border-gold-500/15">
        <Marquee repeat={5} className="[--duration:28s]">
          {guarantees.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 mx-6 text-xs text-zinc-200 tracking-wide font-medium"
            >
              <span className="p-1 rounded-full bg-gold-500/10 border border-gold-500/20">
                {item.icon}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ========================================================
          BENTO GRID (Catégories)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
            Créations Uniques
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Univers &amp; <span className="gold-gradient-text italic font-serif">Catégories</span>
          </h2>
          <p className="text-sm text-zinc-300 font-light">
            Découvrez nos pièces d'exception minutieusement assemblées dans les règles de l'artisanat.
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {categories.map((cat, idx) => (
            <BentoGridItem
              key={cat.id}
              title={cat.name}
              description={cat.description || "Collection exclusive faite main."}
              header={
                <div className="relative w-full h-full min-h-[12rem] rounded-xl overflow-hidden bg-obsidian-900">
                  <Image
                    src={cat.imageUrl || "/images/Sac 1.jpeg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover/bento:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />
                </div>
              }
              className={idx === 0 ? "md:col-span-2" : "md:col-span-1"}
              icon={<Gem className="w-4 h-4 text-gold-400" />}
              href={`/produits?category=${cat.slug}`}
              cta="Explorer la collection"
            />
          ))}
        </BentoGrid>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ========================================================
          BEST SELLERS
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
              Sélection Coup de Cœur
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Les Créations les Plus Prisées
            </h2>
          </div>
          <Link
            href="/produits"
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto group"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ========================================================
          BRAND STORY & SAVOIR-FAIRE
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative noise-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Savoir-Faire &amp; Passion
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Chaque perle tressée porte l'empreinte de la perfection
            </h2>
            <p className="text-sm text-zinc-200 font-light leading-relaxed">
              Chez <strong className="text-gold-300 font-medium">JQ BAGS</strong>, nous croyons qu'un accessoire doit raconter une histoire singulière. Loin des chaînes industrielles de masse, chacun de nos sacs demande entre <strong className="text-white">20 et 40 heures</strong> d'un travail manuel rigoureux perle par perle.
            </p>
            <p className="text-sm text-zinc-200 font-light leading-relaxed">
              Nous sélectionnons avec minutie des perles acryliques haute brillance, des cristaux facettés et des fils de nylon renforcés afin de garantir une solidité à toute épreuve tout en conservant une fluidité remarquable.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="section-divider col-span-full mb-2" />
              <div className="text-center p-4 rounded-2xl bg-obsidian-800/50 border border-gold-500/10">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">
                  100%
                </span>
                <span className="text-xs text-zinc-300 font-medium">Fait Main</span>
              </div>
              <div className="text-center p-4 rounded-2xl bg-obsidian-800/50 border border-gold-500/10">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">
                  +500
                </span>
                <span className="text-xs text-zinc-300 font-medium">Clientes Conquises</span>
              </div>
              <div className="text-center p-4 rounded-2xl bg-obsidian-800/50 border border-gold-500/10">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">
                  30h+
                </span>
                <span className="text-xs text-zinc-300 font-medium">Par Création</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gold-500/25 shadow-2xl gold-soft-glow">
            <Image
              src="/images/Collection 1.jpeg"
              alt="Artisanat JQ BAGS"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-obsidian-800/90 border border-gold-500/25 backdrop-blur-md">
              <span className="text-[11px] text-gold-400 font-medium block">
                Atelier Akwa — Douala, Cameroun
              </span>
              <span className="text-xs font-semibold text-white">
                Finitions méticuleuses et doublures intérieures soyeuses
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ========================================================
          TESTIMONIALS
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
            Témoignages &amp; Retours
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ce que disent nos clientes
          </h2>
          <p className="text-sm text-zinc-300 font-light">
            Leurs retours chaleureux sont notre plus belle récompense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-br from-obsidian-800/80 to-obsidian-850/90 border border-gold-500/15 hover:border-gold-500/35 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-gold-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-200 font-light italic leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gold-500/10 flex items-center justify-between">
                <strong className="text-sm font-semibold text-white">{t.name}</strong>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  {t.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          WHATSAPP PERSONALIZATION BANNER
      ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-12">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-obsidian-800 via-obsidian-850 to-obsidian-800 border border-gold-500/25 text-center space-y-6 shadow-2xl overflow-hidden gold-soft-glow">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Service Sur-Mesure Direct</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto leading-tight">
              Envie d'un sac ou d'un porte-clé personnalisé à votre nom ?
            </h2>

            <p className="text-sm text-zinc-200 max-w-lg mx-auto font-light leading-relaxed">
              Choisissez vos couleurs de perles, vos dimensions ou faites intégrer un prénom ou des initiales. Nos artisans vous conseillent en direct.
            </p>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}?text=Bonjour%20JQ%20BAGS,%20je%20souhaite%20commander%20une%20création%20sur-mesure.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Échanger sur WhatsApp (+237 72 36 28 28)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
