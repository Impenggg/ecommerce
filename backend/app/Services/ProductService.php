<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductService
{
    /**
     * Get list of products with filters applied.
     */
    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Product::with(['category', 'variants']);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['color'])) {
            $query->whereHas('variants', function ($q) use ($filters) {
                $q->where('color', $filters['color']);
            });
        }

        // Default sort by created_at desc, paginate 12 items for shop grid
        return $query->latest()->paginate($filters['per_page'] ?? 12);
    }

    /**
     * Create a product and its variants atomically.
     */
    public function createProduct(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'category_id' => $data['category_id'],
            ]);

            foreach ($data['variants'] as $variantData) {
                $product->variants()->create($variantData);
            }

            return $product->load(['category', 'variants']);
        });
    }

    /**
     * Get inventory list optimized for admin dashboard.
     */
    public function inventoryDashboard(array $filters = [])
    {
        $query = Product::with(['category'])
            ->withCount('variants')
            ->withSum('variants as total_stock', 'stock_quantity');

        // Apply searching if product title search parameter is sent
        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        // Apply sorting
        $sortField = $filters['sort_by'] ?? 'title';
        $sortOrder = $filters['sort_order'] ?? 'asc';
        
        if ($sortField === 'title') {
            $query->orderBy('title', $sortOrder);
        } else {
            $query->latest();
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }
}
