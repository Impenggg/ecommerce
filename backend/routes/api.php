<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/inventory', [ProductController::class, 'inventory']);
Route::get('/categories', [ProductController::class, 'categories']);
Route::get('/colors', [ProductController::class, 'colors']);

