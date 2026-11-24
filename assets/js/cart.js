// ============================================================
// CART.JS — Gestion du panier
// ============================================================

// Numéro WhatsApp
const WA_NUMBER = "22600000000";

// ---- INITIALISER LE PANIER ----
function initCart() {
  if (!localStorage.getItem("perles_cart")) {
    localStorage.setItem("perles_cart", JSON.stringify([]));
  }
  updateCartCount();
}

// ---- OBTENIR LE PANIER ----
function getCart() {
  return JSON.parse(localStorage.getItem("perles_cart") || "[]");
}

// ---- SAUVEGARDER LE PANIER ----
function saveCart(cart) {
  localStorage.setItem("perles_cart", JSON.stringify(cart));
  updateCartCount();
}

// ---- METTRE À JOUR LE COMPTEUR ----
function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.quantite, 0);
    countEl.textContent = total;
    countEl.style.display = total > 0 ? "flex" : "none";
  }
}

// ---- AJOUTER AU PANIER ----
function addToCart(produit, quantite = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === produit.id);

  if (existingItem) {
    existingItem.quantite += quantite;
  } else {
    cart.push({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix_promo || produit.prix,
      prix_original: produit.prix,
      image: produit.image_url,
      quantite: quantite,
    });
  }

  saveCart(cart);

  // Animation de confirmation
  showCartNotification("Produit ajouté au panier !");

  return false;
}

// ---- RETIRER DU PANIER ----
function removeFromCart(produitId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== produitId);
  saveCart(cart);
  renderCartPage();
}

// ---- MODIFIER QUANTITÉ ----
function updateQuantity(produitId, change) {
  const cart = getCart();
  const item = cart.find((item) => item.id === produitId);

  if (item) {
    item.quantite += change;
    if (item.quantite <= 0) {
      removeFromCart(produitId);
      return;
    }
    saveCart(cart);
    renderCartPage();
  }
}

// ---- CALCULER LE TOTAL ----
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);
}

// ---- FORMAT PRIX ----
function formatPrix(prix) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(prix)) + " F CFA";
}

// ---- NOTIFICATION ----
function showCartNotification(message) {
  const notif = document.createElement("div");
  notif.className = "cart-notification";
  notif.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add("show"), 10);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}

