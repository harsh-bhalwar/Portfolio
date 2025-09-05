# Portfolio Project (Monorepo)

This is a full-stack portfolio app organized as a monorepo with separate Backend (Node/Express/MongoDB) and Frontend (Vite/React/Tailwind) packages.

## Structure
```
portfolio_project/
├─ Backend/        # Node.js + Express + Mongoose API
└─ Frontend/       # React + Vite frontend
```

## Requirements
- Node.js >= 20
- npm >= 9

## Setup
1) Install dependencies from the repo root:
```bash
npm install
```

2) Create environment files (not committed):
- Backend/.env
```bash
PORT=5000
ORIGIN=http://localhost:5173
MONGODB_URI=your_mongo_connection_string
DATABASE_NAME=portfolio
USERNAME=admin
PASSWORD=change-me
```

- Frontend/.env
```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Scripts (run from repo root)
- Start Backend in dev:
```bash
npm run dev:backend
```
- Start Frontend in dev:
```bash
npm run dev:frontend
```
- Build Frontend for production:
```bash
npm run build:frontend
```

Alternatively, you can run inside each package:
```bash
cd Backend && npm run dev
cd Frontend && npm run dev
```

## API Base Path
The API is served under `/api/v1`. Example endpoints:
- GET /api/v1/health
- GET /api/v1/profile/get-profile
- GET /api/v1/skills/getSkills/:userId
- GET /api/v1/links/getAllLinks

Admin/protected endpoints require Basic Auth using `USERNAME` and `PASSWORD` from Backend `.env`.

## CORS
CORS `origin` is configured via `ORIGIN` (defaults to `http://localhost:5173`). Set this to the frontend URL in production.

## Deployment
- Backend: set all server and database env vars (`PORT`, `MONGODB_URI`, `DATABASE_NAME`, `USERNAME`, `PASSWORD`, `ORIGIN`). Start with `npm run start -w Backend` or use a process manager (PM2, systemd, etc.).
- Frontend: set `VITE_API_BASE_URL` to the deployed backend URL with `/api/v1` suffix, then build with `npm run build:frontend` and serve the `Frontend/dist` directory with a static host or CDN.

## Security & Git
- Secrets are never committed. Root `.gitignore` ignores `.env` files, `node_modules`, and build outputs across packages.
- Update credentials via environment only. Do not hardcode secrets in code.

## License
ISC (see package.json)
