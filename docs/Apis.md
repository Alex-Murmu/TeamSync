# TeamSync Backend API Documentation

**Base URL:** `/api/v1`

## Standard Response

### Success
```json
{
    "success": true,
    "message": "Request completed successfully",
    "data": {}
}
```

### Error
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": []
}
```

## Authentication

Most protected routes require:

```http
Authorization: Bearer <accessToken>
```

---

## 1. User Auth

### 1.1 Register
**POST** `/api/v1/user/register`

**Body**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "role": "user|admin"
}
```

**Expected**
- `name` required
- `email` required and valid
- `password` required
- `confirmPassword` required and must match `password`

---

### 1.2 Login
**POST** `/api/v1/user/login`

**Body**
```json
{
    "email": "john@example.com",
    "password": "Password@123"
}
```

---

### 1.3 Logout
**POST** `/api/v1/user/logout`

**Auth required:** Yes

---

### 1.4 Get Current User
**GET** `/api/v1/user/me`

**Auth required:** Yes

---

### 1.5 Update Current User
**PATCH** `/api/v1/user/me`

**Auth required:** Yes

**Body**
```json
{
    "name": "John Updated",
    "avatar": "https://example.com/avatar.png"
}
```

---

### 1.6 Forgot Password
**POST** `/api/v1/user/forgot-password`

**Body**
```json
{
    "email": "john@example.com"
}
```

---

### 1.7 Reset Password
**POST** `/api/v1/user/reset-password`

**Body**
```json
{
    "token": "reset-token",
    "newPassword": "NewPassword@123",
    "confirmPassword": "NewPassword@123"
}
```

---

## 2) Users

### 2.1 Get All Users
**GET** `/api/v1/users`

**Auth required:** Yes

---

### 2.2 Get User by ID
**GET** `/api/v1/users/:userId`

**Auth required:** Yes

---

### 2.3 Update User by ID
**PATCH** `/api/v1/users/:userId`

**Auth required:** Yes

**Body**
```json
{
    "name": "Updated Name",
    "role": "member",
    "isActive": true
}
```

---

### 2.4 Delete User
**DELETE** `/api/v1/users/:userId`

**Auth required:** Yes

---

## 3) Teams

### 3.1 Create Team
**POST** `/api/v1/teams`

**Auth required:** Yes

**Body**
```json
{
    "name": "Frontend Team",
    "description": "Team for UI work"
}
```

---

### 3.2 Get All Teams
**GET** `/api/v1/teams`

**Auth required:** Yes

---

### 3.3 Get Team by ID
**GET** `/api/v1/teams/:teamId`

**Auth required:** Yes

---

### 3.4 Update Team
**PATCH** `/api/v1/teams/:teamId`

**Auth required:** Yes

**Body**
```json
{
    "name": "Updated Team Name",
    "description": "Updated description"
}
```

---

### 3.5 Delete Team
**DELETE** `/api/v1/teams/:teamId`

**Auth required:** Yes

---

### 3.6 Add Member to Team
**POST** `/api/v1/teams/:teamId/members`

**Auth required:** Yes

**Body**
```json
{
    "userId": "user_123"
}
```

---

### 3.7 Remove Member from Team
**DELETE** `/api/v1/teams/:teamId/members/:userId`

**Auth required:** Yes

---

## 4) Projects

### 4.1 Create Project
**POST** `/api/v1/projects`

**Auth required:** Yes

**Body**
```json
{
    "teamId": "team_123",
    "name": "Website Revamp",
    "description": "Main website redesign",
    "status": "active"
}
```

---

### 4.2 Get All Projects
**GET** `/api/v1/projects`

**Auth required:** Yes

---

### 4.3 Get Project by ID
**GET** `/api/v1/projects/:projectId`

**Auth required:** Yes

---

### 4.4 Update Project
**PATCH** `/api/v1/projects/:projectId`

**Auth required:** Yes

**Body**
```json
{
    "name": "New Project Name",
    "description": "Updated project description",
    "status": "completed"
}
```

---

### 4.5 Delete Project
**DELETE** `/api/v1/projects/:projectId`

**Auth required:** Yes

---

## 5) Tasks

### 5.1 Create Task
**POST** `/api/v1/tasks`

**Auth required:** Yes

**Body**
```json
{
    "projectId": "project_123",
    "teamId": "team_123",
    "title": "Design homepage",
    "description": "Create the homepage layout",
    "priority": "high",
    "dueDate": "2026-05-01",
    "assigneeId": "user_123"
}
```

---

### 5.2 Get All Tasks
**GET** `/api/v1/tasks`

**Auth required:** Yes

**Query Examples**
- `?projectId=project_123`
- `?teamId=team_123`
- `?status=todo`
- `?assigneeId=user_123`

---

### 5.3 Get Task by ID
**GET** `/api/v1/tasks/:taskId`

**Auth required:** Yes

---

### 5.4 Update Task
**PATCH** `/api/v1/tasks/:taskId`

**Auth required:** Yes

**Body**
```json
{
    "title": "Updated task title",
    "description": "Updated description",
    "priority": "medium",
    "dueDate": "2026-05-10"
}
```

---

### 5.5 Update Task Status
**PATCH** `/api/v1/tasks/:taskId/status`

**Auth required:** Yes

**Body**
```json
{
    "status": "in-progress"
}
```

**Allowed status values**
- `todo`
- `in-progress`
- `review`
- `done`

---

### 5.6 Assign Task
**PATCH** `/api/v1/tasks/:taskId/assign`

**Auth required:** Yes

**Body**
```json
{
    "assigneeId": "user_123"
}
```

---

### 5.7 Delete Task
**DELETE** `/api/v1/tasks/:taskId`

**Auth required:** Yes

---

## 6) Comments

### 6.1 Add Comment
**POST** `/api/v1/tasks/:taskId/comments`

**Auth required:** Yes

**Body**
```json
{
    "content": "Please review this task"
}
```

---

### 6.2 Get Comments
**GET** `/api/v1/tasks/:taskId/comments`

**Auth required:** Yes

---

### 6.3 Delete Comment
**DELETE** `/api/v1/tasks/:taskId/comments/:commentId`

**Auth required:** Yes

---

## 7) Notifications

### 7.1 Get Notifications
**GET** `/api/v1/notifications`

**Auth required:** Yes

---

### 7.2 Mark Notification as Read
**PATCH** `/api/v1/notifications/:notificationId/read`

**Auth required:** Yes

---

### 7.3 Mark All Notifications as Read
**PATCH** `/api/v1/notifications/read-all`

**Auth required:** Yes

---

## Common HTTP Status Codes

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

## Notes

- All request bodies must be sent as `application/json`.
- Protected routes require a valid Bearer token.
- IDs should be replaced with real database IDs such as `userId`, `teamId`, `projectId`, `taskId`.
