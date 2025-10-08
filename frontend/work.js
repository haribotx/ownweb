fetch("http://localhost:1337/api/works?populate=*")
  .then((response) => response.json())
  .then((data) => {
    console.log("API Response:", data);
    const works = data.data;
    console.log("works: ", works);

    const container = document.getElementById("work-container");
    container.innerHTML = "";

    works.forEach((work) => {
      // ✅ Fixed structure — direct access, no attributes
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

        if (!img) return "https://via.placeholder.com/400x300?text=No+Image";

        if (img.url) return `http://localhost:1337${img.url}`;
        if (img.formats?.small?.url)
          return `http://localhost:1337${img.formats.small.url}`;
        if (img.formats?.thumbnail?.url)
          return `http://localhost:1337${img.formats.thumbnail.url}`;

        return "https://via.placeholder.com/400x300?text=No+Image";
      })();

      const workCard = document.createElement("div");
      workCard.classList.add("work-card");

      workCard.innerHTML = `
        <img src="${imageUrl}" />
         <div class="work-content">
        <h2>${title}</h2>
        <p>${body}</p>
         <h4 class="work-detailsMore">details more</h4>
         </div>
      `;

      container.appendChild(workCard);
    });
  })
  .catch((error) => console.error("Error fetching works:", error));
