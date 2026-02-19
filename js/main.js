// ===========================================
// PERFORMANCE OPTIMIZATION
// ===========================================
// Using native smooth scroll for best performance
// GPU acceleration enabled via CSS transform3d
// Reduced animation complexity for mobile devices

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ===========================================
// PRELOADER "AM EFFECT" ANIMATION WITH LOADING BAR
// ===========================================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const preloaderText = document.getElementById("preloader-text");
  const letters = document.querySelectorAll(".letter");
  const loadingBarContainer = document.getElementById("loading-bar-container");
  const loadingBar = document.getElementById("loading-bar");
  const loadingPercentage = document.getElementById("loading-percentage");
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("hero");
  const logo = document.getElementById("logo");

  // Counter object for percentage
  const counter = { value: 0 };

  // Timeline for preloader animation
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = "none";
      initScrollAnimations();

      // Initialize sequential image loader after preloader
      sequentialLoader = new SequentialImageLoader();
    },
  });

  // Step 1: Show loading bar immediately
  tl.to(loadingBarContainer, {
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
  })
    // Step 2: Animate loading bar fill, counter, and brighten letters progressively
    .to(loadingBar, {
      width: "100%",
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(
      counter,
      {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function () {
          loadingPercentage.textContent = Math.floor(counter.value) + "%";

          // Progressively brighten letters based on loading progress
          const progress = counter.value / 100;
          letters.forEach((letter, index) => {
            const letterProgress = index / letters.length;
            if (progress >= letterProgress) {
              const opacity = Math.min(
                1,
                0.2 + (progress - letterProgress) * 5,
              );
              letter.style.opacity = opacity;
            }
          });
        },
      },
      "<",
    )
    // Step 4: Hold for a moment when complete
    .to(
      {},
      {
        duration: 0.3,
      },
    )
    // Step 5: Fade out loading bar
    .to(loadingBarContainer, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    })
    // Step 6: Move text to top-left (logo position)
    .to(
      preloaderText,
      {
        x: -window.innerWidth / 2 + 150,
        y: -window.innerHeight / 2 + 50,
        scale: 0.4,
        duration: 1,
        ease: "power3.inOut",
      },
      "-=0.1",
    )
    // Step 7: Fade out preloader and show navbar + hero
    .to(
      preloader,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .to(
      navbar,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .to(
      hero,
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5",
    )
    .from(
      ".hero-title",
      {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.6",
    )
    .from(
      ".hero-subtitle",
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.7",
    );
});

// ===========================================
// SCROLL ANIMATIONS - OPTIMIZED WITH INTERSECTION OBSERVER
// ===========================================
function initScrollAnimations() {
  // Skip animations on mobile or if user prefers reduced motion
  if (prefersReducedMotion) {
    document
      .querySelectorAll(".gallery-section, .zoom-match-item, .morph-item")
      .forEach((item) => {
        item.style.opacity = "1";
      });
    return;
  }

  // Use Intersection Observer for better performance
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.3 : 0.6,
          ease: "power2.out",
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".gallery-section, .zoom-match-item, .morph-item")
    .forEach((item) => {
      gsap.set(item, { opacity: 0, y: 20 });
      observer.observe(item);
    });
}

// ===========================================
// VIDEO HOVER TO PLAY - OPTIMIZED
// ===========================================
// Use Intersection Observer to only enable hover on visible videos
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      const parent = video.closest(".video-item");

      if (entry.isIntersecting) {
        // Load video when in viewport
        if (video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }

        // Enable hover play
        parent.addEventListener("mouseenter", () => {
          video.play().catch((e) => console.log("Video play prevented:", e));
        });

        parent.addEventListener("mouseleave", () => {
          video.pause();
          video.currentTime = 0;
        });

        videoObserver.unobserve(video);
      }
    });
  },
  {
    rootMargin: "100px",
  },
);

document.querySelectorAll(".video-item video").forEach((video) => {
  videoObserver.observe(video);
});

