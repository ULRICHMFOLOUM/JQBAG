<?php
// ============================================================
// CONFIGURATION BASE DE DONNÉES - LOCAL (XAMPP) ET PRODUCTION (InfinityFree)
// ============================================================

// ⚠️ CHANGEZ ICI POUR PRODUCTION ⚠️
$use_production = true; // true = InfinityFree, false = Local XAMPP

if ($use_production) {
    // ∞∞∞ INFINITYFREE PRODUCTION ∞∞∞
    define('DB_HOST', 'sql306.infinityfree.com');
    define('DB_NAME', 'if0_41352772_boutique_perlesnew');
    define('DB_USER', 'if0_41352772');
    define('DB_PASS', 'd28OkKHBjH'); // REMPLACEZ PAR VOTRE MOT DE PASSE ******
    define('SITE_URL', 'https://perlora.42web.io');
} else {
    // 🏠 LOCAL XAMPP (test)
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'boutique_perles');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('SITE_URL', 'http://localhost/site de perle');
}

define('DB_CHARSET', 'utf8mb4');
define('WHATSAPP_NUMBER', '23772362828');
define('SITE_NAME', 'Perles & Élégance');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Erreur DB: " . $e->getMessage());
            die("❌ ERREUR CONNEXION DB. 
                • LOCAL : XAMPP ON + base 'boutique_perles' importée
                • PROD : Vérifiez DB_NAME/password dans config.php");
        }
    }
    return $pdo;
}
?>

