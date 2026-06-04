# Accessibility — MCT

Quellen: [WCAG 2.2 Quickref](https://www.w3.org/WAI/WCAG22/quickref/), [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

## Ziel

Timer-App muss mit Tastatur und Screenreader **nutzbar** sein — besonders Zeit und Kosten.

## Pflicht umsetzen

| Element | Anforderung |
|---------|-------------|
| Start / Pause / Stop | `<button>`, sichtbarer oder `aria-label` Text |
| +/- Teilnehmer | `aria-label` mit Gruppenname + Aktion |
| Zeit-Anzeige | `role="timer"` oder `aria-live="polite"` |
| Kosten-Anzeige | `aria-live="polite"` |
| Sprach-Toggle | `aria-pressed` oder Radio-Group |
| Fokus | Sichtbarer `:focus-visible` Ring |
| Kontrast | WCAG AA für Text auf Hintergrund |

## Live Regions

```tsx
<div aria-live="polite" aria-atomic="true">
  {formatDuration(elapsedMs)}
</div>
```

Nicht `aria-live="assertive"` — würde bei jedem Tick stören.

## Kompaktmodus

- Gleiche `aria-label`s wie Normalmodus
- Buttons nicht unter 44×44 px (auch in compact)

## Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Kein pulsierender Stop-Hinweis bei `reduce`.

## Manuelle Test-Checkliste

- [ ] Nur Tastatur: Setup → Start → Pause → Stop → Stop → Ended
- [ ] VoiceOver (macOS/iOS): Zeit/Kosten werden bei Änderung angesagt (polite)
- [ ] 200% Zoom: kein horizontaler Scroll im Normalmodus
