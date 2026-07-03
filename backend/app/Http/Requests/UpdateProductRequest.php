<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'variants' => 'required|array|min:1',
            'variants.*.id' => 'nullable|integer|exists:variants,id',
            'variants.*.sku' => 'required|string|max:100|distinct',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.price' => 'required|numeric|gt:0',
            'variants.*.stock_quantity' => 'required|integer|gte:0',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $variants = $this->input('variants', []);
            foreach ($variants as $index => $v) {
                if (empty($v['sku'])) continue;

                $query = \App\Models\Variant::where('sku', $v['sku']);
                if (!empty($v['id'])) {
                    $query->where('id', '!=', $v['id']);
                }

                if ($query->exists()) {
                    $validator->errors()->add("variants.{$index}.sku", 'The SKU "' . $v['sku'] . '" has already been taken.');
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'variants.*.sku.distinct' => 'Each variant SKU must be unique in this form.',
            'variants.*.price.gt' => 'Variant price must be a positive number.',
            'variants.*.stock_quantity.gte' => 'Variant stock cannot be negative.',
        ];
    }
}
