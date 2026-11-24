# JQ BAGS — Haute Maroquinerie & Accessoires en Perles (Next.js 14)

Refonte complète et modernisation luxueuse du site de vente de sacs et porte-clés artisanaux en perles **JQ BAGS / Perles & Élégance**, développé avec **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM (SQLite / MySQL)**, **NextAuth.js (Google Auth & Email)**, composants d'animation **21st.dev / Aceternity UI / Magic UI**, et intégration de la passerelle de paiement **Fapshi (MTN Mobile Money, Orange Money & Cartes bancaires)**.

---

## 🌟 Fonctionnalités Implémentées

### 1. Design & Expérience Utilisateur (21st.dev, Aceternity UI, Magic UI)
* **Esthétique Haute Joaillerie** : Palette sombre d'obsidienne (`#07070a`), dorures éclatantes (`#d4af37`), reflets nacrés et satinés.
* **Composants Aceternity UI** :
  * **Spotlight** : Effet de projecteur dynamique sur la bannière Hero.
  * **Sparkles Core** : Particules et étoiles étincelantes reproduisant le reflet des perles.
  * **Bento Grid** : Mise en valeur moderne des 3 univers de la marque (Sacs, Porte-clés, Accessoires).
  * **Moving Borders** : Bordures lumineuses et effets de survol haut de gamme.
* **Composants Magic UI** :
  * **Shimmer Button** : Bouton à lueur scintillante pour les appels à l'action.
  * **Border Beam** : Faisceau lumineux parcourant les cartes et fenêtres modales.
  * **Infinite Marquee** : Défilement fluide des engagements qualité (100% fait main, paiements Fapshi, expédition express).
* **Animations interactives** : Tiroir de panier glissant (`CartDrawer`), modale de connexion avec transitions fluides, et pluie de confettis dorés (`canvas-confetti`) lors de la validation d'une commande.

