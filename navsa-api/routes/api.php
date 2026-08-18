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
use App\Http\Controllers\Api\ProfileController;

Route::get('/profile', [ProfileController::class, 'getProfile']);
Route::put('/profile', [ProfileController::class, 'updateProfile']);
Route::get('/orders', [ProfileController::class, 'getOrders']);
Route::post('/orders', [ProfileController::class, 'createOrder']);
Route::post('/orders/{id}/reorder', [ProfileController::class, 'reorder']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories', function () {
    return Category::whereNull('parent_id')
        ->where('status', 1)
        ->where(function ($query) {
            $query->where('deleted', false)->orWhereNull('deleted');
        })
        ->orderBy('category_name')
        ->get(['id', 'category_name', 'image_path']);
});

Route::get('/sub-categories', function () {
    return SubCategory::where('status', 1)
        ->where(function ($query) {
            $query->where('deleted', false)->orWhereNull('deleted');
        })
        ->whereHas('category', function ($query) {
            $query->whereNull('parent_id')
                ->where('status', 1)
                ->where(function ($categoryQuery) {
                    $categoryQuery->where('deleted', false)->orWhereNull('deleted');
                });
        })
        ->orderBy('sub_category_name')
        ->get(['id', 'category_id', 'sub_category_name', 'group_code']);
});

Route::get('/sub-categories/{categoryId}', function ($categoryId) {
    return SubCategory::where('category_id', $categoryId)
        ->where('status', 1)
        ->where(function ($query) {
            $query->where('deleted', false)->orWhereNull('deleted');
        })
        ->whereHas('category', function ($query) {
            $query->whereNull('parent_id')
                ->where('status', 1)
                ->where(function ($categoryQuery) {
                    $categoryQuery->where('deleted', false)->orWhereNull('deleted');
                });
        })
        ->orderBy('sub_category_name')
        ->get(['id', 'category_id', 'sub_category_name', 'group_code']);
});

