# Meeting Cost Timer (MCT)

**Meeting Cost Timer** zeigt live die geschätzten **Personalkosten** eines laufenden Meetings und stellt am Ende die Frage: *War es das wert?*

Ziel: Bewusstsein schaffen, ob ein Meeting mehr Wert erzeugt als es an reinen Personalkosten verursacht.

**Status:** v1.0.0 production-ready · Deploy: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) · Changelog: [`CHANGELOG.md`](CHANGELOG.md)

## Features

- Teilnehmer nach Gruppen (Tarif, AT, Leitung, Vorstand) mit festen Jahresgehalts-Modellen
- Laufende Anzeige von Zeit und Kosten
- Start · Pause · Stop (zweimal Stop = Auswertung)
- Deutsch / Englisch
- Kosten-Anzeige in Schritten von 1 / 10 / 100 / 1000 €
- Kompaktmodus für Videokonferenz-Nebenfenster
- PWA (installierbar auf Desktop/Android/iOS, wo unterstützt)
- Keine Datenspeicherung — alles läuft im Browser

## Kostenmodell

Annahmen pro Person und Jahr:

| Faktor | Wert |
|--------|------|
| Arbeitstage | 216 (365 − Wochenende − 30 Urlaub − 5 Krankheit − 10 Feiertage) |
| Arbeitszeit | 38 h/Woche → 7,6 h/Tag |
| Jahresgehälter (Modell) | Tarif 90.000 € · AT 150.000 € · Leitung 300.000 € · Vorstand 3.000.000 € |

```
Kosten pro Sekunde = Jahresgehalt ÷ (216 × 7,6 × 3600)
Meeting-Kosten = Summe(Teilnehmer × Gruppensatz) × verstrichene Sekunden
```

Die Anzeige im Meeting nutzt eine **gerundete Kosten-Anzeige** (einstellbar); die **Gesamtkosten** am Ende sind exakt (2 Dezimalstellen).

> Keine exakte Lohnabrechnung — nur eine transparente Schätzung für Reflexion.

## Nutzung

1. **Setup:** Teilnehmer pro Gruppe (`+` / `-`), Sprache, Kosten-Schrittweite wählen
2. **Meeting starten**
3. Während des Meetings: Zeit und Kosten laufen mit
4. **Pause** unterbricht die Kosten-Fortschreibung
5. **Stop** → Timer eingefroren, Hinweis „Erneut Stop zum Beenden“
6. **Stop** erneut → Auswertung mit Gesamtkosten und „War es das wert?“
7. **Neues Meeting** zurück zum Setup

## Kompaktfenster (Teams / Zoom)

```js
window.open(
  'https://your-domain.example/?compact=1',
  'mct',
  'width=340,height=220,resizable=yes'
);
```

Alias: `?view=compact`

## PWA installieren

Nach `npm run build` werden Service Worker und Web App Manifest ausgeliefert.

### Desktop / Android (Chrome, Edge)

1. App über **HTTPS** öffnen
2. Installieren via Adressleisten-Icon oder Browser-Menü

### iPhone / iPad (Safari)

1. **Teilen** → **Zum Home-Bildschirm**
2. App startet im Standalone-Modus (ohne Safari-Leiste)

**EU-Hinweis (iOS 17.4+):** In der EU kann Standalone eingeschränkt sein — dann Browser-Tab oder Kompaktfenster nutzen.

## Entwicklung

**Voraussetzung:** Node.js 22 LTS (siehe `.nvmrc`)

```bash
npm install
npm run dev          # http://127.0.0.1:5173
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run verify:production
```

| Script | Beschreibung |
|--------|--------------|
| `npm run icons` | PWA-PNGs aus `public/icons/icon-source.svg` |
| `npm run preview` | Production-Build lokal (Port 4173) |
| `npm run test:coverage` | Domain-Unit-Tests mit Coverage |

## Umgebungsvariablen

Kopiere `.env.example` nach `.env` für lokale Builds:

```
VITE_TIPS_URL=https://example.com/meeting-tips
```

`VITE_TIPS_URL` wird zur **Build-Zeit** eingebettet (öffentlich im Client-Bundle). Link erscheint auf dem Auswertungs-Screen.

## Docker & Coolify

```bash
docker compose up --build -d
curl -f http://localhost:8080/
curl -f "http://localhost:8080/?compact=1"
docker compose down
```

| Einstellung | Beschreibung |
|-------------|--------------|
| `MCT_PORT` | Host-Port (Default `8080`, Coolify mappt extern) |
| `VITE_TIPS_URL` | Build-Arg für Meeting-Tipps-Link |

**Coolify:** Build Pack → **Docker Compose** → `docker-compose.yaml` → Domain + HTTPS  
Details: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

## Production-Checks (automatisiert)

```bash
npm run test:ci           # lint, types, tests, build, PWA + bundle
npm run test:e2e          # Playwright-Flows
npm run verify:production # nach build: Manifest, SW, Bundle < 150 KB gzip
```

Manuelle Browser-Matrix: [`docs/CROSS_BROWSER_CHECKLIST.md`](docs/CROSS_BROWSER_CHECKLIST.md)

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) | Phasenplan & DoD |
| [`AGENTS.md`](AGENTS.md) | Einstieg für KI-Agenten |
| [`docs/references/`](docs/references/) | Coding Standards & Stack |

## Lizenz

[MIT](LICENSE)
