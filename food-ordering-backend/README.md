# Food Ordering Backend

A production-ready Spring Boot REST API backend for a Food Ordering Application. It includes JWT authentication (email/password + Google OAuth), restaurant and menu browsing, order placement/cancellation, email notifications, centralized exception handling, and AOP logging.

## Tech Stack

- Java 17
- Spring Boot 3.x
- Spring Security + JWT (jjwt 0.11.5)
- Google OAuth ID token verification
- Spring Data JPA + Hibernate
- PostgreSQL
- JavaMail (Gmail SMTP)
- Spring AOP
- Maven
- Docker (Render deployment)

## Prerequisites

- Java 17
- Maven 3.9+
- PostgreSQL 14+
- Gmail App Password (for SMTP email sending)

## Setup

1. Clone the repository and move into the backend folder.
2. Create an `.env` or set system environment variables using values from `.env.example`.
3. Create a PostgreSQL database (for example `foodordering_application`).
4. Build the application:

```bash
mvn clean package -DskipTests
```

5. Run the built JAR:

```bash
java -jar target/*.jar
```

6. API base URL:

```text
http://localhost:8080
```

## Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | JDBC connection URL for PostgreSQL |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Long secret key used to sign JWT tokens (32+ chars) |
| `GOOGLE_CLIENT_ID` | Google OAuth Web Client ID used to verify Google ID token audience |
| `MAIL_USERNAME` | Gmail email address |
| `MAIL_PASSWORD` | Gmail App Password |
| `PORT` | Server port (default `8080`) |

## API Endpoints

All responses are wrapped in `ApiResponse<T>`.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT token |
| GET | `/api/restaurants` | No | Get all restaurants |
| GET | `/api/restaurants/{id}` | No | Get restaurant by id |
| GET | `/api/restaurants/{id}/menu` | No | Get menu by restaurant id |
| GET | `/api/menu/restaurant/{restaurantId}` | No | Alternate menu endpoint |
| POST | `/api/orders` | Yes | Place order |
| GET | `/api/orders/my` | Yes | Get current user orders |
| GET | `/api/orders/{id}` | Yes | Get order by id (owner only) |
| PUT | `/api/orders/{id}/cancel` | Yes | Cancel a pending order |
| GET | `/api/users/me` | Yes | Get current user profile |

### Authorization Header

For protected endpoints, send JWT token in header:

```text
Authorization: Bearer <token>
```

## Postman Testing Flow

1. Register user: `POST /api/auth/register`
2. Login user: `POST /api/auth/login`
3. Copy token from login response
4. Test public endpoints: restaurants and menu
5. Test protected endpoints with `Authorization: Bearer <token>`
6. Place order, get my orders, get order by id, cancel pending order

## Render Deployment (Docker)

1. Push this backend code to GitHub.
2. In Render, create a new **Web Service** from your repo.
3. Choose **Docker** environment (Render auto-detects `Dockerfile`).
4. Add environment variables in Render dashboard:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
   - `PORT` (optional, Render provides one)
5. Ensure your PostgreSQL instance is reachable from Render (public endpoint or managed DB).
6. Deploy. Render builds with Docker and runs the app on assigned port.

## Notes

- Do not hardcode secrets in source code.
- JWT secret should be sufficiently long and random.
- Only pending orders are cancellable.
- Email failures are logged but do not break core order flow.
