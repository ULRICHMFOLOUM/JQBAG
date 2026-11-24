<?php
// ============================================================
// API: Vérifier session client
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'logged' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'nom' => $_SESSION['user_nom'],
            'email' => $_SESSION['user_email'],
            'telephone' => $_SESSION['user_telephone'] ?? ''
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['logged' => false]);
}

