// --- ADMIN CONFIG LOAD ---
function applySavedConfig() {
  try {
    const saved = localStorage.getItem('youistic_site_config');
    const config = saved ? JSON.parse(saved) : {};
    
    // Logo replacement
    if (config.logoUrl) {
      document.querySelectorAll('.nav-logo img, footer img').forEach(img => {
        img.src = config.logoUrl;
      });
    }
    
    // Success Reels dynamic injection
    const defaultReels = [
      {
        title: "Vishnu Traders",
        subtitle: "Home & life style",
        video: "/media/reels_1_optimized.mp4"
      },
      {
        title: "Good Health",
        subtitle: "Diagnostic Center",
        video: "/media/reels_2_optimized.mp4"
      },
      {
        title: "New shop",
        subtitle: "Grocery store",
        video: "/media/reels_4_optimized.mp4"
      },
      {
        title: "Vijay Restaurant",
        subtitle: "Restaurant",
        video: "/media/reels_5_optimized.mp4"
      }
    ];
    
    const reelsContainer = document.querySelector('.reels-container');
    if (reelsContainer) {
      let reelsList = config.successReels || defaultReels;
      
      // Auto-migrate if old data or old file paths are cached
      const hasOldPaths = reelsList.some(r => r.video && r.video.includes('Reels ('));
      if (reelsList.length > 0 && (reelsList[0].title === "FinTech Scaleup" || hasOldPaths)) {
        reelsList = defaultReels;
        config.successReels = defaultReels;
        localStorage.setItem('youistic_site_config', JSON.stringify(config));
      }

      reelsContainer.innerHTML = reelsList.map(reel => `
        <div class="reel-card magnetic snap-center flex-shrink-0" data-tilt>
          <video
            class="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500 rounded-3xl"
            loop muted autoplay playsinline>
            <source src="${reel.video}" type="video/mp4">
          </video>
          <div class="reel-glow"></div>
          <div class="play-overlay">
            <svg class="w-12 h-12 text-white/50 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div class="reel-details">
            <div class="text-white font-bold text-lg">${reel.title}</div>
            <div class="text-indigo-400 text-sm font-semibold mt-1">${reel.subtitle}</div>
          </div>
        </div>
      `).join('\n');
    }
    
    // Contacts
    if (config.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.href = 'mailto:' + config.email;
        if (link.textContent.includes('@')) {
          link.textContent = config.email;
        }
      });
    }
    if (config.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = 'tel:' + config.phone.replace(/\s+/g, '');
        if (link.textContent.includes('+') || /\d/.test(link.textContent)) {
          link.textContent = config.phone;
        }
      });
    }
    if (config.address) {
      document.querySelectorAll('footer span, .glow-card p, .glow-card div').forEach(el => {
        if (el.textContent.includes('Jodhpur') || el.textContent.includes('Rajasthan')) {
          el.textContent = config.address;
        }
      });
    }
    
    // Social Links
    const socialPlatforms = ['instagram', 'twitter', 'linkedin', 'youtube'];
    socialPlatforms.forEach(plat => {
      if (config[plat]) {
        document.querySelectorAll(`a[href*="${plat}.com"]`).forEach(link => {
          link.href = config[plat];
        });
      }
    });
    
    // Main Hero Title 1 & 2 + Subtitle (Index Page)
    if (config.heroTitle1 && document.getElementById('hero-line-1')) {
      document.getElementById('hero-line-1').textContent = config.heroTitle1;
    }
    if (config.heroTitle2 && document.getElementById('hero-line-2')) {
      document.getElementById('hero-line-2').textContent = config.heroTitle2;
    }
    if (config.heroSub && document.querySelector('.hero-sub')) {
      document.querySelector('.hero-sub').textContent = config.heroSub;
    }
    
    // Websites Showcase dynamic injection
    if (config.portfolioWebsites && Array.isArray(config.portfolioWebsites)) {
      const grid = document.querySelector('.web-grid');
      if (grid) {
        grid.innerHTML = config.portfolioWebsites.map(item => {
          const tagList = (item.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
          const tagsHtml = tagList.map(tag => `<span class="bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">${tag}</span>`).join('\n');
          
          let screenContent = '';
          if (item.image && item.image.trim() !== '') {
            screenContent = `
              <img src="${item.image}" alt="${item.title}" class="browser-img" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');" />
              <div class="image-fallback hidden absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/80 to-slate-900 border-b border-indigo-500/10 p-6">
                <div class="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.54-1.037-7.614-2.766m15.228 0A11.947 11.947 0 0012 9.75c-2.905 0-5.54-.787-7.614-2.1m15.228 0A11.947 11.947 0 0112 9c-2.905 0-5.54-.537-7.614-1.433" />
                  </svg>
                </div>
                <span class="text-white font-syne text-xl font-bold tracking-wide">${item.domain}</span>
                <span class="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">LIVE PLATFORM</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity duration-500"></div>`;
          } else {
            screenContent = `
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/80 to-slate-900 border-b border-indigo-500/10 p-6">
                <div class="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.54-1.037-7.614-2.766m15.228 0A11.947 11.947 0 0012 9.75c-2.905 0-5.54-.787-7.614-2.1m15.228 0A11.947 11.947 0 0112 9c-2.905 0-5.54-.537-7.614-1.433" />
                  </svg>
                </div>
                <span class="text-white font-syne text-xl font-bold tracking-wide">${item.domain}</span>
                <span class="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">LIVE PLATFORM</span>
              </div>`;
          }

          return `
            <div class="web-card group" data-tilt>
              <div class="browser-shell shadow-2xl">
                <div class="browser-bar">
                  <span class="browser-dot red"></span>
                  <span class="browser-dot yellow"></span>
                  <span class="browser-dot green"></span>
                  <span class="browser-address">${item.domain}</span>
                </div>
                <div class="browser-screen">
                  ${screenContent}
                </div>
              </div>
              <div class="mt-5 flex justify-between items-end px-1">
                <div>
                  <h3 class="text-white font-bold text-lg font-syne">${item.title}</h3>
                  <p class="text-slate-400 text-xs mt-1.5 flex gap-2">
                    ${tagsHtml}
                  </p>
                </div>
                <a href="${item.link}" target="_blank" class="px-4 py-2 border border-indigo-500/20 hover:border-indigo-500/60 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5">
                  Launch Site <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (e) {
    console.error('Failed to apply admin configuration:', e);
  }
}
applySavedConfig();
// -------------------------

// ── Hamburger Mobile Menu ─────────────────────────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const drawer = document.getElementById('nav-drawer');
if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  // Close drawer when any link inside is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
}

// ── Lenis Smooth Scroll ──────────────────────────────────────────────────────
const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.0, smoothTouch: false });
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

// ── Custom Winding SVG Neon Pipeline ──────────────────────────────────────────
function drawPipeline() {
  const path = document.getElementById('neon-line');
  const svg = document.getElementById('neon-svg');
  if (!path || !svg) return;

  const docHeight = document.documentElement.scrollHeight;
  const docWidth = document.documentElement.clientWidth;
  
  svg.setAttribute('width', docWidth);
  svg.setAttribute('height', docHeight);

  const hero = document.getElementById('hero');
  const services = document.getElementById('services');
  const cases = document.getElementById('case-studies-wrapper');
  const contact = document.getElementById('contact');

  if (!hero || !services || !cases || !contact) return;

  const getAbsoluteCoords = (el, position = 'center') => {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    if (position === 'top') {
      return { x: rect.left + rect.width / 2 + scrollLeft, y: rect.top + scrollTop };
    }
    if (position === 'bottom') {
      return { x: rect.left + rect.width / 2 + scrollLeft, y: rect.bottom + scrollTop };
    }
    return { x: rect.left + rect.width / 2 + scrollLeft, y: rect.top + rect.height / 2 + scrollTop };
  };

  const p1 = { x: docWidth * 0.5, y: getAbsoluteCoords(hero, 'bottom').y - 100 };
  const p2 = { x: docWidth * 0.85, y: getAbsoluteCoords(services).y };
  const p3 = { x: docWidth * 0.15, y: getAbsoluteCoords(cases).y };
  const p4 = { x: docWidth * 0.5, y: getAbsoluteCoords(contact, 'top').y + 50 };

  const d = `
    M ${p1.x} ${p1.y}
    C ${docWidth * 0.5} ${p1.y + 300}, ${docWidth * 0.9} ${p2.y - 300}, ${p2.x} ${p2.y}
    C ${docWidth * 0.8} ${p2.y + 400}, ${docWidth * 0.2} ${p3.y - 400}, ${p3.x} ${p3.y}
    C ${docWidth * 0.1} ${p3.y + 500}, ${docWidth * 0.5} ${p4.y - 200}, ${p4.x} ${p4.y}
  `;

  path.setAttribute('d', d);

  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
}

window.addEventListener('load', () => {
  drawPipeline();
  const path = document.getElementById('neon-line');
  if (path) {
    const len = path.getTotalLength();
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'bottom 80%',
        end: '#contact top',
        scrub: 0.5
      }
    });
  }
});
window.addEventListener('resize', () => {
  drawPipeline();
  ScrollTrigger.refresh();
});

// ── Canvas Mouse Trail ───────────────────────────────────────────────────────
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

const trailParticles = [];
let lastMouseX = null, lastMouseY = null;

window.addEventListener('mousemove', e => {
  const dx = lastMouseX !== null ? e.clientX - lastMouseX : 0;
  const dy = lastMouseY !== null ? e.clientY - lastMouseY : 0;
  const speed = Math.sqrt(dx * dx + dy * dy);
  
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  
  if (speed > 2) {
    const count = Math.min(Math.floor(speed / 3), 4);
    for (let i = 0; i < count; i++) {
      trailParticles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.3,
        alpha: 0.7,
        size: Math.random() * 3 + 1.5,
        hue: 230 + Math.random() * 30
      });
    }
  }
});

(function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0, 0, W, H);
  for (let i = trailParticles.length - 1; i >= 0; i--) {
    const p = trailParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.015;
    p.size *= 0.98;
    if (p.alpha <= 0) {
      trailParticles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = p.alpha;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
    g.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 1)`);
    g.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
})();

// ── Custom Cursor with Magnetic Snapping ─────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let dotX = 0, dotY = 0, ringX = 0, ringY = 0, curX = 0, curY = 0;
let isHoveringMagnetic = false;
let magneticElement = null;
let snapX = 0, snapY = 0;

document.addEventListener('mousemove', e => { curX = e.clientX; curY = e.clientY; });

(function cursorLoop() {
  requestAnimationFrame(cursorLoop);
  
  let targetRingX = curX;
  let targetRingY = curY;
  
  if (isHoveringMagnetic && magneticElement) {
    targetRingX = snapX;
    targetRingY = snapY;
  }
  
  dotX += (curX - dotX) * 0.25;
  dotY += (curY - dotY) * 0.25;
  ringX += (targetRingX - ringX) * 0.12;
  ringY += (targetRingY - ringY) * 0.12;
  
  dot.style.left = dotX + 'px';
  dot.style.top = dotY + 'px';
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
})();

const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, input, select, .roi-slider');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Physics Magnetic Pull and Custom Cursor Snap on CTA, Nav Links & Reel Cards
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const centerY = r.top + r.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    
    // Warp and pull element toward mouse (large elements get less pull factor)
    const factor = el.classList.contains('reel-card') ? 0.08 : 0.35;
    gsap.to(el, { x: dx * factor, y: dy * factor, duration: 0.3, ease: 'power2.out' });
    
    // Snap cursor ring. Large cards should track mouse instead of snapping to center
    isHoveringMagnetic = true;
    magneticElement = el;
    if (el.classList.contains('reel-card')) {
      snapX = e.clientX;
      snapY = e.clientY;
    } else {
      snapX = centerX + dx * 0.12;
      snapY = centerY + dy * 0.12;
    }
  });
  
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    isHoveringMagnetic = false;
    magneticElement = null;
  });
});

