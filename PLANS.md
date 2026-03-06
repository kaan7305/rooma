# ROOMA - Development Roadmap & Action Plan

> Last updated: 2026-03-05
> Status legend: `[ ]` Not started | `[~]` In progress | `[x]` Complete

---

## Table of Contents

1. [Immediate Priorities (Week 1-2)](#1-immediate-priorities)
2. [Security Hardening (Week 2-3)](#2-security-hardening)
3. [Testing Infrastructure (Week 3-5)](#3-testing-infrastructure)
4. [WebSocket & Real-Time (Week 4-5)](#4-websocket--real-time)
5. [Payment Flow Completion (Week 5-6)](#5-payment-flow-completion)
6. [Email System (Week 6-7)](#6-email-system)
7. [Performance Optimization (Week 7-8)](#7-performance-optimization)
8. [Frontend Polish & UX (Week 8-10)](#8-frontend-polish--ux)
9. [API Documentation (Week 9-10)](#9-api-documentation)
10. [Monitoring & Observability (Week 10-11)](#10-monitoring--observability)
11. [Database Improvements (Week 11-12)](#11-database-improvements)
12. [DevOps & Deployment (Week 12-14)](#12-devops--deployment)
13. [SEO & PWA (Week 14-15)](#13-seo--pwa)
14. [Post-Launch (Ongoing)](#14-post-launch)

---

## 1. Immediate Priorities

> Commit current work, fix critical gaps, stabilize the foundation.

### 1.1 Commit Uncommitted Changes
- [ ] Stage and commit auth-store improvements (`frontend/lib/auth-store.ts`)
- [ ] Stage and commit messaging page fixes (`frontend/app/messages/page.tsx`, `frontend/app/messages/[id]/page.tsx`)
- [ ] Stage and commit toast-context optimizations (`frontend/lib/toast-context.tsx`)
- [ ] Stage and commit forgot/reset password feature (4 new directories)
- [ ] Write meaningful commit messages describing the auth race condition fixes

### 1.2 Fix Critical Config Gaps
- [ ] Add `DATABASE_URL` to `backend/.env.example` (currently missing)
- [ ] Audit all `.env.example` defaults — remove hardcoded JWT secrets
- [ ] Ensure `frontend/.env.example` exists with all required variables documented
- [ ] Document the required env vars for each third-party service in README

### 1.3 Third-Party Service Setup
- [ ] Create Stripe account, obtain test API keys, configure webhook endpoint
- [ ] Create Cloudinary account, obtain API credentials
- [ ] Set up SendGrid or Resend for transactional email
- [ ] Verify Supabase project is provisioned with correct schema
- [ ] Run Prisma migrations against development database
- [ ] Test each integration individually with a smoke test

---

## 2. Security Hardening

> Address critical security gaps before any public deployment.

### 2.1 Rate Limiting (HIGH PRIORITY)
- [ ] Wire `express-rate-limit` middleware to all routes in `backend/src/app.ts`
- [ ] Apply strict rate limits to auth endpoints (login: 5/min, register: 3/min, forgot-password: 3/hour)
- [ ] Apply moderate limits to API endpoints (100/min general)
- [ ] Apply generous limits to read-only endpoints (search, listings)
- [ ] Return `Retry-After` header on 429 responses
- [ ] Add rate limit info to response headers (`X-RateLimit-Remaining`)

### 2.2 Input Sanitization
- [ ] Install and configure `xss` or `dompurify` for HTML sanitization
- [ ] Sanitize all user-generated content (messages, reviews, property descriptions)
- [ ] Add sanitization middleware before Zod validation
- [ ] Escape output in email templates to prevent XSS via email

### 2.3 CSRF Protection
- [ ] Implement CSRF tokens for state-changing operations
- [ ] Use `SameSite=Strict` on authentication cookies
- [ ] Add `Origin` header validation for mutation requests

### 2.4 Authentication Improvements
- [ ] Implement account lockout after 5 failed login attempts (15-min cooldown)
- [ ] Add login attempt logging with IP address
- [ ] Implement session invalidation (logout from all devices)
- [ ] Add password strength meter on frontend registration
- [ ] Enforce password rotation policy for admin accounts
- [ ] Verify JWT refresh token rotation invalidates old tokens

### 2.5 HTTPS & Headers
- [ ] Enforce HTTPS redirect in production middleware
- [ ] Review Helmet.js configuration for strictness
- [ ] Add `Content-Security-Policy` header
- [ ] Add `Permissions-Policy` header
- [ ] Set `X-Content-Type-Options: nosniff`

### 2.6 File Upload Security
- [ ] Validate file magic bytes (not just MIME type) in upload middleware
- [ ] Set maximum upload size per user per day
- [ ] Scan uploaded images for embedded scripts
- [ ] Serve user uploads from a separate domain/CDN

---

## 3. Testing Infrastructure

> Zero frontend tests and minimal backend tests. Build comprehensive coverage.

### 3.1 Backend Unit Tests
- [ ] Expand existing test setup in `backend/src/__tests__/`
- [ ] Write tests for `auth.service.ts` (register, login, token refresh, password reset)
- [ ] Write tests for `property.service.ts` (CRUD, search, filtering)
- [ ] Write tests for `booking.service.ts` (create, cancel, status transitions)
- [ ] Write tests for `payment.service.ts` (intent creation, confirmation, webhooks)
- [ ] Write tests for `message.service.ts` (send, read receipts, conversations)
- [ ] Write tests for `review.service.ts` (create, respond, aggregate ratings)
- [ ] Write tests for `user.service.ts` (profile updates, verification)
- [ ] Test all Zod validators with valid and invalid inputs
- [ ] Test auth middleware with valid, expired, and malformed tokens
- [ ] Test error handler middleware with all custom error types
- [ ] Mock Supabase client for isolated unit tests
- [ ] Mock Stripe SDK for payment tests
- [ ] Target: 80% code coverage for services

### 3.2 Backend Integration Tests
- [ ] Set up test database (SQLite or Supabase test project)
- [ ] Test full auth flow: register -> verify email -> login -> refresh -> logout
- [ ] Test full booking flow: search -> book -> pay -> confirm -> review
- [ ] Test property CRUD with photo uploads
- [ ] Test conversation creation and message exchange
- [ ] Test wishlist operations
- [ ] Test webhook signature verification with Stripe test events
- [ ] Test concurrent booking prevention (race conditions)

### 3.3 Frontend Test Setup
- [ ] Install and configure Vitest + React Testing Library
- [ ] Configure jsdom environment for component tests
- [ ] Set up MSW (Mock Service Worker) for API mocking
- [ ] Create test utilities (render with providers, mock stores)

### 3.4 Frontend Component Tests
- [ ] Test auth forms (login, register, forgot-password, reset-password)
- [ ] Test property card, property detail display
- [ ] Test search filters and result rendering
- [ ] Test booking calendar interactions
- [ ] Test message compose and conversation list
- [ ] Test toast notification system
- [ ] Test dark mode toggle
- [ ] Test navigation and mobile nav
- [ ] Test form validation error display

### 3.5 Frontend Store Tests
- [ ] Test auth store (login, logout, token refresh, hydration from localStorage)
- [ ] Test property store (fetch, filter, pagination)
- [ ] Test booking store (create, cancel, status updates)
- [ ] Test message store (send, receive, mark read)

### 3.6 E2E Tests
- [ ] Install and configure Playwright
- [ ] Write E2E: User registration and email verification
- [ ] Write E2E: Login, browse properties, and logout
- [ ] Write E2E: Search with filters and map interaction
- [ ] Write E2E: Full booking flow (search -> book -> pay -> confirm)
- [ ] Write E2E: Messaging between guest and host
- [ ] Write E2E: Property listing creation by host
- [ ] Write E2E: Password reset flow
- [ ] Write E2E: Wishlist add/remove
- [ ] Set up visual regression testing for key pages
- [ ] Configure Playwright for mobile viewport testing

---

## 4. WebSocket & Real-Time

> Socket.io is installed but the server-side is not implemented.

### 4.1 Backend Socket Server
- [ ] Create `backend/src/socket/` directory with server setup
- [ ] Initialize Socket.io server attached to Express HTTP server
- [ ] Implement JWT authentication middleware for socket connections
- [ ] Create namespace for messaging (`/messages`)
- [ ] Create namespace for notifications (`/notifications`)
- [ ] Handle connection/disconnection events with user mapping

### 4.2 Real-Time Messaging
- [ ] Emit `new_message` event when message is sent via API
- [ ] Emit `typing_start` / `typing_stop` events
- [ ] Emit `message_read` event for read receipts
- [ ] Implement room-based messaging (one room per conversation)
- [ ] Handle message delivery confirmation (sent -> delivered -> read)
- [ ] Store undelivered messages for offline users

### 4.3 Real-Time Notifications
- [ ] Emit notification events for: new booking, booking status change, new review, new message
- [ ] Track online/offline user presence
- [ ] Implement notification badge count updates
- [ ] Queue notifications for offline users

### 4.4 Scaling & Reliability
- [ ] Configure Redis adapter for Socket.io (multi-server support)
- [ ] Implement automatic reconnection with exponential backoff on frontend
- [ ] Handle connection state in frontend WebSocketProvider
- [ ] Add heartbeat/ping mechanism
- [ ] Implement connection pooling limits

### 4.5 Frontend Integration
- [ ] Update `frontend/lib/websocket-context.tsx` with full implementation
- [ ] Connect message pages to live socket events
- [ ] Add real-time typing indicators to chat UI
- [ ] Show online/offline status for conversation participants
- [ ] Update notification bell in real-time

---

## 5. Payment Flow Completion

> Stripe basics work but critical flows are incomplete.

### 5.1 Checkout Flow
- [ ] Implement Stripe Checkout Session creation (alternative to PaymentIntent)
- [ ] Build frontend checkout page with payment form (Stripe Elements)
- [ ] Add 3D Secure / SCA handling for European cards
- [ ] Implement idempotency keys on all payment API calls
- [ ] Display payment processing states (loading, success, failure)
- [ ] Handle payment method saving for returning users

### 5.2 Refunds
- [ ] Implement full refund logic in `payment.service.ts`
- [ ] Implement partial refund logic based on cancellation policy
- [ ] Map cancellation policies to refund percentages:
  - Flexible: 100% if cancelled 24h before check-in
  - Moderate: 50% if cancelled 5 days before check-in
  - Strict: no refund after booking confirmation
- [ ] Create refund status tracking in database
- [ ] Send refund confirmation email to guest
- [ ] Update booking status on refund completion

### 5.3 Host Payouts
- [ ] Implement payout scheduling (pay host after guest check-in + 24h)
- [ ] Create payout calculation logic (total - platform fee - taxes)
- [ ] Integrate Stripe Connect for direct host payouts
- [ ] Support multiple payout methods (bank, PayPal)
- [ ] Build payout history dashboard for hosts
- [ ] Handle payout failures and retries

### 5.4 Webhook Handling
- [ ] Handle `payment_intent.succeeded` event
- [ ] Handle `payment_intent.payment_failed` event
- [ ] Handle `charge.refunded` event
- [ ] Handle `payout.paid` and `payout.failed` events
- [ ] Handle `charge.dispute.created` for chargeback management
- [ ] Implement webhook event logging and replay
- [ ] Add webhook signature verification (already partially done)
- [ ] Implement idempotent webhook processing (prevent duplicate handling)

### 5.5 Financial Reporting
- [ ] Create transaction history API endpoint
- [ ] Build revenue analytics for hosts (daily, weekly, monthly)
- [ ] Build platform earnings dashboard (admin)
- [ ] Generate downloadable invoice PDFs
- [ ] Tax reporting data export

---

## 6. Email System

> Templates are hardcoded in service file. Needs modularization and more templates.

### 6.1 Template Architecture
- [ ] Create `backend/src/templates/emails/` directory
- [ ] Build base HTML template with ROOMA branding (header, footer, styles)
- [ ] Extract existing templates (welcome, verification) into separate files
- [ ] Implement template engine (Handlebars or MJML) for dynamic rendering
- [ ] Create shared partials (header, footer, button, social links)

### 6.2 Required Email Templates
- [ ] Welcome email (exists, needs extraction)
- [ ] Email verification (exists, needs extraction)
- [ ] Password reset (new)
- [ ] Booking confirmation (guest)
- [ ] Booking request notification (host)
- [ ] Booking cancellation (both parties)
- [ ] Payment receipt (guest)
- [ ] Payout notification (host)
- [ ] New message notification (when offline)
- [ ] New review notification (host)
- [ ] Review reminder (guest, 3 days after checkout)
- [ ] Identity verification approved/rejected
- [ ] Property listing approved/rejected (admin)
- [ ] Account deactivation confirmation
- [ ] Weekly host earnings summary

### 6.3 Email Delivery
- [ ] Configure email queue with Bull/Redis for reliable delivery
- [ ] Implement retry logic for failed sends (3 retries with backoff)
- [ ] Add email delivery tracking (sent, delivered, opened, bounced)
- [ ] Set up bounce handling and complaint processing
- [ ] Configure email sender domain (SPF, DKIM, DMARC records)
- [ ] Create unsubscribe mechanism per email category

---

## 7. Performance Optimization

> Redis is configured but unused. Missing caching, query optimization, and frontend performance.

### 7.1 Backend Caching (Redis)
- [ ] Implement Redis connection in `backend/src/config/redis.ts`
- [ ] Cache property search results (TTL: 5 min)
- [ ] Cache property details (TTL: 10 min, invalidate on update)
- [ ] Cache user profiles (TTL: 15 min)
- [ ] Cache university list (TTL: 24h)
- [ ] Cache amenity list (TTL: 24h)
- [ ] Implement cache invalidation on data mutations
- [ ] Add cache-control headers for static API responses

### 7.2 Database Query Optimization
- [ ] Add missing indexes (see Section 11)
- [ ] Implement cursor-based pagination for all list endpoints
- [ ] Optimize property search with spatial queries (PostGIS)
- [ ] Use Prisma `select` to fetch only needed fields (not full records)
- [ ] Implement database connection pooling configuration
- [ ] Add query logging in development mode to identify N+1 queries

### 7.3 Image Optimization
- [ ] Configure Cloudinary transformations for responsive images (thumbnail, medium, large)
- [ ] Serve images in WebP format with fallback
- [ ] Implement lazy loading for property image galleries
- [ ] Generate blurred placeholder images (LQIP) for loading states
- [ ] Set up CDN caching for all static assets
- [ ] Compress images on upload using Sharp before sending to Cloudinary

### 7.4 Frontend Performance
- [ ] Implement React.lazy() for route-level code splitting
- [ ] Add `loading.tsx` files for each route segment (Next.js streaming)
- [ ] Use Next.js `<Image>` component everywhere (verify current usage)
- [ ] Implement virtual scrolling for long lists (property search results)
- [ ] Debounce search input and filter changes
- [ ] Prefetch adjacent pages in pagination
- [ ] Audit and reduce bundle size (analyze with `@next/bundle-analyzer`)
- [ ] Move heavy computations to Web Workers (map clustering, image processing)

### 7.5 API Performance
- [ ] Implement response compression (gzip/brotli) in Express
- [ ] Add ETags for conditional requests
- [ ] Batch related API calls where possible
- [ ] Implement GraphQL or query parameter field selection for flexible responses

---

## 8. Frontend Polish & UX

> Skeleton screens exist but many UX gaps remain.

### 8.1 Loading & Empty States
- [ ] Add skeleton screens to all data-fetching pages
- [ ] Create empty state illustrations for:
  - No search results
  - No bookings yet
  - No messages yet
  - No reviews yet
  - Empty wishlist
  - No properties (host)
- [ ] Add loading spinners/indicators for all async actions (buttons, forms)
- [ ] Implement optimistic UI updates for likes, wishlists, read receipts

### 8.2 Error States
- [ ] Create global React Error Boundary component
- [ ] Add `error.tsx` files for each route segment
- [ ] Design 404 page with search suggestions
- [ ] Design 500 page with retry action
- [ ] Show inline validation errors on form fields (not just toasts)
- [ ] Handle network offline state with banner notification

### 8.3 Form UX
- [ ] Add password visibility toggle on all password inputs
- [ ] Implement auto-save for long forms (property listing)
- [ ] Add progress indicator for multi-step forms
- [ ] Show character count for text areas with limits
- [ ] Implement address autocomplete (Google Places API)
- [ ] Add drag-and-drop for photo uploads with preview
- [ ] Show upload progress bars for images

### 8.4 Accessibility (a11y)
- [ ] Audit all interactive elements for `aria-label` attributes
- [ ] Ensure all images have `alt` text
- [ ] Verify keyboard navigation works for all flows
- [ ] Add `role` attributes to custom components (tabs, modals, dropdowns)
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Add skip-to-content link
- [ ] Test with screen reader (VoiceOver)
- [ ] Add focus trap for modal dialogs
- [ ] Ensure all form inputs have associated labels

### 8.5 Mobile Experience
- [ ] Test all pages at 320px, 375px, 428px widths
- [ ] Optimize touch targets (min 44x44px)
- [ ] Add swipe gestures for image galleries
- [ ] Implement pull-to-refresh on list pages
- [ ] Add bottom sheet for filters on mobile
- [ ] Optimize map interaction for touch devices
- [ ] Test mobile keyboard behavior on forms

### 8.6 Animations & Transitions
- [ ] Add page transition animations
- [ ] Animate list item additions/removals
- [ ] Add micro-interactions (heart animation on wishlist, send animation on message)
- [ ] Implement smooth scroll-to-top on pagination
- [ ] Add skeleton-to-content fade transitions

---

## 9. API Documentation

> No API documentation exists currently.

### 9.1 OpenAPI Specification
- [ ] Install `swagger-jsdoc` and `swagger-ui-express`
- [ ] Create base OpenAPI 3.0 spec with project info, servers, security schemes
- [ ] Document all auth endpoints with request/response schemas
- [ ] Document all property endpoints
- [ ] Document all booking endpoints
- [ ] Document all payment endpoints
- [ ] Document all messaging endpoints
- [ ] Document all review endpoints
- [ ] Document all user/profile endpoints
- [ ] Document all wishlist endpoints
- [ ] Document all notification endpoints
- [ ] Document all admin endpoints
- [ ] Include error response schemas (400, 401, 403, 404, 422, 429, 500)

### 9.2 Documentation Features
- [ ] Serve Swagger UI at `/api/docs` in development
- [ ] Add authentication support in Swagger UI (Bearer token input)
- [ ] Include example request/response bodies for each endpoint
- [ ] Document rate limit policies per endpoint group
- [ ] Document pagination parameters and response format
- [ ] Add webhook payload documentation
- [ ] Generate TypeScript API client from OpenAPI spec (for frontend type safety)

### 9.3 Developer Guide
- [ ] Write API overview in README (authentication, pagination, error format)
- [ ] Document environment setup for new developers
- [ ] Create Postman collection for manual testing
- [ ] Document database schema with ER diagram

---

## 10. Monitoring & Observability

> Only Morgan for HTTP logging. No structured logging, metrics, or error tracking.

### 10.1 Structured Logging
- [ ] Replace `console.log` with structured logger (Pino or Winston)
- [ ] Log in JSON format for production (parseable by log aggregators)
- [ ] Include request ID, user ID, and timestamp in all log entries
- [ ] Set up log levels (error, warn, info, debug)
- [ ] Log all API requests with method, path, status, duration
- [ ] Log authentication events (login, failed login, token refresh)
- [ ] Log payment events (intent created, succeeded, failed, refund)
- [ ] Redact sensitive data from logs (passwords, tokens, card numbers)

### 10.2 Error Tracking
- [ ] Integrate Sentry for backend error tracking (env var already in config)
- [ ] Integrate Sentry for frontend error tracking
- [ ] Configure source maps upload for readable stack traces
- [ ] Set up error grouping and alert rules
- [ ] Track unhandled promise rejections
- [ ] Add breadcrumbs for user action tracing

### 10.3 Health & Metrics
- [ ] Expand `/health` endpoint to check database, Redis, and Stripe connectivity
- [ ] Add `/ready` endpoint for Kubernetes readiness probes
- [ ] Track response time percentiles (p50, p95, p99)
- [ ] Track active WebSocket connections
- [ ] Track database connection pool usage
- [ ] Track Redis hit/miss ratio
- [ ] Export metrics in Prometheus format (optional)

### 10.4 Alerting
- [ ] Set up alerts for error rate spikes (>1% of requests)
- [ ] Set up alerts for response time degradation (p95 > 2s)
- [ ] Set up alerts for failed payment webhook processing
- [ ] Set up alerts for database connection exhaustion
- [ ] Set up alerts for disk space and memory usage
- [ ] Set up uptime monitoring (external ping service)

---

## 11. Database Improvements

> 17 models, 17 indexes. Missing critical indexes, soft-delete, and audit fields.

### 11.1 Add Missing Indexes
- [ ] Add index on `Booking.payment_status` for payment filtering
- [ ] Add index on `Booking.booking_status` for status filtering
- [ ] Add index on `User.created_at` for admin user listing
- [ ] Add index on `Property.created_at` for newest-first sorting
- [ ] Add index on `Review.created_at` for chronological listing
- [ ] Add index on `Notification.user_id, created_at` for user notification feed
- [ ] Add index on `Message.created_at` for message pagination
- [ ] Add composite index on `Property.(city, status, monthly_price)` for filtered search
- [ ] Add index on `User.verification_status` for admin verification queue

### 11.2 Schema Enhancements
- [ ] Add `deleted_at` (soft-delete) to User, Property, Booking, Review
- [ ] Add `updated_at` auto-update trigger to all models
- [ ] Add `last_login_at` to User model
- [ ] Add `login_attempts` and `locked_until` to User for account lockout
- [ ] Add `ip_address` to Booking and Message for fraud detection
- [ ] Review and enforce cascade delete rules on all relations
- [ ] Add check constraints for price fields (must be >= 0)

### 11.3 Data Integrity
- [ ] Create database migration scripts for all schema changes
- [ ] Write seed script for development data (sample users, properties, bookings)
- [ ] Create admin seed with default admin account
- [ ] Implement database backup strategy (Supabase automated backups)
- [ ] Set up point-in-time recovery configuration

### 11.4 Query Optimization
- [ ] Profile slow queries and add appropriate indexes
- [ ] Implement materialized views for property search (if needed)
- [ ] Set up database connection pooling (PgBouncer or Supabase pooler)
- [ ] Configure statement timeout for long-running queries

---

## 12. DevOps & Deployment

> No Docker, CI/CD, or deployment configuration exists.

### 12.1 Docker
- [ ] Create `backend/Dockerfile` (multi-stage build: build -> production)
- [ ] Create `frontend/Dockerfile` (multi-stage build with Next.js standalone output)
- [ ] Create `docker-compose.yml` for local development:
  - Backend (Express)
  - Frontend (Next.js)
  - PostgreSQL
  - Redis
- [ ] Create `docker-compose.prod.yml` for production overrides
- [ ] Create `.dockerignore` files for both services
- [ ] Test full application startup with `docker-compose up`

### 12.2 CI/CD Pipeline (GitHub Actions)
- [ ] Create `.github/workflows/ci.yml`:
  - Trigger on push to `main` and PRs
  - Install dependencies (with caching)
  - Run linting (ESLint)
  - Run type checking (TypeScript)
  - Run backend unit tests
  - Run frontend unit tests
  - Run E2E tests (Playwright)
  - Build both services
  - Upload test coverage reports
- [ ] Create `.github/workflows/deploy.yml`:
  - Trigger on push to `main` (after CI passes)
  - Build Docker images
  - Push to container registry (ECR, GHCR, or Docker Hub)
  - Deploy to hosting provider
  - Run database migrations
  - Notify on success/failure (Slack or Discord)
- [ ] Create `.github/workflows/preview.yml`:
  - Deploy preview environments for PRs (Vercel preview for frontend)

### 12.3 Hosting & Infrastructure
- [ ] Choose hosting provider:
  - Frontend: Vercel (native Next.js support) or AWS Amplify
  - Backend: Railway, Render, AWS ECS, or DigitalOcean App Platform
  - Database: Supabase (already using)
  - Redis: Upstash (serverless) or Railway
- [ ] Configure custom domain and DNS
- [ ] Set up SSL certificates (auto via Let's Encrypt or provider)
- [ ] Configure CDN for static assets (Cloudflare or AWS CloudFront)
- [ ] Set up staging environment mirroring production

### 12.4 Environment Management
- [ ] Create environment variable management strategy (no secrets in code)
- [ ] Use secrets manager (GitHub Secrets for CI, provider secrets for runtime)
- [ ] Document all required environment variables per environment
- [ ] Create environment promotion process (dev -> staging -> production)

---

## 13. SEO & PWA

> No SEO setup, no PWA manifest or service worker.

### 13.1 SEO
- [ ] Add dynamic `<title>` and `<meta description>` to all pages
- [ ] Create `robots.txt` at frontend root
- [ ] Generate `sitemap.xml` dynamically (property listings, static pages)
- [ ] Add Open Graph meta tags for social sharing (title, description, image)
- [ ] Add Twitter Card meta tags
- [ ] Implement JSON-LD structured data for:
  - Organization (ROOMA)
  - Property listings (Product schema)
  - Reviews (AggregateRating schema)
  - Breadcrumbs
- [ ] Configure canonical URLs to prevent duplicate content
- [ ] Optimize page load speed for Core Web Vitals (LCP, FID, CLS)
- [ ] Submit sitemap to Google Search Console

### 13.2 PWA
- [ ] Create `manifest.json` with app name, icons, theme color, display mode
- [ ] Generate app icons in all required sizes (192x192, 512x512, etc.)
- [ ] Implement service worker for:
  - Offline fallback page
  - Static asset caching (CSS, JS, fonts)
  - API response caching for previously viewed listings
- [ ] Add install prompt for mobile users
- [ ] Configure push notifications (Firebase Cloud Messaging)
- [ ] Test installability on Android and iOS

---

## 14. Post-Launch

> Ongoing improvements after initial production deployment.

### 14.1 Analytics & Growth
- [ ] Integrate analytics (Google Analytics, Mixpanel, or PostHog)
- [ ] Track key metrics: signups, bookings, messages sent, search-to-book conversion
- [ ] Implement A/B testing framework for UI experiments
- [ ] Add referral tracking and attribution
- [ ] Create admin analytics dashboard

### 14.2 Internationalization (i18n)
- [ ] Set up `next-intl` or `react-i18next` for frontend translations
- [ ] Extract all hardcoded strings to translation files
- [ ] Support: English (default), Spanish, French, German, Mandarin
- [ ] Implement currency conversion display
- [ ] Add locale-aware date/time formatting
- [ ] Translate email templates

### 14.3 Advanced Features
- [ ] AI-powered property recommendations based on browsing history
- [ ] Smart pricing suggestions for hosts (market analysis)
- [ ] Virtual property tours (360 photo/video support)
- [ ] In-app video calling between guest and host
- [ ] Community features (neighborhood forums, events)
- [ ] Integration with university housing portals
- [ ] Lease agreement generation and e-signing
- [ ] Renter insurance integration
- [ ] Background check integration for verification
- [ ] Multi-property management dashboard for large hosts

### 14.4 Compliance & Legal
- [ ] GDPR compliance (data export, right to be forgotten, consent management)
- [ ] Cookie consent banner implementation
- [ ] Terms of Service and Privacy Policy pages
- [ ] Accessibility compliance audit (WCAG 2.1 AA certification)
- [ ] Payment PCI compliance verification
- [ ] Age verification for users
- [ ] Local rental regulation compliance per city

### 14.5 Scalability
- [ ] Database read replicas for heavy read traffic
- [ ] Horizontal scaling with load balancer
- [ ] CDN optimization for global users
- [ ] Database sharding strategy for growth
- [ ] Microservices extraction if monolith becomes bottleneck:
  - Auth service
  - Messaging service
  - Payment service
  - Search/discovery service
- [ ] Implement message queue (RabbitMQ/SQS) for async processing

---

## Priority Matrix

| Priority | Category | Impact | Effort |
|----------|----------|--------|--------|
| P0 | Commit current work | Low | Low |
| P0 | Rate limiting | High | Low |
| P0 | Input sanitization | High | Low |
| P1 | WebSocket implementation | High | Medium |
| P1 | Payment flow completion | High | Medium |
| P1 | Backend testing | High | Medium |
| P1 | Docker + CI/CD | High | Medium |
| P2 | Frontend testing | Medium | Medium |
| P2 | Email template system | Medium | Low |
| P2 | Redis caching | Medium | Medium |
| P2 | Structured logging | Medium | Low |
| P2 | Error tracking (Sentry) | Medium | Low |
| P3 | API documentation | Medium | Medium |
| P3 | SEO optimization | Medium | Low |
| P3 | PWA setup | Low | Medium |
| P3 | Frontend polish | Medium | High |
| P4 | i18n | Low | High |
| P4 | Advanced features | Low | High |
| P4 | Compliance | Medium | High |

---

## Notes

- Weeks are estimates and can be parallelized with multiple developers
- Security items (Section 2) should be completed before any public-facing deployment
- Testing should be added incrementally alongside feature development
- All new features going forward should include tests as part of the PR
- Database migrations must be tested on staging before production
