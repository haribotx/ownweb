document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  const footerUrl = new URL("footer.html", window.location.href).href;

  fetch(footerUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch footer: " + res.status);
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;

      // Load footer.css if it's not already present
      const cssHref = new URL("footer.css", window.location.href).href;
      if (!Array.from(document.querySelectorAll("link[rel=stylesheet]"))
                .some(link => new URL(link.href, window.location.href).href === cssHref)) {
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = "footer.css";
        document.head.appendChild(linkEl);
      }
    })
    .catch((err) => {
      console.error(err);
      placeholder.innerHTML = "<p style='text-align:center;color:#888'>Footer failed to load.</p>";
    });
});
