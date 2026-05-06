// =========================
// MUHAMMAD AFIF — PORTFOLIO
// Ultra Smooth Edition v2
// =========================

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initContactForm();
  initVideo();
  initButtonRipple();
  if (window.lucide) lucide.createIcons();
});

// =========================================
// 1. LOADER — fade out with smooth animation
// =========================================
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
    }, 700);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 800);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 800), { once: true });
  }
}

// ================================================
// 2. CUSTOM CURSOR — smooth lerped tracking
// ================================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorText = document.getElementById('cursor-text');
  if (!cursor) return;

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
    // Smooth lerp with adaptive friction
    const friction = cursor.classList.contains('is-hover') ? 0.12 : 0.18;
    curX += (mouseX - curX) * friction;
    curY += (mouseY - curY) * friction;
    textX += (mouseX - textX) * 0.1;
    textY += (mouseY - textY) * 0.1;

    cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${cursor.classList.contains('is-hover') ? 2.4 : 1})`;
    if (cursorText && cursor.classList.contains('is-hover')) {
      cursorText.style.transform = `translate3d(${textX}px, ${textY}px, 0)`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Hover state delegation with optimized targeting
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .work-card, .timeline-item, input, textarea');
    if (target) {
      cursor.classList.add('is-hover');
      if (cursorText) {
        cursorText.classList.add('is-visible');
        cursorText.textContent = target.dataset.cursorText || 'VIEW';
      }
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .work-card, .timeline-item, input, textarea');
    if (target) {
      cursor.classList.remove('is-hover');
      if (cursorText) cursorText.classList.remove('is-visible');
    }
  }, { passive: true });
}

// =================================================
// 3. NAV — scrolled state & active link detection
// =================================================
function initNav() {
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.nav-link');
  if (!nav) return;

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

  // Active section observer with better rootMargin
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  }, { rootMargin: '-30% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));
}

// ================================
// 4. MOBILE MENU — smooth toggle
// ================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    if (window.lucide) lucide.createIcons();
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', false);
    });
  });
}

// ================================================
// 5. SCROLL REVEAL — optimized with stagger
// ================================================
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, section, .timeline-item, .work-card');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.children).filter(el => el.classList.contains('reveal') || el.classList.contains('work-card')) : [];
        const indexInParent = siblings.indexOf(entry.target);
        
        const delay = entry.target.dataset.revealDelay
          ? parseInt(entry.target.dataset.revealDelay, 10)
          : Math.min(indexInParent * 100, 400);
        
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

  targets.forEach(t => observer.observe(t));
}

// ============================================
// 6. CONTACT MODAL — smooth enter/exit
// ============================================
function initContactForm() {
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('contact-form');
  if (!modal || !form) return;

  const open = () => {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    form.querySelector('input:first-of-type')?.focus();
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
  modal.addEventListener('click', (e) => { 
    if (e.target === modal) close(); 
  });
  document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape' && modal.classList.contains('show')) close(); 
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    const originalText = btn.textContent;
    
    btn.innerHTML = '<span style="display: inline-block; animation: pulse 1s ease-in-out infinite;">Sending…</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✓ Sent Successfully!';
      btn.style.background = 'linear-gradient(to right, #10b981, #06b6d4)';
      
      setTimeout(() => {
        form.reset();
        close();
        btn.innerHTML = original;
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 1400);
    }, 1600);
  });
}

// =====================================
// 7. VIDEO — lazy loading & pausing
// =====================================
function initVideo() {
  const video = document.querySelector('video');
  if (!video) return;
  
  video.playbackRate = 0.9;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(video);
}

// ==============================================
// 8. BUTTON RIPPLE — smooth ripple effect
// ==============================================
function initButtonRipple() {
  const buttons = document.querySelectorAll('button, a[href="#contact"], .work-card');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'translate(-50%, -50%)';

      // Only add ripple to specific buttons (not all elements)
      if (!this.classList.contains('work-card')) {
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        const animation = ripple.animate([
          { width: '0px', height: '0px', opacity: 1 },
          { width: '300px', height: '300px', opacity: 0 }
        ], {
          duration: 600,
          easing: 'ease-out'
        });

        animation.onfinish = () => ripple.remove();
      }
    });
  });
}

// ===========================
// UTILITY: Add pulse animation
// ===========================
if (!document.querySelector('style[data-pulse]')) {
  const style = document.createElement('style');
  style.setAttribute('data-pulse', '');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);
}