### 2. Base de Données & ORM Prisma
* **Modèles complets** :
  * `User`, `Account`, `Session` (Authentification NextAuth & OAuth Google)
  * `Category` (Sacs, Porte-clés, Accessoires de Luxe)
  * `Product` (Prix, Prix promo, Galerie d'images réelles, Dimensions, Matériaux, Stock, Statut Vedette)
  * `Order` & `OrderItem` (Référence `CMD-XXXXXX`, statut paiement, montant total, suivi livraison)
  * `Setting` (Paramètres configurables du site)
  * `ContactMessage` (Messages envoyés à l'atelier)
* **Base de données par défaut** : SQLite (`file:./dev.db`) prêt à l'emploi sans nécessiter de configuration externe, avec script de peuplement complet (`prisma/seed.js`) incluant plus de 14 créations avec les images réelles de l'atelier !

### 3. Système de Paiement Fapshi (Cameroun & Afrique Centrale)
* **Passerelle Fapshi intégrée** :
  * Support de **MTN Mobile Money**, **Orange Money** et **Cartes bancaires** (Visa / Mastercard).
  * Endpoint `POST /api/checkout/fapshi` qui crée la commande et initialise la transaction Fapshi via l'API officielle (`https://live.fapshi.com` ou `https://sandbox.fapshi.com`).
  * Endpoint `POST /api/webhooks/fapshi` pour la confirmation automatique et sécurisée des règlements.
  * **Mode simulation intelligent** : Si les clés API Fapshi ne sont pas encore renseignées, une simulation réaliste permet de tester tout le parcours d'achat sans interruption !

### 4. Authentification & Google Auth
* **Google OAuth** : Bouton officiel avec logo Google permettant la connexion en 1 clic via Google Cloud Console.
* **Identifiants classiques** : Inscription avec hachage sécurisé `bcryptjs`, connexion et réinitialisation de mot de passe.
* **Espace Client (`/compte`)** : Consultation de l'historique de commandes, états de paiement et réémission des tickets.

### 5. Ticket de Commande Officiel & WhatsApp
* **Génération de ticket moderne** :
  * Reçu de commande officiel avec référence unique (`CMD-XXXXXX`), date, coordonnées du client, récapitulatif détaillé et total.
  * Téléchargeable au format **HTML prêt à l'emploi** ou imprimable directement.
  * Authentification requise pour y inscrire les coordonnées du client (conformément au cahier des charges).
* **Commande directe sur WhatsApp** : Bouton pré-rempli avec le panier ou le produit pour échange direct avec l'atelier au **+237 72 36 28 28**.

### 6. Tableau de Bord Administrateur (`/admin`)
* Vue d'ensemble des revenus encaissés via Fapshi, du volume de commandes et des produits actifs.
* Tableau de gestion des produits avec bascule du statut "En Vedette" en 1 clic.
* Modale d'ajout rapide de nouvelles créations au catalogue.
* Suivi des commandes en temps réel.
* Compte administrateur par défaut : `admin@jqbags.com` / `Admin@2024`.

---

## 🚀 Démarrage Rapide

### 1. Lancer le serveur de développement
Dans le dossier du projet :
```bash
npm run dev
```
Ouvrez ensuite votre navigateur sur **http://localhost:3000**.

### 2. Variables d'Environnement (`.env`)
Le fichier `.env` est déjà créé avec des valeurs par défaut pour un fonctionnement immédiat :
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="jq-bags-luxury-secret-key-32-chars-long-super-secure"

# Google OAuth (Créer dans Google Cloud Console > Identifiants > OAuth 2.0)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Passerelle de paiement Fapshi (https://fapshi.com)
FAPSHI_API_USER=""
FAPSHI_API_KEY=""
FAPSHI_ENV="sandbox" # ou "live" en production

NEXT_PUBLIC_SITE_NAME="JQ BAGS"
NEXT_PUBLIC_WHATSAPP_NUMBER="23772362828"
```

### 3. Commandes Utiles
* **Relancer le peuplement de la base** : `npm run db:seed`
* **Ouvrir l'explorateur de base de données visuel** : `npx prisma studio`
* **Compiler pour la production** : `npm run build`
* **Lancer la production** : `npm run start`

---

## 📁 Architecture du Projet
```
├── app/
│   ├── layout.tsx              # Layout racine (Polices Playfair & Montserrat, Navbar, CartDrawer, Footer)
│   ├── page.tsx                # Page d'accueil (Hero Spotlight, Sparkles, Bento Grid, Vedettes)
│   ├── produits/
│   │   ├── page.tsx            # Catalogue complet avec filtres et recherche
│   │   └── [slug]/page.tsx     # Fiche détaillée du produit avec galerie et spécifications
│   ├── panier/page.tsx         # Panier d'achat, téléchargement ticket et paiement
│   ├── checkout/
│   │   ├── page.tsx            # Formulaire de livraison et sélection Fapshi / Cash / WhatsApp
│   │   └── success/page.tsx    # Écran de succès avec confettis et ticket
│   ├── compte/page.tsx         # Espace client et historique des commandes
│   ├── contact/page.tsx        # Formulaire de contact, adresse atelier et FAQ interactive
│   ├── admin/page.tsx          # Tableau de bord administrateur
│   └── api/
│       ├── auth/               # Route NextAuth & route d'inscription
│       ├── checkout/fapshi/    # Initialisation paiement Fapshi
│       ├── webhooks/fapshi/    # Réception notification paiement Fapshi
│       ├── orders/             # Gestion et consultation des commandes
│       ├── contact/            # Enregistrement des messages
│       └── admin/              # Statistiques et CRUD produits
├── components/
│   ├── ui/                     # Composants 21st.dev / Aceternity / Magic UI (Spotlight, Sparkles, Bento, etc.)
│   ├── layout/                 # Navbar & Footer luxueux
│   ├── auth/                   # Modale de connexion avec Google Auth
│   ├── products/               # Cartes produits et vue catalogue
│   ├── cart/                   # Panier glissant (CartDrawer)
│   └── ticket/                 # Générateur de ticket/reçu imprimable et téléchargeable
├── lib/
│   ├── prisma.ts               # Client Prisma singleton
│   ├── auth.ts                 # Configuration NextAuth (Google + Credentials)
│   ├── fapshi.ts               # Module d'intégration Fapshi & simulation
│   ├── cart-context.tsx        # Gestion d'état globale du panier
│   └── utils.ts                # Utilitaires (formatage FCFA, dates, classes CSS)
├── prisma/
│   ├── schema.prisma           # Schéma de base de données
│   └── seed.js                 # Script de peuplement avec 14+ produits réels
└── public/
    └── images/                 # Galerie des images haute résolution de l'atelier
```

