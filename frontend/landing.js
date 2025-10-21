// fetch(`${CONFIG.API_BASE_URL}/homepages?populate=*`)
//   .then((response) => response.json())
//   .then((data) => {
//     const homepages = data.data; // array
//     console.log('homepages: ', homepages);
//     const homepage = homepages[0]; // usually only one homepage
//     const clients = homepage?.clients || [];

//     const container = document.getElementById("clients-container");

//     // Clear container
//     container.innerHTML = "";

//     // Render all clients
//     clients.forEach((client) => {
//       const name = client.name || "Client";
      
//       // --- handle icon ---
//       const iconUrl = (() => {
//         const img = client.icon?.[0]; // if icon is an array
//         if (img?.url) return img.url;
//         if (client.icon?.data?.attributes?.url)
//           return `http://localhost:1337${client.icon.data.attributes.url}`;
//         return "images/default-icon.png";
//       })();

//       // --- handle image ---
//       const imageUrl = (() => {
//         const img = client.image?.[0];
//         if (img?.url) return img.url;
//         if (client.image?.data?.attributes?.url)
//           return `http://localhost:1337${client.image.data.attributes.url}`;
//         return "images/default-image.png";
//       })();

//       // --- create element ---
//       const brandDiv = document.createElement("div");
//       brandDiv.classList.add("brand");

//       brandDiv.innerHTML = `
//         <img src="${iconUrl}" alt="${name} Icon" class="brand-icon" />
//         <img src="${imageUrl}" alt="${name}" class="brand-image" />
//       `;

//       container.appendChild(brandDiv);
//     });
//   })
//   .catch((error) => console.error("Error fetching homepage:", error));



// fetch(`${CONFIG.API_BASE_URL}/homepages?populate=*`)
//   .then((response) => response.json())
//   .then((data) => {
//     const homepages = data.data || [];
//     console.log('homepages: ', homepages);
//     const container = document.querySelector(".bar-track");
//     container.innerHTML = ""; // Clear previous content

//     homepages.forEach((item) => {
//       const name = item.name || "";

//       // Get image and icon URLs separately
//       const imageObj = item.image?.[0];
//       const iconObj = item.icon?.[0];

//       const imageUrl = imageObj?.url ? `${CONFIG.BASE_URL}${imageObj.url}` : "";
//       const iconUrl = iconObj?.url ? `${CONFIG.BASE_URL}${iconObj.url}` : "";

//       // Create brand div
//       const brandDiv = document.createElement("div");
//       brandDiv.classList.add("brand");

//       brandDiv.innerHTML = `
//         <img src="${iconUrl}" alt="${name} Icon" class="brand-icon" />
//         <img src="${imageUrl}" alt="${name} Image" class="brand-image" />
//       `;

//       container.appendChild(brandDiv);
//     });

//     // Duplicate for continuous scroll effect
//     // const clone = container.cloneNode(true);
//     // container.parentElement.appendChild(clone);
//   })
//   .catch((error) => console.error("Error fetching homepages:", error));


fetch(`${CONFIG.API_BASE_URL}/homepages?populate=*`)
  .then((response) => response.json())
  .then((data) => {
    const homepages = data.data || [];
    const container = document.querySelector(".bar-track");
    container.innerHTML = ""; // Clear previous content

    homepages.forEach((item) => {
      const name = item.name || "";

      // Separate icon and image from same array based on file type
      const iconObj = item.image?.find((img) =>
        img.ext === ".png" || img.mime === "image/png"
      );
      const imageObj = item.image?.find((img) =>
        img.ext === ".svg" || img.mime === "image/svg+xml"
      );

      const iconUrl = iconObj?.url ? `${CONFIG.BASE_URL}${iconObj.url}` : "";
      const imageUrl = imageObj?.url ? `${CONFIG.BASE_URL}${imageObj.url}` : "";

      // Create brand container
      const brandDiv = document.createElement("div");
      brandDiv.classList.add("brand");

      brandDiv.innerHTML = `
        <img src="${iconUrl}" alt="${name} Icon" class="brand-icon" />
        <img src="${imageUrl}" alt="${name} Image" class="brand-image" />
      `;

      container.appendChild(brandDiv);
    });

    // Duplicate for continuous scroll effect
    const clone = container.cloneNode(true);
    container.parentElement.appendChild(clone);
  })
  .catch((error) => console.error("Error fetching homepages:", error));
