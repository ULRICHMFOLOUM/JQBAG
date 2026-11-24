// ============================================================
// PRODUITS.JS — Chargement et affichage des produits
// ============================================================

// Numéro WhatsApp (sans le +)
const WA_NUMBER = "22600000000";

// ---- FORMAT PRIX ----
function formatPrix(prix) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(prix)) + " F CFA";
}

// ---- CRÉER UNE CARTE PRODUIT ----
function createProductCard(produit, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.animationDelay = index * 0.08 + "s";

  const hasPromo =
    produit.prix_promo &&
    parseFloat(produit.prix_promo) < parseFloat(produit.prix);
  const prixAff = hasPromo ? produit.prix_promo : produit.prix;
  const isVedette = parseInt(produit.vedette) === 1;

  const waText = encodeURIComponent(
    `Bonjour ! Je souhaite commander :\n\n📦 *${produit.nom}*\n💰 Prix : ${formatPrix(prixAff)}\n\nMerci de confirmer la disponibilité.`,
  );
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  // Stocker le produit pour l'ajouter au panier
  const produitData = JSON.stringify({
    id: produit.id,
    nom: produit.nom,
    prix: prixAff,
    prix_original: produit.prix,
    image_url: produit.image_url,
  });

  card.innerHTML = `
    <div class="product-img-wrap">
      <img
        src="${escHtml(produit.image_url)}"
        alt="${escHtml(produit.nom)}"
        loading="lazy"
        onerror="this.src='assets/images/placeholder.png'"
      />
      ${hasPromo ? '<span class="product-badge badge-promo">Promo</span>' : ""}
      ${isVedette && !hasPromo ? '<span class="product-badge badge-vedette">✦ Vedette</span>' : ""}
      <div class="product-actions">
        <button class="btn-action btn-action-cart" onclick="addToCartFromCard(this, ${produit.id}, '${escHtml(produit.nom).replace(/'/g, "\\'")}', ${prixAff}, ${produit.prix}, '${escHtml(produit.image_url).replace(/'/g, "\\'")}')">
          <i class="fas fa-shopping-basket"></i> Ajouter
        </button>
        <a href="detail-produit.html?id=${produit.id}" class="btn-action btn-action-secondary">
          Voir détails
        </a>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${escHtml(produit.categorie_nom || "")}</div>
      <h3 class="product-name">
        <a href="detail-produit.html?id=${produit.id}">${escHtml(produit.nom)}</a>
      </h3>
      <div class="product-price">
        <span class="price-main">${formatPrix(prixAff)}</span>
        ${hasPromo ? `<span class="price-original">${formatPrix(produit.prix)}</span>` : ""}
      </div>
    </div>
  `;

  return card;
}

// ---- CHARGER LES PRODUITS ----
let isLoadingProducts = false;

