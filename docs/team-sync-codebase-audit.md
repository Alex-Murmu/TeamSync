# TeamSync Codebase Audit

This document is a self-reference for understanding the TeamSync project from the codebase.
It follows the same intent as the project audit guide: explain what the app does, list the backend endpoints, show what each endpoint requires, and map the frontend to the backend.

## 1. Project Overview

TeamSync is a project management and team collaboration app built with:

- Backend: Express, TypeScript, Mongoose, Zod, JWT, bcrypt
- Frontend: React, TypeScript, Zustand, Axios, Vite

The current codebase is centered around:

- User authentication and profile management
- Project creation and membership management
- Task creation, assignment, update, and deletion
- A landing page and auth dialogs/forms on the client

High-level behavior:

- Admin users can create projects and tasks.
- Project admins can manage project members and tasks inside their projects.
- Regular members can only access projects/tasks they belong to or are assigned to.
- The frontend currently focuses on landing-page presentation plus sign-up and login flows.

## 2. Backend Status

### Backend structure

The backend lives in `backend/@` and is organized by responsibility:

- `server.ts` starts the app and mounts routes
- `routes/` wires endpoints to controllers
- `controllers/` holds request logic
- `validators/` contains Zod schemas
- `middleware/` contains authentication and role checks
- `model/` contains Mongoose schemas
- `utils/` contains JWT helpers

### Backend route prefixes

Mounted in `backend/@/server.ts`:

- `/api/v1/user`
- `/api/v1/projects`
- `/api/v1/tasks`

### Backend behavior summary

What is already implemented:

- JWT-based authentication
- Register and login
- User profile read/update/delete
- Project CRUD-style operations with member management
- Task CRUD-style operations with assignment and permission checks
- Central request validation with Zod

What still looks incomplete or inconsistent:

- No frontend integration for project/task APIs yet
- QnA model and validation schemas exist, but no QnA routes/controllers are wired
- `RemoveMemberFromProject` exists in the controller but is not mounted as a route
- Some frontend auth calls point to a different API path than the backend actually exposes
- Some validators and models contain naming/shape inconsistencies, so the code should be trusted over the intended design

## 3. Backend API Inventory

Total backend APIs discovered from mounted routes: 18

### User APIs

| Method | Route | Controller | Auth / Role Check | Required Input | What it does | Notes |
|---|---|---|---|---|---|---|
| POST | `/api/v1/user/register` | `RegisterUser` | No auth | Body: `firstName`, `lastName`, `email`, `password`, optional `role` | Creates a new user and returns a JWT token | Checks for duplicate email and hashes password. Role defaults to `MEMBER` in schema. |
| POST | `/api/v1/user/login` | `LoginUser` | No auth | Body: `email`, `password` | Authenticates a user and returns profile + token | Looks up user by email and compares password with bcrypt. |
| GET | `/api/v1/user/me` | `GetUserProfile` | `Authenticate` | Header: `Authorization: Bearer <token>` | Returns the current authenticated user's profile | Uses `req.user.userId` from JWT. |
| PATCH | `/api/v1/user/update` | `UpdateUserProfile` | `Authenticate` | Header auth; Body can include `firstName`, `lastName`, `role` | Updates the current user's profile | Password is not updated here even though validator allows it. |
| GET | `/api/v1/user/users` | `GetAllUsers` | `Authenticate` | Header auth | Returns all users | No role restriction is applied in the route. |
| DELETE | `/api/v1/user/delete` | `DeleteUserProfile` | `Authenticate` | Header auth | Deletes the current authenticated user | Deletes by `req.user.userId`. |

### Project APIs

| Method | Route | Controller | Auth / Role Check | Required Input | What it does | Notes |
|---|---|---|---|---|---|---|
| POST | `/api/v1/projects/` | `CreateProject` | `Authenticate` + `AuthorizationMiddleware("ADMIN")` | Body: `title`, `dueDate`, optional `description`; validator also allows optional `member` | Creates a project owned by the current admin | Checks for duplicate title before creation. Controller does not use `member` from the create schema. |
| GET | `/api/v1/projects/` | `GetAllProjects` | `Authenticate` | Header auth | Returns all projects for admins, or only projects where the user is admin/member | Admins see everything. Members see only their own projects. |
| GET | `/api/v1/projects/:id` | `GetProjectById` | `Authenticate` | Param: `id` | Returns one project by ID | Rejects access if user is not admin or member of that project. |
| PATCH | `/api/v1/projects/:id` | `UpdateProject` | `Authenticate` | Param: `id`, Body: any subset of `title`, `description`, `admin`, `member`, `dueDate` | Updates an existing project | Only the project admin can update. Validator runs before auth in the route. |
| PATCH | `/api/v1/projects/:id/member` | `AddMemberToProject` | `Authenticate` | Param: `id`, Body: `memberId` | Adds a member to a project | Checks project admin ownership and whether the user exists. |
| DELETE | `/api/v1/projects/:id` | `DeleteProject` | `Authenticate` | Param: `id` | Deletes a project | Only the project admin can delete it. |

