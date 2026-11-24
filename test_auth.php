<?php
// Test de connexion à la base de données et vérification des tables

header('Content-Type: text/plain; charset=utf-8');

echo "=== TEST AUTHENTIFICATION ===\n\n";

// Tester la connexion à la base
echo "1. Test de connexion à la base de données...\n";
try {
    require_once 'api/config.php';
    $pdo = getDB();
    echo "   ✓ Connexion réussie!\n";
} catch (Exception $e) {
    echo "   ✗ ERREUR: " . $e->getMessage() . "\n";
    exit;
}

// Vérifier si la table users existe
echo "\n2. Vérification de la table 'users'...\n";
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "   ✓ Table 'users' existe!\n";
        
        // Compter les utilisateurs
        $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        echo "   ✓ Nombre d'utilisateurs: $count\n";
    } else {
        echo "   ✗ Table 'users' n'existe pas!\n";
        echo "   → Exécutez le SQL dans phpMyAdmin\n";
    }
} catch (Exception $e) {
    echo "   ✗ ERREUR: " . $e->getMessage() . "\n";
}

// Vérifier si la table password_resets existe
echo "\n3. Vérification de la table 'password_resets'...\n";
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'password_resets'");
    if ($stmt->rowCount() > 0) {
        echo "   ✓ Table 'password_resets' existe!\n";
    } else {
        echo "   ✗ Table 'password_resets' n'existe pas!\n";
    }
} catch (Exception $e) {
    echo "   ✗ ERREUR: " . $e->getMessage() . "\n";
}

echo "\n=== INSTRUCTIONS ===\n";
echo "1. Allez dans phpMyAdmin\n";
echo "2. Sélectionnez la base 'boutique_perles'\n";
echo "3. Cliquez sur l'onglet SQL\n";
echo "4. Copiez le contenu du fichier 'update_users_table.sql'\n";
echo "5. Collez et cliquez 'Exécuter'\n";
echo "\nCela créera les tables nécessaires.\n";

