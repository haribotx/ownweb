fetch(`${CONFIG.API_BASE_URL}/works?populate=*`)
  .then((response) => response.json())
  .then((data) => {
    console.log("API Response:", data);
    const works = data.data;
    console.log("works: ", works);

    const container = document.getElementById("work-container");
    const filterButtons = document.querySelectorAll('.filter-item');
    
    function renderWorks(filteredWorks) {
  container.innerHTML = "";

    filteredWorks.forEach((work) => {
      console.log('filteredWorks: ', filteredWorks);
      // ✅ Fixed structure — direct access, no attributes
      const id = work.id;
      const title = work.Title;
      const body = work.Body || "";
      console.log("body: ", body);

      // ✅ Correct - image is an array, so access first element
      // const imageUrl = work.image?.[0]?.url
      //   ? `http://localhost:1337${work.image[0].url}`
      //   : work.image?.[0]?.formats?.small?.url
      //     ? `http://localhost:1337${work.image[0].formats.small.url}`
      //     : 'https://via.placeholder.com/400x300?text=No+Image';

      // ✅ Safely access image URL
      const imageUrl = (() => {
        const img = work.image?.[0]; // Get first image from array
        console.log('img: ', img);

        if (!img) return `${CONFIG.PLACEHOLDER_IMAGE}`;

        if (img.url) return `${CONFIG.BASE_URL}${img.url}`;
        if (img.formats?.small?.url)
          return `${CONFIG.BASE_URL}${img.formats.small.url}`;
        if (img.formats?.thumbnail?.url)
          return `${CONFIG.BASE_URL}${img.formats.thumbnail.url}`;

        return `${CONFIG.PLACEHOLDER_IMAGE}`;
      })();

      const workCard = document.createElement("div");
      workCard.classList.add("work-card");

      workCard.innerHTML = `
        <img src="${imageUrl}" />
         <div class="work-content">
        <h2>${title}</h2>
        <p>${body}</p>
         <h4 class="work-detailsMore" data-id="${id}">More Details</h4>
         </div>
      `;

      container.appendChild(workCard);
    });

          // ✅ Click → Go to blog.html?id=...
      document.querySelectorAll('.work-detailsMore').forEach(details => {
        details.addEventListener('click', (e) => {
          const workId = e.target.dataset.id;
          window.location.href = `work-details/index.html?id=${workId}`;

        });
      });
  
  }
  renderWorks(works);

  filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active class from all
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    const filtered = works.filter((work) => {
      return work.category?.toLowerCase() === category.toLowerCase();
    });
    if (filtered.length > 0) {
      renderWorks(filtered);
    } else {
      container.innerHTML = `<div class="no-works">
      <p>Coming Soon....</p>
    </div>`;
    }
  });
}
)
  })
  .catch((error) => console.error("Error fetching works:", error));
