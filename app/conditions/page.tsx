import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Gem, Truck, ShieldCheck, HelpCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation & de Vente | JQ BAGS",
  description: "Conditions générales d'utilisation et de vente de la maison d'artisanat joaillier en perles JQ BAGS.",
};

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Cadre juridique &amp; garanties</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight mb-3">
            Conditions Générales d&apos;Utilisation &amp; de Vente
          </h1>
          <p className="text-zinc-400 text-sm">
            Maison JQ BAGS • Haute Maroquinerie Perlée • Douala, Cameroun
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                01
              </span>
              Présentation de l&apos;Atelier
            </h2>
            <p>
              Le site <strong>JQ BAGS</strong> (accessible sur <em>jqbags.netlify.app</em>) est la boutique officielle de l&apos;atelier artisanal JQ BAGS, spécialisé dans la conception, la confection manuelle joaillière et la commercialisation de sacs, minaudières, pochettes et parures perlées d&apos;exception.
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                02
              </span>
              Caractère Unique des Créations Fait Main
            </h2>
            <p>
              Chaque sac ou accessoire JQ BAGS est entièrement tissé et brodé à la main par nos artisans d&apos;art. Les perles de verre, cristaux et finitions métalliques sont rigoureusement sélectionnés. De subtiles nuances dans l&apos;agencement des perles témoignent de l&apos;authenticité du travail manuel et confèrent à chaque pièce un caractère singulier et précieux.
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                03
              </span>
              Prix &amp; Modalités de Paiement
            </h2>
            <p className="mb-3">
              Les prix de nos créations sont indiqués en <strong>Francs CFA (FCFA)</strong>, toutes taxes comprises.
            </p>
            <p>
              Le règlement s&apos;effectue en ligne via les solutions sécurisées Mobile Money (<strong>MTN Mobile Money</strong> et <strong>Orange Money Cameroun</strong>) opérées par la passerelle Fapshi. La validation définitive de la commande ou le lancement de la confection sur mesure intervient dès confirmation du paiement.
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                04
              </span>
              Expédition &amp; Livraison
            </h2>
            <p className="mb-3">
              Les livraisons sont assurées à Douala, Yaoundé, dans l&apos;ensemble des régions du Cameroun ainsi qu&apos;à l&apos;international.
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-2">
              <li><strong className="text-zinc-200">Pièces en stock</strong> : expédition sous 24h à 48h ouvrées.</li>
              <li><strong className="text-zinc-200">Pièces sur commande personnalisée</strong> : délai de tissage artisanal précisé lors de la commande (généralement 3 à 7 jours).</li>
              <li>Un suivi direct par WhatsApp est proposé à chaque client dès l&apos;envoi du colis.</li>
            </ul>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                05
              </span>
              Garantie Qualité &amp; Réclamations
            </h2>
            <p>
              La maison JQ BAGS garantit la solidité des fils de tissage joaillier et la tenue des montures métalliques. En cas de constat d&apos;anomalie à la réception, notre service client est joignable sous 48h pour organiser une prise en charge prioritaire par l&apos;atelier.
            </p>
          </section>

          <section className="bg-obsidian-900/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="font-serif text-xl text-white font-semibold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
                06
              </span>
              Propriété Intellectuelle
            </h2>
            <p>
              L&apos;ensemble des modèles, motifs de perles, photographies, vidéos et textes présentés sur la boutique JQ BAGS sont la propriété exclusive de la marque. Toute reproduction sans accord préalable est formellement interdite.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

