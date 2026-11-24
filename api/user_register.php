<?php
// ============================================================
// API: Inscription client
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
require_once 'config.php';

// Validation des données
$nom = trim($_POST['nom'] ?? '');
$email = trim($_POST['email'] ?? '');
$telephone = trim($_POST['telephone'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

// Validation
$errors = [];

if (empty($nom)) {
    $errors[] = 'Le nom est requis';
}
if (empty($email)) {
    $errors[] = 'L\'email est requis';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email invalide';
}
if (empty($password)) {
    $errors[] = 'Le mot de passe est requis';
} elseif (strlen($password) < 6) {
    $errors[] = 'Le mot de passe doit contenir au moins 6 caractères';
}
if ($password !== $confirm_password) {
    $errors[] = 'Les mots de passe ne correspondent pas';
}

if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ]);
    exit;
}

try {
    $pdo = getDB();
    
    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'errors' => ['Cet email est déjà utilisé']
        ]);
        exit;
    }
    
    // Créer l'utilisateur
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("
        INSERT INTO users (nom, email, telephone, password_hash) 
        VALUES (:nom, :email, :telephone, :password_hash)
    ");
    
    $stmt->execute([
        ':nom' => $nom,
        ':email' => $email,
        ':telephone' => $telephone,
        ':password_hash' => $password_hash
    ]);
    
    $user_id = $pdo->lastInsertId();
    
    // Créer la session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_nom'] = $nom;
    $_SESSION['user_email'] = $email;
    
    echo json_encode([
        'success' => true,
        'message' => 'Inscription réussie',
        'user' => [
            'id' => $user_id,
            'nom' => $nom,
            'email' => $email,
            'telephone' => $telephone
        ]
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'errors' => ['Erreur serveur. Veuillez réessayer.']
    ]);
}

