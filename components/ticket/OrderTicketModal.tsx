"use client";

import React, { useRef } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Printer, Download, X, CheckCircle2, Gem } from "lucide-react";

interface TicketProps {
  order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    shippingAddress?: string | null;
    city?: string | null;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: Date | string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      imageUrl?: string | null;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTicketModal({ order, isOpen, onClose }: TicketProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket de Commande - ${order.orderNumber} - JQ BAGS</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #111; margin: 0; padding: 24px; }
            .ticket-box { max-width: 650px; margin: 0 auto; border: 1px solid #d4af37; border-radius: 12px; overflow: hidden; }
            .ticket-header { background: linear-gradient(135deg, #0c0d12 0%, #1a1a24 100%); color: #fff; padding: 28px; text-align: center; border-bottom: 3px solid #d4af37; }
            .ticket-header h1 { margin: 0; font-size: 24px; letter-spacing: 3px; color: #d4af37; font-family: Georgia, serif; }
            .ticket-header p { margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; }
            .ticket-body { padding: 24px; }
            .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 16px; }
            .client-card { background: #fbf9f4; border-left: 4px solid #d4af37; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; color: #555; }
            td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
            .total-box { text-align: right; font-size: 18px; font-weight: bold; color: #000; padding: 14px 8px; border-top: 2px solid #d4af37; }
            .footer-note { text-align: center; font-size: 11px; color: #888; margin-top: 20px; padding-top: 14px; border-top: 1px dashed #ccc; }
            @media print {
              body { padding: 0; }
              .ticket-box { border: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleDownload = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reçu Officiel - ${order.orderNumber} - JQ BAGS</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f5f5f5; color: #111; margin: 0; padding: 24px; }
    .ticket-box { max-width: 650px; margin: 0 auto; background: #fff; border: 1px solid #d4af37; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .ticket-header { background: #0c0d12; color: #fff; padding: 28px; text-align: center; border-bottom: 3px solid #d4af37; }
    .ticket-header h1 { margin: 0; font-size: 26px; letter-spacing: 3px; color: #d4af37; }
    .ticket-body { padding: 24px; }
    .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 16px; }
    .client-card { background: #fbf9f4; border-left: 4px solid #d4af37; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; color: #555; }
    td { padding: 10px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
    .total-box { text-align: right; font-size: 18px; font-weight: bold; color: #000; padding: 14px 8px; border-top: 2px solid #d4af37; }
    .footer-note { text-align: center; font-size: 11px; color: #888; margin-top: 20px; padding-top: 14px; border-top: 1px dashed #ccc; }
  </style>
</head>
<body>
  ${printContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ticket-JQ-BAGS-${order.orderNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Modal actions */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg font-bold text-white">
              Ticket Officiel de Commande
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs flex items-center gap-1.5 transition-colors"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 text-xs flex items-center gap-1.5 transition-colors"
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Box */}
        <div
          ref={printRef}
          className="bg-white text-zinc-900 rounded-2xl overflow-hidden shadow-inner text-sm"
        >
          {/* Header */}
          <div className="ticket-header bg-gradient-to-r from-obsidian-950 via-zinc-900 to-obsidian-950 text-white p-6 text-center border-b-4 border-gold-500">
            <span className="text-gold-400 text-2xl font-serif block mb-1">✦</span>
            <h1 className="text-2xl font-bold tracking-widest text-gold-400 font-serif m-0">
              JQ BAGS
            </h1>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
              Haute Maroquinerie &amp; Accessoires en Perles Fait Main
            </p>
          </div>

          {/* Ticket Body */}
          <div className="ticket-body p-6">
            {/* Meta */}
            <div className="meta-grid flex flex-col sm:flex-row justify-between pb-4 border-b border-zinc-200 gap-2 mb-4 text-xs">
              <div>
                <span className="text-zinc-500">Référence de Commande :</span>
                <strong className="block text-sm font-mono text-zinc-900 mt-0.5">
                  {order.orderNumber}
                </strong>
              </div>
              <div>
                <span className="text-zinc-500">Date &amp; Heure :</span>
                <strong className="block text-zinc-900 mt-0.5">
                  {formatDate(order.createdAt)}
                </strong>
              </div>
              <div className="sm:text-right">
                <span className="text-zinc-500">Mode de Règlement :</span>
                <strong className="block text-emerald-700 mt-0.5">
                  {order.paymentMethod === "FAPSHI"
                    ? "Paiement Mobile Money (Fapshi)"
                    : order.paymentMethod === "WHATSAPP"
                    ? "Confirmation WhatsApp"
                    : "Paiement à la Livraison"}
                </strong>
              </div>
            </div>

            {/* Client Card */}
            <div className="client-card bg-amber-50/70 border-l-4 border-gold-500 p-3.5 rounded mb-4 text-xs">
              <span className="font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Informations du Destinataire
              </span>
              <p className="m-0 text-zinc-800">
                <strong>Nom :</strong> {order.customerName}
              </p>
              <p className="m-0 text-zinc-800">
                <strong>Email :</strong> {order.customerEmail}
              </p>
              {order.customerPhone && (
                <p className="m-0 text-zinc-800">
                  <strong>Téléphone / WhatsApp :</strong> {order.customerPhone}
                </p>
              )}
              {order.shippingAddress && (
                <p className="m-0 text-zinc-800">
                  <strong>Adresse :</strong> {order.shippingAddress}
                  {order.city ? `, ${order.city}` : ""}
                </p>
              )}
            </div>

            {/* Articles Table */}
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b-2 border-zinc-200 text-zinc-500 uppercase">
                  <th className="py-2 text-left">Article</th>
                  <th className="py-2 text-center">Qté</th>
                  <th className="py-2 text-right">Prix Unitaire</th>
                  <th className="py-2 text-right">Sous-Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium text-zinc-900">
                      {idx + 1}. {item.name}
                    </td>
                    <td className="py-2.5 text-center text-zinc-600">{item.quantity}</td>
                    <td className="py-2.5 text-right text-zinc-600">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-zinc-900">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="total-box pt-4 border-t-2 border-gold-500 flex justify-between items-baseline">
              <span className="text-zinc-600 font-semibold text-sm">TOTAL À RÉGLER :</span>
              <span className="text-xl font-bold font-serif text-amber-700">
                {formatPrice(order.totalAmount)}
              </span>
            </div>

            {/* Footer note */}
            <div className="footer-note mt-6 pt-4 border-t border-dashed border-zinc-300 text-center text-[11px] text-zinc-500 leading-relaxed">
              <p className="m-0">
                Merci pour votre confiance en l'artisanat JQ BAGS ! Chaque perle est assemblée avec
                passion.
              </p>
              <p className="m-0 mt-1">
                Atelier Akwa, Douala • Assistance WhatsApp : +237 72 36 28 28 • www.jqbags.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

