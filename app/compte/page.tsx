"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderTicketModal } from "@/components/ticket/OrderTicketModal";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  User,
  Package,
  LogOut,
  Download,
  Calendar,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

export default function ComptePage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 text-center">
        <p className="text-gold-400 font-serif">Chargement de votre espace personnel...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 max-w-md mx-auto text-center space-y-6">
        <div className="p-8 rounded-3xl bg-obsidian-850 border border-gold-500/20 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto text-gold-400">
            <User className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Espace Client JQ BAGS
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Connectez-vous pour consulter vos commandes en cours, accéder à vos reçus officiels et
            bénéficier de vos privilèges client.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-gold-500/25"
          >
            Se Connecter ou Créer un Compte
          </button>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-1">
            Espace Privilège
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">
            Bonjour, {session.user.name || "Client"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {(session.user as any).role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-gold-500/20 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tableau de Bord Admin</span>
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-obsidian-850 border border-gold-500/15 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={48}
                height={48}
                className="rounded-full border border-gold-500/40"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center font-bold text-gold-400 text-lg">
                {session.user.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-white text-base truncate">
                {session.user.name || "Client Privilège"}
              </h3>
              <span className="text-xs text-gold-400 block font-mono truncate">
                {session.user.email}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-zinc-400">
            <div>
              <span className="text-zinc-500 block">Téléphone</span>
              <span className="text-zinc-200">
                {(session.user as any).phone || "Non renseigné"}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">Statut Client</span>
              <span className="text-gold-400 font-semibold">Membre Atelier JQ BAGS</span>
            </div>
          </div>
        </div>

        {/* Orders History List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-400" />
              <span>Historique de mes Commandes ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 rounded-3xl bg-obsidian-850 border border-gold-500/10 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-white">
                Aucune commande enregistrée
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Vos commandes passées apparaîtront ici avec leur ticket téléchargeable et leur suivi.
              </p>
              <Link
                href="/produits"
                className="inline-block px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs"
              >
                Explorer la boutique
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-obsidian-850 border border-gold-500/12 hover:border-gold-500/25 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-white/10 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-400 block text-[11px]">Réf. Commande</span>
                      <strong className="font-mono text-sm text-gold-400">
                        {order.orderNumber}
                      </strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === "SUCCESSFUL"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {order.paymentStatus === "SUCCESSFUL"
                          ? "Payé (Fapshi)"
                          : order.paymentStatus === "FAILED"
                          ? "Échoué"
                          : "En attente"}
                      </span>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-2">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="text-white">
                          • {item.name} <span className="text-zinc-500">(x{item.quantity})</span>
                        </span>
                        <span className="text-zinc-300 font-serif">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar of order */}
                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-zinc-400">Total :</span>
                      <span className="font-serif text-lg font-bold text-gold-400">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTicketOrder(order)}
                        className="px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger le Ticket</span>
                      </button>

                      <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}?text=Bonjour,%20je%20souhaite%20des%20informations%20sur%20ma%20commande%20${order.orderNumber}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium"
                      >
                        Suivi WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicketOrder && (
        <OrderTicketModal
          order={selectedTicketOrder}
          isOpen={Boolean(selectedTicketOrder)}
          onClose={() => setSelectedTicketOrder(null)}
        />
      )}
    </div>
  );
}

