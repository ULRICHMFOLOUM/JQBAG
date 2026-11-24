<!DOCTYPE html>
<html>
<head>
  <title>Test Base de Données</title>
</head>
<body>
  <h1>Test de connexion à la base</h1>
  <?php
  require 'api/config.php';
  try {
    $pdo = getDB();
    echo "<p style='color: green;'><strong>✅ Connexion réussie !</strong></p>";
    
    // Test table produits
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM produits");
    $count = $stmt->fetch()['count'];
    echo "<p>Nombre de produits: <strong>$count</strong></p>";
    
    // Test images
    $stmt = $pdo->query("SELECT id, nom, image_url FROM produits LIMIT 3");
    $produits = $stmt->fetchAll();
    echo "<h3>Premiers produits :</h3><ul>";
    foreach ($produits as $p) {
      echo "<li>ID: {$p['id']} - {$p['nom']} <br>Image: " . htmlspecialchars($p['image_url']) . "</li>";
    }
    echo "</ul>";
  } catch (Exception $e) {
    echo "<p style='color: red;'><strong>❌ Erreur :</strong> " . $e->getMessage() . "</p>";
  }
  ?>
</body>
</html>

