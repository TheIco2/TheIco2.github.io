/* ============================================
   Portfolio — Interactive Scripts
   ============================================ */

(function () {
  'use strict';

  // ----------------------------------------
  // Cursor Glow (smooth follow)
  // ----------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ----------------------------------------
  // Scroll Progress Bar
  // ----------------------------------------
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ----------------------------------------
  // Navigation scroll effect
  // ----------------------------------------
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ----------------------------------------
  // Mobile menu toggle
  // ----------------------------------------
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ----------------------------------------
  // Interactive Particle Canvas (Hero)
  // ----------------------------------------
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let canvasMouseX = -9999, canvasMouseY = -9999;
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 140;
  const MOUSE_DIST = 180;

  function resizeCanvas() {
    const hero = document.getElementById('hero');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.strokeStyle = 'rgba(108, 99, 255, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles and mouse interactions
    const heroRect = canvas.getBoundingClientRect();
    const mx = canvasMouseX - heroRect.left;
    const my = canvasMouseY - heroRect.top;

    particles.forEach((p) => {
      // Mouse repulsion
      const dmx = p.x - mx;
      const dmy = p.y - my;
      const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      if (mouseDist < MOUSE_DIST && mouseDist > 0) {
        const force = (MOUSE_DIST - mouseDist) / MOUSE_DIST * 0.8;
        p.vx += (dmx / mouseDist) * force;
        p.vy += (dmy / mouseDist) * force;
      }

      // Mouse-to-particle connections
      if (mouseDist < MOUSE_DIST * 1.2) {
        const alpha = (1 - mouseDist / (MOUSE_DIST * 1.2)) * 0.25;
        ctx.strokeStyle = 'rgba(0, 212, 170, ' + alpha + ')';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }

      // Apply velocity with damping
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.fillStyle = 'rgba(108, 99, 255, ' + p.baseAlpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }

  document.addEventListener('mousemove', (e) => {
    canvasMouseX = e.clientX;
    canvasMouseY = e.clientY;
  });

  resizeCanvas();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

  // ----------------------------------------
  // Text Scramble Effect
  // ----------------------------------------
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTZabcdefghijklmnopqrstz0123456789';

  function scrambleText(el) {
    const original = el.textContent;
    const length = original.length;
    let iteration = 0;
    const maxIterations = length * 3;
    let frame;

    function update() {
      let result = '';
      for (let i = 0; i < length; i++) {
        if (original[i] === ' ') {
          result += ' ';
        } else if (i < iteration / 3) {
          result += original[i];
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      el.textContent = result;
      iteration++;

      if (iteration < maxIterations) {
        frame = requestAnimationFrame(update);
      } else {
        el.textContent = original;
      }
    }

    // Small delay so user sees the scramble start
    setTimeout(() => { frame = requestAnimationFrame(update); }, 600);
  }

  document.querySelectorAll('[data-scramble]').forEach((el) => {
    const orig = el.textContent;
    el.dataset.originalText = orig;
    scrambleText(el);
  });

  // ----------------------------------------
  // Scroll-triggered animations
  // ----------------------------------------
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // ----------------------------------------
  // Animated number counters
  // ----------------------------------------
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterElements = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));

  // ----------------------------------------
  // Smooth scroll for anchor links
  // ----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ----------------------------------------
  // Active nav link highlighting
  // ----------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.style.color = 'var(--text-primary)';
        } else {
          navLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ----------------------------------------
  // Magnetic Buttons
  // ----------------------------------------
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });

    // Magnetic social links
    document.querySelectorAll('.social-link').forEach((link) => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = 'translate(' + (x * 0.4) + 'px, ' + (y * 0.4) + 'px)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = '';
        link.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { link.style.transition = ''; }, 500);
      });
    });
  }

  // ----------------------------------------
  // Parallax on hero shapes (subtle)
  // ----------------------------------------
  const shapes = document.querySelectorAll('.shape');

  function handleParallax() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    shapes.forEach((shape, i) => {
      const speed = 0.03 + i * 0.015;
      shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
    });
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // ----------------------------------------
  // Tilt on project cards (desktop only)
  // ----------------------------------------
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform =
          'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';

        // Dynamic spotlight on card
        const px = ((x / rect.width) * 100);
        const py = ((y / rect.height) * 100);
        card.style.background =
          'radial-gradient(circle at ' + px + '% ' + py + '%, rgba(108,99,255,0.06) 0%, var(--bg-card) 60%)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.background = '';
      });
    });
  }

  // ----------------------------------------
  // Skill chips — pop on hover
  // ----------------------------------------
  document.querySelectorAll('.skill-item').forEach((chip) => {
    chip.addEventListener('mouseenter', () => {
      chip.style.transform = 'scale(1.1) translateY(-2px)';
      chip.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.15s, border-color 0.15s, background 0.15s';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.transform = '';
    });
  });

  // ----------------------------------------
  // Section titles — split & wave on hover
  // ----------------------------------------
  document.querySelectorAll('.section-title').forEach((title) => {
    const text = title.textContent;
    title.innerHTML = '';
    title.setAttribute('aria-label', text);

    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.classList.add('title-char');
      span.style.transitionDelay = (i * 20) + 'ms';
      title.appendChild(span);
    });

    title.addEventListener('mouseenter', () => {
      title.querySelectorAll('.title-char').forEach((ch, i) => {
        setTimeout(() => {
          ch.classList.add('wave');
          setTimeout(() => ch.classList.remove('wave'), 400);
        }, i * 30);
      });
    });
  });

  // ----------------------------------------
  // Easter Egg — Konami Code → Confetti
  // ----------------------------------------
  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        launchConfetti();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function launchConfetti() {
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = 'block';

    const colors = ['#6c63ff', '#00d4aa', '#ff6b6b', '#c084fc', '#ffd166', '#06d6a0', '#ef476f'];
    const confetti = [];

    for (let i = 0; i < 200; i++) {
      confetti.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let frame = 0;
    const maxFrames = 200;

    function drawConfetti() {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      frame++;

      const fadeStart = maxFrames * 0.7;
      confetti.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.05;
        c.rot += c.rotSpeed;
        if (frame > fadeStart) {
          c.opacity = Math.max(0, 1 - (frame - fadeStart) / (maxFrames - fadeStart));
        }

        cCtx.save();
        cCtx.translate(c.x, c.y);
        cCtx.rotate((c.rot * Math.PI) / 180);
        cCtx.globalAlpha = c.opacity;
        cCtx.fillStyle = c.color;
        cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        cCtx.restore();
      });

      if (frame < maxFrames) {
        requestAnimationFrame(drawConfetti);
      } else {
        confettiCanvas.style.display = 'none';
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    drawConfetti();
  }

  // ----------------------------------------
  // Logo glitch on hover
  // ----------------------------------------
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.classList.add('glitch');
      setTimeout(() => logo.classList.remove('glitch'), 600);
    });
  }

})();
