// Header JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize header functionality
    initHeaderScroll();
    initSmoothScrolling();
});

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

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
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
}

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
    if (header) {
        if (scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        }
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);