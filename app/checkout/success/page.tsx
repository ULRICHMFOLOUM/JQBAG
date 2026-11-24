"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderTicketModal } from "@/components/ticket/OrderTicketModal";
import {
  CheckCircle2,
  Gem,
  Download,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || searchParams.get("orderId");
  const transId = searchParams.get("transId");
  const isSimulated = searchParams.get("simulated") === "true";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#fef08a", "#ffffff", "#10b981"],
      });
    } catch (e) {
      // Confetti fallback
    }

    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-gold-500/40 shadow-2xl space-y-6">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <Gem className="w-3.5 h-3.5" />
          <span>Paiement &amp; Commande Enregistrés</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Merci pour votre commande !
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto font-light leading-relaxed">
          Votre commande a été transmise à notre atelier JQ BAGS avec succès.
          Chaque pièce sera préparée avec la plus grande délicatesse.
        </p>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-zinc-400">Référence de Commande</span>
            <strong className="text-sm font-mono text-gold-400">{order.orderNumber}</strong>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Destinataire</span>
            <span className="text-white font-medium">{order.customerName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Mode de Règlement</span>
            <span className="text-emerald-400 font-semibold">
              {order.paymentMethod === "FAPSHI"
                ? "Paiement Mobile Money (Fapshi)"
                : order.paymentMethod}
            </span>
          </div>

          {transId && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Transaction Fapshi ID</span>
              <span className="text-zinc-300 font-mono text-[11px]">{transId}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
            <span className="text-zinc-400">Montant Total Réglé</span>
            <span className="font-serif text-lg font-bold text-gold-400">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      )}

      {isSimulated && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          ✨ Mode simulation Fapshi actif. Pour activer les transactions réelles MTN &amp; Orange Money, renseignez vos clés API Fapshi dans le fichier .env.
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        {order && (
          <button
            onClick={() => setTicketModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger mon Reçu / Ticket</span>
          </button>
        )}

        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}?text=Bonjour%20JQ%20BAGS,%20je%20viens%20de%20régler%20ma%20commande%20${orderNumber || ""}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Suivi sur WhatsApp</span>
        </a>

        <Link
          href="/produits"
          className="px-6 py-3.5 rounded-xl border border-white/15 hover:bg-white/5 text-zinc-300 font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continuer mes Achats</span>
        </Link>
      </div>

      {/* Ticket Modal */}
      {order && (
        <OrderTicketModal
          order={order}
          isOpen={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
      <Suspense fallback={<div className="text-gold-400 font-serif">Chargement des détails de votre commande...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
