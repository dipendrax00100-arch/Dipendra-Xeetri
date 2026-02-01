/*
 *   Copyright (c) 2026 SMARTz Developer
 *   All rights reserved.
 */
// Initialize Particles.js
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#00d9ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00d9ff",
      opacity: 0.2,
      width: 1,
    },
    move: { enable: true, speed: 2 },
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "repulse" } },
  },
});
// Add these fixes to the existing script.js file

// Fix for Mobile Navigation
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const body = document.body;

  // Mobile menu toggle
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".nav-menu") &&
      navLinks.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      body.style.overflow = "";
    }
  });

  // Fix for mobile touch events
  let isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    // Add touch-specific optimizations
    document.body.classList.add("touch-device");

    // Increase tap targets for mobile
    document
      .querySelectorAll(".skill-card, .cta-btn, .nav-link")
      .forEach((el) => {
        el.style.cursor = "pointer";
      });

    // Prevent zoom on double tap for buttons
    document.querySelectorAll("button, a").forEach((el) => {
      el.style.touchAction = "manipulation";
    });
  }

  // Fix for iOS viewport height
  function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setVH();
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", setVH);

  // Smooth scroll for mobile
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        body.style.overflow = "";

        // Smooth scroll
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Optimize animations for mobile
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion || window.innerWidth < 768) {
    // Reduce or disable heavy animations on mobile
    document.querySelectorAll(".cube-3d, .floating-element").forEach((el) => {
      el.style.animation = "none";
    });

    // Use simpler animations
    document.querySelectorAll(".skill-card").forEach((card) => {
      card.style.transition = "transform 0.3s ease";
    });
  }

  // Load optimization for mobile
  if (window.innerWidth < 768) {
    // Delay non-critical animations
    setTimeout(() => {
      document.querySelectorAll(".floating-element").forEach((el) => {
        el.style.display = "none";
      });
    }, 1000);
  }
});

// Fix for stat counters on mobile
function startCounterAnimation(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.getAttribute("data-count"));
      const speed = window.innerWidth < 768 ? 50 : 20; // Slower on mobile

      const updateCounter = () => {
        const current = parseInt(counter.innerText);
        const increment = Math.ceil(target / speed);

        if (current < target) {
          counter.innerText = current + increment;
          setTimeout(updateCounter, 30);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
      observer.unobserve(counter);
    }
  });
}

// Initialize counters with intersection observer
const counterObserver = new IntersectionObserver(startCounterAnimation, {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
});

document.querySelectorAll(".stat-number").forEach((counter) => {
  counterObserver.observe(counter);
});

// Fix for graph background on mobile
function initGraphCanvas() {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGraph();
  }

  function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simplify graph for mobile
    const complexity = window.innerWidth < 768 ? 20 : 50;
    const lineCount = window.innerWidth < 768 ? 15 : 30;

    ctx.strokeStyle = "rgba(0, 217, 255, 0.1)";
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let i = 0; i < lineCount; i++) {
      ctx.beginPath();

      // Horizontal lines
      const y = (i / lineCount) * canvas.height;
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);

      // Vertical lines
      const x = (i / lineCount) * canvas.width;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);

      ctx.stroke();
    }

    // Draw data points (simplified for mobile)
    if (window.innerWidth >= 768) {
      ctx.strokeStyle = "rgba(0, 217, 255, 0.2)";
      ctx.lineWidth = 2;

      for (let i = 0; i < complexity; i++) {
        ctx.beginPath();
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        ctx.moveTo(startX, startY);

        for (let j = 0; j < 5; j++) {
          const endX = startX + (Math.random() - 0.5) * 200;
          const endY = startY + (Math.random() - 0.5) * 200;
          ctx.lineTo(endX, endY);
        }

        ctx.stroke();
      }
    }
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGraphCanvas);
} else {
  initGraphCanvas();
}

// Performance optimization for mobile scrolling
let scrollTimeout;
window.addEventListener("scroll", function () {
  // Add a class during scroll for performance
  document.body.classList.add("scrolling");

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function () {
    document.body.classList.remove("scrolling");
  }, 100);

  // Pause heavy animations during scroll on mobile
  if (window.innerWidth < 768) {
    document.querySelectorAll(".cube-3d").forEach((cube) => {
      cube.style.animationPlayState = "paused";
    });

    setTimeout(() => {
      document.querySelectorAll(".cube-3d").forEach((cube) => {
        cube.style.animationPlayState = "running";
      });
    }, 100);
  }
});

// Fix for iOS 100vh issue
document.documentElement.style.setProperty(
  "--vh",
  `${window.innerHeight * 0.01}px`,
);

window.addEventListener("resize", () => {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`,
  );
});
