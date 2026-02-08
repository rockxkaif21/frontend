# Slooze Commodities Management (Frontend)

This is a Next.js + Tailwind CSS prototype implementing the Slooze Commodities Management challenge flow with mocked GraphQL services via Apollo Client.

## Scope Covered
- Login with form validation (GraphQL `login` mutation mocking `POST /auth/login`)
- Role-based routing and menu gating
  - Manager: dashboard + products
  - Store Keeper: products only (dashboard URL redirects to products with an access notice)
- Product listing (GraphQL `products` query mocking `GET /products`)
- Add and edit product flows (GraphQL `createProduct` and `updateProduct` mutations mocking `POST/PUT /products`)
- Light/Dark mode toggle persisted to `localStorage`

## Assumptions
- Backend APIs are not called directly in this demo; Apollo operations are resolved through a local mock link (`lib/apolloClient.ts`).
- Emails containing `manager` become Manager role; all others become Store Keeper.
- Any password with 4+ characters is accepted in the mock login.
- Session and theme preferences are stored in `localStorage`.

## Known Limitations
- No real auth token lifecycle (refresh/expiry/revocation) is implemented.
- GraphQL layer is mocked in-memory for demo/review purposes.
- Product data resets on refresh because persistence/database is not connected.

## Demo Walkthrough
1. Log in as `manager@slooze.xyz / pass1234`
   - You should see Dashboard and Products in the nav.
   - Dashboard metrics and insights are visible.
2. Log out and log in as `keeper@slooze.xyz / pass1234`
   - Dashboard link is hidden.
   - Visiting `/dashboard` redirects to `/products?denied=dashboard` with an access warning.
3. Open Products
   - View inventory list.
   - Add a product and edit a product row using the form.
4. Toggle theme
   - Use "Switch to Dark/Light" in the header and refresh to confirm persistence.

## Local Setup (from scratch)
1. Create a Next.js project using the **Pages Router** (not App Router).
2. Copy this repository structure/files into your project.
3. Install and run:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Sample Accounts
- Manager: `manager@slooze.xyz` / `pass1234`
- Store Keeper: `keeper@slooze.xyz` / `pass1234`
