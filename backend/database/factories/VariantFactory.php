<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Variant>
 */
class VariantFactory extends Factory
{
    protected $model = Variant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $color = $this->faker->randomElement(['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Grey']);
        $size = $this->faker->randomElement(['S', 'M', 'L', 'XL', 'XXL']);
        
        return [
            'product_id' => Product::factory(),
            'sku' => strtoupper($this->faker->unique()->bothify('???-#####')),
            'size' => $size,
            'color' => $color,
            'price' => $this->faker->randomFloat(2, 5, 499.99),
            'stock_quantity' => $this->faker->numberBetween(0, 150),
        ];
    }
}