Route::get('/brands', function () {
    return Brand::where('status', 1)
        ->where(function ($query) {
            $query->where('deleted', false)->orWhereNull('deleted');
        })
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
Route::post('/login', [AdminController::class, 'login'])->name('login');
Route::match(['get', 'options'], '/login', function() {
    return response()->json(['message' => 'Login requires a POST request.'], 405);
});
Route::post('/logout', [AdminController::class, 'logout'])->middleware('admin.auth');

Route::prefix('admin')->middleware(['admin.auth'])->group(function () {

    Route::get('/stats', [AdminController::class, 'stats']);

    // Registrations
    Route::get('/registrations', [AdminController::class, 'getRegistrations'])->middleware('can:registrations.view');
    Route::post('/registrations/{id}/approve', [AdminController::class, 'approveRegistration'])->middleware('can:registrations.approve');
    Route::post('/registrations/{id}/reject', [AdminController::class, 'rejectRegistration'])->middleware('can:registrations.reject');

    // Products CRUD + stock + delete + ERP import
    Route::post('/import-erp',                     [AdminController::class, 'importErpProducts'])->middleware('can:products.import-erp');
    Route::get('/products',                        [AdminController::class, 'products'])->middleware('can:products.view');
    Route::get('/vat-codes',                       [AdminController::class, 'vatCodes'])->middleware('can:products.view');
    Route::post('/products',                       [AdminController::class, 'createProduct'])->middleware('can:products.create');
    Route::patch('/products/bulk-hide',             [AdminController::class, 'bulkHideProducts'])->middleware('can:products.edit');
    Route::patch('/products/bulk-show',             [AdminController::class, 'bulkShowProducts'])->middleware('can:products.edit');
    Route::patch('/products/bulk-soft-delete',      [AdminController::class, 'bulkSoftDeleteProducts'])->middleware('can:products.delete');
    Route::patch('/products/bulk-restore',          [AdminController::class, 'bulkRestoreProducts'])->middleware('can:products.delete');
    Route::delete('/products/bulk-hard-delete',     [AdminController::class, 'bulkHardDeleteProducts'])->middleware('can:products.delete');
    Route::put('/products/{id}',                   [AdminController::class, 'updateProduct'])->middleware('can:products.edit');
    Route::post('/products/{id}/image',            [AdminController::class, 'uploadProductImage'])->middleware('can:products.edit');
    Route::patch('/products/{id}/image-selection', [AdminController::class, 'selectProductImage'])->middleware('can:products.edit');
    Route::delete('/products/{id}/image',          [AdminController::class, 'removeProductImage'])->middleware('can:products.edit');
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
    Route::patch('/brands/bulk-hide',              [AdminController::class, 'bulkHideBrands'])->middleware('can:brands.manage');
    Route::patch('/brands/bulk-show',              [AdminController::class, 'bulkShowBrands'])->middleware('can:brands.manage');
    Route::patch('/brands/bulk-soft-delete',       [AdminController::class, 'bulkSoftDeleteBrands'])->middleware('can:brands.manage');
    Route::patch('/brands/bulk-restore',           [AdminController::class, 'bulkRestoreBrands'])->middleware('can:brands.manage');
    Route::put('/brands/{id}',                     [AdminController::class, 'updateBrand'])->middleware('can:brands.manage');
    Route::patch('/brands/{id}/soft-delete',       [AdminController::class, 'softDeleteBrand'])->middleware('can:brands.manage');
    Route::patch('/brands/{id}/restore',           [AdminController::class, 'restoreBrand'])->middleware('can:brands.manage');
    Route::delete('/brands/{id}',                  [AdminController::class, 'hardDeleteBrand'])->middleware('can:brands.manage');

    // Main Categories
    Route::get('/categories',                          [AdminController::class, 'categories'])->middleware('can:categories.manage');
    Route::post('/categories',                         [AdminController::class, 'createCategory'])->middleware('can:categories.manage');
    Route::post('/categories/{id}/image',              [AdminController::class, 'uploadCategoryImage'])->middleware('can:categories.manage');
    Route::patch('/categories/bulk-hide',              [AdminController::class, 'bulkHideCategories'])->middleware('can:categories.manage');
    Route::patch('/categories/bulk-show',              [AdminController::class, 'bulkShowCategories'])->middleware('can:categories.manage');
    Route::patch('/categories/bulk-soft-delete',       [AdminController::class, 'bulkSoftDeleteCategories'])->middleware('can:categories.manage');
    Route::patch('/categories/bulk-restore',           [AdminController::class, 'bulkRestoreCategories'])->middleware('can:categories.manage');
    Route::delete('/categories/bulk-hard-delete',      [AdminController::class, 'bulkHardDeleteCategories'])->middleware('can:categories.manage');
    Route::put('/categories/{id}',                     [AdminController::class, 'updateCategory'])->middleware('can:categories.manage');
    Route::patch('/categories/{id}/soft-delete',       [AdminController::class, 'softDeleteCategory'])->middleware('can:categories.manage');
    Route::patch('/categories/{id}/restore',           [AdminController::class, 'restoreCategory'])->middleware('can:categories.manage');
    Route::delete('/categories/{id}',                  [AdminController::class, 'hardDeleteCategory'])->middleware('can:categories.manage');

    // Subcategories (same category-management permission)
    Route::get('/sub-categories',                      [AdminController::class, 'subCategories'])->middleware('can:categories.manage');
    Route::post('/sub-categories',                     [AdminController::class, 'createSubCategory'])->middleware('can:categories.manage');
    Route::patch('/sub-categories/bulk-hide',          [AdminController::class, 'bulkHideSubCategories'])->middleware('can:categories.manage');
    Route::patch('/sub-categories/bulk-show',          [AdminController::class, 'bulkShowSubCategories'])->middleware('can:categories.manage');
    Route::patch('/sub-categories/bulk-soft-delete',   [AdminController::class, 'bulkSoftDeleteSubCategories'])->middleware('can:categories.manage');
    Route::patch('/sub-categories/bulk-restore',       [AdminController::class, 'bulkRestoreSubCategories'])->middleware('can:categories.manage');
    Route::delete('/sub-categories/bulk-hard-delete',  [AdminController::class, 'bulkHardDeleteSubCategories'])->middleware('can:categories.manage');
    Route::put('/sub-categories/{id}',                 [AdminController::class, 'updateSubCategory'])->middleware('can:categories.manage');
    Route::patch('/sub-categories/{id}/soft-delete',   [AdminController::class, 'softDeleteSubCategory'])->middleware('can:categories.manage');
    Route::patch('/sub-categories/{id}/restore',       [AdminController::class, 'restoreSubCategory'])->middleware('can:categories.manage');
    Route::delete('/sub-categories/{id}',              [AdminController::class, 'hardDeleteSubCategory'])->middleware('can:categories.manage');

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

    // Orders Management
    Route::get('/orders',                          [AdminController::class, 'orders']);
    Route::get('/orders/{id}',                     [AdminController::class, 'showOrder']);
    Route::patch('/orders/{id}/status',            [AdminController::class, 'updateOrderStatus']);
});