// ---- GÉNÉRER LE TICKET TEXTE ----
function generateTicketText() {
  const cart = getCart();
  if (cart.length === 0) return "";

  let user = null;
  if (isUserLoggedIn()) {
    user = getCurrentUser();
  }

  let text = `🛒 *COMMANDE - Perles & Élégance*\n\n`;

  if (user) {
    text += `👤 *Client:* ${user.nom}\n`;
    text += `📧 *Email:* ${user.email}\n`;
    if (user.telephone) {
      text += `📱 *Téléphone:* ${user.telephone}\n`;
    }
    text += `\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let total = 0;
  cart.forEach((item, index) => {
    const sousTotal = item.prix * item.quantite;
    total += sousTotal;
    text += `${index + 1}. *${item.nom}*\n`;
    text += `   Quantité: ${item.quantite}\n`;
    text += `   Prix: ${formatPrix(item.prix)} × ${item.quantite} = ${formatPrix(sousTotal)}\n\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*TOTAL: ${formatPrix(total)}*\n\n`;
  text += `Merci pour votre commande ! 📦`;

  return text;
}

// ---- TÉLÉCHARGER TICKET HTML COULEUR ----
function downloadTicket() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // Vérifier si l'utilisateur est connecté
  if (!isUserLoggedIn()) {
    requireAuth(downloadTicket);
    return;
  }

  const user = getCurrentUser();
  const now = new Date();
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const ref = "CMD-" + Date.now().toString().slice(-8);

  // Calculer le total
  let total = 0;
  let itemsHtml = "";
  cart.forEach((item, index) => {
    const sousTotal = item.prix * item.quantite;
    total += sousTotal;
    itemsHtml += `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">
          <strong>${index + 1}. ${item.nom}</strong>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantite}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: right;">${formatPrix(item.prix)}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #eee; text-align: right; color: #d4af37; font-weight: bold;">${formatPrix(sousTotal)}</td>
      </tr>
    `;
  });

  // Générer le HTML du ticket avec couleurs
  const ticketHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reçu de Commande - Perles & Élégance</title>
</head>
<body style="margin: 0; padding: 20px; background: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
    
    <!-- En-tête coloré -->
    <div style="background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); padding: 30px; text-align: center; color: white;">
      <div style="font-size: 40px; margin-bottom: 10px;">✦</div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">PERLES & ÉLÉGANCE</h1>
      <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Artisanats de Qualité - Burkina Faso</p>
    </div>

    <!-- Titre reçu -->
    <div style="background: #1a1a1a; padding: 15px; text-align: center;">
      <h2 style="margin: 0; color: #d4af37; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">
        📄 Reçu de Commande
      </h2>
    </div>

    <!-- Infos commande -->
    <div style="padding: 25px; background: #fafafa;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;">
            <span style="color: #666; font-size: 13px;">📅 Date</span><br>
            <strong>${dateStr}</strong>
          </td>
          <td style="padding: 8px 0; text-align: right;">
            <span style="color: #666; font-size: 13px;">🆔 Référence</span><br>
            <strong style="color: #d4af37; font-size: 16px;">${ref}</strong>
          </td>
        </tr>
      </table>
    </div>

    <!-- Infos client -->
    <div style="padding: 25px; border-top: 2px dashed #ddd;">
      <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
        👤 Informations Client
      </h3>
      <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37;">
        <p style="margin: 5px 0; color: #333;">
          <strong style="color: #d4af37;">└─</strong> <strong>Nom:</strong> ${user.nom}
        </p>
        <p style="margin: 5px 0; color: #333;">
          <strong style="color: #d4af37;">└─</strong> <strong>Email:</strong> ${user.email}
        </p>
        ${
          user.telephone
            ? `<p style="margin: 5px 0; color: #333;">
          <strong style="color: #d4af37;">└─</strong> <strong>Téléphone:</strong> ${user.telephone}
        </p>`
            : ""
        }
      </div>
    </div>

    <!-- Détails commande -->
    <div style="padding: 25px; border-top: 2px dashed #ddd;">
      <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
        🛒 Détails de la Commande
      </h3>
      <table style="width: 100%; border-collapse: collapse; background: #fafafa; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #1a1a1a; color: white;">
            <th style="padding: 12px 8px; text-align: left; font-size: 12px;">Article</th>
            <th style="padding: 12px 8px; text-align: center; font-size: 12px;">Qté</th>
            <th style="padding: 12px 8px; text-align: right; font-size: 12px;">Prix</th>
            <th style="padding: 12px 8px; text-align: right; font-size: 12px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding: 25px; border-top: 2px dashed #ddd; background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);">
      <div style="display: flex; justify-content: space-between; align-items: center; color: white;">
        <span style="font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">💰 Total à Payer</span>
        <span style="font-size: 32px; font-weight: 700; color: #d4af37;">${formatPrix(total)}</span>
      </div>
    </div>

    <!-- Informations importantes -->
    <div style="padding: 25px; background: #fff9e6; border-top: 2px dashed #d4af37;">
      <h4 style="margin: 0 0 10px; color: #1a1a1a; font-size: 14px;">
        📌 Informations Importantes
      </h4>
      <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 13px; line-height: 1.8;">
        <li>Ce reçu fait foi de votre commande</li>
        <li>Contactez-nous pour toute modification</li>
        <li>Paiement à la livraison uniquement</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="padding: 30px; text-align: center; background: #1a1a1a; color: white;">
      <div style="font-size: 24px; margin-bottom: 10px;">🙏</div>
      <h3 style="margin: 0 0 10px; color: #d4af37;">MERCI POUR VOTRE COMMANDE !</h3>
      <p style="margin: 0; opacity: 0.8; font-size: 13px;">
        Perles & Élégance<br>
        Artisanats de qualité made in Burkina
      </p>
    </div>

  </div>
</body>
</html>
  `;

  // Créer et télécharger le fichier HTML
  const blob = new Blob([ticketHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commande-perles-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showCartNotification("Ticket téléchargé avec succès !");
}

// ---- ENVOYER SUR WHATSAPP ----
function sendToWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  // Vérifier si l'utilisateur est connecté
  if (!isUserLoggedIn()) {
    requireAuth(sendToWhatsApp);
    return;
  }

  const text = generateTicketText();
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank");
}

// ---- AFFICHER LA PAGE PANIER ----
function renderCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <h3>Votre panier est vide</h3>
                <p>Découvrez nos créations et ajoutez-les à votre panier !</p>
                <a href="produits.html" class="btn btn-primary">
                    <i class="fas fa-store"></i> Voir les produits
                </a>
            </div>
        `;
    document.getElementById("cart-total").innerHTML = "";
    document.getElementById("cart-actions").style.display = "none";
    return;
  }

  document.getElementById("cart-actions").style.display = "flex";

  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const sousTotal = item.prix * item.quantite;
    total += sousTotal;

    html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.nom}" onerror="this.src='assets/images/placeholder.png'">
                </div>
                <div class="cart-item-info">
                    <h4>${item.nom}</h4>
                    <div class="cart-item-price">${formatPrix(item.prix)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantite}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-subtotal">
                    ${formatPrix(sousTotal)}
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
  });

  container.innerHTML = html;
  document.getElementById("cart-total").innerHTML = `
        <span>Total:</span>
        <strong>${formatPrix(total)}</strong>
    `;
}

// ---- AJOUTER AU PANIER DEPUIS CARTE PRODUIT ----
function addToCartFromCard(btn, id, nom, prix, prixOriginal, image) {
  const produit = {
    id: id,
    nom: nom,
    prix: prix,
    prix_original: prixOriginal,
    image_url: image,
  };
  addToCart(produit, 1);

  // Animation du bouton
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
  btn.style.background = "#25D366";
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = "";
  }, 1500);
}

// ---- INITIALISER À DOMContentLoaded ----
document.addEventListener("DOMContentLoaded", () => {
  initCart();
});
