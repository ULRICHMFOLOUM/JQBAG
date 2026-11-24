// ============================================================
// ADMIN.JS — Scripts espace administration
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Marquer lien actif sidebar selon URL
  const links = document.querySelectorAll(".sidebar-link");
  const current = window.location.pathname.split("/").pop();
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href === current) link.classList.add("active");
  });

  // Confirmer suppression
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
        e.preventDefault();
      }
    });
  });

  // Auto-dismiss des alertes
  document.querySelectorAll(".alert").forEach((alert) => {
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transition = "opacity .5s";
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });
});
