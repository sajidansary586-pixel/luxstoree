# AGENTS.md — LuxStore Architecture Guide

## Project Overview

Full-featured e-commerce store built with TanStack Start on Netlify. Dark aesthetic design, bank QR payment, admin dashboard, and order notifications via Netlify Forms.

## Directory Structure

```
src/
  routes/              # File-based routing (TanStack Router)
    index.tsx          # Home page — product grid, fetches from /api/products
    cart.tsx           # Cart page — reads from CartContext (localStorage)
    checkout/
      index.tsx        # 2-step checkout: details form → QR payment
      success.tsx      # Order confirmation page
    products/
      $productId.tsx   # Product detail page
    admin/
      index.tsx        # Admin dashboard — products + orders management
      login.tsx        # Admin login (password-based)
  components/
    Layout.tsx         # Shared layout with navbar and footer
    BankQRCode.tsx     # Static bank QR code SVG — REPLACE with real QR
  context/
    CartContext.tsx    # React context for cart state, persisted to localStorage
  styles.css           # CSS variables, utility classes, dark theme

db/
  schema.ts            # Drizzle ORM schema: products, orders tables
  index.ts             # Database client (netlify-db adapter)

netlify/
  functions/
    products.ts        # GET/POST/PATCH/DELETE /api/products
    orders.ts          # GET/POST /api/orders + Netlify Forms trigger
    admin-login.ts     # POST /api/admin/login
    seed.ts            # POST /api/seed (idempotent initial data)
  database/
    migrations/        # Auto-generated Drizzle migrations

public/
  __forms.html         # Static form skeleton for Netlify Forms detection
```

## Key Decisions

- **No Stripe** — Payment via fixed bank QR code. Orders saved to Postgres + email via Netlify Forms.
- **Admin auth** — Session token in `sessionStorage`, password from `ADMIN_PASSWORD` env var.
- **Cart** — `localStorage` only, clears on successful order.
- **Netlify Forms** — Email notification only; Postgres is the source of truth. `/__forms.html` required for SSR detection; fetch targets that path, not `/`.
- **Seed** — `/api/seed` inserts sample products once (idempotent).

## Coding Conventions

- Styles use inline styles + CSS variables (`var(--bg-primary)`) not Tailwind class strings. Responsive breakpoints use Tailwind `md:` classes.
- Server functions in `netlify/functions/` use `.js` imports: `from "../../db/index.js"`.
- Prices stored as integers (rupees, no decimals).

## Adding/Changing Things

- **New route:** Add file in `src/routes/` — auto-discovered.
- **New API:** Add file in `netlify/functions/` with `export const config: Config = { path: "/api/..." }`.
- **Schema change:** Edit `db/schema.ts`, run `npx drizzle-kit generate`.
- **Replace QR code:** Edit `src/components/BankQRCode.tsx` — swap SVG for `<img src="/your-qr.png" />`.
- **Admin password:** Set `ADMIN_PASSWORD` env var in Netlify dashboard.

## Project Overview

