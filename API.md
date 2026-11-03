# ShopNow API

The API base URL is `http://localhost:5000/api` in local development. JSON requests use `Content-Type: application/json`. Authentication uses HTTP-only `accessToken` and `refreshToken` cookies; browser clients must send credentials. Protected routes require a valid access cookie, and admin routes additionally require the `admin` role.

## Authentication and users

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a customer or admin account; set `role: "admin"` for an admin account |
| POST | `/auth/login` | Public | Authenticate and set cookies |
| POST | `/auth/logout` | Authenticated | Clear authentication cookies |
| GET | `/auth/profile` | Authenticated | Current user |
| PUT | `/auth/profile/update` | Authenticated | Update profile |
| POST | `/auth/password/forgot` | Public | Request reset email (SMTP configuration required) |
| PUT | `/auth/reset-password/:token` | Public | Complete password reset |
| PUT | `/auth/password/update` | Authenticated | Change password |
| GET | `/auth/admin/users` | Admin | List safe customer account fields |
| GET | `/auth/admin/user/:id` | Admin | Read safe user fields |
| PUT | `/auth/admin/user/:id/role` | Admin | Update role |
| PUT | `/auth/admin/user/:id/status` | Admin | Set `accountStatus` to `active` or `blocked` |
| DELETE | `/auth/admin/user/:id` | Admin | Delete a user |

## Catalog, categories, and reviews

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/products` | Public | Product list; supports `keyword`, `category` (Mongo ID), `brand`, `minPrice`, `maxPrice`, `sort`, `page`, and `limit` |
| GET | `/products/:id` | Public | Product details |
| GET | `/products/admin/product` | Admin | Product management list |
| POST | `/products/admin/product/create` | Admin | Create a product; multipart form with `productName`, `description`, `brand`, `category`, `originalPrice`, `discountPrice`, `stockQuantity`, `slug`, and up to five `images` |
| PUT | `/products/admin/product/:id` | Admin | Edit product; optional `images` multipart files replace the prior Cloudinary images |
| DELETE | `/products/admin/product/:id` | Admin | Delete product and its Cloudinary images |
| GET | `/products/:id/reviews` | Public | Product reviews |
| POST | `/products/:id/review` | Authenticated | Create a review |
| DELETE | `/products/reviews/:id` | Authenticated owner | Delete own review |
| GET | `/categories` | Public | Category list |
| POST | `/categories` | Admin | Create category |
| GET | `/categories/:id` | Public | Category details |
| PATCH | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category not referenced by products |

Catalog sort values include `createdAt`, `-createdAt`, `productName`, `originalPrice`, `-originalPrice`, and `averageRating`. Page size is capped at 50. Product images accept JPEG, PNG, or WebP up to 5 MiB each.

## Cart and checkout

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/cart` | Authenticated | Read persisted cart |
| POST | `/cart/add` | Authenticated | Add `{ "productId": "...", "quantity": 1 }`; server looks up price and stock |
| PATCH | `/cart/:productId` | Authenticated | Set `{ "quantity": 2 }` |
| DELETE | `/cart/remove` | Authenticated | Remove `{ "productId": "..." }` |
| DELETE | `/cart/clear` | Authenticated | Clear cart |
| POST | `/addresses` | Authenticated | Save shipping address |
| GET | `/addresses` | Authenticated | List own addresses |
| GET | `/addresses/:id` | Authenticated owner | Read own address |
| PUT | `/addresses/:id` | Authenticated owner | Update own address |
| DELETE | `/addresses/:id` | Authenticated owner | Delete own address |

The browser checkout creates an address and then calls `POST /orders` with `{ "shippingAddress": "<addressId>", "paymentMethod": "COD" }` or `"MOCK"`. `MOCK` is explicitly a demo payment: it marks the test order paid without contacting a payment provider or charging money. Current order creation calculates price, tax, shipping, and stock on the server.

## Orders, payments, and admin

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/orders` | Authenticated | Create order and clear cart |
| GET | `/orders` | Authenticated | Own order history |
| GET | `/orders/:id` | Owner | Own order details |
| GET | `/orders/:id/status` | Owner | Own order status |
| PUT | `/orders/:id/cancel` | Owner | Cancel eligible order |
| GET | `/orders/admin/all` | Admin | All orders |
| GET | `/orders/admin/:id` | Admin | Order details |
| PUT | `/orders/admin/:id/status` | Admin | Update order status |
| PUT | `/orders/admin/:id/cancel` | Admin | Cancel order |
| GET | `/admin/dashboard` | Admin | Counts, paid sales, recent orders, and monthly paid-sales aggregates |
| POST | `/payment/razorpay/create-order` | Authenticated | Create Razorpay order (credentials required) |
| POST | `/payment/razorpay/verify` | Authenticated | Verify Razorpay HMAC signature |

Order creation and inventory reservation use MongoDB transactions on replica sets/sharded clusters. Standalone MongoDB uses atomic per-product stock reservation with compensating stock restoration on order/cart-write errors. The direct client-accessible “mark paid” endpoint is intentionally not exposed; online production payment finalization requires provider verification.

Errors use `{ "success": false, "message": "..." }`. Validation errors return HTTP 400, unauthenticated requests 401, role restrictions 403, missing resources 404, and duplicate resources 400.
