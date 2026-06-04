# Changelog

All notable changes to Meeting Cost Calculator (MCC) are documented in this file.

## [1.0.1] — 2026-06-04

### Changed

- Work-time model: **220 work days/year** (no sick days; 11 public holidays instead of 10 + 5 sick)
- Ended screen: reflection questions instead of single “Was it worth it?” line
- Calculation parameters configurable via `VITE_*` env vars (see `.env.example`)

### Added

- Custom personas in setup: own label, annual salary (€), and participant count per session (up to 12 groups)
- Light/dark theme toggle in the running timer view (defaults to system preference on load)
- Playwright E2E coverage for custom personas, theme, English UI, and pause/resume

### Changed

- Product rename from Meeting Cost Timer (MCT) to Meeting Cost Calculator (MCC); package slug `meeting-cost-calculator`
- Setup split into **Standard personas** (fixed salary models) and **Custom personas**
- Docker Compose service/env: `mcc` / `MCC_PORT` (was `mct` / `MCT_PORT`)

## [1.0.0] — 2026-06-04

### Added

- Live meeting timer with personnel cost estimation by participant group
- Groups: tariff (90k€), non-tariff (150k€), executive (300k€), board (3M€)
- Start, pause, double-stop flow with “Was it worth it?” evaluation screen
- German (default) and English UI
- Configurable cost display steps (1 / 10 / 100 / 1000 €)
- Compact mode for video conference side windows (`?compact=1`, `?view=compact`)
- PWA with offline app shell (vite-plugin-pwa / Workbox)
- Docker + docker-compose deployment for Coolify
- Vitest unit tests and Playwright E2E tests
- CI via GitHub Actions

### Model assumptions

- 220 work days per year, 38 h/week, 30 vacation, 11 public holidays (no sick days)
- Costs are estimates, not payroll-accurate
