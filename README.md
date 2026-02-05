# Slooze Commodities Management (Frontend)

This is a lightweight Next.js + Tailwind CSS prototype implementing the Slooze Commodities Management feature flow. It mocks authentication, role-based access, and product management.

## Assumptions
- `POST /auth/login` and `GET/POST/PUT /products` are mocked in the UI layer.
- Emails containing `manager` are treated as `Manager` role; all others become `Store Keeper`.
- Session and theme preferences are stored in `localStorage`.

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Sample Accounts
- Manager: `manager@slooze.xyz`
- Store Keeper: `keeper@slooze.xyz`
