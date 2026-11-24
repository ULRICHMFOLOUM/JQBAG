"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Gem,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

export function Navbar({ siteLogo = "/images/logo.png" }: { siteLogo?: string }) {
  const { data: session } = useSession();
  const { totalCount, setIsDrawerOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (tab: "login" | "register" = "login") => {
    setAuthDefaultTab(tab);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const isUserAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      {/* Top luxury announcement bar */}
      <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border-b border-gold-500/15 py-1.5 px-4 text-center text-xs tracking-wider text-gold-300/90 flex items-center justify-center gap-2">
        <Gem className="w-3.5 h-3.5 text-gold-400" />
        <span>Maroquinerie d'Art • Confection 100% Fait Main • Paiement Sécurisé Fapshi (Orange &amp; MTN MoMo)</span>
      </div>

      {/* Main sticky header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-obsidian-900/95 backdrop-blur-xl border-b border-gold-500/15 shadow-2xl shadow-black/60 py-3"
            : "bg-obsidian-900/70 backdrop-blur-md border-b border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-500/40 p-0.5 group-hover:border-gold-400 transition-colors shadow-lg shadow-gold-500/10">
              <Image
                src={siteLogo}
                alt="JQ BAGS"
                width={40}
                height={40}
                className="object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-200 to-gold-400 group-hover:to-gold-300 transition-all">
                JQ BAGS
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold-400/80 font-sans -mt-1">
                Perles &amp; Élégance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-200">
            <Link
              href="/"
              className="hover:text-gold-400 transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Accueil
            </Link>
            <Link
              href="/produits"
              className="hover:text-gold-400 transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Collections
            </Link>
            <Link
              href="/produits?cat=sacs"
              className="hover:text-gold-400 transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Sacs
            </Link>
            <Link
              href="/produits?cat=porte-cles"
              className="hover:text-gold-400 transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Porte-clés
            </Link>
            <Link
              href="/contact"
              className="hover:text-gold-400 transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-gold-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              Atelier &amp; Contact
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}?text=Bonjour%20JQ%20BAGS,%20je%20souhaite%20des%20renseignements%20sur%20vos%20créations.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300 bg-emerald-900/30 border border-emerald-500/30 hover:bg-emerald-800/40 hover:border-emerald-400 transition-all"
              title="Conseil Direct WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>+237 72 36 28 28</span>
            </a>

            {/* User Session / Account Button */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-gold-500/30 bg-obsidian-800/80 hover:border-gold-400 text-gold-300 transition-all text-xs"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Client"}
                      width={22}
                      height={22}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-[10px]">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-obsidian-800 border border-gold-500/25 rounded-xl shadow-2xl py-2 z-50 text-sm backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-zinc-400">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {session.user.name || session.user.email}
                      </p>
                    </div>

                    {isUserAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gold-400 hover:bg-gold-500/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Administration</span>
                      </Link>
                    )}

                    <Link
                      href="/compte"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Mes Commandes</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gold-300 bg-obsidian-800 border border-gold-500/30 hover:border-gold-400 hover:text-white transition-all shadow-md"
              >
                <UserIcon className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 hover:bg-gold-500/20 hover:border-gold-400 transition-all"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/50 animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gold-500/15 bg-obsidian-900/95 backdrop-blur-xl px-4 py-5 space-y-4">
            <nav className="flex flex-col space-y-3 text-base font-medium text-zinc-200">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold-400 py-1"
              >
                Accueil
              </Link>
              <Link
                href="/produits"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold-400 py-1"
              >
                Toutes les créations
              </Link>
              <Link
                href="/produits?cat=sacs"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold-400 py-1"
              >
                Sacs d'exception
              </Link>
              <Link
                href="/produits?cat=porte-cles"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold-400 py-1"
              >
                Porte-clés &amp; Bijoux
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold-400 py-1"
              >
                Atelier &amp; Contact
              </Link>
              <Link
                href="/panier"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-gold-400 py-1 text-gold-400 flex items-center justify-between"
              >
                <span>Mon Panier</span>
                <span className="bg-gold-500 text-obsidian-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalCount}
                </span>
              </Link>
            </nav>

            {!session && (
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => openAuth("login")}
                  className="w-full py-2.5 rounded-xl border border-gold-500/40 text-gold-300 font-medium text-center hover:bg-gold-500/10"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-center"
                >
                  Créer un compte
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authDefaultTab}
      />
    </>
  );
}
