<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header('Location: login.html'); exit; }
require_once '../api/config.php';
$pdo = getDB();

$search = trim($_GET['q'] ?? '');
$cat    = intval($_GET['cat'] ?? 0);

$sql = "SELECT p.*, c.nom as cat_nom FROM produits p JOIN categories c ON p.categorie_id=c.id WHERE 1=1";
$params = [];
if ($search) { $sql .= " AND p.nom LIKE :q"; $params[':q'] = "%$search%"; }
if ($cat)    { $sql .= " AND p.categorie_id = :cat"; $params[':cat'] = $cat; }
$sql .= " ORDER BY p.created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$produits = $stmt->fetchAll();
$categories = $pdo->query("SELECT * FROM categories")->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gestion Produits — Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../assets/css/admin.css" />
</head>
<body class="admin-body">
  <div class="admin-sidebar">
    <div class="sidebar-brand"><span>Admin Panel</span></div>
    <nav class="sidebar-nav">
      <a href="dashboard.php" class="sidebar-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
      <a href="produits.php" class="sidebar-link active"><i class="fas fa-shopping-bag"></i> Produits</a>
      <a href="ajouter-produit.php" class="sidebar-link"><i class="fas fa-plus-circle"></i> Ajouter Produit</a>
      <a href="settings.php" class="sidebar-link"><i class="fas fa-cogs"></i> Paramètres</a>
      <a href="../index.html" class="sidebar-link" target="_blank"><i class="fas fa-external-link-alt"></i> Voir le site</a>
      <a href="logout.php" class="sidebar-link logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </nav>
  </div>
  <div class="admin-main">
    <div class="admin-topbar">
      <h1>Gestion des Produits</h1>
      <a href="ajouter-produit.php" class="btn-admin-primary"><i class="fas fa-plus"></i> Nouveau Produit</a>
    </div>
    <div class="admin-content">
      <?php if (isset($_GET['msg'])): ?>
        <div class="alert alert-<?= $_GET['type'] ?? 'success' ?>"><?= htmlspecialchars($_GET['msg']) ?></div>
      <?php endif; ?>

      <form method="GET" class="admin-filters">
        <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="Rechercher..." />
        <select name="cat">
          <option value="">Toutes catégories</option>
          <?php foreach ($categories as $c): ?>
          <option value="<?= $c['id'] ?>" <?= $cat==$c['id']?'selected':'' ?>><?= htmlspecialchars($c['nom']) ?></option>
          <?php endforeach; ?>
        </select>
        <button type="submit" class="btn-admin-outline"><i class="fas fa-search"></i> Filtrer</button>
        <a href="produits.php" class="btn-admin-outline">Réinitialiser</a>
      </form>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead><tr><th>Image</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Promo</th><th>Stock</th><th>Vedette</th><th>Actif</th><th>Actions</th></tr></thead>
          <tbody>
            <?php if (empty($produits)): ?>
              <tr><td colspan="9" class="text-center">Aucun produit trouvé.</td></tr>
            <?php endif; ?>
            <?php foreach ($produits as $p): ?>
            <tr>
              <td><img src="../<?= htmlspecialchars($p['image_url']) ?>" class="table-thumb" alt="" onerror="this.src='../assets/images/placeholder.png'" /></td>
              <td><?= htmlspecialchars($p['nom']) ?></td>
              <td><?= htmlspecialchars($p['cat_nom']) ?></td>
              <td><?= number_format($p['prix'], 0, ',', ' ') ?> F</td>
              <td><?= $p['prix_promo'] ? number_format($p['prix_promo'], 0, ',', ' ').' F' : '—' ?></td>
              <td><?= $p['stock'] ?></td>
              <td><?= $p['vedette'] ? '✦' : '—' ?></td>
              <td><span class="badge <?= $p['actif'] ? 'badge-success' : 'badge-danger' ?>"><?= $p['actif'] ? 'Oui' : 'Non' ?></span></td>
              <td>
                <a href="modifier-produit.php?id=<?= $p['id'] ?>" class="btn-sm btn-edit" title="Modifier"><i class="fas fa-edit"></i></a>
                <a href="supprimer-produit.php?id=<?= $p['id'] ?>" class="btn-sm btn-delete" title="Supprimer" onclick="return confirm('Supprimer définitivement ce produit ?')"><i class="fas fa-trash"></i></a>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>

