import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | JQ BAGS",
  description: "Politique de protection des données personnelles et de confidentialité de la maison JQ BAGS.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-zinc-300 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        {/* En-tête */}
        <div className="border-b border-gold-500/20 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-medium uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protection de vos données</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight mb-3">
            Politique de Confidentialité
          </h1>
          <p className="text-zinc-400 text-sm">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                01
              </span>
              Engagement de la Maison JQ BAGS
            </h2>
            <p>
              La maison artisanale <strong>JQ BAGS</strong> accorde la plus haute importance à la préservation de la confidentialité et à la sécurité des informations personnelles de ses clients et visiteurs. Cette politique détaille avec transparence la manière dont nous recueillons, utilisons et protégeons vos données lors de votre navigation et de vos achats sur notre boutique en ligne.
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                02
              </span>
              Données collectées
            </h2>
            <p className="mb-4">
              Dans le cadre de votre expérience sur notre plateforme, nous sommes amenés à collecter :
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
              <li>
                <strong className="text-zinc-200">Authentification Google &amp; Compte client</strong> : nom, prénom, adresse e-mail et photo de profil publique transmis lors de la connexion via Google OAuth ou lors de l&apos;inscription par formulaire.
              </li>
              <li>
                <strong className="text-zinc-200">Coordonnées de commande &amp; livraison</strong> : numéro de téléphone (Orange Money ou MTN MoMo), adresse postale ou ville de livraison au Cameroun ou à l&apos;international.
              </li>
              <li>
                <strong className="text-zinc-200">Historique des commandes</strong> : articles commandés, statut de la confection artisanale et suivi des expéditions.
              </li>
            </ul>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                03
              </span>
              Utilisation de vos données
            </h2>
            <p className="mb-3">Vos données sont exclusivement utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
              <li>Permettre votre authentification sécurisée via NextAuth (Google OAuth ou identifiants).</li>
              <li>Traiter, confectionner et expédier vos créations artisanales en perles.</li>
              <li>Vous contacter par WhatsApp ou téléphone pour la coordination précise de la livraison.</li>
              <li>Vous faire parvenir, si vous y consentez, les annonces de nos collections exclusives.</li>
            </ul>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                04
              </span>
              Sécurité des paiements &amp; Partenaires
            </h2>
            <p>
              Les transactions financières sont traitées par la passerelle certifiée <strong>Fapshi</strong> (opérateurs Orange Money Cameroun et MTN Mobile Money). <strong>JQ BAGS ne stocke aucun mot de passe bancaire, code secret ou numéro de carte</strong> sur ses serveurs. Toutes les communications transitent sous protocole sécurisé chiffré SSL/TLS (HTTPS).
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                05
              </span>
              Non-divulgation à des tiers
            </h2>
            <p>
              La maison JQ BAGS ne vend, ne loue et ne cède aucune donnée personnelle à des fins commerciales ou publicitaires extérieures. Vos données sont uniquement accessibles par notre atelier et nos prestataires de livraison directs.
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                06
              </span>
              Vos droits (accès, modification, suppression)
            </h2>
            <p className="mb-4">
              Conformément aux réglementations en vigueur sur la protection des données personnelles, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression totale de vos informations.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-obsidian-950 border border-gold-500/20">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <div className="text-xs">
                <span className="text-white font-medium block">Contact du Délégué à la Protection des Données :</span>
                <a href="mailto:contact@jqbags.com" className="text-gold-400 hover:underline">
                  contact@jqbags.com
                </a>{" "}
                ou via WhatsApp au{" "}
                <a href="https://wa.me/23772362828" className="text-gold-400 hover:underline">
                  +237 72 36 28 28
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