// ── Glow Spotlight Card Tracker ──────────────────────────────────────────────
document.querySelectorAll('.glow-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--mouse-y', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// ── Hero Headline Characters Splitting & Parallax Scroll ──────────────────────
const line1 = document.getElementById('hero-line-1');
const line2 = document.getElementById('hero-line-2');

if (line1 && line2) {
  const splitLineText = (lineEl) => {
    const text = lineEl.textContent;
    const isClipped = lineEl.classList.contains('clip-text');
    if (isClipped) {
      lineEl.classList.remove('clip-text');
    }
    lineEl.innerHTML = text.split('').map(char => {
      if (char === ' ') return ' ';
      const extraClass = isClipped ? ' clip-text' : '';
      return `<span class="char-outer inline-block"><span class="char-inner inline-block${extraClass}" style="will-change: transform, opacity">${char}</span></span>`;
    }).join('');
  };

  splitLineText(line1);
  splitLineText(line2);

  // Initial Entrance Animation
  gsap.fromTo('#hero-line-1 .char-outer', 
    { y: '50px', opacity: 0 },
    { y: '0px', opacity: 1, stagger: 0.04, duration: 1.2, ease: 'power4.out', delay: 0.2 }
  );
  gsap.fromTo('#hero-line-2 .char-outer', 
    { y: '50px', opacity: 0 },
    { y: '0px', opacity: 1, stagger: 0.04, duration: 1.2, ease: 'power4.out', delay: 0.4 }
  );

  // Parallax link to ScrollTrigger (scrub speed link)
  gsap.to('#hero-line-1 .char-inner', {
    y: (i) => (i % 2 === 0 ? -150 : -100),
    opacity: 0,
    stagger: 0.01,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('#hero-line-2 .char-inner', {
    y: (i) => (i % 2 === 0 ? -120 : -80),
    opacity: 0,
    stagger: 0.01,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });
}

gsap.to('.hero-sub', { 
  y: -60, 
  opacity: 0, 
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 30%', scrub: 1 } 
});
gsap.to('.hero-stats', { 
  y: -40, 
  opacity: 0, 
  scrollTrigger: { trigger: '#hero', start: '20% top', end: 'bottom 30%', scrub: 1 } 
});

// ── Counter Animation ─────────────────────────────────────────────────────────
function animateCounter(el, target, prefix = '', suffix = '', isFloat = false) {
  if (!el) return;
  let current = 0;
  const inc = target / 80;
  const timer = setInterval(() => {
    current = Math.min(current + inc, target);
    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (current >= target) clearInterval(timer);
  }, 20);
}
if (document.querySelector('.stats-grid')) {
  ScrollTrigger.create({
    trigger: '.stats-grid', 
    start: 'top 85%', 
    once: true,
    onEnter: () => {
      animateCounter(document.getElementById('c1'), 99.9, '', '%', true);
      animateCounter(document.getElementById('c2'), 5000, '', '+');
      animateCounter(document.getElementById('c3'), 25, '', 'M+');
    }
  });
}

// ── Section Headers Roll-Up clipping mask ─────────────────────────────────────
gsap.utils.toArray('.section-header-inner').forEach(el => {
  gsap.to(el, { 
    y: '0%', 
    duration: 1, 
    ease: 'power4.out',
    scrollTrigger: { trigger: el.closest('.section-header'), start: 'top 85%' }
  });
});

// ── Service Cards 3D Entry Animation on Scroll ────────────────────────────────
gsap.utils.toArray('.service-card').forEach((card, i) => {
  gsap.fromTo(card, 
    { rotateY: -35, rotateX: 18, transformOrigin: "center center -80px", opacity: 0 },
    {
      rotateY: 0,
      rotateX: 0,
      opacity: 1,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 95%',
        end: 'top 70%',
        scrub: 1
      }
    }
  );
});

// ── Horizontal Case Studies Pinned Scroll ──────────────────────────────────────
const track = document.getElementById('case-studies-track');
if (track && window.innerWidth > 768) {
  const getScrollAmt = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => -getScrollAmt(),
    ease: 'none',
    scrollTrigger: {
      trigger: '#case-studies-wrapper',
      start: 'top top',
      end: () => '+=' + (getScrollAmt() + window.innerWidth * 0.4),
      scrub: 1,
      pin: '#case-studies-sticky',
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // Slide-in case study cards
  gsap.utils.toArray('.case-card').forEach((card, i) => {
    gsap.from(card, { 
      opacity: 0, 
      y: 40, 
      duration: 0.8, 
      delay: i * 0.1,
      scrollTrigger: { 
        trigger: card, 
        containerAnimation: gsap.getTweensOf(track)[0], 
        start: 'left 95%' 
      }
    });
  });
}



// ── Contact Form Entrance ────────────────────────────────────────────────────
if (document.querySelector('#contact form')) {
  gsap.from('.form-input, .contact-cta, .chip, .chips-container', {
    opacity: 0, 
    y: 25, 
    stagger: 0.08, 
    duration: 0.7, 
    ease: 'power2.out',
    scrollTrigger: { trigger: '#contact form', start: 'top 85%' }
  });
}

// ── Sticky Header background transparency ──────────────────────────────────
ScrollTrigger.create({
  start: 'top -50',
  onUpdate: self => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.background = self.progress > 0
        ? 'rgba(3,7,18,0.96)' : 'rgba(3,7,18,0.8)';
    }
  }
});

// ── Refresh on resize ─────────────────────────────────────────────────────────
window.addEventListener('resize', () => ScrollTrigger.refresh());

// ── Contact Form Submit & Validation ──────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const scopingContainer = document.getElementById('dynamic-scoping-container');
  if (scopingContainer) {
    // Initialise Multi-Step Questionnaire
    initMultiStepForm();
  } else {
    // Handle standard contact.html quick message form
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameEl = contactForm.querySelector('input[placeholder*="Connor"]') || contactForm.querySelector('input[type="text"]');
      const emailEl = contactForm.querySelector('input[type="email"]');
      const msgEl = contactForm.querySelector('textarea');
      
      if (!nameEl || !emailEl || !msgEl) return;

      const newQuickMessage = {
        name: nameEl.value,
        email: emailEl.value,
        message: msgEl.value,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Save to localStorage
      const list = JSON.parse(localStorage.getItem('youistic_quick_inquiries') || '[]');
      list.unshift(newQuickMessage);
      localStorage.setItem('youistic_quick_inquiries', JSON.stringify(list));

      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        gsap.fromTo(successMsg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
      }
      contactForm.reset();
    });
  }
}

