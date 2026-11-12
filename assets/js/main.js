
// Shared interactions and content loading for Girls United Vietnam.

document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );
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

  // Load a JSON content file safely
  async function loadJSON(path) {
    const response = await fetch(path + "?v=" + Date.now(), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Could not load " + path);
    }

    return response.json();
  }

  // Homepage
  loadJSON("content/home.json")
    .then(data => {
      const headline = document.querySelector(".hero-content h1");

      if (headline && data.home_heading) {
        headline.textContent = data.home_heading;
      }
    })
    .catch(error => console.error("Homepage content error:", error));

  // About Us
  loadJSON("content/about.json")
    .then(data => {
      const fields = [
        [".split-intro h2", "mission_heading"],
        [".split-intro .large-copy", "mission_intro"],
        [".split-intro .large-copy + p", "mission_detail"],
        [".values-grid > div:first-child h2", "belief_heading"],
        [".story-grid > div:last-child > p:not(.eyebrow)", "how_we_work"]
      ];

      fields.forEach(([selector, key]) => {
        const element = document.querySelector(selector);

        if (element && typeof data[key] === "string" && data[key].trim()) {
          element.textContent = data[key];
        }
      });
    })
    .catch(error => console.error("About content error:", error));

  // Initiatives
  loadJSON("content/initiatives.json")
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error("Initiatives data must be a list");
      }

      data.forEach(item => {
        if (!item.slug) return;

        const row = document.getElementById(item.slug);
        if (!row || !row.classList.contains("initiative-row")) return;

        const number = row.querySelector(".initiative-photo span");
        const eyebrow = row.querySelector(".initiative-content .eyebrow");
        const title = row.querySelector(".initiative-content h2");
        const description = row.querySelector(
          ".initiative-content > p:not(.eyebrow)"
        );
        const list = row.querySelector(".initiative-content ul");

        if (number && item.number) number.textContent = item.number;
        if (eyebrow && item.eyebrow) eyebrow.textContent = item.eyebrow;
        if (title && item.title) title.textContent = item.title;

        if (description && item.description) {
          description.textContent = item.description;
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

  // Events
  loadJSON("content/events.json")
    .then(data => {
      if (!Array.isArray(data) || !data.length) return;

      const container = document.querySelector(".event-listing")?.parentElement;
      if (!container) return;

      const cards = data.map(item => {
        const card = document.createElement("div");
        card.className = "event-listing";

        const photo = document.createElement("div");
        photo.className = "event-list-image";
        if (item.image_class) {
          const allowed = ["event-art", "event-sport", "event-community"];
          if (allowed.includes(item.image_class)) {
            photo.classList.add(item.image_class);
          }
        }

        const content = document.createElement("div");
        content.className = "event-list-content";

        const status = document.createElement("span");
        status.className = "event-status";
        status.textContent = item.status || "Event";

        const eyebrow = document.createElement("p");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = item.eyebrow || "";

        const title = document.createElement("h3");
        title.textContent = item.title || "";

        const description = document.createElement("p");
        description.textContent = item.description || "";

        const detail = document.createElement("span");
        detail.className = "event-detail";
        detail.textContent = item.detail || "";

        content.append(status, eyebrow, title, description, detail);
        card.append(photo, content);
        return card;
      });

      container.querySelectorAll(".event-listing").forEach(card => card.remove());
      container.append(...cards);
    })
    .catch(error => console.error("Events content error:", error));

  // Team
  loadJSON("content/team.json")
    .then(data => {
      if (!Array.isArray(data) || !data.length) return;

      const container = document.querySelector(".team-grid");
      if (!container) return;

      const avatarClasses = ["avatar-peach", "avatar-yellow", "avatar-plum"];

      const cards = data.map((person, index) => {
        const card = document.createElement("article");
        card.className = "team-card";

        const avatar = document.createElement("div");
        avatar.className = "team-avatar " + avatarClasses[index % 3];

        if (person.image) {
          const image = document.createElement("img");
          image.src = person.image;
          image.alt = person.name ? person.name : "Team member";
          avatar.replaceChildren(image);
        } else {
          const initial = document.createElement("span");
          initial.textContent = (person.name || "?").trim().charAt(0).toUpperCase();
          avatar.appendChild(initial);
        }

        const info = document.createElement("div");
        info.className = "team-info";

        const role = document.createElement("p");
        role.className = "eyebrow";
        role.textContent = person.role || "";

        const name = document.createElement("h3");
        name.textContent = person.name || "";

        info.append(role, name);

        if (person.bio) {
          const bio = document.createElement("p");
          bio.textContent = person.bio;
          info.appendChild(bio);
        }

        card.append(avatar, info);
        return card;
      });

      container.replaceChildren(...cards);
    })
    .catch(error => console.error("Team content error:", error));

  // Interest form preview
  const form = document.getElementById("interest-form");
  const notice = document.getElementById("form-notice");

  if (form && notice) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      notice.textContent =
        "Thanks for your interest! This is currently a design preview. Connect a form service before accepting real submissions.";
      notice.classList.add("notice-highlight");
    });
  }
});
