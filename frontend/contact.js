// toast helper function

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}



//for sending contact messages

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    try {

        const formspreeRes = await fetch("https://formspree.io/f/mdkprjdy", {   //formspree endpoint
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const strapiRes = await fetch(`${CONFIG.API_BASE_URL}/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { name, email, message },
        }),
      });

      if (formspreeRes.ok && strapiRes.ok) {
        showToast("Message sent successfully!");
        form.reset();
      } else {
        console.error("Formspree or Strapi failed");
        showToast("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      showToast("Something went wrong.");
    }
  });
});


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

        const animateInPoint = sectionTop - windowHeight + 300;
        const animateOutPoint = sectionTop + sectionHeight - 300;

        const isInViewport = scrollY >= animateInPoint && scrollY <= animateOutPoint;
        const isBelowViewport = scrollY > animateOutPoint;
        const isAboveViewport = scrollY < animateInPoint;

        // Animate In (bottom → up)
        if (isInViewport && !hasAnimatedIn) {
            textWords.forEach((word, i) => {
                setTimeout(() => {
                    word.classList.add('animate-in');
                    word.classList.remove('animate-out');
                }, i * 100);
            });
            hasAnimatedIn = true;
            hasAnimatedOut = false;
        }

        // Animate Out (up → bottom)
        if (isBelowViewport && hasAnimatedIn && !hasAnimatedOut) {
            textWords.forEach((word, i) => {
                setTimeout(() => {
                    word.classList.remove('animate-in');
                    word.classList.add('animate-out');
                }, i * 100);
            });
            hasAnimatedOut = true;
        }

        // Reset above viewport
        if (isAboveViewport && hasAnimatedIn) {
            textWords.forEach(word => {
                word.classList.remove('animate-in', 'animate-out');
            });
            hasAnimatedIn = false;
            hasAnimatedOut = false;
        }
    }

    // Scroll throttling
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    handleScroll(); // Run once initially
}

// Initialize animation after DOM loads
initAnimatedText();


//Dynamic Background Line Height (Stops Before Footer) 
window.addEventListener("load", () => {
  const lines = document.querySelectorAll(".bg-line");
  const footer = document.getElementById("footer-placeholder");

  function adjustLineHeight() {
    if (!footer) return;

   
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;

    
    const endPosition = footerTop; 

    lines.forEach(line => {
      line.style.height = `${endPosition}px`;
    });
  }

  // Run once when footer is loaded
  adjustLineHeight();

  // Re-run when window is resized or content changes
  window.addEventListener("resize", adjustLineHeight);
});
