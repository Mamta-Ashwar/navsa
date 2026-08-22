<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\SubCategory;
use App\Models\User;
use App\Models\Pdf;
use App\Models\HomeBanner;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    private function auth(Request $request): bool
    {
        $user = $request->user();

        return $user !== null
            && $user->status === 'approved'
            && $user->role === 'admin';
    }

    private function deny()
    {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Directory that is served by the React site as /products/<filename>.
     *
     * Local development uses the sibling navsa-frontend/public/products folder.
     * Production can override this with PRODUCT_IMAGE_DIRECTORY in navsa-api/.env.
     */
    private function productImageDirectory(): string
    {
        $configured = trim((string) env('PRODUCT_IMAGE_DIRECTORY', ''));
        $directory = $configured !== ''
            ? $configured
            : base_path('../navsa-frontend/public/products');

        return rtrim($directory, "\\/");
    }

    private function imageMetadataForProduct(Product $product): array
    {
        $manualImages = DB::table('product_images')
            ->where('product_id', $product->id)
            ->orderBy('id')
            ->get();

        $primary = $manualImages->firstWhere('is_primary', 1);
        $erpImage = $product->web_image;
        $manualImage = $primary?->image_name;

        return [
            'erp_web_image' => $erpImage,
            'manual_web_image' => $manualImage,
            'effective_web_image' => $manualImage ?: $erpImage,
            'selected_image_source' => $primary ? 'manual' : 'erp',
            'selected_image_id' => $primary?->id,
            'manual_images' => $manualImages->map(function ($image) {
                return [
                    'id' => (int) $image->id,
                    'image_name' => $image->image_name,
                    'is_primary' => (bool) $image->is_primary,
                    'created_at' => $image->created_at,
                    'image_url' => '/products/' . rawurlencode((string) $image->image_name),
                ];
            })->values()->all(),
        ];
    }

    private function attachAdminImageMetadata($products): void
    {
        $collection = collect($products);
        $ids = $collection->pluck('id')->filter()->values()->all();

        if (empty($ids)) {
            return;
        }

        $imagesByProduct = DB::table('product_images')
            ->whereIn('product_id', $ids)
            ->orderBy('id')
            ->get()
            ->groupBy('product_id');

        foreach ($collection as $product) {
            $manualImages = collect($imagesByProduct->get($product->id, collect()));
            $primary = $manualImages->firstWhere('is_primary', 1);
            $erpImage = $product->web_image;
            $manualImage = $primary?->image_name;

            $product->setAttribute('erp_web_image', $erpImage);
            $product->setAttribute('manual_web_image', $manualImage);
            $product->setAttribute('effective_web_image', $manualImage ?: $erpImage);
            $product->setAttribute('selected_image_source', $primary ? 'manual' : 'erp');
            $product->setAttribute('selected_image_id', $primary?->id);
            $product->setAttribute('manual_images', $manualImages->map(function ($image) {
                return [
                    'id' => (int) $image->id,
                    'image_name' => $image->image_name,
                    'is_primary' => (bool) $image->is_primary,
                    'created_at' => $image->created_at,
                    'image_url' => '/products/' . rawurlencode((string) $image->image_name),
                ];
            })->values()->all());
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        if ($user->status === 'frozen') {
            return response()->json(['message' => 'Your account has been frozen. Please contact support at info@navsainternational.com.'], 403);
        }

        if ($user->status === 'pending') {
            return response()->json(['message' => 'Please wait for approval of your account. You will be notified when able to login.'], 403);
        }

        if ($user->status === 'rejected') {
            return response()->json(['message' => 'Your account registration has been rejected. Please contact support.'], 403);
        }

        if ($user->status !== 'approved') {
            return response()->json(['message' => 'Please wait for approval of your account. You will be notified when able to login.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $roles = $user->getRoleNames();
        $permissions = $user->getAllPermissions()->pluck('name');

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $token = $user?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function stats(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        return response()->json([
            'total_products'   => Product::where('deleted', false)->count(),
            'live_products'    => Product::where('deleted', false)->where('live_for_web', 1)->count(),
            'hidden_products'  => Product::where('deleted', false)->where(function ($q) {
                $q->where('live_for_web', 0)->orWhereNull('live_for_web');
            })->count(),
            'offer_products'   => Product::where('deleted', false)->where('is_offer', 1)->count(),
            'low_stock'        => Product::where('deleted', false)->where('stock_quantity', '<=', 5)->count(),
            'out_of_stock'     => Product::where('deleted', false)->where('stock_quantity', 0)->count(),
            'total_brands'     => Brand::where('deleted', false)->count(),
            'total_categories' => Category::where('deleted', false)->count(),
            'total_users'      => User::count(),
            'pending_users'    => User::where('status', 'pending')->count(),
            'approved_users'   => User::where('status', 'approved')->count(),
            'rejected_users'   => User::where('status', 'rejected')->count(),
        ]);
    }

    public function getRegistrations(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $type = strtolower(trim((string) $request->query('type', 'all')));

        $query = User::with(['customerDetail', 'supplierDetail'])
            ->where('status', 'pending');

        if ($type === 'supplier') {
            $query->where(function ($registrationQuery) {
                $registrationQuery
                    ->whereHas('supplierDetail')
                    ->orWhere('role', 'supplier');
            });
        } elseif ($type === 'customer') {
            $query->where(function ($registrationQuery) {
                $registrationQuery
                    ->whereHas('customerDetail')
                    ->orWhere(function ($legacyCustomerQuery) {
                        $legacyCustomerQuery
                            ->where('role', 'customer')
                            ->whereDoesntHave('supplierDetail');
                    });
            });
        }

        $registrations = $query
            ->orderBy('created_at', 'desc')
            ->get();

        $registrations->each(function ($registration) {
            $registration->setAttribute(
                'registration_type',
                $registration->supplierDetail ? 'supplier' : 'customer'
            );
        });

        return response()->json($registrations);
    }

    public function approveRegistration(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::with(['customerDetail', 'supplierDetail'])->findOrFail($id);
        if ($user->status !== 'pending') {
            return response()->json(['error' => 'User is not pending approval'], 400);
        }

        $user->status = 'approved';
        $user->approved_at = now();
        $user->role = $user->supplierDetail ? 'supplier' : 'customer';
        $user->save();

        return response()->json(['message' => 'Registration approved successfully', 'user' => $user]);
    }

    public function rejectRegistration(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::with(['customerDetail', 'supplierDetail'])->findOrFail($id);
        if ($user->status !== 'pending') {
            return response()->json(['error' => 'User is not pending approval'], 400);
        }

        $user->status = 'rejected';
        $user->role = $user->supplierDetail ? 'supplier' : 'customer';
        $user->save();

        return response()->json(['message' => 'Registration rejected successfully', 'user' => $user]);
    }


    public function vatCodes(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $codes = DB::table('vat_codes')
            ->where('active', 1)
            ->orderBy('code')
            ->get([
                'id',
                'code',
                'percentage',
                'description',
                'vat_treatment',
                'charge_for_uk',
                'active',
            ]);

        return response()->json($codes);
    }

    public function products(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        // Opening Product Management automatically moves overdue products
        // into Deleted Items. No daily CMD step is required.
        Product::expireObsoleteProducts();

        // New Arrivals, WIGIG and Best Sellers are manual catalogue-section
        // flags. Product price/date fields must never turn these flags on or off.

        $q = Product::with(['brand', 'category']);

        if ($request->boolean('show_deleted')) {
            $q->where('deleted', true);
        } else {
            $q->where('deleted', false);
        }

        if ($request->filled('search')) {
            $s = trim($request->search);
            $q->where(function ($sub) use ($s) {
                $sub->where('description', 'like', '%' . $s . '%')
                    ->orWhere('navsa_product_code', 'like', '%' . $s . '%')
                    ->orWhere('barcode_ean', 'like', '%' . $s . '%');
            });
        }
        if ($request->filled('brand_id'))     $q->where('brand_id', $request->brand_id);
        if ($request->filled('category_id'))  $q->where('category_id', $request->category_id);
        if ($request->filled('is_offer'))     $q->where('is_offer', $request->is_offer);
        if ($request->filled('live_for_web')) $q->where('live_for_web', $request->live_for_web);
        if ($request->filled('low_stock'))    $q->where('stock_quantity', '<=', 5);

        $allowedSorts = [
            'description',
            'price',
            'navsa_product_code',
            'created_at',
            'id',
        ];

        $sortBy = (string) $request->get('sort_by', 'created_at');
        $sortOrder = strtolower((string) $request->get('order', 'desc'));

        if (!in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }

        if (!in_array($sortOrder, ['asc', 'desc'], true)) {
            $sortOrder = 'desc';
        }

        // Keep products with no price at the end instead of allowing NULL values
        // to appear before valid prices in Price (Low-High).
        if ($sortBy === 'price') {
            $q->orderByRaw('price IS NULL ASC')
              ->orderBy('price', $sortOrder);
        } else {
            $q->orderBy($sortBy, $sortOrder);
        }

        // Stable secondary order prevents rows from jumping between pages when
        // several products share the same title, price or date.
        $q->orderBy('id', $sortOrder === 'asc' ? 'asc' : 'desc');

        $requestedPerPage = (int) $request->get('per_page', 25);
        $allowedPerPage = [8, 25, 50, 75, 100]; // 8 is used by the Admin live-suggestion dropdown.
        $perPage = in_array($requestedPerPage, $allowedPerPage, true)
            ? $requestedPerPage
            : 25;

        $paginator = $q->paginate($perPage);
        $this->attachAdminImageMetadata($paginator->getCollection());

        // ShopTill-e style page title needs the complete non-deleted catalogue
        // count, independent of the current search/filter/pagination.
        $allProductsTotal = Product::where('deleted', false)->count();

        $payload = $paginator->toArray();
        $payload['all_products_total'] = $allProductsTotal;

        return response()->json($payload);
    }

    private function validateBulkProductSelection(Request $request): array
    {
        return $request->validate([
            'selection' => 'required|in:ids,matching',
            'ids' => 'required_if:selection,ids|array|min:1',
            'ids.*' => 'integer|distinct',
            'exclude_ids' => 'nullable|array',
            'exclude_ids.*' => 'integer|distinct',
            'filters' => 'nullable|array',
            'filters.search' => 'nullable|string|max:255',
            'filters.brand_id' => 'nullable|integer',
            'filters.category_id' => 'nullable|integer',
            'filters.is_offer' => 'nullable|in:0,1',
            'filters.live_for_web' => 'nullable|in:0,1',
            'filters.low_stock' => 'nullable|in:0,1',
        ]);
    }

    private function bulkProductSelectionQuery(array $validated, bool $deleted)
    {
        $query = Product::query()->where('deleted', $deleted);

        if ($validated['selection'] === 'ids') {
            return $query->whereIn('id', array_map('intval', $validated['ids'] ?? []));
        }

        $filters = $validated['filters'] ?? [];

        if (!empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($sub) use ($search) {
                $sub->where('description', 'like', '%' . $search . '%')
                    ->orWhere('navsa_product_code', 'like', '%' . $search . '%')
                    ->orWhere('barcode_ean', 'like', '%' . $search . '%');
            });
        }

        if (array_key_exists('brand_id', $filters) && $filters['brand_id'] !== null && $filters['brand_id'] !== '') {
            $query->where('brand_id', $filters['brand_id']);
        }

        if (array_key_exists('category_id', $filters) && $filters['category_id'] !== null && $filters['category_id'] !== '') {
            $query->where('category_id', $filters['category_id']);
        }

        if (array_key_exists('is_offer', $filters) && $filters['is_offer'] !== null && $filters['is_offer'] !== '') {
            $query->where('is_offer', $filters['is_offer']);
        }

        if (array_key_exists('live_for_web', $filters) && $filters['live_for_web'] !== null && $filters['live_for_web'] !== '') {
            $query->where('live_for_web', $filters['live_for_web']);
        }

        if (!empty($filters['low_stock'])) {
            $query->where('stock_quantity', '<=', 5);
        }

        if (!empty($validated['exclude_ids'])) {
            $query->whereNotIn('id', array_map('intval', $validated['exclude_ids']));
        }

        return $query;
    }

    public function bulkHideProducts(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkProductSelection($request);
        $query = $this->bulkProductSelectionQuery($validated, false);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No active products matched the selected bulk action.',
            ], 422);
        }

        $query->update(['live_for_web' => 0]);

        return response()->json([
            'selected_count' => $selectedCount,
            'hidden' => true,
            'message' => $selectedCount . ' product(s) hidden from the website.',
        ]);
    }

    public function bulkShowProducts(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        Product::expireObsoleteProducts();

        $validated = $this->validateBulkProductSelection($request);
        $query = $this->bulkProductSelectionQuery($validated, false);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No active products matched the selected bulk action.',
            ], 422);
        }

        $query->update(['live_for_web' => 1]);

        return response()->json([
            'selected_count' => $selectedCount,
            'hidden' => false,
            'message' => $selectedCount . ' product(s) made live on the website.',
        ]);
    }

    public function bulkSoftDeleteProducts(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkProductSelection($request);
        $query = $this->bulkProductSelectionQuery($validated, false);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No active products matched the selected bulk action.',
            ], 422);
        }

        $query->update([
            'deleted' => true,
            'live_for_web' => 0,
        ]);

        return response()->json([
            'selected_count' => $selectedCount,
            'deleted' => true,
            'permanent' => false,
            'message' => $selectedCount . ' product(s) moved to Deleted Items.',
        ]);
    }

    public function bulkRestoreProducts(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        Product::expireObsoleteProducts();

        $validated = $this->validateBulkProductSelection($request);
        $query = $this->bulkProductSelectionQuery($validated, true);
        $query = Product::constrainToNonExpiredObsolete($query);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No deleted products matched the selected bulk action.',
            ], 422);
        }

        $query->update([
            'deleted' => false,
            'live_for_web' => 1,
        ]);

        return response()->json([
            'selected_count' => $selectedCount,
            'deleted' => false,
            'live_for_web' => 1,
            'message' => $selectedCount . ' product(s) restored and made live on the website.',
        ]);
    }

    public function bulkHardDeleteProducts(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkProductSelection($request);
        $query = $this->bulkProductSelectionQuery($validated, true);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No deleted products matched the selected bulk action.',
            ], 422);
        }

        $selectedIdsSubquery = (clone $query)->select('id');
        $blockedByOrders = DB::table('order_items')
            ->whereIn('product_id', $selectedIdsSubquery)
            ->distinct()
            ->count('product_id');

        if ($blockedByOrders > 0) {
            return response()->json([
                'message' => $blockedByOrders . ' selected product(s) are already used in orders and cannot be permanently deleted. No products were deleted.',
                'blocked_count' => $blockedByOrders,
            ], 422);
        }

        DB::transaction(function () use ($query) {
            DB::table('product_images')
                ->whereIn('product_id', (clone $query)->select('id'))
                ->delete();

            (clone $query)->delete();
        });

        return response()->json([
            'selected_count' => $selectedCount,
            'destroyed' => true,
            'message' => $selectedCount . ' product(s) permanently deleted.',
        ]);
    }

    public function uploadProductImage(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);

        // No dimension restriction: 1600 x 1600 is an informational
        // recommendation only.
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,gif,webp',
        ]);

        $file = $request->file('image');
        $extension = strtolower((string) ($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg'));
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        $directory = $this->productImageDirectory();
        if (!is_dir($directory) && !@mkdir($directory, 0775, true) && !is_dir($directory)) {
            return response()->json([
                'message' => 'Product image folder could not be created. Check PRODUCT_IMAGE_DIRECTORY and folder permissions.',
            ], 500);
        }

        $filename = sprintf(
            'manual-product-%d-%s-%s.%s',
            $product->id,
            date('YmdHis'),
            bin2hex(random_bytes(4)),
            $extension
        );

        $targetPath = $directory . DIRECTORY_SEPARATOR . $filename;

        try {
            $file->move($directory, $filename);

            DB::transaction(function () use ($product, $filename) {
                // Keep every previous manual upload, but make the newest
                // upload the website image immediately.
                DB::table('product_images')
                    ->where('product_id', $product->id)
                    ->update(['is_primary' => 0]);

                DB::table('product_images')->insert([
                    'product_id' => $product->id,
                    'image_name' => $filename,
                    'is_primary' => 1,
                    'created_at' => now(),
                ]);
            });
        } catch (\Throwable $e) {
            if (is_file($targetPath)) {
                @unlink($targetPath);
            }
            throw $e;
        }

        return response()->json(array_merge([
            'message' => 'Product image uploaded successfully.',
            'product_id' => $product->id,
        ], $this->imageMetadataForProduct($product)));
    }

    public function selectProductImage(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'source' => 'required|in:erp,manual',
            'image_id' => 'nullable|integer',
        ]);

        DB::transaction(function () use ($product, $validated) {
            DB::table('product_images')
                ->where('product_id', $product->id)
                ->update(['is_primary' => 0]);

            if ($validated['source'] === 'manual') {
                $imageId = (int) ($validated['image_id'] ?? 0);
                $updated = DB::table('product_images')
                    ->where('product_id', $product->id)
                    ->where('id', $imageId)
                    ->update(['is_primary' => 1]);

                if ($updated !== 1) {
                    abort(422, 'The selected image does not belong to this product.');
                }
            }
            // source=erp intentionally leaves all manual rows non-primary.
            // The public API then falls back to products.web_image.
        });

        return response()->json(array_merge([
            'message' => 'Website image updated successfully.',
            'product_id' => $product->id,
        ], $this->imageMetadataForProduct($product)));
    }

    public function removeProductImage(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'source' => 'required|in:erp,manual',
            'image_id' => 'nullable|integer',
        ]);

        $fileToDelete = null;

        DB::transaction(function () use ($product, $validated, &$fileToDelete) {
            if ($validated['source'] === 'erp') {
                if (!trim((string) $product->web_image)) {
                    abort(422, 'This product does not have an ERP WebImage to remove.');
                }

                // Remove the ERP image from this product without deleting the
                // underlying shared/source file from the products directory.
                // A future ERP import can restore the WebImage value if it is
                // still present in the Datafeed.
                $product->web_image = null;
                $product->save();

                // If ERP was selected (no manual primary), promote the newest
                // remaining manual image so the public product does not
                // unnecessarily lose its image.
                $hasPrimaryManual = DB::table('product_images')
                    ->where('product_id', $product->id)
                    ->where('is_primary', 1)
                    ->exists();

                if (!$hasPrimaryManual) {
                    $fallbackId = DB::table('product_images')
                        ->where('product_id', $product->id)
                        ->orderByDesc('id')
                        ->value('id');

                    if ($fallbackId) {
                        DB::table('product_images')
                            ->where('product_id', $product->id)
                            ->where('id', $fallbackId)
                            ->update(['is_primary' => 1]);
                    }
                }

                return;
            }

            $imageId = (int) ($validated['image_id'] ?? 0);
            $image = DB::table('product_images')
                ->where('product_id', $product->id)
                ->where('id', $imageId)
                ->first();

            if (!$image) {
                abort(422, 'The selected image does not belong to this product.');
            }

            $wasPrimary = (bool) $image->is_primary;
            $fileToDelete = basename((string) $image->image_name);

            DB::table('product_images')
                ->where('product_id', $product->id)
                ->where('id', $imageId)
                ->delete();

            if ($wasPrimary) {
                // Prefer ERP as the fallback when it still exists. If there is
                // no ERP image, promote the newest remaining manual image.
                if (!trim((string) $product->web_image)) {
                    $fallbackId = DB::table('product_images')
                        ->where('product_id', $product->id)
                        ->orderByDesc('id')
                        ->value('id');

                    if ($fallbackId) {
                        DB::table('product_images')
                            ->where('product_id', $product->id)
                            ->where('id', $fallbackId)
                            ->update(['is_primary' => 1]);
                    }
                }
            }
        });

        if ($fileToDelete) {
            $directory = $this->productImageDirectory();
            $targetPath = $directory . DIRECTORY_SEPARATOR . $fileToDelete;

            // Only unlink files created by this application's manual uploader.
            // ERP/source image files are never physically deleted here.
            if (
                str_starts_with($fileToDelete, 'manual-product-') &&
                is_file($targetPath)
            ) {
                @unlink($targetPath);
            }
        }

        $product->refresh();

        return response()->json(array_merge([
            'message' => 'Image removed successfully.',
            'product_id' => $product->id,
        ], $this->imageMetadataForProduct($product)));
    }

    public function createProduct(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $request->validate([
            'description'        => 'required|string|max:500',
            'brand_id'           => 'nullable|integer|exists:brands,id',
            'category_id'        => 'nullable|integer|exists:categories,id',
            'navsa_product_code' => ['required', 'string', 'max:100', Rule::unique('products', 'navsa_product_code')],
            'price'              => 'nullable|numeric|min:0',
            'price_list'         => 'nullable|string|max:100',
            'cost'               => 'nullable|numeric|min:0',
            'stock_quantity'     => 'nullable|integer|min:0',
            'barcode_ean'        => 'nullable|string|max:50',
            'barcode_case'       => 'nullable|string|max:50',
            'live_for_web'       => 'nullable|boolean',
            'qty_desc'            => 'nullable|string|max:50',
            'order_qty_allowed'      => 'nullable|in:DEFAULT,PALLET,CASE',
            'primary_supplier_index' => 'nullable|string|max:100',
            'supplier_reference'     => 'nullable|string|max:100',
            'obsolete'               => 'nullable|date',
        ]);

        $allowed = [
            'navsa_product_code', 'description', 'supplier_id', 'primary_supplier_index', 'category_id', 'sub_category_id', 'brand_id',
            'units_of', 'inner_case_quantity', 'outer_case_quantity', 'qty_desc', 'order_qty_allowed',
            'barcode_ean', 'barcode_case', 'group_desc', 'vat_code',
            'layer_quantity', 'pallet_quantity', 'supplier_reference',
            'cost', 'cost_from_date', 'cost_to_date', 'price_list', 'price', 'from_date', 'to_date',
            'weight', 'volume', 'shelf_life', 'bbd', 'comm_code', 'intra_country', 'intra_type',
            'web_short_description', 'web_long_description', 'web_image', 'live_for_web', 'obsolete',
            'is_offer', 'offer_label', 'stock_quantity', 'is_best_offer', 'is_new_arrival',
        ];

        $data = $request->only($allowed);
        if (array_key_exists('qty_desc', $data)) {
            $data['qty_desc'] = $this->normalizeQtyDesc($data['qty_desc']);
        }
        if (array_key_exists('order_qty_allowed', $data)) {
            $normalisedOrderQty = $this->normalizeOrderQtyAllowed($data['order_qty_allowed']);
            $data['order_qty_allowed'] = $normalisedOrderQty ?? 'DEFAULT';
        }
        if (array_key_exists('obsolete', $data)) {
            $data['obsolete'] = $this->toDateOrNull($data['obsolete']);
            if (Product::isObsoleteDateExpired($data['obsolete'])) {
                $data['deleted'] = true;
                $data['live_for_web'] = 0;
            }
        }

        $product = Product::create($data);
        return response()->json($product->load(['brand', 'category']), 201);
    }

    public function updateProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);

        $request->validate([
            'description'        => 'sometimes|string|max:500',
            'brand_id'           => 'nullable|integer|exists:brands,id',
            'category_id'        => 'nullable|integer|exists:categories,id',
            'price'              => 'nullable|numeric|min:0',
            'price_list'         => 'nullable|string|max:100',
            'cost'               => 'nullable|numeric|min:0',
            'stock_quantity'     => 'nullable|integer|min:0',
            'barcode_ean'        => 'nullable|string|max:50',
            'barcode_case'       => 'nullable|string|max:50',
            'live_for_web'       => 'nullable|boolean',
            'qty_desc'            => 'nullable|string|max:50',
            'order_qty_allowed'      => 'nullable|in:DEFAULT,PALLET,CASE',
            'primary_supplier_index' => 'nullable|string|max:100',
            'supplier_reference'     => 'nullable|string|max:100',
            'obsolete'               => 'nullable|date',
        ]);

        $allowed = [
            'description', 'supplier_id', 'primary_supplier_index', 'category_id', 'sub_category_id', 'brand_id',
            'units_of', 'inner_case_quantity', 'outer_case_quantity', 'qty_desc', 'order_qty_allowed',
            'barcode_ean', 'barcode_case', 'group_desc', 'vat_code',
            'layer_quantity', 'pallet_quantity', 'supplier_reference',
            'cost', 'cost_from_date', 'cost_to_date', 'price_list', 'price', 'from_date', 'to_date',
            'weight', 'volume', 'shelf_life', 'bbd', 'comm_code', 'intra_country', 'intra_type',
            'web_short_description', 'web_long_description', 'web_image', 'live_for_web', 'obsolete',
            'is_offer', 'offer_label', 'stock_quantity', 'is_best_offer', 'is_new_arrival',
        ];

        $data = $request->only($allowed);
        if (array_key_exists('qty_desc', $data)) {
            $data['qty_desc'] = $this->normalizeQtyDesc($data['qty_desc']);
        }
        if (array_key_exists('order_qty_allowed', $data)) {
            $normalisedOrderQty = $this->normalizeOrderQtyAllowed($data['order_qty_allowed']);
            $data['order_qty_allowed'] = $normalisedOrderQty ?? 'DEFAULT';
        }
        if (array_key_exists('obsolete', $data)) {
            $data['obsolete'] = $this->toDateOrNull($data['obsolete']);
            if (Product::isObsoleteDateExpired($data['obsolete'])) {
                $data['deleted'] = true;
                $data['live_for_web'] = 0;
            }
        }

        $product->update($data);
        return response()->json($product->fresh(['brand', 'category']));
    }

    public function toggleWeb(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);

        if ($product->deleted) {
            return response()->json([
                'message' => 'Restore this product before changing its website visibility.',
            ], 422);
        }

        $new = $product->live_for_web ? 0 : 1;

        if ($new === 1 && Product::isObsoleteDateExpired($product->obsolete)) {
            $product->update([
                'deleted' => true,
                'live_for_web' => 0,
            ]);

            return response()->json([
                'message' => 'This product cannot be made live because its Obsolete date has passed.',
            ], 422);
        }

        $product->update(['live_for_web' => $new]);

        return response()->json([
            'id' => (int) $id,
            'deleted' => false,
            'live_for_web' => $new,
            'hidden' => $new === 0,
            'message' => $new
                ? 'Product is now visible on the website.'
                : 'Product is now hidden from the website.',
        ]);
    }

    public function toggleOffer(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);
        $new = $product->is_offer ? 0 : 1;

        // WIGIG membership is controlled only by this flag.
        // Do not modify product price, promotion price, dates or labels.
        $product->update(['is_offer' => $new]);

        return response()->json([
            'id' => (int) $id,
            'is_offer' => $new,
        ]);
    }

    public function clearOffers(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        Product::where('is_offer', 1)->update(['is_offer' => 0]);
        return response()->json(['success' => true]);
    }

    public function toggleBestOffer(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);
        $new = $product->is_best_offer ? 0 : 1;

        // Best Sellers membership is controlled only by this flag.
        $product->update(['is_best_offer' => $new]);

        return response()->json([
            'id' => (int) $id,
            'is_best_offer' => $new,
        ]);
    }

    public function toggleNewArrival(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);
        $new = $product->is_new_arrival ? 0 : 1;

        // New Arrivals membership is controlled only by this flag.
        $product->update(['is_new_arrival' => $new]);

        return response()->json([
            'id' => (int) $id,
            'is_new_arrival' => $new,
        ]);
    }

    public function updateStock(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update([
            'stock_quantity' => (int)$request->stock_quantity,
            'price'          => $request->has('price') ? $request->price : $product->price,
            'price_list'     => $request->has('price_list') ? $request->price_list : $product->price_list,
        ]);
        return response()->json($product->fresh());
    }

    public function softDeleteProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);
        $product->update([
            'deleted' => true,
            'live_for_web' => 0,
        ]);

        return response()->json([
            'id' => (int) $id,
            'deleted' => true,
            'live_for_web' => 0,
            'message' => 'Product moved to Deleted Items.',
        ]);
    }

    public function hardDeleteProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);

        if (!$product->deleted) {
            return response()->json([
                'message' => 'Move this product to Deleted Items before deleting it permanently.',
            ], 422);
        }

        $product->delete();

        return response()->json([
            'id' => (int) $id,
            'destroyed' => true,
            'message' => 'Product permanently deleted.',
        ]);
    }

    public function restoreProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $product = Product::findOrFail($id);

        if (Product::isObsoleteDateExpired($product->obsolete)) {
            $product->update([
                'deleted' => true,
                'live_for_web' => 0,
            ]);

            return response()->json([
                'message' => 'This product cannot be restored because its Obsolete date has passed.',
            ], 422);
        }

        $product->update([
            'deleted' => false,
            'live_for_web' => 1,
        ]);

        return response()->json([
            'id' => (int) $id,
            'deleted' => false,
            'live_for_web' => 1,
            'hidden' => false,
            'message' => 'Product restored and made live on the website.',
        ]);
    }

    public function users(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $type = strtolower(trim((string) $request->query('type', 'all')));
        $q = User::with(['customerDetail', 'supplierDetail']);

        if ($type === 'customer') {
            $q->where('status', '!=', 'pending')
                ->whereDoesntHave('supplierDetail')
                ->where(function ($customerQuery) {
                    $customerQuery
                        ->whereHas('customerDetail')
                        ->orWhere('role', 'customer');
                });
        } elseif ($type === 'supplier') {
            $q->where('status', '!=', 'pending')
                ->where(function ($supplierQuery) {
                    $supplierQuery
                        ->whereHas('supplierDetail')
                        ->orWhere('role', 'supplier');
                });
        }

        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = trim((string) $request->search);
            $q->where(function ($sub) use ($s) {
                $sub->where('name', 'like', "%$s%")
                    ->orWhere('email', 'like', "%$s%")
                    ->orWhere('company_name', 'like', "%$s%");
            });
        }

        return $q->orderBy('created_at', 'desc')->paginate(25);
    }

    public function suppliers(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $q = User::with('supplierDetail')
            ->where('status', '!=', 'pending')
            ->where(function ($supplierQuery) {
                $supplierQuery
                    ->whereHas('supplierDetail')
                    ->orWhere('role', 'supplier');
            });

        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = trim((string) $request->search);
            $q->where(function ($searchQuery) use ($s) {
                $searchQuery
                    ->where('name', 'like', "%$s%")
                    ->orWhere('email', 'like', "%$s%")
                    ->orWhere('company_name', 'like', "%$s%")
                    ->orWhere('phone', 'like', "%$s%")
                    ->orWhereHas('supplierDetail', function ($detailQuery) use ($s) {
                        $detailQuery
                            ->where('first_name', 'like', "%$s%")
                            ->orWhere('last_name', 'like', "%$s%")
                            ->orWhere('company_name', 'like', "%$s%")
                            ->orWhere('country', 'like', "%$s%")
                            ->orWhere('business_phone', 'like', "%$s%")
                            ->orWhere('mobile_phone', 'like', "%$s%");
                    });
            });
        }

        return $q->orderByRaw('approved_at IS NULL')
            ->orderBy('approved_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(25);
    }

    public function updateUser(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::with('customerDetail')->findOrFail($id);
        $detailProvided = $request->has('customer_detail');
        $detailInput = $request->input('customer_detail', []);
        $isUkCustomer = $detailProvided && (
            strtoupper(trim((string) ($detailInput['region'] ?? ''))) === 'UK'
            || strcasecmp(trim((string) ($detailInput['country'] ?? '')), 'United Kingdom') === 0
        );
        $sameAsBilling = $detailProvided
            ? filter_var($detailInput['same_as_billing'] ?? true, FILTER_VALIDATE_BOOLEAN)
            : true;
        $whatsappOffersOptIn = $detailProvided
            ? filter_var($detailInput['whatsapp_offers_opt_in'] ?? false, FILTER_VALIDATE_BOOLEAN)
            : false;

        $validated = $request->validate([
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'company_name' => ['sometimes', 'nullable', 'string', 'max:200'],
            'status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected', 'frozen'])],

            'customer_detail' => ['sometimes', 'array'],
            'customer_detail.first_name' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.last_name' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.region' => ['required_with:customer_detail', Rule::in(['UK', 'Europe', 'International'])],
            'customer_detail.country' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.position' => ['nullable', 'string', 'max:255'],
            'customer_detail.company_registration_number' => ['nullable', 'string', 'max:100'],
            'customer_detail.vat_number' => [Rule::requiredIf($isUkCustomer), 'nullable', 'string', 'max:100'],
            'customer_detail.customer_group' => ['nullable', Rule::in(['Group 1', 'Group 2'])],
            'customer_detail.trading_years' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.business_nature' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.website' => ['nullable', 'string', 'max:255'],
            'customer_detail.director_name' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.currency' => ['required_with:customer_detail', Rule::in(['GBP', 'EURO', 'DOLLAR'])],
            'customer_detail.registered_phone' => ['required_with:customer_detail', 'string', 'max:30'],
            'customer_detail.mobile' => [Rule::requiredIf($detailProvided && $whatsappOffersOptIn), 'nullable', 'string', 'max:30'],
            'customer_detail.whatsapp_offers_opt_in' => ['nullable', 'boolean'],

            'customer_detail.address_line_1' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.address_line_2' => ['nullable', 'string', 'max:255'],
            'customer_detail.city' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.province' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.zip_code' => ['required_with:customer_detail', 'string', 'max:255'],

            'customer_detail.same_as_billing' => ['required_with:customer_detail', 'boolean'],
            'customer_detail.shipping_address_line_1' => [Rule::requiredIf($detailProvided && !$sameAsBilling), 'nullable', 'string', 'max:255'],
            'customer_detail.shipping_address_line_2' => ['nullable', 'string', 'max:255'],
            'customer_detail.shipping_city' => [Rule::requiredIf($detailProvided && !$sameAsBilling), 'nullable', 'string', 'max:255'],
            'customer_detail.shipping_province' => [Rule::requiredIf($detailProvided && !$sameAsBilling), 'nullable', 'string', 'max:255'],
            'customer_detail.shipping_zip_code' => [Rule::requiredIf($detailProvided && !$sameAsBilling), 'nullable', 'string', 'max:255'],
            'customer_detail.shipping_country' => [Rule::requiredIf($detailProvided && !$sameAsBilling), 'nullable', 'string', 'max:255'],
            'customer_detail.shipping_telephone' => [Rule::requiredIf($detailProvided && !$sameAsBilling), 'nullable', 'string', 'max:50'],

            'customer_detail.account_name' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.account_email' => ['required_with:customer_detail', 'email', 'max:255'],
            'customer_detail.other_wholesalers' => ['nullable', Rule::in(['Yes', 'No'])],
            'customer_detail.average_order_value' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.turnover' => ['required_with:customer_detail', 'string', 'max:255'],
            'customer_detail.import_full_containers' => ['required_with:customer_detail', Rule::in(['Containers', 'Pallets', 'Cases'])],
            'customer_detail.brands_interested' => ['required_with:customer_detail', 'string'],
            'customer_detail.categories_interested' => ['nullable', 'array'],
            'customer_detail.categories_interested.*' => ['string', 'max:255'],
            'customer_detail.eori_number' => ['nullable', 'string', 'max:255'],
        ]);

        return DB::transaction(function () use ($user, $validated, $detailProvided, $isUkCustomer, $sameAsBilling) {
            if (array_key_exists('email', $validated)) {
                $user->email = trim($validated['email']);
            }

            if (array_key_exists('company_name', $validated)) {
                $user->company_name = trim((string) $validated['company_name']) ?: null;
            }

            if (array_key_exists('status', $validated)) {
                $user->status = $validated['status'];
                if ($validated['status'] === 'approved' && !$user->approved_at) {
                    $user->approved_at = now();
                }
            }

            if ($detailProvided) {
                if (!$user->customerDetail) {
                    abort(422, 'This user does not have customer details to edit.');
                }

                $incoming = $validated['customer_detail'];
                $nullableText = static function ($value) {
                    $value = trim((string) ($value ?? ''));
                    return $value === '' ? null : $value;
                };

                $detailData = [
                    'first_name' => trim($incoming['first_name']),
                    'last_name' => trim($incoming['last_name']),
                    'region' => $incoming['region'],
                    'country' => trim($incoming['country']),
                    'position' => $nullableText($incoming['position'] ?? null),
                    'company_registration_number' => $nullableText($incoming['company_registration_number'] ?? null),
                    'vat_number' => $isUkCustomer ? $nullableText($incoming['vat_number'] ?? null) : null,
                    'customer_group' => $incoming['customer_group'] ?? null,
                    'trading_years' => $incoming['trading_years'],
                    'business_nature' => $incoming['business_nature'],
                    'website' => $nullableText($incoming['website'] ?? null),
                    'director_name' => trim($incoming['director_name']),
                    'currency' => $incoming['currency'],
                    'registered_phone' => trim($incoming['registered_phone']),
                    'mobile' => $nullableText($incoming['mobile'] ?? null),
                    'whatsapp_offers_opt_in' => (bool) ($incoming['whatsapp_offers_opt_in'] ?? false),
                    'address_line_1' => trim($incoming['address_line_1']),
                    'address_line_2' => $nullableText($incoming['address_line_2'] ?? null),
                    'city' => trim($incoming['city']),
                    'province' => trim($incoming['province']),
                    'zip_code' => trim($incoming['zip_code']),
                    'account_name' => trim($incoming['account_name']),
                    'account_email' => trim($incoming['account_email']),
                    'other_wholesalers' => $incoming['other_wholesalers'] ?? null,
                    'average_order_value' => $incoming['average_order_value'],
                    'turnover' => $incoming['turnover'],
                    'import_full_containers' => $incoming['import_full_containers'],
                    'brands_interested' => trim($incoming['brands_interested']),
                    'categories_interested' => $incoming['categories_interested'] ?? [],
                    'eori_number' => $nullableText($incoming['eori_number'] ?? null),
                    'same_as_billing' => $sameAsBilling,
                    'shipping_address_line_1' => $sameAsBilling ? null : trim($incoming['shipping_address_line_1']),
                    'shipping_address_line_2' => $sameAsBilling ? null : $nullableText($incoming['shipping_address_line_2'] ?? null),
                    'shipping_city' => $sameAsBilling ? null : trim($incoming['shipping_city']),
                    'shipping_province' => $sameAsBilling ? null : trim($incoming['shipping_province']),
                    'shipping_zip_code' => $sameAsBilling ? null : trim($incoming['shipping_zip_code']),
                    'shipping_country' => $sameAsBilling ? null : trim($incoming['shipping_country']),
                    'shipping_telephone' => $sameAsBilling ? null : trim($incoming['shipping_telephone']),
                ];

                $user->customerDetail->update($detailData);
                $user->name = trim($detailData['first_name'] . ' ' . $detailData['last_name']);
                $user->phone = $detailData['registered_phone'] ?: $detailData['mobile'];
            }

            $user->save();

            return response()->json(
                $user->fresh()->load(['customerDetail', 'supplierDetail'])
            );
        });
    }

    public function updateSupplier(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::with('supplierDetail')->findOrFail($id);

        if (!$user->supplierDetail) {
            return response()->json([
                'message' => 'This user does not have supplier details.',
            ], 422);
        }

        $detailProvided = $request->has('supplier_detail');

        $validated = $request->validate([
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['approved', 'rejected', 'frozen'])],

            'supplier_detail' => ['sometimes', 'array'],
            'supplier_detail.first_name' => ['required_with:supplier_detail', 'string', 'max:255'],
            'supplier_detail.last_name' => ['required_with:supplier_detail', 'string', 'max:255'],
            'supplier_detail.mobile_phone' => ['nullable', 'string', 'max:50'],
            'supplier_detail.business_phone' => ['nullable', 'string', 'max:50'],
            'supplier_detail.company_name' => ['required_with:supplier_detail', 'string', 'max:255'],
            'supplier_detail.company_type' => ['nullable', 'string', 'max:255'],
            'supplier_detail.company_registration_number' => ['nullable', 'string', 'max:255'],
            'supplier_detail.website_url' => ['nullable', 'string', 'max:255'],
            'supplier_detail.address_line_1' => ['nullable', 'string', 'max:255'],
            'supplier_detail.address_line_2' => ['nullable', 'string', 'max:255'],
            'supplier_detail.city' => ['nullable', 'string', 'max:255'],
            'supplier_detail.county' => ['nullable', 'string', 'max:255'],
            'supplier_detail.country' => ['nullable', 'string', 'max:255'],
            'supplier_detail.postcode' => ['nullable', 'string', 'max:50'],
            'supplier_detail.additional_comments' => ['nullable', 'string'],
            'supplier_detail.categories_supplied' => ['nullable', 'array'],
            'supplier_detail.categories_supplied.*' => ['string', 'max:255'],
            'supplier_detail.contact_time' => ['nullable', 'array'],
            'supplier_detail.contact_time.*' => ['string', 'max:255'],
            'supplier_detail.consent_news' => ['nullable', 'boolean'],
            'supplier_detail.consent_marketing' => ['nullable', 'boolean'],
        ]);

        return DB::transaction(function () use ($user, $validated, $detailProvided) {
            $nullableText = static function ($value) {
                $value = trim((string) ($value ?? ''));
                return $value === '' ? null : $value;
            };

            if (array_key_exists('email', $validated)) {
                $user->email = trim($validated['email']);
            }

            if (array_key_exists('company_name', $validated)) {
                $user->company_name = trim($validated['company_name']);
            }

            if (array_key_exists('status', $validated)) {
                $user->status = $validated['status'];

                if ($validated['status'] === 'approved' && !$user->approved_at) {
                    $user->approved_at = now();
                }
            }

            if ($detailProvided) {
                $incoming = $validated['supplier_detail'];

                $detailData = [
                    'first_name' => trim($incoming['first_name']),
                    'last_name' => trim($incoming['last_name']),
                    'email_address' => $user->email,
                    'mobile_phone' => $nullableText($incoming['mobile_phone'] ?? null),
                    'business_phone' => $nullableText($incoming['business_phone'] ?? null),
                    'company_name' => trim($incoming['company_name']),
                    'company_type' => $nullableText($incoming['company_type'] ?? null),
                    'company_registration_number' => $nullableText($incoming['company_registration_number'] ?? null),
                    'website_url' => $nullableText($incoming['website_url'] ?? null),
                    'address_line_1' => $nullableText($incoming['address_line_1'] ?? null),
                    'address_line_2' => $nullableText($incoming['address_line_2'] ?? null),
                    'city' => $nullableText($incoming['city'] ?? null),
                    'county' => $nullableText($incoming['county'] ?? null),
                    'country' => $nullableText($incoming['country'] ?? null),
                    'postcode' => $nullableText($incoming['postcode'] ?? null),
                    'additional_comments' => $nullableText($incoming['additional_comments'] ?? null),
                    'categories_supplied' => $incoming['categories_supplied'] ?? [],
                    'contact_time' => $incoming['contact_time'] ?? [],
                    'consent_news' => (bool) ($incoming['consent_news'] ?? false),
                    'consent_marketing' => (bool) ($incoming['consent_marketing'] ?? false),
                ];

                $user->supplierDetail->update($detailData);
                $user->name = trim($detailData['first_name'] . ' ' . $detailData['last_name']);
                $user->company_name = $detailData['company_name'];
                $user->phone = $detailData['mobile_phone'] ?: $detailData['business_phone'];
            }

            $user->role = 'supplier';
            $user->save();

            return response()->json(
                $user->fresh()->load('supplierDetail')
            );
        });
    }

    public function deleteUser(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        User::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    public function brands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $query = Brand::withCount('products');

        if (!$request->filled('show_deleted')) {
            $query->where(function ($brandQuery) {
                $brandQuery
                    ->where('deleted', false)
                    ->orWhereNull('deleted');
            });
        }

        return $query
            ->orderBy('brand_name')
            ->get();
    }

    public function createBrand(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $request->validate([
            'brand_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands', 'brand_name'),
            ],
        ]);

        $brand = Brand::create([
            'brand_name' => trim($validated['brand_name']),
            'status' => 1,
            'deleted' => false,
        ]);

        return response()->json($brand->loadCount('products'), 201);
    }

    public function updateBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'brand_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands', 'brand_name')->ignore($brand->id),
            ],
            'status' => ['sometimes', 'boolean'],
        ]);

        $brand->update([
            'brand_name' => trim($validated['brand_name']),
            'status' => array_key_exists('status', $validated)
                ? (int) $validated['status']
                : (int) $brand->status,
        ]);

        return response()->json($brand->fresh()->loadCount('products'));
    }

    private function validateBulkBrandIds(Request $request): array
    {
        return $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:5000'],
            'ids.*' => ['integer', 'distinct', 'exists:brands,id'],
        ]);
    }

    private function activeBrandSelectionQuery(array $ids)
    {
        return Brand::query()
            ->whereIn('id', array_map('intval', $ids))
            ->where(function ($brandQuery) {
                $brandQuery
                    ->where('deleted', false)
                    ->orWhereNull('deleted');
            });
    }

    private function deletedBrandSelectionQuery(array $ids)
    {
        return Brand::query()
            ->whereIn('id', array_map('intval', $ids))
            ->where('deleted', true);
    }

    public function bulkHideBrands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkBrandIds($request);
        $query = $this->activeBrandSelectionQuery($validated['ids']);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No active brands matched the selected bulk action.',
            ], 422);
        }

        $query->update(['status' => 0]);

        return response()->json([
            'selected_count' => $selectedCount,
            'hidden' => true,
            'message' => $selectedCount . ' brand(s) hidden from the public brand directory.',
        ]);
    }

    public function bulkShowBrands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkBrandIds($request);
        $query = $this->activeBrandSelectionQuery($validated['ids']);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No active brands matched the selected bulk action.',
            ], 422);
        }

        $query->update(['status' => 1]);

        return response()->json([
            'selected_count' => $selectedCount,
            'hidden' => false,
            'message' => $selectedCount . ' brand(s) made visible in the public brand directory.',
        ]);
    }

    public function bulkSoftDeleteBrands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkBrandIds($request);
        $query = $this->activeBrandSelectionQuery($validated['ids']);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No active brands matched the selected bulk action.',
            ], 422);
        }

        $query->update([
            'deleted' => true,
            'status' => 0,
        ]);

        return response()->json([
            'selected_count' => $selectedCount,
            'deleted' => true,
            'permanent' => false,
            'message' => $selectedCount . ' brand(s) moved to deleted brands.',
        ]);
    }

    public function bulkRestoreBrands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkBrandIds($request);
        $query = $this->deletedBrandSelectionQuery($validated['ids']);
        $selectedCount = (clone $query)->count();

        if ($selectedCount === 0) {
            return response()->json([
                'message' => 'No deleted brands matched the selected restore action.',
            ], 422);
        }

        // Restored brands stay hidden until an admin explicitly makes them public.
        $query->update([
            'deleted' => false,
            'status' => 0,
        ]);

        return response()->json([
            'selected_count' => $selectedCount,
            'deleted' => false,
            'message' => $selectedCount . ' brand(s) restored. Restored brands remain hidden until shown.',
        ]);
    }

    public function softDeleteBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $brand = Brand::findOrFail($id);

        $brand->update([
            'deleted' => true,
            'status' => 0,
        ]);

        return response()->json([
            'id' => (int) $brand->id,
            'deleted' => true,
            'permanent' => false,
            'message' => 'Brand moved to deleted brands.',
        ]);
    }

    public function restoreBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $brand = Brand::findOrFail($id);

        if (!$brand->deleted) {
            return response()->json([
                'message' => 'This brand is not deleted.',
            ], 422);
        }

        // Restore into Admin as hidden so an accidental restore never publishes it.
        $brand->update([
            'deleted' => false,
            'status' => 0,
        ]);

        return response()->json([
            'id' => (int) $brand->id,
            'deleted' => false,
            'status' => false,
            'message' => 'Brand restored. It remains hidden until shown.',
        ]);
    }

    public function hardDeleteBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $brand = Brand::withCount('products')->findOrFail($id);

        if (!$brand->deleted) {
            return response()->json([
                'message' => 'Move this brand to Deleted before permanently deleting it.',
            ], 422);
        }

        if ((int) $brand->products_count > 0) {
            return response()->json([
                'message' => 'This brand cannot be permanently deleted while products are assigned to it. Move or reassign those products first.',
                'products_count' => (int) $brand->products_count,
            ], 422);
        }

        $brand->delete();

        return response()->json([
            'id' => (int) $brand->id,
            'destroyed' => true,
            'message' => 'Brand permanently deleted.',
        ]);
    }

    public function categories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $query = Category::query()
            ->whereNull('parent_id')
            ->withCount(['products', 'subCategories']);

        if (!$request->boolean('show_deleted')) {
            $query->where(function ($categoryQuery) {
                $categoryQuery
                    ->where('deleted', false)
                    ->orWhereNull('deleted');
            });
        }

        return response()->json(
            $query->orderBy('category_name')->get()
        );
    }

    public function createCategory(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $request->validate([
            'category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'category_name'),
            ],
        ]);

        $category = Category::create([
            'category_name' => trim($validated['category_name']),
            'parent_id' => null,
            'status' => 1,
            'deleted' => false,
        ]);

        return response()->json(
            $category->loadCount(['products', 'subCategories']),
            201
        );
    }

    public function updateCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $category = Category::whereNull('parent_id')->findOrFail($id);

        $validated = $request->validate([
            'category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'category_name')->ignore($category->id),
            ],
            'status' => ['sometimes', 'boolean'],
        ]);

        $category->update([
            'category_name' => trim($validated['category_name']),
            'status' => array_key_exists('status', $validated)
                ? (int) $validated['status']
                : (int) $category->status,
        ]);

        return response()->json(
            $category->fresh()->loadCount(['products', 'subCategories'])
        );
    }

    private function deleteManagedCategoryImage(?string $path): void
    {
        if (!$path || str_starts_with($path, '/') || preg_match('/^https?:\/\//i', $path)) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    public function uploadCategoryImage(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $category = Category::whereNull('parent_id')->findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        $newPath = $request->file('image')->store('categories', 'public');
        $this->deleteManagedCategoryImage($category->image_path);

        $category->update(['image_path' => $newPath]);

        return response()->json(
            $category->fresh()->loadCount(['products', 'subCategories'])
        );
    }

    private function validateBulkCategoryIds(Request $request): array
    {
        return $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:5000'],
            'ids.*' => ['integer', 'distinct', 'exists:categories,id'],
        ]);
    }

    private function availableCategorySelectionQuery(array $ids)
    {
        return Category::query()
            ->whereNull('parent_id')
            ->whereIn('id', array_map('intval', $ids))
            ->where(function ($categoryQuery) {
                $categoryQuery
                    ->where('deleted', false)
                    ->orWhereNull('deleted');
            });
    }

    private function deletedCategorySelectionQuery(array $ids)
    {
        return Category::query()
            ->whereNull('parent_id')
            ->whereIn('id', array_map('intval', $ids))
            ->where('deleted', true);
    }

    public function bulkHideCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkCategoryIds($request);
        $query = $this->availableCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No available main categories matched this action.'], 422);
        }

        $query->update(['status' => 0]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' main categor' . ($count === 1 ? 'y' : 'ies') . ' hidden from the public catalogue.',
        ]);
    }

    public function bulkShowCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkCategoryIds($request);
        $query = $this->availableCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No available main categories matched this action.'], 422);
        }

        $query->update(['status' => 1]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' main categor' . ($count === 1 ? 'y' : 'ies') . ' made visible in the public catalogue.',
        ]);
    }

    public function bulkSoftDeleteCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkCategoryIds($request);
        $query = $this->availableCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No available main categories matched this action.'], 422);
        }

        $query->update([
            'deleted' => true,
            'status' => 0,
        ]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' main categor' . ($count === 1 ? 'y was' : 'ies were') . ' moved to Deleted.',
        ]);
    }

    public function bulkRestoreCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkCategoryIds($request);
        $query = $this->deletedCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No deleted main categories matched this restore action.'], 422);
        }

        $query->update([
            'deleted' => false,
            'status' => 0,
        ]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' main categor' . ($count === 1 ? 'y restored' : 'ies restored') . ' as Hidden.',
        ]);
    }

    public function bulkHardDeleteCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkCategoryIds($request);
        $rows = $this->deletedCategorySelectionQuery($validated['ids'])
            ->withCount(['products', 'subCategories'])
            ->get();

        if ($rows->isEmpty()) {
            return response()->json(['message' => 'No deleted main categories matched this permanent-delete action.'], 422);
        }

        $blocked = $rows->filter(function ($category) {
            return (int) $category->products_count > 0
                || (int) $category->sub_categories_count > 0;
        });

        if ($blocked->isNotEmpty()) {
            return response()->json([
                'message' => 'Permanent delete blocked. Reassign products and remove/reassign subcategories from the selected main categories first.',
                'blocked_count' => $blocked->count(),
                'blocked' => $blocked->map(fn ($category) => [
                    'id' => (int) $category->id,
                    'name' => $category->category_name,
                    'products_count' => (int) $category->products_count,
                    'sub_categories_count' => (int) $category->sub_categories_count,
                ])->values(),
            ], 422);
        }

        foreach ($rows as $category) {
            $this->deleteManagedCategoryImage($category->image_path);
        }

        $ids = $rows->pluck('id')->all();
        Category::whereIn('id', $ids)->delete();

        return response()->json([
            'selected_count' => count($ids),
            'destroyed' => true,
            'message' => count($ids) . ' main categor' . (count($ids) === 1 ? 'y permanently deleted.' : 'ies permanently deleted.'),
        ]);
    }

    public function softDeleteCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $category = Category::whereNull('parent_id')->findOrFail($id);
        $category->update([
            'deleted' => true,
            'status' => 0,
        ]);

        return response()->json([
            'id' => (int) $category->id,
            'deleted' => true,
            'permanent' => false,
            'message' => 'Main category moved to Deleted. Products and subcategories remain assigned.',
        ]);
    }

    public function restoreCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $category = Category::whereNull('parent_id')->findOrFail($id);

        if (!$category->deleted) {
            return response()->json(['message' => 'This main category is not deleted.'], 422);
        }

        $category->update([
            'deleted' => false,
            'status' => 0,
        ]);

        return response()->json([
            'id' => (int) $category->id,
            'deleted' => false,
            'status' => false,
            'message' => 'Main category restored as Hidden.',
        ]);
    }

    public function hardDeleteCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $category = Category::whereNull('parent_id')
            ->withCount(['products', 'subCategories'])
            ->findOrFail($id);

        if (!$category->deleted) {
            return response()->json(['message' => 'Move this main category to Deleted before permanently deleting it.'], 422);
        }

        if ((int) $category->products_count > 0) {
            return response()->json([
                'message' => 'This main category cannot be permanently deleted while products are assigned to it.',
                'products_count' => (int) $category->products_count,
            ], 422);
        }

        if ((int) $category->sub_categories_count > 0) {
            return response()->json([
                'message' => 'This main category cannot be permanently deleted while subcategories belong to it.',
                'sub_categories_count' => (int) $category->sub_categories_count,
            ], 422);
        }

        $this->deleteManagedCategoryImage($category->image_path);
        $category->delete();

        return response()->json([
            'id' => (int) $category->id,
            'destroyed' => true,
            'message' => 'Main category permanently deleted.',
        ]);
    }

    public function subCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $query = SubCategory::query()
            ->select('sub_categories.*')
            ->selectSub(function ($mappingQuery) {
                $mappingQuery
                    ->from('storage_group_mapping')
                    ->select('storage_type')
                    ->whereColumn('storage_group_mapping.group_code', 'sub_categories.group_code')
                    ->limit(1);
            }, 'storage_type')
            ->with('category:id,category_name,status,deleted')
            ->withCount('products');

        if (!$request->boolean('show_deleted')) {
            $query->where(function ($subCategoryQuery) {
                $subCategoryQuery
                    ->where('deleted', false)
                    ->orWhereNull('deleted');
            });
        }

        return response()->json(
            $query
                ->orderBy('category_id')
                ->orderBy('sub_category_name')
                ->get()
        );
    }

    private function validatedSubCategoryPayload(Request $request, ?SubCategory $subCategory = null): array
    {
        $groupCodeRule = Rule::unique('sub_categories', 'group_code');
        if ($subCategory) {
            $groupCodeRule = $groupCodeRule->ignore($subCategory->id);
        }

        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'sub_category_name' => ['required', 'string', 'max:100'],
            'group_code' => ['required', 'string', 'max:10', $groupCodeRule],
            'storage_type' => ['sometimes', 'required', Rule::in(['Ambient', 'Frozen', 'Chilled'])],
            'status' => ['sometimes', 'boolean'],
        ]);

        $parent = Category::whereNull('parent_id')->find($validated['category_id']);
        if (!$parent || $parent->deleted) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'category_id' => ['Choose an available main category for this subcategory.'],
            ]);
        }

        return $validated;
    }

    private function syncSubCategoryStorageMapping(
        SubCategory $subCategory,
        string $storageType,
        ?string $previousGroupCode = null
    ): int {
        $groupCode = strtoupper(trim((string) $subCategory->group_code));
        $previousGroupCode = strtoupper(trim((string) ($previousGroupCode ?? $groupCode)));
        $subGroupName = trim((string) $subCategory->sub_category_name);

        if ($groupCode === '') {
            return 0;
        }

        if ($previousGroupCode !== '' && $previousGroupCode !== $groupCode) {
            DB::table('storage_group_mapping')
                ->where('group_code', $previousGroupCode)
                ->delete();
        }

        $mappingExists = DB::table('storage_group_mapping')
            ->where('group_code', $groupCode)
            ->exists();

        if ($mappingExists) {
            DB::table('storage_group_mapping')
                ->where('group_code', $groupCode)
                ->update([
                    'sub_group_name' => $subGroupName,
                    'storage_type' => $storageType,
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('storage_group_mapping')->insert([
                'group_code' => $groupCode,
                'sub_group_name' => $subGroupName,
                'storage_type' => $storageType,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Products and the website use products.storage_type at runtime.
        // Keep every product assigned to this exact subcategory in sync immediately.
        return Product::where('sub_category_id', $subCategory->id)
            ->update(['storage_type' => $storageType]);
    }

    public function createSubCategory(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validatedSubCategoryPayload($request);
        $storageType = $validated['storage_type'] ?? 'Ambient';

        $subCategory = DB::transaction(function () use ($validated, $storageType) {
            $subCategory = SubCategory::create([
                'category_id' => (int) $validated['category_id'],
                'sub_category_name' => trim($validated['sub_category_name']),
                'group_code' => strtoupper(trim($validated['group_code'])),
                'status' => 1,
                'deleted' => false,
            ]);

            $this->syncSubCategoryStorageMapping($subCategory, $storageType);

            return $subCategory;
        });

        $subCategory->setAttribute('storage_type', $storageType);

        return response()->json(
            $subCategory->load('category:id,category_name,status,deleted')->loadCount('products'),
            201
        );
    }

    public function updateSubCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $subCategory = SubCategory::findOrFail($id);
        $validated = $this->validatedSubCategoryPayload($request, $subCategory);

        $previousGroupCode = strtoupper(trim((string) $subCategory->group_code));
        $newGroupCode = strtoupper(trim($validated['group_code']));
        $previousName = trim((string) $subCategory->sub_category_name);
        $newName = trim($validated['sub_category_name']);

        $currentStorageType = DB::table('storage_group_mapping')
            ->where('group_code', $previousGroupCode)
            ->value('storage_type');

        $storageType = $validated['storage_type']
            ?? $currentStorageType
            ?? 'Ambient';

        $shouldSyncStorage =
            array_key_exists('storage_type', $validated)
            || $previousGroupCode !== $newGroupCode
            || $previousName !== $newName;

        $storageProductsUpdated = DB::transaction(function () use (
            $subCategory,
            $validated,
            $previousGroupCode,
            $newGroupCode,
            $newName,
            $storageType,
            $shouldSyncStorage
        ) {
            $subCategory->update([
                'category_id' => (int) $validated['category_id'],
                'sub_category_name' => $newName,
                'group_code' => $newGroupCode,
                'status' => array_key_exists('status', $validated)
                    ? (int) $validated['status']
                    : (int) $subCategory->status,
            ]);

            if (!$shouldSyncStorage) {
                return 0;
            }

            return $this->syncSubCategoryStorageMapping(
                $subCategory->fresh(),
                $storageType,
                $previousGroupCode
            );
        });

        $fresh = $subCategory
            ->fresh()
            ->load('category:id,category_name,status,deleted')
            ->loadCount('products');

        $fresh->setAttribute('storage_type', $storageType);
        $fresh->setAttribute('storage_products_updated', $storageProductsUpdated);

        return response()->json($fresh);
    }

    private function validateBulkSubCategoryIds(Request $request): array
    {
        return $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:5000'],
            'ids.*' => ['integer', 'distinct', 'exists:sub_categories,id'],
        ]);
    }

    private function availableSubCategorySelectionQuery(array $ids)
    {
        return SubCategory::query()
            ->whereIn('id', array_map('intval', $ids))
            ->where(function ($subCategoryQuery) {
                $subCategoryQuery
                    ->where('deleted', false)
                    ->orWhereNull('deleted');
            });
    }

    private function deletedSubCategorySelectionQuery(array $ids)
    {
        return SubCategory::query()
            ->whereIn('id', array_map('intval', $ids))
            ->where('deleted', true);
    }

    public function bulkHideSubCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkSubCategoryIds($request);
        $query = $this->availableSubCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No available subcategories matched this action.'], 422);
        }

        $query->update(['status' => 0]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' subcategor' . ($count === 1 ? 'y' : 'ies') . ' hidden from the public catalogue.',
        ]);
    }

    public function bulkShowSubCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkSubCategoryIds($request);
        $query = $this->availableSubCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No available subcategories matched this action.'], 422);
        }

        $query->update(['status' => 1]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' subcategor' . ($count === 1 ? 'y' : 'ies') . ' made visible in the public catalogue when their main category is active.',
        ]);
    }

    public function bulkSoftDeleteSubCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkSubCategoryIds($request);
        $query = $this->availableSubCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No available subcategories matched this action.'], 422);
        }

        $query->update([
            'deleted' => true,
            'status' => 0,
        ]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' subcategor' . ($count === 1 ? 'y was' : 'ies were') . ' moved to Deleted.',
        ]);
    }

    public function bulkRestoreSubCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkSubCategoryIds($request);
        $query = $this->deletedSubCategorySelectionQuery($validated['ids']);
        $count = (clone $query)->count();

        if ($count === 0) {
            return response()->json(['message' => 'No deleted subcategories matched this restore action.'], 422);
        }

        $query->update([
            'deleted' => false,
            'status' => 0,
        ]);

        return response()->json([
            'selected_count' => $count,
            'message' => $count . ' subcategor' . ($count === 1 ? 'y restored' : 'ies restored') . ' as Hidden.',
        ]);
    }

    public function bulkHardDeleteSubCategories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $this->validateBulkSubCategoryIds($request);
        $rows = $this->deletedSubCategorySelectionQuery($validated['ids'])
            ->withCount('products')
            ->get();

        if ($rows->isEmpty()) {
            return response()->json(['message' => 'No deleted subcategories matched this permanent-delete action.'], 422);
        }

        $blocked = $rows->filter(fn ($subCategory) => (int) $subCategory->products_count > 0);

        if ($blocked->isNotEmpty()) {
            return response()->json([
                'message' => 'Permanent delete blocked. Reassign products from the selected subcategories first.',
                'blocked_count' => $blocked->count(),
                'blocked' => $blocked->map(fn ($subCategory) => [
                    'id' => (int) $subCategory->id,
                    'name' => $subCategory->sub_category_name,
                    'products_count' => (int) $subCategory->products_count,
                ])->values(),
            ], 422);
        }

        $ids = $rows->pluck('id')->all();
        SubCategory::whereIn('id', $ids)->delete();

        return response()->json([
            'selected_count' => count($ids),
            'destroyed' => true,
            'message' => count($ids) . ' subcategor' . (count($ids) === 1 ? 'y permanently deleted.' : 'ies permanently deleted.'),
        ]);
    }

    public function softDeleteSubCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $subCategory = SubCategory::findOrFail($id);
        $subCategory->update([
            'deleted' => true,
            'status' => 0,
        ]);

        return response()->json([
            'id' => (int) $subCategory->id,
            'deleted' => true,
            'permanent' => false,
            'message' => 'Subcategory moved to Deleted. Products remain assigned.',
        ]);
    }

    public function restoreSubCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $subCategory = SubCategory::findOrFail($id);

        if (!$subCategory->deleted) {
            return response()->json(['message' => 'This subcategory is not deleted.'], 422);
        }

        $subCategory->update([
            'deleted' => false,
            'status' => 0,
        ]);

        return response()->json([
            'id' => (int) $subCategory->id,
            'deleted' => false,
            'status' => false,
            'message' => 'Subcategory restored as Hidden.',
        ]);
    }

    public function hardDeleteSubCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $subCategory = SubCategory::withCount('products')->findOrFail($id);

        if (!$subCategory->deleted) {
            return response()->json(['message' => 'Move this subcategory to Deleted before permanently deleting it.'], 422);
        }

        if ((int) $subCategory->products_count > 0) {
            return response()->json([
                'message' => 'This subcategory cannot be permanently deleted while products are assigned to it.',
                'products_count' => (int) $subCategory->products_count,
            ], 422);
        }

        $subCategory->delete();

        return response()->json([
            'id' => (int) $subCategory->id,
            'destroyed' => true,
            'message' => 'Subcategory permanently deleted.',
        ]);
    }

    private function normaliseBannerSortOrder(?string $position = null): void
    {
        $positions = $position ? [$position] : ['hero', 'middle', 'bottom'];

        foreach ($positions as $currentPosition) {
            $ids = HomeBanner::query()
                ->where('position', $currentPosition)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->pluck('id');

            foreach ($ids as $index => $id) {
                HomeBanner::whereKey($id)->update(['sort_order' => $index + 1]);
            }
        }
    }

    private function deleteManagedBannerImage(?string $path): void
    {
        if (!$path || str_starts_with($path, '/') || preg_match('/^https?:\/\//i', $path)) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    public function publicHomeBanners(Request $request)
    {
        $position = $request->query('position');

        if ($position !== null && !in_array($position, ['hero', 'middle', 'bottom'], true)) {
            return response()->json(['error' => 'Invalid banner position.'], 422);
        }

        $query = HomeBanner::query()
            ->with('brand:id,brand_name')
            ->where('is_active', true);

        if ($position) {
            $query->where('position', $position);
        }

        return response()->json(
            $query
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
        );
    }

    public function banners(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $position = $request->query('position');

        if ($position !== null && !in_array($position, ['hero', 'middle', 'bottom'], true)) {
            return response()->json(['error' => 'Invalid banner position.'], 422);
        }

        $query = HomeBanner::query()->with('brand:id,brand_name');

        if ($position) {
            $query->where('position', $position);
        }

        return response()->json(
            $query
                ->orderByRaw("FIELD(position, 'hero', 'middle', 'bottom')")
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
        );
    }

    public function uploadBanner(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $request->validate([
            'position' => 'required|in:hero,middle,bottom',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'link_url' => 'nullable|string|max:2048',
            'button_text' => 'nullable|string|max:80',
            'overlay_position' => 'required|in:left,center,right',
            'is_active' => 'nullable|boolean',
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        $path = $request->file('image')->store('banners/' . $validated['position'], 'public');
        $nextOrder = ((int) HomeBanner::where('position', $validated['position'])->max('sort_order')) + 1;

        $banner = HomeBanner::create([
            'position' => $validated['position'],
            'brand_id' => $validated['brand_id'] ?? null,
            'image_path' => $path,
            'link_url' => trim($validated['link_url'] ?? '') ?: null,
            'button_text' => trim($validated['button_text'] ?? '') ?: null,
            'overlay_position' => $validated['overlay_position'],
            'sort_order' => $nextOrder,
            'is_active' => $request->boolean('is_active', true),
        ]);

        $this->normaliseBannerSortOrder($banner->position);

        return response()->json($banner->fresh()->load('brand:id,brand_name'), 201);
    }

    public function updateBanner(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $banner = HomeBanner::findOrFail($id);
        $oldPosition = $banner->position;

        $validated = $request->validate([
            'position' => 'sometimes|required|in:hero,middle,bottom',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'link_url' => 'nullable|string|max:2048',
            'button_text' => 'nullable|string|max:80',
            'overlay_position' => 'sometimes|required|in:left,center,right',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:10240',
        ]);

        $nextPosition = $validated['position'] ?? $banner->position;
        $data = [];

        if (array_key_exists('position', $validated)) {
            $data['position'] = $nextPosition;
        }
        if ($request->has('brand_id')) {
            $data['brand_id'] = $validated['brand_id'] ?? null;
        }
        if ($request->has('link_url')) {
            $data['link_url'] = trim($validated['link_url'] ?? '') ?: null;
        }
        if ($request->has('button_text')) {
            $data['button_text'] = trim($validated['button_text'] ?? '') ?: null;
        }
        if (array_key_exists('overlay_position', $validated)) {
            $data['overlay_position'] = $validated['overlay_position'];
        }
        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($nextPosition !== $oldPosition) {
            $data['sort_order'] = ((int) HomeBanner::where('position', $nextPosition)->max('sort_order')) + 1;
        }

        if ($request->hasFile('image')) {
            $newPath = $request->file('image')->store('banners/' . $nextPosition, 'public');
            $this->deleteManagedBannerImage($banner->image_path);
            $data['image_path'] = $newPath;
        }

        $banner->update($data);

        $this->normaliseBannerSortOrder($oldPosition);
        if ($nextPosition !== $oldPosition) {
            $this->normaliseBannerSortOrder($nextPosition);
        }

        return response()->json($banner->fresh()->load('brand:id,brand_name'));
    }

    public function reorderBanners(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $request->validate([
            'position' => 'required|in:hero,middle,bottom',
            'ids' => 'required|array',
            'ids.*' => 'required|integer|distinct|exists:home_banners,id',
        ]);

        $existingIds = HomeBanner::where('position', $validated['position'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->sort()
            ->values()
            ->all();

        $submittedIds = collect($validated['ids'])
            ->map(fn ($id) => (int) $id)
            ->sort()
            ->values()
            ->all();

        if ($existingIds !== $submittedIds) {
            return response()->json([
                'error' => 'The reorder list must contain every banner from this section exactly once.',
            ], 422);
        }

        DB::transaction(function () use ($validated) {
            foreach ($validated['ids'] as $index => $id) {
                HomeBanner::whereKey($id)
                    ->where('position', $validated['position'])
                    ->update(['sort_order' => $index + 1]);
            }
        });

        return response()->json([
            'banners' => HomeBanner::with('brand:id,brand_name')
                ->where('position', $validated['position'])
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function deleteBanner(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $banner = HomeBanner::findOrFail($id);
        $position = $banner->position;

        $this->deleteManagedBannerImage($banner->image_path);
        $banner->delete();
        $this->normaliseBannerSortOrder($position);

        return response()->json(['id' => (int) $id, 'destroyed' => true]);
    }

    private function normaliseDealSortOrder(): void
    {
        $dealIds = Pdf::query()
            ->where('type', 'deal')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('id');

        foreach ($dealIds as $index => $id) {
            Pdf::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function publicDeals()
    {
        return response()->json(
            Pdf::query()
                ->where('type', 'deal')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
        );
    }

    public function pdfs(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $query = Pdf::query();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return response()->json(
            $query
                ->orderBy('type')
                ->orderBy('sort_order')
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function uploadPdf(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:deal,manual,banner,other,upcoming',
            'badge' => 'nullable|string|max:50',
            'valid_from' => 'nullable|date',
            'valid_to' => 'nullable|date|after_or_equal:valid_from',
            'validity_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'is_active' => 'nullable|boolean',
            'file' => 'required|file|mimes:pdf|max:25000',
        ]);

        $isActive = $request->boolean('is_active', true);

        $path = $request->file('file')->store('pdfs', 'public');
        $nextOrder = $validated['type'] === 'deal'
            ? ((int) Pdf::where('type', 'deal')->max('sort_order')) + 1
            : 1;

        $pdf = Pdf::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'badge' => $validated['badge'] ?? null,
            'valid_from' => $validated['valid_from'] ?? null,
            'valid_to' => $validated['valid_to'] ?? null,
            'validity_text' => $validated['validity_text'] ?? null,
            'description' => $validated['description'] ?? null,
            'sort_order' => $nextOrder,
            'is_active' => $isActive,
            'file_path' => $path,
        ]);

        if ($pdf->type === 'deal') {
            $this->normaliseDealSortOrder();
        }

        return response()->json($pdf->fresh(), 201);
    }

    public function updatePdf(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $pdf = Pdf::findOrFail($id);
        $oldType = $pdf->type;

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:deal,manual,banner,other,upcoming',
            'badge' => 'nullable|string|max:50',
            'valid_from' => 'nullable|date',
            'valid_to' => 'nullable|date|after_or_equal:valid_from',
            'validity_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'is_active' => 'nullable|boolean',
            'file' => 'nullable|file|mimes:pdf|max:25000',
        ]);

        $nextType = $validated['type'] ?? $pdf->type;
        $data = collect($validated)->except('file')->toArray();

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($oldType !== 'deal' && $nextType === 'deal') {
            $data['sort_order'] = ((int) Pdf::where('type', 'deal')->max('sort_order')) + 1;
        }

        $newPath = null;
        $oldPath = $pdf->file_path;

        if ($request->hasFile('file')) {
            $newPath = $request->file('file')->store('pdfs', 'public');
            $data['file_path'] = $newPath;
        }

        DB::transaction(function () use ($pdf, $data) {
            $pdf->update($data);
        });

        if ($newPath && $oldPath && $oldPath !== $newPath) {
            Storage::disk('public')->delete($oldPath);
        }

        if ($oldType === 'deal' || $nextType === 'deal') {
            $this->normaliseDealSortOrder();
        }

        return response()->json($pdf->fresh());
    }

    public function reorderPdfs(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|distinct|exists:pdfs,id',
        ]);

        $requestedIds = collect($validated['ids'])->map(fn ($id) => (int) $id)->values();
        $validDealIds = Pdf::query()
            ->where('type', 'deal')
            ->whereIn('id', $requestedIds)
            ->pluck('id')
            ->map(fn ($id) => (int) $id);

        if ($validDealIds->count() !== $requestedIds->count()) {
            return response()->json([
                'error' => 'The reorder list contains a PDF that is not a Deal / Promotion PDF.',
            ], 422);
        }

        DB::transaction(function () use ($requestedIds) {
            $remainingIds = Pdf::query()
                ->where('type', 'deal')
                ->whereNotIn('id', $requestedIds)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->pluck('id');

            $allIds = $requestedIds->concat($remainingIds)->values();

            foreach ($allIds as $index => $id) {
                Pdf::whereKey($id)->update(['sort_order' => $index + 1]);
            }
        });

        return response()->json([
            'message' => 'Catalogue order saved successfully.',
            'pdfs' => Pdf::query()
                ->where('type', 'deal')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function deletePdf(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $pdf = Pdf::findOrFail($id);
        $wasDeal = $pdf->type === 'deal';

        if ($pdf->file_path) {
            Storage::disk('public')->delete($pdf->file_path);
        }

        $pdf->delete();

        if ($wasDeal) {
            $this->normaliseDealSortOrder();
        }

        return response()->json(['id' => (int) $id, 'destroyed' => true]);
    }

    public function importErpProducts(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        // Keep catalogue lifecycle current before processing a new upload.
        Product::expireObsoleteProducts();

        $request->validate([
            'file' => [
                'required',
                'file',
                'max:51200',
                function ($attribute, $value, $fail) {
                    if (!$value->isValid()) {
                        $fail('The uploaded file is invalid.');
                        return;
                    }
                    $ext = strtolower($value->getClientOriginalExtension());
                    if (!in_array($ext, ['xlsx', 'xls', 'csv'])) {
                        $fail('The ' . $attribute . ' must be a file of type: xlsx, xls, csv.');
                    }
                },
            ],
        ]);

        @set_time_limit(600);
        @ini_set('memory_limit', '1024M');

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension() ?: 'xlsx');
        if (!in_array($ext, ['xlsx', 'xls', 'csv'])) {
            $ext = 'xlsx';
        }

        $tempDir = storage_path('app/temp_imports');
        if (!file_exists($tempDir)) {
            @mkdir($tempDir, 0777, true);
        }

        $tempFileName = 'erp_import_' . time() . '_' . uniqid() . '.' . $ext;
        $tempFilePath = $tempDir . '/' . $tempFileName;

        $file->move($tempDir, $tempFileName);

        try {
            $lastException = null;

            // Strategy 1: Try IOFactory::load directly
            try {
                $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tempFilePath);
            } catch (\Throwable $e1) {
                $lastException = $e1;
            }

            // Strategy 2: Try specific reader by file extension
            if (!$spreadsheet) {
                try {
                    $reader = null;
                    if ($ext === 'xlsx') {
                        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
                    } elseif ($ext === 'xls') {
                        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
                    } elseif ($ext === 'csv') {
                        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Csv();
                    }

                    if ($reader) {
                        if (method_exists($reader, 'setReadDataOnly')) {
                            $reader->setReadDataOnly(true);
                        }
                        $spreadsheet = $reader->load($tempFilePath);
                    }
                } catch (\Throwable $e2) {
                    if (!$lastException) $lastException = $e2;
                }
            }

            // Strategy 3: Try Xlsx reader directly
            if (!$spreadsheet) {
                try {
                    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
                    if (method_exists($reader, 'setReadDataOnly')) {
                        $reader->setReadDataOnly(true);
                    }
                    $spreadsheet = $reader->load($tempFilePath);
                } catch (\Throwable $e3) {
                    if (!$lastException) $lastException = $e3;
                }
            }

            // Strategy 4: Try Xls reader directly
            if (!$spreadsheet) {
                try {
                    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
                    if (method_exists($reader, 'setReadDataOnly')) {
                        $reader->setReadDataOnly(true);
                    }
                    $spreadsheet = $reader->load($tempFilePath);
                } catch (\Throwable $e4) {
                    if (!$lastException) $lastException = $e4;
                }
            }

            // Strategy 5: Try Html reader directly (common for ERP exported .xlsx/.xls files)
            if (!$spreadsheet) {
                try {
                    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Html();
                    $spreadsheet = $reader->load($tempFilePath);
                } catch (\Throwable $e5) {
                    if (!$lastException) $lastException = $e5;
                }
            }

            // Strategy 6: Try Csv reader directly
            if (!$spreadsheet) {
                try {
                    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Csv();
                    $spreadsheet = $reader->load($tempFilePath);
                } catch (\Throwable $e6) {
                    if (!$lastException) $lastException = $e6;
                }
            }

            if (!$spreadsheet) {
                $detail = $lastException ? ': ' . $lastException->getMessage() : '.';
                throw new \Exception('Unable to read the uploaded Excel file' . $detail);
            }

            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, false);

            if (empty($rows)) {
                return response()->json(['error' => 'The uploaded file is empty.'], 422);
            }

            $headers = array_shift($rows);

            // Filter out empty trailing rows from Excel
            $rows = array_values(array_filter($rows, function ($row) {
                foreach ($row as $cell) {
                    if ($cell !== null && trim((string)$cell) !== '') {
                        return true;
                    }
                }
                return false;
            }));

            $total = count($rows);

            $importedCount = 0;
            $createdCount  = 0;
            $updatedCount  = 0;
            $restoredCount = 0;
            $skippedCount  = 0;
            $errorCount    = 0;
            $unknownCodes  = [];
            $unknownBrands = [];

            $supplierLookup = Supplier::query()
                ->whereNotNull('supplier_index')
                ->get(['id', 'supplier_index'])
                ->mapWithKeys(function ($supplier) {
                    $key = trim((string) $supplier->supplier_index);
                    return $key === '' ? [] : [$key => (int) $supplier->id];
                })
                ->toArray();
            $brandLookupMaps = $this->buildBrandLookupMaps();

            $subCategoryMap = [];
            $hasGroupCode = \Illuminate\Support\Facades\Schema::hasColumn('sub_categories', 'group_code');
            $cols = $hasGroupCode ? ['id', 'group_code', 'category_id'] : ['id', 'sub_category_name', 'category_id'];

            foreach (SubCategory::where('status', 1)->select($cols)->get() as $sc) {
                $keyVal = $hasGroupCode ? $sc->group_code : $sc->sub_category_name;
                if ($keyVal) {
                    $subCategoryMap[strtoupper($keyVal)] = [
                        'category_id'     => $sc->category_id,
                        'sub_category_id' => $sc->id,
                    ];
                }
            }

            $storageMap = [];
            if (\Illuminate\Support\Facades\Schema::hasTable('storage_group_mapping') && \Illuminate\Support\Facades\Schema::hasColumn('storage_group_mapping', 'group_code')) {
                $storageMap = DB::table('storage_group_mapping')
                    ->pluck('storage_type', 'group_code')
                    ->mapWithKeys(fn ($value, $key) => [strtoupper($key) => $value])
                    ->toArray();
            }

            $hasOrderQtyAllowed = \Illuminate\Support\Facades\Schema::hasColumn('products', 'order_qty_allowed');

            $headerMap = [];
            foreach ($headers as $idx => $h) {
                $cleanH = strtolower(trim(preg_replace('/\s+/', ' ', (string)$h)));
                $headerMap[$cleanH] = $idx;
            }

            $mode = strtolower(trim((string) $request->input('mode', 'erp')));
            $isStep1 = ($mode === 'step1' || $request->boolean('step1'));

            $orderQtyAllowedIdx =
                $headerMap['order qty allowed']
                ?? ($headerMap['orderqtyallowed'] ?? null);

            // VAT codes are database-driven. The ERP VatCode column stores only
            // the code (A, C, D, E, F, G, H, M, N, O, Z, etc.); percentage and
            // description always come from the active vat_codes table.
            $validVatCodes = DB::table('vat_codes')
                ->where('active', 1)
                ->pluck('code')
                ->map(fn ($code) => strtoupper(trim((string) $code)))
                ->filter()
                ->values()
                ->all();

            $vatCodeIdx = $headerMap['vatcode']
                ?? ($headerMap['vat_code'] ?? null);

            if ($isStep1) {
                $newProductsFound = [];
                $codeIdx = $headerMap['navsa product code'] ?? ($headerMap['reference'] ?? null);
                $descIdx = $headerMap['description'] ?? ($headerMap['webshortdescription'] ?? null);

                if ($codeIdx === null) {
                    return response()->json([
                        'error' => 'Step 1 import requires a NAVSA Product Code or Reference column.',
                        'message' => 'Step 1 import requires a NAVSA Product Code or Reference column.',
                    ], 422);
                }

                foreach ($rows as $rowIndex => $row) {
                    $navsaProductCode = trim((string) ($row[$codeIdx] ?? ''));
                    $description = $descIdx !== null
                        ? trim((string) ($row[$descIdx] ?? ''))
                        : '';

                    if ($navsaProductCode === '' && $description === '') {
                        continue;
                    }

                    if ($navsaProductCode === '') {
                        $newProductsFound[] = [
                            'row' => $rowIndex + 2,
                            'code' => '',
                            'desc' => $description,
                            'reason' => 'Missing NAVSA Product Code / Reference',
                        ];
                        continue;
                    }

                    $exists = Product::where('navsa_product_code', $navsaProductCode)->exists();
                    if (!$exists) {
                        $newProductsFound[] = [
                            'row'  => $rowIndex + 2,
                            'code' => $navsaProductCode,
                            'desc' => $description,
                        ];
                    }
                }

                if (!empty($newProductsFound)) {
                    $totalNew = count($newProductsFound);
                    $formattedRows = array_map(function($item) {
                        $identifier = !empty($item['code']) ? "Code: {$item['code']}" : "Desc: {$item['desc']}";
                        if (!empty($item['reason'])) {
                            $identifier .= " - {$item['reason']}";
                        }
                        return "Row {$item['row']} ({$identifier})";
                    }, $newProductsFound);

                    $previewText = implode(', ', array_slice($formattedRows, 0, 15));
                    if ($totalNew > 15) {
                        $previewText .= ' and ' . ($totalNew - 15) . ' more...';
                    }

                    $msg = "Step 1 import can ONLY update existing products by NAVSA Product Code / Reference. Found {$totalNew} row(s) that cannot be matched safely.\n\nRows: {$previewText}\n\nPlease correct/add those products first, then re-run Step 1 import.";

                    return response()->json([
                        'error' => $msg,
                        'message' => $msg,
                        'new_products_found' => true,
                        'total_new' => $totalNew,
                        'new_rows' => $newProductsFound,
                        'formatted_rows_text' => $previewText,
                    ], 422);
                }

                // A minimal Step 1 file may contain only:
                // NAVSA Product Code/Reference, Description, ORDER QTY ALLOWED.
                // In that case, update ONLY those supplied fields and never blank
                // unrelated ERP product data.
                $nonEmptyHeaderCount = count(array_filter($headers, function ($header) {
                    return trim((string) $header) !== '';
                }));
                $isMinimalStep1 = $nonEmptyHeaderCount <= 3;

                if ($isMinimalStep1) {
                    if (!$hasOrderQtyAllowed) {
                        return response()->json([
                            'error' => 'products.order_qty_allowed is missing from the database.',
                            'message' => 'products.order_qty_allowed is missing from the database.',
                        ], 422);
                    }

                    if ($orderQtyAllowedIdx === null) {
                        return response()->json([
                            'error' => 'Minimal Step 1 import requires an ORDER QTY ALLOWED column.',
                            'message' => 'Minimal Step 1 import requires an ORDER QTY ALLOWED column.',
                        ], 422);
                    }

                    foreach ($rows as $rowIndex => $row) {
                        $navsaProductCode = trim((string) ($row[$codeIdx] ?? ''));
                        if ($navsaProductCode === '') {
                            $skippedCount++;
                            continue;
                        }

                        $rawOrderQty = $row[$orderQtyAllowedIdx] ?? null;
                        $orderQtyAllowed = $this->normalizeOrderQtyAllowed($rawOrderQty);

                        if ($orderQtyAllowed === null) {
                            $errorCount++;
                            \Illuminate\Support\Facades\Log::warning(
                                'Step 1 import skipped row ' . ($rowIndex + 2)
                                . ': invalid ORDER QTY ALLOWED value. Use blank, DEFAULT, PALLET or CASE.'
                            );
                            continue;
                        }

                        $product = Product::where('navsa_product_code', $navsaProductCode)->first();
                        if (!$product) {
                            $errorCount++;
                            continue;
                        }

                        $obsoleteExpired = Product::isObsoleteDateExpired($product->obsolete);

                        $updates = [
                            'order_qty_allowed' => $orderQtyAllowed,
                            // Step 1 may restore ordinary soft-deleted items, but it
                            // must never restore a product whose Obsolete date passed.
                            'deleted' => $obsoleteExpired ? true : false,
                        ];

                        if ($obsoleteExpired) {
                            $updates['live_for_web'] = 0;
                        }

                        if ($descIdx !== null) {
                            $description = trim((string) ($row[$descIdx] ?? ''));
                            if ($description !== '') {
                                $updates['description'] = $description;
                            }
                        }

                        $wasDeleted = (bool) $product->deleted;
                        $product->update($updates);

                        $importedCount++;
                        $updatedCount++;
                        if ($wasDeleted) {
                            $restoredCount++;
                        }
                    }

                    return response()->json([
                        'success' => true,
                        'message' => 'Step 1 product settings imported successfully!',
                        'total' => $total,
                        'imported' => $importedCount,
                        'created' => 0,
                        'updated' => $updatedCount,
                        'restored' => $restoredCount,
                        'skipped' => $skippedCount,
                        'errors' => $errorCount,
                    ]);
                }
            }

            // Pre-validation check:
            // Any row with PriceList != 'STD' and ToDate is a normal date (year != 9999)
            // MUST already exist in the database. If not, reject the file and return error.
            $unmatchedPromotions = [];
            $codeHeaderIdx = $headerMap['navsa product code'] ?? ($headerMap['reference'] ?? null);
            $descHeaderIdx = $headerMap['description'] ?? ($headerMap['webshortdescription'] ?? null);
            $priceListHIdx = $headerMap['pricelist'] ?? ($headerMap['price_list'] ?? null);
            $toDateHIdx    = $headerMap['todate'] ?? ($headerMap['to_date'] ?? null);

            foreach ($rows as $rowIndex => $row) {
                $navsaProductCode = $codeHeaderIdx !== null ? trim((string) ($row[$codeHeaderIdx] ?? '')) : '';
                $description      = $descHeaderIdx !== null ? trim((string) ($row[$descHeaderIdx] ?? '')) : '';

                if (empty($description) && empty($navsaProductCode)) {
                    continue;
                }

                $priceListRaw   = $priceListHIdx !== null ? trim((string) ($row[$priceListHIdx] ?? '')) : '';
                $priceListUpper = strtoupper($priceListRaw);

                $rawToDate = $toDateHIdx !== null ? ($row[$toDateHIdx] ?? null) : null;
                $toDateVal = $rawToDate !== null ? $this->toDateOrNull($rawToDate) : null;
                $toYear    = $toDateVal ? (int) date('Y', strtotime($toDateVal)) : null;

                // Condition: PriceList is NOT 'STD' AND ToDate is a normal date (year != 9999)
                $isNormalToDatePromo = ($priceListUpper !== '' && $priceListUpper !== 'STD') && ($toYear !== null && $toYear !== 9999);

                if ($isNormalToDatePromo) {
                    $matchKey = !empty($navsaProductCode)
                        ? ['navsa_product_code' => $navsaProductCode]
                        : ['description' => $description];

                    $exists = Product::where($matchKey)->exists();
                    if (!$exists) {
                        $unmatchedPromotions[] = [
                            'row'        => $rowIndex + 2,
                            'code'       => $navsaProductCode,
                            'desc'       => $description,
                            'price_list' => $priceListRaw,
                            'to_date'    => $toDateVal,
                        ];
                    }
                }
            }

            if (!empty($unmatchedPromotions)) {
                $totalUnmatched = count($unmatchedPromotions);
                $formattedRows = array_map(function ($item) {
                    $identifier = !empty($item['code']) ? "Code: {$item['code']}" : "Desc: {$item['desc']}";
                    return "Row {$item['row']} ({$identifier}, PriceList: {$item['price_list']}, ToDate: {$item['to_date']})";
                }, $unmatchedPromotions);

                $previewText = implode(', ', array_slice($formattedRows, 0, 15));
                if ($totalUnmatched > 15) {
                    $previewText .= ' and ' . ($totalUnmatched - 15) . ' more...';
                }

                $msg = "Promotional products (with PriceList != STD and normal ToDate) can ONLY be updated if the product already exists in the database.\n\nFound {$totalUnmatched} promotional row(s) for product(s) NOT in database:\n{$previewText}\n\nPlease add these base products to the database first before importing promotion prices.";

                return response()->json([
                    'error' => $msg,
                    'message' => $msg,
                    'unmatched_promotional_rows' => $unmatchedPromotions,
                ], 422);
            }

            foreach ($rows as $rowIndex => $row) {
                try {
                    $codeIdx  = $headerMap['navsa product code'] ?? ($headerMap['reference'] ?? null);
                    $descIdx  = $headerMap['description'] ?? ($headerMap['webshortdescription'] ?? null);

                    $navsaProductCode = $codeIdx !== null ? trim((string) ($row[$codeIdx] ?? '')) : '';
                    $description      = $descIdx !== null ? trim((string) ($row[$descIdx] ?? '')) : '';

                    if (empty($description) && empty($navsaProductCode)) {
                        $skippedCount++;
                        continue;
                    }

                    $barIdx          = $headerMap['barcodeean'] ?? ($headerMap['barcode_ean'] ?? null);
                    $barcodeCaseIdx  = $headerMap['barcodecase'] ?? ($headerMap['barcode_case'] ?? null);
                    $grpIdx          = $headerMap['groupdesc'] ?? ($headerMap['group_desc'] ?? null);

                    $barcodeEan  = $barIdx !== null ? trim((string) ($row[$barIdx] ?? '')) : null;
                    $barcodeCase = $barcodeCaseIdx !== null ? trim((string) ($row[$barcodeCaseIdx] ?? '')) : null;
                    $groupDesc   = $grpIdx !== null ? trim((string) ($row[$grpIdx] ?? '')) : null;

                    $priceIdx = $headerMap['price'] ?? null;
                    $costIdx  = $headerMap['cost'] ?? null;

                    $price = $priceIdx !== null ? $this->toNumberOrNull($row[$priceIdx] ?? null) : null;
                    $cost  = $costIdx !== null ? $this->toNumberOrNull($row[$costIdx] ?? null) : null;

                    $unitsOfIdx = $headerMap['unitsof'] ?? ($headerMap['units_of'] ?? null);
                    $unitsOf    = $unitsOfIdx !== null ? trim((string) ($row[$unitsOfIdx] ?? '')) : null;

                    $innerCaseIdx = $headerMap['units per case'] ?? ($headerMap['innercasequantity'] ?? ($headerMap['inner_case_quantity'] ?? null));
                    $innerCase    = $innerCaseIdx !== null ? $this->toNumberOrNull($row[$innerCaseIdx] ?? null) : null;

                    $outerCaseIdx = $headerMap['outercasequantity'] ?? ($headerMap['outer_case_quantity'] ?? null);
                    $outerCase    = $outerCaseIdx !== null ? $this->toNumberOrNull($row[$outerCaseIdx] ?? null) : null;

                    $qtyDescIdx = $headerMap['qtydesc'] ?? ($headerMap['qty_desc'] ?? null);
                    $qtyDesc    = $qtyDescIdx !== null
                        ? $this->normalizeQtyDesc($row[$qtyDescIdx] ?? null)
                        : null;

                    $orderQtyAllowed = null;
                    if ($orderQtyAllowedIdx !== null) {
                        $orderQtyAllowed = $this->normalizeOrderQtyAllowed(
                            $row[$orderQtyAllowedIdx] ?? null
                        );

                        if ($orderQtyAllowed === null) {
                            $errorCount++;
                            \Illuminate\Support\Facades\Log::warning(
                                'ERP/Step 1 import skipped row ' . ($rowIndex + 2)
                                . ': invalid ORDER QTY ALLOWED value. Use blank, DEFAULT, PALLET or CASE.'
                            );
                            continue;
                        }
                    }

                    $rawVat = $vatCodeIdx !== null
                        ? strtoupper(trim((string) ($row[$vatCodeIdx] ?? '')))
                        : '';

                    $vatCode = $rawVat !== '' ? $rawVat : null;

                    if ($vatCode !== null && !in_array($vatCode, $validVatCodes, true)) {
                        $errorCount++;
                        \Illuminate\Support\Facades\Log::warning(
                            'ERP import skipped row ' . ($rowIndex + 2)
                            . ": unknown/inactive VAT code '{$vatCode}'. "
                            . 'Add/activate the code in vat_codes or correct the ERP VatCode value.'
                        );
                        continue;
                    }

                    $layerQtyIdx  = $headerMap['layerquantity'] ?? ($headerMap['layer_quantity'] ?? null);
                    $palletQtyIdx = $headerMap['palletquantity'] ?? ($headerMap['pallet_quantity'] ?? null);

                    $layerQty  = $layerQtyIdx !== null ? $this->toNumberOrNull($row[$layerQtyIdx] ?? null) : null;
                    $palletQty = $palletQtyIdx !== null ? $this->toNumberOrNull($row[$palletQtyIdx] ?? null) : null;

                    $supplierIndexIdx = $headerMap['primarysupplierindex'] ?? ($headerMap['primary_supplier_index'] ?? null);
                    $supplierIndex    = $supplierIndexIdx !== null
                        ? trim((string) ($row[$supplierIndexIdx] ?? ''))
                        : '';

                    $supplierId = $supplierIndex !== ''
                        ? ($supplierLookup[$supplierIndex] ?? null)
                        : null;

                    $supplierRefIdx = $headerMap['primarysupplierreference'] ?? ($headerMap['supplier_reference'] ?? null);
                    $supplierRef    = $supplierRefIdx !== null ? trim((string) ($row[$supplierRefIdx] ?? '')) : null;

                    $obsoleteIdx = $headerMap['obsolete'] ?? null;
                    $rawObsolete = $obsoleteIdx !== null ? ($row[$obsoleteIdx] ?? null) : null;
                    $obsolete    = $obsoleteIdx !== null ? $this->toDateOrNull($rawObsolete) : null;

                    $rawObsoleteHasValue = $obsoleteIdx !== null
                        && $rawObsolete !== null
                        && (!is_string($rawObsolete) || trim($rawObsolete) !== '');

                    if ($rawObsoleteHasValue && $obsolete === null) {
                        $errorCount++;
                        \Illuminate\Support\Facades\Log::warning(
                            'ERP import skipped row ' . ($rowIndex + 2)
                            . ': invalid Obsolete date.'
                        );
                        continue;
                    }

                    $costFromDateIdx = $headerMap['costfromdate'] ?? ($headerMap['cost_from_date'] ?? null);
                    $costToDateIdx   = $headerMap['costtodate'] ?? ($headerMap['cost_to_date'] ?? null);

                    $costFromDate = $costFromDateIdx !== null ? $this->toDateOrNull($row[$costFromDateIdx] ?? null) : null;
                    $costToDate   = $costToDateIdx !== null ? $this->toDateOrNull($row[$costToDateIdx] ?? null) : null;

                    $weightIdx = $headerMap['unit weight'] ?? ($headerMap['weight'] ?? null);
                    $volumeIdx = $headerMap['unit volume'] ?? ($headerMap['volume'] ?? null);

                    $weight = $weightIdx !== null ? $this->toNumberOrNull($row[$weightIdx] ?? null) : null;
                    $volume = $volumeIdx !== null ? $this->toNumberOrNull($row[$volumeIdx] ?? null) : null;

                    $shelfLifeIdx = $headerMap['shelflife in days'] ?? ($headerMap['shelflife'] ?? ($headerMap['shelf_life'] ?? null));
                    $shelfLife    = $shelfLifeIdx !== null ? $this->toNumberOrNull($row[$shelfLifeIdx] ?? null) : null;

                    $bbdIdx = $headerMap['best before date (indicative)'] ?? ($headerMap['bbd'] ?? null);
                    $bbd    = $bbdIdx !== null ? $this->toDateOrNull($row[$bbdIdx] ?? null) : null;

                    $priceListIdx = $headerMap['pricelist'] ?? ($headerMap['price_list'] ?? null);
                    $priceList    = $priceListIdx !== null ? trim((string) ($row[$priceListIdx] ?? '')) : null;

                    $promPriceIdx = $headerMap['promotion_price'] ?? ($headerMap['promotion price'] ?? null);
                    $fromDateIdx   = $headerMap['fromdate'] ?? ($headerMap['from_date'] ?? null);
                    $toDateIdx     = $headerMap['todate'] ?? ($headerMap['to_date'] ?? null);

                    $promotionPrice = $promPriceIdx !== null ? $this->toNumberOrNull($row[$promPriceIdx] ?? null) : null;
                    $fromDate       = $fromDateIdx !== null ? $this->toDateOrNull($row[$fromDateIdx] ?? null) : null;
                    $toDate         = $toDateIdx !== null ? $this->toDateOrNull($row[$toDateIdx] ?? null) : null;

                    $priceListUpper = $priceList !== null ? strtoupper(trim($priceList)) : '';
                    $toYear = $toDate ? (int) date('Y', strtotime($toDate)) : null;

                    $commCodeIdx     = $headerMap['commcode'] ?? ($headerMap['comm_code'] ?? null);
                    $intraCountryIdx = $headerMap['intracountry'] ?? ($headerMap['intra_country'] ?? null);
                    $intraTypeIdx    = $headerMap['intratype'] ?? ($headerMap['intra_type'] ?? null);

                    $commCode     = $commCodeIdx !== null ? trim((string) ($row[$commCodeIdx] ?? '')) : null;
                    $intraCountry = $intraCountryIdx !== null ? trim((string) ($row[$intraCountryIdx] ?? '')) : null;
                    $intraType    = $intraTypeIdx !== null ? trim((string) ($row[$intraTypeIdx] ?? '')) : null;

                    $webShortIdx = $headerMap['webshortdescription'] ?? ($headerMap['web_short_description'] ?? null);
                    $webLongIdx  = $headerMap['weblongdescription'] ?? ($headerMap['web_long_description'] ?? null);
                    $webImgIdx   = $headerMap['webimage'] ?? ($headerMap['web_image'] ?? null);

                    $webShort = $webShortIdx !== null ? trim((string) ($row[$webShortIdx] ?? '')) : null;
                    $webLong  = $webLongIdx !== null ? trim((string) ($row[$webLongIdx] ?? '')) : null;
                    $webImage = $webImgIdx !== null ? trim((string) ($row[$webImgIdx] ?? '')) : null;

                    $liveForWebIdx = $headerMap['liveforweb'] ?? ($headerMap['live_for_web'] ?? null);
                    $liveForWeb = $liveForWebIdx !== null
                        ? $this->toBoolean01($row[$liveForWebIdx] ?? 0)
                        : 0;

                    // NAVSA Product Code is the immutable ERP identifier.
                    // Never invent a random/fallback code during import.
                    if ($navsaProductCode === '') {
                        $errorCount++;
                        \Illuminate\Support\Facades\Log::warning(
                            'ERP Import skipped row ' . ($rowIndex + 2) . ': missing Reference / NAVSA Product Code.'
                        );
                        continue;
                    }

                    /*
                     * Category, sub-category and brand are derived ONLY from GroupDesc.
                     *
                     * ERP format:
                     *   FRO11YOU107 YOUNG'S
                     *   ^^^^^       ^^^^^^^
                     *   group code  brand text
                     *
                     * The first 5 characters map to sub_categories.group_code.
                     * The text from character 12 onward maps to the pre-loaded brands table.
                     * We intentionally do NOT trust the Step 1 "Master Group", "Sub Catagories"
                     * or "Brand" columns because those example workbooks contain stale VLOOKUP data.
                     */
                    $brandName     = '';
                    $groupCode     = '';
                    $categoryId    = null;
                    $subCategoryId = null;
                    $storageType   = 'Ambient';

                    if (!empty($groupDesc)) {
                        $cleanGroup = preg_replace('/\s+/u', ' ', trim($groupDesc));
                        $groupCode  = strtoupper(substr($cleanGroup, 0, 5));

                        // GroupDesc is 5-char group code + 6-char brand code + space + brand text.
                        if (strlen($cleanGroup) > 11) {
                            $brandName = trim(substr($cleanGroup, 11));
                        }

                        // Fallback for any unusual ERP row that still follows "code text".
                        if ($brandName === '' && preg_match('/^\S+\s+(.+)$/u', $cleanGroup, $matches)) {
                            $brandName = trim($matches[1]);
                        }

                        $storageType = $storageMap[$groupCode] ?? 'Ambient';

                        if (isset($subCategoryMap[$groupCode])) {
                            $categoryId    = $subCategoryMap[$groupCode]['category_id'];
                            $subCategoryId = $subCategoryMap[$groupCode]['sub_category_id'];
                        } else {
                            $unknownCodes[$groupCode] = ($unknownCodes[$groupCode] ?? 0) + 1;
                        }
                    }

                    $brandId = $this->resolveBrandId($brandName, $brandLookupMaps);
                    if ($brandName !== '' && $brandId === null) {
                        $unknownBrands[$brandName] = ($unknownBrands[$brandName] ?? 0) + 1;
                    }

                    $matchKey = !empty($navsaProductCode)
                        ? ['navsa_product_code' => $navsaProductCode]
                        : ['description' => $description];

                    $existing = Product::where($matchKey)->first();
                    $wasDeleted = $existing && (bool) $existing->deleted;

                    // Never erase a known relationship because of one malformed/unmapped ERP row.
                    // Known official mappings still overwrite the old values normally.
                    if ($existing) {
                        if ($supplierId === null) {
                            $supplierId = $existing->supplier_id;
                        }
                        if ($categoryId === null) {
                            $categoryId = $existing->category_id;
                        }
                        if ($subCategoryId === null) {
                            $subCategoryId = $existing->sub_category_id;
                        }
                        if ($brandId === null) {
                            $brandId = $existing->brand_id;
                        }
                        if ($groupCode !== '' && !isset($storageMap[$groupCode]) && !empty($existing->storage_type)) {
                            $storageType = $existing->storage_type;
                        }
                    }

                    $effectiveObsolete = $obsoleteIdx !== null
                        ? $obsolete
                        : ($existing ? $existing->obsolete : null);

                    $obsoleteExpired = Product::isObsoleteDateExpired($effectiveObsolete);

                    // Special Price Rule:
                    // If PriceList != 'STD' and ToDate is a normal date (year != 9999),
                    // then the value in the Excel 'Price' column is the promotion_price!
                    $isNormalToDatePromoRow = ($priceListUpper !== '' && $priceListUpper !== 'STD') && ($toYear !== null && $toYear !== 9999);
                    if ($isNormalToDatePromoRow) {
                        if ($price !== null) {
                            $promotionPrice = $price;
                        }
                        if ($existing) {
                            $price = $existing->price;
                        }
                    }

                    $payload = [
                        'navsa_product_code'    => $navsaProductCode,
                        'supplier_id'           => $supplierId,
                        'category_id'           => $categoryId,
                        'sub_category_id'       => $subCategoryId,
                        'brand_id'              => $brandId,
                        'description'           => $description,
                        'units_of'              => $unitsOf ?: null,
                        'inner_case_quantity'   => $innerCase,
                        'outer_case_quantity'   => $outerCase,
                        'qty_desc'              => $qtyDesc ?: null,
                        'barcode_ean'           => $barcodeEan ?: null,
                        'barcode_case'          => $barcodeCase ?: null,
                        'group_desc'            => $groupDesc ?: null,
                        'storage_type'          => $storageType,
                        'layer_quantity'        => $layerQty,
                        'pallet_quantity'       => $palletQty,
                        'cost'                  => $cost,
                        'cost_from_date'        => $costFromDate,
                        'cost_to_date'          => $costToDate,
                        'weight'                => $weight,
                        'volume'                => $volume,
                        'shelf_life'            => $shelfLife,
                        'bbd'                   => $bbd,
                        'price_list'            => $priceList ?: null,
                        'promotion_price'       => $promotionPrice,
                        // ERP FromDate / ToDate belong to the ERP date fields only.
                        // Manual promotion dates are managed separately and are not overwritten by ERP import.
                        'from_date'             => $fromDate,
                        'to_date'               => $toDate,
                        'comm_code'             => $commCode ?: null,
                        'intra_country'         => $intraCountry ?: null,
                        'intra_type'            => $intraType ?: null,
                        'price'                 => $price,
                        'web_short_description' => $webShort ?: null,
                        'web_long_description'  => $webLong ?: null,
                        'web_image'             => $webImage ?: null,
                        'live_for_web'          => $obsoleteExpired ? 0 : $liveForWeb,

                        // The ERP file may restore an ordinary soft-deleted product,
                        // but a completed Obsolete date always wins.
                        'deleted'               => $obsoleteExpired,
                    ];

                    if ($vatCodeIdx !== null) {
                        $payload['vat_code'] = $vatCode;
                    }

                    if ($supplierIndexIdx !== null) {
                        $payload['primary_supplier_index'] = $supplierIndex !== '' ? $supplierIndex : null;
                    }

                    if ($supplierRefIdx !== null) {
                        $payload['supplier_reference'] = $supplierRef ?: null;
                    }

                    if ($obsoleteIdx !== null) {
                        $payload['obsolete'] = $obsolete;
                    }
                    
                    $payload['deleted']               = false;
                    

                    if ($isNormalToDatePromoRow && $promotionPrice !== null) {
                        $payload['is_offer'] = 1;
                        if (!empty($priceList)) {
                            $payload['offer_label'] = $priceList;
                        }
                    }

                    if ($hasOrderQtyAllowed && $orderQtyAllowedIdx !== null) {
                        $payload['order_qty_allowed'] = $orderQtyAllowed;
                    }

                    Product::updateOrCreate($matchKey, $payload);

                    if ($existing) {
                        $updatedCount++;
                        if ($wasDeleted) {
                            $restoredCount++;
                        }
                    } else {
                        $createdCount++;
                    }
                    $importedCount++;

                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("ERP Import row error: " . $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine());
                    $errorCount++;
                }
            }

            // Final safety pass; already-expired Obsolete dates are moved now.
            Product::expireObsoleteProducts();

            return response()->json([
                'success' => true,
                'message' => 'ERP Products imported successfully!',
                'total' => $total,
                'imported' => $importedCount,
                'created' => $createdCount,
                'updated' => $updatedCount,
                'restored' => $restoredCount,
                'skipped' => $skippedCount,
                'errors' => $errorCount,
                'unknown_group_codes' => $unknownCodes,
                'unknown_brands' => $unknownBrands
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process Excel file: ' . $e->getMessage()], 500);
        } finally {
            if (isset($tempFilePath) && file_exists($tempFilePath)) {
                @unlink($tempFilePath);
            }
        }
    }


    /**
     * Build lookup maps against the pre-loaded official brands table.
     *
     * Exact matches are preferred. A conservative normalised fallback is used only
     * when that normalised form identifies exactly one brand. Explicit GroupDesc
     * aliases (for example JACK -> JACK LINKS) are stored in brand_aliases.
     */
    private function buildBrandLookupMaps(): array
    {
        $exact = [];
        $normalisedBuckets = [];

        foreach (Brand::where('deleted', false)->where('status', 1)->select('id', 'brand_name')->get() as $brand) {
            $name = trim((string) $brand->brand_name);
            if ($name === '') {
                continue;
            }

            $exact[Str::lower($name)] = (int) $brand->id;

            $normalised = $this->normaliseBrandLookupKey($name);
            if ($normalised !== '') {
                $normalisedBuckets[$normalised] ??= [];
                $normalisedBuckets[$normalised][(int) $brand->id] = true;
            }
        }

        $normalisedUnique = [];
        foreach ($normalisedBuckets as $key => $ids) {
            if (count($ids) === 1) {
                $normalisedUnique[$key] = (int) array_key_first($ids);
            }
        }

        $aliases = [];
        if (
            \Illuminate\Support\Facades\Schema::hasTable('brand_aliases')
            && \Illuminate\Support\Facades\Schema::hasColumn('brand_aliases', 'alias_name')
            && \Illuminate\Support\Facades\Schema::hasColumn('brand_aliases', 'brand_id')
        ) {
            $rows = DB::table('brand_aliases')
                ->join('brands', 'brands.id', '=', 'brand_aliases.brand_id')
                ->where('brands.deleted', false)
                ->where('brands.status', 1)
                ->select('brand_aliases.alias_name', 'brand_aliases.brand_id')
                ->get();

            foreach ($rows as $row) {
                $key = $this->normaliseBrandLookupKey($row->alias_name);
                if ($key !== '') {
                    $aliases[$key] = (int) $row->brand_id;
                }
            }
        }

        return [
            'exact' => $exact,
            'normalised' => $normalisedUnique,
            'aliases' => $aliases,
        ];
    }

    private function resolveBrandId(?string $rawBrandName, array $maps): ?int
    {
        $name = trim((string) $rawBrandName);
        if ($name === '') {
            return null;
        }

        $normalised = $this->normaliseBrandLookupKey($name);

        // Explicit aliases take priority over generic matching.
        if ($normalised !== '' && isset($maps['aliases'][$normalised])) {
            return (int) $maps['aliases'][$normalised];
        }

        $exactKey = Str::lower($name);
        if (isset($maps['exact'][$exactKey])) {
            return (int) $maps['exact'][$exactKey];
        }

        if ($normalised !== '' && isset($maps['normalised'][$normalised])) {
            return (int) $maps['normalised'][$normalised];
        }

        return null;
    }

    private function normaliseBrandLookupKey(?string $value): string
    {
        $value = Str::ascii((string) ($value ?? ''));
        $value = strtoupper(trim($value));
        $value = str_replace('&', ' AND ', $value);
        $value = preg_replace('/[^A-Z0-9]+/', ' ', $value);
        return trim(preg_replace('/\s+/', ' ', (string) $value));
    }

    private function normalizeQtyDesc($value): ?string
    {
        $raw = trim((string) ($value ?? ''));

        if ($raw === '') {
            return null;
        }

        return match (strtolower($raw)) {
            'case'   => 'Case',
            'layer'  => 'Layer',
            'pallet' => 'Pallet',
            default  => $raw,
        };
    }

    private function normalizeOrderQtyAllowed($value): ?string
    {
        $raw = strtoupper(trim((string) ($value ?? '')));

        // Blank in Excel/admin means the NAVSA default:
        // Case disabled, Layer enabled, Pallet enabled.
        if ($raw === '') {
            return 'DEFAULT';
        }

        return in_array($raw, ['DEFAULT', 'PALLET', 'CASE'], true)
            ? $raw
            : null;
    }

    private function toBoolean01($value): int
    {
        if (is_bool($value)) {
            return $value ? 1 : 0;
        }

        if (is_numeric($value)) {
            return ((int) $value) === 1 ? 1 : 0;
        }

        $normalised = strtolower(trim((string) $value));

        return in_array($normalised, ['1', 'true', 'yes', 'y', 'live'], true) ? 1 : 0;
    }

    private function toNumberOrNull($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (is_numeric($value)) {
            return (float) $value;
        }
        $cleaned = preg_replace('/[^\d.\-]/', '', (string) $value);
        if ($cleaned === '' || !is_numeric($cleaned)) {
            return null;
        }
        return (float) $cleaned;
    }

    private function toDateOrNull($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }
        $str = trim((string) $value);
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $str)) {
            return $str;
        }
        if (is_numeric($value)) {
            try {
                return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }
        $timestamp = strtotime($str);
        return $timestamp ? date('Y-m-d', $timestamp) : null;
    }

    public function getRoles()
    {
        $roles = \Spatie\Permission\Models\Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function getPermissions()
    {
        $permissions = \Spatie\Permission\Models\Permission::all();
        return response()->json($permissions);
    }

    public function createRole(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = \Spatie\Permission\Models\Role::create([
            'name' => $request->name,
            'guard_name' => 'sanctum'
        ]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json(['message' => 'Role created successfully', 'role' => $role->load('permissions')]);
    }

    public function updateRolePermissions(Request $request, $id)
    {
        $request->validate([
            'permissions' => 'required|array'
        ]);

        $role = \Spatie\Permission\Models\Role::findOrFail($id);
        $role->syncPermissions($request->permissions);

        return response()->json(['message' => 'Role permissions updated successfully', 'role' => $role->load('permissions')]);
    }

    public function assignUserRoles(Request $request, $userId)
    {
        $request->validate([
            'roles' => 'required|array'
        ]);

        $user = User::findOrFail($userId);
        $user->syncRoles($request->roles);

        return response()->json([
            'message' => 'User roles updated successfully',
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name')
        ]);
    }

    public function orders(Request $request)
    {
        $query = Order::with(['user.customerDetail', 'items.product'])->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('company_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $perPage = (int) $request->input('per_page', 15);
        $orders = $query->paginate($perPage);

        $totalRevenue = (float) Order::whereIn('status', ['completed', 'delivered'])
            ->with('items')
            ->get()
            ->sum(function ($order) {
                $orderTotal = (float) ($order->total_amount ?? 0);
                if ($orderTotal > 0) {
                    return $orderTotal;
                }
                return (float) $order->items->sum('subtotal');
            });

        $stats = [
            'total_orders' => Order::count(),
            'processing_orders' => Order::whereIn('status', ['processing', 'pending'])->count(),
            'completed_orders' => Order::whereIn('status', ['completed', 'delivered'])->count(),
            'total_revenue' => $totalRevenue,
        ];

        return response()->json([
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }

    public function showOrder($id)
    {
        $order = Order::with(['user.customerDetail', 'items.product'])->findOrFail($id);
        return response()->json($order);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|string',
        ]);
        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load(['user', 'items.product']),
        ]);
    }

    // ==========================================
    // DATA IMPORT & EXPORT METHODS
    // ==========================================

    public function exportProducts(Request $request)
    {
        $type = $request->query('format', 'csv');
        $products = Product::with(['brand', 'category', 'subCategory', 'supplier'])->where('deleted', 0)->get();

        if ($type === 'json') {
            return response()->json($products);
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="navsa_products_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($products) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'NAVSA Product Code',
                'Description',
                'Brand',
                'Category',
                'SubCategory',
                'Unit Size',
                'Case Quantity',
                'Price Per Unit',
                'Price Per Case',
                'Stock Quantity',
                'Status',
                'Order Qty Allowed',
                'BBD'
            ]);

            foreach ($products as $p) {
                fputcsv($file, [
                    $p->navsa_product_code,
                    $p->description,
                    $p->brand ? $p->brand->brand_name : '',
                    $p->category ? $p->category->category_name : '',
                    $p->subCategory ? $p->subCategory->sub_category_name : '',
                    $p->unit_size,
                    $p->case_quantity,
                    $p->price_per_unit,
                    $p->price_per_case,
                    $p->stock,
                    $p->status ? 'Active' : 'Inactive',
                    $p->order_qty_allowed,
                    $p->bbd
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importProducts(Request $request)
    {
        $items = $request->input('items', []);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $ext = strtolower($file->getClientOriginalExtension());
            if ($ext === 'json') {
                $content = file_get_contents($file->getRealPath());
                $items = json_decode($content, true) ?? [];
            } else if (in_array($ext, ['csv', 'txt'])) {
                $handle = fopen($file->getRealPath(), 'r');
                $header = fgetcsv($handle);
                while (($row = fgetcsv($handle)) !== false) {
                    if (count($row) >= 2) {
                        $items[] = [
                            'navsa_product_code' => $row[0] ?? null,
                            'description'        => $row[1] ?? null,
                            'brand_name'         => $row[2] ?? null,
                            'category_name'      => $row[3] ?? null,
                            'sub_category_name'  => $row[4] ?? null,
                            'unit_size'          => $row[5] ?? null,
                            'case_quantity'      => $row[6] ?? 1,
                            'price_per_unit'     => $row[7] ?? 0,
                            'price_per_case'     => $row[8] ?? 0,
                            'stock'              => $row[9] ?? 0,
                        ];
                    }
                }
                fclose($handle);
            }
        }

        if (empty($items)) {
            return response()->json(['error' => 'No valid items found for import.'], 422);
        }

        $created = 0;
        $updated = 0;

        foreach ($items as $item) {
            $code = trim((string)($item['navsa_product_code'] ?? $item['reference'] ?? ''));
            $desc = trim((string)($item['description'] ?? ''));

            if (!$code && !$desc) continue;

            $brandId = null;
            if (!empty($item['brand_name'])) {
                $bName = trim($item['brand_name']);
                $brand = Brand::firstOrCreate(['brand_name' => $bName], ['status' => 1, 'deleted' => 0]);
                $brandId = $brand->id;
            } elseif (!empty($item['brand_id'])) {
                $brandId = $item['brand_id'];
            }

            $categoryId = null;
            if (!empty($item['category_name'])) {
                $cName = trim($item['category_name']);
                $cat = Category::firstOrCreate(['category_name' => $cName], ['status' => 1, 'deleted' => 0]);
                $categoryId = $cat->id;
            } elseif (!empty($item['category_id'])) {
                $categoryId = $item['category_id'];
            }

            $productData = [
                'description'       => $desc ?: $code,
                'brand_id'          => $brandId,
                'category_id'       => $categoryId,
                'unit_size'         => $item['unit_size'] ?? null,
                'case_quantity'     => (int)($item['case_quantity'] ?? 1),
                'price_per_unit'    => (float)($item['price_per_unit'] ?? 0),
                'price_per_case'    => (float)($item['price_per_case'] ?? 0),
                'stock'             => (int)($item['stock'] ?? 0),
                'status'            => isset($item['status']) ? ($item['status'] === 'Active' || $item['status'] == 1 ? 1 : 0) : 1,
                'deleted'           => 0,
            ];

            if ($code) {
                $existing = Product::where('navsa_product_code', $code)->first();
                if ($existing) {
                    $existing->update($productData);
                    $updated++;
                } else {
                    $productData['navsa_product_code'] = $code;
                    Product::create($productData);
                    $created++;
                }
            } else {
                Product::create($productData);
                $created++;
            }
        }

        return response()->json([
            'message' => 'Product import processed successfully.',
            'created' => $created,
            'updated' => $updated,
            'total'   => $created + $updated
        ]);
    }

    public function exportBrands(Request $request)
    {
        $brands = Brand::where('deleted', 0)->orderBy('brand_name')->get();
        if ($request->query('format') === 'json') {
            return response()->json($brands);
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="navsa_brands_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($brands) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Brand Name', 'Status']);
            foreach ($brands as $b) {
                fputcsv($file, [$b->id, $b->brand_name, $b->status ? 'Active' : 'Inactive']);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importBrands(Request $request)
    {
        $items = $request->input('items', []);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $ext = strtolower($file->getClientOriginalExtension());
            if ($ext === 'json') {
                $items = json_decode(file_get_contents($file->getRealPath()), true) ?? [];
            } else {
                $handle = fopen($file->getRealPath(), 'r');
                fgetcsv($handle);
                while (($row = fgetcsv($handle)) !== false) {
                    if (!empty($row[1])) {
                        $items[] = ['brand_name' => $row[1], 'status' => $row[2] ?? 1];
                    } elseif (!empty($row[0])) {
                        $items[] = ['brand_name' => $row[0]];
                    }
                }
                fclose($handle);
            }
        }

        $count = 0;
        foreach ($items as $item) {
            $name = trim($item['brand_name'] ?? '');
            if ($name) {
                Brand::updateOrCreate(
                    ['brand_name' => $name],
                    ['status' => 1, 'deleted' => 0]
                );
                $count++;
            }
        }

        return response()->json(['message' => "Successfully imported/updated {$count} brands."]);
    }

    public function exportCategories(Request $request)
    {
        $categories = Category::with('subCategories')->where('deleted', 0)->orderBy('category_name')->get();
        if ($request->query('format') === 'json') {
            return response()->json($categories);
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="navsa_categories_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($categories) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Category ID', 'Category Name', 'SubCategory Name', 'Group Code', 'Status']);
            foreach ($categories as $c) {
                if ($c->subCategories && count($c->subCategories) > 0) {
                    foreach ($c->subCategories as $sc) {
                        fputcsv($file, [$c->id, $c->category_name, $sc->sub_category_name, $sc->group_code ?? '', $sc->status ? 'Active' : 'Inactive']);
                    }
                } else {
                    fputcsv($file, [$c->id, $c->category_name, '', '', $c->status ? 'Active' : 'Inactive']);
                }
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importCategories(Request $request)
    {
        $items = $request->input('items', []);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $ext = strtolower($file->getClientOriginalExtension());
            if ($ext === 'json') {
                $items = json_decode(file_get_contents($file->getRealPath()), true) ?? [];
            } else {
                $handle = fopen($file->getRealPath(), 'r');
                fgetcsv($handle);
                while (($row = fgetcsv($handle)) !== false) {
                    if (!empty($row[1])) {
                        $items[] = [
                            'category_name'     => $row[1],
                            'sub_category_name' => $row[2] ?? null,
                            'group_code'        => $row[3] ?? null,
                        ];
                    }
                }
                fclose($handle);
            }
        }

        $count = 0;
        foreach ($items as $item) {
            $catName = trim($item['category_name'] ?? '');
            if (!$catName) continue;

            $cat = Category::firstOrCreate(['category_name' => $catName], ['status' => 1, 'deleted' => 0]);
            $count++;

            if (!empty($item['sub_category_name'])) {
                $subName = trim($item['sub_category_name']);
                SubCategory::firstOrCreate([
                    'category_id' => $cat->id,
                    'sub_category_name' => $subName,
                ], [
                    'group_code' => $item['group_code'] ?? null,
                    'status' => 1,
                    'deleted' => 0
                ]);
            }
        }

        return response()->json(['message' => "Successfully imported {$count} category records."]);
    }

    public function exportFullBackup(Request $request)
    {
        $data = [
            'exported_at' => now()->toIso8601String(),
            'products'   => Product::where('deleted', 0)->get(),
            'brands'     => Brand::where('deleted', 0)->get(),
            'categories' => Category::with('subCategories')->where('deleted', 0)->get(),
            'banners'    => HomeBanner::all(),
            'pdfs'       => Pdf::all(),
        ];

        return response()->json($data, 200, [
            'Content-Disposition' => 'attachment; filename="navsa_full_backup_' . date('Y-m-d_H-i') . '.json"',
        ]);
    }

    public function importFullRestore(Request $request)
    {
        $content = null;
        if ($request->hasFile('file')) {
            $content = file_get_contents($request->file('file')->getRealPath());
        } elseif ($request->filled('json_data')) {
            $content = $request->input('json_data');
        }

        if (!$content) {
            return response()->json(['error' => 'No JSON restore data provided.'], 422);
        }

        $backup = json_decode($content, true);
        if (!$backup || !is_array($backup)) {
            return response()->json(['error' => 'Invalid JSON structure.'], 422);
        }

        $restored = [
            'brands'     => 0,
            'categories' => 0,
            'products'   => 0,
        ];

        if (!empty($backup['brands'])) {
            foreach ($backup['brands'] as $b) {
                if (!empty($b['brand_name'])) {
                    Brand::updateOrCreate(
                        ['brand_name' => $b['brand_name']],
                        ['status' => $b['status'] ?? 1, 'deleted' => 0]
                    );
                    $restored['brands']++;
                }
            }
        }

        if (!empty($backup['categories'])) {
            foreach ($backup['categories'] as $c) {
                if (!empty($c['category_name'])) {
                    $cat = Category::updateOrCreate(
                        ['category_name' => $c['category_name']],
                        ['status' => $c['status'] ?? 1, 'deleted' => 0]
                    );
                    $restored['categories']++;

                    if (!empty($c['sub_categories'])) {
                        foreach ($c['sub_categories'] as $sc) {
                            if (!empty($sc['sub_category_name'])) {
                                SubCategory::updateOrCreate([
                                    'category_id' => $cat->id,
                                    'sub_category_name' => $sc['sub_category_name']
                                ], [
                                    'group_code' => $sc['group_code'] ?? null,
                                    'status' => $sc['status'] ?? 1,
                                    'deleted' => 0
                                ]);
                            }
                        }
                    }
                }
            }
        }

        if (!empty($backup['products'])) {
            foreach ($backup['products'] as $p) {
                $code = $p['navsa_product_code'] ?? null;
                $desc = $p['description'] ?? null;
                if ($code || $desc) {
                    Product::updateOrCreate(
                        ['navsa_product_code' => $code],
                        [
                            'description'    => $desc ?: $code,
                            'unit_size'      => $p['unit_size'] ?? null,
                            'case_quantity'  => $p['case_quantity'] ?? 1,
                            'price_per_unit' => $p['price_per_unit'] ?? 0,
                            'price_per_case' => $p['price_per_case'] ?? 0,
                            'stock'          => $p['stock'] ?? 0,
                            'status'         => $p['status'] ?? 1,
                            'deleted'        => 0
                        ]
                    );
                    $restored['products']++;
                }
            }
        }

        return response()->json([
            'message' => 'Full catalogue restore completed successfully.',
            'restored' => $restored
        ]);
    }
}