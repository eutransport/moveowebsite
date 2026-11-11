/* ==========================================================
   Moveo Transport — hero.js
   Rotating wireframe globe, arcs and particle network.
   Pure canvas 2D. Lightweight, GPU-friendly.
   ========================================================== */

(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, cx = 0, cy = 0, R = 0;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2; cy = H / 2;
    R  = Math.min(W, H) * 0.28;
  };
  resize();
  window.addEventListener('resize', resize);

  /* ---- Globe latitude/longitude grid ---- */
  const LAT = 9, LON = 18;
  const latSteps = [], lonSteps = [];
  for (let i = 1; i < LAT; i++) latSteps.push(-Math.PI/2 + (Math.PI * i) / LAT);
  for (let j = 0; j < LON; j++) lonSteps.push((Math.PI * 2 * j) / LON);

  /* ---- Random hub points (cities) ---- */
  const HUBS = [];
  const HUB_COUNT = 22;
  for (let i = 0; i < HUB_COUNT; i++) {
    HUBS.push({
      lat: (Math.random() - 0.5) * Math.PI * 0.85,
      lon: Math.random() * Math.PI * 2,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  /* ---- Arcs between hubs (routes) ---- */
  const ARCS = [];
  const spawnArc = () => {
    const a = HUBS[Math.floor(Math.random() * HUBS.length)];
    let b;
    do { b = HUBS[Math.floor(Math.random() * HUBS.length)]; } while (b === a);
    ARCS.push({ a, b, t: 0, dur: 2.2 + Math.random() * 1.8 });
  };
  for (let i = 0; i < 4; i++) spawnArc();

  /* ---- Background particles ---- */
  const PARTS = [];
  const PART_COUNT = Math.min(90, Math.floor((W * H) / 18000));
  for (let i = 0; i < PART_COUNT; i++) {
    PARTS.push({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 1 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    });
  }

  /* ---- Helpers ---- */
  const project = (lat, lon, rot) => {
    // Sphere -> 2D, rotate around Y axis by 'rot'
    const clat = Math.cos(lat), slat = Math.sin(lat);
    const x3 = clat * Math.cos(lon + rot);
    const y3 = slat;
    const z3 = clat * Math.sin(lon + rot);
    return {
      x: cx + x3 * R,
      y: cy + y3 * R,
      z: z3, // -1 (back) to 1 (front)
    };
  };

  const drawGlobe = (rot) => {
    // Outer glow
    const grad = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.6);
    grad.addColorStop(0, 'rgba(47,181,211,0.22)');
    grad.addColorStop(1, 'rgba(47,181,211,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, Math.PI * 2); ctx.fill();

    // Fill sphere subtly
    const inner = ctx.createRadialGradient(cx - R*0.25, cy - R*0.3, R*0.05, cx, cy, R);
    inner.addColorStop(0, 'rgba(123,223,242,0.10)');
    inner.addColorStop(1, 'rgba(33,35,46,0.0)');
    ctx.fillStyle = inner;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    // Latitude rings
    ctx.lineWidth = 1;
    latSteps.forEach(lat => {
      ctx.beginPath();
      for (let j = 0; j <= 64; j++) {
        const p = project(lat, (Math.PI * 2 * j) / 64, rot);
        const alpha = Math.max(0, (p.z + 1) / 2) * 0.35 + 0.05;
        ctx.strokeStyle = `rgba(180,238,248,${alpha})`;
        if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    });

    // Longitude arcs
    lonSteps.forEach(lon => {
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const lat = -Math.PI/2 + (Math.PI * i) / 64;
        const p = project(lat, lon, rot);
        const alpha = Math.max(0, (p.z + 1) / 2) * 0.28 + 0.04;
        ctx.strokeStyle = `rgba(180,238,248,${alpha})`;
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    });

    // Equator emphasis
    ctx.beginPath();
    for (let j = 0; j <= 128; j++) {
      const p = project(0, (Math.PI * 2 * j) / 128, rot);
      const alpha = Math.max(0, (p.z + 1) / 2) * 0.6;
      ctx.strokeStyle = `rgba(123,223,242,${alpha})`;
      if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  };

  const drawHubs = (rot, t) => {
    HUBS.forEach(h => {
      const p = project(h.lat, h.lon, rot);
      if (p.z < -0.05) return;
      const front = (p.z + 1) / 2;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2 + h.pulse);
      const r = 1.4 + front * 1.4;
      ctx.beginPath();
      ctx.fillStyle = `rgba(180,238,248,${0.5 + front * 0.5})`;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = `rgba(123,223,242,${0.25 * front * pulse})`;
      ctx.lineWidth = 1;
      ctx.arc(p.x, p.y, r + 4 + pulse * 3, 0, Math.PI * 2); ctx.stroke();
    });
  };

  const drawArcs = (rot, dt) => {
    for (let i = ARCS.length - 1; i >= 0; i--) {
      const arc = ARCS[i];
      arc.t += dt;
      const k = arc.t / arc.dur;
      if (k >= 1.2) { ARCS.splice(i, 1); spawnArc(); continue; }

      const pa = project(arc.a.lat, arc.a.lon, rot);
      const pb = project(arc.b.lat, arc.b.lon, rot);
      if (pa.z < -0.1 && pb.z < -0.1) continue;

      // Control point above the great-circle midpoint
      const mx = (pa.x + pb.x) / 2;
      const my = (pa.y + pb.y) / 2;
      const dx = pb.x - pa.x, dy = pb.y - pa.y;
      const len = Math.hypot(dx, dy);
      const lift = Math.min(R * 0.9, len * 0.55);
      const nx = -dy / (len || 1), ny = dx / (len || 1);
      const cxA = mx + nx * lift * 0.5 - (mx - cx) * 0.15;
      const cyA = my + ny * lift * 0.5 - (my - cy) * 0.35 - lift * 0.2;

      const kk = Math.min(1, k);
      const segs = 40;
      const upto = Math.floor(segs * kk);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let s = 0; s <= upto; s++) {
        const u = s / segs;
        const x = (1-u)*(1-u)*pa.x + 2*(1-u)*u*cxA + u*u*pb.x;
        const y = (1-u)*(1-u)*pa.y + 2*(1-u)*u*cyA + u*u*pb.y;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
      grad.addColorStop(0, 'rgba(123,223,242,0.0)');
      grad.addColorStop(0.5, 'rgba(123,223,242,0.9)');
      grad.addColorStop(1, 'rgba(47,181,211,0.0)');
      ctx.strokeStyle = grad;
      ctx.stroke();

      // Head glow
      if (upto < segs) {
        const u = kk;
        const x = (1-u)*(1-u)*pa.x + 2*(1-u)*u*cxA + u*u*pb.x;
        const y = (1-u)*(1-u)*pa.y + 2*(1-u)*u*cyA + u*u*pb.y;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(180,238,248,0.95)';
        ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgba(123,223,242,0.25)';
        ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      }
    }
  };

  const drawParticles = () => {
    PARTS.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(199,210,224,${0.15 * p.z})`;
      ctx.arc(p.x, p.y, 0.8 * p.z, 0, Math.PI * 2); ctx.fill();
    });
    // subtle horizontal light lines
    const now = performance.now() / 1000;
    for (let i = 0; i < 3; i++) {
      const yy = ((now * (30 + i*20)) % (H + 200)) - 100;
      const grd = ctx.createLinearGradient(0, yy, W, yy);
      grd.addColorStop(0, 'rgba(123,223,242,0)');
      grd.addColorStop(0.5, `rgba(123,223,242,${0.06 + i*0.03})`);
      grd.addColorStop(1, 'rgba(123,223,242,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, yy, W, 1);
    }
  };

  /* ---- Loop ---- */
  let last = performance.now();
  let rot = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    rot += dt * (prefersReduce ? 0 : 0.12);

    ctx.clearRect(0, 0, W, H);
    drawParticles();
    drawGlobe(rot);
    drawArcs(rot, dt);
    drawHubs(rot, now / 1000);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
