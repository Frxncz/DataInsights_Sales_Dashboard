# Deployment Guide

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Production Build](#production-build)
- [Deployment Platforms](#deployment-platforms)
- [Environment Setup](#environment-setup)
- [Domain & SSL](#domain--ssl)
- [Monitoring & Logs](#monitoring--logs)
- [Performance Optimization](#performance-optimization)
- [Rollback Procedures](#rollback-procedures)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] ESLint check passes: `npm run lint`
- [ ] No hardcoded credentials
- [ ] `.env.local` not committed
- [ ] All features tested locally

### Security

- [ ] Environment variables configured
- [ ] Supabase RLS enabled
- [ ] API keys rotated
- [ ] CORS configured correctly
- [ ] No sensitive data in client code
- [ ] Dependencies up-to-date

### Performance

- [ ] Bundle size checked
- [ ] Images optimized
- [ ] API queries efficient
- [ ] No memory leaks
- [ ] Load time < 3 seconds

### Documentation

- [ ] README updated
- [ ] Environment variables documented
- [ ] Deployment steps clear
- [ ] Rollback plan documented
- [ ] Error handling documented

---

## Production Build

### Step 1: Build Process

```bash
# Navigate to frontend
cd frontend

# Install dependencies (fresh)
rm -rf node_modules package-lock.json
npm install

# Run linting
npm run lint

# Create production build
npm run build
```

**Expected output:**

```
vite v8.0.1 building for production...
✓ 1234 modules transformed
dist/index.html                 0.48 kB
dist/assets/index-abc123.js   125.34 kB / gzip: 35.89 kB
dist/assets/index-def456.css   12.45 kB / gzip: 2.34 kB

✓ built in 12.34s
```

### Step 2: Verify Build

```bash
# Preview production build locally
npm run preview
```

Open `http://localhost:4173/` and verify:

- ✅ All charts load
- ✅ Data displays correctly
- ✅ No console errors
- ✅ Responsive design works
- ✅ Performance acceptable

### Step 3: Optimize Build

**Bundle Analysis:**

```bash
npm install -g vite-bundle-visualizer
npm run build -- --analyze
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is optimized for Vite/React applications.

#### Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel
```

#### Configuration (vercel.json)

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  }
}
```

#### Add Environment Variables

```bash
# Via CLI
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Or via dashboard:
# 1. Go to Project Settings → Environment Variables
# 2. Add each variable
# 3. Redeploy
```

#### Deploy

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

**URL**: Your deployment will be available at:

- Preview: `https://[project]-[random].vercel.app`
- Production: `https://your-custom-domain.com`

---

### Option 2: Netlify

#### Initial Setup

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
cd frontend
netlify init
```

#### Configuration (netlify.toml)

Create `frontend/netlify.toml`:

```toml
[build]
command = "npm run build"
publish = "dist"

[env]
VITE_SUPABASE_URL = "@vite_supabase_url"
VITE_SUPABASE_ANON_KEY = "@vite_supabase_anon_key"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[functions]
directory = "netlify/functions"

[[headers]]
for = "/assets/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
for = "/"
[headers.values]
Cache-Control = "public, max-age=3600, must-revalidate"
```

#### Set Environment Variables

```bash
# Via CLI
netlify env:set VITE_SUPABASE_URL "your_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_key"

# Or via dashboard:
# 1. Site settings → Build & deploy → Environment
# 2. Add variables
# 3. Trigger redeploy
```

#### Deploy

```bash
# Production deployment
netlify deploy --prod

# Preview deployment
netlify deploy
```

---

### Option 3: GitHub Pages

For free hosting (with limitations).

#### Step 1: Update vite.config.js

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/DataInsights_Sales_Dashboard/", // Your repo name
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://yourproject.supabase.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

#### Step 2: Add GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Build
        working-directory: ./frontend
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

#### Step 3: Add Secrets

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add `VITE_SUPABASE_URL`
3. Add `VITE_SUPABASE_ANON_KEY`

#### Step 4: Push to trigger deployment

```bash
git push origin main
```

URL: `https://yourusername.github.io/DataInsights_Sales_Dashboard/`

---

### Option 4: Docker & Docker Compose

For self-hosted or cloud deployments.

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript;
}
```

#### Build & Run

```bash
# Build image
docker build \
  --build-arg VITE_SUPABASE_URL="your_url" \
  --build-arg VITE_SUPABASE_ANON_KEY="your_key" \
  -t sales-dashboard:latest .

# Run container
docker run -p 80:80 sales-dashboard:latest
```

---

## Environment Setup

### Environment Variables by Platform

#### Vercel

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### Netlify

```bash
netlify env:set VITE_SUPABASE_URL "value"
netlify env:set VITE_SUPABASE_ANON_KEY "value"
```

#### Docker

```bash
docker run \
  -e VITE_SUPABASE_URL="your_url" \
  -e VITE_SUPABASE_ANON_KEY="your_key" \
  sales-dashboard:latest
```

#### GitHub Pages

```yaml
# In .github/workflows/deploy.yml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### Production Checklist

- [ ] Non-test environment variables set
- [ ] API keys are for production/external access
- [ ] Supabase RLS enabled
- [ ] CORS whitelist configured
- [ ] Rate limiting enabled
- [ ] Monitoring configured

---

## Domain & SSL

### Connect Custom Domain

#### Vercel

1. Project Settings → Domains
2. Add custom domain
3. Update DNS records (follow instructions)
4. SSL auto-provisioned

#### Netlify

1. Site settings → Domain management
2. Add custom domain
3. Configure DNS (automatic or manual)
4. SSL auto-provisioned

#### AWS Route53

```bash
# Create record
aws route53 change-resource-record-sets \
  --hosted-zone-id ZXXXXX \
  --change-batch file://change-batch.json

# change-batch.json:
{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "dashboard.example.com",
      "Type": "A",
      "TTL": 300,
      "ResourceRecords": [{"Value": "your-ip"}]
    }
  }]
}
```

---

## Monitoring & Logs

### Application Performance Monitoring

#### Sentry (Error Tracking)

```bash
npm install --save @sentry/react
```

Add to `App.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: "production",
});
```

#### Google Analytics

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### View Logs

#### Vercel

```bash
# Stream logs
vercel logs

# View deployment logs
vercel logs --follow
```

#### Netlify

```bash
# View logs
netlify logs:function

# Stream logs
netlify logs:function --follow
```

#### Supabase

Dashboard → Database → Logs or Analytics

---

## Performance Optimization

### Image Optimization

```javascript
// Use lazy loading
<img loading="lazy" src="..." alt="..." />

// Or use WebP
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="..." />
</picture>
```

### Code Splitting

Vite automatically chunks large dependencies:

```javascript
// Lazy load components
const DealSizePieChart = lazy(() => import("./components/DealSizePieChart"));
```

### Cache Strategy

```javascript
// Cache API responses
const cache = new Map();

async function fetchWithCache(key, fn) {
  if (cache.has(key)) return cache.get(key);
  const data = await fn();
  cache.set(key, data);
  return data;
}
```

### Bundle Analysis

Check size and optimize:

```bash
npm install -g vite-plugin-visualizer
npm run build
# View dist/stats.html
```

---

## Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel list

# Rollback to previous
vercel rollback
```

Or via dashboard:

1. Deployments tab
2. Click on previous deployment
3. "Promote to production"

### Netlify Rollback

1. Deploys tab
2. Select previous deploy
3. "Publish deploy"

### Manual Rollback

```bash
# Git revert
git revert HEAD
git push origin main

# Rebuild will trigger automatically
```

### Data Rollback

If data was accidentally modified:

1. **Supabase backup**:
   - Dashboard → Backups
   - Select restore point
   - Confirm restore

2. **Manual restore**:
   ```sql
   -- Restore from backup
   RESTORE DATABASE sales_db
   FROM DISK = '/backups/sales_db_backup.bak'
   ```

---

## Deployment Troubleshooting

| Issue                     | Solution                                     |
| ------------------------- | -------------------------------------------- |
| Build fails               | Check logs, verify env vars, npm cache clean |
| 404 on routes             | Configure SPA routing in server              |
| Slow load times           | Check bundle size, enable gzip compression   |
| Database connection fails | Verify credentials, check network access     |
| CSS not loading           | Check base path in vite.config.js            |

---

## Performance Benchmarks

### Target Metrics

| Metric                         | Target         | How to Check       |
| ------------------------------ | -------------- | ------------------ |
| First Contentful Paint (FCP)   | < 1.5s         | Lighthouse         |
| Largest Contentful Paint (LCP) | < 2.5s         | PageSpeed Insights |
| Cumulative Layout Shift (CLS)  | < 0.1          | DevTools           |
| Bundle Size                    | < 150KB (gzip) | `npm run build`    |
| API Response                   | < 500ms        | Network tab        |

---

For more information, see:

- [README.md](../README.md)
- [SETUP.md](SETUP.md)
- [DATABASE.md](DATABASE.md)
