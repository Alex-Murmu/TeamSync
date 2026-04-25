# TeamSync Communication Schema Plan

This document turns the communication rules into an implementation blueprint for TeamSync.
It is meant to guide future backend work for direct messages, group chat, voice chat, and video chat while preserving the current project-based permission model.

## 1. Goal

Add user-to-user communication features where access is controlled by shared membership.
A user can only talk to another user if they share an allowed scope such as:

- the same project
- the same organization, if organizations are added later
- a group chat that already contains both users

## 2. Design Principles

- Keep communication data separate from `User`, `Project`, and `Task`.
- Use the existing TeamSync server style: `model`, `validators`, `controllers`, `routes`, `middleware`.
- Validate all request bodies with Zod before controller logic.
- Enforce membership checks on every read and write.
- Keep voice/video state as session metadata, not media storage.
- Add features in small layers instead of one large chat system.

## 3. Recommended Data Model

### 3.1 Conversation

This is the parent object for all chat types.

Purpose:
- represents one direct chat or one group chat
- stores the access scope
- stores who can participate

Suggested fields:

- `type`: `direct` or `group`
- `scopeType`: `project` or `organization` or `global` if ever needed
- `scopeId`: ObjectId of the parent scope
- `title`: optional, mainly for group chats
- `createdBy`: user ObjectId
- `members`: array of user ObjectIds
- `lastMessageAt`: date
- `lastMessageId`: optional message ObjectId
- `isArchived`: boolean
- `isLocked`: boolean for read-only or admin-controlled rooms

Notes:
- For direct chats, `members` should usually contain exactly 2 users.
- For group chats, `members` can contain many users.
- Store a normalized pair key for direct chats if you want to prevent duplicate 1:1 threads.

### 3.2 Message

This stores the actual chat content.

Suggested fields:

- `conversationId`: ObjectId
- `senderId`: user ObjectId
- `content`: string
- `contentType`: `text`, `system`, `file`, `image`, `voice-note`
- `replyToMessageId`: optional ObjectId
- `editedAt`: optional date
- `deletedAt`: optional date
- `seenBy`: array of objects or user ids with seen timestamps
- `attachments`: optional array of file metadata

Notes:
- Keep message documents independent so pagination is easy.
- Do not embed every message inside the conversation document.

### 3.3 ConversationMember

Optional if membership needs more metadata than a simple array.

Suggested fields:

- `conversationId`
- `userId`
- `role`: `member`, `admin`, `owner`
- `joinedAt`
- `lastReadAt`
- `mutedUntil`
- `leftAt`

Use this if you need:
- per-user read state
- per-user mute settings
- invite/leave history

### 3.4 CallSession

Use this for voice and video calls.

Suggested fields:

- `conversationId`
- `scopeType`
- `scopeId`
- `initiatorId`
- `type`: `voice` or `video`
- `status`: `ringing`, `active`, `ended`, `missed`, `rejected`
- `participants`: array of user ObjectIds
- `startedAt`
- `endedAt`
- `endedBy`
- `durationSeconds`
- `signalRoomId` or `rtcRoomId`

Notes:
- Store only durable session state.
- WebRTC signaling should live outside the database or in a small signaling layer.

### 3.5 Presence or Typing State

Optional and usually ephemeral.

Suggested approach:
- keep typing state in memory, Redis, or socket layer
- keep online/offline presence out of MongoDB unless you need audit history

## 4. Permission Rules

### 4.1 Direct message access

A user may open or create a direct conversation only if:

- both users share the same allowed scope, or
- the app explicitly allows the pair through a project or organization membership rule

Recommended rule for TeamSync:
- direct chat should be allowed only when both users are members of the same project or organization

### 4.2 Group chat access

A user may read or post in a group chat only if:

- they are listed in the conversation members, and
- they still belong to the conversation's parent scope if the chat is scoped to a project or organization

### 4.3 Call session access

A user may join or view a call session only if:

- they are a conversation member, or
- they are explicitly invited and authorized by the parent scope

### 4.4 Admin or owner rules

Use these for moderation actions:

- invite member
- remove member
- rename group
- archive conversation
- end call session

## 5. Suggested Backend Modules

### 5.1 Validators

Create separate Zod schemas for:

- create direct conversation
- create group conversation
- send message
- edit message
- delete message
- create call session
- join call session
- end call session
- add or remove conversation member

### 5.2 Controllers

Recommended controller responsibilities:

- create or find a direct conversation
- create group chat
- add and remove members
- send and fetch messages
- mark messages as read
- start and end voice/video sessions
- enforce membership and scope checks

### 5.3 Routes

Suggested route groups:

- `/api/v1/conversations`
- `/api/v1/conversations/:id/messages`
- `/api/v1/calls`
- `/api/v1/presence` if presence is needed

## 6. Suggested API Shape

### Conversations

- `POST /conversations` to create direct or group chat
- `GET /conversations` to list the current user's conversations
- `GET /conversations/:id` to open one conversation
- `PATCH /conversations/:id` to rename or update a group chat
- `POST /conversations/:id/members` to add members
- `DELETE /conversations/:id/members/:userId` to remove members

### Messages

- `GET /conversations/:id/messages` to paginate messages
- `POST /conversations/:id/messages` to send a new message
- `PATCH /messages/:id` to edit a message
- `DELETE /messages/:id` to soft-delete a message
- `POST /conversations/:id/read` to update read state

### Calls

- `POST /calls` to start a voice or video call
- `POST /calls/:id/join` to join a call
- `POST /calls/:id/leave` to leave a call
- `POST /calls/:id/end` to end a call

## 7. Implementation Order

Build in this order:

1. Conversation model
2. Membership checks
3. Direct message endpoints
4. Message persistence and pagination
5. Group chat endpoints
6. Call session model
7. Voice and video signaling integration
8. Presence or typing support

## 8. Recommended Storage Strategy

### MongoDB

Use MongoDB for:

- conversations
- messages
- call session records
- membership history
- read receipts if durable persistence is needed

### Real-time layer

Use sockets or a realtime service for:

- typing indicators
- online presence
- live message delivery
- call signaling

### Optional cache

Use Redis if the app later needs:

- fast presence lookups
- temporary signaling state
- rate limiting
- message delivery tracking

## 9. Frontend Impact

The frontend should eventually add:

- conversation list
- direct chat view
- group chat management UI
- message composer
- call buttons for voice/video
- presence and typing indicators

Keep API wrappers in `client/src/api/endpoints` and keep UI state in the existing Zustand pattern.

## 10. Open Questions Before Coding

Before implementation, decide:

- Should communication be project-scoped only, or should organizations be added first?
- Should direct chat be auto-created the first time two members open a profile or message action?
- Should messages be soft-deleted or hard-deleted?
- Should call sessions live in the same conversation thread or as separate records?
- Should presence be stored only in realtime memory or also in the database?

## 11. Short Recommendation

For the current TeamSync codebase, the best next step is:

- keep communication project-scoped first
- add direct conversation and group conversation models
- add message persistence
- then add call session metadata
- only add organization support after the project-scoped version works cleanly
