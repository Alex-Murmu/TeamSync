# AGENTS.md

## Scope
These instructions apply to the entire TeamSync workspace.

## Quick Start
- Use `pnpm` for all package management in both apps (lockfiles are committed).
- Work in app-local terminals:
- Backend: `cd backend`
- Client: `cd client`

## Setup Prerequisites
- Backend environment variables:
- `TEAM_SYNC_DB_URL` (required by DB connection)
- `PORT` (server listen port)
- Client environment variable:
- `VITE_API_BASE_URL` (optional, defaults to `/api` in Axios client)

## Run, Build, Lint
- Backend scripts (`backend/package.json`):
- `pnpm dev` -> `tsx watch ./src/server.ts`
- `pnpm build` -> `tsc`
- `pnpm start` -> `node ./dist/server.js`
- Client scripts (`client/package.json`):
- `pnpm dev` -> `vite`
- `pnpm build` -> `tsc -b && vite build`
- `pnpm lint` -> `eslint .`
- `pnpm preview` -> `vite preview`
- There are no test scripts configured yet in either app.

## Architecture Map
- Backend (`backend/src`): Express + TypeScript + Mongoose.
- Route prefixes are mounted in `backend/src/server.ts`:
- `/api/v1/user`
- `/api/v1/projects`
- `/api/v1/tasks`
- Backend flow is route -> validator middleware -> auth/role middleware -> controller -> model.
- Frontend (`client/src`): React + TypeScript + Zustand + Axios.
- API client is centralized in `client/src/api/client.ts`.
- Frontend path alias `@/*` maps to `client/src/*`.

## Project Conventions
- Backend uses strict TypeScript with NodeNext module settings (`backend/tsconfig.json`).
- Client uses strict-ish linting via TypeScript compiler flags (`client/tsconfig.app.json`):
- `noUnusedLocals`
- `noUnusedParameters`
- Prefer Zod schema validation for request and form boundaries.
- Keep API integrations in `client/src/api/endpoints` and avoid direct Axios usage inside UI components.
- Keep frontend state in domain stores under `client/src/store` (`auth`, `forms`, `ui`).

## High-Value References (Link, Do Not Duplicate)
- API and auth flow wireframe: [client/docs/API_WIREFRAME.md](client/docs/API_WIREFRAME.md)
- Frontend state architecture: [client/docs/STATE_MANAGEMENT.md](client/docs/STATE_MANAGEMENT.md)
- Vite/React client baseline notes: [client/README.md](client/README.md)

## Safe Editing Notes For Agents
- Preserve existing route prefixes and response shapes unless explicitly requested.
- Do not introduce npm/yarn commands into this repo; stick to `pnpm`.
- Keep backend imports compatible with NodeNext/ESM style already used.
- If adding new backend features, follow existing file grouping:
- `validators` for Zod schemas
- `controllers` for handlers
- `routes` for endpoint wiring
- `model` for Mongoose schemas
