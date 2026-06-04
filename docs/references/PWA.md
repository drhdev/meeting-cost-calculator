# PWA — MCC (vite-plugin-pwa)

Quellen: [vite-pwa Guide](https://vite-pwa-org.netlify.app/guide/), [web.dev/learn/pwa](https://web.dev/learn/pwa/)

## Strategie für MCC

| Aspekt | Wahl |
|--------|------|
| SW-Strategie | `generateSW` (Default) — kein custom SW in v1 |
| registerType | `autoUpdate` |
| Offline | App-Shell + Assets precachen |
| Daten | Keine Sync/API — kein Background Sync nötig |

## Empfohlene Konfiguration

```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'icons/*.png'],
  manifest: {
    name: 'Meeting Cost Calculator',
    short_name: 'MCC',
    display: 'standalone',
    start_url: '/',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    icons: [/* 192, 512, maskable */],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    navigateFallback: 'index.html',
  },
})
```

## iOS

- `apple-touch-icon` in `public/` (180×180)
- Installation manuell (Share → Home Screen) — in README
- **EU iOS 17.4+:** Standalone eingeschränkt — Fallback dokumentieren ([firt.dev](https://firt.dev/notes/pwa-ios/))
- Splash: optional `apple-touch-startup-image` — nur wenn `apple-mobile-web-app-capable` gesetzt (legacy; Manifest `standalone` reicht meist)

## Android / Desktop

- Manifest + SW → Install-Prompt wo unterstützt
- Chrome Lighthouse PWA-Kategorie als Release-Gate

## Dev

```ts
devOptions: { enabled: true }  // nur zum Testen des SW in dev
```

In CI/Prod nicht nötig; für lokales PWA-Debugging ok.

## Verboten / vermeiden

- Legacy `<meta apple-mobile-web-app-capable>` **ohne** Manifest (web.dev: kann Installation stören)
- Push Notifications in v1 (nicht gefordert)
- `injectManifest` ohne Team-Erfahrung

## Test-Checkliste

- [ ] `npm run build` → `dist/sw.js` oder Workbox-generiertes SW
- [ ] Manifest unter Application tab (Chrome)
- [ ] Offline: nach erstem Load Shell erreichbar
- [ ] `npm run preview` + Lighthouse PWA