An interactive resume/portfolio application with an AI-powered assistant. Built with TanStack Start and deployed on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + custom components |
| Content | Content Collections (type-safe markdown) |
| AI | TanStack AI with multi-provider support |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── public
│   ├── favicon.ico
│   ├── logo.png
│   ├── tanstack-circle-logo.png
│   └── tanstack-word-logo-white.svg  # TanStack wordmark logo (white) used in header/nav.
├── src
│   ├── components
│   │   ├── BuyButton.tsx  # Stripe checkout button component.
│   │   ├── Header.tsx  # Header with nav.
│   │   ├── HeaderNav.tsx  # Navigation sidebar template: mobile menu, Home link, add-on routes; EJS-driven for dynamic route generation.
│   │   ├── ProductAIAssistant.tsx  # AI shopping assistant component.
│   │   └── ProductRecommendation.tsx  # Product recommendation card display.
│   ├── data
│   │   └── products.ts  # Product catalog data.
│   ├── lib
│   │   ├── product-ai-hook.ts  # useProductChat hook for /api/product-chat.
│   │   ├── product-tools.ts  # AI tools: getProducts, recommendProduct.
│   │   └── stripe.server.ts  # Stripe server utilities for checkout.
│   ├── routes
│   │   ├── checkout
│   │   │   ├── cancel.tsx  # Stripe checkout cancel page.
│   │   │   └── success.tsx  # Stripe checkout success page.
│   │   ├── products
│   │   │   └── $productId.tsx  # Product detail page with BuyButton, recommendation.
│   │   ├── __root.tsx  # Root layout: Header, styles.
│   │   ├── api.product-chat.ts  # POST handler for product AI chat.
│   │   └── index.tsx  # Product catalog home with ProductAIAssistant.
│   ├── store
│   │   └── product-assistant.ts  # Zustand store for assistant open state.
│   ├── router.tsx  # TanStack Router setup: creates router from generated routeTree with scroll restoration.
│   └── styles.css  # Global styles: Tailwind, prose.
├── .gitignore  # Template for .gitignore: node_modules, dist, .env, .netlify, .tanstack, etc.
├── AGENTS.md  # This document provides an overview of the project structure for developers and AI agents working on this codebase.
├── netlify.toml  # Netlify deployment config: build command (vite build), publish directory (dist/client), and dev server settings (port 8888, target 3000).
├── package.json  # Project manifest with TanStack Start, React 19, Vite 7, Tailwind CSS 4, and Netlify plugin dependencies; defines dev and build scripts.
├── pnpm-lock.yaml
├── tsconfig.json  # TypeScript config: ES2022 target, strict mode, @/* path alias for src/*, bundler module resolution.
└── vite.config.ts  # Vite config template: TanStack Start, React, Tailwind, Netlify plugin, and optional add-on integrations; processed by EJS.
```

## Key Concepts

### File-Based Routing (TanStack Router)

Routes are defined by files in `src/routes/`:

- `__root.tsx` - Root layout wrapping all pages
- `index.tsx` - Route for `/`
- `api.*.ts` - Server API endpoints (e.g., `api.resume-chat.ts` → `/api/resume-chat`)

### Component Architecture

**UI Primitives** (`src/components/ui/`):
- Radix UI-based, Tailwind-styled
- Card, Badge, Checkbox, Separator, HoverCard

**Feature Components** (`src/components/`):
- Header, HeaderNav, ResumeAssistant

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite plugins: TanStack Start, Netlify, Tailwind, Content Collections |
| `tsconfig.json` | TypeScript config with `@/*` path alias for `src/*` |
| `netlify.toml` | Build command, output directory, dev server settings |
| `content-collections.ts` | Zod schemas for jobs and education frontmatter |
| `styles.css` | Tailwind imports + CSS custom properties (oklch colors) |

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Conventions

### Naming
- Components: PascalCase
- Utilities/hooks: camelCase
- Routes: kebab-case files

### Styling
- Tailwind CSS utility classes
- `cn()` helper for conditional class merging
- CSS variables for theme tokens in `styles.css`

### TypeScript
- Strict mode enabled
- Import paths use `@/` alias
- Zod for runtime validation
- Type-only imports with `type` keyword

### State Management
- React hooks for local state
- Zustand if you need it for global state
### Ecommerce Integration

Ecommerce site with Stripe checkout and AI shopping assistant.

**Stripe checkout:**
- `createCheckoutSession` server function in `src/lib/stripe.server.ts`
- BuyButton component redirects to Stripe Checkout
- Routes: `/checkout/success`, `/checkout/cancel`

**AI tools available:**
- `getProducts` - Get all products from catalog
- `recommendProduct` - Display product recommendation card (MUST use for recommendations; do not write recommendations manually)

**Dependencies:** stripe, @tanstack/ai, streamdown

## Environment Variables

```
STRIPE_SECRET_KEY=...  # Required for checkout
```

For AI assistant: ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or OLLAMA_BASE_URL (same as ai add-on).

## Application Name

This starter uses "Application Name" as a placeholder throughout the UI and metadata. Replace it with the user's desired application name in the following locations:

### UI Components
- `src/components/Header.tsx` — app name displayed in the header
- `src/components/HeaderNav.tsx` — app name in the mobile navigation header

### SEO Metadata
- `src/routes/__root.tsx` — the `title` field in the `head()` configuration

Search for all occurrences of "Application Name" in the `src/` directory and replace with the user's application name.
