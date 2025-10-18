document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) {
    console.error("Header placeholder not found");
    return;
  }

  const headerUrl = new URL("header.html", window.location.href).href;
  const cssHref = new URL("header.css", window.location.href).href;
  const jsHref = new URL("header.js", window.location.href).href;

  fetch(headerUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch header: " + res.status);
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;

      // Force load header.css
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = "header.css"; // Correct path based on structure
      document.head.appendChild(linkEl);

      // Force load header.js after HTML injection
      const scriptEl = document.createElement("script");
      scriptEl.src = "header.js"; // Correct path based on structure
      scriptEl.onload = () => {
        // Ensure DOM is ready and reinitialize
        if (typeof initHamburgerMenu === "function") {
          initHamburgerMenu();
        } else {
          console.error("initHamburgerMenu function not found");
        }
      };
      scriptEl.onerror = (e) => {
        console.error("Failed to load header.js:", e);
      };
      document.body.appendChild(scriptEl);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      placeholder.innerHTML =
        "<p style='text-align:center;color:#888'>Header failed to load.</p>";
    });
});