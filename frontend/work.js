fetch(`${CONFIG.API_BASE_URL}/works?populate=*`)
  .then((response) => response.json())
  .then((data) => {
    const works = data.data;

    const container = document.getElementById("work-container");
    const filterButtons = document.querySelectorAll('.filter-item');
    
    function renderWorks(filteredWorks) {
  container.innerHTML = "";

    filteredWorks.forEach((work) => {
      //  Fixed structure — direct access, no attributes
      const id = work.id;
      const title = work.Title;
      const body = work.Body || "";

      //  Correct - image is an array, so access first element
      // const imageUrl = work.image?.[0]?.url
      //   ? `http://localhost:1337${work.image[0].url}`
      //   : work.image?.[0]?.formats?.small?.url
      //     ? `http://localhost:1337${work.image[0].formats.small.url}`
      //     : 'https://via.placeholder.com/400x300?text=No+Image';

      //  Safely access image URL
      const imageUrl = (() => {
        const img = work.image?.[0]; // Get first image from array
        console.log('img: ', img);

        if (!img) return `${CONFIG.PLACEHOLDER_IMAGE}`;

        // if (img.url) return `${CONFIG.BASE_URL}${img.url}`; // For localhost image uncomment this and comment next line.
        if (img.url) return `${img.url}`; 
        if (img.formats?.small?.url)
          return `${CONFIG.BASE_URL}${img.formats.small.url}`;
        if (img.formats?.thumbnail?.url)
          return `${CONFIG.BASE_URL}${img.formats.thumbnail.url}`;

        return `${CONFIG.PLACEHOLDER_IMAGE}`;
      })();


      const workCard = document.createElement("div");
      workCard.classList.add("work-card");

      workCard.innerHTML = `
      <div class="image-container">
  <img src="${imageUrl}" alt="${title}" class="image-size" />
  <div class="corner-icon top-left">+</div>
  <div class="corner-icon top-right">+</div>
  <div class="corner-icon bottom-left">+</div>
  <div class="corner-icon bottom-right">+</div>
</div>

         <div class="work-content">
        <h2 class="strapi-title">${title}</h2>
        <p class="strapi-body">${body}</p>
         <h4 class="work-detailsMore" data-id="${id}">More Details</h4>
         </div>
      `;

      container.appendChild(workCard);
    });

          // Click → Go to work.html?id=...
     document.querySelectorAll('.work-detailsMore').forEach(details => {
  details.addEventListener('click', (e) => {
    const workId = e.target.dataset.id;
    // window.location.href = `workDetails.html?id=${workId}`;
    window.location.href = `/workDetails?id=${blogId}`;
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
