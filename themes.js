'use strict';

// ── AMBIENT ATMOSPHERE ──────────────────────────────
// One slow drift of warm gold ash/dust. Always on. No buttons,
// no switching, no localStorage — there is only one theme now.
function startAtmosphere(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 55 }, () => makeParticle(canvas));

  function makeParticle(canvas) {
    return {
      x:     Math.random() * canvas.width,
      y:     canvas.height + Math.random() * 100,
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    -(Math.random() * 0.45 + 0.12),
      size:  Math.random() * 1.6 + 0.4,
      life:  1,
      decay: Math.random() * 0.002 + 0.001,
      hue:   Math.random() * 22 + 32, // warm gold/amber, matches --accent
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx + Math.sin(Date.now() * 0.0005 + i) * 0.12;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -10) {
        particles[i] = makeParticle(canvas);
        return;
      }

      const alpha = p.life * 0.32;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.2);
      grd.addColorStop(0, `hsla(${p.hue},75%,62%,${alpha})`);
      grd.addColorStop(1, `hsla(${p.hue},75%,40%,0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
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

function initAtmosphere() {
  const canvas = document.querySelector('.atmosphere-canvas');
  if (canvas) startAtmosphere(canvas);
}
