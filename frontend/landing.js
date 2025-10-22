let carouselData = []; // Dynamic data will be fetched from Strapi

function fetchCarouselData() {
    fetch(`${CONFIG.API_BASE_URL}/projects?populate=*`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log("Project API Response:", data);

          const items = data.data || [];
          if (!Array.isArray(items)) {
              console.error("Expected data.data to be an array, got:", data.data);
              carouselData = [{ name: "No Projects", image: CONFIG.PLACEHOLDER_IMAGE }];
          } else {
              carouselData = items.map(item => {
                  console.log("Processing item:", item);
                  const name = item.name || "Unnamed Project"; // Direct name field
                  const imageObj = item.image?.data?.attributes || item.image; // Handle nested or direct image
                  const imageUrl = imageObj?.url
                      ? `${CONFIG.BASE_URL}${imageObj.url}`
                      : CONFIG.PLACEHOLDER_IMAGE;
                  console.log("Project:", { name, imageUrl });
                  return { name, image: imageUrl };
              });
          }

          updateCarousel();

          const prevBtn = document.getElementById('prevBtn');
          const nextBtn = document.getElementById('nextBtn');
          if (prevBtn) prevBtn.addEventListener('click', prevCarousel);
          if (nextBtn) nextBtn.addEventListener('click', nextCarousel);
      })
      .catch(err => {
          console.error("Error fetching project data:", err);
          carouselData = [{ name: "Error Loading Projects", image: CONFIG.PLACEHOLDER_IMAGE }];
          updateCarousel();
      });
}


const testimonials = [
    {
        name: 'Emma Thompson',
        role: 'Marketing Director',
        text: 'Emma Thompson, Marketing Director Transformed our website with stunning visuals and smooth functionality, doubling user engagement.',
        avatarImage: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg' // New: Path to Emma's image
    },
    {
        name: 'James Wilson',
        role: 'CEO',
        text: 'Outstanding work! The team delivered beyond our expectations. Our digital presence has never been stronger.',
        avatarImage: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg'
    },
    {
        name: 'Sarah Chen',
        role: 'Product Manager',
        text: 'Incredible attention to detail and user experience. The platform they built is intuitive and performs flawlessly.',
        avatarImage: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg'
    },
    {
        name: 'Michael Brown',
        role: 'CTO',
        text: 'The technical expertise and creative solutions provided were exceptional. Highly recommend their services.',
        avatarImage: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg'
    },
    {
        name: 'Lisa Anderson',
        role: 'Design Lead',
        text: 'Beautiful design meets powerful functionality. Our customers love the new experience.',
        avatarImage: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg'
    },
    {
        name: 'David Martinez',
        role: 'Operations Manager',
        text: 'Professional, efficient, and results-driven. They transformed our vision into reality seamlessly.',
        avatarImage: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg'
    }
];

let currentCarouselIndex = 0;
let currentTestimonialIndex = 0;

