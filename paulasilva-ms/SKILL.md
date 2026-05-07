---
name: paulasilva-ms
description: Apply the paulasilva-ms Design System (Microsoft identity) to any visual or editorial output signed by Paula Silva as Software Global Black Belt. Forks the paulasilvatech DS visual system with same logo shape and tokens, but uses Microsoft 4-color palette in the logo and differs in author attribution, role string, and contact (single email, no socials). Use for Microsoft-facing material, internal decks, workshop guides, client proposals, formal documents, multi-page playbooks, runbooks. Also covers PDF generation from HTML decks (Playwright vector PDF) and the no-build multi-page playbook pattern with single-source trilingual content (EN, PT-BR, ES). Trigger on "MS identity", "usar identidade Microsoft", "Software Global Black Belt", "paulasilva-ms", "deck Microsoft", "playbook multi-page", "playbook trilingue", "gerar PDF do deck", "deck to PDF", or any Microsoft-authored output. Required to keep personal and corporate channels separated.
---

# paulasilva-ms Skill (v1.7.0)

Microsoft identity fork of the paulasilvatech Design System for Paula Silva, Software Global Black Belt. Same visual system shape, formal author attribution, single-channel contact, multi-page trilingual playbook architecture.

## What's new in v1.7.0

Major rework of the playbook pattern, from single-page to multi-page with single-source trilingual content.

| New / rewritten | Purpose |
|---|---|
| `assets/playbook/` ⭐ **new folder** | Multi-page playbook template, replaces the old single-page `assets/playbook.html`. One HTML per chapter, shared CSS and JS in `shared/`, single-source trilingual content in `shared/content/*.js`, no toolchain. Chrome bar with `</>` SVG logo (Microsoft 4-color palette: `#F25022 / #7FBA00 / #FFB900 / #00A4EF`) plus role text. Landing page with hero, stat-grid, chapter-grid. Chapter pages with breadcrumb, doc-hero, 3-column layout (TOC, content, scrollspy), pagenav. Search modal triggered by `/` key. Keyboard shortcuts. Dark mode with low-contrast fixes for active TOC item, eyebrows, footnote refs. |
| `references/playbook.md` ⭐ **rewritten** | Full reference for the new multi-page architecture: directory layout, identity-locked strings, `data-i18n` attribute system, content module shape, engine behavior, search index format, validation checklist, common mistakes. |

## What was added in v1.6.0

| New | Purpose |
|---|---|
| `references/svg-quality.md` | Five non-negotiable rules for SVG diagrams (`<tspan>` for multi-line, padding, card hierarchy, semantic color, palette discipline), pre-publish checklist, didactic test, anti-patterns. |

## What was added in v1.5.0

Four reference files brought to parity with the sister skill:

| New / Updated | Purpose |
|---|---|
| `references/markdown-guide.md` | Long-form `.md` pattern with MS frontmatter (role, contact, no socials), MS-first citation hierarchy, signature block. |
| `references/editorial-spine.md` | Trilingual `content.json` + `i18n-{locale}.json` pattern with MS overrides (English-only role/tagline) and forbidden-strings audit. |
| `references/site.md` | Astro multi-page site (rare for MS material), usage criteria, MS-specific overrides, pre-launch identity audit. |

## What was added in v1.4.0

- `assets/showcase.html`, all-in-one visual reference rendering every pattern of the MS identity: typography, colors, components, 12-icon catalog, cards, simulations (browser, terminal, VS Code, GitHub Copilot Chat), architecture diagrams, deck slides (cover, light, paper, dark, final), Office signatures, Astro site preview, playbook 3-col layout. Includes interactive components (sliders, radio pill groups, live result displays), deck layout patterns (big number, stat pair, split before/after, question grid, pillar grid, layer pyramid), deck chrome (brand bar with 2x2 colored squares).

## When to use this skill vs paulasilvatech-ds

| Use **paulasilva-ms** | Use **paulasilvatech-ds** |
|---|---|
| Internal Microsoft material | Personal, community, public material |
| Client-facing decks under MS role | Open-source playbooks, blog posts, articles |
| Workshop guides for enterprise customers | Conference talks, GitHub repos |
| Anything signed `Software Global Black Belt` | Anything signed `AI-Native Software Engineer` |

**Never mix.** A single deliverable uses one identity start to finish.

## Step 1, load tokens and fonts

Same DS token shape as paulasilvatech-ds, with Microsoft palette in the logo:

