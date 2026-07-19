# Moveo Transport B.V. — Website

Premium, moderne en volledig responsive website voor Moveo Transport B.V.
Gebouwd met HTML5, Tailwind CSS (Play CDN), custom CSS design system en GSAP animaties.

## Design filosofie

- Geïnspireerd door de kwaliteit van Tesla, Apple, Volvo en FedEx
- Gebaseerd op het Moveo-logo: donker navy achtergrond, koninklijk blauw, elektrisch cyaan en zilver
- Geen stockfoto's van vrachtwagens — futuristische globe + netwerkanimatie in de hero
- Ruime witruimte, moderne typografie (Sora + Inter), subtiele micro-interacties

## Pagina's

- `index.html` — Home met animated hero (roterende globe, particles, arcs)
- `over-ons.html` — Bedrijfsverhaal, missie, visie, kernwaarden
- `diensten.html` — Nationaal / Internationaal / Spoed / Distributie + aanvullende diensten
- `vacatures.html` — Vacature-overzicht + sollicitatieformulier
- `offerte.html` — Volledig offerteformulier
- `contact.html` — Contactgegevens, formulier, kaart en social

## Bestandsstructuur

```
moveotransportwebsite/
├─ index.html
├─ over-ons.html
├─ diensten.html
├─ vacatures.html
├─ offerte.html
├─ contact.html
├─ assets/
│  ├─ css/styles.css        # Design system + componenten
│  ├─ js/
│  │  ├─ partials.js        # Injecteert header/footer/preloader
│  │  ├─ main.js            # Nav, preloader, GSAP reveals, counters, forms
│  │  └─ hero.js            # Canvas 2D: globe, particles, route arcs
│  ├─ img/
│  │  ├─ moveo-logo.jpeg    # Brand logo
│  │  └─ favicon.svg
│  └─ fonts/                # (Google Fonts CDN, lokale fallback klaar)
└─ README.md
```

## Design system

**Kleuren** — CSS custom properties in `assets/css/styles.css`:

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--brand-navy-900` | `#050B1F` | Body background |
| `--brand-deep`     | `#0A1F44` | Deep accents |
| `--brand-blue`     | `#1E4FD8` | Primary brand blue |
| `--brand-cyan`     | `#38BDF8` | Highlights / focus rings |
| `--brand-sky`      | `#7DD3FC` | Gradient endpoints |
| `--brand-silver`   | `#C7D2E0` | Borders / dim text |

**Typografie**
- Display: **Sora** (300–800)
- Body: **Inter** (300–700)
- Utility classes: `.h-hero`, `.h-1`, `.h-2`, `.lead`, `.eyebrow`, `.text-gradient`, `.text-gradient-blue`

**Componenten** — `.btn / .btn-primary / .btn-ghost`, `.card`, `.field`, `.step`, `.review`, `.job`, `.cta-strip`, `.stats`, `.timeline`.

**Animaties**
- Preloader met sweep-lijnen + logo fade
- GSAP scroll-triggered fade-up en stagger via `data-anim="fade-up"` / `data-anim="stagger"`
- Number counters via `data-count="123" data-suffix="+"`
- Reveal utility: `class="reveal"` (IntersectionObserver)
- Respecteert `prefers-reduced-motion`

## Lokaal uitvoeren

De site is 100% static. **Aanbevolen** (i.v.m. `iframe` map-loader en fonts):

```powershell
# Optie A — VS Code Live Server extensie (rechtsklik index.html → Open with Live Server)

# Optie B — Python
python -m http.server 5500
# open http://localhost:5500

# Optie C — Node
npx --yes serve -l 5500 .
```

> Direct `index.html` openen vanaf disk werkt ook, maar sommige browsers blokkeren
> de OpenStreetMap iframe over `file://`. Een lokale server is daarom aan te raden.

## Prestaties & toegankelijkheid

- Semantische HTML5-structuur (`header`, `main`, `section`, `footer`)
- ARIA-labels op interactieve elementen
- Focus-styling met `:focus-visible`
- Contrast conform WCAG AA
- Lazy-loaded iframes
- Reduced-motion aware
- Geen build-stap noodzakelijk

## Aanpassen

- **Contactgegevens** → in `assets/js/partials.js` (footer) + `contact.html`.
- **Kleuren / typografie** → CSS variables bovenaan `assets/css/styles.css`.
- **Vacatures** → `vacatures.html` (`.job` blokken).
- **Diensten-content** → `diensten.html`.

## Formulieren

De formulieren gebruiken client-side validatie en tonen een success-melding.
Koppel `form[data-form]` in `assets/js/main.js` aan uw endpoint (bijv. Formspree, HubSpot, of een eigen API).

---

© Moveo Transport B.V. — Altijd in beweging.
