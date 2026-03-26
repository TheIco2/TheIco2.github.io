/* ============================================
   Portfolio — Interactive Scripts
   ============================================ */

(function () {
  'use strict';

  // ========================================
  // Page Load Intro Sequence
  // ========================================
  const introOverlay = document.getElementById('introOverlay');
  const introLines = introOverlay.querySelectorAll('.intro-line');
  let introDelay = 0;

  introLines.forEach((line) => {
    const d = parseInt(line.getAttribute('data-delay'), 10) || 0;
    setTimeout(() => line.classList.add('show'), d);
    introDelay = Math.max(introDelay, d);
  });

  // Dismiss intro after last line + pause
  setTimeout(() => {
    introOverlay.classList.add('done');
    document.body.classList.add('loaded');
  }, introDelay + 1000);

  // ========================================
  // Custom Cursor (Dot + Ring)
  // ========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
  });

  function animateCursor() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;

    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }

  if (window.matchMedia('(hover: hover)').matches) {
    animateCursor();

    // Hover detection for interactive elements
    const hoverTargets = 'a, button, [data-magnetic], .project-card, .skill-item, .social-link, .nav-toggle';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      }
    });

    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('clicking');
      cursorRing.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('clicking');
      cursorRing.classList.remove('clicking');
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

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

  // ========================================
  // Mouse Trail (glowing particles)
  // ========================================
  const trailCanvas = document.getElementById('trailCanvas');
  const tCtx = trailCanvas.getContext('2d');
  const trailPoints = [];
  const MAX_TRAIL = 30;

  function resizeTrail() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail);

  document.addEventListener('mousemove', (e) => {
    trailPoints.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trailPoints.length > MAX_TRAIL) trailPoints.shift();
  });

  function drawTrail() {
    tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    for (let i = trailPoints.length - 1; i >= 0; i--) {
      const p = trailPoints[i];
      p.life -= 0.025;
      if (p.life <= 0) {
        trailPoints.splice(i, 1);
        continue;
      }
      const size = p.life * 3;
      const alpha = p.life * 0.4;
      tCtx.beginPath();
      tCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
      tCtx.fillStyle = 'rgba(108, 99, 255, ' + alpha + ')';
      tCtx.fill();

      // Glow ring
      tCtx.beginPath();
      tCtx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
      tCtx.fillStyle = 'rgba(108, 99, 255, ' + (alpha * 0.15) + ')';
      tCtx.fill();
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();

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

  // ========================================
  // Rotating Words (Hero)
  // ========================================
  const rotatingContainer = document.getElementById('rotatingWords');
  if (rotatingContainer) {
    const words = rotatingContainer.querySelectorAll('.rotating-word');
    let currentWord = 0;
    const WORD_INTERVAL = 3000;

    setInterval(() => {
      const prev = words[currentWord];
      prev.classList.remove('active');
      prev.classList.add('exit-up');

      currentWord = (currentWord + 1) % words.length;
      const next = words[currentWord];

      // Small delay so exit plays before enter
      setTimeout(() => {
        prev.classList.remove('exit-up');
        next.classList.add('active');
      }, 300);
    }, WORD_INTERVAL);
  }

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

  // ========================================
  // Section Reveal Animations (varied)
  // ========================================
  const revealSections = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  revealSections.forEach((el) => revealObserver.observe(el));

  // ========================================
  // Terminal Typing Animation
  // ========================================
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const outputs = terminalBody.querySelectorAll('.terminal-output');

    const terminalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            outputs.forEach((line) => {
              const delay = parseInt(line.getAttribute('data-delay'), 10) || 0;
              setTimeout(() => line.classList.add('typed'), delay);
            });
            terminalObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    terminalObserver.observe(terminalBody);
  }

  // ========================================
  // Scroll Velocity Skew
  // ========================================
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let velocityFrame;
  const skewTargets = document.querySelectorAll('.section-title, .project-title, .contact-title');

  function updateVelocitySkew() {
    const currentScrollY = window.scrollY;
    const rawVelocity = currentScrollY - lastScrollY;
    scrollVelocity += (rawVelocity - scrollVelocity) * 0.15;
    lastScrollY = currentScrollY;

    const skew = Math.max(-3, Math.min(3, scrollVelocity * 0.15));

    skewTargets.forEach((el) => {
      el.style.transform = 'skewY(' + skew + 'deg)';
    });

    velocityFrame = requestAnimationFrame(updateVelocitySkew);
  }
  updateVelocitySkew();

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
  // Tilt + Spotlight + CRT Glitch on cards
  // ----------------------------------------
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('glitch-active');
        setTimeout(() => card.classList.remove('glitch-active'), 300);
      });

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

  // ========================================
  // GitHub Stats (public API, no auth)
  // ========================================
  const GH_USER = 'TheIco2';
  const LANG_COLORS = {
    Rust: '#dea584',
    JavaScript: '#f1e05a',
    HTML: '#e34c26',
    CSS: '#563d7c',
    TypeScript: '#3178c6',
    Python: '#3572a5',
    Shell: '#89e051',
    PowerShell: '#012456',
    WGSL: '#6c63ff',
  };

  async function fetchGitHubStats() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch('https://api.github.com/users/' + GH_USER),
        fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=updated'),
      ]);

      if (!userRes.ok || !reposRes.ok) return;

      const user = await userRes.json();
      const repos = await reposRes.json();

      // Total stars
      const totalStars = repos.reduce(function (sum, r) {
        return sum + (r.stargazers_count || 0);
      }, 0);

      // Language byte counts across repos
      const langTotals = {};
      repos.forEach(function (r) {
        if (r.language) {
          langTotals[r.language] = (langTotals[r.language] || 0) + (r.size || 0);
        }
      });

      // Sort languages by size
      const sortedLangs = Object.entries(langTotals)
        .sort(function (a, b) { return b[1] - a[1]; });

      const topLang = sortedLangs.length > 0 ? sortedLangs[0][0] : '—';

      // Animate stat values
      animateGHStat('ghRepos', user.public_repos || 0);
      animateGHStat('ghStars', totalStars);
      animateGHStat('ghFollowers', user.followers || 0);
      document.getElementById('ghLang').textContent = topLang;

      // Draw language bar
      renderLangBar(sortedLangs);
    } catch (e) {
      // Silently fail — stats just stay as dashes
    }
  }

  function animateGHStat(id, target) {
    const el = document.getElementById(id);
    if (!el || target === 0) {
      if (el) el.textContent = '0';
      return;
    }
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function renderLangBar(sortedLangs) {
    const container = document.getElementById('githubLangs');
    if (!container || sortedLangs.length === 0) return;

    const total = sortedLangs.reduce(function (s, l) { return s + l[1]; }, 0);
    // Take top 6 languages
    const topLangs = sortedLangs.slice(0, 6);

    // Bar
    topLangs.forEach(function (entry) {
      var lang = entry[0];
      var size = entry[1];
      var pct = (size / total) * 100;
      var bar = document.createElement('div');
      bar.className = 'lang-bar';
      bar.style.flexGrow = '0';
      bar.style.background = LANG_COLORS[lang] || '#8b8b95';
      bar.title = lang + ' — ' + pct.toFixed(1) + '%';
      container.appendChild(bar);

      // Animate flex-grow after a tick
      requestAnimationFrame(function () {
        bar.style.flexGrow = String(pct);
      });
    });

    // Legend
    var legend = document.createElement('div');
    legend.className = 'github-langs-legend';
    topLangs.forEach(function (entry) {
      var lang = entry[0];
      var size = entry[1];
      var pct = (size / total) * 100;
      var item = document.createElement('span');
      item.className = 'lang-legend-item';
      item.innerHTML =
        '<span class="lang-dot" style="background:' + (LANG_COLORS[lang] || '#8b8b95') + '"></span>' +
        lang + ' <span style="color:var(--text-tertiary)">' + pct.toFixed(1) + '%</span>';
      legend.appendChild(item);
    });
    container.parentElement.appendChild(legend);
  }

  // Fetch when stats card scrolls into view
  var ghStatsEl = document.getElementById('githubStats');
  if (ghStatsEl) {
    var ghObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fetchGitHubStats();
            ghObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    ghObserver.observe(ghStatsEl);
  }

})();
