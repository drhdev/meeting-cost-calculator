# Externe Dokumentation — Offizielle Quellen

Bei Implementierung und Upgrades **primär diese Quellen** nutzen, nicht veraltete Blog-Posts.

## Build & Tooling

| Thema | URL |
|-------|-----|
| Vite — Getting Started | https://vite.dev/guide/ |
| Vite — Config | https://vite.dev/config/ |
| Vite — Build for Production | https://vite.dev/guide/build.html |
| Vite 8 Announcement | https://vite.dev/blog/announcing-vite8 |
| @vitejs/plugin-react | https://github.com/vitejs/vite-plugin-react |

## React

| Thema | URL |
|-------|-----|
| React Docs (Learn) | https://react.dev/learn |
| Rules of Hooks | https://react.dev/reference/rules/rules-of-hooks |
| useEffect | https://react.dev/reference/react/useEffect |
| useReducer | https://react.dev/reference/react/useReducer |
| TypeScript — React | https://react.dev/learn/typescript |

## TypeScript

| Thema | URL |
|-------|-----|
| TSConfig Reference | https://www.typescriptlang.org/tsconfig |
| Strict Options | https://www.typescriptlang.org/tsconfig#strict |

## Styling

| Thema | URL |
|-------|-----|
| Tailwind — Install with Vite | https://tailwindcss.com/docs/installation/using-vite |
| Tailwind v4 Blog | https://tailwindcss.com/blog/tailwindcss-v4 |
| `@theme` / Theme variables | https://tailwindcss.com/docs/theme |

## PWA

| Thema | URL |
|-------|-----|
| vite-plugin-pwa — Guide | https://vite-pwa-org.netlify.app/guide/ |
| vite-plugin-pwa — Config | https://vite-pwa-org.netlify.app/guide/configuration.html |
| Web.dev — Learn PWA | https://web.dev/learn/pwa/ |
| Web App Manifest (MDN) | https://developer.mozilla.org/en-US/docs/Web/Manifest |
| Workbox | https://developer.chrome.com/docs/workbox/ |
| iOS PWA Compatibility | https://firt.dev/notes/pwa-ios/ |

## Testing

| Thema | URL |
|-------|-----|
| Vitest — Getting Started | https://vitest.dev/guide/ |
| Vitest — Browser / Component | https://vitest.dev/guide/browser/component-testing |
| Testing Library — Guiding Principles | https://testing-library.com/docs/guiding-principles |
| React Testing Library | https://testing-library.com/docs/react-testing-library/intro |
| Playwright — Intro | https://playwright.dev/docs/intro |
| Playwright — Best Practices | https://playwright.dev/docs/best-practices |

## Lint & Format

| Thema | URL |
|-------|-----|
| ESLint Flat Config | https://eslint.org/docs/latest/use/configure/configuration-files |
| typescript-eslint | https://typescript-eslint.io/getting-started |
| eslint-plugin-react-hooks | https://www.npmjs.com/package/eslint-plugin-react-hooks |

## Deploy

| Thema | URL |
|-------|-----|
| nginx — try_files (SPA) | https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files |
| Coolify — Docker Compose | https://coolify.io/docs/applications/build-packs/docker-compose |
| Coolify — Static / Vite | https://coolify.io/docs/applications/build-packs/static |

## Accessibility

| Thema | URL |
|-------|-----|
| WCAG 2.2 Quick Reference | https://www.w3.org/WAI/WCAG22/quickref/ |
| WAI-ARIA — live regions | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions |

## Upgrade-Checkliste

1. Release Notes des Pakets lesen
2. `STACK.md` + `package.json` anpassen
3. `npm run test:ci` + E2E + Docker-Build
4. PWA/Manifest bei Major-Upgrades manuell prüfen
