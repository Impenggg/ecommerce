<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Variant;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of products with categories and variants.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['category_id', 'color', 'per_page']);
        $products = $this->productService->list($filters);

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display inventory details for the admin table.
     */
    public function inventory(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'sort_by', 'sort_order', 'per_page']);
        $products = $this->productService->inventoryDashboard($filters);

        // Map data to the format expected by TanStack Table
        $mappedItems = collect($products->items())->map(function ($product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'category_name' => $product->category->name ?? 'Uncategorized',
                'variants_count' => $product->variants_count ?? 0,
                'total_stock' => (int) ($product->total_stock ?? 0),
                'created_at' => $product->created_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'data' => $mappedItems,
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * Display a listing of categories.
     */
    public function categories(): AnonymousResourceCollection
    {
        return CategoryResource::collection(Category::orderBy('name')->get());
    }

    /**
     * Get distinct colors of variants in stock.
     */
    public function colors(): JsonResponse
    {
        $colors = Variant::whereNotNull('color')
            ->where('color', '!=', '')
            ->distinct()
            ->orderBy('color')
            ->pluck('color');

        return response()->json([
            'data' => $colors
        ]);
    }
}
