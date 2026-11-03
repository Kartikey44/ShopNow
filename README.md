# ShopNow

ShopNow is a React/Vite storefront and an Express/MongoDB API. The storefront supports catalog search and filtering, customer accounts, server-persisted carts, checkout, order history, and an admin area for catalog, inventory, customer, order, and category management.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm.
- MongoDB. A standalone local server is supported; replica-set/sharded deployments use transactions for order and inventory writes.
- Cloudinary credentials for admin image uploads, image replacement, and remote image deletion.

## Run locally

1. Start MongoDB. For a local MongoDB installation, the example URI is `mongodb://127.0.0.1:27017/shopnow`.
2. In a PowerShell terminal:

   ```powershell
   Set-Location Backend
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

   Edit `Backend/.env` with a private MongoDB URI and distinct random `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values. Set `FRONTEND_URL=http://localhost:5173` for the default Vite server. Do not commit `.env`.
3. In a second PowerShell terminal:

   ```powershell
   Set-Location Frontend
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

4. Open the Vite URL printed in the frontend terminal (normally `http://localhost:5173`) and register an account. Admin registration is available by selecting the admin role; only grant admin access to trusted operators.
5. To populate an empty store, sign in as an admin, then in another terminal run:

   ```powershell
   Set-Location Backend
   npm run seed
   ```

   This idempotently creates five categories and 45 sample products. Seed image URLs are external Unsplash URLs and are not Cloudinary uploads.

The backend listens on port 5000 unless `PORT` is configured. The frontend API base URL comes from `VITE_BACKEND_SERVER`; `/api` is added automatically when omitted. For production, set this to the deployed backend origin (for example, `https://shopnow-d3tl.onrender.com`) and set the backend's `FRONTEND_URL` to the exact deployed frontend origin to allow credentialed browser requests. Redeploy the frontend after changing its `VITE_` variable.

## External integrations

Cloudinary is needed for product image upload, replacement, and deletion. Razorpay credentials are optional and are only used by its payment API. SMTP credentials are optional and required for password-reset email. Checkout's `MOCK` option is a clearly labeled local demo payment that never charges a customer; use COD for non-payment-provider orders.

## Scripts and API

- Backend: `npm run dev`, `npm start`, `npm test`, `npm run seed`.
- Frontend: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`.
- See [API.md](API.md) for route methods, access levels, request shapes, filtering, and payment notes.
