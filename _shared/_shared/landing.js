/* paulasilva-ms shared landing JS · v2.0.0 · 2026-05-06 */
(function(){
  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('psms-theme');
  if (saved) root.setAttribute('data-theme', saved);
  const tt = document.getElementById('theme-toggle');
  if (tt) tt.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('psms-theme', next);
  });
})();

(function(){
  // i18n: locales = en | pt-br | es
  const supported = ['en','pt-br','es'];
  const params = new URLSearchParams(location.search);
  let lang = params.get('lang') || localStorage.getItem('psms-lang') || (navigator.language||'en').toLowerCase();
  if (lang.startsWith('pt')) lang = 'pt-br';
  else if (lang.startsWith('es')) lang = 'es';
  else lang = 'en';
  if (!supported.includes(lang)) lang = 'en';

  function applyLang(l){
    document.documentElement.setAttribute('lang', l === 'pt-br' ? 'pt-BR' : l);
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.classList.toggle('lang-active', el.getAttribute('data-lang') === l);
    });
    document.querySelectorAll('[data-locale]').forEach(b => {
      const isActive = b.getAttribute('data-locale') === l;
      if (isActive) b.setAttribute('aria-current','true');
      else b.removeAttribute('aria-current');
    });
    localStorage.setItem('psms-lang', l);
  }
  applyLang(lang);
  document.querySelectorAll('[data-locale]').forEach(b => {
    b.addEventListener('click', () => applyLang(b.getAttribute('data-locale')));
  });
})();