// ===========================================
// GLOWING FILTER BAR FUNCTIONALITY
// ===========================================
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
const videoGallery = document.getElementById("video-gallery");
const designGallery = document.getElementById("design-gallery");
const section3d = document.getElementById("3d-section");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update active state
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    // Show/hide sections based on filter
    if (filter === "all") {
      gsap.to([videoGallery, designGallery, section3d], {
        opacity: 1,
        display: "block",
        height: "auto",
        duration: 0.5,
      });
    } else if (filter === "video") {
      gsap.to(videoGallery, {
        opacity: 1,
        display: "block",
        height: "auto",
        duration: 0.5,
      });
      gsap.to([designGallery, section3d], {
        opacity: 0,
        display: "none",
        height: 0,
        duration: 0.5,
      });
    } else if (filter === "design") {
      gsap.to(designGallery, {
        opacity: 1,
        display: "block",
        height: "auto",
        duration: 0.5,
      });
      gsap.to([videoGallery, section3d], {
        opacity: 0,
        display: "none",
        height: 0,
        duration: 0.5,
      });
    } else if (filter === "3d") {
      gsap.to(section3d, {
        opacity: 1,
        display: "block",
        height: "auto",
        duration: 0.5,
      });
      gsap.to([videoGallery, designGallery], {
        opacity: 0,
        display: "none",
        height: 0,
        duration: 0.5,
      });
    }
  });
});

// ===========================================
// 3D SLIDER "AIRPODS EFFECT" - OPTIMIZED
// ===========================================
const sliderTrack = document.getElementById("slider-track");
const sliderItems = document.querySelectorAll(".slider-item");
const prevBtn = document.getElementById("slider-prev");
const nextBtn = document.getElementById("slider-next");
const sliderDotsContainer = document.getElementById("slider-dots");

if (sliderTrack && sliderItems.length > 0) {
  let currentIndex = 0;
  const itemWidth = isMobile ? 320 : 450;
  const gap = isMobile ? 40 : 60;
  let isAnimating = false;

  // Create navigation dots
  sliderItems.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("slider-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      if (!isAnimating) {
        currentIndex = index;
        updateSlider();
      }
    });
    sliderDotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".slider-dot");

  function updateSlider() {
    if (isAnimating) return;
    isAnimating = true;

    // Calculate the offset to center the current item
    const containerWidth = sliderTrack.parentElement.offsetWidth;
    const offset =
      containerWidth / 2 - itemWidth / 2 - currentIndex * (itemWidth + gap);

    gsap.to(sliderTrack, {
      x: offset,
      duration: isMobile ? 0.5 : 0.8,
      ease: "power3.out",
      onComplete: () => {
        isAnimating = false;
      },
    });

    // Update classes for blur effect
    sliderItems.forEach((item, index) => {
      const distance = Math.abs(index - currentIndex);
      item.classList.remove("active", "adjacent", "far");

      if (distance === 0) {
        item.classList.add("active");
      } else if (distance === 1) {
        item.classList.add("adjacent");
      } else {
        item.classList.add("far");
      }
    });

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  prevBtn.addEventListener("click", () => {
    if (!isAnimating && currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!isAnimating && currentIndex < sliderItems.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // Initialize slider
  updateSlider();

  // Drag functionality - optimized
  let isDragging = false;
  let startPos = 0;
  let lastUpdateTime = 0;
  const updateThrottle = 100; // ms

  sliderTrack.addEventListener("mousedown", (e) => {
    isDragging = true;
    startPos = e.clientX;
    sliderTrack.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || isAnimating) return;

    const now = Date.now();
    if (now - lastUpdateTime < updateThrottle) return;
    lastUpdateTime = now;

    const currentPosition = e.clientX;
    const diff = currentPosition - startPos;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex > 0) {
        currentIndex--;
        updateSlider();
        startPos = currentPosition;
      } else if (diff < 0 && currentIndex < sliderItems.length - 1) {
        currentIndex++;
        updateSlider();
        startPos = currentPosition;
      }
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    sliderTrack.style.cursor = "grab";
  });

  // Touch events for mobile - optimized
  sliderTrack.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      startPos = e.touches[0].clientX;
    },
    { passive: true },
  );

  sliderTrack.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || isAnimating) return;

      const currentPosition = e.touches[0].clientX;
      const diff = currentPosition - startPos;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex > 0) {
          currentIndex--;
          updateSlider();
          startPos = currentPosition;
        } else if (diff < 0 && currentIndex < sliderItems.length - 1) {
          currentIndex++;
          updateSlider();
          startPos = currentPosition;
        }
      }
    },
    { passive: true },
  );

  sliderTrack.addEventListener("touchend", () => {
    isDragging = false;
  });
}

// ===========================================
// NAVBAR SCROLL EFFECT - HIGHLY OPTIMIZED
// ===========================================
let lastScroll = 0;
const navbar = document.getElementById("navbar");
let rafPending = false;
let lastKnownScrollPosition = 0;

