<?php
// Headers CORS et JSON pour les API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
    echo json_encode(['success' => false, 'error' => 'ID invalide']);
    exit;
}

$pdo  = getDB();
$stmt = $pdo->prepare("
    SELECT p.*, c.nom AS categorie_nom, c.slug AS categorie_slug, 
           p.image_url AS image_url,
           p.image_url_2 AS image_url_2,
           p.image_url_3 AS image_url_3
    FROM produits p
    JOIN categories c ON p.categorie_id = c.id
    WHERE p.id = :id AND p.actif = 1
");
$stmt->execute([':id' => $id]);
$produit = $stmt->fetch();

if (!$produit) {
    echo json_encode(['success' => false, 'error' => 'Produit introuvable']);
    exit;
}

// Produits similaires
$stmt2 = $pdo->prepare("
    SELECT id, nom, slug, prix, prix_promo, image_url
    FROM produits
    WHERE categorie_id = :cat AND id != :id AND actif = 1
    LIMIT 4
");
$stmt2->execute([':cat' => $produit['categorie_id'], ':id' => $id]);
$similaires = $stmt2->fetchAll();

echo json_encode(['success' => true, 'data' => $produit, 'similaires' => $similaires]);
?>

