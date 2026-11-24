"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  Package,
  CreditCard,
  Users,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Star,
  Search,
  Gem,
  Award,
  Video,
  ImageIcon,
  Upload,
  Eye,
  Sliders,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface AdminDashboardViewProps {
  initialStats: any;
  initialProducts: any[];
  categories: any[];
  initialRecentOrders: any[];
  initialSettings?: Record<string, string>;
}

export function AdminDashboardView({
  initialStats,
  initialProducts,
  categories,
  initialRecentOrders,
  initialSettings = {},
}: AdminDashboardViewProps) {
  const [products, setProducts] = useState(initialProducts);
  const [recentOrders, setRecentOrders] = useState(initialRecentOrders);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "hero" | "icon">("products");

  // Site icon & logo settings state
  const [siteIconUrl, setSiteIconUrl] = useState(
    initialSettings.site_icon || "/images/logo.png"
  );
  const [isSavingIcon, setIsSavingIcon] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  // Preset icon options
  const iconPresets = [
    { label: "Logo Officiel JQ BAGS (PNG)", url: "/images/logo.png" },
    { label: "Logo Écrin Sombre (JPEG)", url: "/images/logo.jpeg" },
    { label: "Sac Clutch Doré", url: "/images/Sac 1.jpeg" },
    { label: "Porte-clés Perlé", url: "/images/Porte 1.jpeg" },
    { label: "Collection Atelier", url: "/images/Collection 1.jpeg" },
    { label: "Hero Prestige Akwa", url: "/images/Hero1.jpeg" },
  ];

  // Hero section settings state
  const [heroMediaType, setHeroMediaType] = useState<"image" | "video">(
    (initialSettings.hero_media_type as "image" | "video") || "image"
  );
  const [heroMediaUrl, setHeroMediaUrl] = useState(
    initialSettings.hero_media_url || "/images/Hero1.jpeg"
  );
  const [heroTitle, setHeroTitle] = useState(
    initialSettings.hero_title || "L'Excellence du Fait Main en Perles"
  );
  const [heroDescription, setHeroDescription] = useState(
    initialSettings.hero_description ||
      "Sacs de soirée, minaudières, pochettes et porte-clés façonnés avec patience et précision dans notre atelier. Des créations durables pensées pour vous accompagner lors de vos plus beaux moments."
  );
  const [heroBadge, setHeroBadge] = useState(
    initialSettings.hero_badge || "Atelier de Maroquinerie Perlée • Douala, Cameroun"
  );
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Preset media options from real atelier photos & videos
  const heroPresets = [
    { label: "✨ Vidéo Cinéma Hero", url: "/videos/hero_animation.mp4", type: "video" as const, thumb: "/images/Hero1.jpeg" },
    { label: "Hero Prestige 1", url: "/images/Hero1.jpeg", type: "image" as const, thumb: "/images/Hero1.jpeg" },
    { label: "Hero Prestige 2", url: "/images/Hero2.jpeg", type: "image" as const, thumb: "/images/Hero2.jpeg" },
    { label: "Hero Prestige 3", url: "/images/Hero3.jpeg", type: "image" as const, thumb: "/images/Hero3.jpeg" },
    { label: "Hero Prestige 4", url: "/images/Hero4.jpeg", type: "image" as const, thumb: "/images/Hero4.jpeg" },
    { label: "Hero Prestige 5", url: "/images/Hero5.jpeg", type: "image" as const, thumb: "/images/Hero5.jpeg" },
    { label: "Collection Sac 1", url: "/images/Sac 1.jpeg", type: "image" as const, thumb: "/images/Sac 1.jpeg" },
    { label: "Collection Sac 4", url: "/images/Sac 4.jpeg", type: "image" as const, thumb: "/images/Sac 4.jpeg" },
  ];

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || "");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdPromoPrice, setNewProdPromoPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("10");
  const [newProdImage, setNewProdImage] = useState("/images/Sac 1.jpeg");
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdDimensions, setNewProdDimensions] = useState("22 × 14 cm");
  const [newProdMaterial, setNewProdMaterial] = useState("Perles de haute qualité, doublure satin");

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Confirmez-vous la suppression de "${name}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success(`"${name}" supprimé.`);
      } else {
        toast.error("Impossible de supprimer le produit.");
      }
    } catch (e) {
      toast.error("Erreur réseau");
    }
  };

  const handleToggleFeatured = async (product: any) => {
    try {
      const newStatus = !product.isFeatured;
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isFeatured: newStatus } : p))
        );
        toast.success(`Statut vedette mis à jour pour "${product.name}"`);
      }
    } catch (e) {
      toast.error("Erreur de mise à jour");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          categoryId: newProdCategory,
          price: newProdPrice,
          promoPrice: newProdPromoPrice || null,
          stock: newProdStock,
          imageUrl: newProdImage,
          isFeatured: newProdFeatured,
          description: newProdDescription,
          dimensions: newProdDimensions,
          material: newProdMaterial,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur de création");
      }

      toast.success("Produit ajouté au catalogue avec succès !");
      const createdProd = {
        ...data.product,
        category: categories.find((c) => c.id === newProdCategory),
      };
      setProducts([createdProd, ...products]);

      setIsAddModalOpen(false);
      setNewProdName("");
      setNewProdPrice("");
      setNewProdPromoPrice("");
      setNewProdDescription("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload handler for Hero section
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    toast.loading("Téléversement du fichier en cours...", { id: "hero-upload" });

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du téléversement");

      setHeroMediaUrl(data.url);
      setHeroMediaType(data.type);
      toast.success("Fichier téléversé avec succès !", { id: "hero-upload" });
    } catch (err: any) {
      toast.error(err.message, { id: "hero-upload" });
    } finally {
      setIsUploading(false);
    }
  };

  // Save Hero settings
  const handleSaveHeroSettings = async () => {
    setIsSavingHero(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            hero_media_type: heroMediaType,
            hero_media_url: heroMediaUrl,
            hero_title: heroTitle,
            hero_description: heroDescription,
            hero_badge: heroBadge,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'enregistrement");

      toast.success("Section Hero mise à jour ! Les modifications sont visibles sur l'accueil.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSavingHero(false);
    }
  };

  // Upload handler for Site Icon
  const handleIconFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aperçu immédiat via FileReader côté client
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSiteIconUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingIcon(true);
    toast.loading("Téléversement de l'icône en cours...", { id: "icon-upload" });

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du téléversement");

      if (data.url) {
        setSiteIconUrl(data.url);
      }
      toast.success("Icône prête ! Cliquez sur 'Enregistrer l'icône' pour appliquer.", { id: "icon-upload" });
    } catch (err: any) {
      // Si l'API échoue, la data URL locale est quand même conservée
      toast.success("Aperçu de l'icône chargé ! Cliquez sur 'Enregistrer' pour finaliser.", { id: "icon-upload" });
    } finally {
      setIsUploadingIcon(false);
    }
  };

  // Save Site Icon setting
  const handleSaveIconSettings = async () => {
    setIsSavingIcon(true);
    try {
      // 1. Sauvegarde locale immédiate pour le navigateur et mise à jour dynamique du Favicon
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("jqbags_site_icon", siteIconUrl);
          const iconLinks = document.querySelectorAll("link[rel*='icon']");
          iconLinks.forEach((l) => ((l as HTMLLinkElement).href = siteIconUrl));
        } catch (e) {
          // Ignorer
        }
      }

      // 2. Persistance sur le serveur
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            site_icon: siteIconUrl,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'enregistrement");

      toast.success("Icône du site mise à jour avec succès !");
    } catch (err: any) {
      toast.success("Icône enregistrée localement avec succès !");
    } finally {
      setIsSavingIcon(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchFilter.trim()) return true;
    return (
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gold-500/20 to-obsidian-850 border border-gold-500/40 flex items-center gap-4 shadow-xl">
          <div className="p-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold block">
              Revenus Encaissés
            </span>
            <span className="font-serif text-2xl font-bold text-white">
              {formatPrice(initialStats.totalRevenue || 0)}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-obsidian-800 text-gold-400 border border-gold-500/15">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">
              Produits au Catalogue
            </span>
            <span className="font-serif text-2xl font-bold text-white">
              {products.length}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-obsidian-800 text-gold-400 border border-gold-500/15">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">
              En Vedette
            </span>
            <span className="font-serif text-2xl font-bold text-white">
              {products.filter((p) => p.isFeatured).length}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">
              Commandes Totales
            </span>
            <span className="font-serif text-2xl font-bold text-white">
              {initialStats.totalOrders || recentOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20"
                : "bg-obsidian-850 text-zinc-400 hover:text-white border border-gold-500/10"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gestion des Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20"
                : "bg-obsidian-850 text-zinc-400 hover:text-white border border-gold-500/10"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Commandes Récentes ({recentOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "hero"
                ? "bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20"
                : "bg-obsidian-850 text-gold-400 hover:text-white border border-gold-500/20"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Photo / Vidéo Hero (Accueil)</span>
          </button>

          <button
            onClick={() => setActiveTab("icon")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "icon"
                ? "bg-gold-500 text-obsidian-950 shadow-md shadow-gold-500/20"
                : "bg-obsidian-850 text-gold-400 hover:text-white border border-gold-500/20"
            }`}
          >
            <Gem className="w-4 h-4" />
            <span>Icône &amp; Logo du Site</span>
          </button>
        </div>

        {activeTab === "products" && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrer les produits..."
                className="bg-obsidian-850 border border-gold-500/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          TAB 1: HERO & MEDIA MANAGEMENT
      ======================================================== */}
      {activeTab === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Configuration Form */}
          <div className="lg:col-span-7 bg-obsidian-850 border border-gold-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Personnalisation Visuelle de l'Accueil</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Média d'Arrière-Plan de la Section Hero
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Choisissez une photo haute résolution ou une vidéo MP4 en boucle pour immerger immédiatement les visiteurs dans l'univers de l'Atelier.
              </p>
            </div>

            {/* Media Type Switcher */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Type de Média
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHeroMediaType("image")}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    heroMediaType === "image"
                      ? "bg-gold-500 text-obsidian-950 border-gold-400 shadow-md shadow-gold-500/20"
                      : "bg-obsidian-850 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Photo / Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMediaType("video")}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    heroMediaType === "video"
                      ? "bg-gold-500 text-obsidian-950 border-gold-400 shadow-md shadow-gold-500/20"
                      : "bg-obsidian-850 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Vidéo en Boucle (MP4)</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Photos de l'Atelier Disponibles (Sélection en 1 clic)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {heroPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHeroMediaUrl(preset.url);
                      setHeroMediaType(preset.type);
                    }}
                    className={`relative group rounded-xl overflow-hidden aspect-video border transition-all ${
                      heroMediaUrl === preset.url
                        ? "border-gold-400 ring-2 ring-gold-400/50 scale-[1.03]"
                        : "border-white/10 hover:border-gold-500/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={preset.thumb}
                      alt={preset.label}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-end p-1.5 justify-between">
                      <span className="text-[10px] text-white font-medium truncate block drop-shadow">
                        {preset.label}
                      </span>
                      {preset.type === "video" && (
                        <span className="p-0.5 rounded bg-gold-500/80 text-obsidian-950 shrink-0 ml-1">
                          <Video className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    {heroMediaUrl === preset.url && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload or Custom URL */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Ou Téléverser Depuis Votre Ordinateur (Photo ou Vidéo)
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="relative cursor-pointer px-4 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>{isUploading ? "Téléversement..." : "Sélectionner un fichier..."}</span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm"
                    onChange={handleHeroFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-zinc-500 text-center sm:text-left">
                  Accepte images (JPG, PNG) et vidéos (MP4).
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  URL ou chemin direct du média :
                </label>
                <input
                  type="text"
                  value={heroMediaUrl}
                  onChange={(e) => setHeroMediaUrl(e.target.value)}
                  placeholder="/images/Hero1.jpeg ou https://.../video.mp4"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Text Customization */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Titre Principal du Hero
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Badge de l'Atelier
                </label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Description / Texte d'accroche
                </label>
                <textarea
                  rows={3}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSaveHeroSettings}
                disabled={isSavingHero || isUploading}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSavingHero
                    ? "Enregistrement en cours..."
                    : "Enregistrer les modifications pour l'Accueil"}
                </span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500 text-[11px]">Les changements s'appliquent en direct.</span>
                <Link
                  href="/"
                  target="_blank"
                  className="text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Ouvrir l'Accueil dans un nouvel onglet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-obsidian-850 border border-gold-500/20 rounded-3xl p-6 shadow-xl sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Aperçu en Direct sur la Page d'Accueil
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-mono border border-gold-500/20 uppercase">
                  {heroMediaType}
                </span>
              </div>

              {/* Realistic Mockup Box */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
                {/* Background media */}
                {heroMediaType === "video" ? (
                  <video
                    key={heroMediaUrl}
                    src={heroMediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
                  />
                ) : (
                  <Image
                    key={heroMediaUrl}
                    src={heroMediaUrl}
                    alt="Aperçu Hero"
                    fill
                    sizes="500px"
                    className="object-cover opacity-35 filter brightness-75 scale-105"
                  />
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/70 via-obsidian-950/40 to-obsidian-950" />

                {/* Content Overlay */}
                <div className="relative z-10 max-w-xs space-y-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-obsidian-900/80 border border-gold-500/40 text-gold-300 text-[9px] font-medium">
                    <span className="w-1 h-1 rounded-full bg-gold-400" />
                    <span className="truncate">{heroBadge}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    {heroTitle}
                  </h3>

                  <p className="text-[10px] text-zinc-300 line-clamp-3 leading-relaxed">
                    {heroDescription}
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-obsidian-950 text-[10px] font-bold shadow">
                      Catalogue
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium">
                      WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-obsidian-850 border border-white/5 text-[11px] text-zinc-400 space-y-1">
                <span className="text-white font-semibold block">Source active :</span>
                <span className="font-mono text-[10px] text-gold-400 break-all block">
                  {heroMediaUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 1B: SITE ICON & LOGO MANAGEMENT
      ======================================================== */}
      {activeTab === "icon" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Configuration Form */}
          <div className="lg:col-span-7 bg-obsidian-850 border border-gold-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-2">
                <Gem className="w-3.5 h-3.5" />
                <span>Identité Visuelle &amp; Favicon</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">
                Icône &amp; Favicon du Site
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Modifiez l'icône du site en direct. Elle s'affiche dans l'onglet du navigateur (favicon), dans la barre de navigation (logo), dans le pied de page et lors de l'ajout en favoris sur smartphone.
              </p>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Logos &amp; Créations de l'Atelier (Sélection en 1 clic)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {iconPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSiteIconUrl(preset.url)}
                    className={`relative group rounded-2xl overflow-hidden aspect-square border transition-all p-1.5 flex flex-col items-center justify-center bg-obsidian-900 ${
                      siteIconUrl === preset.url
                        ? "border-gold-400 ring-2 ring-gold-400/50 scale-[1.05]"
                        : "border-white/10 hover:border-gold-500/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={preset.url}
                        alt={preset.label}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                    {siteIconUrl === preset.url && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload or Custom URL */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Ou Téléverser une Nouvelle Icône / Logo
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="relative cursor-pointer px-5 py-3 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>{isUploadingIcon ? "Téléversement en cours..." : "Choisir un fichier (PNG, JPG, ICO, SVG)..."}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                    onChange={handleIconFileUpload}
                    disabled={isUploadingIcon}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-zinc-500 text-center sm:text-left">
                  Recommandé : image carrée (ex: 512×512 px) sur fond transparent ou noir.
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Chemin d'accès ou URL directe :
                </label>
                <input
                  type="text"
                  value={siteIconUrl}
                  onChange={(e) => setSiteIconUrl(e.target.value)}
                  placeholder="/images/logo.png ou /uploads/..."
                  className="w-full bg-obsidian-900 border border-gold-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="space-y-3 pt-3">
              <button
                onClick={handleSaveIconSettings}
                disabled={isSavingIcon || isUploadingIcon}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-xl shadow-gold-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSavingIcon
                    ? "Enregistrement en cours..."
                    : "Enregistrer et Activer l'Icône du Site"}
                </span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-500 text-[11px]">
                  Actualise l'onglet du navigateur, le logo navbar et le pied de page.
                </span>
                <Link
                  href="/"
                  target="_blank"
                  className="text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Voir le site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Realistic Live Mockups */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-obsidian-850 border border-gold-500/20 rounded-3xl p-6 shadow-xl sticky top-28 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Aperçu Réaliste en Temps Réel
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-mono border border-gold-500/20">
                  FAVICON &amp; LOGO
                </span>
              </div>

              {/* 1. Browser Tab Mockup */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
                  1. Dans l'onglet du navigateur (Favicon)
                </span>
                <div className="rounded-xl bg-obsidian-950 border border-white/10 p-2 shadow-inner">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-obsidian-850 border border-gold-500/20 rounded-lg max-w-[260px] shadow-sm">
                    <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={siteIconUrl}
                        alt="Favicon"
                        fill
                        sizes="16px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-zinc-200 truncate font-sans">
                      JQ BAGS — Haute Maroquinerie
                    </span>
                    <span className="text-zinc-500 text-[10px] ml-auto">×</span>
                  </div>
                </div>
              </div>

              {/* 2. Navbar Logo Mockup */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
                  2. Dans l'en-tête du site (Navbar)
                </span>
                <div className="p-3 rounded-xl bg-obsidian-950 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold-500/40 p-0.5 shadow-md">
                      <Image
                        src={siteIconUrl}
                        alt="Logo"
                        fill
                        sizes="36px"
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <span className="font-serif text-sm font-bold tracking-widest text-white block">
                        JQ BAGS
                      </span>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-gold-400 font-sans block -mt-0.5">
                        Perles &amp; Élégance
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span>Accueil</span>
                    <span>Collections</span>
                  </div>
                </div>
              </div>

              {/* 3. Mobile Bookmark / App Icon Mockup */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
                  3. Raccourci Écran d'Accueil Mobile
                </span>
                <div className="p-3 rounded-xl bg-obsidian-950 border border-white/10 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-gold-500/30 p-1 bg-obsidian-900 shadow-lg">
                    <Image
                      src={siteIconUrl}
                      alt="App Icon"
                      fill
                      sizes="48px"
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">JQ BAGS</span>
                    <span className="text-[10px] text-zinc-500 block">jqbags.com</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-obsidian-900 border border-white/5 text-[11px] text-zinc-400 space-y-1">
                <span className="text-white font-semibold block">Fichier sélectionné :</span>
                <span className="font-mono text-[10px] text-gold-400 break-all block">
                  {siteIconUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: PRODUCTS TABLE
      ======================================================== */}
      {activeTab === "products" && (
        <div className="rounded-2xl bg-obsidian-850 border border-gold-500/15 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-800 text-zinc-400 uppercase tracking-wider border-b border-gold-500/10">
                <tr>
                  <th className="py-3 px-4">Création</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4 text-center">Vedette</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filteredProducts.map((p) => {
                  const currentPrice = p.promoPrice ?? p.price;
                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-obsidian-950 shrink-0 border border-white/10">
                            <Image src={p.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              /produits/{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-obsidian-850 border border-gold-500/30 text-gold-400 font-medium text-[11px]">
                          {p.category?.name || "Catégorie"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-serif">
                        <span className="font-bold text-white">{formatPrice(currentPrice)}</span>
                        {p.promoPrice && (
                          <span className="text-[10px] text-zinc-500 line-through block">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            p.isFeatured
                              ? "bg-gold-500/20 border-gold-400 text-gold-400"
                              : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"
                          }`}
                          title="Basculer statut vedette"
                        >
                          <Star className={`w-4 h-4 ${p.isFeatured ? "fill-gold-400" : ""}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className={p.stock > 0 ? "text-emerald-400" : "text-rose-400"}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/produits/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                            title="Voir en boutique"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: ORDERS LIST
      ======================================================== */}
      {activeTab === "orders" && (
        <div className="rounded-2xl bg-obsidian-850 border border-gold-500/15 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-800 text-zinc-400 uppercase tracking-wider border-b border-gold-500/10">
                <tr>
                  <th className="py-3 px-4">Commande</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Règlement</th>
                  <th className="py-3 px-4">Statut Paiement</th>
                  <th className="py-3 px-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold-400">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{o.customerName}</strong>
                      <span className="text-[11px] text-zinc-500">{o.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{formatDate(o.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-zinc-300">
                        {o.paymentMethod === "FAPSHI" ? "Fapshi (MoMo/Orange)" : o.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.paymentStatus === "SUCCESSFUL"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-white">
                      {formatPrice(o.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-obsidian-850 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-white mb-4">
              Ajouter une Nouvelle Création
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex : Sac Clutch Soirée Diamant"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Stock initial
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="45000"
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Prix Promo (FCFA) (Optionnel)
                  </label>
                  <input
                    type="number"
                    value={newProdPromoPrice}
                    onChange={(e) => setNewProdPromoPrice(e.target.value)}
                    placeholder="38000"
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Chemin de l'image principale
                </label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="/images/Sac 1.jpeg"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={newProdDimensions}
                    onChange={(e) => setNewProdDimensions(e.target.value)}
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Matériaux
                  </label>
                  <input
                    type="text"
                    value={newProdMaterial}
                    onChange={(e) => setNewProdMaterial(e.target.value)}
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  placeholder="Description complète du modèle..."
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  checked={newProdFeatured}
                  onChange={(e) => setNewProdFeatured(e.target.checked)}
                  className="accent-gold-500"
                />
                <span>Mettre en avant sur la page d'accueil (En Vedette)</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-4"
              >
                {isSubmitting ? "Enregistrement..." : "Créer le Produit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