### Task APIs

| Method | Route | Controller | Auth / Role Check | Required Input | What it does | Notes |
|---|---|---|---|---|---|---|
| POST | `/api/v1/tasks/` | `CreateTask` | `Authenticate` + `AuthorizationMiddleware("ADMIN")` | Body: `title`, `projectId`, `priority`, `dueDate`, optional `description`, optional `assignedTo`, optional `status` | Creates a task inside a project | Only the project admin can create tasks. The controller stores the project reference as `projectid`. |
| GET | `/api/v1/tasks/` | `GetAllTasks` | `Authenticate` | Header auth | Returns all tasks for admins, or only tasks related to projects the user belongs to / tasks assigned to the user | Uses project membership to scope non-admin access. |
| GET | `/api/v1/tasks/:id` | `GetTaskById` | `Authenticate` | Param: `id` | Returns one task by ID | Access is allowed if the user is admin, project member, or the assigned user. |
| PATCH | `/api/v1/tasks/:id` | `UpdateTask` | `Authenticate` | Param: `id`, Body can include `title`, `description`, `assignedTo`, `status`, `priority`, `dueDate` | Updates a task | Admins and project admins can update all fields. Assigned users can only update `status` and optional `description`. |
| PATCH | `/api/v1/tasks/:id/assign` | `AssignTask` | `Authenticate` + `AuthorizationMiddleware("ADMIN")` | Param: `id`, Body: `assignedTo` | Assigns a task to a user | User must exist and must be a project member or the project admin. Assignment resets status to `Pending`. |
| DELETE | `/api/v1/tasks/:id` | `DeleteTask` | `Authenticate` | Param: `id` | Deletes a task | Only the project admin can delete tasks. |

### Backend request checks

#### Authentication

- `Authenticate` expects the `Authorization` header in the form `Bearer <token>`.
- It verifies the token with `verifyToken` and stores decoded payload on `req.user`.

#### Role authorization

- `AuthorizationMiddleware("ADMIN")` blocks any user whose `req.user.role` is not `ADMIN`.
- This is used for creating projects and tasks, and assigning tasks.

#### Validation

- `ValidateSchema(schema)` validates `body`, `query`, and `params` together using Zod.
- If validation fails, the request gets a `400` response with flattened field errors.

### Important backend mismatches and gaps

- `RemoveMemberFromProject` exists in `project.controller.ts` but there is no route for it.
- `Qna.model.ts` and `qna.validation.ts` exist, but there are no QnA routes or controllers wired into the server.
- The route order in `project.route.ts` and `task.route.ts` applies validation before auth on create/update routes. That means body validation runs even before token checks.
- `project.route.ts` and `task.route.ts` import `AuthorizationMiddleware` with a typo in the file name (`AthorizationMiddleware` internally), but the export usage still works.
- Some controller logic expects `project.member` and `task.projectid`, so the stored field names matter even when validator names or UI names differ.

## 4. Frontend Status

### Frontend structure

The frontend lives in `client/@` and currently contains:

- A landing page shell
- Auth dialog/forms for sign up and log in
- Zustand stores for auth state and form state
- A shared Axios client with auth header injection
- A small endpoint wrapper for auth requests

### Frontend behavior summary

What is already implemented:

- A landing page made from sections such as hero, features, testimonials, contact, and footer
- A theme provider and shared layout components
- A sign-up flow with role selection, local form state, and auth store updates
- A login flow with local form state and auth store updates
- Persistent auth session storage through Zustand

What still looks incomplete or missing:

- No project dashboard, project list, task board, or task detail UI
- No frontend API wrappers for projects or tasks yet
- No frontend screens for user profile management
- The client still has a legacy auth implementation that uses raw `fetch` instead of the shared Axios endpoint layer
- The current auth endpoint paths do not match the backend route prefixes

### Frontend files and purpose

#### App and page shell

