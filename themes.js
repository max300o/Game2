'use strict';

// ── RAIN ANIMATION ──────────────────────────────
function startRain(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const drops = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    len: Math.random() * 18 + 8,
    speed: Math.random() * 6 + 4,
    opacity: Math.random() * 0.4 + 0.1,
    width: Math.random() * 1.2 + 0.3,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.len);
      ctx.strokeStyle = `rgba(80,160,255,${d.opacity})`;
      ctx.lineWidth = d.width;
      ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) {
        d.y = -d.len;
        d.x = Math.random() * canvas.width;
      }
    });

    // puddle ripples
    if (Math.random() < 0.04) {
      const rx = Math.random() * canvas.width;
      const ry = canvas.height - Math.random() * 40;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 6, 2, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(80,160,255,0.15)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ── EMBER ANIMATION ─────────────────────────────
function startEmber(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => makeParticle(canvas));

  function makeParticle(canvas) {
    return {
      x:       Math.random() * canvas.width,
      y:       canvas.height + Math.random() * 100,
      vx:      (Math.random() - 0.5) * 1.2,
      vy:      -(Math.random() * 2 + 0.8),
      size:    Math.random() * 2.5 + 0.5,
      life:    1,
      decay:   Math.random() * 0.006 + 0.003,
      hue:     Math.random() * 30 + 10,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x  += p.vx + Math.sin(Date.now() * 0.001 + i) * 0.3;
      p.y  += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10) {
        particles[i] = makeParticle(canvas);
        return;
      }

      const alpha = p.life * 0.7;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      grd.addColorStop(0, `hsla(${p.hue},100%,70%,${alpha})`);
      grd.addColorStop(1, `hsla(${p.hue},100%,40%,0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ── THEME MANAGER ───────────────────────────────
const ALL_THEMES = ['noir','blood','ghost','parchment','rain','ember'];

let rainAnim  = false;
let emberAnim = false;

function applyTheme(t, pageClass) {
  document.body.className = pageClass + ' theme-' + t;
  document.querySelectorAll('.theme-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.theme === t);
  });
  localStorage.setItem('foa_theme', t);

  // rain
  const rainCanvas = document.querySelector('.rain-canvas');
  if (rainCanvas) {
    if (t === 'rain' && !rainAnim) {
      rainAnim = true;
      startRain(rainCanvas);
    }
  }

  // ember
  const emberCanvas = document.querySelector('.ember-canvas');
  if (emberCanvas) {
    if (t === 'ember' && !emberAnim) {
      emberAnim = true;
      startEmber(emberCanvas);
    }
  }
}

function initThemes(pageClass) {
  const saved = localStorage.getItem('foa_theme') || 'noir';
  applyTheme(saved, pageClass);
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => applyTheme(dot.dataset.theme, pageClass));
  });
}
