# Deck Engine v5 Reference

The current production deck engine for paulasilvatech (and paulasilva-ms). Used for SERPRO Hackathon 2026, Context Platform Stack v2, and all decks from April 2026 forward.

## When to use this vs `deck.md` (deck-stage)

| Use **deck-engine-v5** (this file) | Use **deck.md** (deck-stage web component) |
|---|---|
| New decks from April 2026 forward | Legacy decks already in production with deck-stage |
| Need chrome-bar with logo + role | No chrome required, full-bleed slides |
| Need overview modal (grid view of all slides) | Linear navigation only |
| Need staggered entrance animations on slide content | Static slide content, instant transitions |
| Will be exported to PDF | HTML-only, no PDF requirement |

The two engines are NOT interchangeable. They have different DOM structures, different navigation logic, different CSS.

## Core features

- **Chrome bar** (top-left): logo + author/role label, adapts color when active slide is dark
- **Progress bar** (top, full width): thin accent-colored bar showing position
- **Slide navigation**: arrow keys, space, page-down/up, home/end
- **Overview modal** (`O` or `Esc`): grid of all slide thumbnails, click to jump
- **Counter** (bottom right): `1 / N`
- **Animations**: `fadeUp` staggered entrance on `.eyebrow`, `.title`, `.subtitle`, `.stagger > *` items
- **Optional language switcher** (EN / PT-BR / ES) — disable for single-locale decks
- **Stage dimensions**: 1600x900 (16:9 at this scale)

## File structure

```html
<!DOCTYPE html>
<html lang="pt-BR">  <!-- or en, es -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deck Title</title>
  <meta name="author" content="Paula Silva, Software Global Black Belt">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
  <style>
    /* Full deck_5 CSS goes here (see deck_5.html in your reference assets) */
    .lang-switcher { display: none !important; }  /* if single-locale */
  </style>
</head>
<body>

  <div class="deck-progress" id="progress"></div>

  <div class="deck-brand">
    <!-- 22px logo SVG -->
    <span class="deck-brand__text">Paula Silva | Software Global Black Belt</span>
  </div>

  <div class="deck" id="deck">
    <section class="slide slide--light" data-active="true" style="--accent: var(--c-blue-500);">
      <!-- Cover content -->
    </section>
    <!-- ... more slides ... -->
  </div>

  <div class="kbd-hint" id="kbdHint">
    Use <kbd>←</kbd> <kbd>→</kbd> to navigate · <kbd>O</kbd> or <kbd>Esc</kbd> for overview
  </div>

  <div class="overview" id="overview" aria-hidden="true">
    <div class="overview__header">
      <div class="overview__title" id="overviewTitle">Overview</div>
      <div class="overview__hint" id="overviewHint">Click a slide · Esc to close</div>
    </div>
    <div class="overview__grid" id="overviewGrid"></div>
  </div>

  <div class="deck-controls">
    <button class="deck-controls__btn" onclick="prevSlide()">←</button>
    <span class="deck-controls__counter" id="counter">1 / N</span>
    <button class="deck-controls__btn" onclick="nextSlide()">→</button>
  </div>

  <script>
    /* Full deck_5 script goes here */
  </script>
</body>
</html>
```

## Slide types

### Cover slide (first, always `data-active="true"`)

```html
<section class="slide slide--light" data-active="true" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Event Name · Location</div>
  <h1 class="title">
    <span class="accent-blue">Keyword</span><br>continuation.
  </h1>
  <p class="subtitle">One-sentence pitch, max 30 words.</p>
  <div class="meta-grid">
    <div class="meta-item"><span class="meta-label">Author</span><span class="meta-value">Paula Silva</span></div>
    <div class="meta-item"><span class="meta-label">Role</span><span class="meta-value">Software Global Black Belt</span></div>
    <div class="meta-item"><span class="meta-label">Contact</span><span class="meta-value"><a href="mailto:paulasilva@microsoft.com">paulasilva@microsoft.com</a></span></div>
    <div class="meta-item"><span class="meta-label">Date</span><span class="meta-value">2026-04-24</span></div>
  </div>
</section>
```

### Light slide (default content)

```html
<section class="slide slide--light" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Section label</div>
  <h2 class="title title--medium">The main point in one line.</h2>
  <p class="body-large">Optional supporting paragraph, max 3 lines.</p>
  <div class="list-numbered stagger">
    <div class="list-numbered__item"><span class="list-numbered__num">01</span><span class="list-numbered__text">Item one.</span></div>
  </div>
</section>
```

