<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AdminController;
use App\Models\Category;
use App\Models\Brand;
use App\Models\SubCategory;
use App\Http\Controllers\Api\ShippingController;
use App\Http\Controllers\Api\CustomerRegistrationController;
use App\Http\Controllers\Api\SupplierRegistrationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories', function () {
    return Category::where('status', 1)
        ->orderBy('category_name')
        ->get(['id', 'category_name']);
});

Route::get('/sub-categories', function () {
    return SubCategory::where('status', 1)
        ->orderBy('sub_category_name')
        ->get(['id', 'category_id', 'sub_category_name', 'group_code']);
});

Route::get('/sub-categories/{categoryId}', function ($categoryId) {
    return SubCategory::where('category_id', $categoryId)
        ->where('status', 1)
        ->orderBy('sub_category_name')
        ->get(['id', 'category_id', 'sub_category_name', 'group_code']);
});

Route::get('/brands', function () {
    return Brand::where('status', 1)
        ->orderBy('brand_name')
        ->get(['id', 'brand_name']);
});

Route::get('/shipping/containers', [ShippingController::class, 'containers']);
Route::get('/shipping/countries', [ShippingController::class, 'countries']);
Route::get('/shipping/ports/{country}', [ShippingController::class, 'ports']);

Route::post('/register-customer', [CustomerRegistrationController::class, 'register']);
Route::post('/register-supplier', [SupplierRegistrationController::class, 'register']);

Route::get('/deals', [AdminController::class, 'publicDeals']);
Route::get('/home-banners', [AdminController::class, 'publicHomeBanners']);
Route::post('/login', [AdminController::class, 'login']);
Route::match(['get', 'options'], '/login', function() {
    return response()->json(['message' => 'Login requires a POST request.'], 405);
});
Route::post('/logout', [AdminController::class, 'logout'])->middleware('auth:sanctum');

Route::prefix('admin')->group(function () {

    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/registrations', [AdminController::class, 'getRegistrations']);
    Route::post('/registrations/{id}/approve', [AdminController::class, 'approveRegistration']);
    Route::post('/registrations/{id}/reject', [AdminController::class, 'rejectRegistration']);

    // Products CRUD + stock + delete + ERP import
    Route::post('/import-erp',                     [AdminController::class, 'importErpProducts']);
    Route::get('/products',                        [AdminController::class, 'products']);
    Route::post('/products',                       [AdminController::class, 'createProduct']);
    Route::put('/products/{id}',                   [AdminController::class, 'updateProduct']);
    Route::patch('/products/{id}/toggle-web',      [AdminController::class, 'toggleWeb']);
    Route::patch('/products/{id}/toggle-offer',    [AdminController::class, 'toggleOffer']);
    Route::patch('/products/{id}/toggle-best-offer',[AdminController::class, 'toggleBestOffer']);
    Route::patch('/products/{id}/toggle-new-arrival',[AdminController::class, 'toggleNewArrival']);
    Route::patch('/products/{id}/stock',           [AdminController::class, 'updateStock']);
    Route::patch('/products/{id}/soft-delete',     [AdminController::class, 'softDeleteProduct']);
    Route::patch('/products/{id}/restore',         [AdminController::class, 'restoreProduct']);
    Route::delete('/products/{id}',                [AdminController::class, 'hardDeleteProduct']);
    Route::patch('/products/clear-offers',         [AdminController::class, 'clearOffers']);

    Route::get('/users',                           [AdminController::class, 'users']);
    Route::put('/users/{id}',                      [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}',                   [AdminController::class, 'deleteUser']);

    Route::get('/suppliers',                       [AdminController::class, 'suppliers']);
    Route::put('/suppliers/{id}',                  [AdminController::class, 'updateSupplier']);

    Route::get('/brands',                          [AdminController::class, 'brands']);
    Route::post('/brands',                         [AdminController::class, 'createBrand']);
    Route::put('/brands/{id}',                     [AdminController::class, 'updateBrand']);
    Route::patch('/brands/{id}/soft-delete',       [AdminController::class, 'softDeleteBrand']);
    Route::delete('/brands/{id}',                  [AdminController::class, 'hardDeleteBrand']);

    Route::get('/categories',                      [AdminController::class, 'categories']);
    Route::post('/categories',                     [AdminController::class, 'createCategory']);
    Route::put('/categories/{id}',                 [AdminController::class, 'updateCategory']);
    Route::patch('/categories/{id}/soft-delete',   [AdminController::class, 'softDeleteCategory']);
    Route::delete('/categories/{id}',              [AdminController::class, 'hardDeleteCategory']);

    Route::get('/banners',                         [AdminController::class, 'banners']);
    Route::post('/banners',                        [AdminController::class, 'uploadBanner']);
    Route::post('/banners/reorder',                [AdminController::class, 'reorderBanners']);
    Route::post('/banners/{id}',                   [AdminController::class, 'updateBanner']);
    Route::delete('/banners/{id}',                 [AdminController::class, 'deleteBanner']);

    Route::get('/pdfs',                            [AdminController::class, 'pdfs']);
    Route::post('/pdfs',                           [AdminController::class, 'uploadPdf']);
    Route::post('/pdfs/reorder',                   [AdminController::class, 'reorderPdfs']);
    Route::post('/pdfs/{id}',                      [AdminController::class, 'updatePdf']);
    Route::delete('/pdfs/{id}',                    [AdminController::class, 'deletePdf']);
});