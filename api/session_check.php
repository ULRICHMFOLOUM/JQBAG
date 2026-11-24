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
if (isset($_SESSION['admin_id'])) {
    echo json_encode(['logged' => true, 'user' => $_SESSION['admin_user']]);
} else {
    http_response_code(401);
    echo json_encode(['logged' => false]);
}
?>

