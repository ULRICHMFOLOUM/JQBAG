<?php
session_start();

// Traitement de la connexion
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../api/config.php';
    
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    if (empty($username) || empty($password)) {
        $error = 'Veuillez remplir tous les champs.';
    } else {
        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :u LIMIT 1");
        $stmt->execute([':u' => $username]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_user'] = $admin['username'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Identifiants incorrects.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin — Connexion | Perles & Élégance</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../assets/css/admin.css" />
</head>
<body class="admin-login-page">
  <div class="login-bg"></div>
  <div class="login-particles" id="login-particles"></div>

  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="../assets/images/logo.png" alt="Logo" class="login-logo" onerror="this.style.display='none'" />
        <h1>Espace Admin</h1>
        <p>Perles & Élégance — Gestion boutique</p>
      </div>

      <?php if (!empty($error)): ?>
      <div class="login-error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>

      <form id="login-form" method="POST" class="login-form">
        <div class="form-group">
          <label for="username"><i class="fas fa-user"></i> Identifiant</label>
          <input type="text" id="username" name="username" required placeholder="Votre identifiant" autocomplete="username" />
        </div>
        <div class="form-group">
          <label for="password"><i class="fas fa-lock"></i> Mot de passe</label>
          <div class="password-wrap">
            <input type="password" id="password" name="password" required placeholder="Votre mot de passe" autocomplete="current-password" />
            <button type="button" class="toggle-password" id="toggle-password" aria-label="Afficher/Masquer le mot de passe">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="btn-login" id="login-btn">
          <span>Se connecter</span>
        </button>
      </form>

      <div class="login-footer">
        <a href="../index.html"><i class="fas fa-arrow-left"></i> Retour au site</a>
      </div>
    </div>
  </div>

  <script>
    // Particules légères
    const container = document.getElementById('login-particles');
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'login-particle';
      p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${Math.random()*6+2}px;height:${Math.random()*6+2}px;animation-delay:${Math.random()*4}s;animation-duration:${Math.random()*4+4}s`;
      container.appendChild(p);
    }

    // Toggle password
    document.getElementById('toggle-password').addEventListener('click', function() {
      const input = document.getElementById('password');
      const icon = this.querySelector('i');
      if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
      else { input.type = 'password'; icon.className = 'fas fa-eye'; }
    });
  </script>
</body>
</html>

