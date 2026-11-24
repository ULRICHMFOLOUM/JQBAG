const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du peuplement de la base de données JQ BAGS...");

  // 1. Catégories
  const catSacs = await prisma.category.upsert({
    where: { slug: "sacs" },
    update: {},
    create: {
      name: "Sacs en perles",
      slug: "sacs",
      description: "Sacs de soirée, minaudières, cabas et pochettes d'exception confectionnés à la main.",
      imageUrl: "/images/Sac 1.jpeg",
    },
  });

  const catPorteCles = await prisma.category.upsert({
    where: { slug: "porte-cles" },
    update: {},
    create: {
      name: "Porte-clés & Bijoux de sac",
      slug: "porte-cles",
      description: "Porte-clés originaux, colorés, personnalisables et étincelants en perles artisanales.",
      imageUrl: "/images/Porte 1.jpeg",
    },
  });

  const catAccessoires = await prisma.category.upsert({
    where: { slug: "accessoires" },
    update: {},
    create: {
      name: "Accessoires & Bijoux",
      slug: "accessoires",
      description: "Bracelets, colliers et parures exclusives sublimés par un travail d'orfèvre en perles.",
      imageUrl: "/images/Collection 3.jpeg",
    },
  });

  // 2. Administrateur
  const adminPassword = await bcrypt.hash("Admin@2024", 10);
  await prisma.user.upsert({
    where: { email: "admin@jqbags.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Atelier JQ Admin",
      email: "admin@jqbags.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+237 72 36 28 28",
      address: "Atelier Principal JQ BAGS",
      city: "Douala",
    },
  });

  // 3. Client de démonstration
  const clientPassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      name: "Aïcha Diallo",
      email: "client@example.com",
      password: clientPassword,
      role: "USER",
      phone: "+237 6 90 12 34 56",
      address: "Boulevard de la Liberté, Akwa",
      city: "Douala",
    },
  });

  // 4. Produits
  const products = [
    {
      name: "Sac Clutch Doré Prestige",
      slug: "sac-clutch-dore-prestige",
      description: "Chef-d'œuvre de joaillerie perlée, ce sac clutch combine perles dorées miroitantes et finitions en satin de soie noir. Fermoir magnétique plaqué or, anse chaîne amovible. Confectionné en plus de 32 heures de travail minutieux.",
      price: 45000,
      promoPrice: 38000,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 1.jpeg",
      imageUrl2: "/images/Sac 2.jpeg",
      imageUrl3: "/images/Sac 3.jpeg",
      stock: 8,
      isFeatured: true,
      dimensions: "22 × 14 × 6 cm",
      material: "Perles en verre facetté et acrylique haute densité, doublure satin.",
    },
    {
      name: "Sac à Main Bohème Royal",
      slug: "sac-main-boheme-royal",
      description: "Alliance spectaculaire de géométrie et d'élégance, ce sac à main bohème est tressé à la main avec une sélection rigoureuse de perles irisées. Poignée rigide renforcée, doublure soyeuse et poche intérieure sécurisée.",
      price: 52000,
      promoPrice: null,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 4.jpeg",
      imageUrl2: "/images/Sac 5.jpeg",
      imageUrl3: "/images/Sac 6.jpeg",
      stock: 5,
      isFeatured: true,
      dimensions: "28 × 20 × 8 cm",
      material: "Perles premium haute brillance, armature renforcée fil de nylon 0.6mm.",
    },
    {
      name: "Mini Sac Bandoulière Perles d'Or",
      slug: "mini-sac-bandouliere-perles-dor",
      description: "Le compagnon idéal de vos soirées cocktail et réceptions. Sa chaîne délicate dorée s'harmonise parfaitement avec le damier de perles d'or. Léger, résistant et éclatant sous la lumière.",
      price: 39000,
      promoPrice: 34000,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 7.jpeg",
      imageUrl2: "/images/Sac 8.jpeg",
      stock: 12,
      isFeatured: true,
      dimensions: "18 × 12 × 5 cm",
      material: "Perles permium dorées, chaîne alliage hypoallergénique.",
    },
    {
      name: "Sac de Soirée Noir Impérial & Éclats d'Or",
      slug: "sac-soiree-noir-imperial",
      description: "Contraste intemporel du noir onyx et des reflets d'or pur. Ce sac de gala apporte une aura mystérieuse et ultra sophistiquée à toutes vos tenues de soirée.",
      price: 68000,
      promoPrice: 59000,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 9.jpeg",
      imageUrl2: "/images/Sac 10.jpeg",
      stock: 4,
      isFeatured: true,
      dimensions: "24 × 16 × 7 cm",
      material: "Perles onyx lustrées et perles dorées scintillantes.",
    },
    {
      name: "Pochette Vénus Ivoire Céleste",
      slug: "pochette-venus-ivoire-celeste",
      description: "La pureté des perles ivoires nacrées unie à la finesse d'un tressage haute couture. Idéale pour les mariages, galas et cérémonies somptueuses.",
      price: 49000,
      promoPrice: null,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 11.jpeg",
      imageUrl2: "/images/Sac 12.jpeg",
      stock: 6,
      isFeatured: false,
      dimensions: "20 × 13 × 5 cm",
      material: "Perles nacrées haute résistance, fermeture invisible.",
    },
    {
      name: "Sac Seau Tressé Soleil Levant",
      slug: "sac-seau-tresse-soleil-levant",
      description: "Structure cylindrique audacieuse et contemporaine. Sa silhouette sculpturale capte la lumière à chaque mouvement et rehausse instantanément votre démarche.",
      price: 58000,
      promoPrice: 49500,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 13.jpeg",
      imageUrl2: "/images/Sac 14.jpeg",
      stock: 5,
      isFeatured: true,
      dimensions: "17 × 19 × 17 cm",
      material: "Perles acryliques translucides et opaques, anse perlée doublée.",
    },
    {
      name: "Sac Box Baroque Perles de Cristal",
      slug: "sac-box-baroque-cristal",
      description: "Architecture rigide type boîte à bijoux, entièrement sertie de perles à facettes géométriques. Un bijou sculptural à porter à la main ou à l'épaule.",
      price: 62000,
      promoPrice: null,
      categoryId: catSacs.id,
      imageUrl: "/images/Sac 15.jpeg",
      imageUrl2: "/images/Sac 16.jpeg",
      stock: 3,
      isFeatured: false,
      dimensions: "19 × 14 × 7 cm",
      material: "Cristaux acryliques taillés diamant, monture rigide.",
    },
    {
      name: "Porte-clé Étoile Dorée Scintillante",
      slug: "porte-cle-etoile-doree",
      description: "Porte-clé en relief 3D en forme d'étoile. Mousqueton doré haute résistance qui habille vos clés ou sert de somptueux bijou de sac.",
      price: 8000,
      promoPrice: 6500,
      categoryId: catPorteCles.id,
      imageUrl: "/images/Porte 1.jpeg",
      imageUrl2: "/images/Collection 1.jpeg",
      stock: 25,
      isFeatured: true,
      dimensions: "10 cm de hauteur",
      material: "Perles dorées polies miroir, mousqueton acier inoxydable.",
    },
    {
      name: "Porte-clé Prénom Personnalisé Sur-Mesure",
      slug: "porte-cle-prenom-personnalise",
      description: "Personnalisez votre porte-clé avec vos initiales ou votre prénom complet. Choisissez vos nuances de perles lors de votre commande ou via notre assistance WhatsApp.",
      price: 12000,
      promoPrice: null,
      categoryId: catPorteCles.id,
      imageUrl: "/images/Porte 2.jpeg",
      imageUrl2: "/images/Collection 2.jpeg",
      stock: 30,
      isFeatured: true,
      dimensions: "Sur-mesure (environ 12 cm)",
      material: "Lettres acryliques gravées, perles bicolores au choix.",
    },
    {
      name: "Porte-clé Cœur Nacré Romantique",
      slug: "porte-cle-coeur-nacre",
      description: "Forme cœur délicate tissée en micro-perles de haute précision. Le cadeau plein d'émotion et de grâce fait main.",
      price: 7500,
      promoPrice: null,
      categoryId: catPorteCles.id,
      imageUrl: "/images/Collection 1.jpeg",
      stock: 40,
      isFeatured: false,
      dimensions: "8 cm",
      material: "Micro-perles nacrées, anneau brisé renforcé.",
    },
    {
      name: "Porte-clé Fleur Tropicale Vibrante",
      slug: "porte-cle-fleur-tropicale",
      description: "Inspiration flore équatoriale. Des pétales de perles aux teintes chatoyantes qui apportent une touche de fraîcheur et de joie à vos accessoires.",
      price: 9000,
      promoPrice: 7500,
      categoryId: catPorteCles.id,
      imageUrl: "/images/Collection 2.jpeg",
      stock: 20,
      isFeatured: false,
      dimensions: "11 cm",
      material: "Perles polies résistantes aux chocs et à l'eau.",
    },
    {
      name: "Bracelet Manchette Perles Impériales",
      slug: "bracelet-manchette-perles-imperiales",
      description: "Manchette d'apparat au motif chevron or et améthyste. Fermoir magnétique plaqué or brossé.",
      price: 18000,
      promoPrice: 15000,
      categoryId: catAccessoires.id,
      imageUrl: "/images/Collection 3.jpeg",
      imageUrl2: "/images/Collection 4.jpeg",
      stock: 15,
      isFeatured: true,
      dimensions: "Largeur 4 cm, circonférence 18 cm",
      material: "Perles de rocaille japonaises ultra-régulières, fil Fireline.",
    },
    {
      name: "Collier Ras-de-Cou Reine de Saba",
      slug: "collier-ras-de-cou-reine-de-saba",
      description: "Collier plastron somptueux. Chaque perle est positionnée pour épouser gracieusement le décolleté avec éclat.",
      price: 32000,
      promoPrice: null,
      categoryId: catAccessoires.id,
      imageUrl: "/images/Collection 5.jpeg",
      imageUrl2: "/images/Collection 6.jpeg",
      stock: 7,
      isFeatured: true,
      dimensions: "Tour de cou 38-44 cm réglable",
      material: "Perles cristal, perles dorées haute tenue, fermoir mousqueton.",
    },
    {
      name: "Ceinture Bijou d'Apparat Étoilée",
      slug: "ceinture-bijou-d-apparat",
      description: "Ceinture entièrement tissée en perles pour sublimer vos caftans, robes de soirée ou ensembles haute couture.",
      price: 42000,
      promoPrice: 36000,
      categoryId: catAccessoires.id,
      imageUrl: "/images/Collection 7.jpeg",
      imageUrl2: "/images/Collection 8.jpeg",
      stock: 6,
      isFeatured: false,
      dimensions: "Longueur 85 cm + chaîne de réglage 15 cm",
      material: "Perles facettées premium, boucle bijou dorée.",
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        price: prod.price,
        promoPrice: prod.promoPrice,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        imageUrl: prod.imageUrl,
        imageUrl2: prod.imageUrl2 || null,
        imageUrl3: prod.imageUrl3 || null,
        dimensions: prod.dimensions,
        material: prod.material,
      },
      create: prod,
    });
  }

  // 5. Paramètres globaux
  const settings = [
    { key: "site_name", value: "JQ BAGS" },
    { key: "site_tagline", value: "Sacs & Accessoires d'artisanat de luxe en perles" },
    { key: "hero_title", value: "L'Élégance Pure Façonnée en Perles" },
    { key: "hero_description", value: "Chaque pièce est une œuvre d'art réalisée à la main, alliant savoir-faire d'exception et glamour contemporain." },
    { key: "whatsapp_number", value: "23772362828" },
    { key: "contact_email", value: "contact@jqbags.com" },
    { key: "contact_address", value: "Akwa, Douala — Cameroun" },
    { key: "announcement_text", value: "✨ Livraison offerte à partir de 50 000 FCFA • Paiement Mobile Money sécurisé via Fapshi" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("✅ Base de données JQ BAGS initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