async function loadProducts(containerId, params = {}) {
  const container = document.getElementById(containerId);
  if (!container || isLoadingProducts) return;

  isLoadingProducts = true;
  container.innerHTML =
    '<div class="loading-spinner"><div class="spinner"></div><p>Chargement...</p></div>';

  const qs = new URLSearchParams();
  if (params.categorie) qs.set("categorie", params.categorie);
  if (params.vedette) qs.set("vedette", "1");
  if (params.q) qs.set("q", params.q);
  if (params.limit) qs.set("limit", params.limit);

  try {
    const resp = await fetch(`api/get_produits.php?${qs.toString()}`);
    if (!resp.ok) throw new Error("Erreur réseau: " + resp.status);
    const data = await resp.json();

    if (!data.success || !data.data || data.data.length === 0) {
      container.innerHTML = "";
      const noP = document.getElementById("no-products");
      if (noP) noP.style.display = "block";
      isLoadingProducts = false;
      return;
    }

    const noP = document.getElementById("no-products");
    if (noP) noP.style.display = "none";

    container.innerHTML = "";
    let produits = [...data.data];

    // Tri client
    const sortEl = document.getElementById("sort-select");
    if (sortEl) {
      const sort = sortEl.value;
      if (sort === "price-asc")
        produits.sort(
          (a, b) => (a.prix_promo || a.prix) - (b.prix_promo || b.prix),
        );
      if (sort === "price-desc")
        produits.sort(
          (a, b) => (b.prix_promo || b.prix) - (a.prix_promo || a.prix),
        );
      if (sort === "name") produits.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    produits.forEach((p, i) => container.appendChild(createProductCard(p, i)));
    isLoadingProducts = false;
  } catch (err) {
    console.error("Erreur chargement produits:", err);
    container.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-exclamation-triangle" style="font-size:2rem;color:var(--gold);margin-bottom:12px;"></i>
        <p>Impossible de charger les produits.</p>
        <p style="font-size:.8rem;color:var(--white-60);margin-top:8px;">Vérifiez que XAMPP est démarré et la base de données importée.</p>
      </div>`;
    isLoadingProducts = false;
  }
}

// ---- CHARGER UN PRODUIT EN DÉTAIL ----
async function loadProductDetail(id) {
  const container = document.getElementById("product-detail-content");
  if (!container) return;

  try {
    const resp = await fetch(
      `api/get_produit.php?id=${encodeURIComponent(id)}`,
    );
    if (!resp.ok) throw new Error("Erreur réseau");
    const data = await resp.json();

    if (!data.success || !data.data) {
      container.innerHTML =
        '<p style="text-align:center;padding:60px;color:var(--white-60);">Produit introuvable.</p>';
      return;
    }

    const p = data.data;

    // Mise à jour breadcrumb et titre de page
    const breadEl = document.getElementById("detail-breadcrumb-name");
    if (breadEl) breadEl.textContent = p.nom;
    document.title = `${p.nom} — Perles & Élégance`;

    const hasPromo =
      p.prix_promo && parseFloat(p.prix_promo) < parseFloat(p.prix);
    const prixAff = hasPromo ? p.prix_promo : p.prix;

    const waText = encodeURIComponent(
      `Bonjour ! Je souhaite commander :\n\n📦 *${p.nom}*\n💰 Prix : ${formatPrix(prixAff)}\n\nMerci de confirmer la disponibilité.`,
    );
    const waOrderUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;
    const waInfoUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Bonjour, j'aimerais avoir plus d'informations sur : *${p.nom}*`)}`;

    // Images
    const images = [p.image_url, p.image_url_2, p.image_url_3].filter(Boolean);

    const thumbsHTML =
      images.length > 1
        ? images
            .map(
              (img, i) =>
                `<div class="thumb ${i === 0 ? "active" : ""}" data-img="${escHtml(img)}"><img src="${escHtml(img)}" alt="Vue ${i + 1}" onerror="this.src='assets/images/placeholder.png'" /></div>`,
            )
            .join("")
        : "";

    container.innerHTML = `
      <div class="product-detail-grid">
        <div class="detail-images">
          <div class="main-image-wrap" id="main-img-wrap">
            <img id="main-product-img" src="${escHtml(p.image_url)}" alt="${escHtml(p.nom)}" onerror="this.src='assets/images/placeholder.png'" />
          </div>
          ${thumbsHTML ? `<div class="thumbnails" id="thumbs">${thumbsHTML}</div>` : ""}
        </div>
        <div class="detail-info">
          <div class="detail-category">${escHtml(p.categorie_nom || "")}</div>
          <h1 class="detail-name">${escHtml(p.nom)}</h1>
          <div class="detail-price-wrap">
            <span class="detail-price">${formatPrix(prixAff)}</span>
            ${hasPromo ? `<span class="detail-price-original">${formatPrix(p.prix)}</span>` : ""}
          </div>
          <div class="detail-stock">
            <i class="fas fa-check-circle"></i>
            ${p.stock > 0 ? `En stock (${p.stock} disponibles)` : "Sur commande"}
          </div>
          <div class="detail-description">
            <p>${escHtml(p.description).replace(/\n/g, "<br>")}</p>
          </div>
          <div class="detail-actions">
            <a href="${waOrderUrl}" class="btn-wa-order" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i>
              Commander sur WhatsApp
            </a>
            <a href="${waInfoUrl}" class="btn-wa-info" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i>
              Demander plus d'infos
            </a>
          </div>
        </div>
      </div>
    `;

    // Miniatures interactives
    const thumbEls = container.querySelectorAll(".thumb");
    const mainImg = container.querySelector("#main-product-img");
    thumbEls.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        thumbEls.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        mainImg.src = thumb.dataset.img;
      });
    });

    // Produits similaires
    if (data.similaires && data.similaires.length > 0) {
      const simSection = document.getElementById("similaires-section");
      const simGrid = document.getElementById("similaires-grid");
      if (simSection && simGrid) {
        simSection.style.display = "block";
        data.similaires.forEach((s, i) =>
          simGrid.appendChild(createProductCard(s, i)),
        );
      }
    }
  } catch (err) {
    container.innerHTML = `<p style="text-align:center;padding:60px;color:var(--white-60);">Erreur de chargement. Vérifiez que XAMPP est actif.</p>`;
  }
}

// ---- SORT (écoute de changement) ----
document.addEventListener("DOMContentLoaded", () => {
  const sortEl = document.getElementById("sort-select");
  if (sortEl) {
    sortEl.addEventListener("change", () => {
      const activeCat = document.querySelector(".filter-btn.active");
      const q = document.getElementById("search-input")?.value || "";
      loadProducts("all-products", {
        categorie: activeCat?.dataset.cat || "",
        q,
      });
    });
  }
});

// ---- ESCAPE HTML ----
function escHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&#39;");
}
