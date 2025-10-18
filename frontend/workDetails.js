// ✅ Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const workId = urlParams.get("id");

if (!workId) {
  console.warn("⚠️ No work ID found in URL");
} else {
  fetch(`${CONFIG.API_BASE_URL}/works?filters[id][$eq]=${workId}&populate=*`)
    .then((res) => res.json())
    .then((response) => {
      console.log("Work Details Response:", response);

      const work = response.data?.[0];
      if (!work) {
        console.warn("⚠️ No work found for this ID");
        return;
      }

      // --- IMAGE HANDLING (✅ FIXED FOR YOUR CASE) ---
      const img = work.image?.[0];
      if (img?.url) {
        const imageUrl = img.url.startsWith("http")
          ? img.url
          : `${CONFIG.BASE_URL}${img.url}`;
        const projectImage = document.querySelector(".project-image");
        if (projectImage) {
          projectImage.src = imageUrl;
          projectImage.alt = work.Title || "Project Image";
        }
      } else {
        console.warn("⚠️ No image found for this work");
      }

      // --- OVERVIEW CONTENT ---
      let overviewText = "";
      if (work.overview && Array.isArray(work.overview)) {
        overviewText = work.overview
          .map((block) =>
            block.children?.map((child) => child.text || "").join(" ")
          )
          .join("\n\n");
      }

      if (!overviewText && work.Body) overviewText = work.Body;

      const descEls = document.querySelectorAll(".description-text");
      if (descEls[0]) descEls[0].textContent = overviewText;

      // --- STATIC TITLE ---
      const titleEl = document.querySelector(".overview-title");
      if (titleEl) titleEl.textContent = "Overview"; // You said only "Overview"

      // --- DETAILS (Year, Client, Category) ---
      const completedDate = work.completed || "";
      const year = completedDate ? completedDate.split("-")[2] || "" : "";
      const client = work.client || "Unknown Client";
      const services = work.category || "Not specified";

      const detailRows = document.querySelectorAll(".project-details .detail-row");
      if (detailRows.length >= 3) {
        detailRows[0].querySelector(".detail-value").textContent = year;
        detailRows[1].querySelector(".detail-value").textContent = client;
        detailRows[2].querySelector(".detail-value").textContent = services;
      }
    })
    .catch((err) => console.error("Error fetching work details:", err));
}





  //og code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initFilterButtons();
    initSmoothScrolling();
    initBackToTop();
    initProjectAnimations();
    initHeaderScroll();
    initParticleAnimation();
    initAnimatedText();
});

// Filter functionality for project categories
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter project cards
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    card.classList.add('visible');
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to top functionality
function initBackToTop() {
    const backToTopLink = document.querySelector('.back-top-link');
    
    if (backToTopLink) {
        backToTopLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopLink.style.opacity = '1';
            backToTopLink.style.visibility = 'visible';
        } else {
            backToTopLink.style.opacity = '0';
            backToTopLink.style.visibility = 'hidden';
        }
    });
}

// Project card animations and interactions
function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    const detailButtons = document.querySelectorAll('.btn-details');
    
    // Add hover effects to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 25px 50px rgba(255, 107, 53, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.1)';
        });
    });
    
    // Handle more details button clicks
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.opacity = '0.7';
            
            // Simulate loading (replace with actual functionality)
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
                
                // Here you would typically navigate to a project detail page
                // or open a modal with more information
                showProjectModal(this.closest('.project-card'));
            }, 1000);
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Particle animation enhancement
function initParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    // Add random movement to particles
    particles.forEach((particle, index) => {
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            
            particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + (index * 500));
    });
}

