/* ================================================================
   FBC Concord — Global JavaScript
   Mobile menu, scroll-triggered animations.
   ================================================================ */

(function() {
  // ── Mobile Menu Toggle ──
  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var isOpen = false;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      isOpen = !isOpen;
      nav.classList.toggle('open', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        isOpen = false;
        nav.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll-Triggered Fade-In Animations ──
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(function(el) {
    observer.observe(el);
  });
})();