function updateNavbar(scrollPos) {
  if (scrollPos > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.backdropFilter = "blur(10px)";
    navbar.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
    navbar.style.borderBottom = "1px solid rgba(0,0,0,0.06)";
  } else {
    navbar.style.background = "transparent";
    navbar.style.backdropFilter = "none";
    navbar.style.boxShadow = "none";
    navbar.style.borderBottom = "none";
  }
  lastScroll = scrollPos;
  rafPending = false;
}

window.addEventListener(
  "scroll",
  () => {
    lastKnownScrollPosition = window.pageYOffset;

    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        updateNavbar(lastKnownScrollPosition);
      });
    }
  },
  { passive: true },
);

// Native smooth scroll for anchors - OPTIMIZED
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// ===========================================
// IMAGE LAZY LOADING - SEQUENTIAL WITH SKELETON & SCROLL DIRECTION
// ===========================================
class SequentialImageLoader {
  constructor() {
    this.loadedImages = new Set();
    this.loadingQueue = [];
    this.isLoading = false;
    this.lastScrollY = window.pageYOffset;
    this.scrollDirection = "down";

    // Track scroll direction
    window.addEventListener(
      "scroll",
      () => {
        const currentScrollY = window.pageYOffset;
        this.scrollDirection =
          currentScrollY > this.lastScrollY ? "down" : "up";
        this.lastScrollY = currentScrollY;
      },
      { passive: true },
    );

    this.init();
  }

  init() {
    // Get all images that need lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');

    // Add skeleton to parent elements
    images.forEach((img) => {
      const parent = img.closest(
        ".gallery-item, .zoom-match-item, .video-item",
      );
      if (parent && !img.classList.contains("hero-large-image")) {
        parent.classList.add("loading");

        // Create skeleton element if not exists
        if (!parent.querySelector(".skeleton")) {
          const skeleton = document.createElement("div");
          skeleton.className = "skeleton";
          skeleton.style.cssText = `
            position: absolute;
            inset: 0;
            transition: opacity 0.3s ease;
            border-radius: inherit;
            z-index: 1;
          `;
          parent.style.position = "relative";
          parent.insertBefore(skeleton, img);

          // Safety timeout - remove skeleton after 5s even if image doesn't load
          setTimeout(() => {
            if (skeleton.parentNode) {
              skeleton.style.opacity = "0";
              setTimeout(() => {
                if (skeleton.parentNode) skeleton.remove();
              }, 300);
              parent.classList.remove("loading");
              img.style.opacity = "1";
              img.classList.add("loaded");
            }
          }, 5000);
        }

        img.classList.add("loading");
        img.style.opacity = "0";
        img.style.position = "relative";
        img.style.zIndex = "2";
      }
    });

    // Setup Intersection Observer with larger margin
    const observerOptions = {
      root: null,
      rootMargin: "200px",
      threshold: 0.01,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Add to queue if not already loaded or loading
          if (!this.loadedImages.has(img) && !this.loadingQueue.includes(img)) {
            this.loadingQueue.push(img);
          }

          // Start loading if not already loading
          if (!this.isLoading && this.loadingQueue.length > 0) {
            this.loadNextImage();
          }

          observer.unobserve(img);
        }
      });
    }, observerOptions);

    // Observe all lazy images
    images.forEach((img) => {
      if (!img.classList.contains("hero-large-image")) {
        observer.observe(img);
      }
    });
  }

  loadNextImage() {
    if (this.loadingQueue.length === 0) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const img = this.loadingQueue.shift();

    // Skip if already loaded
    if (this.loadedImages.has(img)) {
      this.loadNextImage();
      return;
    }

    // Get the actual image source
    const src = img.getAttribute("src") || img.getAttribute("data-src");

    if (!src) {
      console.warn("No source found for image");
      this.completeImageLoad(img, false);
      return;
    }

    // Simple approach: just wait for the image to load naturally
    const checkImageLoaded = () => {
      if (img.complete && img.naturalHeight !== 0) {
        // Image loaded successfully
        this.completeImageLoad(img, true);
      } else {
        // Wait and check again
        setTimeout(checkImageLoaded, 50);
      }
    };

    // Set up load and error handlers
    const onLoad = () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
      this.completeImageLoad(img, true);
    };

    const onError = () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
      console.error("Failed to load image:", src);
      this.completeImageLoad(img, false);
    };

    // Add event listeners
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);

    // If image already in cache or loaded, handle immediately
    if (img.complete) {
      if (img.naturalHeight !== 0) {
        onLoad();
      } else {
        onError();
      }
    }
  }

  completeImageLoad(img, success) {
    // Remove skeleton with smooth fade
    const parent = img.closest(".gallery-item, .zoom-match-item, .video-item");
    if (parent) {
      const skeleton = parent.querySelector(".skeleton");
      if (skeleton) {
        skeleton.style.opacity = "0";
        setTimeout(() => {
          if (skeleton.parentNode) {
            skeleton.remove();
          }
        }, 300);
      }
      parent.classList.remove("loading");

      if (success) {
        // Add reveal animation based on scroll direction
        const revealClass =
          this.scrollDirection === "down"
            ? "reveal-from-bottom"
            : "reveal-from-top";
        parent.classList.add(revealClass);

        // Remove animation class after completion
        setTimeout(() => {
          parent.classList.remove(revealClass);
        }, 800);
      }
    }

    // Show image with fade in
    img.classList.remove("loading");
    img.classList.add("loaded");
    img.style.opacity = "1";

    // Mark as loaded
    this.loadedImages.add(img);

    // Sequential delay - load one by one for smooth effect
    const delay = isMobile ? 80 : 120;
    setTimeout(() => {
      this.loadNextImage();
    }, delay);
  }
}

