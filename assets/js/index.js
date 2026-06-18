// =============================================
    // 0. LOADING SCREEN
    // =============================================
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
          loader.classList.add('hidden');
          setTimeout(() => { loader.style.display = 'none'; }, 600);
        }
      }, 400);
    });

    // =============================================
    // 1. PARTICLE SYSTEM (Lightweight Canvas)
    // =============================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 30 : 60;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      const maxDist = isMobile ? 100 : 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrame = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =============================================
    // 2. SCROLL-TRIGGERED REVEALS
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });

    // Staggered delays
    document.querySelectorAll('.capabilities-grid .capability-item').forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.06}s`;
    });
    document.querySelectorAll('.features-grid .feature-card').forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.05}s`;
    });
    document.querySelectorAll('.leaders-grid .leader-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
    document.querySelectorAll('.focus-grid .focus-item').forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.08}s`;
    });
    document.querySelectorAll('.perks-grid .perk-item').forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.08}s`;
    });

    // =============================================
    // 3. NAVBAR SCROLL EFFECT
    // =============================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // =============================================
    // 4. STAT COUNTER ANIMATION
    // =============================================
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stats = entry.target.querySelectorAll('.stat-number');
          stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();
            
            function updateCounter(currentTime) {
              const elapsed = currentTime - start;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 5);
              const currentVal = target * easeOut;
              
              if (target % 1 !== 0) {
                stat.innerText = currentVal.toFixed(target.toString().split('.')[1]?.length || 1);
              } else {
                stat.innerText = Math.floor(currentVal);
              }
              
              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                stat.innerText = target;
              }
            }
            
            requestAnimationFrame(updateCounter);
            stat.classList.remove('stat-number');
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);

    // =============================================
    // 5. MOBILE MENU
    // =============================================
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
    // =============================================
    // 6. CONTACT FORM → EMAIL
    // =============================================
    function sendEmail() {
      const fname = document.getElementById('cf-fname').value.trim();
      const lname = document.getElementById('cf-lname').value.trim();
      const company = document.getElementById('cf-company').value.trim();
      const interest = document.getElementById('cf-interest').value;
      const message = document.getElementById('cf-message').value.trim();

      let text = `Hello Bharti Nexus Technologies,\n\n`;
      if (fname || lname) text += `Name: ${fname} ${lname}\n`;
      if (company) text += `Company: ${company}\n`;
      if (interest) text += `Interested in: ${interest}\n`;
      if (message) text += `\nMessage:\n${message}\n`;
      text += `\nThank you!`;

      const subject = encodeURIComponent(`Inquiry from ${fname} ${lname}`);
      const body = encodeURIComponent(text);
      const url = `mailto:info@bhartinexus.in?subject=${subject}&body=${body}`;
      window.location.href = url;
    }

    // =============================================
    // 7. FORCE VIDEO PLAY (Bypass Auto-pause)
    // =============================================
    document.addEventListener("DOMContentLoaded", () => {
      const heroVideo = document.querySelector('.hero-video');
      if (heroVideo) {
        heroVideo.play().catch(() => {});
        setInterval(() => {
          if (heroVideo.paused) {
            heroVideo.play().catch(() => {});
          }
        }, 1000);
      }
    });