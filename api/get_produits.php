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

$pdo = getDB();

$categorie = isset($_GET['categorie']) ? intval($_GET['categorie']) : null;
$vedette    = isset($_GET['vedette']) ? 1 : null;
$search     = isset($_GET['q']) ? trim($_GET['q']) : null;
$limit      = isset($_GET['limit']) ? intval($_GET['limit']) : 100;

$sql = "SELECT p.*, c.nom AS categorie_nom, c.slug AS categorie_slug, 
        p.image_url AS image_url
        FROM produits p
        JOIN categories c ON p.categorie_id = c.id
        WHERE p.actif = 1";

$params = [];

if ($categorie) {
    $sql .= " AND p.categorie_id = :cat";
    $params[':cat'] = $categorie;
}
if ($vedette) {
    $sql .= " AND p.vedette = 1";
}
if ($search) {
    $sql .= " AND (p.nom LIKE :q OR p.description LIKE :q2)";
    $params[':q']  = "%$search%";
    $params[':q2'] = "%$search%";
}

$sql .= " ORDER BY p.vedette DESC, p.created_at DESC LIMIT :lim";

$stmt = $pdo->prepare($sql);
foreach ($params as $key => $val) {
    $stmt->bindValue($key, $val);
}
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->execute();
$produits = $stmt->fetchAll();

echo json_encode(['success' => true, 'data' => $produits]);
?>

