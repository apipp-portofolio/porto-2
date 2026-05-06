// =========================
// MUHAMMAD AFIF — PORTFOLIO
// Smoother edition
// =========================

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initContactForm();
  initVideo();
  if (window.lucide) lucide.createIcons();
});

// 1. LOADER — fade out smoothly once everything is ready
function initLoader() {
  const loader = document.getElementById('loader');
  const cursor = document.getElementById('cursor');
  if (!loader) return;

  document.body.style.overflow = 'hidden';

  const hide = () => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
      document.body.style.overflow = '';
      if (cursor) cursor.classList.remove('hidden');
    }, 600);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 600), { once: true });
  }
}

// 2. CUSTOM CURSOR — lerped via requestAnimationFrame for buttery motion
function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorText = document.getElementById('cursor-text');
  if (!cursor) return;

  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    if (cursorText) cursorText.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;
  let textX = mouseX;
  let textY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const tick = () => {
    curX += (mouseX - curX) * 0.22;
    curY += (mouseY - curY) * 0.22;
    textX += (mouseX - textX) * 0.14;
    textY += (mouseY - textY) * 0.14;

    cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${cursor.classList.contains('is-hover') ? 2.2 : 1})`;
    if (cursorText) {
      cursorText.style.transform = `translate3d(${textX}px, ${textY}px, 0)`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Hover state delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .work-card, .timeline-item')) {
      cursor.classList.add('is-hover');
      if (cursorText) cursorText.classList.add('is-visible');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .work-card, .timeline-item')) {
      cursor.classList.remove('is-hover');
      if (cursorText) cursorText.classList.remove('is-visible');
    }
  });
}

// 3. NAV — scrolled state + active link via IntersectionObserver
function initNav() {
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.nav-link');

  // Scrolled background
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active section observer
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));
}

// 4. MOBILE MENU
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
    if (window.lucide) lucide.createIcons();
  });

  // Close menu after tapping a link
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu.classList.remove('is-open'));
  });
}

// 5. SCROLL REVEAL — staggered entries with IntersectionObserver
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, section, .timeline-item, .work-card');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent for a nicer cascade
        const delay = entry.target.dataset.revealDelay
          ? parseInt(entry.target.dataset.revealDelay, 10)
          : Math.min(i * 80, 320);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => observer.observe(t));
}

// 6. CONTACT MODAL & FORM
function initContactForm() {
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('contact-form');
  if (!modal || !form) return;

  const open = () => {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✓ Sent';
      setTimeout(() => {
        form.reset();
        close();
        btn.innerHTML = original;
        btn.disabled = false;
      }, 900);
    }, 1200);
  });
}

// 7. VIDEO — pause when offscreen to save resources
function initVideo() {
  const video = document.querySelector('video');
  if (!video) return;
  video.playbackRate = 0.85;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.15 });
  observer.observe(video);
}
