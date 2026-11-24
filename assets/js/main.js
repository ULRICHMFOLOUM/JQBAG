// ============================================================
// MAIN.JS — Perles & Élégance
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---- LOADER ----
  const loader = document.getElementById("loader");
  if (loader) {
    // Masquer le loader après 1.5 secondes max
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 1500);
  }

  // ---- CURSEUR ----
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  if (dot && outline) {
    let mouseX = 0,
      mouseY = 0;
    let outX = 0,
      outY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    (function animateOutline() {
      outX += (mouseX - outX) * 0.12;
      outY += (mouseY - outY) * 0.12;
      outline.style.left = outX + "px";
      outline.style.top = outY + "px";
      requestAnimationFrame(animateOutline);
    })();
  }

  // ---- HEADER SCROLL ----
  const header = document.getElementById("main-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- BURGER MENU ----
  const burger = document.getElementById("burger");
  const nav = document.getElementById("main-nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      nav.classList.toggle("open");
    });
    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        burger.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }

  // ---- YEAR ----
  document
    .querySelectorAll("#year")
    .forEach((el) => (el.textContent = new Date().getFullYear()));

  // ---- SCROLL TOP ----
  const scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
      },
      { passive: true },
    );
    scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  // ---- PARTICULES DE FOND ----
  const particlesContainer = document.getElementById("particles-container");
  if (particlesContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${Math.random() * 12 + 10}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ---- COMPTEUR ANIMÉ (hero stats) ----
  const countEls = document.querySelectorAll(".stat-num[data-target]");
  if (countEls.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + (el.dataset.suffix || "+");
      }, 16);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    countEls.forEach((el) => {
      el.dataset.suffix = "+";
      obs.observe(el);
    });
  }

  // ---- REVEAL ANIMATION ----
  const revealEls = document.querySelectorAll(
    ".why-card, .category-card, .gallery-item, .why-us, .section-header, .contact-method",
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 80);
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  // ---- SLIDER TÉMOIGNAGES ----
  const cards = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  if (cards.length && dots.length) {
    let current = 0;
    const goTo = (idx) => {
      cards[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = idx;
      cards[current].classList.add("active");
      dots[current].classList.add("active");
    };
    dots.forEach((dot) =>
      dot.addEventListener("click", () => goTo(parseInt(dot.dataset.index))),
    );
    setInterval(() => goTo((current + 1) % cards.length), 5000);
  }

  // ---- ANNONCE BAR (duplication pour ticker infini) ----
  const inner = document.querySelector(".announcement-inner");
  if (inner) {
    inner.innerHTML += inner.innerHTML;
  }
});
