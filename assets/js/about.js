const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn.addEventListener('click', () => { mobileMenu.classList.toggle('open'); });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => { mobileMenu.classList.remove('open'); });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in, .principle-item, .leader-card').forEach(el => observer.observe(el));