# Docker & Coolify — MCT

Quellen: [Coolify Docker Compose](https://coolify.io/docs/applications/build-packs/docker-compose)

## Image-Strategie

Multi-Stage: **Node 22 build** → **nginx alpine serve**

- Keine Host-Volumes für Source in Prod (Coolify-Konvention)
- `VITE_TIPS_URL` als **build-arg** (nicht Runtime-Secret)

## nginx SPA (`nginx.conf`)

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

## Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1
```

Coolify `docker-compose.yaml` spiegelt denselben Check.

## Coolify Setup

1. Build Pack: **Docker Compose**
2. Compose file: `docker-compose.yaml` (Repo-Root)
3. Domain + HTTPS (Coolify Proxy)
4. Env: `VITE_TIPS_URL` nur wenn beim **Build** gesetzt werden soll → Build-Args in Compose

## Lokaler Test

```bash
docker compose up --build -d
curl -f http://localhost/
curl -f "http://localhost/?compact=1"
docker compose down
```

## Anti-Patterns

- Node-Runtime-Container für statische SPA (unnötig groß)
- `nginx` latest ohne Pin — Version pinnen (`1.27-alpine`)
- Secrets in Image-Labels oder ENV zur Laufzeit für Frontend
