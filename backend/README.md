# Sovereign Gold Livestock Backend

Express, TypeScript, MongoDB, Mongoose, JWT, Paystack, Flutterwave, Termii, Cloudinary, and OpenAPI backend for the Sovereign Gold Livestock platform.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Base API URL: `http://localhost:8081/api/v1`

## Core Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `POST /api/v1/users/me/addresses`
- `POST /api/v1/users/me/wishlist/:animalId`
- `GET /api/v1/animals`
- `POST /api/v1/animals`
- `POST /api/v1/uploads/animals/media`
- `GET /api/v1/checkout/delivery-zones`
- `POST /api/v1/checkout/coupons/validate`
- `POST /api/v1/orders`
- `GET /api/v1/orders/mine`
- `POST /api/v1/orders/reservations`
- `PATCH /api/v1/orders/:id/status`
- `POST /api/v1/payments/paystack/initialize`
- `POST /api/v1/payments/flutterwave/initialize`
- `POST /api/v1/whatsapp/webhook`
- `POST /api/v1/reviews`
- `PATCH /api/v1/reviews/:id/moderate`
- `GET /api/v1/reports/sales-summary`
- `GET /api/v1/admin/dashboard/overview`
- `GET /api/v1/admin/audit-logs`
- `GET|POST|PATCH|DELETE /api/v1/admin/:resource`
- `GET /api/v1/health`

Swagger docs are exposed at `/api/v1/docs`.

Admin resources currently supported by `:resource`: `deliveryZones`, `coupons`, `settings`.
