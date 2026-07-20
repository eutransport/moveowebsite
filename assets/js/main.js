/* ==========================================================
   Moveo Transport — main.js
   Preloader • Nav • Reveals • Counters • Forms
   ========================================================== */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Active nav link ---------- */
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === currentPath) a.classList.add('active');
  });

  /* ---------- Header scroll state ---------- */
  const header = $('.site-header');
  const setScrolled = () => header && header.classList.toggle('scrolled', window.scrollY > 20);
  setScrolled(); window.addEventListener('scroll', setScrolled, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $('.hamburger');
  const mMenu  = $('.mobile-menu');
  if (burger && mMenu) {
    const toggle = () => {
      const open = mMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', toggle);
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
      mMenu.classList.remove('open'); burger.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }));
  }

  /* ---------- Preloader ---------- */
  const pre = $('.preloader');
  const runPreloader = () => new Promise(resolve => {
    if (!pre) return resolve();
    const logo = $('.preloader-logo', pre);
    const bar  = $('.preloader-bar span', pre);
    const gsapReady = typeof gsap !== 'undefined';

    if (prefersReduce || !gsapReady) {
      pre.classList.add('hide');
      pre.style.transition = 'opacity .4s ease';
      pre.style.opacity = 0;
      setTimeout(() => { pre.remove(); resolve(); }, 350);
      return;
    }

    const tl = gsap.timeline({ onComplete: () => {
      pre.classList.add('hide');
      gsap.to(pre, { opacity: 0, duration: .55, ease: 'power2.out', onComplete: () => { pre.remove(); resolve(); }});
    }});
    tl.to(logo, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, 0.2)
      .to(bar,  { width: '100%', duration: 1.1, ease: 'power2.inOut' }, 0.25)
      .to(logo, { scale: 1.05, duration: .35, ease: 'power2.out' }, '-=0.2')
      .to(logo, { scale: 1, duration: .35, ease: 'power2.inOut' });
  });

  /* ---------- Hero intro animation ---------- */
  const heroIntro = () => {
    if (typeof gsap === 'undefined' || prefersReduce) {
      // Reduced motion: toon alles direct
      $$('.hero-watermark, .hero-title, .hero-words b, .hero-ctas .btn, .hero-scroll')
        .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      document.dispatchEvent(new CustomEvent('moveo:hero-globe-in'));
      return;
    }

    // Start-state
    gsap.set('.hero-watermark', { opacity: 0 });
    gsap.set('.hero-title',     { opacity: 0, y: 40 });
    gsap.set('.hero-words b',   { opacity: 0, y: 20 });
    gsap.set('.hero-ctas .btn', { opacity: 0, y: 20 });
    gsap.set('.hero-scroll',    { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1) Watermerk (MOVE + wereldbol) fadet rustig in
    tl.to('.hero-watermark', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.2)
      .call(() => { document.dispatchEvent(new CustomEvent('moveo:hero-globe-in')); }, null, 0.2)

      // 2) "Logistiek van Wereldklasse" zweeft van onder omhoog
      .to('.hero-title',    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 1.0)
      .to('.hero-words b',  { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.7)
      .to('.hero-ctas .btn',{ opacity: 1, y: 0, duration: 0.55, stagger: 0.10 }, 2.1)
      .to('.hero-scroll',   { opacity: 1, duration: 0.7 }, 2.6);
  };

  /* ---------- Reveal on scroll (IntersectionObserver + optional GSAP) ---------- */
  // Auto-taggen: elke sectie (behalve hero) + belangrijke content-blokken krijgen .reveal
  // zodat ALLES bij scrollen soepel van onderaf infaded.
  const autoRevealSelectors = [
    'main > section:not(#home) > .container-x > *',
    'main > section:not(#home) .grid-3 > *',
    'main > section:not(#home) .grid-2 > *',
    'main > section:not(#home) .card',
    'main > section:not(#home) .review',
    'main > section:not(#home) .job',
    'main > section:not(#home) .step',
    'main > section:not(#home) .stats > *',
    'main > section:not(#home) .timeline > *',
  ];
  autoRevealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      if (el.classList.contains('reveal')) return;
      if (el.closest('[data-anim]')) return; // laat GSAP-groepen met rust
      el.classList.add('reveal');
      // Stagger: subtiele vertraging per opeenvolgend element in dezelfde parent
      if (el.parentElement && (el.parentElement.matches('.grid-3, .grid-2, .stats, .timeline'))) {
        el.style.transitionDelay = (Math.min(idx, 6) * 90) + 'ms';
      }
    });
  });

  const reveals = $$('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------- GSAP scroll reveal for section-heads / cards ---------- */
  const gsapScrollAnims = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReduce) return;
    gsap.registerPlugin(ScrollTrigger);

    $$('[data-anim="fade-up"]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out'
      });
    });

    $$('[data-anim="stagger"]').forEach(group => {
      const items = group.children;
      gsap.from(items, {
        scrollTrigger: { trigger: group, start: 'top 82%' },
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
      });
    });

    // Counter animation
    $$('[data-count]').forEach(el => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = (String(end).split('.')[1] || '').length;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => { el.textContent = obj.v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + suffix; }
      });
    });
  };

  /* ---------- Web3Forms integration ----------
     Set your access key once via <meta name="web3forms-key" content="YOUR-KEY">
     or per-form via <form data-access-key="YOUR-KEY">.                       */
  const globalKey = (document.querySelector('meta[name="web3forms-key"]') || {}).content || '';

  $$('form[data-form]').forEach(form => {
    // Ensure Web3Forms required fields exist
    const accessKey = form.dataset.accessKey || globalKey;
    if (accessKey && !form.querySelector('input[name="access_key"]')) {
      const k = document.createElement('input');
      k.type = 'hidden'; k.name = 'access_key'; k.value = accessKey;
      form.appendChild(k);
    }
    if (!form.querySelector('input[name="subject"]')) {
      const s = document.createElement('input');
      s.type = 'hidden'; s.name = 'subject';
      s.value = `Moveo Transport — ${form.dataset.form || 'formulier'}`;
      form.appendChild(s);
    }
    if (!form.querySelector('input[name="from_name"]')) {
      const fn = document.createElement('input');
      fn.type = 'hidden'; fn.name = 'from_name'; fn.value = 'Moveo Transport Website';
      form.appendChild(fn);
    }
    // Honeypot
    if (!form.querySelector('input[name="botcheck"]')) {
      const hp = document.createElement('input');
      hp.type = 'checkbox'; hp.name = 'botcheck';
      hp.style.cssText = 'position:absolute;left:-9999px;';
      hp.tabIndex = -1; hp.setAttribute('aria-hidden', 'true');
      form.appendChild(hp);
    }

    // Captcha (sommetje) — random per pageload, opgeslagen op form dataset
    const captchaBox = form.querySelector('[data-captcha]');
    if (captchaBox) {
      const a = Math.floor(Math.random() * 8) + 2;   // 2..9
      const b = Math.floor(Math.random() * 8) + 2;   // 2..9
      form.dataset.captchaAnswer = String(a + b);
      const aEl = captchaBox.querySelector('[data-captcha-a]');
      const bEl = captchaBox.querySelector('[data-captcha-b]');
      if (aEl) aEl.textContent = a;
      if (bEl) bEl.textContent = b;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const success = form.querySelector('.form-success');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';

      // Basic native validation
      if (!form.checkValidity()) { form.reportValidity(); return; }

      // Captcha check
      const expected = form.dataset.captchaAnswer;
      if (expected) {
        const input = form.querySelector('[data-captcha-input]');
        const given = (input && input.value || '').trim();
        if (given !== expected) {
          if (input) {
            input.setCustomValidity('Onjuist antwoord — probeer het opnieuw.');
            input.reportValidity();
            input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
          }
          return;
        }
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verzenden…</span>';
      }

      try {
        if (!accessKey) throw new Error('web3forms-key-missing');
        const data = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error(json.message || 'submit-failed');

        if (success) {
          success.classList.add('show');
          if (typeof gsap !== 'undefined') gsap.from(success, { y: -10, opacity: 0, duration: .5, ease: 'power2.out' });
        }
        form.reset();
      } catch (err) {
        if (success) {
          success.classList.add('show');
          success.style.borderColor = 'rgba(248,113,113,0.5)';
          success.style.background = 'rgba(248,113,113,0.08)';
          success.style.color = '#FCA5A5';
          success.textContent = err.message === 'web3forms-key-missing'
            ? 'Formulier nog niet geactiveerd — voeg uw Web3Forms access key toe in de <meta> tag.'
            : 'Er ging iets mis met verzenden. Probeer het opnieuw of bel ons direct.';
        }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalHTML; }
        window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Boot ---------- */
  window.addEventListener('load', async () => {
    await runPreloader();
    heroIntro();
    gsapScrollAnims();
    // Kick hero canvas in case it depends on layout
    document.dispatchEvent(new CustomEvent('moveo:ready'));
  });
})();
