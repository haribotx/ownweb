const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

if (!blogId) {
  document.body.innerHTML = "<h2 style='text-align:center;'>No blog selected.</h2>";
} else {
  fetch(`${CONFIG.API_BASE_URL}/blogs?filters[id][$eq]=${blogId}&populate=*`)
    .then((response) => response.json())
    .then((data) => {
      const blog = data.data && data.data.length > 0 ? data.data[0] : null;
      if (!blog) {
        document.body.innerHTML = "<h2 style='text-align:center;'>Blog not found.</h2>";
        return;
      }

      const authorName = blog.Author || "Unknown Author";
      const createdAt = new Date(blog.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const meta = document.getElementById("blog-meta");
      if (meta) meta.innerHTML = `// <span id="blog-meta-name">${authorName}</span> · ${createdAt}`;


      const imgContainer = document.querySelector(".blog-image");
      if (imgContainer) {
        if (blog.image && blog.image.length > 0) {
          let imageHTML = "";
          blog.image.forEach((img) => {
            if (img && img.url) {
              // imageHTML += `<img src="${CONFIG.BASE_URL}${img.url}" alt="${blog.Title || "Blog Image"}">`; // for localhost enable it comment next line
               imageHTML += `<img src="${img.url}" alt="${blog.Title || "Blog Image"}">`;

            }
          });
          imgContainer.innerHTML = imageHTML;
        } else {
          imgContainer.innerHTML = `<img src="./images/logo.png" alt="Default Blog Image" style="width:100%; border-radius:10px;">`;
        }
      }


      //  Remove static sections before inserting dynamic ones
      document.querySelectorAll(".blog-section").forEach((el) => el.remove());

      //  Render dynamic sections using exact CSS layout
      const blogContainer = document.querySelector(".blog-container");
      if (blog.Sections && blog.Sections.length > 0) {
        blog.Sections.forEach((section) => {
          const div = document.createElement("div");
          div.classList.add("blog-section");

          //  Convert Rich Text JSON to HTML
          let contentHTML = "";
          const content = section.Contents;

          if (Array.isArray(content)) {
            content.forEach((block) => {
              if (block.type === "paragraph") {
                contentHTML += `<p>${block.children.map((child) => child.text).join("")}</p>`;
              } else if (block.type === "list" && block.format === "unordered") {
                contentHTML += "<ul>";
                block.children.forEach((li) => {
                  const liText = li.children.map((c) => c.text).join("");
                  contentHTML += `<li>${liText}</li>`;
                });
                contentHTML += "</ul>";
              } else if (block.type === "list" && block.format === "ordered") {
                contentHTML += "<ol>";
                block.children.forEach((li) => {
                  const liText = li.children.map((c) => c.text).join("");
                  contentHTML += `<li>${liText}</li>`;
                });
                contentHTML += "</ol>";
              } else if (block.type === "heading") {
                const level = block.level || 3;
                const text = block.children.map((child) => child.text).join("");
                contentHTML += `<h${level}>${text}</h${level}>`;
              }
            });
          } else if (typeof content === "object" && content.children) {
            // Sometimes it's a single richtext object
            contentHTML = content.children.map((c) => c.text).join("<br>");
          } else {
            // Fallback for plain text
            contentHTML = content || "";
          }

          div.innerHTML = `
            <h2 class="section-title">${section.Title || "Untitled"}:</h2>
            <div class="section-text">${contentHTML}</div>
          `;
          blogContainer.appendChild(div);
        });
      } else {
        const msg = document.createElement("p");
        msg.textContent = "";
        msg.style.textAlign = "center";
        blogContainer.appendChild(msg);
      }
    })
    .catch((error) => {
      console.error("Error loading blog:", error);
      document.body.innerHTML = "<h2 style='text-align:center;'>Error loading blog details.</h2>";
    });
}

//  Fetch latest 3 blogs and show 2 excluding current one
const latestContainer = document.querySelector(".latest-blogs");

fetch(`${CONFIG.API_BASE_URL}/blogs?sort=createdAt:desc&pagination[limit]=3&populate=*`)
  .then((res) => res.json())
  .then((data) => {
    if (!data.data || data.data.length === 0) {
      if (latestContainer) latestContainer.innerHTML = "<p>No blogs found.</p>";
      return;
    }

    const latestBlogs = data.data.filter((b) => b.id != blogId).slice(0, 2);


    let cardsHTML = "";

    latestBlogs.forEach((blog) => {
      const title = blog.Title || "No Title";
      const description =
        blog.Body && blog.Body[0]?.children?.[0]?.text
          ? blog.Body[0].children[0].text
          : "No Description";

      let imageUrl = "./images/logo.png";
      if (blog.image && blog.image.length > 0 && blog.image[0].url) {
        // imageUrl = `${CONFIG.BASE_URL}${blog.image[0].url}`;
        imageUrl = `${blog.image[0].url}`;
      }

      cardsHTML += `
        <div class="blog-card" onclick="window.location.href='blogDetails.html?id=${blog.id}'" style="cursor:pointer;">
          <img src="${imageUrl}" alt="${title}">
          <div class="blog-card-info">
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
        </div>
      `;
    });

    if (latestContainer) latestContainer.innerHTML = cardsHTML;
  })
  .catch((err) => {
    console.error("Error fetching latest blogs:", err);
    if (latestContainer) latestContainer.innerHTML = "<p>Error loading blogs.</p>";
  });


  