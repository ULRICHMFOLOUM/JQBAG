<?php
require_once 'api/config.php';
$pdo = getDB();

echo "=== TEST Settings ===\n\n";

// Check if settings table exists
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
echo "Tables: " . implode(", ", $tables) . "\n\n";

if (in_array('settings', $tables)) {
    echo "Settings table exists!\n";
    $stmt = $pdo->query("SELECT * FROM settings");
    $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Number of settings: " . count($settings) . "\n\n";
    
    foreach ($settings as $row) {
        echo $row['setting_key'] . " = " . $row['setting_value'] . "\n";
    }
} else {
    echo "Settings table does NOT exist!\n";
}

// Check categories
echo "\n=== Categories ===\n";
$stmt = $pdo->query("SELECT id, nom, image_url FROM categories");
$cats = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($cats as $c) {
    echo "ID: " . $c['id'] . ", Nom: " . $c['nom'] . ", Image: " . ($c['image_url'] ?? 'NULL') . "\n";
}

