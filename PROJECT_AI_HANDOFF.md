# Food Ordering Application - AI Handoff Document

## 1. Project Overview

This repository contains a full-stack Food Ordering Application with:
- `food-ordering-backend`: Spring Boot REST API
- `food-ordering-frontend`: React + Vite web app
- `run-e2e.ps1`: local bootstrap script to prepare DB/env and start both apps

Primary capabilities:
- User authentication (email/password + Google sign-in)
- Restaurant and menu browsing
- Cart management
- Razorpay payment initiation and verification
- Order placement, order history, and cancellation
- Email notifications for registration/order/cancellation

## 2. Tech Stack

### Backend
- Java 17
- Spring Boot 3.3.x
- Spring Security (stateless JWT auth)
- Spring Data JPA + Hibernate
- PostgreSQL
- JavaMailSender (SMTP)
- Razorpay Java SDK
- Maven

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- TailwindCSS
- Razorpay checkout script (global `window.Razorpay`)
- Google Identity Services script

## 3. Repository Structure

- `food-ordering-backend/src/main/java/com/foodapp/controller`: REST controllers
- `food-ordering-backend/src/main/java/com/foodapp/service`: business logic
- `food-ordering-backend/src/main/java/com/foodapp/model`: JPA entities
- `food-ordering-backend/src/main/java/com/foodapp/repository`: Spring Data repositories
- `food-ordering-backend/src/main/java/com/foodapp/security`: JWT/filter/user details
- `food-ordering-backend/src/main/java/com/foodapp/config`: security, CORS, seed data
- `food-ordering-backend/src/main/resources/application.properties`: runtime config
- `food-ordering-frontend/src/pages`: route pages
- `food-ordering-frontend/src/context`: auth/cart/theme state
- `food-ordering-frontend/src/api`: backend API wrappers
- `food-ordering-frontend/src/components`: reusable UI

## 4. Runtime Flow (High Level)

1. User opens frontend and browses restaurants/menu (public routes).
2. User authenticates via email/password or Google.
3. Frontend stores JWT in localStorage and sends `Authorization: Bearer <token>` via Axios interceptor.
4. User adds menu items to cart and starts payment from cart page.
5. Frontend calls backend payment API to create Razorpay order.
6. Razorpay checkout completes and returns payment signature fields.
7. Frontend sends signature + order payload to backend verify endpoint.
8. Backend verifies signature, places order, persists DB records, sends email.
9. User sees order confirmation and later order history.

## 5. Backend API Contract

Base path: `/api`

Common response envelope:
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

### 5.1 Auth Endpoints

#### POST `/api/auth/register`
- Auth: Public
- Body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "secret123"
}
```
- Validation:
  - `name` required
  - `email` required + valid email
  - `password` required, min length 6
- Behavior:
  - Rejects duplicate email
  - Creates user with role `USER`
  - Sends welcome email (best-effort)
  - Returns JWT + profile
- Success status: `201`

#### POST `/api/auth/login`
- Auth: Public
- Body:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```
- Behavior:
  - Validates credentials with BCrypt password match
  - Returns JWT + profile
- Success status: `200`

#### POST `/api/auth/google`
- Auth: Public
- Body:
```json
{
  "idToken": "google-id-token"
}
```
- Behavior:
  - Calls Google tokeninfo API
  - Validates audience (`GOOGLE_CLIENT_ID`), issuer, and `email_verified`
  - Auto-creates user if first login
  - Returns JWT + profile
- Success status: `200`

### 5.2 Restaurant/Menu Endpoints

#### GET `/api/restaurants`
- Auth: Public
- Returns all restaurants

#### GET `/api/restaurants/{id}`
- Auth: Public
- Returns one restaurant or 404

#### GET `/api/restaurants/{id}/menu`
- Auth: Public
- Returns menu items for restaurant

#### GET `/api/menu/restaurant/{restaurantId}`
- Auth: Public
- Alternate menu endpoint

### 5.3 User Endpoint

#### GET `/api/users/me`
- Auth: Required
- Uses current JWT subject (`email`) to return profile

### 5.4 Order Endpoints

