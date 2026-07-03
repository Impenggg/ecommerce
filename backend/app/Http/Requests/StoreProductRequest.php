<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required',
            'new_category_name' => 'required_if:category_id,new|string|max:255|unique:categories,name',
            'variants' => 'required|array|min:1',
            'variants.*.sku' => 'required|string|max:100|distinct|unique:variants,sku',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.price' => 'required|numeric|gt:0',
            'variants.*.stock_quantity' => 'required|integer|gte:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'variants.*.sku.unique' => 'The SKU ":value" has already been taken.',
            'variants.*.sku.distinct' => 'Each variant SKU must be unique in this form.',
            'variants.*.price.gt' => 'Variant price must be a positive number.',
            'variants.*.stock_quantity.gte' => 'Variant stock cannot be negative.',
            'new_category_name.required_if' => 'Category name is required when adding a new category.',
            'new_category_name.unique' => 'A category with this name already exists.',
        ];
    }
}
