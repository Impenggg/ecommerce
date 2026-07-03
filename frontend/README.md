# Frontend (Next.js)

Admin + Public shop UI.

## Run locally

```bash
cd ecommerce/frontend
npm install
npm run dev
```

Frontend expects the Laravel API.

### Environment

- `NEXT_PUBLIC_API_URL` (example): `http://localhost:8000/api`

## Key Pages

- `/shop` — public catalog with client-side filtering
- `/admin/products` — inventory dashboard
- `/admin/products/create` — dynamic create-product form

## Build

```bash
npm run build
```