#### POST `/api/orders`
- Auth: Required
- Body:
```json
{
  "restaurantId": 1,
  "items": [
    { "menuItemId": 10, "quantity": 2 },
    { "menuItemId": 11, "quantity": 1 }
  ]
}
```
- Validation/business rules:
  - `restaurantId` required
  - `items` non-empty
  - each `menuItemId` required
  - each `quantity >= 1`
  - all items must belong to same restaurant
  - each item must be available
- Behavior:
  - Calculates line totals and order total
  - Creates order with status `PENDING`
  - Sends order confirmation email (best-effort)
- Success status: `201`

#### GET `/api/orders/my`
- Auth: Required
- Returns authenticated user's orders sorted newest first

#### GET `/api/orders/{id}`
- Auth: Required
- Returns specific order only if owner matches auth user

#### PUT `/api/orders/{id}/cancel`
- Auth: Required
- Rule: only `PENDING` orders cancellable
- Behavior: status changes to `CANCELLED`, cancellation email sent

### 5.5 Payment Endpoints

#### POST `/api/payment/create-order`
- Auth: Required
- Body:
```json
{ "amount": 499.00 }
```
- Behavior:
  - Validates amount > 0
  - Validates Razorpay keys configured
  - Creates Razorpay order in paise
- Returns: `razorpayOrderId`, `amount`, `currency`, `keyId`

