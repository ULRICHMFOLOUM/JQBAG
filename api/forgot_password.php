<?php
// ============================================================
// API: Mot de passe oublié
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

// Validation de l'email
$email = trim($_POST['email'] ?? '');

if (empty($email)) {
    echo json_encode([
        'success' => false,
        'message' => 'L\'email est requis'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email invalide'
    ]);
    exit;
}

try {
    $pdo = getDB();
    
    // Vérifier si l'email existe
    $stmt = $pdo->prepare("SELECT id, nom FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        // Pour des raisons de sécurité, on dit toujours que l'email a été envoyé
        // même s'il n'existe pas
        echo json_encode([
            'success' => true,
            'message' => 'Si cet email existe, vous recevrez un lien de réinitialisation.'
        ]);
        exit;
    }
    
    // Générer un token unique
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Stocker le token
    $stmt = $pdo->prepare("
        INSERT INTO password_resets (email, token, expires_at) 
        VALUES (:email, :token, :expires_at)
    ");
    $stmt->execute([
        ':email' => $email,
        ':token' => $token,
        ':expires_at' => $expires
    ]);
    
    // Dans un vrai projet, vous enverriez un email avec le lien
    // Pour ce projet, on simule la réponse
    // Le lien de reset serait: votresite.com/reset-password.php?token=...
    
    echo json_encode([
        'success' => true,
        'message' => 'Lien de réinitialisation envoyé à votre email!',
        'debug_token' => $token // À retirer en production!
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur. Veuillez réessayer.'
    ]);
}