```css
:root {
  --c-red-50: #FFF0EB;     --c-red-500: #F25022;    --c-red-700: #B33816;
  --c-green-50: #F1F8E3;   --c-green-500: #7FBA00;  --c-green-700: #5A8500;
  --c-blue-50: #E5F6FD;    --c-blue-500: #00A4EF;   --c-blue-700: #0076AC;
  --c-yellow-50: #FFF7E0;  --c-yellow-500: #FFB900; --c-yellow-700: #B88500;
  --ink: #1A1A1A;     --ink-2: #3A3A3A;    --ink-3: #737373;
  --paper: #FFFFFF;   --bg: #F7F7F5;       --bg-alt: #ECECE8;
  --rule: #E5E5E0;    --rule-2: #CECEC7;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
[data-theme="dark"] {
  --ink: #F0F0F0;     --ink-2: #C7C7C2;    --ink-3: #A8A8A4;
  --paper: #1C1C1A;   --bg: #141414;       --bg-alt: #242420;
  --rule: #2E2E2A;    --rule-2: #3A3A36;
  --accent-ink: var(--c-blue-500);  /* brighter for dark legibility */
  --accent-50: rgba(0, 164, 239, 0.12);
}
```

Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

## Step 2, logo (Microsoft palette)

The `</>` SVG logo uses **Microsoft 4-color palette**, not paulasilvatech personal:

| Path | Microsoft color | Personal (forbidden in MS) |
|---|---|---|
| 1, red | `#F25022` | `#FF3133` |
| 2, green | `#7FBA00` | `#7ED956` |
| 3, yellow | `#FFB900` | `#FFDE59` |
| 4, blue | `#00A4EF` | `#39B8FF` |

Inline only, never link external SVG file. Full markup in `references/identity.md`.

## Step 3, identity strings (MS-specific, mandatory)

These canonical strings are **non-negotiable** for any MS-identity output:

| Field | Value |
|---|---|
| Author | `Paula Silva` |
| Role | `Software Global Black Belt` |
| Chrome bar form | `Paula Silva | Software Global Black Belt` (mono uppercase, letter-spacing 0.16em) |
| Contact | `paulasilva@microsoft.com` (mailto link, single channel) |
| Tagline (EN only) | `Building the future of software development with AI and Agentic DevOps` |

**Forbidden in MS-identity output:**
- `AI-Native Software Engineer` (that is the personal role)
- `@paulasilvatech` (personal GitHub)
- `paulanunes`, LinkedIn (personal)
- `agenticdevopsplatform.com` (personal site)
- `Microsoft Americas`, `Software GBB Americas` (deprecated, use just `Software Global Black Belt`)
- The personal logo palette `#FF3133 / #7ED956 / #FFDE59 / #39B8FF`

## Step 4, identify output format and load reference

| Format | Read |
|---|---|
| Deck (HTML, slide-based) | `references/deck.md`, `references/deck-engine-v5.md` |
| Multi-page playbook (3+ chapters, trilingual) ⭐ | `references/playbook.md`, copy `assets/playbook/` |
| Markdown guide / long-form `.md` | `references/markdown-guide.md` |
| Email / Memo / Office | `references/office.md` |
| Convert deck HTML to PDF | `references/pdf-generation.md` plus `scripts/deck_to_pdf.py` |
| Editorial spine plus i18n (trilingual content.json, MS-identity rules) | `references/editorial-spine.md` |
| Astro multi-page site (rare for MS material) | `references/site.md` |
| Landing page | `references/landing.md` |

## Step 5, editorial rules (apply to every output)

- **No em dashes (`—`)**, no en-dashes (`–`) in ranges. Use comma, period, hyphen.
- **No banned vocabulary**: revolutionary, game-changer, world-class, cutting-edge, leverage (verb), synergy. See `references/voice.md`.
- **Sentence case** for headings (not Title Case).
- **ISO dates**: `2026-04-24`.
- **Full product names**: `GitHub Copilot` not `Copilot`, `Azure AI Foundry` not `AI Foundry`.
- **Microsoft-friendly tone**: didactic, professional but warm, technically precise. Avoid hype, keep Paula's pedagogical voice.
- **Visual assets always in EN** regardless of locale (SVG diagram labels, terminal output stay English).

## Step 6, file naming

```
{Title}_v{M_M_M}_{YYYY-MM-DD}_{locale}.{ext}
```

Examples:
```
Hackathon_SERPRO_2026_Deck_v3_0_0_2026-04-24_pt-br.html
Workshop_Guide_AgenticDevOps_v1_0_0_2026-05-01_en.html
ContextStack_Playbook_v1_0_0_2026-05-04_multi/    (multi-page folder)
```

Locale codes: `en`, `pt-br`, `es`, `multi` (for multi-page trilingual playbooks).

## Step 7, multi-page playbook quick start

1. Copy `assets/playbook/` into the project workspace, rename if needed.
2. Edit `shared/content/landing.js` for project topic, chapter list, accents.
3. For each chapter: clone `chapter-01-foundation.html`, change `<body data-page="chapter-NN">`, swap content module include, write `shared/content/chapter-NN.js` with all three locales (EN, PT-BR, ES).
4. Add per-locale entries to `shared/search-index.js`.
5. Run validation: no em-dashes, no forbidden strings, JS syntax clean, all three locales present, identity-locked EN strings hardcoded.
6. Open `index.html?lang=en`, `?lang=pt-br`, `?lang=es` in browser. Test light + dark theme.

Full pattern in `references/playbook.md`.

