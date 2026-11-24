<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.html');
    exit;
}
require_once '../api/config.php';

$pdo = getDB();

// Stats
$stats = [];
$stats['produits']    = $pdo->query("SELECT COUNT(*) FROM produits WHERE actif=1")->fetchColumn();
$stats['categories']  = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$stats['commandes']   = $pdo->query("SELECT COUNT(*) FROM commandes")->fetchColumn();
$stats['vedettes']    = $pdo->query("SELECT COUNT(*) FROM produits WHERE vedette=1 AND actif=1")->fetchColumn();

// Derniers produits
$derniers = $pdo->query("SELECT p.*, c.nom as cat_nom FROM produits p JOIN categories c ON p.categorie_id=c.id ORDER BY p.created_at DESC LIMIT 5")->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard Admin — Perles & Élégance</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../assets/css/admin.css" />
</head>
<body class="admin-body">
  <div class="admin-sidebar">
    <div class="sidebar-brand">
      <img src="../assets/images/logo.png" alt="Logo" onerror="this.style.display='none'" />
      <span>Admin Panel</span>
    </div>
    <nav class="sidebar-nav">
      <a href="dashboard.php" class="sidebar-link active"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
      <a href="produits.php" class="sidebar-link"><i class="fas fa-shopping-bag"></i> Produits</a>
      <a href="ajouter-produit.php" class="sidebar-link"><i class="fas fa-plus-circle"></i> Ajouter Produit</a>
      <a href="settings.php" class="sidebar-link"><i class="fas fa-cogs"></i> Paramètres</a>
      <a href="../index.html" class="sidebar-link" target="_blank"><i class="fas fa-external-link-alt"></i> Voir le site</a>
      <a href="logout.php" class="sidebar-link logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </nav>
  </div>

  <div class="admin-main">
    <div class="admin-topbar">
      <h1>Tableau de bord</h1>
      <div class="admin-user"><i class="fas fa-user-circle"></i> <?= htmlspecialchars($_SESSION['admin_user']) ?></div>
    </div>

    <div class="admin-content">
      <div class="stats-grid">
        <div class="stat-card gold"><div class="stat-icon"><i class="fas fa-shopping-bag"></i></div><div class="stat-info"><span class="stat-num"><?= $stats['produits'] ?></span><span>Produits actifs</span></div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-star"></i></div><div class="stat-info"><span class="stat-num"><?= $stats['vedettes'] ?></span><span>En vedette</span></div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-tags"></i></div><div class="stat-info"><span class="stat-num"><?= $stats['categories'] ?></span><span>Catégories</span></div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fab fa-whatsapp"></i></div><div class="stat-info"><span class="stat-num"><?= $stats['commandes'] ?></span><span>Commandes reçues</span></div></div>
      </div>

      <div class="admin-section">
        <div class="section-header-admin">
          <h2>Derniers produits ajoutés</h2>
          <a href="ajouter-produit.php" class="btn-admin-primary"><i class="fas fa-plus"></i> Ajouter</a>
        </div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Vedette</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              <?php foreach ($derniers as $p): ?>
              <tr>
                <td>
                  <div class="product-row-info">
                    <img src="../<?= htmlspecialchars($p['image_url']) ?>" alt="" onerror="this.src='../assets/images/placeholder.png'" />
                    <span><?= htmlspecialchars($p['nom']) ?></span>
                  </div>
                </td>
                <td><?= htmlspecialchars($p['cat_nom']) ?></td>
                <td><?= number_format($p['prix'], 0, ',', ' ') ?> F</td>
                <td><?= $p['vedette'] ? '<span class="badge gold-badge">✦ Oui</span>' : '<span class="badge">Non</span>' ?></td>
                <td><?= $p['stock'] ?></td>
                <td>
                  <a href="modifier-produit.php?id=<?= $p['id'] ?>" class="btn-sm btn-edit"><i class="fas fa-edit"></i></a>
                  <a href="supprimer-produit.php?id=<?= $p['id'] ?>" class="btn-sm btn-delete" onclick="return confirm('Supprimer ce produit ?')"><i class="fas fa-trash"></i></a>
                </td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <div class="section-footer-admin">
          <a href="produits.php">Voir tous les produits →</a>
        </div>
      </div>
    </div>
  </div>
  <script src="../assets/js/admin.js"></script>
</body>
</html>

