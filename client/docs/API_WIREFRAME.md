# API Wireframe and Component Integration

## 1. Structured API Tree

```text
src/
  api/
    client.ts
    index.ts
    endpoints/
      auth.endpoint.ts
```

## 2. Layer Responsibilities

### 2.1 `src/api/client.ts`
- Creates a single Axios instance (`apiClient`)
- Reads base URL from `VITE_API_BASE_URL` (fallback: `/api`)
- Adds `Authorization: Bearer <token>` automatically from Zustand auth store
- Normalizes server/network errors into consistent JavaScript `Error`

### 2.2 `src/api/endpoints/auth.endpoint.ts`
- Domain-focused auth endpoints:
  - `signUp(payload)`
  - `logIn(payload)`
- Returns typed data (`AuthApiResponse`)
- Keeps raw HTTP details out of components

### 2.3 `src/api/index.ts`
- Barrel export for clean imports in components
- Usage:
  - `import { authEndpoint } from "@/api"`

## 3. How It Connects to Components

## 3.1 Signup Flow
File: `src/components/signupPage/signup-form.tsx`

Connection path:
1. Component reads form state from Zustand: `useSignUpFormStore`
2. On submit, component calls `authEndpoint.signUp(formData)`
3. Axios client attaches auth headers (if token exists)
4. Response user/token are stored via `useAuthStore`
5. Dialog closes via `useAuthDialogStore`
6. Form resets via `useSignUpFormStore.reset()`

Behavior:
- UI loading state is controlled by Zustand store
- API errors are shown through a single alert message
- Component stays focused on UI, not networking internals

## 3.2 Login Flow
File: `src/components/loginPage/login-form.tsx`

Connection path:
1. Component reads form state from Zustand: `useLogInFormStore`
2. On submit, component calls `authEndpoint.logIn(formData)`
3. Axios client executes request through shared instance
4. Response user/token are stored via `useAuthStore`
5. Dialog close is handled by parent/dialog store wiring
6. Form resets via `useLogInFormStore.reset()`

Behavior:
- Consistent API call pattern with signup
- Same error handling format
- Same auth state write path

## 4. Full Runtime Wireframe

```text
[UI Component]
  -> uses Zustand Form Store (form values/loading)
  -> calls Auth Endpoint (domain API)
     -> uses Axios Client (baseURL + interceptors + error mapper)
        -> hits backend /api/auth/*
     <- returns typed response
  -> writes session to Zustand Auth Store
  -> updates UI Dialog Store + form reset
```

## 5. Why This Structure Works

- Separation of concerns:
  - Components: render + interaction
  - Store: UI/session/form state
  - API layer: network communication
- Reusability:
  - Same Axios client reused by all future endpoints (projects, tasks, contact)
- Scalability:
  - Add new endpoint files under `src/api/endpoints` without changing component architecture
- Consistency:
  - Every component uses the same API calling convention and error model

## 6. Extension Pattern for New Endpoints

When adding another domain (e.g., projects):
1. Create `src/api/endpoints/project.endpoint.ts`
2. Export in `src/api/index.ts`
3. Call from component or action-layer function
4. Keep data state in corresponding Zustand store slice

This keeps API and state management aligned with the same structured architecture.
