
document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) {
    console.error("Header placeholder not found");
    return;
  }

  const headerUrl = "/frontend/header.html"; 
  const cssHref = "/frontend/header.css";    
  const jsHref = "/frontend/header.js";      


  fetch(headerUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch header: " + res.status);
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;

      // ✅ Inject header.css
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = cssHref;
      document.head.appendChild(linkEl);

      // ✅ Wait for HTML to render first, then reattach hamburger functionality
      setTimeout(() => {
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        const navLinks = document.querySelectorAll(".nav-link");

        if (hamburger && navMenu) {
          hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
          });

          navLinks.forEach((link) => {
            link.addEventListener("click", () => {
              hamburger.classList.remove("active");
              navMenu.classList.remove("active");
            });
          });
        } else {
          console.warn("Hamburger elements not found after header load.");
        }
      }, 300); // wait 300ms to ensure DOM is injected
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      placeholder.innerHTML =
        "<p style='text-align:center;color:#888'>Header failed to load.</p>";
    });
});
