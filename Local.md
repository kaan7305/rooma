# ROOMA - Local Completion Checklist

> Tracks all incomplete local work — code TODOs, missing integrations, and unwired services.
> Status: `[ ]` Not done | `[~]` In progress | `[x]` Done

---

## 1. Blocking: Backend Build Failure

- [x] **Fix TypeScript compilation error**
  - Fixed by excluding `src/__tests__/` from tsconfig build
  - Backend now compiles cleanly with `tsc --noEmit`

---

## 2. Backend: Incomplete Service Logic (TODOs in Code)

### 2.1 Booking Service (`backend/src/services/booking.service.ts`)

- [x] Send notification to host when a new booking request is created
- [x] Auto-create conversation between guest and host on booking
- [x] Send notification to guest when booking is accepted
- [x] Create calendar entries (blocked dates) for accepted bookings
- [x] Send booking confirmation email to guest on acceptance
- [x] Send notification to guest when booking is declined
- [x] Process refund if payment was already made on decline
- [x] Implement cancellation policy logic to calculate refund amount:
  - Flexible: 100% refund if cancelled 1+ days before check-in
  - Moderate: 100% refund if cancelled 5+ days before check-in
  - Strict: 50% refund if cancelled 7+ days before check-in
- [x] Process refund based on cancellation policy
- [x] Send cancellation notifications to both guest and host
- [x] Clear calendar entries for cancelled bookings

### 2.2 Review Service (`backend/src/services/review.service.ts`)

- [x] Send notification to reviewee when a new review is posted
- [x] Recalculate and update property average ratings on new review
- [x] Send notification to reviewer when host responds to their review

### 2.3 User Service (`backend/src/services/user.service.ts`)

- [x] Implement phone verification with code generation and validation
  - Added `requestPhoneCode` — generates 6-digit code, stores in-memory with 10min TTL
  - Updated `verifyPhone` — validates code, checks expiry, marks phone as verified
  - Added `POST /api/users/request-phone-code` route and controller
  - Code logged to console in dev (swap for Twilio SMS in production)

---

## 3. Backend: Services Installed but Not Wired

### 3.1 Socket.io (Real-Time Messaging)

- [x] Create `backend/src/socket/index.ts` with server setup
- [x] Initialize Socket.io server attached to HTTP server in `server.ts`
- [x] Add JWT authentication middleware for socket connections
- [x] Implement messaging events: `send_message`, `typing_start`, `typing_stop`, `message_read`
- [x] Implement room-based conversations (`join_conversation`, `leave_conversation`)
- [x] Handle user presence (online/offline tracking via `onlineUsers` Map)
- [x] Handle connection/disconnection with user-to-socket mapping
- [x] Export `emitToUser` and `getOnlineUserIds` utilities

### 3.2 Redis (Caching)

- [x] Create Redis connection in `backend/src/config/redis.ts` with graceful degradation
- [x] Cache utility: `cache.get()`, `cache.set()`, `cache.del()`, `cache.delPattern()`
- [x] Cache property search results (TTL: 5 min)
- [x] Cache property details (TTL: 10 min, for non-authenticated views)
- [x] Add cache invalidation on `updateProperty` and `deleteProperty`
- [x] TTL constants defined: PROPERTY_SEARCH, PROPERTY_DETAIL, USER_PROFILE, UNIVERSITY_LIST, AMENITY_LIST
- [ ] Cache university list (TTL: 24h) — ready to add when university service is accessed
- [ ] Cache amenity list (TTL: 24h) — ready to add when amenity service is accessed

### 3.3 Rate Limiting

- [x] Import and configure `express-rate-limit` in `backend/src/routes/index.ts`
- [x] Apply strict limits to auth endpoints (20/15min via `authLimiter`)
- [x] Apply forgot-password limit (3/hour via `forgotPasswordLimiter` in `auth.routes.ts`)
- [x] Apply write limits to bookings, reviews, payments, payouts, uploads (30/min)
- [x] Apply general API limit (100/min)
- [x] Return standard rate limit headers (`RateLimit-*`)

---

## 4. Frontend: Missing API Integrations (TODOs in Code)

### 4.1 Student Verification (`frontend/app/student-verification/page.tsx`)

- [x] Submit verification data to `POST /users/upload-student-id` via `apiClient`
- [x] Added university email field (required by backend)
- [x] SheerID button now shows "not yet available" gracefully (no broken API call)
- [ ] Wire actual SheerID API when account is set up

### 4.2 Identity Verification (`frontend/app/verify/page.tsx`)

