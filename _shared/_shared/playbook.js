/* Playbook chrome + closing injector · paulasilva-ms · v2.0.0
   Each playbook page sets window.PLAYBOOK_DATA = { topicLabel, slug, nextLabel:{...}, nextHref }
   Then loads this script. It injects chrome at top and closing at end of body.
*/
(function(){
  const D = window.PLAYBOOK_DATA || { topicLabel: 'Playbook' };

  function tri(o){
    if (!o) return '';
    return `<span data-lang="en" class="lang-active">${o.en||''}</span>`
         + `<span data-lang="pt-br">${o['pt-br']||o.pt||o.en||''}</span>`
         + `<span data-lang="es">${o.es||o.en||''}</span>`;
  }

  // === Chrome ===
  const chrome = document.createElement('div');
  chrome.innerHTML = `
    <a class="deck-brand" href="../index.html" title="Back to hub">
      <div class="deck-brand__squares" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <span class="deck-brand__text">Paula Silva | Software Global Black Belt · ${D.topicLabel}</span>
    </a>
    <div class="lang-switcher" role="group" aria-label="Language">
      <button class="lang-switcher__btn" data-locale="en">EN</button>
      <button class="lang-switcher__btn" data-locale="pt-br">PT</button>
      <button class="lang-switcher__btn" data-locale="es">ES</button>
    </div>
    <div class="deck-controls">
      <a class="deck-controls__btn" href="landing.html" title="Back to landing">
        <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span data-lang="en" class="lang-active">Landing</span><span data-lang="pt-br">Landing</span><span data-lang="es">Landing</span>
      </a>
      <a class="deck-controls__btn" href="../index.html" title="Back to hub">
        <svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>
        <span data-lang="en" class="lang-active">Hub</span><span data-lang="pt-br">Hub</span><span data-lang="es">Hub</span>
      </a>
      <button class="deck-controls__btn deck-controls__btn--theme" id="theme-toggle" title="Toggle theme">
        <svg class="theme-icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        <svg class="theme-icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      </button>
    </div>
  `;
  document.body.insertBefore(chrome, document.body.firstChild);

  // === Closing ===
  const closing = document.createElement('section');
  closing.className = 'closing';
  const nextLabel = D.nextLabel || { en:'Next topic', 'pt-br':'Próximo tema', es:'Siguiente tema' };
  const nextHref = D.nextHref || '../index.html';
  closing.innerHTML = `
    <div class="closing__container">
      <div class="closing__brand">
        <div class="closing__brand-squares" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        <span>Paula Silva | Software Global Black Belt</span>
      </div>
      <h2 class="closing__title">${tri({
        en: 'Start with the platform, not the agents.',
        'pt-br': 'Comece pela plataforma, não pelos agentes.',
        es: 'Comience por la plataforma, no por los agentes.'
      })}</h2>
      <p class="closing__tagline">Building the future of software development with AI and Agentic DevOps.</p>
      <div class="closing__role">${D.topicLabel} · ${tri({en:'End of playbook','pt-br':'Fim do playbook',es:'Fin del playbook'})}</div>
      <div class="closing__cta">
        <a href="../index.html" class="closing__btn closing__btn--primary">
          <svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div class="closing__btn-label">${tri({en:'Return to','pt-br':'Voltar para',es:'Volver al'})}<span class="closing__btn-value">${tri({en:'Knowledge Hub','pt-br':'Hub de Conhecimento',es:'Hub de Conocimiento'})}</span></div>
        </a>
        <a href="${nextHref}" class="closing__btn">
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div class="closing__btn-label">${tri({en:'Continue with','pt-br':'Continuar com',es:'Continuar con'})}<span class="closing__btn-value">${tri(nextLabel)}</span></div>
        </a>
        <a href="mailto:paulasilva@microsoft.com" class="closing__btn">
          <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M22 7l-10 6L2 7" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>
          <div class="closing__btn-label">${tri({en:'Contact','pt-br':'Contato',es:'Contacto'})}<span class="closing__btn-value">paulasilva@microsoft.com</span></div>
        </a>
      </div>
      <div class="closing__meta">
        <span>paulasilva · 2026-05-06</span>
        <span>${D.topicLabel} · v1.0.0</span>
      </div>
    </div>
  `;
  document.body.appendChild(closing);

  // === Behaviors ===
  // Theme
  const root = document.documentElement;
  const saved = localStorage.getItem('psms-theme');
  if (saved) root.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('psms-theme', next);
  });

  // i18n
  const supported = ['en','pt-br','es'];
  let lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('psms-lang') || (navigator.language||'en').toLowerCase();
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
      if (isActive) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current');
    });
    localStorage.setItem('psms-lang', l);
  }
  applyLang(lang);
  document.querySelectorAll('[data-locale]').forEach(b => {
    b.addEventListener('click', () => applyLang(b.getAttribute('data-locale')));
  });
})();