function initMultiStepForm() {
  const budgetTemplates = {
    'IN': [
      { price: 'Under ₹8 Lakhs', value: 'Under ₹8L', desc: 'MVPs, simple integrations, custom landing configurations.' },
      { price: '₹8 Lakhs - ₹25 Lakhs', value: '₹8L - ₹25L', desc: 'SaaS portals, fully custom apps, deep multi-system automations.' },
      { price: '₹25 Lakhs+', value: '₹25L+', desc: 'Enterprise scale platforms, complex database layers, large campaigns.' }
    ],
    'CA': [
      { price: 'Under C$15k', value: 'Under C$15k', desc: 'MVPs, simple integrations, custom landing configurations.' },
      { price: 'C$15k - C$40k', value: 'C$15k - C$40k', desc: 'SaaS portals, fully custom apps, deep multi-system automations.' },
      { price: 'C$40k+', value: 'C$40k+', desc: 'Enterprise scale platforms, complex database layers, large campaigns.' }
    ],
    'US': [
      { price: 'Under $10k', value: 'Under $10k', desc: 'MVPs, simple integrations, custom landing configurations.' },
      { price: '$10k - $30k', value: '$10k - $30k', desc: 'SaaS portals, fully custom apps, deep multi-system automations.' },
      { price: '$30k+', value: '$30k+', desc: 'Enterprise scale platforms, complex database layers, large campaigns.' }
    ]
  };

  async function detectRegion() {
    let region = 'US';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data && data.country_code) {
          const code = data.country_code.toUpperCase();
          return ['IN', 'CA', 'US'].includes(code) ? code : 'US';
        }
      }
    } catch (err) {
      console.log('IP detection failed/timed out, checking timezone/locale:', err);
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || '';
      if (tz) {
        if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta')) {
          return 'IN';
        }
        if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal') || tz.includes('Calgary') || tz.includes('Edmonton') || tz.includes('Winnipeg') || tz.includes('Halifax')) {
          return 'CA';
        }
      }
      if (locale) {
        const upper = locale.toUpperCase();
        if (upper.endsWith('-IN') || upper.startsWith('HI-') || upper.startsWith('EN-IN')) {
          return 'IN';
        }
        if (upper.endsWith('-CA') || upper.startsWith('FR-CA') || upper.startsWith('EN-CA')) {
          return 'CA';
        }
      }
    } catch (e) {
      console.error('Timezone/locale fallback failed:', e);
    }
    return region;
  }

  async function applyRegionalBudget() {
    const region = await detectRegion();
    const tpl = budgetTemplates[region] || budgetTemplates['US'];
    
    const cards = document.querySelectorAll('#budget-cards-container .budget-select-card');
    cards.forEach((card, idx) => {
      const data = tpl[idx];
      if (data) {
        card.setAttribute('data-value', data.value);
        const priceEl = card.querySelector('.budget-price');
        if (priceEl) priceEl.textContent = data.price;
        const descEl = card.querySelector('.budget-desc');
        if (descEl) descEl.textContent = data.desc;
      }
    });

    // Update active selection input value to match new dynamic value of the active card
    const activeCard = document.querySelector('#budget-cards-container .budget-select-card.active');
    const input = document.getElementById('selected-budget');
    if (activeCard && input) {
      input.value = activeCard.getAttribute('data-value');
    }
  }

  // Run dynamic budget currency formatting immediately
  applyRegionalBudget();

  const scopingTemplates = {
    'Web Dev': {
      title: 'Web Features Checklist',
      subtitle: 'What elements are essential for your digital platform?',
      options: [
        { label: 'User Authentication & Login' },
        { label: 'E-Commerce / Online Store & Payments' },
        { label: 'Content Management System (CMS) / Blog' },
        { label: 'Advanced SEO & Analytics Integration' },
        { label: 'Real-time Chat / Support Messaging' },
        { label: 'Custom User/Admin Analytics Dashboard' }
      ],
      prompt: 'Describe your core vision or design inspiration (optional)'
    },
    'App Dev': {
      title: 'Mobile App Target & Features',
      subtitle: 'What ecosystem and capabilities does your application require?',
      options: [
        { label: 'iOS (Apple App Store Release)' },
        { label: 'Android (Google Play Store Release)' },
        { label: 'Push Notifications & Alerts' },
        { label: 'GPS / Location & Mapping Services' },
        { label: 'Biometrics Security (FaceID/TouchID)' },
        { label: 'In-App Subscriptions & Billing' }
      ],
      prompt: 'Describe any special device features needed (e.g. camera, Bluetooth)'
    },
    'AI Automation': {
      title: 'AI & Pipeline Objectives',
      subtitle: 'What system integrations and automated functions do you need?',
      options: [
        { label: 'Smart Customer Service AI Agent' },
        { label: 'Database Syncing & CRM Auto-Updates' },
        { label: 'Social Media Auto-posting / Scheduling' },
        { label: 'Lead Auto-Responder & Email Sequences' },
        { label: 'Web Scraping & Automated Reports' },
        { label: 'Custom Natural Language API Models' }
      ],
      prompt: 'List the platforms you need to connect (e.g., Slack, HubSpot, Gmail)'
    },
    'Growth Campaign': {
      title: 'Marketing & Production Channels',
      subtitle: 'Which media and advertising outlets do you wish to target?',
      options: [
        { label: 'Comprehensive SEO & Technical Audit' },
        { label: 'Paid PPC (Google, Meta, LinkedIn Ads)' },
        { label: 'Social Media Strategy & Management' },
        { label: 'Vertical Video Production (Shorts/Reels)' },
        { label: 'Influencer Outreach & Partnerships' },
        { label: 'Premium Copywriting & Brand Identity' }
      ],
      prompt: 'Describe your primary target customer or industry niche'
    }
  };

  let currentStep = 1;
  const totalSteps = 5;
  const form = document.getElementById('contact-form');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const stepIndicator = document.getElementById('step-indicator');
  const stepPercent = document.getElementById('step-percent');
  const progressBar = document.getElementById('form-progress-bar');
  const scopingContainer = document.getElementById('dynamic-scoping-container');

  function showStep(step) {
    document.querySelectorAll('.step-pane').forEach(p => p.classList.add('hidden'));
    const activePane = document.getElementById(`step-${step}`);
    if (!activePane) return;
    
    activePane.classList.remove('hidden');

    // GSAP Transition
    gsap.fromTo(activePane, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );

    // Update progress
    if (stepIndicator) stepIndicator.textContent = `Step ${step} of ${totalSteps}`;
    const pct = Math.round((step / totalSteps) * 100);
    if (stepPercent) stepPercent.textContent = `${pct}% Completed`;
    if (progressBar) progressBar.style.width = `${pct}%`;

    // Navigation state
    if (step === 1) {
      if (prevBtn) prevBtn.classList.add('hidden');
      if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.className = "btn-primary w-full justify-center text-sm py-3.5 cursor-none";
      }
      if (submitBtn) submitBtn.classList.add('hidden');
    } else if (step === totalSteps) {
      if (prevBtn) {
        prevBtn.classList.remove('hidden');
        prevBtn.className = "btn-secondary w-1/3 justify-center text-sm py-3.5 cursor-none";
      }
      if (nextBtn) nextBtn.classList.add('hidden');
      if (submitBtn) {
        submitBtn.classList.remove('hidden');
        submitBtn.className = "btn-primary w-2/3 justify-center text-sm py-3.5 cursor-none";
      }
      buildReviewScreen();
    } else {
      if (prevBtn) {
        prevBtn.classList.remove('hidden');
        prevBtn.className = "btn-secondary w-1/3 justify-center text-sm py-3.5 cursor-none";
      }
      if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.className = "btn-primary w-2/3 justify-center text-sm py-3.5 cursor-none";
      }
      if (submitBtn) submitBtn.classList.add('hidden');
    }
  }

  function validateStep(step) {
    let valid = true;
    
    // Clear previous highlights
    const fields = document.querySelectorAll(`#step-${step} input, #step-${step} textarea`);
    fields.forEach(f => f.classList.remove('input-error'));

    if (step === 1) {
      const name = document.getElementById('client-name');
      const email = document.getElementById('client-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !name.value.trim()) {
        if (name) name.classList.add('input-error');
        valid = false;
      }
      if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
        if (email) email.classList.add('input-error');
        valid = false;
      }
    }

    if (step === 5) {
      const refInput = document.getElementById('client-referral-code');
      const statusDiv = document.getElementById('referral-status');
      if (refInput && refInput.value.trim() !== '') {
         const code = refInput.value.trim();
         const referrals = JSON.parse(localStorage.getItem('youistic_referrals') || '[]');
         const found = referrals.find(r => r.code === code);
         
         statusDiv.classList.remove('hidden');
         if (found) {
            statusDiv.textContent = `Valid Referral! ${found.discount} discount will be applied.`;
            statusDiv.className = 'text-xs font-semibold mt-2 text-emerald-400';
         } else {
            statusDiv.textContent = `Invalid Referral Code`;
            statusDiv.className = 'text-xs font-semibold mt-2 text-rose-400';
            refInput.classList.add('input-error');
            valid = false;
         }
      } else if (statusDiv) {
         statusDiv.classList.add('hidden');
      }
    }

    if (!valid) {
      form.classList.remove('validation-shake');
      void form.offsetWidth; // Reflow
      form.classList.add('validation-shake');
      setTimeout(() => form.classList.remove('validation-shake'), 450);
    }

    return valid;
  }

  function renderScopingStep(service) {
    const tpl = scopingTemplates[service];
    if (!tpl || !scopingContainer) return;

    let html = `
      <div>
        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">${tpl.title} *</label>
        <p class="text-xs text-slate-500 mb-4">${tpl.subtitle}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="scoping-checkboxes-grid">
    `;

    tpl.options.forEach((opt, idx) => {
      html += `
        <label class="scope-checkbox-label" for="scope-opt-${idx}">
          <input type="checkbox" id="scope-opt-${idx}" name="scoping_features" value="${opt.label}" class="scope-checkbox" />
          <span class="text-xs text-slate-300 font-medium">${opt.label}</span>
        </label>
      `;
    });

    html += `
        </div>
      </div>
      <div>
        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">${tpl.prompt}</label>
        <textarea id="service-specific-text" placeholder="Please elaborate on these details..." rows="3" class="form-input" style="resize:none;"></textarea>
      </div>
    `;

    scopingContainer.innerHTML = html;

    // Attach checkbox changes
    scopingContainer.querySelectorAll('.scope-checkbox-label').forEach(lbl => {
      const chk = lbl.querySelector('.scope-checkbox');
      if (chk) {
        chk.addEventListener('change', () => {
          if (chk.checked) {
            lbl.classList.add('checked');
          } else {
            lbl.classList.remove('checked');
          }
        });
      }
    });
  }

  function buildReviewScreen() {
    const name = document.getElementById('client-name')?.value || '';
    const email = document.getElementById('client-email')?.value || '';
    const company = document.getElementById('client-company')?.value || 'N/A (Individual)';
    const service = document.getElementById('selected-service')?.value || '';
    const goal = document.getElementById('project-goal-input')?.value || '';
    const budget = document.getElementById('selected-budget')?.value || '';
    const timeline = document.getElementById('selected-timeline')?.value || '';
    const desc = document.getElementById('service-specific-text')?.value || 'No scoping comments provided.';

    const n = document.getElementById('review-profile-name');
    const e = document.getElementById('review-profile-email');
    const c = document.getElementById('review-profile-company');
    const s = document.getElementById('review-project-service');
    const g = document.getElementById('review-project-goal');
    const b = document.getElementById('review-project-budget');
    const t = document.getElementById('review-project-timeline');
    const d = document.getElementById('review-scoping-description');

    if (n) n.textContent = name;
    if (e) e.textContent = email;
    if (c) c.textContent = company;
    
    const icons = { 'Web Dev': '💻', 'App Dev': '📱', 'AI Automation': '🤖', 'Growth Campaign': '📈' };
    const servicesFull = {
      'Web Dev': 'Web Development',
      'App Dev': 'Mobile App Dev',
      'AI Automation': 'AI Automation',
      'Growth Campaign': 'Creative & Growth'
    };

    if (s) s.textContent = `${icons[service] || '🚀'} ${servicesFull[service] || service}`;
    if (g) g.textContent = `Goal: ${goal}`;
    if (b) b.textContent = budget;
    if (t) t.textContent = timeline;
    if (d) d.textContent = desc;

    // Badges scoping review
    const badgeDiv = document.getElementById('review-scoping-features');
    if (badgeDiv) {
      badgeDiv.innerHTML = '';
      const checkedBoxes = document.querySelectorAll('input[name="scoping_features"]:checked');
      if (checkedBoxes.length === 0) {
        badgeDiv.innerHTML = `<span class="bg-white/5 text-slate-500 text-[10px] px-2 py-0.5 rounded border border-white/10">No items selected</span>`;
      } else {
        checkedBoxes.forEach(box => {
          const bSpan = document.createElement('span');
          bSpan.className = 'bg-indigo-500/10 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-500/20';
          bSpan.textContent = box.value;
          badgeDiv.appendChild(bSpan);
        });
      }
    }
  }

  // Setup service card selection
  document.querySelectorAll('#service-cards-container .service-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#service-cards-container .service-select-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const val = card.getAttribute('data-value');
      const input = document.getElementById('selected-service');
      if (input) input.value = val;
      renderScopingStep(val);
    });
  });

  // Setup budget selection
  document.querySelectorAll('#budget-cards-container .budget-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#budget-cards-container .budget-select-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const input = document.getElementById('selected-budget');
      if (input) input.value = card.getAttribute('data-value');
    });
  });

  // Setup timeline selection
  document.querySelectorAll('#timeline-cards-container .timeline-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#timeline-cards-container .timeline-select-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const input = document.getElementById('selected-timeline');
      if (input) input.value = card.getAttribute('data-value');
    });
  });

  // Navigation button listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  // Initial step setup
  renderScopingStep('Web Dev');
  showStep(1);

  // Referral input live validation
  const refInput = document.getElementById('client-referral-code');
  if (refInput) {
    refInput.addEventListener('input', () => {
      const code = refInput.value.trim();
      const statusDiv = document.getElementById('referral-status');
      if (code === '') {
        statusDiv.classList.add('hidden');
        refInput.classList.remove('input-error');
        return;
      }
      const referrals = JSON.parse(localStorage.getItem('youistic_referrals') || '[]');
      const found = referrals.find(r => r.code === code);
      statusDiv.classList.remove('hidden');
      if (found) {
        statusDiv.textContent = `Valid Referral! ${found.discount} discount will be applied.`;
        statusDiv.className = 'text-xs font-semibold mt-2 text-emerald-400';
        refInput.classList.remove('input-error');
      } else {
        statusDiv.textContent = `Invalid Referral Code`;
        statusDiv.className = 'text-xs font-semibold mt-2 text-rose-400';
      }
    });
  }

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    const name = document.getElementById('client-name')?.value || '';
    const email = document.getElementById('client-email')?.value || '';
    const company = document.getElementById('client-company')?.value || 'N/A';
    const website = document.getElementById('client-website')?.value || '';
    const service = document.getElementById('selected-service')?.value || '';
    const goal = document.getElementById('project-goal-input')?.value || '';
    const budget = document.getElementById('selected-budget')?.value || '';
    const timeline = document.getElementById('selected-timeline')?.value || '';
    const dynamicDesc = document.getElementById('service-specific-text')?.value || '';
    const extraComments = document.getElementById('client-additional-comments')?.value || '';
    const referralCode = document.getElementById('client-referral-code')?.value || '';

    const selectedFeatures = [];
    document.querySelectorAll('input[name="scoping_features"]:checked').forEach(cb => {
      selectedFeatures.push(cb.value);
    });

    const servicesFull = {
      'Web Dev': 'Web Development',
      'App Dev': 'Mobile App Dev',
      'AI Automation': 'AI Automation',
      'Growth Campaign': 'Creative & Growth'
    };

    const newInquiry = {
      name,
      email,
      company,
      website,
      service: servicesFull[service] || service,
      goal,
      budget,
      timeline,
      scopingFeatures: selectedFeatures,
      scopingDesc: dynamicDesc,
      extraComments,
      referralCode,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Update referral usage count
    if (referralCode.trim() !== '') {
       let referrals = JSON.parse(localStorage.getItem('youistic_referrals') || '[]');
       let refIndex = referrals.findIndex(r => r.code === referralCode.trim());
       if (refIndex !== -1) {
          referrals[refIndex].count = (referrals[refIndex].count || 0) + 1;
          localStorage.setItem('youistic_referrals', JSON.stringify(referrals));
       }
    }

    // Save to localStorage
    const list = JSON.parse(localStorage.getItem('youistic_planner_inquiries') || '[]');
    list.unshift(newInquiry);
    localStorage.setItem('youistic_planner_inquiries', JSON.stringify(list));

    // Render success receipt
    form.innerHTML = `
      <div class="text-center py-10 space-y-6">
        <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto shadow-lg shadow-emerald-500/5">
          ✓
        </div>
        <div>
          <h3 class="text-2xl font-bold font-syne text-white tracking-wide">Roadmap locked in!</h3>
          <p class="text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            Thank you, <span class="text-indigo-400 font-semibold">${name}</span>. We've compiled your technical plan and saved it to the studio's system.
          </p>
        </div>
        <div class="p-6 bg-indigo-950/20 border border-indigo-500/15 rounded-2xl max-w-md mx-auto text-left space-y-4">
          <h4 class="text-xs uppercase font-bold tracking-widest text-slate-500 border-b border-indigo-500/10 pb-2">Plan Receipt</h4>
          <div class="text-xs space-y-1.5 text-slate-300">
            <div><span class="text-slate-500">Service:</span> ${servicesFull[service] || service}</div>
            <div><span class="text-slate-500">Goal:</span> ${goal}</div>
            <div><span class="text-slate-500">Budget:</span> ${budget}</div>
            <div><span class="text-slate-500">Timeline:</span> ${timeline}</div>
            ${referralCode ? `<div><span class="text-slate-500">Referral:</span> ${referralCode}</div>` : ''}
            ${selectedFeatures.length > 0 ? `<div><span class="text-slate-500">Selected Features:</span> ${selectedFeatures.join(', ')}</div>` : ''}
          </div>
        </div>
        <div class="pt-4 flex gap-4 max-w-md mx-auto">
          <button type="button" onclick="window.location.href='index.html'" class="btn-primary w-full justify-center text-sm py-3 cursor-none">
            Back to Homepage
          </button>
        </div>
      </div>
    `;
    
    gsap.from(form.children[0], { scale: 0.95, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' });
  });
}


