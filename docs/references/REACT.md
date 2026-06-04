# React 19 — MCT-relevante Patterns

Quellen: [react.dev](https://react.dev/learn), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

## Hooks-Regeln (strikt)

1. Nur top-level in Komponenten oder Custom Hooks
2. Nie in Bedingungen, Schleifen, nach early `return`
3. ESLint `react-hooks/exhaustive-deps` — nicht stumm schalten ohne Kommentar

## useEffect — wann ja / nein

| Situation | MCT-Ansatz |
|-----------|------------|
| `elapsedMs` aus Session berechnen | **Render** / Hook-Rückgabe |
| Kosten aus elapsed + rate | **Render** |
| Timer-Tick alle 100 ms | **useEffect** + `requestAnimationFrame` oder interval mit cleanup |
| `visibilitychange` | **useEffect** + cleanup |
| Props → State spiegeln | **Verboten** |

```tsx
// ❌ Abgeleiteter State in useEffect
useEffect(() => {
  setDisplayCost(quantize(elapsedCost));
}, [elapsedCost]);

// ✅ Direkt im Render
const displayCost = quantizeCostDisplay(elapsedCostEuro, step);
```

## State-Management in MCT

- **Session:** `useReducer` mit Actions aus `meetingTimer.ts`
- **Kein** Zustand/Redux — App klein genug
- Locale & Setup-Werte leben in derselben Session oder dediziertem Setup-State vor Start

## Komponenten-Struktur

```
App.tsx          → phase-basiertes Routing (kein react-router nötig)
SetupView        → Setup only
RunningView      → timer + controls
EndedView        → summary
```

Presentational vs Container:

- **Container:** `useMeetingTimer` in `App` oder `RunningView`
- **Presentational:** `TimeDisplay`, `CostDisplay` — nur Props

## Performance

- React Compiler / manuelles `memo` **nicht** vorschnell einsetzen
- Große Re-Renders vermeiden: Tick-State nur für Anzeige-Werte, nicht ganze Session kopieren
- `useCallback` nur wenn an stabile Child-Callbacks gebunden und Profiler es zeigt

## Strict Mode

- Dev doppelte Effects akzeptieren — Timer-Effect **idempotent** + cleanup
- Tests mit fake timers, nicht von Strict Mode abhängig

## Verbotene Patterns für MCT

- `useEffect` + `setState` für jeden Tick der **berechenbar** ist (nur Display-Tick-State ok)
- Globale Singletons für Timer
- `dangerouslySetInnerHTML`
- Class Components
