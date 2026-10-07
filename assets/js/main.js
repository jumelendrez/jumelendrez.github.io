(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const progressBar = document.getElementById('scroll-progress-bar');
  const cursorGlow = document.querySelector('.cursor-glow');

  const closeNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    navLinks.forEach(link => link.addEventListener('click', closeNav));

    document.addEventListener('click', event => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });
  }

  const updateScrollUI = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 12);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, y / max * 100)) : 0;
      progressBar.style.width = pct + '%';
    }

    const rail = document.querySelector('.experience-rail');
    const railProgress = document.querySelector('.experience-progress span');
    if (rail && railProgress) {
      const rect = rail.getBoundingClientRect();
      const viewportPoint = window.innerHeight * 0.62;
      const travelled = viewportPoint - rect.top;
      const pct = Math.min(100, Math.max(0, travelled / rect.height * 100));
      railProgress.style.height = pct + '%';
    }
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);

  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll(':scope > [data-reveal]')]
          : [];
        const index = Math.max(0, group.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(index * 45, 135) + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(item => observer.observe(item));
  }

  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-38% 0px -52% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  if (false && !reduceMotion && cursorGlow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      cursorGlow.style.left = event.clientX + 'px';
      cursorGlow.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  if (false && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = 'translate(' + (x * 0.08) + 'px,' + (y * 0.12) + 'px)';
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });

    document.querySelectorAll('.dossier').forEach(card => {
      const visual = card.querySelector('.dossier-visual');
      if (!visual || visual.classList.contains('project-visual-v6')) return;

      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        visual.style.transform = 'translate3d(' + (nx * -7) + 'px,' + (ny * -7) + 'px,0) scale(1.015)';
      });

      card.addEventListener('pointerleave', () => {
        visual.style.transform = '';
      });
    });
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();


/* V5.2 integrated hero interaction */
(() => {
  const stage = document.querySelector('.hero-visual-v5-2');
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!stage || !finePointer || reduceMotion) return;

  const grid = stage.querySelector('.hero-gridback-v5-2');
  const halo = stage.querySelector('.hero-halo-v5-2');
  const profile = stage.querySelector('.hero-profile-v5-2');

  stage.addEventListener('pointermove', event => {
    const rect = stage.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;

    if (grid) {
      grid.style.transform = `translate3d(${nx * -6}px,${ny * -5}px,0)`;
    }

    if (halo) {
      halo.style.marginLeft = `${nx * 5}px`;
      halo.style.marginTop = `${ny * 4}px`;
    }

    if (profile) {
      profile.style.marginLeft = `${nx * 3}px`;
    }
  });

  stage.addEventListener('pointerleave', () => {
    if (grid) grid.style.transform = '';
    if (halo) {
      halo.style.marginLeft = '';
      halo.style.marginTop = '';
    }
    if (profile) profile.style.marginLeft = '';
  });
})();