// ── Badge Entrance Animation ──────────────────────────────────────────────────
const badge = document.getElementById('hero-badge');
if (badge) {
  gsap.fromTo(badge, 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.1 }
  );
}

// ── Planner Interactive Chips ────────────────────────────────────────────────
document.querySelectorAll('.chips-container').forEach(container => {
  const inputId = container.getAttribute('data-input-id');
  const hiddenInput = document.getElementById(inputId);
  if (!hiddenInput) return;

  const chips = container.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      hiddenInput.value = chip.getAttribute('data-value');

      // Subtle feedback animation
      gsap.fromTo(chip, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
    });
  });
});

// ── Success Reels Interactions ──────────────────────────────────────────────
document.querySelectorAll('.reel-card').forEach(card => {
  const video = card.querySelector('video');
  
  // 3D Tilt Effect
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const px = (x / rect.width - 0.5) * 2;
    const py = (y / rect.height - 0.5) * 2;
    
    gsap.to(card, {
      rotateX: -py * 12,
      rotateY: px * 12,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.3
    });
    
    card.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
    card.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, ease: 'elastic.out(1.1, 0.4)', duration: 0.8 });
  });

  // Force autoplay — muted videos should always autoplay
  if (video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const tryPlay = () => {
      video.play().catch(() => {
        // Retry once after user interaction if blocked
        document.addEventListener('click', () => video.play().catch(() => {}), { once: true });
      });
    };
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }
  }
});


