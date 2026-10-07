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
        entry.target.style.transitionDelay = Math.min(index * 70, 280) + 'ms';
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

  if (!reduceMotion && cursorGlow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      cursorGlow.style.left = event.clientX + 'px';
      cursorGlow.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
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
      if (!visual) return;

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


/* V6.9 GitHub activity — live public GitHub metrics and public portfolio commit heatmap */
(() => {
  const root = document.querySelector('#github-activity');
  if (!root) return;

  const username = 'jumelendrez';
  const repoName = 'jumelendrez.github.io';
  const previewBranch = 'v6-measured-rebuild';
  const api = 'https://api.github.com';

  const number = value => new Intl.NumberFormat('en-US').format(value || 0);
  const set = (selector, value) => {
    const el = root.querySelector(selector);
    if (el) el.textContent = value;
  };

  const fetchJson = async url => {
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error('GitHub API ' + response.status);
    return response.json();
  };

  const startOfCalendar = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (52 * 7 + 6));
    return { start, end, today };
  };

  const dateKey = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  };

  const buildCalendar = commitDates => {
    const heatmap = root.querySelector('[data-gh-heatmap]');
    const months = root.querySelector('[data-gh-months]');
    if (!heatmap || !months) return;

    const { start, end, today } = startOfCalendar();
    const counts = new Map();
    commitDates.forEach(date => {
      const key = dateKey(date);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const cells = [];
    const monthMarkers = [];
    let cursor = new Date(start);
    let lastMonth = -1;
    let weekIndex = 0;

    while (cursor <= end) {
      if (cursor.getDay() === 0) weekIndex++;
      if (cursor.getMonth() !== lastMonth && cursor.getDate() <= 7) {
        monthMarkers.push({
          label: cursor.toLocaleString('en-US', { month: 'short' }),
          week: Math.max(0, weekIndex - 1)
        });
        lastMonth = cursor.getMonth();
      }

      const key = dateKey(cursor);
      const count = counts.get(key) || 0;
      const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
      const cell = document.createElement('span');
      cell.className = 'github-heatmap-cell';
      cell.dataset.level = String(level);
      cell.title = count + ' public portfolio commit' + (count === 1 ? '' : 's') + ' on ' + key;
      if (cursor > today) {
        cell.dataset.level = '0';
        cell.style.opacity = '.28';
      }
      cells.push(cell);
      cursor.setDate(cursor.getDate() + 1);
    }

    heatmap.replaceChildren(...cells);
    months.replaceChildren(...monthMarkers.map(marker => {
      const span = document.createElement('span');
      span.textContent = marker.label;
      span.style.left = ((marker.week / 52) * 100) + '%';
      return span;
    }));

    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(oneYearAgo.getDate() - 364);
    const activeKeys = [...counts.keys()]
      .filter(key => {
        const d = new Date(key + 'T00:00:00');
        return d >= oneYearAgo && d <= today;
      })
      .sort();

    const total = activeKeys.reduce((sum, key) => sum + (counts.get(key) || 0), 0);
    set('[data-gh-year-total]', number(total) + ' total');

    let longest = 0;
    let run = 0;
    let previous = null;
    activeKeys.forEach(key => {
      const current = new Date(key + 'T00:00:00');
      if (previous) {
        const diff = Math.round((current - previous) / 86400000);
        run = diff === 1 ? run + 1 : 1;
      } else {
        run = 1;
      }
      longest = Math.max(longest, run);
      previous = current;
    });
    set('[data-gh-longest]', longest + ' day' + (longest === 1 ? '' : 's'));

    let currentStreak = 0;
    const cursorDay = new Date(today);
    while (counts.get(dateKey(cursorDay))) {
      currentStreak++;
      cursorDay.setDate(cursorDay.getDate() - 1);
    }
    if (!currentStreak) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      while (counts.get(dateKey(yesterday))) {
        currentStreak++;
        yesterday.setDate(yesterday.getDate() - 1);
      }
    }
    set('[data-gh-current]', currentStreak + ' day' + (currentStreak === 1 ? '' : 's'));
  };

  const loadCommits = async () => {
    const branches = [previewBranch, 'main'];
    let commits = [];
    for (const branch of branches) {
      try {
        const collected = [];
        for (let page = 1; page <= 3; page++) {
          const batch = await fetchJson(api + '/repos/' + username + '/' + repoName + '/commits?sha=' + encodeURIComponent(branch) + '&per_page=100&page=' + page);
          collected.push(...batch);
          if (batch.length < 100) break;
        }
        commits = collected;
        if (commits.length) break;
      } catch (error) {
        commits = [];
      }
    }

    const dates = commits
      .map(commit => commit && commit.commit && commit.commit.author && commit.commit.author.date)
      .filter(Boolean)
      .map(value => new Date(value));

    set('[data-gh-commits]', number(commits.length));
    buildCalendar(dates);
  };

  const loadProfile = async () => {
    const [profile, repos] = await Promise.all([
      fetchJson(api + '/users/' + username),
      fetchJson(api + '/users/' + username + '/repos?type=owner&sort=updated&per_page=100')
    ]);

    set('[data-gh-repos]', number(profile.public_repos));
    set('[data-gh-followers]', number(profile.followers));
    set('[data-gh-stars]', number(repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)));
  };

  const loadLanguages = async () => {
    const list = root.querySelector('[data-gh-languages]');
    if (!list) return;

    try {
      const languages = await fetchJson(api + '/repos/' + username + '/' + repoName + '/languages');
      const entries = Object.entries(languages).sort((a,b) => b[1] - a[1]);
      const total = entries.reduce((sum, entry) => sum + entry[1], 0);
      if (!entries.length || !total) throw new Error('No language data');

      const top = entries.slice(0, 5).map(([name, bytes]) => {
        const chip = document.createElement('span');
        chip.className = 'github-language-chip';
        const dot = document.createElement('i');
        const label = document.createElement('span');
        const pct = document.createElement('b');
        label.textContent = name;
        pct.textContent = Math.round(bytes / total * 100) + '%';
        chip.append(dot, label, pct);
        return chip;
      });
      list.replaceChildren(...top);
    } catch (error) {
      list.innerHTML = '<span class="github-language-loading">Public language data temporarily unavailable.</span>';
    }
  };

  Promise.allSettled([loadProfile(), loadCommits(), loadLanguages()]).then(results => {
    const failed = results.every(result => result.status === 'rejected');
    const note = root.querySelector('[data-gh-note]');
    if (failed && note) {
      note.textContent = 'GitHub live metrics are temporarily unavailable. Use the View GitHub button to open the public profile directly.';
    }
  });
})();
