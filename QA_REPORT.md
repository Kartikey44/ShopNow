# ShopNow QA Report

## Summary

The existing MERN application was audited and scoped defects were fixed. Backend integration was exercised against local MongoDB with temporary QA data, the frontend was exercised in the Browser canvas, and the sample-data seed was run twice. No production credentials or data were used.

The backend connected to MongoDB at `127.0.0.1`; its API returned successful product/category responses. The browser workflow was routed to the QA API on port `5002` because the Browser canvas could not reach port `5000`; direct PowerShell requests to the default API port were also checked. The frontend was observed at `628 × 732` pixels, with the mobile navigation visible and no horizontal overflow (`613px` document width).

## Verification

| Check | Result |
|---|---|
| MongoDB connection | Backend startup logged `MongoDB Connected: 127.0.0.1`; local category and product API requests returned HTTP 200. |
| Backend automated tests | `npm --prefix Backend test` — 6 passed, 0 failed. |
| Frontend lint | `npm --prefix Frontend run lint` — passed. |
| Frontend production build | `npm --prefix Frontend run build` — passed. |
| Backend JavaScript syntax | `node --check` passed for all 45 backend source/test JavaScript files. |
| Seed script | Ran twice against local MongoDB; each run reported 45 products and 5 categories. The second run completed without duplicate inserts or Mongoose deprecation warnings. |
| Browser checks | Customer signup/login, catalog search, product detail, cart update/clear, COD checkout, order history, admin dashboard/product list, and password recovery UI were exercised. |
| Responsive check | Browser canvas at 628 × 732; mobile navigation displayed and no horizontal overflow. Desktop viewport coverage was not available. |

## APIs implemented and exercised

- **Authentication and users:** register, login, logout, profile, profile update, password update, forgot-password configuration response, invalid reset token, admin user list/detail/role/status/delete. Invalid credentials, role authorization, and blocked-account behavior were checked.
- Admin registration without an invitation code was re-verified against the live API without `ADMIN_SIGNUP_CODE` configured (HTTP 201, role `admin`).
- **Products and reviews:** product list with search/category/price/sort/page parameters, product detail by MongoDB ID, admin list/create/edit/delete, review create/list/delete, duplicate review rejection, invalid price range, malformed IDs, and stock validation.
- **Categories:** public list/detail, admin create/PATCH/delete, malformed ID handling, and refusal to delete a category referenced by a product.
- **Cart:** persisted read/add/quantity update/remove/clear, server-calculated prices, invalid quantity, and insufficient-stock rejection.
- **Addresses:** create/list/detail/update/delete and owner isolation.
- **Orders:** COD and demo `MOCK` creation, customer history/detail/status/cancel, stock reservation/restoration, admin list/detail/status/cancel, customer visibility of admin status changes, and duplicate cancellation protection.
- **Dashboard:** admin statistics/recent orders/paid-sales endpoint returned database-backed data.
- **Payments and image upload:** authenticated Razorpay create/verify requests returned the expected unavailable response without credentials. Multer rejected a non-image file; a valid image upload request returned the explicit Cloudinary-not-configured response.

The route catalog and request shapes are documented in [API.md](API.md).

## Workflow results

| Workflow | Result |
|---|---|
| 1. Register → Login → Browse Products | Verified through the browser: customer registration authenticated the user, and the home/catalog rendered live API products. API login and protected profile access also passed. |
| 2. Search → Filter → View Product Details | Browser search returned matching seeded product data and product details loaded by MongoDB ID. Category/price/sort/pagination filters were also exercised through the REST API. |
| 3. Add to Cart → Update Quantity → Remove Product | Browser add and quantity update passed; clear-cart produced the empty state. REST add/update/remove/clear and stock rejection passed. |
| 4. Checkout → Place Order → View Order History | Browser COD checkout created an order visible in history. REST checks verified server-priced totals, stock reservation, cancellation, and stock restoration. Demo `MOCK` also created a paid test order without charging. |
| 5. Login as Admin → Create Product → Upload Images | Admin login/dashboard and product creation with image metadata passed. Actual Cloudinary upload was attempted and returned HTTP 503 because no Cloudinary credentials are configured; upload to Cloudinary is therefore **not verified as working**. |
| 6. Edit Product → Replace Images → Delete Product | Product fields, stock, price, and image metadata replacement plus product deletion passed through the API. Remote Cloudinary image replacement/deletion is **not verified** because credentials are absent. |
| 7. Update Order Status → Verify Customer Order History | Admin status changes to `SHIPPED` and `CANCELLED` passed; customer order status/history reflected the updates. Repeated cancellation did not restore stock twice. |
| 8. Logout → Verify Protected Routes | Logout returned HTTP 200 and a subsequent profile request returned HTTP 401. Customer access to admin endpoints returned HTTP 403. |
| 9. Invalid/unauthorized/insufficient-stock requests | Invalid registration/product filters/IDs/quantities and file type were rejected; protected/admin routes enforced authorization; insufficient cart stock was rejected. |
| 10. Frontend responsiveness | At 628 × 732, mobile navigation and responsive forms/cart were visible without horizontal overflow. Desktop and other browser/device sizes were not tested. |

