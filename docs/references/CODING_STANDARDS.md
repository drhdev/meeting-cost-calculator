# Coding Standards — MCT (verbindlich)

Alle Agenten und Menschen halten diese Regeln ein. Abweichungen nur nach expliziter Nutzerfreigabe.

## 1. Allgemein

- **Sprache Code:** Englisch (Dateien, Variablen, Kommentare)
- **Sprache UI:** Deutsch Standard, Englisch via i18n
- **Format:** Prettier + ESLint (keine deaktivierten Regeln ohne Kommentar)
- **Commits:** Nur auf Nutzeranweisung
- **Scope:** Minimal — keine v2-Features aus `IMPLEMENTATION_PLAN.md`

## 2. TypeScript

```json
// tsconfig — Pflicht
"strict": true,
"noUncheckedIndexedAccess": true,
"noUnusedLocals": true,
"noUnusedParameters": true
```

- **Kein `any`** — `unknown` + Narrowing oder konkrete Typen
- **Discriminated unions** für FSM-Phasen (`TimerPhase`)
- **const assertions** für Konstanten-Maps (`as const`)
- **Named exports** bevorzugen (außer `App.tsx`, `main.tsx`)
- Enums vermeiden → string-literal unions

## 3. Domänenlogik (`src/domain/`)

- **Kein** `import` aus `react`, DOM oder Browser-APIs
- **Nur** pure functions — gleiche Inputs → gleiche Outputs
- Geld: `number` in Euro (nicht Cent), Rundung nur an UI-Grenzen dokumentieren
- Formeln exakt wie in `IMPLEMENTATION_PLAN.md` — nicht „verbessern“ ohne Spec-Update

```ts
// ✅ Gut
export function getElapsedCostEuro(elapsedMs: number, ratePerSecond: number): number {
  return (elapsedMs / 1000) * ratePerSecond;
}

// ❌ Schlecht — Seiteneffekt in domain
export function tickCost(state: Session) {
  state.cost += 1;
}
```

## 4. Timer (`src/timer/`)

- Zeitbasis: **`performance.now()`** + Segmente `{ startPerf, endPerf? }`
- **Kein** alleiniger `setInterval`-Drift für elapsed
- Tick-Loop nur bei `phase === 'running'`; Cleanup in `useEffect` return
- Page Visibility: elapsed aus Segmenten neu berechnen, nicht pausieren (Meetings laufen weiter)

## 5. React-Komponenten

- Funktionale Komponenten + Hooks
- **Kein** `useEffect` für:
  - abgeleiteten State (Zeit/Kosten aus Session berechnen im Render)
  - Event-Reaktionen (→ Handler)
  - Daten-Fetch (gibt es nicht in v1)
- **Erlaubt** `useEffect`: Timer-Tick, Visibility-Listener (mit cleanup)
- Props: explizite Interfaces, keine `children` unless needed
- Komponenten < ~150 Zeilen — sonst splitten

## 6. Styling (Tailwind v4)

- `@import "tailwindcss";` in `src/index.css`
- Design-Tokens in `@theme { }` — keine `tailwind.config.js` in v4
- Zeit & Geld: `tabular-nums`, `font-mono` oder semantische Token
- Touch-Targets: min **44×44 px**
- Kompaktmodus: Klasse `compact` am Root oder `[data-compact="true"]`

## 7. i18n

- Keys: `bereich.unterbereich` (z. B. `ended.worthIt`)
- Keine hardcodierten UI-Strings in Komponenten
- `t(key)` aus Hook; Locale in Session-State

## 8. Barrierefreiheit

- Buttons: `aria-label` wenn kein sichtbarer Text
- Live-Anzeigen: `aria-live="polite"` auf Zeit + Kosten
- Fokus sichtbar; `prefers-reduced-motion` respektieren
- Siehe [ACCESSIBILITY.md](./ACCESSIBILITY.md)

## 9. Tests

| Layer | Tool | Was testen |
|-------|------|------------|
| domain | Vitest | Formeln, Quantize, Format |
| timer | Vitest + fake timers | FSM, pause, double-stop |
| components | RTL + jsdom | User-sichtbares Verhalten |
| flows | Playwright | Setup → meeting → ended |

- **Keine** Implementation-Details (interner State-Namen)
- Queries: `getByRole` > `getByLabelText` > `getByText`
- Coverage-Ziel `domain/`: ≥ 95 %

## 10. Datei- & Namenskonventionen

| Artefakt | Muster |
|----------|--------|
| Komponente | `PascalCase.tsx` |
| Hook | `useCamelCase.ts` |
| Pure logic | `camelCase.ts` |
| Test | `*.test.ts(x)` neben Source oder in gleichem Ordner |
| E2E | `e2e/*.spec.ts` |

## 11. Git & Security

- Keine `.env` mit Secrets im Repo — nur `.env.example`
- Keine API-Keys; `VITE_TIPS_URL` ist öffentlich
- nginx Security-Headers in Docker (siehe `DOCKER.md`)

## 12. UX-Produktregeln

- Start nur mit ≥ 1 Teilnehmer
- Doppel-Stop mit sichtbarem Hinweis
- Disclaimer Modell-Schätzung sichtbar (Setup oder Footer)
- Kompakt-URL: `?compact=1`