- [x] Submit ID data to `POST /users/upload-government-id` via `apiClient`
- [x] Added ID type selector (passport, driver's license, national ID)
- [ ] Wire actual file upload to storage service (currently uses placeholder URLs)

---

## 5. Frontend: Replace Mock Data with Real API Calls

### 5.1 Host Dashboard (`frontend/lib/host-store.ts`)

- [x] Replace `mockProperties` with API call to `GET /properties/my-listings`
- [x] Replace `mockBookingRequests` with API call to `GET /bookings/host-requests`
- [x] Revenue data calculated from API properties; kept as compute-from-properties pattern

### 5.2 Payment Store (`frontend/lib/payment-store.ts`)

- [x] Replace `mockPaymentMethods` with API call to `GET /payments/methods`
- [x] Replace `mockTransactions` with API call to `GET /payments/transactions`
- [x] Falls back gracefully if API unavailable

### 5.3 Wishlist Store (`frontend/lib/wishlist-store.ts`)

- [x] Try `GET /wishlists` API first, fall back to localStorage
- [x] Removed hardcoded mock collections
- [x] Local add/remove operations still persist to localStorage as backup

### 5.4 Property Data (`frontend/data/properties.ts`)

- [x] Added `fetchProperties()` — API search with fallback to `allProperties`
- [x] Added `fetchPropertyById()` — single property API fetch with fallback
- [x] Added `mapApiProperty()` to convert API response to `Property` type
- [x] Updated search page to use `fetchProperties()` for results
- [x] Updated property detail page to use `fetchPropertyById()`
- [x] Mock data kept as fallback for offline/development use

---

## 6. Frontend: WebSocket Client Integration

- [x] Update `frontend/lib/websocket-context.tsx` with full Socket.io client implementation
- [x] Connect to backend with JWT auth from localStorage
- [x] Implement `joinConversation`, `leaveConversation`, `markMessageRead` methods
- [x] Implement reconnection logic (10 attempts, 1s-10s delay)
- [x] `onMessageReceived` returns unsubscribe function
- [x] Connect message page to live socket events (join/leave room, receive messages in real-time)
- [x] Add real-time typing indicators to chat UI (with 2s debounce)
- [x] Show online/offline status for conversation participants
- [ ] Update notification bell count in real-time via socket events

---

## 7. Testing (NEW — Added)

### 7.1 Backend Tests (`backend/src/__tests__/`)

- [x] `auth.service.test.ts` — Registration, login, token management, password reset (16 tests)
- [x] `booking.service.test.ts` — Pricing, cancellation policy, date overlap, duration, API endpoints (20 tests)
- [x] `review.service.test.ts` — Rating calculations, deletion window, review types, API endpoints (16 tests)
- [x] `notification.service.test.ts` — Notification types and data structures (4 tests)
- [x] `api.test.ts` — Existing health check, auth, and property endpoint tests
- [x] `supabase.test.ts` — Existing Supabase connection and CRUD tests

### 7.2 Frontend Tests (`frontend/__tests__/`)

- [x] Test infrastructure set up (Vitest + React Testing Library + jsdom)
- [x] `auth-store.test.ts` — User mapping, localStorage, error handling (10 tests)
- [x] `toast-context.test.ts` — Deduplication, ID generation, queue management (7 tests)
- [x] `booking-logic.test.ts` — Price formatting, date calculations, validation, status display (15 tests)

---

## Priority Order (Updated)

| # | Task | Impact | Effort | Section | Status |
|---|------|--------|--------|---------|--------|
| 1 | Fix backend build error | Blocking | 5 min | 1 | **DONE** |
| 2 | Booking notifications + refund logic | High | 3-4 hrs | 2.1 | **DONE** |
| 3 | Review notifications + rating calc | High | 2-3 hrs | 2.2 | **DONE** |
| 4 | Apply rate limiting to routes | High | 30 min | 3.3 | **DONE** |
| 5 | Backend + frontend test suites | High | 2-3 hrs | 7 | **DONE** |
| 6 | Wire Socket.io server | Medium | 4-6 hrs | 3.1 | **DONE** |
| 7 | Wire Redis caching | Medium | 3-4 hrs | 3.2 | **DONE** |
| 8 | Phone verification | Low | 1 hr | 2.3 | **DONE** |
| 9 | WebSocket client context | Medium | 2 hrs | 6 | **DONE** |
| 10 | Verification pages -> API | Medium | 2-3 hrs | 4 | **DONE** |
| 11 | Replace mock data in stores | Medium | 4-5 hrs | 5 | **DONE** |
| 12 | Wire message pages to socket events | Medium | 2-3 hrs | 6 | **DONE** |
