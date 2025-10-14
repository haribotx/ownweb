// includeHeader.js
document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;

  // Resolve header.html relative to current page
  const headerUrl = new URL("header.html", window.location.href).href;

  fetch(headerUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch header: " + res.status);
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;

      // Load header.css if not already loaded
      const cssHref = new URL("header.css", window.location.href).href;
      if (
        !Array.from(document.querySelectorAll("link[rel=stylesheet]")).some(
          (link) => new URL(link.href, window.location.href).href === cssHref
        )
      ) {
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = "header.css";
        document.head.appendChild(linkEl);
      }
    })
    .catch((err) => {
      console.error(err);
      placeholder.innerHTML =
        "<p style='text-align:center;color:#888'>Header failed to load.</p>";
    });
});
