<?php
// ============================================================
// API: Déconnexion client
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

// Détruire la session
session_unset();
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Déconnexion réussie'
]);

