# Funtern Deployment Guide

This repository contains:

- a `Next.js` frontend in the repo root
- an `Express + MongoDB` backend in [`D:/funtrun-2/backend`](D:/funtrun-2/backend)

## Services

### Frontend
- Framework: `Next.js 16`
- Start command: `npm run start`
- Build command: `npm run build`
- Output: `standalone`

### Backend
- Framework: `Express`
- Start command: `npm start`
- Dev command: `npm run dev`

## Environment Variables

### Frontend
Copy [.env.example](D:/funtrun-2/.env.example) and set:

```env
FUNTERN_BACKEND_URL=https://your-backend-domain.com
```

### Backend
Copy [backend/.env.example](D:/funtrun-2/backend/.env.example) and set:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=https://your-frontend-domain.com
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=uploads/resumes
CORS_ORIGIN=https://your-frontend-domain.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
ADMIN_ROLE=admin
ADMIN_JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
SERVER_PUBLIC_URL=https://your-backend-domain.com
```

## Production Checklist

1. Set strong production secrets for MongoDB, admin login, and JWT signing.
2. Ensure `CLIENT_URL` and `CORS_ORIGIN` point to the deployed frontend domain.
3. Ensure `FUNTERN_BACKEND_URL` points to the deployed backend domain.
4. Seed categories with:

```bash
cd backend
npm install
npm run seed
```

5. Start backend:

```bash
cd backend
npm install
npm start
```

6. Build and start frontend:

```bash
cd .
npm install
npm run build
npm start
```

## Health Check

Backend health endpoint:

```txt
GET /api/health
```

Expected:
- `200` when the API and MongoDB connection are healthy
- `503` when the API process is up but MongoDB is not connected

## Notes

- Resume files are currently stored on backend local disk under `uploads/resumes`.
- For multi-instance production deployments, migrate resume storage to object storage such as S3 or Cloudinary.
- The frontend build now compiles without relying on TypeScript build-error suppression.

## Performance Readiness

This repo now includes a few production-friendly performance defaults:

- backend response compression in [backend/src/app.js](D:/funtrun-2/backend/src/app.js)
- in-process TTL caching for category reads and dashboard summary reads
- capped admin pagination (`max 50`) and lighter admin list projections
- extra MongoDB indexes for common admin list filters and sorts
- server keep-alive and request-timeout tuning in [backend/src/server.js](D:/funtrun-2/backend/src/server.js)
- `ISR` for the homepage and categories proxy
- `k6` load-test starter scripts in [load-tests](D:/funtrun-2/load-tests)
- PM2 cluster config in [backend/ecosystem.config.js](D:/funtrun-2/backend/ecosystem.config.js)

### Load Testing

Install `k6`, then run:

```bash
k6 run load-tests/funtern-public.js
k6 run load-tests/funtern-spike.js
```

Set a custom target host if needed:

```bash
k6 run -e BASE_URL=https://your-frontend-domain.com load-tests/funtern-public.js
```

### Backend Cluster Mode

For a multi-core production host:

```bash
cd backend
npm install
npm run start:cluster
```

### Next Scaling Steps

The repo-level improvements are in place, but these still need real infrastructure to finish the full scale plan:

1. add Redis for shared caching and rate limiting
2. move resume files to object storage
3. put the frontend and assets behind a CDN/WAF
4. add observability (metrics, logs, traces)
