<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Electronics',
            'Clothing',
            'Books',
            'Home & Kitchen',
            'Sports & Outdoors'
        ];

        foreach ($categories as $catName) {
            $category = Category::create(['name' => $catName]);

            // Seed 4-6 products for each category
            $productCount = rand(4, 6);
            for ($i = 0; $i < $productCount; $i++) {
                $product = Product::factory()->create([
                    'category_id' => $category->id,
                    'title' => $this->getProductTitle($catName, $i + 1),
                ]);

                // Seed 2-4 variants for each product
                $variantCount = rand(2, 4);
                Variant::factory()->count($variantCount)->create([
                    'product_id' => $product->id,
                ]);
            }
        }
    }

    /**
     * Helper to get more realistic product titles.
     */
    private function getProductTitle(string $category, int $index): string
    {
        $titles = [
            'Electronics' => [
                'Wireless Bluetooth Headphones',
                'Smartwatch Series 5',
                '4K Ultra HD Action Camera',
                'Portable Bluetooth Speaker',
                'Mechanical Gaming Keyboard',
                'Ergonomic Wireless Mouse'
            ],
            'Clothing' => [
                'Classic Crewneck T-Shirt',
                'Slim-Fit Stretch Chinos',
                'Lightweight Hooded Windbreaker',
                'Denim Jacket Original',
                'Athletic Running Shorts',
                'Soft Knit Beanie'
            ],
            'Books' => [
                'The Road to Software Architecture',
                'Mastering Clean Code',
                'Laravel Cookbook 2026',
                'Next.js 15 Deep Dive',
                'Algorithms for Beginners',
                'Introduction to SQL Databases'
            ],
            'Home & Kitchen' => [
                'Stainless Steel Coffee Maker',
                'Non-Stick Fry Pan 10-Inch',
                'Digital Food Kitchen Scale',
                'Double-Wall Vacuum Tumbler',
                'Silicone Baking Mat Set',
                'Electric Milk Frother'
            ],
            'Sports & Outdoors' => [
                'Premium Yoga Mat 6mm',
                'Insulated Water Bottle 32oz',
                'Resistance Band Set',
                'Compact Camping Hammock',
                'Folding Trekking Poles',
                'Adjustable Dumbbells'
            ]
        ];

        return $titles[$category][$index - 1] ?? "{$category} Product {$index}";
    }
}
