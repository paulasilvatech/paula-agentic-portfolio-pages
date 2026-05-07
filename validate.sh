#!/bin/bash
# paulasilva-ms / paulasilvatech-ds dual-identity compliance validator
# Usage: ./validate.sh
# Runs from doc-presentations/ root. Exits 0 if all files compliant, 1 otherwise.
#
# Identity detection per file:
#   - MS identity:        contains "Software Global Black Belt" + "paulasilva@microsoft.com"
#   - Personal identity:  contains "AI-Native Software Engineer" or "@paulasilvatech"
#   - Structural shell:   landing.html / playbook.html / index.html (chrome via JS template)
#
# Per-identity checks:
#   MS:          identity strings + forbidden + em-dash + banned vocab + trilingual + anti-patterns + back-link
#   Personal:    em-dash + banned vocab + back-link (no MS-required strings, no MS forbidden)
#   Structural:  em-dash + banned vocab (chrome rendered by JS, skip back-link static check)

set -uo pipefail
cd "$(dirname "$0")"

GREEN='\033[32m'; RED='\033[31m'; YELLOW='\033[33m'; CYAN='\033[36m'; RESET='\033[0m'
fail=0; total=0; ms=0; personal=0; structural=0

echo "═════════════════════════════════════════════════"
echo " Dual-identity Compliance Validator"
echo "═════════════════════════════════════════════════"

for f in $(find . -maxdepth 2 -type f -name "*.html" | grep -v ".archive" | sort); do
  total=$((total + 1))
  issues=""
  base=$(basename "$f")

  # === IDENTITY DETECTION ===
  has_sgbb=$(grep -c 'Software Global Black Belt' "$f")
  has_ms_email=$(grep -c 'paulasilva@microsoft.com' "$f")
  has_ai_native=$(grep -c 'AI-Native Software Engineer' "$f")
  has_pst_handle=$(grep -c '@paulasilvatech' "$f")

  # Structural shells: Hub, per-topic landing, per-topic generic playbook
  if [ "$base" = "index.html" ] || [ "$base" = "landing.html" ] || [ "$base" = "playbook.html" ]; then
    identity="STRUCTURAL"
    structural=$((structural + 1))
  elif [ "$has_ai_native" -gt 0 ] || [ "$has_pst_handle" -gt 0 ]; then
    identity="PERSONAL"
    personal=$((personal + 1))
  else
    identity="MS"
    ms=$((ms + 1))
  fi

  # === UNIVERSAL CHECKS (apply to all identities) ===
  # Em-dashes
  n=$(grep -c '—' "$f")
  [ "$n" -gt 0 ] && issues="$issues em-dash($n)"

  # Banned vocabulary
  for term in 'AI-powered' 'revolutionary' 'game-changer' 'next-generation' \
              'world-class' 'best-in-class' 'cutting-edge' 'this changes everything' \
              'the future is here' 'synergy' 'leverage ' 'circle back' \
              'low-hanging fruit'; do
    n=$(grep -ic "$term" "$f")
    [ "$n" -gt 0 ] && issues="$issues banned:$term($n)"
  done

  # === MS-IDENTITY-ONLY CHECKS ===
  if [ "$identity" = "MS" ]; then
    # Required identity strings
    [ "$has_sgbb" -eq 0 ] && issues="$issues -SGBB"
    [ "$has_ms_email" -eq 0 ] && issues="$issues -email-ms"

    # Forbidden identity strings (would mean accidental personal-identity leak)
    for term in 'AI-Native Software Engineer' '@paulasilvatech' 'paulasilvatech\.com' \
                'agenticdevopsplatform' 'Microsoft Americas' 'Software GBB Americas' \
                'Microsoft Global Black Belt'; do
      n=$(grep -c "$term" "$f")
      [ "$n" -gt 0 ] && issues="$issues +$term($n)"
    done
    n=$(grep -ic 'paulanunes' "$f")
    [ "$n" -gt 0 ] && issues="$issues +paulanunes($n)"

    # Trilingual i18n
    has_en=$(grep -cE "(['\"]?en['\"]?:\s*\{)" "$f")
    has_pt=$(grep -cE "(['\"]?pt-BR['\"]?:\s*\{|['\"]?pt['\"]?:\s*\{)" "$f")
    has_es=$(grep -cE "(['\"]?es['\"]?:\s*\{)" "$f")
    [ "$has_en" -eq 0 ] && issues="$issues -i18n.en"
    [ "$has_pt" -eq 0 ] && issues="$issues -i18n.pt-BR"
    [ "$has_es" -eq 0 ] && issues="$issues -i18n.es"

    # Anti-pattern (deck.md): data-i18n without I18N dict OR setLocale
    has_data_i18n=$(grep -c 'data-i18n=' "$f")
    has_const_i18n=$(grep -c 'const I18N' "$f")
    has_setlocale=$(grep -c 'function setLocale' "$f")
    if [ "$has_data_i18n" -gt 0 ] && [ "$has_const_i18n" -eq 0 ]; then
      issues="$issues data-i18n-without-I18N-dict"
    fi
    if [ "$has_data_i18n" -gt 0 ] && [ "$has_setlocale" -eq 0 ]; then
      issues="$issues data-i18n-without-setLocale"
    fi
  fi

  # === BACK-TO-HUB LINK ===
  # MS + personal decks must have static <a class="deck-brand" href="../index.html">
  # Structural shells render this via JS (skip static check for them; index.html is the destination itself)
  if [ "$identity" != "STRUCTURAL" ]; then
    has_back_link=$(grep -cE '<a[^>]*class="(deck-brand|meta-bar__left|chrome__brand)"[^>]*href="\.\./index\.html"' "$f")
    [ "$has_back_link" -eq 0 ] && issues="$issues -back-to-Hub-link"
  fi

  # === REPORT ===
  if [ -z "$issues" ]; then
    printf "${GREEN}✓ PASS${RESET}  ${CYAN}[%-10s]${RESET}  %s\n" "$identity" "$f"
  else
    printf "${RED}✗ FAIL${RESET}  ${CYAN}[%-10s]${RESET}  %s\n" "$identity" "$f"
    printf "         issues:%s\n" "$issues"
    fail=$((fail + 1))
  fi
done

echo "═════════════════════════════════════════════════"
echo " Identity breakdown: $ms MS, $personal personal, $structural structural"
if [ "$fail" -eq 0 ]; then
  printf " ${GREEN}ALL CLEAN${RESET}: %d/%d files pass\n" "$total" "$total"
  exit 0
else
  printf " ${RED}FAILURES${RESET}: %d/%d files have issues\n" "$fail" "$total"
  exit 1
fi
