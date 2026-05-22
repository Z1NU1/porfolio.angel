/* ─── SCRAMBLE LOADER ───────────────────────────────────────────────── */
const CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&*%$';
const TARGET = 'ANGEL USI';
const ldWord = document.getElementById('ldWord');
const ldFill = document.getElementById('ldFill');
const ldPct  = document.getElementById('ldPct');
const loader = document.getElementById('loader');

let resolved = 0;

function scrambleFrame() {
  let html = '';
  for (let i = 0; i < TARGET.length; i++) {
    if (TARGET[i] === ' ') { html += '&nbsp;'; continue; }
    if (i < resolved) {
      html += `<span class="teal">${TARGET[i]}</span>`;
    } else {
      html += `<span class="dim">${CHARS[Math.floor(Math.random() * CHARS.length)]}</span>`;
    }
  }
  ldWord.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.matchMedia('(max-width: 650px)').matches;
  const scrambleDelay = isMobile ? 35 : 55;
  const resolveDelay  = isMobile ? 140 : 220;
  const pctDelay      = isMobile ? 36 : 55;
  const loaderDuration = isMobile ? 1600 : 3000;
  const loaderFadeDelay = isMobile ? 350 : 650;

  requestAnimationFrame(() => { ldFill.style.width = '100%'; });

  const scramble = setInterval(scrambleFrame, scrambleDelay);

  const resolve = setInterval(() => {
    resolved++;
    if (resolved >= TARGET.length) clearInterval(resolve);
  }, resolveDelay);

  let pct = 0;
  const pctTick = setInterval(() => {
    pct = Math.min(pct + 2, 100);
    ldPct.textContent = pct + '%';
    if (pct >= 100) clearInterval(pctTick);
  }, pctDelay);

  setTimeout(() => {
    clearInterval(scramble);
    ldWord.innerHTML = '<span class="teal">ANGEL</span>&nbsp;<span class="teal">USI</span>';
    setTimeout(() => {
      loader.classList.add('gone');
      startTypewriter();
    }, loaderFadeDelay);
  }, loaderDuration);
});

/* ─── TYPEWRITER HERO ───────────────────────────────────────────────── */
const TYPE_STR = 'BSIT Student · Visual Creator · Problem Solver';
const hType    = document.getElementById('hType');

function startTypewriter() {
  let i = 0;
  hType.innerHTML = '<span class="blink"></span>';
  const t = setInterval(() => {
    hType.innerHTML = TYPE_STR.slice(0, i) + '<span class="blink"></span>';
    i++;
    if (i > TYPE_STR.length) clearInterval(t);
  }, 48);
}

/* ─── SCROLL PROGRESS ───────────────────────────────────────────────── */
const pgBar = document.getElementById('pg-bar');
window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - innerHeight;
  pgBar.style.width = ((scrollY / max) * 100) + '%';
}, { passive: true });

/* ─── CUSTOM CURSOR ─────────────────────────────────────────────────── */
const cur     = document.getElementById('cur');
const curRing = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function loopRing() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  curRing.style.left = rx + 'px'; curRing.style.top = ry + 'px';
  requestAnimationFrame(loopRing);
})();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('on-link'));
  el.addEventListener('mouseleave', () => cur.classList.remove('on-link'));
});

/* ─── OVERLAY NAV ───────────────────────────────────────────────────── */
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');
const menuLbl = document.getElementById('menuLbl');

menuBtn.addEventListener('click', () => {
  const open = overlay.classList.toggle('open');
  menuBtn.classList.toggle('open');
  menuLbl.textContent = open ? 'CLOSE' : 'MENU';
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeOv() {
  overlay.classList.remove('open');
  menuBtn.classList.remove('open');
  menuLbl.textContent = 'MENU';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOv(); });

/* ─── SCROLL REVEALS ────────────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = +entry.target.dataset.delay || 0;
    setTimeout(() => entry.target.classList.add('vis'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 5) * 90;
  revealObs.observe(el);
});

/* ─── SKILL RINGS ───────────────────────────────────────────────────── */
const C = 2 * Math.PI * 29;

document.querySelectorAll('.r-fill').forEach(ring => {
  ring.style.strokeDasharray  = C;
  ring.style.strokeDashoffset = C;
});

const ringObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animRings();
    ringObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const ringGrid = document.getElementById('ringGrid');
if (ringGrid) ringObs.observe(ringGrid);

function animRings() {
  document.querySelectorAll('.r-fill').forEach(ring => {
    const pct = +ring.dataset.p;
    setTimeout(() => {
      ring.style.strokeDashoffset = C - (pct / 100) * C;
    }, 150);
  });

  document.querySelectorAll('.r-pct').forEach(el => {
    const target = +el.dataset.v;
    let n = 0;
    const step = target / 64;
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = Math.round(n) + '%';
      if (n >= target) clearInterval(t);
    }, 24);
  });
}

/* ─── DRAG-SCROLL PROJECTS ──────────────────────────────────────────── */
const ps = document.getElementById('projScroll');
if (ps) {
  let down = false, startX, scrollL;
  ps.addEventListener('mousedown',  e => { down = true; startX = e.pageX - ps.offsetLeft; scrollL = ps.scrollLeft; });
  ps.addEventListener('mouseleave', () => down = false);
  ps.addEventListener('mouseup',    () => down = false);
  ps.addEventListener('mousemove',  e => {
    if (!down) return; e.preventDefault();
    ps.scrollLeft = scrollL - (e.pageX - ps.offsetLeft - startX) * 1.4;
  });
}

/* ─── 3D TILT ON PROJECT CARDS ─────────────────────────────────────── */
document.querySelectorAll('.p-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2;
    const dx = e.clientX - r.left - cx;
    const dy = e.clientY - r.top  - cy;
    card.style.transform = `perspective(900px) rotateX(${(-dy/cy)*5}deg) rotateY(${(dx/cx)*5}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
  });
});