#### POST `/api/payment/verify-and-place`
- Auth: Required
- Body:
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature",
  "orderRequest": {
    "restaurantId": 1,
    "items": [
      { "menuItemId": 10, "quantity": 2 }
    ]
  }
}
```
- Behavior:
  - Verifies signature using HMAC-SHA256 and Razorpay secret
  - If valid, delegates to order placement logic
- Failure status on invalid signature: `400`
- Success status: `201`

## 6. Error Handling Contract

Centralized by `GlobalExceptionHandler`:
- `ResourceNotFoundException` -> `404`
- `UnauthorizedException` -> `401`
- `ValidationException` -> `400`
- `MethodArgumentNotValidException` -> `400` with field-level map
- Any other exception -> `500` with generic message

## 7. Authentication and Security

- JWT token generated with subject = user email
- Default expiry: 24 hours (`app.jwt.expiration-ms=86400000`)
- Stateless security (`SessionCreationPolicy.STATELESS`)
- JWT parsed from `Authorization: Bearer ...`
- Public endpoints:
  - `/api/auth/**`
  - `GET /api/restaurants/**`
  - `GET /api/menu/**`
- Payment and all other endpoints require authentication
- CORS allows:
  - `http://localhost:5173`
  - `https://*.vercel.app`

## 8. Data Model (Core Entities)

### User
- `id`, `name`, `email` (unique), `password`, `role`, `createdAt`

### Restaurant
- `id`, `name`, `address`, `cuisineType`, `imageUrl`

### MenuItem
- `id`, `name`, `description`, `price`, `category`, `available`, `restaurant_id`

### Order
- `id`, `user_id`, `restaurant_id`, `status`, `totalAmount`, `createdAt`, `updatedAt`
- `status` enum values: `PENDING`, `CONFIRMED`, `CANCELLED`, `DELIVERED`

### OrderItem
- `id`, `order_id`, `menu_item_id`, `quantity`, `price`

## 9. Seed Data Behavior

On backend startup, `DataSeeder` performs idempotent sync:
- Seeds many restaurants (20+) with multiple cuisines
- Seeds menu items per restaurant (roughly 6 each)
- Uses restaurant name matching to avoid duplicate restaurants
- Uses normalized menu name matching to avoid duplicate menu items

## 10. Frontend Functional Coverage

### Route Map
- Public:
  - `/` home (restaurant list/search/filter/sort)
  - `/restaurant/:id` restaurant + menu
  - `/login`
  - `/register`
- Protected:
  - `/cart`
  - `/order-confirmation/:id`
  - `/orders`

### State Management
- `AuthContext`:
  - stores token/user in localStorage
  - decodes JWT on app load, auto-logout on expiry/invalid token
- `CartContext`:
  - in-memory cart, quantity updates, totals, clear cart
- `ThemeContext`:
  - light/dark toggle and persisted theme preference

### API Integration
- Axios base URL from `VITE_API_BASE_URL`
- Request interceptor auto-attaches bearer token
- Response interceptor on `401` clears auth and redirects to `/login`

### Payment Flow
- `CartPage` calls `useRazorpay()`
- `createPaymentOrder(totalAmount)` -> Razorpay checkout popup
- On success callback -> `verifyAndPlaceOrder(...)`
- On success order creation -> clear cart and navigate confirmation page

## 11. Functional Requirements (Derived from Implementation)

1. Users shall register with unique email and password length >= 6.
2. Users shall log in with email/password and receive JWT.
3. Users shall be able to log in with Google ID token when configured.
4. System shall allow public browsing of restaurants and menus.
5. Authenticated users shall place orders containing >= 1 item.
6. System shall reject orders with items from a different restaurant.
7. System shall reject unavailable menu items in order placement.
8. Authenticated users shall only access their own orders.
9. Only `PENDING` orders shall be cancellable.
10. Authenticated users shall initiate Razorpay payment order creation.
11. System shall verify Razorpay signature before placing paid order.
12. System shall send registration/order/cancellation emails on relevant events (best-effort).
13. Frontend shall protect cart/order routes from unauthenticated access.
14. Frontend shall auto-handle expired/invalid tokens by logout redirect.

## 12. Non-Functional Requirements (Current Design)

### Security
- JWT-based stateless auth
- BCrypt password hashing
- Validation on DTO inputs
- Ownership checks for sensitive order reads/writes
- Secrets externalized via env vars (recommended)

### Reliability
- Transaction boundaries on order placement/cancellation
- Global exception handling with consistent response envelope
- Email sending failures do not fail core transaction paths

### Maintainability
- Layered architecture (controller/service/repository)
- DTO-based API contracts decoupled from entities
- Centralized error handling and cross-cutting logging aspect

### Performance
- Basic DB-backed API suitable for moderate traffic
- No caching layer currently
- Search/filter/sort on frontend is client-side for loaded restaurant list

### Usability
- Responsive React UI with protected routes
- Error alerts and loading states
- Order history and status visualization

### Observability
- Application logging with custom pattern
- AOP logs service/controller entry and exceptions

## 13. Configuration and Environment Variables

### Backend env vars
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `PORT`

### Frontend env vars
- `VITE_API_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_RAZORPAY_KEY_ID`

## 14. Local Startup Modes

### Manual
Backend:
```powershell
Set-Location .\food-ordering-backend
mvn spring-boot:run
```

Frontend:
```powershell
Set-Location .\food-ordering-frontend
npm install
npm run dev
```

### One-command shortcut (project-specific)
From repo root:
```powershell
powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
```
What the script does:
- Validates backend/frontend folders
- Verifies PostgreSQL service and `psql` path
- Creates DB if missing
- Writes backend/frontend `.env`
- Starts backend and frontend in separate PowerShell windows

## 15. Deployment Notes

- Backend includes Dockerfile and is Render-ready.
- Frontend includes `vercel.json` for SPA route handling.
- CORS already allows localhost and vercel subdomains.

## 16. Known Gaps / Improvement Opportunities

1. No automated backend/frontend test suites are present in this repo snapshot.
2. No refresh-token strategy; auth relies on single JWT lifetime.
3. Cart is in-memory only and does not persist across refresh by design.
4. No explicit rate limiting/throttling on auth/payment endpoints.
5. Secret values should not be committed in plain-text env/script defaults in shared environments.

## 17. Quick Summary for Another AI Agent

If another AI needs to continue work quickly, it should:
1. Load backend and frontend env vars.
2. Confirm PostgreSQL connectivity and seeded data.
3. Start app using `run-e2e.ps1` or manual commands.
4. Validate auth flow (`register`, `login`, `google`).
5. Validate order flow (`restaurants -> menu -> cart -> payment -> verify/place -> orders`).
6. Respect API response envelope (`ApiResponse<T>`).
7. Keep authorization header behavior consistent with existing Axios interceptor.
