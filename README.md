# ME GEARS

A full-stack e-commerce storefront built with Next.js App Router, React, Tailwind CSS, and MongoDB.

## Project Overview

`ME GEARS` is a shopping platform with:

- Public store pages for browsing products, categories, and product details
- Customer authentication via email/password and Google login
- Cart, wishlist, checkout, orders, and profile management
- Admin dashboard for inventory, orders, transactions, customers, and settings
- MongoDB backend via API routes and Better Auth for user/session management

## Key Features

- Product browsing and search
- Add to cart with stock validation
- Wishlist support
- Checkout and order history
- Customer profile and address management
- Admin inventory management and product upload
- Admin statistics dashboard and recent orders
- Image uploads via external upload API key

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Better Auth with MongoDB adapter
- MongoDB
- Framer Motion
- Lucide React

## Getting Started

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file at the repository root with values like:

```env
MONGO_DB_URI=your_mongodb_connection_string
AUTH_DB_NAME=me_gears_db
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_IMAGE_UPLOAD_API=your_imgbb_api_key
BETTER_AUTH_URL=http://localhost:3000
```

Notes:

- `AUTH_DB_NAME` defaults to `me_gears_db` when not set.
- `NEXT_PUBLIC_IMAGE_UPLOAD_API` is used by the admin inventory image upload flow.
- `BETTER_AUTH_URL` is optional and defaults to `http://localhost:3000` in the proxy configuration.

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Seed sample data

The project includes `scripts/seed.ts` to populate demo users and product data.

```bash
npm run seed
```

> The seed script uses a hardcoded MongoDB Atlas URI in `scripts/seed.ts` and creates demo users for local testing.

## Demo Accounts

- User: `demo@megears.com` / `demo123`
- Admin: `admin@megears.com` / `admin123`

## Available Scripts

- `npm run dev` — start the local development server
- `npm run build` — build the production app
- `npm run start` — start the built app
- `npm run lint` — run ESLint
- `npm run seed` — load sample users, products, and categories into MongoDB

## Project Structure

- `src/app` — application routes and pages
- `src/components` — shared UI components
- `src/lib` — auth and database helpers
- `src/api` — API route handlers
- `scripts/seed.ts` — sample database seeding script
- `public` — static assets

## Notes

- The app uses server-side API routes for cart, orders, products, reviews, and user profile management.
- Authentication is implemented with `better-auth` and stores sessions in MongoDB.
- Admin functionality is available under `/admin` once signed in as an admin user.

## Deployment

This app can be deployed to Vercel or any Node.js hosting provider that supports Next.js. Ensure the required environment variables are set in production.
