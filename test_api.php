<?php
require_once 'api/config.php';
header('Content-Type: application/json');

$pdo = getDB();

// Get settings
$settings = [];
$stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

// Get categories with images
$categories = $pdo->query("SELECT id, nom, slug, image_url FROM categories ORDER BY id")->fetchAll();

$result = [
    'success' => true,
    'settings' => $settings,
    'categories' => $categories
];

echo json_encode($result, JSON_PRETTY_PRINT);

