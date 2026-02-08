# Slooze Commodities Management (Frontend)

This is a Next.js + Tailwind CSS prototype implementing the Slooze Commodities Management challenge flow with mocked API services.

## Scope Covered
- Login with form validation (mocked `POST /auth/login`)
- Role-based routing and menu gating
  - Manager: dashboard + products
  - Store Keeper: products only
- Product listing (mocked `GET /products`)
- Add and edit product flows (mocked `POST /products`, `PUT /products/{id}`)
- Light/Dark mode toggle persisted to `localStorage`

## Assumptions
- No backend server is required for this demo; all API calls are simulated in `lib/mockApi.ts`.
- Emails containing `manager` become Manager role; all others become Store Keeper.
- Session and theme preferences are stored in `localStorage`.

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
- Manager: `manager@slooze.xyz`
- Store Keeper: `keeper@slooze.xyz`
