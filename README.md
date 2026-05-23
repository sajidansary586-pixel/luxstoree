# LuxStore — E-Commerce Store

A full-featured dark-aesthetic e-commerce store with bank QR code payment, admin dashboard, and automated order email notifications.

## Features

- **Product Catalog** — Dynamic product grid with category filtering, featured badges, and stock status
- **Product Detail Pages** — Full product info with add-to-cart
- **Shopping Cart** — Persistent cart (localStorage), quantity control, item removal
- **Checkout Flow** — 2-step checkout: customer details → QR bank payment
- **Bank QR Payment** — Fixed QR code for bank transfer / UPI payment
- **Order Confirmation** — Email notification sent to admin on every order via Netlify Forms
- **Admin Dashboard** — Protected dashboard to add/edit/remove products and view orders
- **Dark Design** — Deep purple + gold aesthetic with smooth animations

## Tech Stack

- **Framework:** TanStack Start (React + Vite)
- **Styling:** Tailwind CSS v4 + custom CSS variables
- **Database:** Netlify Database (Postgres) via Drizzle ORM
- **Forms/Email:** Netlify Forms (order notifications)
- **Routing:** TanStack Router (file-based)
- **Icons:** Lucide React
- **Deployment:** Netlify

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Dashboard

Navigate to `/admin` — default password is `admin123`.

**Set a custom password:** Add `ADMIN_PASSWORD` environment variable in Netlify.

**Set admin email for notifications:** Add `ADMIN_EMAIL` environment variable in Netlify, then configure email notifications in Netlify UI under **Project configuration > Notifications > Emails and webhooks**.

## QR Code Payment

The QR code in `/src/components/BankQRCode.tsx` is a placeholder SVG. Replace it with your actual bank/UPI QR code image.

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `ADMIN_PASSWORD` | Admin dashboard password | `admin123` |
| `ADMIN_EMAIL` | Email for order notifications | (configure in Netlify UI) |