// ── Scroll Velocity Cyber Grid Warping ─────────────────────────────────────────
const grid = document.getElementById('cyber-grid');
if (grid) {
  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity(); // Scroll speed pixels/sec
      const maxWarp = 0.12; 
      const warpFactor = Math.min(Math.abs(velocity) / 3000, maxWarp);
      const skewValue = (velocity > 0 ? 1 : -1) * warpFactor * 6;
      const scaleValue = 1 + warpFactor * 0.1;
      const speedOffset = -velocity * 0.03;
      
      gsap.to(grid, {
        skewY: skewValue,
        scaleY: scaleValue,
        y: speedOffset,
        overwrite: 'auto',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  });
}


// ── Stacked Reels Carousel for Mobile ───────────────────────────────────────
function initReelsStack() {
  const container = document.querySelector('.reels-container');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll('.reel-card'));
  if (cards.length === 0) return;

  let activeIndex = 0;
  let intervalId = null;

  function updateStack() {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      // Clear all stack classes on desktop
      cards.forEach(card => {
        card.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2', 'stack-prev');
      });
      return;
    }

    // Apply classes for mobile stack
    cards.forEach((card, idx) => {
      const relIdx = (idx - activeIndex + cards.length) % cards.length;

      card.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2', 'stack-prev');
      
      if (relIdx === 0) {
        card.classList.add('stack-active');
      } else if (relIdx === 1) {
        card.classList.add('stack-behind-1');
      } else if (relIdx === cards.length - 1) {
        card.classList.add('stack-prev');
      } else {
        card.classList.add('stack-behind-2');
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(() => {
      if (window.innerWidth <= 768) {
        activeIndex = (activeIndex + 1) % cards.length;
        updateStack();
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Swipe gesture support on mobile
  let startX = 0;
  let startY = 0;
  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    if (window.innerWidth > 768) return;
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;
    
    // Only trigger if horizontal swipe is larger than vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe right -> previous card
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      } else {
        // Swipe left -> next card
        activeIndex = (activeIndex + 1) % cards.length;
      }
      updateStack();
      startAutoplay(); // Reset timer
    }
  }, { passive: true });

  // Handle click on behind cards to switch to them
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      if (idx !== activeIndex) {
        e.preventDefault();
        e.stopPropagation();
        activeIndex = idx;
        updateStack();
        startAutoplay(); // Reset timer
      }
    });
  });

  window.addEventListener('resize', () => {
    updateStack();
    if (window.innerWidth <= 768) {
      if (!intervalId) startAutoplay();
    } else {
      stopAutoplay();
    }
  });

  // Init
  updateStack();
  if (window.innerWidth <= 768) {
    startAutoplay();
  }
}