## Step 8, generate PDF from deck (when requested)

When the user asks to convert an HTML deck to PDF, use `scripts/deck_to_pdf.py`. The script:
1. Opens the deck HTML in headless Chromium (Playwright).
2. Iterates through every slide via `goToSlide(i)` JS function.
3. Generates one PDF per slide via `page.pdf()` (vector, not screenshot).
4. Merges with pypdf into single PDF.
5. Adds metadata (Title, Author, Subject, Creator).

CSS overrides applied automatically: hide deck navigation chrome, force animations to final state.

```bash
python3 scripts/deck_to_pdf.py \
  --input /path/to/deck.html \
  --output /path/to/deck.pdf \
  --title "Event Name" \
  --author "Paula Silva, Software Global Black Belt" \
  --subject "Brief description"
```

See `references/pdf-generation.md` for the full pattern, troubleshooting, edge cases.

## Anti-patterns (never do these in MS-identity output)

- Sign as `AI-Native Software Engineer`, that is paulasilvatech identity, not MS.
- Use the personal logo palette `#FF3133 / #7ED956 / #FFDE59 / #39B8FF`. The MS logo is always Microsoft `#F25022 / #7FBA00 / #FFB900 / #00A4EF`.
- Include GitHub, LinkedIn, or site links in MS material. The single contact is the email.
- Use em dashes anywhere.
- Modify the `</>` logo proportions or path geometry.
- Paraphrase the canonical role string. It is `Software Global Black Belt`, full stop.
- Invent metrics, customer names, or internal Microsoft data.
- Overwrite a published version. Bump version (v3_0_0 → v3_1_0) and archive the prior file.
- Use a hash router for new playbooks. The v1.7.0 architecture is multi-page, each chapter is its own URL.

## Reference files (load on demand)

### Visual showcase
- `assets/showcase.html` ⭐ all-in-one rendered reference, every MS-identity pattern displayed live (48 sections). Open in browser, navigate via sidebar. Use as the visual spec when markdown is not enough.

### Working templates
- `assets/playbook/` ⭐ **v1.7.0 multi-page playbook template**, fully trilingual, no toolchain, ready to copy and customize.
- `assets/deck.html`, deck reference.
- `assets/landing.html`, landing page reference.

### Identity & voice
- `references/identity.md`, full SVG logo markup, canonical strings, forbidden patterns checklist, pre-publish identity audit script.
- `references/voice.md`, brand voice: banned vocabulary, tone calibration, MS-vs-personal examples side by side.

### Format references
- `references/deck.md`, engine deck_5 pattern: chrome-bar, slide types, animation classes, navigation.
- `references/deck-engine-v5.md`, deck engine details: chrome bar, overview modal, stagger animations, common pitfalls.
- `references/landing.md`, hero, format cards, stack-at-a-glance, theme JS for landing pages.
- `references/playbook.md` ⭐ **rewritten in v1.7.0**, full multi-page architecture: directory layout, content module shape, engine behavior, search index, validation checklist.
- `references/markdown-guide.md`, long-form `.md` guides, MS frontmatter, signature block, citation rules, naming.
- `references/site.md`, Astro multi-page site (rare for MS material, usage guidelines and forbidden-strings audit).
- `references/office.md`, Word, PowerPoint, Excel rules: Segoe UI, Microsoft Blue `#0078D4`, header/footer, signature.
- `references/pdf-generation.md`, full PDF generation pattern from HTML decks: Playwright config, CSS overrides, troubleshooting, edge cases.

### Editorial references
- `references/editorial-spine.md`, trilingual `content.json` plus `i18n-{locale}.json` single-source pattern, MS overrides (English-only role/tagline), forbidden-strings audit.

### Visual asset references
- `references/components.md`, atomic component library: cards, buttons, eyebrow, badges, code blocks, tables, progress bars, dark mode toggle, search.
- `references/animations.md`, hover, fadeUp, terminal typing, progress bar, scroll-based, SVG diagram animations.
- `references/svg-quality.md`, five non-negotiable rules for SVG diagrams (tspan multi-line, padding, card hierarchy, semantic color), pre-publish checklist, didactic test, anti-patterns.
- `references/svg-icons.md`, inline SVG icon system: 12-icon catalog, sizes (16, 18, 24, 48, 72), animated spinner, sprite sheets.
- `references/diagrams.md`, Mermaid plus hand-crafted SVG, generic node patterns, icon standards.
- `references/architecture-diagrams.md`, sequence, component, deployment, network topology, layer stack, decision trees.
- `references/simulations.md`, browser, terminal, VS Code, GitHub Copilot Chat faux UIs.
- `references/images.md`, AI-generated, screenshots, photos, decorative imagery, formats, performance.

### Bundled script
- `scripts/deck_to_pdf.py`, reusable CLI to convert any deck_5 HTML to vector PDF, with MS-identity validation built in (warns if `AI-Native Software Engineer` or `@paulasilvatech` leak in MS material).