// Generate background grid
function generateGrid() {
    const grid = document.getElementById('bgGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const cols = Math.ceil(window.innerWidth / 100);
    const rows = Math.ceil(window.innerHeight / 100);

    for (let i = 0; i <= cols; i++) {
        const line = document.createElement('div');
        line.className = 'grid-line-vertical';
        line.style.left = `${i * 100}px`;
        grid.appendChild(line);
    }

    for (let i = 0; i <= rows; i++) {
        const line = document.createElement('div');
        line.className = 'grid-line-horizontal';
        line.style.top = `${i * 100}px`;
        grid.appendChild(line);
    }
}

// Carousel functions
// ... (Keep the original carouselData and testimonials arrays) ...

// Carousel functions
function updateCarousel() {
    const content = document.getElementById('carouselContent');
    const brandName = document.getElementById('carouselBrandName'); // Still targets by ID
    
    if (!content || !brandName) return;

    const current = carouselData[currentCarouselIndex];

    content.style.opacity = '0';
    brandName.style.opacity = '0';

    setTimeout(() => {
        // Clear previous content
        content.innerHTML = '';
        // Add the image
        const img = document.createElement('img');
        // Ensure you have images in the 'images/' directory for this to work
        // e.g., 'images/luximatch-carousel.png'
        img.src = current.image; 
        img.alt = current.name;
        img.className = 'carousel-image';
        content.appendChild(img);

        brandName.textContent = current.name;

        content.style.opacity = '1';
        brandName.style.opacity = '1';
    }, 300);
}

// ... (Keep the rest of the JS functions, they are correct) ...


function nextCarousel() {
    currentCarouselIndex = (currentCarouselIndex + 1) % carouselData.length;
    updateCarousel();
}

function prevCarousel() {
    currentCarouselIndex = (currentCarouselIndex - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
}

function generateProfiles() {
    const grid = document.getElementById('profilesGrid');
    if (!grid) return;

    const topHorizontalLine = grid.querySelector('.top-horizontal-line');
    const bottomHorizontalLine = grid.querySelector('.bottom-horizontal-line');

    grid.innerHTML = '';

    if (topHorizontalLine) grid.appendChild(topHorizontalLine);
    if (bottomHorizontalLine) grid.appendChild(bottomHorizontalLine);

    testimonials.forEach((testimonial, index) => {
        const profileItem = document.createElement('div');
        profileItem.className = `profile-item ${index === currentTestimonialIndex ? 'active' : ''}`;
        profileItem.onclick = () => selectTestimonial(index);

        // Conditional rendering for image or emoji
        const avatarContent = testimonial.avatarImage
            ? `<img src="${testimonial.avatarImage}" alt="${testimonial.name}" class="profile-image">`
            : `<span>${testimonial.avatar}</span>`; // Fallback to emoji if no image

        profileItem.innerHTML = `
            <div class="profile-corners">
                <div class="corner-bracket tl"></div>
                <div class="corner-bracket tr"></div>
                <div class="corner-bracket bl"></div>
                <div class="corner-bracket br"></div>
            </div>
            <div class="profile-wrapper">
                <div class="profile-image-container">
                    ${avatarContent}
                </div>
            </div>
        `;
        grid.appendChild(profileItem);
    });
}

function selectTestimonial(index) {
    currentTestimonialIndex = index;

    // Update active profile
    const profiles = document.querySelectorAll('.profile-item');
    profiles.forEach((profile, i) => {
        profile.classList.toggle('active', i === index);
    });

    // Update testimonial cards
    updateTestimonialCards();
}

function updateTestimonialCards() {
    const cardsContainer = document.getElementById('testimonialCards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';

    // Current testimonial (main card)
    const currentTestimonial = testimonials[currentTestimonialIndex];
    const currentCard = createTestimonialCard(currentTestimonial, 'active');
    cardsContainer.appendChild(currentCard);

    // Next testimonial (preview card)
    const nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
    const nextTestimonial = testimonials[nextIndex];
    const nextCard = createTestimonialCard(nextTestimonial, 'next');
    cardsContainer.appendChild(nextCard);
}

function createTestimonialCard(testimonial, className) {
    const card = document.createElement('div');
    card.className = `testimonial-card ${className}`;

    // Conditional rendering for image or emoji in the author section
    const authorImageContent = testimonial.avatarImage
        ? `<img src="${testimonial.avatarImage}" alt="${testimonial.name}" class="profile-image">`
        : `<span>${testimonial.avatar}</span>`; // Fallback to emoji if no image

    card.innerHTML = `
        <div class="card-plus tl">+</div>
        <div class="card-plus tr">+</div>
        <div class="card-plus bl">+</div>
        <div class="card-plus br">+</div>

        <p class="testimonial-text">"${testimonial.text}"</p>

        <div class="testimonial-author">
            <div class="author-image">
                ${authorImageContent}
            </div>
            <div class="author-info">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.role}</p>
            </div>
        </div>
    `;
    return card;
}

document.addEventListener('DOMContentLoaded', function() {
    // Generate grid
    generateGrid();

    // 🔹 Fetch carousel data from Strapi dynamically
    fetchCarouselData();

    // Setup testimonials (still static)
    generateProfiles();
    updateTestimonialCards();

    // Regenerate grid on window resize
    window.addEventListener('resize', generateGrid);
});
