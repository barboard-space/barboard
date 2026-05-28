(function () {
  'use strict';

  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    // Nav backdrop: scrolled state
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // Mobile drawer
    var btn = document.getElementById('navMenuBtn');
    var drawer = document.getElementById('navDrawer');
    if (!btn || !drawer) return;

    var savedScrollY = 0;

    function openDrawer() {
      savedScrollY = window.scrollY;
      nav.classList.add('nav--open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + savedScrollY + 'px';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      });
    }

    function closeDrawer() {
      nav.classList.remove('nav--open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, savedScrollY);
      document.documentElement.style.scrollBehavior = '';
    }

    btn.addEventListener('click', function () {
      if (nav.classList.contains('nav--open')) { closeDrawer(); } else { openDrawer(); }
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Fetch and inject nav + footer partials, then init
  var navEl = document.getElementById('site-nav');
  var footerEl = document.getElementById('site-footer');

  Promise.all([
    navEl    ? fetch('/partials/nav.html').then(function (r) { return r.text(); }).catch(function () { return ''; }) : Promise.resolve(''),
    footerEl ? fetch('/partials/footer.html').then(function (r) { return r.text(); }).catch(function () { return ''; }) : Promise.resolve('')
  ]).then(function (results) {
    if (navEl    && results[0]) { navEl.outerHTML    = results[0]; }
    if (footerEl && results[1]) { footerEl.outerHTML = results[1]; }
    initNav();
    initBackToTop();
  });
})();
