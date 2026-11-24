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

session_start();
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Identifiants manquants']);
    exit;
}

$pdo  = getDB();
$stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :u LIMIT 1");
$stmt->execute([':u' => $username]);
$admin = $stmt->fetch();

if ($admin && password_verify($password, $admin['password_hash'])) {
    $_SESSION['admin_id']   = $admin['id'];
    $_SESSION['admin_user'] = $admin['username'];
    echo json_encode(['success' => true, 'redirect' => '../admin/dashboard.php']);
} else {
    echo json_encode(['success' => false, 'error' => 'Identifiants incorrects']);
}
?>

