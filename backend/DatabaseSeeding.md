# Database seeding (dummy categories/products)

This project uses Laravel **migrations** and **seeders** to populate the database with dummy catalog data.

## What gets seeded
- Categories (e.g. Electronics, Clothing, Books, etc.)
- Products for each category
- Variants (SKU/size/color/price/stock) for each product

## Run migrations + seed (recommended for first setup)
From the backend folder:

```bash
cd ecommerce/backend
php artisan migrate:fresh --seed
```

That command:
1. Drops all tables
2. Re-runs all migrations
3. Executes `DatabaseSeeder` (which calls `CategorySeeder`)

## Seed only (without re-running migrations)
```bash
cd ecommerce/backend
php artisan db:seed
```

## Verify data
```bash
cd ecommerce/backend
php artisan tinker

// Example (in tinker)
App\\Models\\Category::count();
App\\Models\\Product::count();
App\\Models\\Variant::count();
```

