# Food Ordering Frontend

React frontend for the Food Ordering Application. This app connects to the Spring Boot backend and provides authentication, restaurant browsing, menu ordering, cart management, and order tracking.

## Features

- JWT-based login and registration flow
- Google OAuth login support (Google Identity Services)
- Protected routes for cart and order pages
- Restaurant listing and menu browsing
- Search restaurants by name or cuisine
- Cart management with quantity controls
- Place order and view order confirmation
- Order history with cancel action for pending orders
- API integration through Axios with interceptor
- Responsive UI using TailwindCSS

## Prerequisites

- Node.js 18 or later
- npm
- Running backend API

## Setup

1. Clone the repository and move to the frontend folder.
2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

5. Start development server:

```bash
npm run dev
```

6. Build for production:

```bash
npm run build
```

## Vercel Deployment

1. Push frontend code to GitHub.
2. Import the project in Vercel.
3. Add environment variable in Vercel project settings:
	- `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
	- `VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com`
4. Keep build command as `npm run build` and output directory as `dist`.
5. Deploy.

The project includes `vercel.json` rewrite rules to support React Router routes.

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## Screenshot Placeholder

- Home page screenshot: add image in docs/screenshots/home.png
- Restaurant page screenshot: add image in docs/screenshots/restaurant.png
- Cart page screenshot: add image in docs/screenshots/cart.png
- Order history page screenshot: add image in docs/screenshots/orders.png
