/* Showcase Patterns runtime · paulasilva-ms · v1.0.0
   - Scroll reveal (IntersectionObserver)
   - Animated counters (data-count="123")
   - Bar fill on reveal (uses --bar-pct CSS var)
*/
(function () {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  function init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      animateCounters(document);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animateCountersIn(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      observer.observe(el);
    });

    /* Bar rows that auto-set --bar-pct from data attribute */
    document.querySelectorAll('.bar-row[data-pct]').forEach(function (el) {
      var pct = parseFloat(el.getAttribute('data-pct')) || 0;
      el.style.setProperty('--bar-pct', String(Math.max(0, Math.min(1, pct))));
    });
  }

  /* Animate a single counter from 0 to its data-count target. */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = parseInt(el.getAttribute('data-dur'), 10) || 1100;
    var decimals = parseInt(el.getAttribute('data-dec'), 10) || 0;
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      el.textContent = prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
    }
    requestAnimationFrame(tick);
  }

  function animateCountersIn(scope) {
    scope.querySelectorAll('[data-count]:not(.counted)').forEach(function (el) {
      el.classList.add('counted');
      animateCounter(el);
    });
  }
  function animateCounters(scope) { animateCountersIn(scope); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
