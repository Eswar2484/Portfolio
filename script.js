// ==========================================
// ESWAR S. Portfolio - Main JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Mobile Menu Toggle & Smooth Scroll ---
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Ensure all navigation links close mobile nav & handle #home smoothly
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      if (navLinks) navLinks.classList.remove("open");
      const targetId = link.getAttribute("href");
      if (targetId === "#" || targetId === "#home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  // --- 2. Dynamic Copyright Year ---
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- 3. Certificate Lightbox Modal ---
  const certModal = document.getElementById("certModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");

  function openModal(imgSrc, titleText) {
    if (!certModal) return;
    modalImg.src = imgSrc;
    modalTitle.textContent = titleText || "Certificate Preview";
    certModal.classList.add("active");
    certModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Lock background scroll
  }

  function closeModal() {
    if (!certModal) return;
    certModal.classList.remove("active");
    certModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (modalImg) modalImg.src = "";
    }, 300);
  }

  document.querySelectorAll(".cert-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const imgSrc = btn.getAttribute("data-cert-img");
      const titleText = btn.getAttribute("data-cert-title");
      if (imgSrc) {
        openModal(imgSrc, titleText);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (certModal) {
    certModal.addEventListener("click", (e) => {
      if (e.target === certModal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal && certModal.classList.contains("active")) {
      closeModal();
    }
  });

  // --- 4. Dynamic Typewriter Subtitle ---
  const typedTextSpan = document.getElementById("typedText");
  if (typedTextSpan) {
    const phrases = [
      "MSc Computer Science Student",
      "Software Developer",
      "Python & Full Stack Enthusiast",
      "SAP ABAP & Database Developer"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const delayBetweenPhrases = 2000;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let currentSpeed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        currentSpeed = delayBetweenPhrases;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        currentSpeed = 500;
      }

      setTimeout(type, currentSpeed);
    }

    type();
  }

  // --- 5. AJAX Formspree Contact Form Submission ---
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      if (formMessage) {
        formMessage.textContent = "Sending your message, please wait...";
        formMessage.className = "form-message info";
        formMessage.style.display = "block";
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          if (formMessage) {
            formMessage.textContent = "Thank you! Your message has been sent successfully. 🎉";
            formMessage.className = "form-message success";
            formMessage.style.display = "block";
          }
          contactForm.reset();
        } else {
          const data = await response.json();
          if (formMessage) {
            formMessage.textContent = data.errors
              ? data.errors.map((err) => err.message).join(", ")
              : "Oops! There was a problem submitting your form.";
            formMessage.className = "form-message error";
            formMessage.style.display = "block";
          }
        }
      } catch (err) {
        if (formMessage) {
          formMessage.textContent = "Oops! Network error. Please check your connection or email directly.";
          formMessage.className = "form-message error";
          formMessage.style.display = "block";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
      }
    });
  }

  // --- 6. Hero Interactive Canvas Particle Background ---
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      const heroSection = document.getElementById("home");
      if (!heroSection) return;
      width = canvas.width = heroSection.offsetWidth;
      height = canvas.height = heroSection.offsetHeight;
      initParticles();
    }

    window.addEventListener("resize", resizeCanvas);

    const heroSection = document.getElementById("home");
    if (heroSection) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      heroSection.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.45 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse Interactivity
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2.5;
            this.y -= (dy / dist) * force * 2.5;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 124, 255, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 11000), 75);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            ctx.strokeStyle = `rgba(139, 124, 255, ${0.16 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    animateParticles();
  }

  // --- 7. GSAP ScrollTrigger & Entrance Animations ---
  if (typeof gsap !== "undefined") {
    // Explicitly reveal hero text & card container
    gsap.set([".hero-text", ".hero-card"], { opacity: 1, visibility: "visible" });

    // Hero Section Entrance Timeline using explicit fromTo
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
    heroTl
      .fromTo(".hero-text .eyebrow", { y: -20, opacity: 0 }, { y: 0, opacity: 1, delay: 0.1 })
      .fromTo(".hero-text h1", { y: 25, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6")
      .fromTo(".hero-text h2", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6")
      .fromTo(".hero-text .hero-description", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6")
      .fromTo(".hero-buttons .btn", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12 }, "-=0.6")
      .fromTo(".socials a", { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, "-=0.5")
      .fromTo(".hero-card", { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, "-=0.8");

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // ScrollTrigger Animations for Revealed Elements in subsequent sections
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }

    // 3D Card Tilt Effect on Hover
    const tiltCards = document.querySelectorAll(".skill-card, .project-card, .certificate-card, .profile-placeholder");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          ease: "power1.out",
          duration: 0.3
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          ease: "power2.out",
          duration: 0.5
        });
      });
    });
  } else {
    // Fallback Intersection Observer if GSAP fails to load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }
});