// Initialize the stacked reels
initReelsStack();


// ── Stacked Featured Work Carousel for Mobile ───────────────────────────────
function initWebShowcaseStack() {
  const container = document.querySelector('.web-grid');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll('.web-card'));
  if (cards.length === 0) return;

  let activeIndex = 0;
  let intervalId = null;

  function updateStack() {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      // Clear all stack classes on desktop
      cards.forEach(card => {
        card.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2', 'stack-prev');
      });
      return;
    }

    // Apply classes for mobile stack
    cards.forEach((card, idx) => {
      const relIdx = (idx - activeIndex + cards.length) % cards.length;

      card.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2', 'stack-prev');
      
      if (relIdx === 0) {
        card.classList.add('stack-active');
      } else if (relIdx === 1) {
        card.classList.add('stack-behind-1');
      } else if (relIdx === cards.length - 1) {
        card.classList.add('stack-prev');
      } else {
        card.classList.add('stack-behind-2');
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(() => {
      if (window.innerWidth <= 768) {
        activeIndex = (activeIndex + 1) % cards.length;
        updateStack();
      }
    }, 5000);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Swipe gesture support on mobile
  let startX = 0;
  let startY = 0;
  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', e => {
    if (window.innerWidth > 768) return;
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;
    
    // Only trigger if horizontal swipe is larger than vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe right -> previous card
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      } else {
        // Swipe left -> next card
        activeIndex = (activeIndex + 1) % cards.length;
      }
      updateStack();
      startAutoplay(); // Reset timer
    }
  }, { passive: true });

  // Handle click on behind cards to switch to them
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      if (idx !== activeIndex) {
        e.preventDefault();
        e.stopPropagation();
        activeIndex = idx;
        updateStack();
        startAutoplay(); // Reset timer
      }
    });
  });

  window.addEventListener('resize', () => {
    updateStack();
    if (window.innerWidth <= 768) {
      if (!intervalId) startAutoplay();
    } else {
      stopAutoplay();
    }
  });

  // Init
  updateStack();
  if (window.innerWidth <= 768) {
    startAutoplay();
  }
}

// Initialize the stacked showcase
initWebShowcaseStack();

