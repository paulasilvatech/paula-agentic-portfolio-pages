# Deck Format Reference (engine deck_5)

The canonical HTML deck pattern for paulasilva-ms. Used for SERPRO Hackathon, Context Platform Stack, and all client-facing presentations.

## Editorial contract

A deck is a live presentation, not a document. Each slide is a compressed argument.

**Allowed per slide:** 1 main idea, 1 supporting visual, 5-7 bullet items maximum, 1 quote / pull-out, 1 table.
**Forbidden per slide:** body paragraphs over 3 lines, more than 8 list items, code longer than 6 lines, multiple competing visuals.

For long-form content (full prose, 10+ items, code walkthroughs), use a **playbook** format instead.

## Engine: deck_5

The deck_5 engine is the canonical baseline. It provides:

- **Chrome bar** at top (logo + role) that adapts color when active slide is dark
- **Progress bar** showing position through the deck
- **Slide navigation** via arrow keys, space, page-down/up, home/end
- **Overview modal** (`O` or `Esc`): grid view of all slides, click to jump
- **Counter** (`1 / N`) at bottom right
- **Animations**: fadeUp staggered entrance for `.eyebrow`, `.title`, `.subtitle`, `.stagger > *` items
- **Optional language switcher** (EN / PT / ES) — disable for single-locale decks

The engine source is the `<style>` and `<script>` blocks of `deck_5.html`. Reuse those as a unit; do not modify the navigation or animation code.

## File structure

```
<!DOCTYPE html>
<html lang="pt-BR">  <!-- or en, es -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Title</title>
  <meta name="author" content="Paula Silva, Software Global Black Belt">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
  <style>
    /* Full deck_5 CSS (~37KB) goes here */
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
    <!-- Slides go here -->
    <section class="slide slide--light" data-active="true" style="--accent: var(--c-blue-500);">
      <!-- Cover content -->
    </section>
    <!-- ... more slides ... -->
  </div>

  <div class="kbd-hint" id="kbdHint">
    Use <kbd>←</kbd> <kbd>→</kbd> para navegar · <kbd>O</kbd> ou <kbd>Esc</kbd> para overview
  </div>

  <div class="overview" id="overview" aria-hidden="true">
    <div class="overview__header">
      <div class="overview__title" id="overviewTitle">Visão geral</div>
      <div class="overview__hint" id="overviewHint">Clique em um slide · Esc para fechar</div>
    </div>
    <div class="overview__grid" id="overviewGrid"></div>
  </div>

  <div class="deck-controls">
    <button class="deck-controls__btn" onclick="prevSlide()" title="Previous">←</button>
    <span class="deck-controls__counter" id="counter">1 / 41</span>
    <button class="deck-controls__btn" onclick="nextSlide()" title="Next">→</button>
  </div>

  <script>
    /* Full deck_5 script (~140KB) goes here */
  </script>

</body>
</html>
```

## Slide types

### Light slide (default content)

```html
<section class="slide slide--light" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Section label</div>
  <h2 class="title title--medium">The main point in one line.</h2>
  <p class="body-large">Optional supporting paragraph, max 3 lines.</p>
  <div class="list-numbered stagger">
    <div class="list-numbered__item"><span class="list-numbered__num">01</span><span class="list-numbered__text">Item one.</span></div>
    <!-- ... -->
  </div>
</section>
```

Available `.title` sizes: `.title` (XL), `.title--medium`, `.title--small`.

### Paper slide (alternative light, slightly different background)

```html
<section class="slide slide--paper" style="--accent: var(--c-blue-500);">
  <!-- same structure -->
</section>
```

Use sparingly, to break up rhythm of consecutive `.slide--light`.

### Dark slide / section divider

```html
<section class="slide slide--dark" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Parte II</div>
  <div class="section-number">II</div>
  <h1 class="section-title">Section title.</h1>
  <p class="subtitle">Optional 1-line subtitle for context.</p>
</section>
```

The chrome bar automatically adapts (text becomes light) when a dark slide is active.

### Cover slide (first slide, always `data-active="true"`)

See `references/identity.md` for the canonical cover template.

### Final slide (last slide, dark)

See `references/identity.md` for the canonical final-slide template.

## Accent colors per slide

Each slide can set its accent color via inline style:

```html
<section class="slide slide--light" style="--accent: var(--c-blue-500);">
```

Match the accent to the section's layer or theme:

| Theme / topic | Accent token |
|---|---|
| Infrastructure, technical, "how" | `--c-blue-500` |
| Platform, foundation, success | `--c-green-500` |
| Context, knowledge, evaluation | `--c-yellow-500` |
| Intent, problem, urgency, danger | `--c-red-500` |

The accent affects: eyebrow color, list-numbered__num color, accent spans inside the title.

## Title with colored accent words

Use `.accent-blue`, `.accent-green`, `.accent-yellow`, `.accent-red` spans inside the title to colorize keywords:

```html
<h2 class="title title--medium">
  Stack fixada. <span class="accent-yellow">Foco no processo</span>, não na escolha.
</h2>
```

## Patterns to avoid

- **Do NOT** add `data-i18n` attributes if your deck is single-locale. They are wired to the deck_5 i18n loader; without translation entries, content gets blanked.
- **Do NOT** redeclare `const I18N` if you keep the deck_5 script. JS will throw a `SyntaxError` and `goToSlide` becomes undefined (navigation breaks). Either keep the engine's I18N as-is, or remove the i18n block entirely.
- **Do NOT** modify the deck stage dimensions (1600x900). The PDF generation pattern in `references/pdf-generation.md` depends on these exact values.
- **Do NOT** use `display: none` on slides. The engine uses `data-active` + CSS `visibility: hidden/visible` — overriding with `display: none` breaks the overview modal.
- **Do NOT** put long prose in a slide. If it needs more than 3 short paragraphs, it belongs in a playbook, not a deck.

## Pre-publish deck checklist

- [ ] Cover slide has `data-active="true"` (only the cover)
- [ ] Counter (`1 / N`) matches actual slide count
- [ ] All slide accent colors map to topic/layer (no random palette)
- [ ] No em dashes (`—`) anywhere
- [ ] No banned vocabulary (see `references/voice.md`)
- [ ] Identity check passes (see `references/identity.md`)
- [ ] Navigation works in browser (arrow keys advance, no console errors)
- [ ] Overview modal works (`O` key opens grid)
- [ ] PDF generation succeeds (see `references/pdf-generation.md`)
