<?php
// Test d'inscription via l'API

header('Content-Type: application/json');

// Simuler une requête POST pour l'inscription
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST['nom'] = 'Test User';
$_POST['email'] = 'test' . time() . '@exemple.com';
$_POST['telephone'] = '226 00 00 00 00';
$_POST['password'] = 'test123456';
$_POST['confirm_password'] = 'test123456';

echo "=== TEST INSCRIPTION ===\n\n";
echo "Données envoyées:\n";
echo "  nom: " . $_POST['nom'] . "\n";
echo "  email: " . $_POST['email'] . "\n";
echo "  telephone: " . $_POST['telephone'] . "\n";
echo "  password: " . $_POST['password'] . "\n\n";

// Inclure le fichier API
ob_start();
include 'api/user_register.php';
$output = ob_get_clean();

echo "Réponse de l'API:\n";
echo $output . "\n";

$data = json_decode($output, true);
if ($data['success'] === true) {
    echo "✓ Inscription réussie!\n";
} else {
    echo "✗ Échec: " . ($data['errors'][0] ?? 'Erreur inconnue') . "\n";
}

