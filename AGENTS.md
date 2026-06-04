# AGENTS.md — Meeting Cost Timer (MCT)

Diese Datei ist der **Einstiegspunkt für alle KI-Coding-Agenten** (Cursor, Codex, Claude Code, etc.).

## Pflichtlektüre (Reihenfolge)

1. [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — Phasen, DoD, Tests (Umsetzung)
2. [`docs/references/CODING_STANDARDS.md`](docs/references/CODING_STANDARDS.md) — Projektregeln (verbindlich)
3. [`docs/references/README.md`](docs/references/README.md) — Index aller Referenzen
4. [`docs/references/STACK.md`](docs/references/STACK.md) — Versionen & Architektur

## Vor jedem Commit / PR

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

## Cursor Rules

Automatisch geladen aus `.cursor/rules/*.mdc` — nicht duplizieren, sondern einhalten.

## Kernprinzipien (Kurz)

| Thema | Regel |
|-------|--------|
| Scope | Nur Features aus `IMPLEMENTATION_PLAN.md` |
| Domäne | Pure functions in `src/domain/`, getestet |
| Timer | Segment-basiert mit `performance.now()`, FSM in `src/timer/` |
| React | Kein `useEffect` für abgeleiteten State; Hooks-Regeln |
| UI | Mobile-first, Touch ≥ 44px, `tabular-nums` für Zeit/Geld |
| i18n | `de` / `en` über JSON-Maps, kein i18next |
| Daten | Kein Backend, keine Persistenz in v1 |
| Secrets | Nie committen; nur `VITE_*` für öffentliche Build-Vars |

## Bei Unsicherheit

- Formeln & Gruppengehälter → `docs/references/CODING_STANDARDS.md` + `IMPLEMENTATION_PLAN.md`
- Offizielle API-Details → `docs/references/EXTERNAL_DOCS.md`
- Stack-Versionen → `docs/references/STACK.md` (vor Upgrade prüfen)
