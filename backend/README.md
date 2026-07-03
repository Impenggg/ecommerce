# Backend (Laravel API)

REST API for products, categories, and variants.

## Run locally

```bash
cd ecommerce/backend
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Default server: `http://localhost:8000`

## Testing

```bash
cd ecommerce/backend
php artisan test
```

## API Endpoints (High Level)

- `GET /api/categories`
- `GET /api/colors`
- `GET /api/products`
- `GET /api/products/inventory`
- `POST /api/products`

