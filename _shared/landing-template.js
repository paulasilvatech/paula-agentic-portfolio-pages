/* Landing template renderer · paulasilva-ms · v2.0.0
   Aligned with deck chrome pattern.

   PAGE_DATA shape:
   {
     topicNumber, topicLabel,           // shown in chrome bar
     topicSlug,                         // url-safe
     accent: 'blue|green|yellow|red|ink',
     existingDeck, existingPlaybook,
     hero: { eyebrow:{en,'pt-br',es}, title:{...}, subtitle:{...} },
     heroArt: '<svg>...</svg>',
     stats: [{num,label}], pillars: [{num,title,desc}],
     formats: [{kicker,accent,title,desc,meta,href}],
     crosslinks: [{accent,kicker,title,hint,href}],
     closing: { title:{...}, accentWord:{...} } // optional
   }
*/
(function(){
  if (!window.PAGE_DATA) return;
  const D = window.PAGE_DATA;

  function tri(o){
    if (!o) return '';
    return `<span data-lang="en" class="lang-active">${o.en||''}</span>`
         + `<span data-lang="pt-br">${o['pt-br']||o.pt||o.en||''}</span>`
         + `<span data-lang="es">${o.es||o.en||''}</span>`;
  }

  const role = D.role || "Software Global Black Belt";
  const chromeText = `Paula Silva | ${role} · ${D.topicLabel}`;

  function statHTML(s){
    return `<div class="stat"><div class="stat__num">${s.num}</div><div class="stat__label">${tri(s.label)}</div></div>`;
  }
  function pillarHTML(p){
    return `<div class="pillar" data-accent="${p.accent||D.accent}">
      <div class="pillar__num">${p.num}</div>
      <div class="pillar__title">${tri(p.title)}</div>
      <p class="pillar__desc">${tri(p.desc)}</p>
    </div>`;
  }
  function fmtHTML(f){
    return `<a href="${f.href}" class="fmt" data-accent="${f.accent||D.accent}"${f.href && /Deck/i.test(f.href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>
      <div class="fmt__accent"></div>
      <div class="fmt__body">
        <span class="fmt__kicker">${f.kicker}</span>
        <h3 class="fmt__title">${tri(f.title)}</h3>
        <p class="fmt__desc">${tri(f.desc)}</p>
        <div class="fmt__meta">
          <span>${tri(f.meta)}</span>
          <span class="fmt__arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
        </div>
      </div>
    </a>`;
  }
  function clHTML(c){
    return `<a href="${c.href}" class="crosslink" data-accent="${c.accent}">
      <div class="crosslink__kicker">${c.kicker}</div>
      <div class="crosslink__title">${tri(c.title)}</div>
      <p class="crosslink__hint">${tri(c.hint)}</p>
    </a>`;
  }

  const root = document.getElementById('landing-root');
  if (!root) return;

  const closingTitle = (D.closing && D.closing.title) || {
    en: 'Start with the platform, not the agents.',
    'pt-br': 'Comece pela plataforma, não pelos agentes.',
    es: 'Comience por la plataforma, no por los agentes.'
  };

  root.innerHTML = `
  <div class="hub-topbar" aria-hidden="true"></div>
  <a class="deck-brand" href="../index.html" title="Back to hub">
    <img class="deck-brand__logo" src="../_shared/paulasilva-logo.png" alt="Paula Silva" aria-hidden="true">
    <span class="deck-brand__text">${chromeText}</span>
  </a>

  <div class="lang-switcher" role="group" aria-label="Language">
    <button class="lang-switcher__btn" data-locale="en">EN</button>
    <button class="lang-switcher__btn" data-locale="pt-br">PT</button>
    <button class="lang-switcher__btn" data-locale="es">ES</button>
  </div>

  <div class="deck-controls">
    <a class="deck-controls__btn" href="../index.html" title="Back to hub">
      <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      <span data-lang="en" class="lang-active">Hub</span><span data-lang="pt-br">Hub</span><span data-lang="es">Hub</span>
    </a>
    <button class="deck-controls__btn deck-controls__btn--theme" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
      <svg class="theme-icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      <svg class="theme-icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" fill="none"/></svg>
    </button>
  </div>

  <section class="hero">
    <div class="container">
      <div class="hero__grid">
        <div>
          <div class="hero__eyebrow"><span class="dot"></span>${tri(D.hero.eyebrow)}</div>
          <h1 class="hero__title">${tri(D.hero.title)}</h1>
          <p class="hero__subtitle">${tri(D.hero.subtitle)}</p>
          <div class="hero__cta">
            ${D.existingDeck ? `<a href="${D.existingDeck}" class="btn btn--primary"${/^https?:\/\//i.test(D.existingDeck) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${tri(D.heroDeckLabel||{en:'Open the deck','pt-br':'Abrir o deck',es:'Abrir el deck'})} <svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>` : ''}
            ${D.existingPlaybook ? `<a href="${D.existingPlaybook}" class="btn btn--ghost">${tri(D.heroPlaybookLabel||{en:'Read the playbook','pt-br':'Ler o playbook',es:'Leer el playbook'})}</a>` : ''}
          </div>
        </div>
        <div class="hero__art">${D.heroArt || ''}</div>
      </div>
    </div>
  </section>

  ${D.stats ? `<section class="section section--alt"><div class="container">
    <div class="section__label">${tri({en:'Numbers that matter','pt-br':'Números que importam',es:'Números que importan'})}</div>
    <h2 class="section__title">${tri(D.statsTitle||{en:'Why this topic, in numbers.','pt-br':'Por que este tema, em números.',es:'Por qué este tema, en números.'})}</h2>
    <div class="stat-strip">${D.stats.map(statHTML).join('')}</div>
  </div></section>` : ''}

  ${D.pillars ? `<section class="section"><div class="container">
    <div class="section__label">${tri(D.pillarsLabel||{en:'The thesis','pt-br':'A tese',es:'La tesis'})}</div>
    <h2 class="section__title">${tri(D.pillarsTitle)}</h2>
    <p class="section__lead">${tri(D.pillarsLead)}</p>
    <div class="pillars">${D.pillars.map(pillarHTML).join('')}</div>
  </div></section>` : ''}

  ${D.stackGlance ? `<section class="section section--alt"><div class="container">
    ${D.stackGlance.label ? `<div class="section__label">${tri(D.stackGlance.label)}</div>` : ''}
    <h2 class="section__title">${tri(D.stackGlance.title)}</h2>
    ${D.stackGlance.lead ? `<p class="section__lead">${tri(D.stackGlance.lead)}</p>` : ''}
    <div class="stack-glance">${D.stackGlance.layers.map(l => `<div class="stack-glance__layer" data-layer="${l.layer}">
      <div class="stack-glance__num">${l.num}</div>
      <div class="stack-glance__name">${tri(l.name)}</div>
      <p class="stack-glance__desc">${tri(l.desc)}</p>
    </div>`).join('')}</div>
  </div></section>` : ''}

  ${D.tokenCards ? `<section class="section"><div class="container">
    ${D.tokenCards.label ? `<div class="section__label">${tri(D.tokenCards.label)}</div>` : ''}
    <h2 class="section__title">${tri(D.tokenCards.title)}</h2>
    ${D.tokenCards.lead ? `<p class="section__lead">${tri(D.tokenCards.lead)}</p>` : ''}
    <div class="token-cards">${D.tokenCards.cards.map(c => `<article class="token-card" data-layer="${c.layer||'blue'}">
      <div class="token-card__eyebrow">${tri(c.eyebrow)}</div>
      <div class="token-card__num">${c.num}</div>
      <div class="token-card__sub">${tri(c.sub)}</div>
      <p class="token-card__body">${tri(c.body)}</p>
    </article>`).join('')}</div>
  </div></section>` : ''}

  ${(D.insightSections||[]).map(s => `<section class="section ${s.alt?'section--alt':''}"><div class="container">
    ${s.label ? `<div class="section__label">${tri(s.label)}</div>` : ''}
    <h2 class="section__title">${tri(s.title)}</h2>
    ${s.lead ? `<p class="section__lead">${tri(s.lead)}</p>` : ''}
    ${s.items ? `<div class="insights">${s.items.map(it => `<article class="insight" data-accent="${it.accent||D.accent}">
      ${it.art ? `<div class="insight__art" aria-hidden="true">${it.art}</div>` : ''}
      ${it.kicker ? `<div class="insight__kicker">${tri(it.kicker)}</div>` : ''}
      <h3 class="insight__title">${tri(it.title)}</h3>
      <p class="insight__body">${tri(it.body)}</p>
      ${it.note ? `<p class="insight__note">${tri(it.note)}</p>` : ''}
    </article>`).join('')}</div>` : ''}
  </div></section>`).join('')}

  <section class="section section--alt" id="formats"><div class="container">
    <div class="section__label">${tri({en:'Read it, present it, build with it','pt-br':'Leia, apresente, construa',es:'Léelo, preséntalo, construye'})}</div>
    <h2 class="section__title">${tri(D.formatsTitle||{en:'Three formats, one thesis.','pt-br':'Três formatos, uma tese.',es:'Tres formatos, una tesis.'})}</h2>
    <div class="formats">${D.formats.map(fmtHTML).join('')}</div>
  </div></section>

  <section class="section" id="related"><div class="container">
    <div class="section__label">${tri({en:'Related topics','pt-br':'Temas relacionados',es:'Temas relacionados'})}</div>
    <h2 class="section__title">${tri({en:'Where this fits in the stack.','pt-br':'Onde isto encaixa no stack.',es:'Dónde encaja esto en el stack.'})}</h2>
    <p class="section__lead">${tri({en:'This topic depends on, and feeds, the others. Use these links to navigate the full body of work.','pt-br':'Este tema depende dos outros e alimenta os outros. Use estes links para navegar pelo corpo de trabalho completo.',es:'Este tema depende de los otros y alimenta a los otros. Usa estos enlaces para navegar el cuerpo de trabajo completo.'})}</p>
    <div class="crosslinks">${D.crosslinks.map(clHTML).join('')}</div>
  </div></section>

  <!-- CLOSING SLIDE, dark, return to hub -->
  <section class="closing">
    <div class="closing__container">
      <div class="closing__brand">
        <img class="closing__brand-logo" src="../_shared/paulasilva-logo.png" alt="Paula Silva" aria-hidden="true">
        <span>Paula Silva | ${role}</span>
      </div>
      <h2 class="closing__title">${tri(closingTitle)}</h2>
      <p class="closing__tagline">Building the future of software development with AI and Agentic DevOps.</p>
      <div class="closing__role">${D.topicLabel} · ${tri({en:'End of landing','pt-br':'Fim da landing',es:'Fin del landing'})}</div>
      <div class="closing__cta">
        <a href="../index.html" class="closing__btn closing__btn--primary">
          <svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div class="closing__btn-label">${tri({en:'Return to','pt-br':'Voltar para',es:'Volver al'})}<span class="closing__btn-value">${tri({en:'Knowledge Hub','pt-br':'Hub de Conhecimento',es:'Hub de Conocimiento'})}</span></div>
        </a>
        ${D.existingPlaybook ? `<a href="${D.existingPlaybook}" class="closing__btn">
          <svg viewBox="0 0 24 24"><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4zM4 16h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div class="closing__btn-label">${tri(D.closingContinueLabel||{en:'Continue with','pt-br':'Continuar com',es:'Continuar con'})}<span class="closing__btn-value">${tri(D.closingPlaybookLabel||{en:'The playbook','pt-br':'O playbook',es:'El playbook'})}</span></div>
        </a>` : (D.existingDeck ? `<a href="${D.existingDeck}" class="closing__btn">
          <svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
          <div class="closing__btn-label">${tri({en:'Open the','pt-br':'Abrir o',es:'Abrir el'})}<span class="closing__btn-value">${tri(D.heroDeckLabel||{en:'deck','pt-br':'deck',es:'deck'})}</span></div>
        </a>` : '')}
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
  </section>
  `;

  // Init shared theme + i18n behaviors
  const tplScript = document.createElement('script');
  tplScript.src = '../_shared/landing.js';
  document.body.appendChild(tplScript);
})();
