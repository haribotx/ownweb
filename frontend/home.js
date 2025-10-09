// fetch('http://localhost:1337/api/blogs?populate=*')
//   .then(response => response.json())
//   .then(data => {
//     console.log('API Response:', data);
//     const blogs = data.data;
//     console.log('blogs: ', blogs);

//     const container = document.getElementById('blog-container');
//     container.innerHTML = '';

//     blogs.forEach(blog => {
//       // ✅ Fixed structure — direct access, no attributes
//       const title = blog.Title;
//       const body = blog.Body?.[0]?.children?.[0]?.text || "";
      
//     //   const image = blog.cover?.data?.attributes?.url 
//     //     ? `http://localhost:1337${blog.cover.data.attributes.url}`
//     //     : 'https://via.placeholder.com/400x300?text=No+Image';

//     // ✅ Safely access image URL
// const imageUrl = blog.image?.url
//   ? `http://localhost:1337${blog.image.url}`
//   : blog.image?.formats?.small?.url
//     ? `http://localhost:1337${blog.image.formats.small.url}`
//     : 'https://via.placeholder.com/400x300?text=No+Image';


//       const blogCard = document.createElement('div');
//       blogCard.classList.add('blog-card');

//       blogCard.innerHTML = `
//         <img src="${imageUrl}" />
//         <h2>${title}</h2>
//         <p>${body}</p>
//       `;

//       container.appendChild(blogCard);
//     });
//   })
//   .catch(error => console.error('Error fetching blogs:', error));

  

// Fetch all blogs initially
fetch('http://localhost:1337/api/blogs?populate=*')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    const blogs = data.data;
    console.log('blogs: ', blogs);

    const container = document.getElementById('blog-container');
    const filterButtons = document.querySelectorAll('.filter-item');

    // ✅ Function to render blogs
    function renderBlogs(filteredBlogs) {
      container.innerHTML = '';

      if (filteredBlogs.length === 0) {
    container.classList.add('no-data');
    container.innerHTML = `<p class="no-data">Coming soon....</p>`;
    return;
  }

  container.classList.remove('no-data');

      filteredBlogs.forEach(blog => {
        const title = blog.Title;
        const body = blog.Body?.[0]?.children?.[0]?.text || "";
        const category = blog.category || "";

        const imageUrl = blog.image?.url
          ? `http://localhost:1337${blog.image.url}`
          : blog.image?.formats?.small?.url
          ? `http://localhost:1337${blog.image.formats.small.url}`
          : 'https://via.placeholder.com/400x300?text=No+Image';

        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');

        blogCard.innerHTML = `
          <img src="${imageUrl}" alt="${title}">
          <h2>${title}</h2>
          <p>${body}</p>
        `;

        container.appendChild(blogCard);
      });
    }

    // ✅ Initially show all blogs
    renderBlogs(blogs);

    // ✅ Add click filter logic
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        console.log('category: ', category);
        const filtered = category === 'all'
          ? blogs
          : blogs.filter(blog => blog.category === category);

        renderBlogs(filtered);
      });
    });
  })
  .catch(error => console.error('Error fetching blogs:', error));
