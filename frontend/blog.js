fetch(`${CONFIG.API_BASE_URL}/blogs?populate=*`)
  .then(response => response.json())
  .then(data => {
    const blogs = data.data;

    const container = document.getElementById('blog-container');
    const filterButtons = document.querySelectorAll('.filter-item');

    //  Function to render blogs
    function renderBlogs(filteredBlogs) {
      container.innerHTML = '';

      if (filteredBlogs.length === 0) {
        container.classList.add('no-data');
        container.innerHTML = `<p class="no-data">Coming soon....</p>`;
        return;
      }

      container.classList.remove('no-data');

      filteredBlogs.forEach(blog => {
        const id = blog.id;
        const title = blog.Title || "";
        const body = blog.Author || "";
        const createdAt = new Date(blog.createdAt).toLocaleString("default", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const category = blog.category || "";

        let imageObj = null;

        if (Array.isArray(blog.image) && blog.image.length > 0) {
          imageObj = blog.image[0]; // first image if multiple
        } else if (blog.image && typeof blog.image === 'object') {
          imageObj = blog.image; // single image
        }

        //  Get proper URL or fallback
        const imageUrl = imageObj?.url
        // ? `${CONFIG.BASE_URL}${imageObj.url}`
        // : imageObj?.formats?.small?.url
        // ? `${CONFIG.BASE_URL}${imageObj.formats.small.url}`   // uncomment this section if u need to run the images in localhost
        // : CONFIG.PLACEHOLDER_IMAGE;;

        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');

        blogCard.innerHTML = `
          <img src="${imageUrl}" alt="${title}" class="blog-image" data-id="${id}">
          <h2>${title}</h2>
         <p>${body} / <span style="color: #FFF7EB80;">${createdAt}</span></p>`;
        container.appendChild(blogCard);
      });

    
      document.querySelectorAll('.blog-image').forEach(img => {
        img.addEventListener('click', (e) => {
          const blogId = e.target.dataset.id;
          // window.location.href = `blogDetails.html?id=${blogId}`;
          window.location.href = `/blogDetails?id=${blogId}`;
        });
      });
    }

   
    renderBlogs(blogs);

    // Filter button logic
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        const filtered = category === 'all'
          ? blogs
          : blogs.filter(blog => blog.category === category);

        renderBlogs(filtered);
      });
    });
  })
  .catch(error => console.error('Error fetching blogs:', error));