`.title` sizes: `.title` (XL), `.title--medium`, `.title--small`.

### Paper slide (alternative neutral)

`<section class="slide slide--paper">` — slightly different background, use to break rhythm of consecutive light slides.

### Dark slide / section divider

```html
<section class="slide slide--dark" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Part II</div>
  <div class="section-number">II</div>
  <h1 class="section-title">Section title.</h1>
  <p class="subtitle">Optional 1-line context.</p>
</section>
```

The chrome bar automatically adapts (text becomes light) when a dark slide is active. This is auto via `syncSlideTheme(i)` in the engine script.

### Final slide (last, dark, with logo and contact)

```html
<section class="slide slide--dark" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Event Name · Location · Date</div>
  <!-- 120px logo SVG -->
  <h1 class="section-title">Closing thought. <span class="accent-blue">Punchline.</span></h1>
  <p class="subtitle" style="font-style: italic;">Building the future of software development with AI and Agentic DevOps.</p>
  <div class="meta-bar-final">
    Paula Silva | Software Global Black Belt
  </div>
  <div class="contact-cards">
    <a href="mailto:paulasilva@microsoft.com">paulasilva@microsoft.com</a>
    <a href="https://linkedin.com/in/paulanunes">linkedin.com/in/paulanunes</a>
    <a href="https://agenticdevopsplatform.com">agenticdevopsplatform.com</a>
  </div>
</section>
```

## Accent colors per slide

Each slide sets accent via inline `style="--accent: var(--c-blue-500);"`. Match the topic:

| Theme | Accent token |
|---|---|
| Infrastructure, technical, "how" | `--c-blue-500` (#00A4EF) |
| Platform, foundation, success | `--c-green-500` (#7FBA00) |
| Context, knowledge, evaluation | `--c-yellow-500` (#FFB900) |
| Intent, problem, urgency, danger | `--c-red-500` (#F25022) |

The accent affects: eyebrow color, list-numbered number color, accent spans inside the title, progress bar.

## Title with colored accent words

```html
<h2 class="title title--medium">
  Stack fixed. <span class="accent-yellow">Focus on process</span>, not technology.
</h2>
```

Use `.accent-blue`, `.accent-green`, `.accent-yellow`, `.accent-red` — these are pre-defined in the engine CSS.

## Animation classes

The engine auto-animates `.eyebrow`, `.title`, `.subtitle`, `.body-large`, `.meta-grid`, `.section-number`, `.section-title`, `.big-number` on slide activation (fadeUp, 600ms, staggered).

For custom staggered lists, wrap them in `.stagger`:

```html
<div class="list-numbered stagger">
  <!-- each child item gets a 50ms-delayed fadeUp -->
</div>
```

## Pitfalls (learned the hard way)

- **Never redeclare `const I18N`.** If you keep the deck_5 script's `I18N` block and ALSO define your own `const I18N = {}` before it, JS throws a SyntaxError and `goToSlide` becomes undefined — navigation breaks completely.
- **Never use `display: none` on slides.** The engine uses `data-active` + opacity/visibility. Override with `display: none` and the overview modal breaks.
- **Counter HTML is hardcoded.** The literal `<span id="counter">1 / 50</span>` in the chrome HTML is a placeholder — the engine updates it on first goToSlide call. But if your deck has fewer/more slides, the initial flash on load shows the wrong number. Fix: set the literal to match your actual count.
- **Don't add `data-i18n` if your deck is single-locale.** The engine's setLocale() will blank elements that have `data-i18n` keys without translations.
- **Stage is exactly 1600x900.** PDF generation depends on this (see `pdf-generation.md`).

## Pre-publish checklist

- [ ] Cover slide has `data-active="true"` (only the cover)
- [ ] Counter (`1 / N`) matches actual slide count
- [ ] All slide accent colors map to topic/layer (no random palette)
- [ ] No em dashes (`—`)
- [ ] No banned vocabulary
- [ ] Identity strings match (paulasilva-ms: `Software Global Black Belt | paulasilva@microsoft.com`)
- [ ] Navigation works in browser (arrow keys advance, no console errors)
- [ ] Overview modal works (`O` key opens grid)
- [ ] PDF generation succeeds (see `pdf-generation.md`)