// Project modal functionality (placeholder)
function showProjectModal(projectCard) {
    const projectTitle = projectCard.querySelector('.project-title').textContent;
    const projectDescription = projectCard.querySelector('.project-description').textContent;
    
    // Create modal (you can customize this further)
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${projectTitle}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${projectDescription}</p>
                    <p>This is a detailed view of the project. You can add more content here, including images, case studies, technologies used, and more.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-close-modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .project-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background-color: #111;
            border-radius: 16px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            border: 1px solid #333;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #333;
        }
        
        .modal-header h2 {
            color: #fff;
            font-size: 24px;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        
        .modal-close:hover {
            background-color: #333;
        }
        
        .modal-body {
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .modal-footer {
            text-align: right;
        }
        
        .btn-close-modal {
            background-color: #ff6b35;
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-close-modal:hover {
            background-color: #e55a2b;
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.btn-close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize scroll animations
initScrollAnimations();

// Add CSS for scroll animations
const animationStyles = `
    .project-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .project-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .back-top-link {
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
    }
`;

// Add animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations and effects
    const scrollY = window.pageYOffset;
    
    // Update header
    const header = document.querySelector('.header');
    if (scrollY > 100) {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    }
    
    // Update back to top button
    const backToTop = document.querySelector('.back-top-link');
    if (backToTop) {
        if (scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add loading state management
function showLoadingState() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    const loaderStyles = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loader-content {
            text-align: center;
            color: #fff;
        }
        
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #333;
            border-top: 3px solid #ff6b35;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    if (!document.querySelector('#loader-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'loader-styles';
        styleSheet.textContent = loaderStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(loader);
    
    // Remove loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.remove();
        }, 500);
    });
}

// Initialize loading state
showLoadingState();

// Animated text scroll functionality
// Animated text scroll functionality with individual word animation
function initAnimatedText() {
    const animatedTextSection = document.querySelector('.animated-text-section');
    const textWords = document.querySelectorAll('.text-word');
    
    if (!animatedTextSection || textWords.length === 0) return;
    
    let hasAnimatedIn = false;
    let hasAnimatedOut = false;
    
    function handleScroll() {
        const scrollY = window.pageYOffset;
        const sectionTop = animatedTextSection.offsetTop;
        const sectionHeight = animatedTextSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate trigger points
        const animateInPoint = sectionTop - windowHeight + 400;
        const animateOutPoint = sectionTop + sectionHeight - 400;
        
        // Section is in viewport
        const isInViewport = scrollY >= animateInPoint && scrollY <= animateOutPoint;
        
        // Section is above viewport
        const isAboveViewport = scrollY < animateInPoint;
        
        // Section is below viewport
        const isBelowViewport = scrollY > animateOutPoint;
        
        // ANIMATE IN: When section enters viewport
        if (isInViewport && !hasAnimatedIn) {
            textWords.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.add('animate-in');
                    word.classList.remove('animate-out');
                }, index * 100); // Stagger the animation
            });
            hasAnimatedIn = true;
            hasAnimatedOut = false;
        }
        
        // ANIMATE OUT: When scrolling down past the section
        if (isBelowViewport && hasAnimatedIn && !hasAnimatedOut) {
            textWords.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.remove('animate-in');
                    word.classList.add('animate-out');
                }, index * 100); // Stagger the animation
            });
            hasAnimatedOut = true;
        }
        
        // RESET TO SHOW: When scrolling up from below the section
        if (isInViewport && hasAnimatedOut) {
            textWords.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.remove('animate-out');
                    word.classList.add('animate-in');
                }, index * 100);
            });
            hasAnimatedOut = false;
        }
        
        // RESET TO HIDDEN: When scrolling up above the section
        if (isAboveViewport && hasAnimatedIn) {
            textWords.forEach(word => {
                word.classList.remove('animate-in', 'animate-out');
            });
            hasAnimatedIn = false;
            hasAnimatedOut = false;
        }
    }
    
    // Throttle scroll events
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    function onScroll() {
        requestTick();
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check
    handleScroll();
}



//

