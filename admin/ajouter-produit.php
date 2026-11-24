<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header('Location: login.php'); exit; }
require_once '../api/config.php';
$pdo = getDB();

$categories = $pdo->query("SELECT * FROM categories ORDER BY nom")->fetchAll();
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom         = trim($_POST['nom'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $prix        = floatval($_POST['prix'] ?? 0);
    $prix_promo  = !empty($_POST['prix_promo']) ? floatval($_POST['prix_promo']) : null;
    $cat_id      = intval($_POST['categorie_id'] ?? 0);
    $stock       = intval($_POST['stock'] ?? 0);
    $vedette     = isset($_POST['vedette']) ? 1 : 0;
    $actif       = isset($_POST['actif']) ? 1 : 0;

    // Gestion de l'upload d'image
    $image_url   = 'assets/images/placeholder.png';
    $image_url_2 = '';
    $image_url_3 = '';

    // Image principale
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploaded = uploadImage($_FILES['image_file'], 'produit');
        if ($uploaded) $image_url = $uploaded;
    } elseif (!empty($_POST['image_url'])) {
        // Fallback: URL manuelle
        $image_url = trim($_POST['image_url']);
    }

    // Image 2
    if (isset($_FILES['image_file_2']) && $_FILES['image_file_2']['error'] === UPLOAD_ERR_OK) {
        $uploaded2 = uploadImage($_FILES['image_file_2'], 'produit2');
        if ($uploaded2) $image_url_2 = $uploaded2;
    } elseif (!empty($_POST['image_url_2'])) {
        $image_url_2 = trim($_POST['image_url_2']);
    }

    // Image 3
    if (isset($_FILES['image_file_3']) && $_FILES['image_file_3']['error'] === UPLOAD_ERR_OK) {
        $uploaded3 = uploadImage($_FILES['image_file_3'], 'produit3');
        if ($uploaded3) $image_url_3 = $uploaded3;
    } elseif (!empty($_POST['image_url_3'])) {
        $image_url_3 = trim($_POST['image_url_3']);
    }

    if (!$nom || !$description || $prix <= 0 || !$cat_id) {
        $error = 'Veuillez remplir tous les champs obligatoires.';
    } else {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $nom)) . '-' . time();
        $stmt = $pdo->prepare("INSERT INTO produits (nom, slug, description, prix, prix_promo, categorie_id, image_url, image_url_2, image_url_3, stock, vedette, actif) VALUES (:nom,:slug,:desc,:prix,:promo,:cat,:img,:img2,:img3,:stock,:vedette,:actif)");
        $stmt->execute([':nom'=>$nom,':slug'=>$slug,':desc'=>$description,':prix'=>$prix,':promo'=>$prix_promo,':cat'=>$cat_id,':img'=>$image_url,':img2'=>$image_url_2 ?: null,':img3'=>$image_url_3 ?: null,':stock'=>$stock,':vedette'=>$vedette,':actif'=>$actif]);
        $success = 'Produit ajouté avec succès !';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ajouter Produit — Admin</title>
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
      <a href="ajouter-produit.php" class="sidebar-link active"><i class="fas fa-plus-circle"></i> Ajouter Produit</a>
      <a href="../index.html" class="sidebar-link" target="_blank"><i class="fas fa-external-link-alt"></i> Voir le site</a>
      <a href="logout.php" class="sidebar-link logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </nav>
  </div>
  <div class="admin-main">
    <div class="admin-topbar">
      <h1>Ajouter un Produit</h1>
      <a href="produits.php" class="btn-admin-outline"><i class="fas fa-arrow-left"></i> Retour</a>
    </div>
    <div class="admin-content">
      <?php if ($success): ?><div class="alert alert-success"><?= htmlspecialchars($success) ?></div><?php endif; ?>
      <?php if ($error): ?><div class="alert alert-danger"><?= htmlspecialchars($error) ?></div><?php endif; ?>

      <form method="POST" class="admin-form" enctype="multipart/form-data">
        <div class="form-section">
          <h3>Informations générales</h3>
          <div class="form-row-admin">
            <div class="form-group-admin">
              <label>Nom du produit *</label>
              <input type="text" name="nom" required placeholder="Ex: Sac Clutch Doré" />
            </div>
            <div class="form-group-admin">
              <label>Catégorie *</label>
              <select name="categorie_id" required>
                <option value="">Choisir...</option>
                <?php foreach ($categories as $c): ?>
                <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['nom']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          <div class="form-group-admin full">
            <label>Description *</label>
            <textarea name="description" rows="5" required placeholder="Description détaillée du produit..."></textarea>
          </div>
          <div class="form-row-admin">
            <div class="form-group-admin">
              <label>Prix (en F CFA) *</label>
              <input type="number" name="prix" min="0" step="500" required placeholder="45000" />
            </div>
            <div class="form-group-admin">
              <label>Prix promo (optionnel)</label>
              <input type="number" name="prix_promo" min="0" step="500" placeholder="38000" />
            </div>
            <div class="form-group-admin">
              <label>Stock</label>
              <input type="number" name="stock" min="0" value="10" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Images du produit</h3>
          <p class="form-hint">Vous pouvez uploader une image depuis votre ordinateur OU coller une URL externe</p>
          
          <!-- Image principale -->
          <div class="form-group-admin full image-preview-group">
            <label>Image principale *</label>
            <div class="image-upload-row">
              <div class="file-input-wrap">
                <input type="file" name="image_file" id="image_file" accept="image/*" />
                <small>Formats: JPG, PNG, GIF, WebP</small>
              </div>
              <div class="or-divider">OU</div>
              <input type="url" name="image_url" id="img1" placeholder="https://example.com/mon-image-produit.jpg" />
            </div>
            <div class="img-preview-wrap"><img id="preview1" src="" alt="Aperçu" style="display:none;" /><div class="img-placeholder" id="placeholder1"><i class="fas fa-image"></i><span>Aperçu image principale</span></div></div>
          </div>
          
          <!-- Image 2 -->
          <div class="form-row-admin">
            <div class="form-group-admin image-preview-group">
              <label>Image 2 (optionnelle)</label>
              <div class="image-upload-row">
                <div class="file-input-wrap">
                  <input type="file" name="image_file_2" id="image_file_2" accept="image/*" />
                </div>
                <div class="or-divider">OU</div>
                <input type="url" name="image_url_2" id="img2" placeholder="https://example.com/image-2.jpg" />
              </div>
              <div class="img-preview-wrap"><img id="preview2" src="" alt="Aperçu" style="display:none;" /><div class="img-placeholder" id="placeholder2"><i class="fas fa-image"></i></div></div>
            </div>
            <div class="form-group-admin image-preview-group">
              <label>Image 3 (optionnelle)</label>
              <div class="image-upload-row">
                <div class="file-input-wrap">
                  <input type="file" name="image_file_3" id="image_file_3" accept="image/*" />
                </div>
                <div class="or-divider">OU</div>
                <input type="url" name="image_url_3" id="img3" placeholder="https://example.com/image-3.jpg" />
              </div>
              <div class="img-preview-wrap"><img id="preview3" src="" alt="Aperçu" style="display:none;" /><div class="img-placeholder" id="placeholder3"><i class="fas fa-image"></i></div></div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Options</h3>
          <div class="form-checkboxes">
            <label class="checkbox-label"><input type="checkbox" name="vedette" value="1" /> <span>✦ Mettre en vedette (affiché sur l'accueil)</span></label>
            <label class="checkbox-label"><input type="checkbox" name="actif" value="1" checked /> <span>Produit actif (visible sur le site)</span></label>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-admin-primary btn-lg"><i class="fas fa-save"></i> Enregistrer le produit</button>
          <a href="produits.php" class="btn-admin-outline">Annuler</a>
        </div>
      </form>
    </div>
  </div>
  <script>
    ['img1','img2','img3'].forEach((id, i) => {
      const input = document.getElementById(id);
      const preview = document.getElementById('preview' + (i+1));
      const placeholder = document.getElementById('placeholder' + (i+1));
      input.addEventListener('input', () => {
        const url = input.value.trim();
        if (url) {
          preview.src = url;
          preview.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
          preview.onerror = () => { preview.style.display = 'none'; if (placeholder) placeholder.style.display = 'flex'; };
        } else {
          preview.style.display = 'none';
          if (placeholder) placeholder.style.display = 'flex';
        }
      });
    });
  </script>
</body>
</html>

