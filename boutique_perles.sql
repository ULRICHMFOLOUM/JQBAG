-- ============================================================
-- BASE DE DONNÉES : boutique_perles
-- Importer via phpMyAdmin > Importer > choisir ce fichier
-- ============================================================

CREATE DATABASE IF NOT EXISTS boutique_perles
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE boutique_perles;

-- Table paramètres du site
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insérer les paramètres par défaut
INSERT INTO settings (setting_key, setting_value) VALUES
('hero_image', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920'),
('cat_sacs_image', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'),
('cat_portefeuille_image', 'https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?w=600'),
('site_titre', 'JQ BAGS'),
('site_description', 'Sacs & Porte-clés artisanaux en perles');

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des produits
CREATE TABLE IF NOT EXISTS produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  prix DECIMAL(10,2) NOT NULL,
  prix_promo DECIMAL(10,2) DEFAULT NULL,
  categorie_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL DEFAULT 'assets/images/placeholder.png',
  image_url_2 VARCHAR(500) DEFAULT NULL,
  image_url_3 VARCHAR(500) DEFAULT NULL,
  stock INT NOT NULL DEFAULT 10,
  vedette TINYINT(1) DEFAULT 0,
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table admin
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table commandes WhatsApp (log des demandes)
CREATE TABLE IF NOT EXISTS commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  nom_client VARCHAR(200),
  telephone VARCHAR(50),
  message TEXT,
  statut ENUM('en_attente','contacte','termine') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- DONNÉES DE DÉMONSTRATION
-- =============================================

INSERT INTO categories (nom, slug, description) VALUES
('Sacs en perles', 'sacs', 'Sacs artisanaux confectionnés à la main en perles de haute qualité'),
('Porte-clés en perles', 'porte-cles', 'Porte-clés originaux et colorés en perles artisanales'),
('Accessoires', 'accessoires', 'Autres accessoires en perles : bracelets, colliers, bijoux');

-- Mot de passe admin par défaut : Admin@2024
-- Hash bcrypt de "Admin@2024"
INSERT INTO admins (username, password_hash, email) VALUES
('admin', '$2y$10$rMKTXAEMsEQRKVaVgnVljes18C6jlCbxeoJZhFmVEHyaniJ0LnGue', 'admin@boutique-perles.com');

-- Produits de démonstration
INSERT INTO produits (nom, slug, description, prix, prix_promo, categorie_id, image_url, vedette, stock) VALUES
(
  'Sac Clutch Doré Élégance',
  'sac-clutch-dore-elegance',
  'Magnifique sac clutch entièrement réalisé à la main avec des perles dorées et noires. Parfait pour vos soirées et événements spéciaux. Fermeture magnétique, doublure en satin noir. Dimensions : 22x14 cm.',
  45000,
  38000,
  1,
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
  1,
  5
),
(
  'Sac à Main Bohème',
  'sac-main-boheme',
  'Sac à main bohème chic, tressé à la main avec des perles multicolores sur fond noir. Anse en cuir végétalien doré. Idéal pour le quotidien chic. Dimensions : 30x20 cm.',
  52000,
  NULL,
  1,
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
  1,
  3
),
(
  'Mini Sac Bandoulière Perles',
  'mini-sac-bandouliere-perles',
  'Mini sac bandoulière ultra tendance, orné de perles fines dorées. Chaîneamotible en métal doré. Intérieur avec poche zippée. Dimensions : 18x12 cm.',
  39000,
  NULL,
  1,
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
  0,
  7
),
(
  'Porte-clé Étoile Dorée',
  'porte-cle-etoile-doree',
  'Porte-clé artisanal en forme d\'étoile, réalisé avec des perles dorées et noires. Finition brillante, mousqueton en métal doré. Longueur : 10 cm.',
  8000,
  6500,
  2,
  'https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?w=400',
  1,
  20
),
(
  'Porte-clé Prénom Personnalisé',
  'porte-cle-prenom-personnalise',
  'Porte-clé unique avec votre prénom en perles lettrées. Choisissez vos couleurs ! Livraison sous 3-5 jours. Précisez le prénom lors de votre commande WhatsApp.',
  12000,
  NULL,
  2,
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
  1,
  15
),
(
  'Porte-clé Cœur Perles Fines',
  'porte-cle-coeur-perles-fines',
  'Adorable porte-clé en forme de cœur, confectionné avec des perles fines roses et dorées. Parfait comme cadeau. Longueur : 8 cm.',
  7500,
  NULL,
  2,
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  0,
  25
),
(
  'Sac Soirée Noir & Or',
  'sac-soiree-noir-or',
  'Sac de soirée luxueux alliant perles noires et dorées. Motifs géométriques exclusifs. Fermeture dorée. Livré dans un emballage cadeau. Dimensions : 20x15 cm.',
  68000,
  55000,
  1,
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
  1,
  2
),
(
  'Porte-clé Fleur Tropicale',
  'porte-cle-fleur-tropicale',
  'Porte-clé coloré en forme de fleur tropicale. Perles résistantes à l\'eau. Plusieurs coloris disponibles. Longueur : 12 cm.',
  9000,
  NULL,
  2,
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
  0,
  30
);

