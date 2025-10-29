let carouselData = []; 
let testimonials = []; 
let currentCarouselIndex = 0;
let currentTestimonialIndex = 0;

function fetchCarouselData() {
    fetch(`${CONFIG.API_BASE_URL}/projects?populate=*`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {

          const items = data.data || [];
          if (!Array.isArray(items)) {
              console.error("Expected data.data to be an array, got:", data.data);
              carouselData = [{ name: "No Projects", image: CONFIG.PLACEHOLDER_IMAGE }];
          } else {
              carouselData = items.map(item => {
                  const name = item.name || "Unnamed Project"; // Direct name field
                  const imageObj = item.image?.data?.attributes || item.image; // Handle nested or direct image
                  const imageUrl = imageObj?.url
                    //   ? `${CONFIG.API_BASE_URL}${imageObj.url}` // for localhost
                    ? `${imageObj.url}`                            //for hosted version
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

// Fetch testimonials from Strapi
function fetchTestimonials() {
    return fetch(`${CONFIG.API_BASE_URL}/testimonials?populate=*`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {            
            const items = data.data || [];
            if (!Array.isArray(items)) {
                console.error("Expected testimonials data.data to be an array, got:", data.data);
                testimonials = [];
            } else {
                testimonials = items.map(item => {
                    
                    // Extract data directly from item (not attributes)
                    const name = item.name || "Anonymous";
                    const role = item.designation || "Client";
                    const text = item.feedback || "No testimonial text available.";
                    
                    // Handle avatar image - your image is directly on item.image
                    let avatarImage = 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-hipster-lambersexual-model-sexy-man-dressed-tshirt-jeans-fashion-male-isolated-blue-wall-studio_158538-26731.jpg'; // Default fallback
                    
                    if (item.image && item.image.url) {
                        // Construct full URL for the image
                        // avatarImage = `${CONFIG.BASE_URL}${item.image.url}`;  //for localhost
                        avatarImage = `${item.image.url}`;   // for hosted version
                    }
                    
                    return { name, role, text, avatarImage };
                });
            }
            
            return testimonials;
        })
        .catch(err => {
            console.error("Error fetching testimonials:", err);
            testimonials = [];
            return [];
        });
}

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
function updateCarousel() {
    const content = document.getElementById('carouselContent');
    const brandName = document.getElementById('carouselBrandName');
    
    if (!content || !brandName) return;

    const current = carouselData[currentCarouselIndex];

    content.style.opacity = '0';
    brandName.style.opacity = '0';

    setTimeout(() => {
        content.innerHTML = '';
        const img = document.createElement('img');
        img.src = current.image; 
        img.alt = current.name;
        img.className = 'carousel-image';
        content.appendChild(img);

        brandName.textContent = current.name;

        content.style.opacity = '1';
        brandName.style.opacity = '1';
    }, 300);
}

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

    const profiles = document.querySelectorAll('.profile-item');
    profiles.forEach((profile, i) => {
        profile.classList.toggle('active', i === index);
    });

    slideTestimonialTrack(index); 
     
}
// New function to handle the sliding animation
function slideTestimonialTrack(index) {
    const track = document.getElementById('testimonialTrack');
    const container = document.getElementById('testimonialCards'); 

    if (!track || !container) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0 || index < 0 || index >= cards.length) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + (containerRect.width / 2);

    const activeCard = cards[index];
    const activeCardRect = activeCard.getBoundingClientRect();
    
    const activeCardCenter = activeCardRect.left + (activeCardRect.width / 2);

    const currentTrackTransform = window.getComputedStyle(track).transform;
    let currentX = 0;
    if (currentTrackTransform && currentTrackTransform !== 'none') {

        const matrix = currentTrackTransform.match(/matrix.*\((.+)\)/)[1].split(', ');
        currentX = parseFloat(matrix[4]);
    }

    const centerDifference = containerCenter - activeCardCenter;

    const newTranslationX = currentX + centerDifference;

    track.style.transform = `translateX(${newTranslationX}px)`;

    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
}
function updateTestimonialCards() {
    const cardsContainer = document.getElementById('testimonialCards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = ''; 

    const track = document.createElement('div');
    track.id = 'testimonialTrack';
    track.className = 'testimonial-track';
    cardsContainer.appendChild(track);

    // Check if we have testimonials
    if (testimonials.length === 0) {
        const emptyCard = createTestimonialCard({ 
            name: "Team", role: "Developer", text: "No testimonials available" 
        }, 'active');
        track.appendChild(emptyCard);
        return;
    }

    testimonials.forEach((testimonial, index) => {
        const cardClass = index === currentTestimonialIndex ? 'active' : '';
        const card = createTestimonialCard(testimonial, cardClass);
        track.appendChild(card);
    });
    
    setTimeout(() => {
        slideTestimonialTrack(currentTestimonialIndex);
    }, 0); 
}

function createTestimonialCard(testimonial, className) {
    const card = document.createElement('div');
    card.className = `testimonial-card ${className}`;

    const authorImageContent = testimonial.avatarImage
        ? `<img src="${testimonial.avatarImage}" alt="${testimonial.name}" class="profile-image">`
        : `<span>${testimonial.avatar}</span>`;

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

function initializePage() {
    generateGrid();

    fetchCarouselData();

    fetchTestimonials()
        .then(() => {

            generateProfiles();
            updateTestimonialCards();
            
            setTimeout(() => {
                slideTestimonialTrack(currentTestimonialIndex); 
            }, 100);
        })
        .catch(err => {
            console.error("Failed to initialize testimonials:", err);
            generateProfiles();
            updateTestimonialCards();
        });

    window.addEventListener('resize', function() {
        generateGrid();
        setTimeout(() => {
            slideTestimonialTrack(currentTestimonialIndex);
        }, 50); 
    });
}
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

fetch(`${CONFIG.API_BASE_URL}/homepages?populate=*`)
  .then((response) => response.json())
  .then((data) => {
    const homepages = data.data || [];
    const container = document.querySelector(".bar-track");
    container.innerHTML = ""; // Clear previous content

    homepages.forEach((item) => {
        console.log('item: ', item);
      const name = item.name || "";
      let iconUrl = "";

      // Find the icon (PNG file)
      if (item.image && Array.isArray(item.image)) {
        const iconObj = item.image.find((img) =>
          img.ext === ".png" || img.mime === "image/png"
        );
        iconUrl = iconObj?.url ? `${iconObj.url}` : "";
      }

      // Create brand container
      const brandDiv = document.createElement("div");
      brandDiv.classList.add("brand");

      brandDiv.innerHTML = `
        ${iconUrl ? `<img src="${iconUrl}" alt="${name} Icon" class="brand-icon" />` : ''}
        <div class="brand-name">${name}</div>
      `;

      container.appendChild(brandDiv);
    });

    // Page Loader - Hide when everything is loaded
// window.addEventListener('load', function() {
//   const loader = document.getElementById('page-loader');
//   if (loader) {
//     setTimeout(() => {
//       loader.classList.add('hidden');
//     }, 100);
//   }
// });

// // Fallback: Hide loader after 5 seconds maximum
// setTimeout(() => {
//   const loader = document.getElementById('page-loader');
//   if (loader && !loader.classList.contains('hidden')) {
//     loader.classList.add('hidden');
//   }
// }, 5000);

    // Duplicate for continuous scroll effect
const brands = Array.from(container.children);
    brands.forEach((brand) => {
      const clone = brand.cloneNode(true);
      container.appendChild(clone);
    });
  })
  .catch((error) => console.error("Error fetching homepages:", error));
