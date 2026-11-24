"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gem, Phone, Mail, MapPin, Heart, Send } from "lucide-react";
import { toast } from "sonner";

export function Footer({ siteLogo = "/images/logo.png" }: { siteLogo?: string }) {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Merci ! Vous êtes inscrit(e) aux privilèges exclusifs JQ BAGS.");
    setEmail("");
  };

  return (
    <footer className="bg-obsidian-900 border-t border-gold-500/15 text-zinc-400 font-sans relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gold-500/5 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-500/40 p-0.5">
                <Image
                  src={siteLogo}
                  alt="JQ BAGS"
                  width={44}
                  height={44}
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-white">
                  JQ BAGS
                </span>
                <span className="block text-[10px] uppercase tracking-[0.3em] text-gold-400 font-sans">
                  Haute Maroquinerie Perlée
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-zinc-300 max-w-sm">
              L'atelier JQ BAGS confectionne avec passion et précision joaillière des sacs,
              pochettes et accessoires d'art en perles faits main. Chaque création est une pièce
              exclusive pensée pour sublimer votre allure.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gold-400/90">
              <Gem className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Conception artisanale • Pièces numérotées &amp; finitions durables</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-white tracking-wider text-sm uppercase">
              Nos Univers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/produits" className="hover:text-gold-400 transition-colors text-zinc-300">
                  Toute la Collection
                </Link>
              </li>
              <li>
                <Link href="/produits?cat=sacs" className="hover:text-gold-400 transition-colors text-zinc-300">
                  Sacs de Soirée &amp; Clutches
                </Link>
              </li>
              <li>
                <Link href="/produits?cat=porte-cles" className="hover:text-gold-400 transition-colors text-zinc-300">
                  Porte-clés &amp; Breloques
                </Link>
              </li>
              <li>
                <Link href="/produits?cat=accessoires" className="hover:text-gold-400 transition-colors text-zinc-300">
                  Bijoux &amp; Accessoires
                </Link>
              </li>
              <li>
                <Link href="/panier" className="hover:text-gold-400 transition-colors text-zinc-300">
                  Mon Panier d'Achat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Atelier */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-white tracking-wider text-sm uppercase">
              Atelier &amp; Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span className="text-zinc-300">Akwa, Douala — Cameroun</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors text-zinc-300"
                >
                  +237 72 36 28 28
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:contact@jqbags.com" className="hover:text-gold-400 transition-colors text-zinc-300">
                  contact@jqbags.com
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-xs uppercase text-zinc-500 tracking-wider block mb-1">
                Paiements acceptés
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <span className="px-2 py-1 rounded bg-obsidian-800 border border-gold-500/15 text-gold-300 font-mono text-[11px]">
                  Fapshi
                </span>
                <span className="px-2 py-1 rounded bg-obsidian-800 border border-white/10 text-amber-400 font-mono text-[11px]">
                  MTN MoMo
                </span>
                <span className="px-2 py-1 rounded bg-obsidian-800 border border-white/10 text-orange-400 font-mono text-[11px]">
                  Orange Money
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter & Privileges */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-white tracking-wider text-sm uppercase">
              Club Privilège
            </h4>
            <p className="text-xs leading-relaxed text-zinc-400">
              Recevez les avant-premières de nos collections limitées et les offres réservées à nos membres.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="w-full bg-obsidian-800 border border-gold-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 pr-10"
                />
                <button
                  type="submit"
                  aria-label="S'inscrire"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-gold-500 text-obsidian-950 hover:bg-gold-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} JQ BAGS. Tous droits réservés.</p>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <Link href="/confidentialite" className="hover:text-gold-400 transition-colors">
              Confidentialité
            </Link>
            <span>•</span>
            <Link href="/conditions" className="hover:text-gold-400 transition-colors">
              Conditions Générales
            </Link>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Créé avec minutie &amp; excellence</span>
            <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400 mx-1" />
            <span>au Cameroun</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
