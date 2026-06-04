# Changelog

All notable changes to Meeting Cost Timer (MCT) are documented in this file.

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

- 216 work days per year, 38 h/week, 30 vacation, 5 sick, 10 public holidays
- Costs are estimates, not payroll-accurate
