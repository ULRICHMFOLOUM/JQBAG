// ============================================================
// AUTH.JS — Gestion authentification client
// ============================================================

// Stockage utilisateur en localStorage
const USER_KEY = "perles_user";

// ---- VÉRIFIER SI CONNECTÉ ----
function isUserLoggedIn() {
  const user = localStorage.getItem(USER_KEY);
  return user !== null;
}

// ---- OBTENIR INFO USER ----
function getCurrentUser() {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// ---- AFFICHER/MASQUER LE MODAL ----
function showAuthModal(action = "login") {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.add("show");
    // Afficher le bon onglet
    switchTab(action);
  }
}

function hideAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("show");
  }
}

// ---- SWITCH TABS ----
function switchTab(tab) {
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (tab === "login") {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.style.display = "block";
    loginForm.style.display = "none";
  }
}

// ---- INSCRIPTION ----
async function registerUser(formData) {
  try {
    const response = await fetch("api/user_register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, errors: ["Erreur de connexion"] };
  }
}

// ---- CONNEXION ----
async function loginUser(formData) {
  try {
    const response = await fetch("api/user_login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, errors: ["Erreur de connexion"] };
  }
}

// ---- DÉCONNEXION ----
async function logoutUser() {
  try {
    await fetch("api/user_logout.php");
  } catch (e) {
    // Ignorer les erreurs
  }
  localStorage.removeItem(USER_KEY);
  updateUserUI();
  showNotification("Déconnexion réussie", "success");
}

// ---- METTRE À JOUR L'UI ----
function updateUserUI() {
  const user = getCurrentUser();
  const userSection = document.getElementById("user-section");
  const loginBtn = document.getElementById("login-btn");

  if (user && userSection) {
    // Utilisateur connecté
    userSection.innerHTML = `
      <div class="user-info">
        <span class="user-name">${user.nom}</span>
        <button class="logout-btn" onclick="logoutUser()">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </button>
      </div>
    `;
    userSection.style.display = "flex";
    if (loginBtn) loginBtn.style.display = "none";
  } else if (userSection) {
    // Non connecté
    userSection.innerHTML = "";
    userSection.style.display = "none";
    if (loginBtn) loginBtn.style.display = "flex";
  }
}

// ---- VÉRIFIER SESSION AU DÉMARRAGE ----
async function checkUserSession() {
  try {
    const response = await fetch("api/check_user_session.php");
    const data = await response.json();

    if (data.logged) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      updateUserUI();
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    // Vérifier le localStorage au cas où
    if (!isUserLoggedIn()) {
      localStorage.removeItem(USER_KEY);
    }
  }
}

// ---- MOT DE PASSE OUBLIÉ ----
async function forgotPassword(email) {
  try {
    const response = await fetch("api/forgot_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "email=" + encodeURIComponent(email),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "Erreur de connexion" };
  }
}

// ---- NOTIFICATION ----
function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.className = `auth-notification auth-notif-${type}`;
  notif.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add("show"), 10);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// ---- INITIALISER LE MODAL ----
function initAuthModal() {
  // Créer le modal s'il n'existe pas
  if (!document.getElementById("auth-modal")) {
    const modalHTML = `
      <div class="auth-modal" id="auth-modal">
        <div class="auth-modal-overlay" onclick="hideAuthModal()"></div>
        <div class="auth-modal-content">
          <button class="auth-close" onclick="hideAuthModal()">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="auth-modal-header">
            <img src="assets/images/logo.png" alt="Logo" class="auth-logo" onerror="this.style.display='none'" />
            <h2>Perles & Élégance</h2>
            <p>Connectez-vous pour continuer</p>
          </div>
          
          <div class="auth-tabs">
            <button class="auth-tab active" id="tab-login" onclick="switchTab('login')">
              <i class="fas fa-sign-in-alt"></i> Connexion
            </button>
            <button class="auth-tab" id="tab-register" onclick="switchTab('register')">
              <i class="fas fa-user-plus"></i> Inscription
            </button>
          </div>
          
          <!-- Formulaire de connexion -->
          <form id="login-form" class="auth-form" onsubmit="handleLogin(event)">
            <div class="form-group">
              <label for="login-email"><i class="fas fa-envelope"></i> Email</label>
              <input type="email" id="login-email" name="email" required placeholder="votre@email.com" />
            </div>
            <div class="form-group">
              <label for="login-password"><i class="fas fa-lock"></i> Mot de passe</label>
              <input type="password" id="login-password" name="password" required placeholder="••••••••" />
            </div>
            <button type="submit" class="btn-auth-submit">
              <span>Se connecter</span>
              <i class="fas fa-arrow-right"></i>
            </button>
            <p class="auth-forgot">
              <a href="#" onclick="showForgotPassword(event)">Mot de passe oublié ?</a>
            </p>
          </form>
          
          <!-- Formulaire d'inscription -->
          <form id="register-form" class="auth-form" style="display: none;" onsubmit="handleRegister(event)">
            <div class="form-group">
              <label for="register-nom"><i class="fas fa-user"></i> Nom complet</label>
              <input type="text" id="register-nom" name="nom" required placeholder="Votre nom" />
            </div>
            <div class="form-group">
              <label for="register-email"><i class="fas fa-envelope"></i> Email</label>
              <input type="email" id="register-email" name="email" required placeholder="votre@email.com" />
            </div>
            <div class="form-group">
              <label for="register-telephone"><i class="fas fa-phone"></i> Téléphone (optionnel)</label>
              <input type="tel" id="register-telephone" name="telephone" placeholder="226 00 00 00 00" />
            </div>
            <div class="form-group">
              <label for="register-password"><i class="fas fa-lock"></i> Mot de passe</label>
              <input type="password" id="register-password" name="password" required placeholder="Min. 6 caractères" />
            </div>
            <div class="form-group">
              <label for="register-confirm"><i class="fas fa-lock"></i> Confirmer le mot de passe</label>
              <input type="password" id="register-confirm" name="confirm_password" required placeholder="••••••••" />
            </div>
            <button type="submit" class="btn-auth-submit">
              <span>Créer un compte</span>
              <i class="fas fa-user-plus"></i>
            </button>
          </form>
          
          <!-- Formulaire mot de passe oublié -->
          <form id="forgot-form" class="auth-form" style="display: none;" onsubmit="handleForgotPassword(event)">
            <div class="auth-back-link">
              <a href="#" onclick="switchTab('login'); return false;">
                <i class="fas fa-arrow-left"></i> Retour à la connexion
              </a>
            </div>
            <div class="form-group">
              <label for="forgot-email"><i class="fas fa-envelope"></i> Votre email</label>
              <input type="email" id="forgot-email" name="email" required placeholder="votre@email.com" />
            </div>
            <button type="submit" class="btn-auth-submit">
              <span>Envoyer le lien</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
          
          <div class="auth-modal-footer">
            <p>En继续, vous acceptez nos <a href="#">conditions d'utilisation</a></p>
          </div>
        </div>
      </div>
    `;

    // Ajouter au body
    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);
  }
}

// ---- HANDLERS ----
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';

  const formData = {
    email: form.email.value,
    password: form.password.value,
  };

  const result = await loginUser(formData);

  btn.disabled = false;
  btn.innerHTML = originalText;

  if (result.success) {
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    hideAuthModal();
    updateUserUI();
    showNotification(
      "Connexion réussie ! Bienvenue " + result.user.nom,
      "success",
    );

    // Recharger la page ou exécuter l'action précédente
    if (pendingAction) {
      pendingAction();
      pendingAction = null;
    }
  } else {
    showNotification(
      result.errors ? result.errors[0] : "Erreur de connexion",
      "error",
    );
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';

  const formData = {
    nom: form.nom.value,
    email: form.email.value,
    telephone: form.telephone.value,
    password: form.password.value,
    confirm_password: form.confirm_password.value,
  };

  const result = await registerUser(formData);

  btn.disabled = false;
  btn.innerHTML = originalText;

  if (result.success) {
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    hideAuthModal();
    updateUserUI();
    showNotification(
      "Inscription réussie ! Bienvenue " + result.user.nom,
      "success",
    );

    // Recharger la page ou exécuter l'action précédente
    if (pendingAction) {
      pendingAction();
      pendingAction = null;
    }
  } else {
    showNotification(
      result.errors ? result.errors[0] : "Erreur d'inscription",
      "error",
    );
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

  const result = await forgotPassword(form.email.value);

  btn.disabled = false;
  btn.innerHTML = originalText;

  if (result.success) {
    showNotification(result.message, "success");
    switchTab("login");
  } else {
    showNotification(result.message, "error");
  }
}

function showForgotPassword(e) {
  e.preventDefault();
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("forgot-form").style.display = "block";
}

// Variable pour stocker l'action en attente
let pendingAction = null;

// ---- ACTION AVANT CONNEXION ----
function requireAuth(callback) {
  if (isUserLoggedIn()) {
    callback();
  } else {
    pendingAction = callback;
    // Afficher d'abord un message d'avertissement
    showNotification("Veuillez vous connecter pour continuer !", "warning");
    // Ajouter un délai pour permettre à la notification de s'afficher
    setTimeout(() => {
      showAuthModal("login");
    }, 300);
  }
}

// ---- INITIALISER AU DÉMARRAGE ----
document.addEventListener("DOMContentLoaded", () => {
  initAuthModal();
  checkUserSession();
  updateUserUI();
});
