<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header('Location: login.html'); exit; }
require_once '../api/config.php';
$pdo = getDB();

$success = $error = '';

// Fonction pour uploader une image
function uploadImage($file, $prefix = 'img') {
    if (!isset($file['error']) || is_array($file['error'])) {
        return null;
    }
    if ($file['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($ext, $allowed)) {
            return null;
        }
        $newName = $prefix . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $targetDir = __DIR__ . '/../assets/images/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }
        $targetPath = $targetDir . $newName;
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            return 'assets/images/' . $newName;
        }
    }
    return null;
}

// Récupérer les paramètres actuels
$settings = [];
$stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

// Récupérer les catégories avec leurs images
$categories = $pdo->query("SELECT * FROM categories ORDER BY id")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Image hero
    if (isset($_FILES['hero_image_file']) && $_FILES['hero_image_file']['error'] === UPLOAD_ERR_OK) {
        $uploaded = uploadImage($_FILES['hero_image_file'], 'hero');
        if ($uploaded) {
            $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('hero_image', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$uploaded, $uploaded]);
        }
    } elseif (!empty($_POST['hero_image_url'])) {
        $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('hero_image', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$_POST['hero_image_url'], $_POST['hero_image_url']]);
    }
    
    // Image catégorie Sacs
    if (isset($_FILES['cat_sacs_file']) && $_FILES['cat_sacs_file']['error'] === UPLOAD_ERR_OK) {
        $uploaded = uploadImage($_FILES['cat_sacs_file'], 'cat_sacs');
        if ($uploaded) {
            $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('cat_sacs_image', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$uploaded, $uploaded]);
        }
    } elseif (!empty($_POST['cat_sacs_url'])) {
        $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('cat_sacs_image', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$_POST['cat_sacs_url'], $_POST['cat_sacs_url']]);
    }
    
    // Image catégorie Porte-clés
    if (isset($_FILES['cat_cles_file']) && $_FILES['cat_cles_file']['error'] === UPLOAD_ERR_OK) {
        $uploaded = uploadImage($_FILES['cat_cles_file'], 'cat_cles');
        if ($uploaded) {
            $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('cat_portefeuille_image', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$uploaded, $uploaded]);
        }
    } elseif (!empty($_POST['cat_cles_url'])) {
        $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('cat_portefeuille_image', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$_POST['cat_cles_url'], $_POST['cat_cles_url']]);
    }
    
    // Paramètres du site
    if (!empty($_POST['site_titre'])) {
        $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('site_titre', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$_POST['site_titre'], $_POST['site_titre']]);
    }
    if (!empty($_POST['site_description'])) {
        $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES ('site_description', ?) ON DUPLICATE KEY UPDATE setting_value = ?")->execute([$_POST['site_description'], $_POST['site_description']]);
    }
    
        // Images des catégories dans la base de données
        foreach ($categories as $cat) {
            $fileKey = 'cat_image_file_' . $cat['id'];
            $urlKey = 'cat_url_' . $cat['id'];
            
            if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
                $uploaded = uploadImage($_FILES[$fileKey], 'category_' . $cat['id']);
                if ($uploaded) {
                    $pdo->prepare("UPDATE categories SET image_url = ? WHERE id = ?")->execute([$uploaded, $cat['id']]);
                }
            } elseif (!empty($_POST[$urlKey])) {
                $pdo->prepare("UPDATE categories SET image_url = ? WHERE id = ?")->execute([$_POST[$urlKey], $cat['id']]);
            }
        }
    
    $success = 'Paramètres enregistrés avec succès !';
    
    // Recharger les paramètres
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    $categories = $pdo->query("SELECT * FROM categories ORDER BY id")->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Paramètres du Site — Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../assets/css/admin.css" />
</head>
<body class="admin-body">
  <div class="admin-sidebar">
    <div class="sidebar-brand"><span>Admin Panel</span></div>
    <nav class="sidebar-nav">
      <a href="dashboard.php" class="sidebar-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
      <a href="produits.php" class="sidebar-link"><i class="fas fa-shopping-bag"></i> Produits</a>
      <a href="ajouter-produit.php" class="sidebar-link"><i class="fas fa-plus-circle"></i> Ajouter Produit</a>
      <a href="settings.php" class="sidebar-link active"><i class="fas fa-cogs"></i> Paramètres</a>
      <a href="../index.html" class="sidebar-link" target="_blank"><i class="fas fa-external-link-alt"></i> Voir le site</a>
      <a href="logout.php" class="sidebar-link logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </nav>
  </div>
  <div class="admin-main">
    <div class="admin-topbar">
      <h1>Paramètres du Site</h1>
      <a href="dashboard.php" class="btn-admin-outline"><i class="fas fa-arrow-left"></i> Retour</a>
    </div>
    <div class="admin-content">
      <?php if ($success): ?><div class="alert alert-success"><?= htmlspecialchars($success) ?></div><?php endif; ?>
      <?php if ($error): ?><div class="alert alert-danger"><?= htmlspecialchars($error) ?></div><?php endif; ?>
      
      <form method="POST" class="admin-form" enctype="multipart/form-data">
        
        <!-- Paramètres généraux -->
        <div class="form-section">
          <h3>Informations du Site</h3>
          <div class="form-row-admin">
            <div class="form-group-admin">
              <label>Titre du site</label>
              <input type="text" name="site_titre" value="<?= htmlspecialchars($settings['site_titre'] ?? 'JQ BAGS') ?>" />
            </div>
            <div class="form-group-admin">
              <label>Description</label>
              <input type="text" name="site_description" value="<?= htmlspecialchars($settings['site_description'] ?? '') ?>" />
            </div>
          </div>
        </div>
        
        <!-- Image Hero -->
        <div class="form-section">
          <h3>Image d'Arrière-Plan (Hero)</h3>
          <p class="form-hint">L'image qui apparaît en haut de la page d'accueil</p>
          <div class="form-group-admin full image-preview-group">
            <div class="image-upload-row">
              <div class="file-input-wrap">
                <input type="file" name="hero_image_file" id="hero_file" accept="image/*" />
                <small>Formats: JPG, PNG, GIF, WebP</small>
              </div>
              <div class="or-divider">OU</div>
              <input type="url" name="hero_image_url" id="hero_url" value="<?= htmlspecialchars($settings['hero_image'] ?? '') ?>" placeholder="https://example.com/hero.jpg" />
            </div>
            <div class="img-preview-wrap" style="max-width: 400px;">
              <img id="preview_hero" src="<?= htmlspecialchars($settings['hero_image'] ?? '') ?>" alt="Aperçu Hero" <?= empty($settings['hero_image']) ? 'style="display:none;"' : '' ?> />
            </div>
          </div>
        </div>
        
        <!-- Images Catégories -->
        <div class="form-section">
          <h3>Images des Catégories (Page d'accueil)</h3>
          
          <!-- Catégorie Sacs -->
          <div class="form-group-admin full image-preview-group">
            <label>Image Catégorie: Sacs en perles</label>
            <div class="image-upload-row">
              <div class="file-input-wrap">
                <input type="file" name="cat_sacs_file" accept="image/*" />
                <small>Formats: JPG, PNG, GIF, WebP</small>
              </div>
              <div class="or-divider">OU</div>
              <input type="url" name="cat_sacs_url" value="<?= htmlspecialchars($settings['cat_sacs_image'] ?? '') ?>" placeholder="https://example.com/sacs.jpg" />
            </div>
            <div class="img-preview-wrap">
              <img src="<?= htmlspecialchars($settings['cat_sacs_image'] ?? '') ?>" alt="Aperçu Sacs" <?= empty($settings['cat_sacs_image']) ? 'style="display:none;"' : '' ?> />
            </div>
          </div>
          
          <!-- Catégorie Porte-clés -->
          <div class="form-group-admin full image-preview-group">
            <label>Image Catégorie: Porte-clés en perles</label>
            <div class="image-upload-row">
              <div class="file-input-wrap">
                <input type="file" name="cat_cles_file" accept="image/*" />
                <small>Formats: JPG, PNG, GIF, WebP</small>
              </div>
              <div class="or-divider">OU</div>
              <input type="url" name="cat_cles_url" value="<?= htmlspecialchars($settings['cat_portefeuille_image'] ?? '') ?>" placeholder="https://example.com/cles.jpg" />
            </div>
            <div class="img-preview-wrap">
              <img src="<?= htmlspecialchars($settings['cat_portefeuille_image'] ?? '') ?>" alt="Aperçu Porte-clés" <?= empty($settings['cat_portefeuille_image']) ? 'style="display:none;"' : '' ?> />
            </div>
          </div>
        </div>
        
        <!-- Catégories avec images personnalisées -->
        <div class="form-section">
          <h3>Images des Catégories (Base de données)</h3>
          <p class="form-hint">Vous pouvez uploader une image différente pour chaque catégorie</p>
          
          <?php foreach ($categories as $cat): ?>
          <div class="form-group-admin full image-preview-group">
            <label>Catégorie: <?= htmlspecialchars($cat['nom']) ?></label>
            <div class="image-upload-row">
              <div class="file-input-wrap">
                <input type="file" name="cat_image_file_<?= $cat['id'] ?>" accept="image/*" />
                <small>Formats: JPG, PNG, GIF, WebP</small>
              </div>
              <div class="or-divider">OU</div>
              <input type="url" name="cat_url_<?= $cat['id'] ?>" value="<?= htmlspecialchars($cat['image_url'] ?? '') ?>" placeholder="https://example.com/image.jpg" />
            </div>
            <?php if (!empty($cat['image_url'])): ?>
            <div class="img-preview-wrap">
              <img src="../<?= htmlspecialchars($cat['image_url']) ?>" alt="Aperçu <?= htmlspecialchars($cat['nom']) ?>" />
            </div>
            <?php endif; ?>
          </div>
          <?php endforeach; ?>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-admin-primary btn-lg"><i class="fas fa-save"></i> Enregistrer les paramètres</button>
        </div>
      </form>
    </div>
  </div>
  
  <script>
    // Prévisualisation URL hero
    document.getElementById('hero_url').addEventListener('input', function() {
      const preview = document.getElementById('preview_hero');
      if (this.value.trim()) {
        preview.src = this.value.trim();
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
      }
    });
  </script>
</body>
</html>

