# Deployment — Meeting Cost Timer

## Coolify (empfohlen)

1. Neues Projekt in [Coolify](https://coolify.io/) anlegen
2. **Quelle:** Git-Repository `meeting-cost-timer` verbinden
3. **Build Pack:** Docker Compose
4. **Compose-Datei:** `docker-compose.yaml` (Repository-Root)
5. **Umgebungsvariablen (optional):**
   - `VITE_TIPS_URL` — URL für Meeting-Tipps (Build-Arg, öffentlich im Client)
   - `MCT_PORT` — nur relevant wenn Port-Mapping in Compose angepasst wird
6. Domain zuweisen und **HTTPS** aktivieren (Coolify Proxy)
7. Nach Deploy: `https://your-domain/` und `https://your-domain/?compact=1` testen

Coolify mappt den Container-Port 80 extern; ein festes `ports:`-Mapping in Compose ist für Produktion oft nicht nötig.

## Docker (manuell)

```bash
git clone <repo-url>
cd meeting-cost-timer
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
