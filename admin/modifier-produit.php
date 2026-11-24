<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header('Location: login.html'); exit; }
require_once '../api/config.php';
$pdo = getDB();

$id = intval($_GET['id'] ?? 0);
if (!$id) { header('Location: produits.php?msg=ID invalide&type=danger'); exit; }

$produit = $pdo->prepare("SELECT * FROM produits WHERE id = :id");
$produit->execute([':id' => $id]);
$p = $produit->fetch();
if (!$p) { header('Location: produits.php?msg=Produit introuvable&type=danger'); exit; }

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

    // Gestion de l'upload d'image principale
    $image_url = $p['image_url']; // Garder l'ancienne image par défaut
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploaded = uploadImage($_FILES['image_file'], 'produit');
        if ($uploaded) $image_url = $uploaded;
    } elseif (!empty($_POST['image_url'])) {
        // Fallback: URL manuelle
        $image_url = trim($_POST['image_url']);
    }

    // Image 2
    $image_url_2 = $p['image_url_2'] ?? '';
    if (isset($_FILES['image_file_2']) && $_FILES['image_file_2']['error'] === UPLOAD_ERR_OK) {
        $uploaded2 = uploadImage($_FILES['image_file_2'], 'produit2');
        if ($uploaded2) $image_url_2 = $uploaded2;
    } elseif (isset($_POST['image_url_2']) && !empty($_POST['image_url_2'])) {
        $image_url_2 = trim($_POST['image_url_2']);
    }

    // Image 3
    $image_url_3 = $p['image_url_3'] ?? '';
    if (isset($_FILES['image_file_3']) && $_FILES['image_file_3']['error'] === UPLOAD_ERR_OK) {
        $uploaded3 = uploadImage($_FILES['image_file_3'], 'produit3');
        if ($uploaded3) $image_url_3 = $uploaded3;
    } elseif (isset($_POST['image_url_3']) && !empty($_POST['image_url_3'])) {
        $image_url_3 = trim($_POST['image_url_3']);
    }

    if (!$nom || !$description || $prix <= 0 || !$cat_id) {
        $error = 'Veuillez remplir tous les champs obligatoires.';
    } else {
        $stmt = $pdo->prepare("UPDATE produits SET nom=:nom,description=:desc,prix=:prix,prix_promo=:promo,categorie_id=:cat,image_url=:img,image_url_2=:img2,image_url_3=:img3,stock=:stock,vedette=:vedette,actif=:actif WHERE id=:id");
        $stmt->execute([':nom'=>$nom,':desc'=>$description,':prix'=>$prix,':promo'=>$prix_promo,':cat'=>$cat_id,':img'=>$image_url,':img2'=>$image_url_2 ?: null,':img3'=>$image_url_3 ?: null,':stock'=>$stock,':vedette'=>$vedette,':actif'=>$actif,':id'=>$id]);
        $success = 'Produit modifié avec succès !';
        $p = $pdo->prepare("SELECT * FROM produits WHERE id=:id");
        $p->execute([':id'=>$id]);
        $p = $p->fetch();
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Modifier Produit — Admin</title>
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
      <a href="logout.php" class="sidebar-link logout-link"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
    </nav>
  </div>
  <div class="admin-main">
    <div class="admin-topbar">
      <h1>Modifier le Produit</h1>
      <a href="produits.php" class="btn-admin-outline"><i class="fas fa-arrow-left"></i> Retour</a>
    </div>
    <div class="admin-content">
      <?php if ($success): ?><div class="alert alert-success"><?= htmlspecialchars($success) ?></div><?php endif; ?>
      <?php if ($error): ?><div class="alert alert-danger"><?= htmlspecialchars($error) ?></div><?php endif; ?>
      <form method="POST" class="admin-form" enctype="multipart/form-data">
        <div class="form-section">
          <h3>Informations générales</h3>
          <div class="form-row-admin">
            <div class="form-group-admin"><label>Nom *</label><input type="text" name="nom" value="<?= htmlspecialchars($p['nom']) ?>" required /></div>
            <div class="form-group-admin">
              <label>Catégorie *</label>
              <select name="categorie_id" required>
                <?php foreach ($categories as $c): ?>
                <option value="<?= $c['id'] ?>" <?= $p['categorie_id']==$c['id']?'selected':'' ?>><?= htmlspecialchars($c['nom']) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          <div class="form-group-admin full"><label>Description *</label><textarea name="description" rows="5" required><?= htmlspecialchars($p['description']) ?></textarea></div>
          <div class="form-row-admin">
            <div class="form-group-admin"><label>Prix *</label><input type="number" name="prix" value="<?= $p['prix'] ?>" min="0" step="500" required /></div>
            <div class="form-group-admin"><label>Prix promo</label><input type="number" name="prix_promo" value="<?= $p['prix_promo'] ?>" min="0" step="500" /></div>
            <div class="form-group-admin"><label>Stock</label><input type="number" name="stock" value="<?= $p['stock'] ?>" min="0" /></div>
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
              <input type="url" name="image_url" id="img1" value="<?= htmlspecialchars($p['image_url']) ?>" placeholder="https://example.com/image.jpg" />
            </div>
            <div class="img-preview-wrap">
              <img id="preview1" src="../<?= htmlspecialchars($p['image_url']) ?>" alt="Aperçu" <?= $p['image_url'] ? '' : 'style="display:none;"' ?> />
            </div>
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
                <input type="url" name="image_url_2" id="img2" value="<?= htmlspecialchars($p['image_url_2'] ?? '') ?>" placeholder="https://example.com/image-2.jpg" />
              </div>
              <div class="img-preview-wrap">
                <img id="preview2" src="<?= !empty($p['image_url_2']) ? '../' . htmlspecialchars($p['image_url_2']) : '' ?>" alt="Aperçu" <?= !empty($p['image_url_2']) ? '' : 'style="display:none;"' ?> />
              </div>
            </div>
            <div class="form-group-admin image-preview-group">
              <label>Image 3 (optionnelle)</label>
              <div class="image-upload-row">
                <div class="file-input-wrap">
                  <input type="file" name="image_file_3" id="image_file_3" accept="image/*" />
                </div>
                <div class="or-divider">OU</div>
                <input type="url" name="image_url_3" id="img3" value="<?= htmlspecialchars($p['image_url_3'] ?? '') ?>" placeholder="https://example.com/image-3.jpg" />
              </div>
              <div class="img-preview-wrap">
                <img id="preview3" src="<?= !empty($p['image_url_3']) ? '../' . htmlspecialchars($p['image_url_3']) : '' ?>" alt="Aperçu" <?= !empty($p['image_url_3']) ? '' : 'style="display:none;"' ?> />
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Options</h3>
          <div class="form-checkboxes">
            <label class="checkbox-label"><input type="checkbox" name="vedette" value="1" <?= $p['vedette']?'checked':'' ?> /> <span>✦ En vedette</span></label>
            <label class="checkbox-label"><input type="checkbox" name="actif" value="1" <?= $p['actif']?'checked':'' ?> /> <span>Produit actif</span></label>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-admin-primary btn-lg"><i class="fas fa-save"></i> Enregistrer les modifications</button>
          <a href="produits.php" class="btn-admin-outline">Annuler</a>
        </div>
      </form>
    </div>
  </div>
  <script>
    // Prévisualisation des images URL
    ['img1','img2','img3'].forEach((id, i) => {
      const input = document.getElementById(id);
      const preview = document.getElementById('preview' + (i+1));
      if (!input || !preview) return;
      input.addEventListener('input', () => {
        const url = input.value.trim();
        if (url) { preview.src = url; preview.style.display = 'block'; }
        else { preview.style.display = 'none'; }
      });
    });
    
    // Prévisualisation des fichiers uploadés
    ['image_file', 'image_file_2', 'image_file_3'].forEach((id, i) => {
      const input = document.getElementById(id);
      const preview = document.getElementById('preview' + (i+1));
      if (!input || !preview) return;
      input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(input.files[0]);
        }
      });
    });
  </script>
</body>
</html>