//  Fetch and Display Latest Two Works (Corrected for Flat Structure)
// ✅ Fetch and Display Latest Two Works (Excluding the Current One)
document.addEventListener("DOMContentLoaded", () => {
  const projectContainer = document.querySelector(".project-details-container");
  if (!projectContainer) return;

  // ✅ Get current work ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentWorkId = urlParams.get("id");

  // ✅ Build query to exclude current work
  const excludeFilter = currentWorkId
    ? `&filters[id][$ne]=${currentWorkId}` // exclude same work
    : "";

  fetch(
    `${CONFIG.API_BASE_URL}/works?populate=*&sort=createdAt:desc&pagination[limit]=2${excludeFilter}`
  )
    .then((res) => res.json())
    .then((response) => {
      console.log(" Latest Works Response:", response);

      const works = response.data || [];
      if (works.length === 0) {
        projectContainer.innerHTML = `<p style="color:#fff; text-align:center;">No other works found.</p>`;
        return;
      }

      projectContainer.innerHTML = "";

      works.forEach((item, index) => {
        const title = item.Title || "Untitled";
        const client = item.client || "Unknown";
        const type = item.category || "N/A";
        const role = item.role || "Design and Developmen";
        const completed = item.completed || "N/A";

        // ✅ Handle image safely
        let imageUrl = "../images/placeholder.png";
        if (Array.isArray(item.image) && item.image.length > 0) {
          const imgObj = item.image[0];
          if (imgObj?.url) {
            imageUrl = imgObj.url.startsWith("http")
              ? imgObj.url
              : `${CONFIG.BASE_URL}${imgObj.url}`;
          } else if (imgObj?.documentId) {
            imageUrl = `${CONFIG.BASE_URL}/uploads/${imgObj.documentId}.jpg`;
          }
        }

        // Alternate layout
        const isEven = index % 2 === 1;
        const cardClass = isEven
          ? "project-card-calva"
          : "project-card-luximatch";

        const cardHTML = `
          <div class="${cardClass}">
            ${isEven
              ? `
              <div class="card-details-area">
                <div class="project-info">
                  <p class="selected-work-label">Selected work</p>
                  <h3 class="project-name">${title}</h3>
                  <div class="detail-item"><span class="detail-label">Client</span><span class="detail-value">${client}</span></div>
                  <div class="detail-item"><span class="detail-label">Type</span><span class="detail-value">${type}</span></div>
                  <div class="detail-item"><span class="detail-label">Role</span><span class="detail-value">${role}</span></div>
                  <div class="detail-item"><span class="detail-label">Completed</span><span class="detail-value">${completed}</span></div>
                </div>
              </div>
              <div class="card-visual-area">
                <div class="card-background-image" onclick="window.location.href='index.html?id=${item.id}'" style="cursor:pointer;">
                  <img src="${imageUrl}" alt="${title} Background" class="background-img">
                </div>
                <span class="plus-icon plus-top-left"></span>
                <span class="plus-icon plus-top-right"></span>
                <span class="plus-icon plus-bottom-left"></span>
                <span class="plus-icon plus-bottom-right"></span>
              </div>`
              : `
              <div class="card-visual-area">
                <div class="card-background-image" onclick="window.location.href='index.html?id=${item.id}'" style="cursor:pointer;">
                  <img src="${imageUrl}" alt="${title} Background" class="background-img">
                </div>
                <span class="plus-icon plus-top-left"></span>
                <span class="plus-icon plus-top-right"></span>
                <span class="plus-icon plus-bottom-left"></span>
                <span class="plus-icon plus-bottom-right"></span>
              </div>
              <div class="card-details-area">
                <div class="project-info">
                  <p class="selected-work-label">Selected work</p>
                  <h3 class="project-name">${title}</h3>
                  <div class="detail-item"><span class="detail-label">Client</span><span class="detail-value">${client}</span></div>
                  <div class="detail-item"><span class="detail-label">Type</span><span class="detail-value">${type}</span></div>
                  <div class="detail-item"><span class="detail-label">Role</span><span class="detail-value">${role}</span></div>
                  <div class="detail-item"><span class="detail-label">Completed</span><span class="detail-value">${completed}</span></div>
                </div>
              </div>`}
          </div>
        `;

        projectContainer.insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch((err) => {
      console.error("❌ Error fetching latest works:", err);
      projectContainer.innerHTML = `<p style="color:#fff; text-align:center;">Error fetching works.</p>`;
    });
});

