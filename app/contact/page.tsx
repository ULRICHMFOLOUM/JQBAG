"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Gem,
  Send,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Commande sur-mesure");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Combien de temps nécessite la confection d'une création en perles ?",
      a: "Chaque création est entièrement confectionnée à la main dans notre atelier à Douala. Les pièces en stock sont expédiées sous 24h. Pour les modèles sur-mesure ou personnalisés avec prénom, comptez 3 à 5 jours ouvrés.",
    },
    {
      q: "Quels sont les moyens de paiement acceptés ?",
      a: "Nous acceptons les règlements sécurisés par Mobile Money (MTN MoMo et Orange Money) ainsi que par Carte Bancaire via notre partenaire certifié Fapshi. Le paiement à la livraison en espèces est également disponible à Douala et Yaoundé.",
    },
    {
      q: "Puis-je commander un sac ou un porte-clé avec des couleurs personnalisées ?",
      a: "Absolument ! Notre atelier réalise vos rêves de personnalisation (choix des nuances de perles, motifs, lettrage prénom). Vous pouvez nous contacter directement sur WhatsApp pour convenir des détails avec nos maîtres artisans.",
    },
    {
      q: "Comment sont livrés les colis et dans quels délais ?",
      a: "Nous livrons à domicile à Douala en 24h et à Yaoundé sous 24h à 48h. Pour les autres villes du Cameroun et l'international, nous collaborons avec des agences fiables et DHL Express.",
    },
    {
      q: "Comment nettoyer et conserver l'éclat de mon sac en perles ?",
      a: "Nos perles de qualité supérieure conservent leur lustre d'origine sans ternir. Pour l'entretien, un simple chiffon doux en microfibre légèrement humidifié suffit. Évitez les solvants corrosifs et conservez votre sac dans son pochon protecteur.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible d'envoyer votre message");
      }

      toast.success("Votre message a été transmis à l'atelier avec succès !");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Erreur de transmission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-semibold mb-3">
          <Gem className="w-3.5 h-3.5" />
          <span>Écoute &amp; Sur-Mesure</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3">
          Atelier &amp; <span className="gold-gradient-text italic font-serif">Contact</span>
        </h1>
        <p className="text-sm text-zinc-300 font-light">
          Une question sur un modèle ? Une demande de confection personnalisée ? Notre équipe
          vous répond avec diligence et bienveillance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
        {/* Contact Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-850 border border-gold-500/20 shadow-2xl">
          <h2 className="font-serif text-xl font-bold text-white mb-2">
            Écrire à l'Atelier
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Remplissez ce formulaire et notre service client vous répondra par email ou WhatsApp sous 2 heures.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full bg-obsidian-800 border border-gold-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-obsidian-800 border border-gold-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Téléphone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6..."
                  className="w-full bg-obsidian-800 border border-gold-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Objet de la demande
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-obsidian-800 border border-gold-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 cursor-pointer transition-colors"
              >
                <option value="Commande sur-mesure">Commande sur-mesure ou personnalisation</option>
                <option value="Renseignement produit">Renseignement sur une création en ligne</option>
                <option value="Suivi de commande">Suivi d'une commande en cours</option>
                <option value="Partenariat & Événement">Partenariat &amp; Vente en gros / Cadeaux d'affaires</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Votre Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Détaillez vos souhaits (couleurs, dimensions, date souhaitée...)"
                className="w-full bg-obsidian-800 border border-gold-500/20 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-gold-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Envoi en cours..." : "Transmettre mon message"}</span>
            </button>
          </form>
        </div>

        {/* Contact Info & Coordinates */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-obsidian-850 border border-gold-500/15 shadow-xl space-y-5">
            <h2 className="font-serif text-xl font-bold text-white">
              Coordonnées de l'Atelier
            </h2>

            <div className="space-y-4 text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/15 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Adresse Principale</strong>
                  <p className="text-zinc-300 mt-0.5">
                    Quartier Akwa, Douala — République du Cameroun
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white text-sm">WhatsApp &amp; Téléphone</strong>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline block mt-0.5 font-mono"
                  >
                    +237 72 36 28 28
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/15 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Courrier Électronique</strong>
                  <a
                    href="mailto:contact@jqbags.com"
                    className="text-zinc-300 hover:text-gold-400 block mt-0.5"
                  >
                    contact@jqbags.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/15 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Horaires d'Ouverture</strong>
                  <p className="text-zinc-300 mt-0.5">
                    Lundi au Samedi : 08h30 – 19h00 (Heure de Douala)
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23772362828"}?text=Bonjour%20JQ%20BAGS,%20je%20souhaite%20échanger%20directement%20avec%20un%20artisan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir WhatsApp en Direct</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto pt-8">
        <div className="section-divider mb-10" />
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Tout savoir sur nos créations
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-obsidian-850 border border-gold-500/12 overflow-hidden transition-colors hover:border-gold-500/25"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-sm text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-200 leading-relaxed font-light border-t border-gold-500/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
