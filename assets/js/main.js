
// Shared interactions for Girls United Vietnam.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  // Mobile navigation
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

  // Automatic footer year
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Load homepage content from Pages CMS
  fetch("content/home.json")
    .then(response => {
      if (!response.ok) throw new Error("Could not load homepage content");
      return response.json();
    })
    .then(data => {
      const headline = document.querySelector(".hero-content h1");

      if (headline && data.home_heading) {
        headline.textContent = data.home_heading;
      }
    })
    .catch(error => console.error("Homepage content error:", error));

  // Load initiatives from Pages CMS
  const initiativeRows = document.querySelectorAll(".initiative-row");

  if (initiativeRows.length) {
    fetch("content/initiatives.json?v=" + Date.now(), {
      cache: "no-store"
    })
      .then(response => {
        if (!response.ok) throw new Error("Could not load initiatives");
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("Initiatives data must be a list");
        }

        data.forEach((item, index) => {
          const row = initiativeRows[index];
          if (!row) return;

          const number = row.querySelector(".initiative-photo span");
          const eyebrow = row.querySelector(".initiative-content .eyebrow");
          const title = row.querySelector(".initiative-content h2");
          const description = row.querySelector(".initiative-content > p:not(.eyebrow)");
          const list = row.querySelector(".initiative-content ul");

          if (number && item.number) {
            number.textContent = item.number;
          }

          if (eyebrow && item.eyebrow) {
            eyebrow.textContent = item.eyebrow;
          }

          if (title && item.title) {
            title.textContent = item.title;
          }

          if (description && item.description) {
            description.textContent = item.description;
          }

          if (item.slug) {
            row.id = item.slug;
          }

          if (list && Array.isArray(item.points)) {
            list.replaceChildren();

            item.points.forEach(point => {
              const li = document.createElement("li");
              li.textContent = point;
              list.appendChild(li);
            });
          }
        });
      })
      .catch(error => console.error("Initiatives content error:", error));
  }

  // Interest form preview
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
