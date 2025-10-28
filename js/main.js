// js/main.js
// Versão corrigida — robusta e reutilizável

// ===== MENU HAMBURGUER (cria apenas se não existir) =====
(function initMenu() {
    const header = document.querySelector("header");
    if (!header) return;
  
    // só cria se não existir
    if (!document.getElementById("menu-toggle")) {
      const nav = header.querySelector("nav");
      const wrapper = header.querySelector(".flex.justify-between, .container .flex");
      if (!nav || !wrapper) return;
  
      // botão
      const btn = document.createElement("button");
      btn.id = "menu-toggle";
      btn.innerHTML = '<span class="material-symbols-outlined text-3xl">menu</span>';
      btn.className = "md:hidden p-2 rounded text-gray-700 dark:text-gray-200";
  
      // insere antes da nav (preserva estrutura)
      wrapper.insertBefore(btn, nav);
  
      // menu mobile (clona os links do nav)
      const mobileMenu = document.createElement("div");
      mobileMenu.id = "mobile-menu";
      mobileMenu.className = "hidden md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700";
      mobileMenu.innerHTML = `<nav class="flex flex-col items-center py-4 space-y-3">${nav.innerHTML}</nav>`;
      header.appendChild(mobileMenu);
  
      btn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    }
  
    // Esconde "Fale conosco" no mobile (aplica classes responsivas)
    const fale = header.querySelector("a[href][class*='bg-primary'], a.bg-primary");
    if (fale) {
      fale.classList.add("hidden", "sm:inline-block");
    }
  })();
  
  
  // ===== CARROSSEL: converte a grid OFERTAS em faixa rolável e conecta setas =====
  (function initCarousel() {
    // encontra o heading "OFERTAS" (case-insensitive)
    const headings = Array.from(document.querySelectorAll("h2, h1, h3"));
    const ofertasHeading = headings.find(h => h.textContent && h.textContent.trim().toUpperCase().startsWith("OFERTAS"));
    if (!ofertasHeading) return;
  
    // sobe até a section que contém esse heading
    let section = ofertasHeading.closest("section");
    if (!section) return;
  
    // localiza os botões de seta dentro da section (existem 2 buttons no markup original)
    const buttons = Array.from(section.querySelectorAll("button"));
    if (buttons.length < 2) return;
  
    // identifica qual botão é prev / next checando o texto do span
    let prevBtn = null, nextBtn = null;
    buttons.forEach(btn => {
      const span = btn.querySelector("span.material-symbols-outlined");
      if (!span) return;
      const txt = span.textContent.trim().toLowerCase();
      if (txt.includes("chevron_left") || txt.includes("left")) prevBtn = btn;
      if (txt.includes("chevron_right") || txt.includes("right")) nextBtn = btn;
    });
  
    // fallback: se não identificou, usa ordem (primeiro = prev, último = next)
    if (!prevBtn) prevBtn = buttons[0];
    if (!nextBtn) nextBtn = buttons[buttons.length - 1];
  
    // localiza o grid de cards dentro da section (o original tem uma div.grid ...)
    const carouselGrid = section.querySelector(".grid");
    if (!carouselGrid) return;
  
    // transforma o grid em carrossel horizontal
    carouselGrid.classList.remove("grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3");
    carouselGrid.classList.add("flex", "gap-8", "overflow-x-auto", "scroll-smooth", "snap-x", "snap-mandatory", "py-2");
    // opcional: para dispositivos touch
    carouselGrid.style.WebkitOverflowScrolling = "touch";
  
    // aplica tamanho mínimo a cada card filho direto (preserva estilos internos)
    const cards = Array.from(carouselGrid.children).filter(n => n.nodeType === 1);
    cards.forEach(card => {
      card.classList.add("min-w-[300px]", "snap-center", "flex-shrink-0");
      // garante que o card não encolha e mantenha seu layout
      card.style.minWidth = card.style.minWidth || "300px";
    });
  
    // função de scroll por "página"
    function scrollNext() {
      const visibleWidth = carouselGrid.offsetWidth;
      const maxScrollLeft = carouselGrid.scrollWidth - visibleWidth;
      const newLeft = Math.min(carouselGrid.scrollLeft + Math.round(visibleWidth / 1.2), carouselGrid.scrollWidth);
      if (carouselGrid.scrollLeft + visibleWidth >= carouselGrid.scrollWidth - 2) {
        // loop para início
        carouselGrid.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carouselGrid.scrollTo({ left: newLeft, behavior: "smooth" });
      }
    }
  
    function scrollPrev() {
      const visibleWidth = carouselGrid.offsetWidth;
      if (carouselGrid.scrollLeft <= 2) {
        // loop para fim
        carouselGrid.scrollTo({ left: carouselGrid.scrollWidth, behavior: "smooth" });
      } else {
        const newLeft = Math.max(carouselGrid.scrollLeft - Math.round(visibleWidth / 1.2), 0);
        carouselGrid.scrollTo({ left: newLeft, behavior: "smooth" });
      }
    }
  
    // anexa eventos seguros
    if (nextBtn) nextBtn.addEventListener("click", scrollNext);
    if (prevBtn) prevBtn.addEventListener("click", scrollPrev);
  
    // melhoria UX: clique em card centraliza ele (opcional)
    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        const rect = card.getBoundingClientRect();
        // centraliza o card aproximado
        const offset = rect.left + (rect.width / 2);
        const targetLeft = carouselGrid.scrollLeft + offset - (carouselGrid.offsetWidth / 2);
        carouselGrid.scrollTo({ left: targetLeft, behavior: "smooth" });
      });
    });
  
    // (opcional) comportamento por keyboard: ← e →
    section.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") scrollNext();
      if (e.key === "ArrowLeft") scrollPrev();
    });
  })();
  