- `client/@/App.tsx` renders `LandingPage` only.
- `client/@/pages/LandingPage.tsx` composes the landing page sections and theme provider.
- `client/@/components/common/Navbar.tsx` and `client/@/components/landingpage/*` are presentation-only UI pieces.

#### Shared API layer

- `client/@/api/client.ts` creates one Axios instance.
- It reads `VITE_API_BASE_URL` and defaults to `/api`.
- It adds `Authorization` from `useAuthStore` automatically.
- It normalizes server errors into `Error` objects.

#### Auth endpoint wrapper

- `client/@/api/endpoints/auth.endpoint.ts` exposes `signUp` and `logIn`.
- It currently calls:
  - `POST /auth/register`
  - `POST /auth/login`

#### Zustand stores

- `client/@/store/auth/auth.store.ts` stores user, token, and authentication status.
- `client/@/store/forms/signup-form.store.ts` stores sign-up form values and loading state.
- `client/@/store/forms/login-form.store.ts` stores login form values and loading state.
- `client/@/store/ui/auth-dialog.store.ts` tracks whether login/signup dialogs are open.

#### Auth forms

- `client/@/components/signupPage/signup-form.tsx` is the main sign-up form currently used by the landing page.
- `client/@/components/loginPage/login-form.tsx` is the main login form used by the sign-up modal.
- `client/@/components/features/auth/SignUp/SignUpForm.tsx` and `client/@/components/features/auth/LogIn/LogInForm.tsx` are older auth components that still use raw `fetch` calls.

### Frontend-to-backend mapping

#### Current active mapping

| Frontend file | What it calls | Backend match status |
|---|---|---|
| `client/@/components/signupPage/signup-form.tsx` | `authEndpoint.signUp(formData)` | Calls `/api/auth/register`, but backend exposes `/api/v1/user/register` |
| `client/@/components/loginPage/login-form.tsx` | `authEndpoint.logIn(formData)` | Calls `/api/auth/login`, but backend exposes `/api/v1/user/login` |
| `client/@/api/client.ts` | Shared Axios client | Base URL is `/api`, so the wrapper still needs the correct route prefix |

#### Legacy mapping still present in the codebase

| Frontend file | What it calls | Backend match status |
|---|---|---|
| `client/@/components/features/auth/SignUp/SignUpForm.tsx` | `fetch("/api/auth/register")` | Does not match backend route prefix |
| `client/@/components/features/auth/LogIn/LogInForm.tsx` | `fetch("/api/auth/login")` | Does not match backend route prefix |

### Frontend codebase meaning

The frontend currently acts as a marketing/entry experience for TeamSync. It shows the product pitch and provides auth dialogs, but it does not yet expose the actual project/task workspace UI that the backend is ready to support.

## 5. Gaps and Missing Work

### Backend gaps

- Add a route for `RemoveMemberFromProject` if project member removal is required.
- Add route/controller wiring for QnA if the model and validation files are meant to be used.
- Review whether `ValidateSchema` should run before or after authentication for protected routes.
- Consider tightening `GetAllUsers` with a role restriction if not every authenticated user should see all users.
- Verify route/controller input shapes so validation fields and controller expectations stay aligned.

### Frontend gaps

- Add project and task API endpoint wrappers under `client/@/api/endpoints`.
- Add pages or panels for project list, project detail, task list, and task detail.
- Connect the frontend auth wrapper to the backend route prefix actually used by the server.
- Decide whether the legacy `fetch` auth components should be removed or replaced.
- Add profile, project, and task state stores if the UI is meant to support those flows.

### Integration mismatches to fix later

- Backend auth routes are mounted at `/api/v1/user/*`.
- Frontend auth code currently targets `/api/auth/*`.
- That means sign-up and login will not work until the client path is corrected.

## 6. Priority Next Steps

1. Fix the frontend auth URLs so they hit the backend user routes.
2. Add frontend API wrappers for projects and tasks.
3. Build the project/task UI around the existing backend permissions model.
4. Decide whether QnA is part of the product and either wire it in or remove the unused backend files.
5. Add or expose member-removal routes if project admin member management is required.

## 7. Quick Reference

### Backend at a glance

- Auth: register, login, me, update, list users, delete profile
- Projects: create, list, get one, update, add member, delete
- Tasks: create, list, get one, update, assign, delete

### Frontend at a glance

- Landing page only at the top level
- Auth modal/forms with Zustand state
- Shared Axios client already prepared for future endpoints
- No project/task workspace UI yet
