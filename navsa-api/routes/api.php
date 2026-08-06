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

Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {

    Route::get('/stats', [AdminController::class, 'stats']);

    // Registrations
    Route::get('/registrations', [AdminController::class, 'getRegistrations'])->middleware('can:registrations.view');
    Route::post('/registrations/{id}/approve', [AdminController::class, 'approveRegistration'])->middleware('can:registrations.approve');
    Route::post('/registrations/{id}/reject', [AdminController::class, 'rejectRegistration'])->middleware('can:registrations.reject');

    // Products CRUD + stock + delete + ERP import
    Route::post('/import-erp',                     [AdminController::class, 'importErpProducts'])->middleware('can:products.import-erp');
    Route::get('/products',                        [AdminController::class, 'products'])->middleware('can:products.view');
    Route::post('/products',                       [AdminController::class, 'createProduct'])->middleware('can:products.create');
    Route::put('/products/{id}',                   [AdminController::class, 'updateProduct'])->middleware('can:products.edit');
    Route::patch('/products/{id}/toggle-web',      [AdminController::class, 'toggleWeb'])->middleware('can:products.edit');
    Route::patch('/products/{id}/toggle-offer',    [AdminController::class, 'toggleOffer'])->middleware('can:products.edit');
    Route::patch('/products/{id}/toggle-best-offer',[AdminController::class, 'toggleBestOffer'])->middleware('can:products.edit');
    Route::patch('/products/{id}/toggle-new-arrival',[AdminController::class, 'toggleNewArrival'])->middleware('can:products.edit');
    Route::patch('/products/{id}/stock',           [AdminController::class, 'updateStock'])->middleware('can:products.edit');
    Route::patch('/products/{id}/soft-delete',     [AdminController::class, 'softDeleteProduct'])->middleware('can:products.delete');
    Route::patch('/products/{id}/restore',         [AdminController::class, 'restoreProduct'])->middleware('can:products.delete');
    Route::delete('/products/{id}',                [AdminController::class, 'hardDeleteProduct'])->middleware('can:products.delete');
    Route::patch('/products/clear-offers',         [AdminController::class, 'clearOffers'])->middleware('can:products.edit');

    // Customers (Users)
    Route::get('/users',                           [AdminController::class, 'users'])->middleware('can:customers.view');
    Route::put('/users/{id}',                      [AdminController::class, 'updateUser'])->middleware('can:customers.manage');
    Route::delete('/users/{id}',                   [AdminController::class, 'deleteUser'])->middleware('can:customers.manage');
    Route::post('/users/{id}/roles',               [AdminController::class, 'assignUserRoles'])->middleware('can:roles.manage');

    // Suppliers
    Route::get('/suppliers',                       [AdminController::class, 'suppliers'])->middleware('can:suppliers.view');
    Route::put('/suppliers/{id}',                  [AdminController::class, 'updateSupplier'])->middleware('can:suppliers.manage');

    // Brands
    Route::get('/brands',                          [AdminController::class, 'brands'])->middleware('can:brands.manage');
    Route::post('/brands',                         [AdminController::class, 'createBrand'])->middleware('can:brands.manage');
    Route::put('/brands/{id}',                     [AdminController::class, 'updateBrand'])->middleware('can:brands.manage');
    Route::patch('/brands/{id}/soft-delete',       [AdminController::class, 'softDeleteBrand'])->middleware('can:brands.manage');
    Route::delete('/brands/{id}',                  [AdminController::class, 'hardDeleteBrand'])->middleware('can:brands.manage');

    // Categories
    Route::get('/categories',                      [AdminController::class, 'categories'])->middleware('can:categories.manage');
    Route::post('/categories',                     [AdminController::class, 'createCategory'])->middleware('can:categories.manage');
    Route::put('/categories/{id}',                 [AdminController::class, 'updateCategory'])->middleware('can:categories.manage');
    Route::patch('/categories/{id}/soft-delete',   [AdminController::class, 'softDeleteCategory'])->middleware('can:categories.manage');
    Route::delete('/categories/{id}',              [AdminController::class, 'hardDeleteCategory'])->middleware('can:categories.manage');

    // Banners
    Route::get('/banners',                         [AdminController::class, 'banners'])->middleware('can:banners.manage');
    Route::post('/banners',                        [AdminController::class, 'uploadBanner'])->middleware('can:banners.manage');
    Route::post('/banners/reorder',                [AdminController::class, 'reorderBanners'])->middleware('can:banners.manage');
    Route::post('/banners/{id}',                   [AdminController::class, 'updateBanner'])->middleware('can:banners.manage');
    Route::delete('/banners/{id}',                 [AdminController::class, 'deleteBanner'])->middleware('can:banners.manage');

    // PDFs
    Route::get('/pdfs',                            [AdminController::class, 'pdfs'])->middleware('can:pdfs.manage');
    Route::post('/pdfs',                           [AdminController::class, 'uploadPdf'])->middleware('can:pdfs.manage');
    Route::post('/pdfs/reorder',                   [AdminController::class, 'reorderPdfs'])->middleware('can:pdfs.manage');
    Route::post('/pdfs/{id}',                      [AdminController::class, 'updatePdf'])->middleware('can:pdfs.manage');
    Route::delete('/pdfs/{id}',                    [AdminController::class, 'deletePdf'])->middleware('can:pdfs.manage');

    // Roles & Permissions Management
    Route::get('/roles',                           [AdminController::class, 'getRoles'])->middleware('can:roles.view');
    Route::post('/roles',                          [AdminController::class, 'createRole'])->middleware('can:roles.manage');
    Route::put('/roles/{id}',                      [AdminController::class, 'updateRolePermissions'])->middleware('can:roles.manage');
    Route::get('/permissions',                     [AdminController::class, 'getPermissions'])->middleware('can:roles.view');
});