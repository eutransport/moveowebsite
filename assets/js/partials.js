/* ==========================================================
   Moveo Transport — partials.js
   Renders shared header, mobile menu, footer, and preloader.
   Runs synchronously at end of <body> so main.js can wire up.
   ========================================================== */

(() => {
  const NAV = [
    { href: 'index.html',     label: 'Home' },
    { href: 'over-ons.html',  label: 'Over Ons' },
    { href: 'diensten.html',  label: 'Diensten' },
    { href: 'vacatures.html', label: 'Vacatures' },
    { href: 'offerte.html',   label: 'Offerte' },
    { href: 'contact.html',   label: 'Contact' },
  ];

  const brand = `
    <a href="index.html" class="brand" aria-label="Moveo Transport home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-text">Moveo<span>.</span></span>
    </a>`;

  const navLinks = NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('');

  const header = `
    <header class="site-header" role="banner">
      <div class="container-x nav-inner">
        ${brand}
        <nav class="nav-links" aria-label="Hoofdnavigatie">${navLinks}</nav>
        <a class="btn btn-primary btn-sm nav-cta" href="offerte.html">
          <span>Offerte aanvragen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </span>
        </a>
        <button class="hamburger" aria-label="Menu openen" aria-expanded="false"><span></span></button>
      </div>
    </header>
    <div class="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
      ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
      <a class="btn btn-primary" href="offerte.html" style="margin-top:1rem"><span>Offerte aanvragen</span></a>
    </div>`;

  const footer = `
    <footer class="site-footer" role="contentinfo">
      <div class="container-x">
        <div class="footer-grid">
          <div class="footer-col">
            ${brand}
            <p style="color:var(--text-dim); margin:1rem 0 1.25rem; max-width: 34ch; line-height:1.6;">
              Moveo Transport B.V. — betrouwbaar wegtransport en logistieke oplossingen door heel Europa. Altijd in beweging voor uw lading.
            </p>
            <div class="social" aria-label="Social media">
              <a href="#" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4V21H3V9.75zM10 9.75h3.8v1.55h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.15c0-1.23-.02-2.8-1.7-2.8-1.72 0-1.98 1.34-1.98 2.72V21h-4V9.75z"/></svg></a>
              <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
              <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V7.5C13 6.5 13.3 6 14.8 6H17V2.2c-.4-.05-1.7-.2-3.2-.2C10.7 2 9 3.7 9 6.9V10H6v4h3v8h4z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.46-5.3a2.7 2.7 0 0 0-1.9-1.9C18.9 4.3 12 4.3 12 4.3s-6.9 0-8.64.5a2.7 2.7 0 0 0-1.9 1.9C1 8.4 1 12 1 12s0 3.6.46 5.3c.26.98 1 1.7 1.9 1.9 1.74.5 8.64.5 8.64.5s6.9 0 8.64-.5c.9-.2 1.64-.92 1.9-1.9C23 15.6 23 12 23 12zM10 15.5v-7l6 3.5-6 3.5z"/></svg></a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Navigatie</h4>
            ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join('')}
          </div>
          <div class="footer-col">
            <h4>Diensten</h4>
            <a href="diensten.html#nationaal">Nationaal Transport</a>
            <a href="diensten.html#internationaal">Internationaal Transport</a>
            <a href="diensten.html#spoed">Spoedtransport</a>
            <a href="diensten.html#distributie">Distributie</a>
            <a href="diensten.html#logistiek">Logistieke Oplossingen</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <a href="tel:+31636129223">+31 6 36 12 92 23</a>
            <a href="mailto:info@moveotransport.nl">info@moveotransport.nl</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Rijnvallei+12+6718+NV+Ede" target="_blank" rel="noopener">Rijnvallei 12<br/>6718 NV Ede</a>
            <a href="#">Ma – Vr: 07:00 – 19:00</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="year">2026</span> Moveo Transport B.V. — Alle rechten voorbehouden.</span>
          <span>KVK 99.89.12.63 • BTW NL8691.75.610.B.01</span>
        </div>
      </div>
    </footer>`;

  const preloader = `
    <div class="preloader" aria-hidden="true">
      <div class="preloader-lines"></div>
      <div class="preloader-logo">
        <span class="pre-move">MOVE</span>
        <span class="pre-globe">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id="preGlobeFill" cx="35%" cy="35%" r="80%">
                <stop offset="0%"  stop-color="rgba(56,189,248,0.18)"/>
                <stop offset="100%" stop-color="rgba(30,79,216,0.02)"/>
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#preGlobeFill)" stroke="rgba(56,132,255,0.55)" stroke-width="1.2"/>
            <ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke="rgba(56,132,255,0.45)" stroke-width="0.9"/>
            <ellipse cx="50" cy="50" rx="46" ry="32" fill="none" stroke="rgba(56,132,255,0.30)" stroke-width="0.8"/>
            <ellipse cx="50" cy="50" rx="16" ry="46" fill="none" stroke="rgba(56,132,255,0.45)" stroke-width="0.9"/>
            <ellipse cx="50" cy="50" rx="32" ry="46" fill="none" stroke="rgba(56,132,255,0.30)" stroke-width="0.8"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(230,240,255,0.15)" stroke-width="0.6"/>
          </svg>
        </span>
      </div>
      <div class="preloader-bar"><span></span></div>
    </div>`;

  // Inject header and mobile menu at very top of body
  const headerHost = document.getElementById('header-root');
  if (headerHost) headerHost.innerHTML = header;

  const footerHost = document.getElementById('footer-root');
  if (footerHost) footerHost.innerHTML = footer;

  const preHost = document.getElementById('preloader-root');
  if (preHost) preHost.innerHTML = preloader;
})();