// Initialize sequential image loader after preloader
let sequentialLoader;

// ===========================================
// FALLBACK: Ensure all images load even if sequential loader fails
// ===========================================
window.addEventListener("load", () => {
  setTimeout(() => {
    // Check for any images still with skeleton after 3 seconds
    document.querySelectorAll(".skeleton").forEach((skeleton) => {
      const parent = skeleton.closest(
        ".gallery-item, .zoom-match-item, .video-item",
      );
      if (parent) {
        skeleton.style.opacity = "0";
        setTimeout(() => {
          if (skeleton.parentNode) skeleton.remove();
        }, 300);
        parent.classList.remove("loading");

        const img = parent.querySelector("img");
        if (img) {
          img.style.opacity = "1";
          img.classList.add("loaded");
        }
      }
    });
  }, 3000);
});

// ===========================================
// IMAGE LAZY LOADING - OPTIMIZED (Legacy fallback)
// ===========================================
// Sequential loader is now primary - this is kept for compatibility
if ("loading" in HTMLImageElement.prototype && !sequentialLoader) {
  // Native lazy loading supported but sequential loader not initialized
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach((img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
}

// ===========================================
// CURSOR EFFECT - OPTIMIZED (DESKTOP ONLY)
// ===========================================
if (!isMobile && !prefersReducedMotion) {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let rafId = null;

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true },
  );

  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    rafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Cursor hover effects
  document.querySelectorAll("a, button, .gallery-item").forEach((el) => {
    el.addEventListener(
      "mouseenter",
      () => cursor.classList.add("cursor-hover"),
      { passive: true },
    );
    el.addEventListener(
      "mouseleave",
      () => cursor.classList.remove("cursor-hover"),
      { passive: true },
    );
  });
}

console.log("🎬 Portfolio Loaded - Willy Fazril Ramadhan");

// ===========================================
// ZOOM MATCH CUT INTERACTION
// ===========================================
document.querySelectorAll(".zoom-match-item").forEach((item, index) => {
  item.addEventListener("click", function () {
    // Create fullscreen zoom effect
    const img = this.querySelector("img");
    const imgSrc = img.src;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    `;

    // Create zoomed image
    const zoomedImg = document.createElement("img");
    zoomedImg.src = imgSrc;
    zoomedImg.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      transform: scale(0.5);
      opacity: 0;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
      box-shadow: 0 50px 100px rgba(0,0,0,0.8);
    `;

    overlay.appendChild(zoomedImg);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.background = "rgba(0,0,0,0.95)";
      zoomedImg.style.transform = "scale(1)";
      zoomedImg.style.opacity = "1";
    });

    // Close on click
    overlay.addEventListener("click", function () {
      zoomedImg.style.transform = "scale(0.5)";
      zoomedImg.style.opacity = "0";
      overlay.style.background = "rgba(0,0,0,0)";

      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 800);
    });
  });
});

// Mouse move and hover interactions removed for better scroll performance
// CSS handles hover states efficiently

console.log("🎬 Portfolio Loaded - Willy Fazril Ramadhan");
