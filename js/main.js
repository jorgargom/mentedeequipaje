/* Mente de Equipaje: navegación accesible y animaciones discretas */
(() => {

  // Remember explicit language choices and detect the browser language on the neutral entry URL.
  document.querySelectorAll("[data-language-choice]").forEach((link) => {
    link.addEventListener("click", () => {
      try { localStorage.setItem("mente-equipaje-language", link.dataset.languageChoice); } catch (_) {}
    });
  });
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    let saved = null;
    try { saved = localStorage.getItem("mente-equipaje-language"); } catch (_) {}
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language || "es"];
    const detected = languages.map((x) => x.toLowerCase());
    const browserLanguage = detected.some((x) => x.startsWith("de")) ? "de"
      : detected.some((x) => x.startsWith("en")) ? "en" : "es";
    const preferred = ["es", "de", "en"].includes(saved) ? saved : browserLanguage;
    if (preferred === "de") { window.location.replace("/de/"); return; }
    if (preferred === "en") { window.location.replace("/en/"); return; }
  }

  const menuButton = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const menuLabel = menuButton?.querySelector(".sr-only");

  if (menuButton && siteNav) {
    const setMenuOpen = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      siteNav.classList.toggle("is-open", open);
      if (menuLabel) menuLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
    };

    menuButton.addEventListener("click", () => {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const revealItems = document.querySelectorAll(
    ".hero-copy, .hero-art, .intro-grid, .content-section, .conversation-grid, .about-section"
  );
  if (!revealItems.length) return;

  document.body.classList.add("has-motion");
  revealItems.forEach((item, index) => {
    item.dataset.reveal = "";
    item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
  });

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item) => observer.observe(item));
})();
