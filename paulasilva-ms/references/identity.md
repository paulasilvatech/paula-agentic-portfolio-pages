# paulasilva-ms Identity Reference

Canonical strings, logo markup, and forbidden patterns for the Microsoft identity fork.

## Canonical strings (use exactly these)

```
Author name:   Paula Silva
Role (formal): Software Global Black Belt
Role (full):   Paula Silva, Software Global Black Belt
Meta-bar form: Paula Silva | Software Global Black Belt   (mono uppercase, letter-spacing 0.16em)
Contact:       paulasilva@microsoft.com   (single channel)
Tagline (EN):  Building the future of software development with AI and Agentic DevOps
```

The role is **Software Global Black Belt** (not "Software GBB Americas", not "Microsoft Global Black Belt", not abbreviated). It stands alone — no organization, no region.

The contact is **email only**. There is no public LinkedIn, no GitHub, no website on Microsoft material.

The tagline is **English-only** for MS material. Do not translate.

## Logo SVG (inline, never link external)

The four-color `</>` mark. Identical to paulasilvatech identity (the visual system is shared).

### Small (chrome bar, meta header) — 22px

```html
<svg viewBox="0 0 1914 1062" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="paulasilva" style="width:22px;height:auto;flex-shrink:0;">
  <title>paulasilva</title>
  <path fill="#FF3133" d="M532 131 L36 462 L13 497 L13 560 L23 582 L48 604 L521 923 L539 926 L539 699 L547 680 L314 530 L527 395 L551 371 L558 347 L558 155 L547 135 Z"/>
  <path fill="#7ED956" d="M551 681 L542 693 L540 700 L540 917 L546 930 L558 940 L571 943 L778 943 L788 941 L798 935 L809 910 L809 702 L807 694 L799 682 L784 674 L566 674 Z"/>
  <path fill="#FFDE59" d="M1390 16 L1208 13 L1184 23 L1171 38 L768 1009 L768 1026 L778 1038 L957 1042 L975 1037 L995 1017 L1346 179 L1349 145 L1367 129 L1401 47 L1402 31 Z"/>
  <path fill="#39B8FF" d="M1369 131 L1350 149 L1349 355 L1354 369 L1385 399 L1592 528 L1373 667 L1354 688 L1349 703 L1349 907 L1361 924 L1377 926 L1871 595 L1893 563 L1894 501 L1885 477 L1863 456 L1398 142 Z"/>
</svg>
```

### Large (final slide, hero) — 120px

Same SVG, change `style="width:120px;height:auto;"`.

The four colors are: red `#FF3133`, green `#7ED956`, yellow `#FFDE59`, blue `#39B8FF`. These belong to the brand mark only — they are NOT the same as the functional palette (`--c-red-500: #F25022`, etc.) which is used for everything else (cards, eyebrow accents, slide accents). Do not mix.

## Chrome bar (top of every long-form HTML, every deck)

```html
<div class="deck-brand">
  <!-- paste 22px logo SVG here -->
  <span class="deck-brand__text">Paula Silva | Software Global Black Belt</span>
</div>
```

CSS reference (use the deck_5 / paulasilvatech-ds CSS, no overrides needed):

```css
.deck-brand {
  position: fixed; top: 16px; left: 32px; z-index: 50;
  display: flex; align-items: center; gap: 12px;
}
.deck-brand__text {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-3);
}
```

## Cover slide meta-grid (decks)

Four columns, mandatory in this order:

```html
<div class="meta-grid">
  <div class="meta-item"><span class="meta-label">Autora</span><span class="meta-value">Paula Silva</span></div>
  <div class="meta-item"><span class="meta-label">Papel</span><span class="meta-value">Software Global Black Belt</span></div>
  <div class="meta-item"><span class="meta-label">Contato</span><span class="meta-value"><a href="mailto:paulasilva@microsoft.com">paulasilva@microsoft.com</a></span></div>
  <div class="meta-item"><span class="meta-label">Data</span><span class="meta-value">YYYY-MM-DD</span></div>
</div>
```

Localize labels: EN (`Author / Role / Contact / Date`), PT-BR (`Autora / Papel / Contato / Data`), ES (`Autora / Rol / Contacto / Fecha`). Values stay in their original form (the role is always English).

## Final slide (decks)

Dark slide. Logo large on top. Closing line as `.section-title`. Tagline in italic. Role in mono uppercase. Email as a bordered card.

```html
<section class="slide slide--dark" style="--accent: var(--c-blue-500);">
  <div class="eyebrow">Event Name · Location · Date</div>
  <!-- 120px logo SVG -->
  <h1 class="section-title">Closing thought. <span class="accent-blue">Punchline.</span></h1>
  <p class="subtitle" style="font-style: italic;">Building the future of software development with AI and Agentic DevOps.</p>
  <div style="font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--dark-ink-3); margin-bottom: 14px;">
    Paula Silva | Software Global Black Belt
  </div>
  <a href="mailto:paulasilva@microsoft.com" style="display:inline-flex; align-items:center; gap:12px; padding:14px 20px; border:1px solid rgba(240,240,240,.2); border-radius:8px; text-decoration:none; color:var(--dark-ink);">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:17px;height:17px;color:var(--dark-ink-2);flex-shrink:0;">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>
    </svg>
    <span style="font-size:15px;">paulasilva@microsoft.com</span>
  </a>
</section>
```

## Forbidden strings (never appear in MS output)

Search-and-confirm before delivering any MS-identity file. These trigger an immediate fail:

| Forbidden string | Why | Use instead |
|------------------|-----|-------------|
| `AI-Native Software Engineer` | Personal role | `Software Global Black Belt` |
| `@paulasilvatech` | Personal GitHub handle | (omit, no socials in MS) |
| `paulanunes` | Personal LinkedIn handle | (omit) |
| `agenticdevopsplatform.com` | Personal site | (omit) |
| `linkedin.com/in/paulanunes` | Personal LinkedIn URL | (omit) |
| `Microsoft Americas` | Deprecated regional title | `Software Global Black Belt` (no region) |
| `Software GBB Americas` | Deprecated regional abbreviation | `Software Global Black Belt` |
| `Microsoft Global Black Belt` | Adds redundant "Microsoft" prefix | `Software Global Black Belt` |
| `Construindo o futuro do desenvolvimento de software` | Tagline in PT (personal-only) | EN tagline only on MS material |
| `Construyendo el futuro del desarrollo de software` | Tagline in ES (personal-only) | EN tagline only on MS material |

## Pre-publish identity check (run before delivering)

```bash
file="path/to/deliverable.html"
echo "Forbidden strings audit:"
for s in "AI-Native Software Engineer" "@paulasilvatech" "paulanunes" \
         "agenticdevopsplatform" "Microsoft Americas" "Software GBB Americas"; do
  count=$(grep -c "$s" "$file" 2>/dev/null || echo 0)
  echo "  '$s': $count (must be 0)"
done

echo ""
echo "Required strings:"
for s in "Software Global Black Belt" "paulasilva@microsoft.com"; do
  count=$(grep -c "$s" "$file" 2>/dev/null || echo 0)
  echo "  '$s': $count (must be >=1)"
done
```

All forbidden counts must be 0. All required counts must be at least 1.
