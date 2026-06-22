/* =========================================================
   Tea N' Talk Café — Main JavaScript
   ========================================================= */

/* ---- AOS Init ---- */
const isSmallScreen = () => window.matchMedia('(max-width: 768px)').matches;

AOS.init({
  duration: isSmallScreen() ? 550 : 700,
  once: true,
  offset: isSmallScreen() ? 36 : 80,
  easing: 'ease-out-cubic',
  anchorPlacement: 'top-bottom',
});

window.addEventListener('load', () => AOS.refreshHard());
window.addEventListener('resize', () => AOS.refresh(), { passive: true });

/* =========================================================
   NAVBAR — scroll class + active link highlight
   ========================================================= */
const navbar = document.getElementById('mainNavbar');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = ['home', 'about', 'menu', 'gallery', 'reviews', 'franchise', 'faq', 'contact'];

window.addEventListener('scroll', () => {
  // Scrolled style
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });

  // Back to top
  const btn = document.getElementById('backToTop');
  btn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* Smooth scroll for all anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // close mobile menu
        const collapse = document.getElementById('navMenu');
        if (collapse && collapse.classList.contains('show')) {
          bootstrap.Collapse.getInstance(collapse)?.hide();
        }
      }
    }
  });
});

/* =========================================================
   HERO PARTICLES
   ========================================================= */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 5 + Math.random() * 10;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${60 + Math.random() * 40}%;
      animation-duration:${5 + Math.random() * 6}s;
      animation-delay:${Math.random() * 5}s;
      opacity:${0.2 + Math.random() * 0.4};
    `;
    container.appendChild(p);
  }
})();

/* =========================================================
   COUNTER ANIMATION
   ========================================================= */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let count = 0;
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { count = target; clearInterval(timer); }
    el.textContent = target >= 1000
      ? Math.floor(count / 1000) + 'K'
      : Math.floor(count);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-val').forEach(el => counterObserver.observe(el));

/* =========================================================
   MENU FILTER
   ========================================================= */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.menu-item').forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.style.transition = 'opacity .35s, transform .35s';
      if (show) {
        item.classList.remove('hidden');
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => item.classList.add('hidden'), 350);
      }
    });
  });
});

/* =========================================================
   GALLERY LIGHTBOX — Enhanced with Navigation
   ========================================================= */
const galleryImages = [];
let currentImageIndex = 0;

function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach((item, index) => {
    const fullSrc = item.dataset.full;
    if (fullSrc) {
      galleryImages.push(fullSrc);
    }
    item.addEventListener('click', () => openLightbox(fullSrc, index));
  });
}

function openLightbox(src, index = 0) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  currentImageIndex = galleryImages.indexOf(src);
  if (currentImageIndex === -1) currentImageIndex = 0;
  lbImg.src = src;
  lbImg.style.animation = 'none';
  void lbImg.offsetWidth;
  lbImg.style.animation = '';
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function navigateLightbox(direction) {
  if (galleryImages.length === 0) return;
  currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
  const lbImg = document.getElementById('lightboxImg');
  lbImg.style.opacity = '0';
  lbImg.style.transform = direction > 0 ? 'translateX(-20px)' : 'translateX(20px)';
  setTimeout(() => {
    lbImg.src = galleryImages[currentImageIndex];
    lbImg.style.opacity = '1';
    lbImg.style.transform = 'translateX(0)';
  }, 150);
}

document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
document.getElementById('lbPrev')?.addEventListener('click', () => navigateLightbox(-1));
document.getElementById('lbNext')?.addEventListener('click', () => navigateLightbox(1));

document.getElementById('lightbox')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (document.getElementById('lightbox')?.classList.contains('active')) {
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  }
});

initGalleryLightbox();

/* =========================================================
   SWIPER — Reviews Carousel
   ========================================================= */
new Swiper('.reviewSwiper', {
  loop: true,
  autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
  slidesPerView: 1,
  spaceBetween: 24,
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    640:  { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

/* =========================================================
   FORMS — Success state
   ========================================================= */
function handleForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form || !success) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('d-none');
    success.classList.remove('d-none');
    setTimeout(() => {
      success.classList.add('d-none');
      form.classList.remove('d-none');
      form.reset();
    }, 4000);
  });
}
handleForm('franchiseForm', 'franchiseSuccess');
handleForm('contactForm', 'contactSuccess');

/* =========================================================
   NAVBAR — Set initial background if at top
   ========================================================= */
if (window.scrollY <= 50) navbar.style.background = 'transparent';
