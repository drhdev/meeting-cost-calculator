# Deployment — Meeting Cost Calculator

## Coolify (empfohlen)

1. Neues Projekt in [Coolify](https://coolify.io/) anlegen
2. **Quelle:** Git-Repository `meeting-cost-calculator` verbinden
3. **Build Pack:** Docker Compose
4. **Compose-Datei:** `docker-compose.yaml` (Repository-Root)
5. **Umgebungsvariablen (Build-Zeit, alle `VITE_*`):** siehe [`.env.example`](../.env.example) — werden beim Docker-Build ins Frontend eingebettet. Wichtigste:
   - `VITE_TIPS_URL` — Link „Tipps für produktivere Meetings“
   - `VITE_DAYS_PER_YEAR`, `VITE_WEEKEND_DAYS`, `VITE_VACATION_DAYS`, `VITE_PUBLIC_HOLIDAYS` — Arbeitstage-Modell (Default → 220 Tage)
   - `VITE_WORK_DAYS_PER_YEAR` — optional direkte Override-Anzahl Arbeitstage
   - `VITE_HOURS_PER_WEEK`, `VITE_WORK_DAYS_PER_WEEK` — Stunden pro Arbeitstag (Default 7,6 h)
   - `VITE_SALARY_TARIFF`, `VITE_SALARY_NON_TARIFF`, `VITE_SALARY_EXECUTIVE`, `VITE_SALARY_BOARD` — Jahresgehälter Standard-Personas (€)
   - `MCC_PORT` — nur mit `docker-compose.local.yaml` (Default `8080`)
6. Nach Änderung an `VITE_*`: **Rebuild** nötig (kein Runtime-Reload)
7. Domain zuweisen und **HTTPS** aktivieren (Coolify Proxy)
8. Nach Deploy: `https://your-domain/` und `https://your-domain/?compact=1` testen

Coolify mappt den Container-Port 80 über den Proxy. **`docker-compose.yaml` bindet keinen Host-Port** (vermeidet z. B. `Bind for 0.0.0.0:8080 failed: port is already allocated`). Lokal mit Port-Mapping:

```bash
docker compose -f docker-compose.yaml -f docker-compose.local.yaml up --build -d
```

## Docker (manuell)

```bash
git clone <repo-url>
cd meeting-cost-calculator
docker compose up --build -d
curl -f http://localhost:8080/
```

Mit Tipps-Link beim Build:

```bash
VITE_TIPS_URL=https://your-blog.example/meeting-tips docker compose up --build -d
```

## Statisches Hosting (ohne Docker)

```bash
npm ci
VITE_TIPS_URL=https://example.com/tips npm run build
# dist/ auf nginx, S3, Netlify, etc. — SPA fallback auf index.html
```

## Healthcheck

Der Container antwortet auf `GET /` mit HTTP 200. Coolify/Docker nutzen den Healthcheck aus `docker-compose.yaml`.

## Checkliste nach Deploy

- [ ] Setup → Meeting → Doppel-Stop → Auswertung
- [ ] Kompaktmodus in kleinem Fenster
- [ ] PWA installierbar (Chrome Desktop)
- [ ] `VITE_TIPS_URL` Link öffnet korrekte Seite
