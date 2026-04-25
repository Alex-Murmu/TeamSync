# TeamSync Frontend State Management

## 1. What This Structure Is

This project uses Zustand as a lightweight, modular store system.

State is split by domain so each area is easy to reason about:

- Auth state: authenticated user and token
- Form state: signup form and login form values/loading
- UI state: auth dialog open/close flow

This avoids one giant global store and keeps component logic clean.

## 2. Folder Tree

```text
src/
  store/
    index.ts
    types.ts
    auth/
      auth.store.ts
    forms/
      signup-form.store.ts
      login-form.store.ts
    ui/
      auth-dialog.store.ts
```

## 3. How It Works

### 3.1 Auth Store

File: src/store/auth/auth.store.ts

Responsibilities:

- Persist user session in local storage (via Zustand persist middleware)
- Track:
  - user
  - token
  - isAuthenticated
- Expose actions:
  - setAuthenticatedUser
  - updateUser
  - clearAuth

Used by:

- signup flow (after successful registration)
- login flow (after successful login)

### 3.2 Signup Form Store

File: src/store/forms/signup-form.store.ts

Responsibilities:

- Hold signup form values and loading state
- Expose field-level updates for controlled inputs
- Reset form state after successful submission

State shape:

- formData.firstName
- formData.lastName
- formData.email
- formData.password
- formData.role
- loading

### 3.3 Login Form Store

File: src/store/forms/login-form.store.ts

Responsibilities:

- Hold login form values and loading state
- Update fields incrementally
- Reset after successful login

State shape:

- formData.email
- formData.password
- loading

### 3.4 Auth Dialog UI Store

File: src/store/ui/auth-dialog.store.ts

Responsibilities:

- Coordinate open/close behavior between signup and login dialogs
- Provide switch actions:
  - switchToLogIn
  - switchToSignUp

This creates one consistent source of truth for dialog flow.

## 4. Integration Points

### 4.1 Signup Component

File: src/components/signupPage/signup-form.tsx

Now uses Zustand for:

- Dialog state via useAuthDialogStore
- Signup form fields/loading via useSignUpFormStore
- User session write via useAuthStore

### 4.2 Login Component

File: src/components/loginPage/login-form.tsx

Now uses Zustand for:

- Login form fields/loading via useLogInFormStore
- User session write via useAuthStore

### 4.3 App Flow

File: src/App.tsx

App renders structured page flow and relies on store-backed auth/forms in child components.

## 5. Why This Structure

### 5.1 Scalability

Each domain has its own store file, so new features can be added without expanding unrelated state.

### 5.2 Maintainability

State updates are centralized in store actions. Components focus on UI and submission intent only.

### 5.3 Predictability

Dialog flow and form behavior are deterministic with one source of truth per concern.

### 5.4 Reusability

Any component can consume only the slice it needs, avoiding prop drilling.

### 5.5 Performance

Zustand subscriptions are selective; components rerender only for the state they select.

## 6. Usage Pattern

Example pattern used in components:

1. Read only needed state/action from store
2. Bind inputs to store fields
3. Dispatch async request
4. Commit user data to auth store
5. Reset related form/dialog state

## 7. Future Extensions

Recommended next slices:

- project.store.ts for project list, selected project, filters
- task.store.ts for task board columns and optimistic updates
- contact.store.ts for feedback form and submission status

Keep the same pattern:

- one domain store per feature
- explicit actions
- shared types in src/store/types.ts
