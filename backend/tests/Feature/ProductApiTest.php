<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test fetching products.
     */
    public function test_can_list_products_and_filter()
    {
        $category1 = Category::factory()->create(['name' => 'Tech']);
        $category2 = Category::factory()->create(['name' => 'Fashion']);

        $product1 = Product::factory()->create(['category_id' => $category1->id, 'title' => 'Laptop']);
        $product2 = Product::factory()->create(['category_id' => $category2->id, 'title' => 'Shirt']);

        Variant::factory()->create([
            'product_id' => $product1->id,
            'color' => 'Black',
        ]);

        Variant::factory()->create([
            'product_id' => $product2->id,
            'color' => 'Blue',
        ]);

        // List all
        $response = $this->getJson('/api/products');
        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        // Filter by category
        $response = $this->getJson('/api/products?category_id=' . $category1->id);
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Laptop');

        // Filter by color
        $response = $this->getJson('/api/products?color=Blue');
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Shirt');
    }

    /**
     * Test storing a product and its variants.
     */
    public function test_can_store_product_with_variants()
    {
        $category = Category::factory()->create();

        $payload = [
            'title' => 'Premium Shirt',
            'description' => 'A very nice premium cotton shirt.',
            'category_id' => $category->id,
            'variants' => [
                [
                    'sku' => 'SHIRT-M-RED',
                    'size' => 'M',
                    'color' => 'Red',
                    'price' => 29.99,
                    'stock_quantity' => 10,
                ],
                [
                    'sku' => 'SHIRT-L-BLUE',
                    'size' => 'L',
                    'color' => 'Blue',
                    'price' => 32.50,
                    'stock_quantity' => 15,
                ]
            ]
        ];

        $response = $this->postJson('/api/products', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Premium Shirt');

        $this->assertDatabaseHas('products', [
            'title' => 'Premium Shirt',
            'category_id' => $category->id,
        ]);

        $this->assertDatabaseHas('variants', [
            'sku' => 'SHIRT-M-RED',
            'price' => 29.99,
            'stock_quantity' => 10,
        ]);

        $this->assertDatabaseHas('variants', [
            'sku' => 'SHIRT-L-BLUE',
            'price' => 32.50,
            'stock_quantity' => 15,
        ]);
    }

    /**
     * Test validation rules (positive price, non-negative stock, unique SKU).
     */
    public function test_store_product_validation_rules()
    {
        $category = Category::factory()->create();

        // 1. Invalid price (negative) & negative stock
        $payload = [
            'title' => 'Broken Shirt',
            'category_id' => $category->id,
            'variants' => [
                [
                    'sku' => 'BAD-VAR-1',
                    'size' => 'M',
                    'color' => 'Red',
                    'price' => -5.00, // Invalid
                    'stock_quantity' => -10, // Invalid
                ]
            ]
        ];

        $response = $this->postJson('/api/products', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['variants.0.price', 'variants.0.stock_quantity']);

        // 2. Duplicate SKU in payload
        $payload = [
            'title' => 'Double SKU Shirt',
            'category_id' => $category->id,
            'variants' => [
                [
                    'sku' => 'SAME-SKU-123',
                    'price' => 10.00,
                    'stock_quantity' => 5,
                ],
                [
                    'sku' => 'SAME-SKU-123', // Duplicate
                    'price' => 12.00,
                    'stock_quantity' => 4,
                ]
            ]
        ];

        $response = $this->postJson('/api/products', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['variants.1.sku']);

        // 3. Existing SKU database collision
        $existingProduct = Product::factory()->create(['category_id' => $category->id]);
        Variant::factory()->create(['product_id' => $existingProduct->id, 'sku' => 'TAKEN-SKU']);

        $payload = [
            'title' => 'New Product',
            'category_id' => $category->id,
            'variants' => [
                [
                    'sku' => 'TAKEN-SKU', // Collides with existing database variant SKU
                    'price' => 15.00,
                    'stock_quantity' => 10,
                ]
            ]
        ];

        $response = $this->postJson('/api/products', $payload);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['variants.0.sku']);
    }

    /**
     * Test transaction atomic rollback if a variant write fails.
     */
    public function test_transaction_rolls_back_on_variant_failure()
    {
        $category = Category::factory()->create();

        // Register a pre-existing variant with SKU "DUP-SKU"
        $prod1 = Product::factory()->create(['category_id' => $category->id]);
        Variant::factory()->create(['product_id' => $prod1->id, 'sku' => 'DUP-SKU']);

        // Prepare request. We will try to store a product with two variants.
        // The first variant is valid, but the second one is a duplicate SKU "DUP-SKU".
        // Although the request validation usually stops this, we want to ensure that
        // at the service layer inside the transaction, if the first succeeds but the second fails,
        // the parent product itself is NOT persisted in the database.
        // We will bypass FormRequest validation rules by calling the service method directly to test the database transaction.

        $service = new \App\Services\ProductService();

        $data = [
            'title' => 'Ghost Product',
            'description' => 'Should not exist in DB after crash.',
            'category_id' => $category->id,
            'variants' => [
                [
                    'sku' => 'VALID-SKU-1',
                    'price' => 10.00,
                    'stock_quantity' => 10,
                ],
                [
                    'sku' => 'DUP-SKU', // database error on insert due to unique constraint
                    'price' => 12.00,
                    'stock_quantity' => 5,
                ]
            ]
        ];

        try {
            $service->createProduct($data);
            $this->fail("Expected QueryException was not thrown.");
        } catch (\Illuminate\Database\QueryException $e) {
            // Assert that the exception was caught
            $this->assertTrue(true);
        }

        // Verify that the product "Ghost Product" was NOT created
        $this->assertDatabaseMissing('products', [
            'title' => 'Ghost Product',
        ]);

        // Verify that the valid variant was NOT created either
        $this->assertDatabaseMissing('variants', [
            'sku' => 'VALID-SKU-1',
        ]);
    }
}
