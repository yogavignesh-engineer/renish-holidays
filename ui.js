'use strict';

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
const navbar = document.getElementById('navbar');
const navBookBtn = document.getElementById('nav-book-btn');
window.addEventListener('scroll', () => {
  const s = window.scrollY > 60;
  navbar.classList.toggle('scrolled', s);
  if (navBookBtn) navBookBtn.style.display = s ? 'inline-flex' : 'none';
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

function toggleMenu(force) {
  menuOpen = force !== undefined ? force : !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  burgerBtn.classList.toggle('open', menuOpen);
  burgerBtn.setAttribute('aria-expanded', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}
burgerBtn.addEventListener('click', () => toggleMenu());
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });

/* ============================================================
   INTERSECTION OBSERVER REVEALS
   ============================================================ */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObs.observe(el));





/* ============================================================
   PASSENGER COUNTER (Package Builder)
   ============================================================ */
let paxVal = 4;
const paxDisplay = document.getElementById('pax-val');
const paxInput = document.getElementById('b-pax');
document.getElementById('pax-minus').addEventListener('click', () => {
  if (paxVal > 1) { paxVal--; paxDisplay.textContent = paxVal; paxInput.value = paxVal; }
});
document.getElementById('pax-plus').addEventListener('click', () => {
  if (paxVal < 10) { paxVal++; paxDisplay.textContent = paxVal; paxInput.value = paxVal; }
});

/* ============================================================
   PACKAGE BUILDER FORM → WHATSAPP
   ============================================================ */
document.getElementById('package-builder-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const dest = document.getElementById('b-destination').value || 'Not specified';
  const days = document.getElementById('b-days').value;
  const vehicle = document.getElementById('b-vehicle').value || 'Not specified';
  const pax = document.getElementById('b-pax').value;
  const date = document.getElementById('b-date').value || 'Flexible';
  const name = document.getElementById('b-name').value || 'Customer';
  const phone = document.getElementById('b-phone').value || 'Not provided';
  const notes = document.getElementById('b-notes').value || '';
  const msg = encodeURIComponent(
    `Hi Renish Holidays! 🙏\n\n` +
    `I want to book a custom tour package:\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📍 Destination: ${dest}\n` +
    `📅 No. of Days: ${days} day${days > 1 ? 's' : ''}\n` +
    `🚗 Vehicle: ${vehicle}\n` +
    `👥 Passengers: ${pax}\n` +
    `🗓️ Travel Date: ${date}\n` +
    (notes ? `📝 Notes: ${notes}\n` : '') +
    `\nPlease share the package details and pricing. Thank you!`
  );
  window.open(`https://wa.me/919894395472?text=${msg}`, '_blank');
});

/* ============================================================
   CONTACT FORM → WHATSAPP / SIMULATED
   ============================================================ */
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  const dest = document.getElementById('c-destination').value || 'Not specified';
  const msg_text = document.getElementById('c-message').value.trim();
  if (!name || !phone) { alert('Please fill in your name and phone number.'); return; }
  const btn = document.getElementById('contact-submit');
  btn.textContent = 'Sending…'; btn.disabled = true;
  // Redirect to WhatsApp with pre-filled message
  const msg = encodeURIComponent(
    `Hi Renish Holidays! 🙏\n\nContact form submission:\n\n` +
    `👤 Name: ${name}\n📞 Phone: ${phone}\n📍 Interested In: ${dest}\n` +
    (msg_text ? `💬 Message: ${msg_text}` : '')
  );
  setTimeout(() => {
    window.open(`https://wa.me/919894395472?text=${msg}`, '_blank');
    document.getElementById('contact-success').classList.add('show');
    document.getElementById('contact-form').style.display = 'none';
  }, 600);
});

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const track = document.getElementById('test-track');
const cards = track.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('test-dots');
let testIdx = 0;
let testCols = 1;

function getTestCols() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function buildTestDots() {
  const total = Math.ceil(cards.length / testCols);
  dotsContainer.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'slider-dot' + (i === testIdx ? ' active' : '');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.setAttribute('role', 'tab');
    btn.addEventListener('click', () => goTest(i));
    dotsContainer.appendChild(btn);
  }
}

function goTest(idx) {
  const total = Math.ceil(cards.length / testCols);
  testIdx = ((idx % total) + total) % total;
  const pct = (testIdx * testCols / cards.length) * 100;
  track.style.transform = `translateX(-${pct}%)`;
  dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === testIdx));
}

function initTestimonials() {
  testCols = getTestCols();
  buildTestDots();
  testIdx = 0;
  track.style.transform = 'translateX(0)';
  // Set flex widths
  cards.forEach(c => {
    const gap = testCols > 1 ? 1 : 0;
    c.style.flex = `0 0 calc(${100 / testCols}% - ${gap}rem)`;
  });
}

document.getElementById('test-prev').addEventListener('click', () => goTest(testIdx - 1));
document.getElementById('test-next').addEventListener('click', () => goTest(testIdx + 1));

window.addEventListener('resize', () => {
  const newCols = getTestCols();
  if (newCols !== testCols) { testCols = newCols; initTestimonials(); }
}, { passive: true });
initTestimonials();

// Auto-advance
setInterval(() => goTest(testIdx + 1), 5000);

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
// Handled by lenis/native anchor below inside the module
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   VEHICLE PHOTOS - Try to load actual client vehicle photos
   ============================================================ */
// The placeholder SVGs will show until actual photos are placed
// To use real photos: replace the src attribute with actual image paths
// e.g., src="public/etios.jpg" or src="public/xylo.jpg"

