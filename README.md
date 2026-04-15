# Food Ordering Application

A production-ready full-stack food ordering platform with a Spring Boot REST API backend and a React + Vite frontend.

## Problem Statement

Food ordering platforms usually fail users in three common areas:

1. Fragmented ordering flow: browsing, cart, payment, and tracking often feel disconnected.
2. Poor trust and transparency: users do not clearly see order status, history, and confirmations.
3. Weak developer handoff: setup and deployment steps are unclear, making collaboration slow.

This project solves those problems by providing:

- A clean end-to-end ordering flow from restaurant search to payment verification.
- JWT + Google authentication, protected user operations, and order lifecycle tracking.
- A clear monorepo structure with local bootstrap scripts and deployment-ready configuration.

## Solution Overview

The application supports:

- User registration/login with JWT and Google sign-in
- Restaurant discovery, filtering, and menu browsing
- Cart operations and favorites-based quick reorder
- Coupon validation and discount calculation
- Razorpay payment order creation and payment verification
- Order placement, cancellation, status tracking, and order history
- Address management and review system

## Architecture

- Backend: Spring Boot layered architecture (Controller -> Service -> Repository)
- Frontend: React SPA with Context-based state (Auth, Cart, Theme)
- Database: PostgreSQL
- Auth: Stateless JWT with refresh endpoint
- Deployment: Backend Docker/Render-friendly, frontend Vercel-friendly

## Repository Structure

- `food-ordering-backend`: Spring Boot API
- `food-ordering-frontend`: React + Vite SPA
- `run-e2e.ps1`: Local bootstrap script (DB + env + app startup)

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.3.5
- Spring Security
- Spring Data JPA + Hibernate
- PostgreSQL
- Bean Validation
- JavaMail
- JWT (jjwt)
- Bucket4j
- Maven

### Frontend

- React 18
- Vite 8
- React Router v6
- Axios
- Tailwind CSS
- React Loading Skeleton

## API Basics

Base URL (local backend):

- `http://localhost:8080/api`

Response envelope:

- All APIs return an `ApiResponse<T>` style structure.
- Typical shape:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Authorization header for protected routes:

- `Authorization: Bearer <token>`

## API Endpoints

### Auth

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login with email/password |
| POST | `/api/auth/google` | Public | Login/signup with Google token |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Public | Logout using refresh token |

### Restaurants and Menu

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/restaurants` | Public | List restaurants |
| GET | `/api/restaurants/search` | Public | Search/filter/sort restaurants |
| GET | `/api/restaurants/{id}` | Public | Get restaurant details |
| GET | `/api/restaurants/{id}/menu` | Public | Get menu by restaurant |
| GET | `/api/menu/restaurant/{restaurantId}` | Public | Alternate menu endpoint |

### Reviews

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/reviews` | Required | Add review |
| GET | `/api/restaurants/{restaurantId}/reviews` | Public | Get restaurant reviews (paginated) |
| GET | `/api/reviews/my` | Required | Get logged-in user's reviews |
| PUT | `/api/reviews/{id}` | Required | Update own review |

### Cart

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/cart` | Required | Get current cart |
| POST | `/api/cart/items` | Required | Add item to cart |
| PUT | `/api/cart/items/{itemId}` | Required | Update quantity |
| DELETE | `/api/cart/items/{itemId}` | Required | Remove cart item |
| DELETE | `/api/cart` | Required | Clear cart |
| POST | `/api/cart/merge` | Required | Merge guest cart into user cart |
| POST | `/api/cart/populate-favorite/{favoriteId}` | Required | Load favorite into cart |

### Coupons

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/coupons/validate` | Public | Validate coupon code against amount/restaurant |

### Favorites

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/favorites` | Required | List favorites |
| POST | `/api/favorites` | Required | Save favorite configuration |

### Addresses

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/addresses` | Required | List user addresses |
| POST | `/api/addresses` | Required | Create address |
| PUT | `/api/addresses/{id}` | Required | Update address |
| DELETE | `/api/addresses/{id}` | Required | Delete address |
| PUT | `/api/addresses/{id}/set-default` | Required | Set default address |

### Orders

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/orders` | Required | Place order |
| GET | `/api/orders/my` | Required | List current user's orders |
| GET | `/api/orders/{id}` | Required | Get order by id |
| GET | `/api/orders/{id}/status` | Required | Get live order status/timeline |
| PUT | `/api/orders/{id}/cancel` | Required | Cancel order (business rules apply) |

### Payment

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/payment/create-order` | Required | Create Razorpay order |
| POST | `/api/payment/verify-and-place` | Required | Verify payment and place order |

### User

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/users/me` | Required | Get current user profile |

## Clone and Use

## 1) Clone

```bash
git clone https://github.com/Guntupalli-Sabarish/Food_ordering_application.git
cd Food_ordering_application
```

## 2) Backend Setup

```bash
cd food-ordering-backend
```

Create env file from example:

```bash
cp .env.example .env
```

Set values in `.env`:

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

Run backend:

```bash
mvn spring-boot:run
```

## 3) Frontend Setup

```bash
cd ../food-ordering-frontend
npm install
cp .env.example .env
```

Set frontend env values:

- `VITE_API_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_RAZORPAY_KEY_ID`

Run frontend:

```bash
npm run dev
```

## 4) Quick Local Bootstrap (Windows)

From repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-e2e.ps1
```

What it does:

- Ensures PostgreSQL service is running
- Creates DB if needed
- Writes backend and frontend local `.env` files
- Starts backend and frontend in separate terminals

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

## Security Notes

- Keep `.env` files local only.
- Secret-bearing files are ignored by `.gitignore`.
- Rotate credentials immediately if they were ever committed historically.

## Deployment Notes

### Frontend (Vercel)

Set at least these environment variables in Vercel Project Settings:

- `VITE_API_BASE_URL=https://<your-backend-domain>/api`
- `VITE_GOOGLE_CLIENT_ID=<your-google-client-id>`
- `VITE_RAZORPAY_KEY_ID=<your-razorpay-key-id>`

Then deploy.

### Backend (Render/Docker-ready)

The backend includes a Dockerfile and can be deployed to Render as a Web Service with required environment variables.

## License

This project currently does not define a license file in the repository.