## Bugs fixed

- Corrected category lookup/PATCH behavior and user lookup to use the proper request parameters; added input validation and category-in-use deletion protection.
- Removed admin invitation-code handling and password-reset token URL logging.
- Added Cloudinary configuration checks so image upload or remote deletion fails explicitly with HTTP 503 when credentials are absent; seed placeholder images remain local-only.
- Added forgot/reset-password pages for existing login links, routed reset emails through `FRONTEND_URL`, and made missing SMTP configuration return HTTP 503 instead of a generic mail failure.
- Reworked order cancellation/status updates to use conditional status transitions, transactional stock restoration where supported, and rollback compensation on standalone MongoDB. Admin status-based cancellation now follows the same cancellation guards.
- Removed the cart’s hardcoded shipping estimate, which disagreed with server totals; tax and shipping are now stated as calculated at checkout.
- Removed unverified fixed hero claims for discounts, product counts, collection counts, and support availability.
- Replaced deprecated Mongoose `new: true` options with `returnDocument: "after"` in the touched API and seed paths.

## External credentials and remaining limitations

- **Cloudinary:** no credentials were configured. Upload, remote replacement, and remote deletion remain unavailable and were not claimed as working.
- **Razorpay:** no credentials were configured. Live order creation/signature verification against Razorpay were not performed; the local checkout options are COD and demo-only `MOCK`.
- **Email/SMTP:** no credentials were configured. The forgot-password UI/API correctly reports that reset email is unavailable; a delivered email and successful token-based reset were not tested.
- **Admin signup:** admin registration is intentionally available without an invitation code, per the requested behavior. Restrict public signup or role selection at deployment if unrestricted admin creation is not appropriate.
- **MongoDB transaction topology:** order and cancellation flows passed against the available local MongoDB. A replica-set/sharded deployment was not available, so the transaction-enabled path was not independently exercised.
- **Browser coverage:** only the Browser canvas at 628 × 732 was inspected; desktop browsers/devices were not covered. The canvas could not connect to port 5000, so browser integration used the QA backend on port 5002. Port 5000 was separately started and probed from PowerShell.
- **Dependency advisories:** the prior dependency audit reported 10 Backend and 17 Frontend advisories; they were not remediated in this QA scope. Re-run `npm audit` and review/upgrade them before production deployment.
- The local `shopnow` database contains the 45 sample products/5 categories from the seed run and temporary QA order/account records created during live workflow checks.

## Run the application

Requirements: Node.js 20.19+ (or 22.12+), npm, and a running MongoDB instance.

In PowerShell, configure the backend first (copy the example only if `Backend/.env` does not already exist):

```powershell
Set-Location Backend
Copy-Item .env.example .env
# Set MONGO_URI, distinct JWT_ACCESS_SECRET/JWT_REFRESH_SECRET values,
# FRONTEND_URL in .env.
npm install
npm run dev
```

In a second PowerShell terminal:

```powershell
Set-Location Frontend
Copy-Item .env.example .env
npm install
npm run dev
```

To load the sample catalog after creating an admin account:

```powershell
Set-Location Backend
npm run seed
```

The seed is idempotent and inserts 45 sample products across 5 categories. For image management, configure the three Cloudinary variables; for live Razorpay and password-reset email, configure their respective credentials. Setup details and environment variable names are in [README.md](README.md), [Backend/.env.example](Backend/.env.example), and [Frontend/.env.example](Frontend/.env.example).
