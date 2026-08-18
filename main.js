import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//   SMOOTH SCROLL (LENIS)
// ============================================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Keep GSAP ScrollTrigger in sync with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      lenis.scrollTo(targetElement);
      // Close mobile menu if open
      if (document.getElementById('mobile-menu').classList.contains('active')) {
        document.getElementById('burger-btn').click();
      }
    }
  });
});

// ============================================================
//   INTRO LOADER ANIMATION
// ============================================================
lenis.stop();
document.body.style.overflow = 'hidden';

const percentEl = document.getElementById('loader-percent');
const progressFill = document.getElementById('loader-progress-fill');
const loaderText = document.getElementById('loader-text');
const curtain = document.getElementById('loader-curtain');
const heroBgInner = document.getElementById('hero-bg-inner');

// Setup initial states
gsap.set(heroBgInner, { scale: 1.3 });
gsap.set('.reveal-text', { yPercent: 110 });

const tlLoader = gsap.timeline({
  onComplete: () => {
    if (curtain) curtain.style.display = 'none';
    lenis.start();
    document.body.style.overflow = '';
  }
});

const progressObj = { val: 0 };

tlLoader
  .to(loaderText, { opacity: 1, duration: 1, ease: 'power2.out' })
  .to(progressObj, {
    val: 100,
    duration: 2,
    ease: 'power3.inOut',
    onUpdate: () => {
      if (percentEl) {
        percentEl.innerText = Math.round(progressObj.val) + '%';
        const scale = 1 + (progressObj.val / 100) * 0.2;
        percentEl.style.transform = `scale(${scale})`;
      }
      if (progressFill) {
        progressFill.style.transform = `scaleX(${progressObj.val / 100})`;
      }
    }
  }, '<')
  .to('.loader-percent', { opacity: 1, duration: 0.5, ease: 'none' }, 0)
  // Explode / Fade out loader content
  .to('.loader-content', { scale: 1.5, opacity: 0, duration: 0.8, ease: 'power3.in' }, '+=0.2')
  .to('.loader-progress-bar', { opacity: 0, duration: 0.4 }, '<')
  // Reveal Curtain
  .to(curtain, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '<0.2')
  // Hero Image zoom out
  .to(heroBgInner, { scale: 1, duration: 2.5, ease: 'power3.out' }, '<0.2')
  // Hero Typography
  .to('.reveal-text', {
    yPercent: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power4.out'
  }, '<0.5')
  // Hero Bottom Elements
  .fromTo('.hero-tagline', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    '<0.6'
  )
  .fromTo('.hero-dest-slider', 
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
    '<0.2'
  )
  .fromTo('.hero-stat-card', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    '<0.2'
  );

// Hero Parallax
gsap.to('.hero-bg-inner', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

// ============================================================
//   HORIZONTAL SCROLL TIMELINE
// ============================================================
const track = document.getElementById('timeline-track');
if (track) {
  gsap.to(track, {
    x: () => -(track.scrollWidth - document.documentElement.clientWidth) + "px",
    ease: "none",
    scrollTrigger: {
      trigger: "#timeline",
      pin: true,
      scrub: 1,
      start: "center center",
      end: () => "+=" + track.scrollWidth
    }
  });
}



// ============================================================
//   MAGNETIC BUTTONS
// ============================================================
const magneticButtons = document.querySelectorAll('.btn');
magneticButtons.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  });
});

// ============================================================
//   MOBILE MENU (from ui.js)
// ============================================================
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    burgerBtn.setAttribute('aria-expanded', menuOpen);
    
    if (menuOpen) {
      mobileMenu.classList.add('active');
      gsap.to(mobileMenu, { opacity: 1, visibility: 'visible', duration: 0.3 });
    } else {
      mobileMenu.classList.remove('active');
      gsap.to(mobileMenu, { opacity: 0, visibility: 'hidden', duration: 0.3 });
    }
  });
}

// Navbar scroll class
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
});

