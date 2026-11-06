// Shared interactions for Girls United Vietnam.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const form = document.getElementById("interest-form");
  const notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      notice.textContent = "Thanks for your interest! This is currently a design preview. Connect a form service before accepting real submissions.";
      notice.classList.add("notice-highlight");
    });
  }
});
