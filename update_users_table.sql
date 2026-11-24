-- ============================================================
-- MISE À JOUR : Table clients/utilisateurs
-- Ce script ajoute les tables pour les clients (si elles n'existent pas)
-- ============================================================

USE boutique_perles;

-- Table utilisateurs/clients (crée si n'existe pas)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  telephone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  adresse TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les mots de passe oublié (crée si n'existe pas)
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(200) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table commandes clients (crée si n'existe pas)
CREATE TABLE IF NOT EXISTS user_commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  produits TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_attente','confirme','termine','annule') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

