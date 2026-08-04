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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    private function getAdminKey(): string
    {
        return env('ADMIN_API_KEY', 'navsa2024');
    }

    private function auth(Request $request): bool
    {
        $key = $request->header('X-Admin-Key') ?? $request->query('admin_key');
        return $key === $this->getAdminKey();
    }

    private function deny()
    {
        return response()->json(['error' => 'Unauthorized'], 401);
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

        if ($user->status !== 'approved') {
            return response()->json(['message' => 'Your account is pending approval by the admin.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

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

    // Registrations
    public function getRegistrations(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $registrations = User::with(['customerDetail', 'supplierDetail'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($registrations);
    }

    public function approveRegistration(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::findOrFail($id);
        if ($user->status !== 'pending') {
            return response()->json(['error' => 'User is not pending approval'], 400);
        }

        $user->status = 'approved';
        $user->approved_at = now();
        $user->save();

        return response()->json(['message' => 'Registration approved successfully', 'user' => $user]);
    }

    public function rejectRegistration(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();

        $user = User::findOrFail($id);
        if ($user->status !== 'pending') {
            return response()->json(['error' => 'User is not pending approval'], 400);
        }

        $user->status = 'rejected';
        $user->save();

        return response()->json(['message' => 'Registration rejected successfully', 'user' => $user]);
    }

    // ── Products ──────────────────────────────────────────────────────────────

    public function products(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $q = Product::with(['brand', 'category']);

        // Exclude hard-deleted by default unless asked
        if (!$request->filled('show_deleted')) {
            $q->where('deleted', false);
        }

        if ($request->filled('search')) {
            $s = trim($request->search);
            $q->where(function ($sub) use ($s) {
                $sub->where('description', 'like', '%' . $s . '%')
                    ->orWhere('reference', 'like', '%' . $s . '%')
                    ->orWhere('barcode_ean', 'like', '%' . $s . '%');
            });
        }
        if ($request->filled('brand_id'))     $q->where('brand_id', $request->brand_id);
        if ($request->filled('category_id'))  $q->where('category_id', $request->category_id);
        if ($request->filled('is_offer'))     $q->where('is_offer', $request->is_offer);
        if ($request->filled('live_for_web')) $q->where('live_for_web', $request->live_for_web);
        if ($request->filled('low_stock'))    $q->where('stock_quantity', '<=', 5);

        return $q->orderBy('id', 'desc')->paginate((int)$request->get('per_page', 25));
    }

    public function createProduct(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();

        $request->validate([
            'description'   => 'required|string|max:500',
            'brand_id'      => 'nullable|integer|exists:brands,id',
            'category_id'   => 'nullable|integer|exists:categories,id',
            'reference'     => 'nullable|string|max:100',
            'price'         => 'nullable|numeric|min:0',
            'price_list'    => 'nullable|numeric|min:0',
            'cost'          => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'barcode_ean'   => 'nullable|string|max:50',
            'barcode_case'  => 'nullable|string|max:50',
        ]);

        $allowed = [
            'reference', 'description', 'supplier_id', 'category_id', 'sub_category_id', 'brand_id',
            'units_of', 'inner_case_quantity', 'outer_case_quantity', 'qty_desc',
            'barcode_ean', 'barcode_case', 'group_desc', 'vat_code',
            'layer_quantity', 'pallet_quantity', 'supplier_reference',
            'cost', 'cost_from_date', 'cost_to_date', 'price_list', 'price', 'from_date', 'to_date',
            'weight', 'volume', 'shelf_life', 'bbd', 'comm_code', 'intra_country', 'intra_type',
            'web_short_description', 'web_long_description', 'web_image', 'live_for_web',
            'is_offer', 'offer_label', 'stock_quantity', 'is_best_offer', 'is_new_arrival',
        ];

        $product = Product::create($request->only($allowed));
        return response()->json($product->load(['brand', 'category']), 201);
    }

    public function updateProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);

        $request->validate([
            'description'   => 'sometimes|string|max:500',
            'brand_id'      => 'nullable|integer|exists:brands,id',
            'category_id'   => 'nullable|integer|exists:categories,id',
            'reference'     => 'nullable|string|max:100',
            'price'         => 'nullable|numeric|min:0',
            'price_list'    => 'nullable|numeric|min:0',
            'cost'          => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'barcode_ean'   => 'nullable|string|max:50',
            'barcode_case'  => 'nullable|string|max:50',
        ]);

        $allowed = [
            'reference', 'description', 'supplier_id', 'category_id', 'sub_category_id', 'brand_id',
            'units_of', 'inner_case_quantity', 'outer_case_quantity', 'qty_desc',
            'barcode_ean', 'barcode_case', 'group_desc', 'vat_code',
            'layer_quantity', 'pallet_quantity', 'supplier_reference',
            'cost', 'cost_from_date', 'cost_to_date', 'price_list', 'price', 'from_date', 'to_date',
            'weight', 'volume', 'shelf_life', 'bbd', 'comm_code', 'intra_country', 'intra_type',
            'web_short_description', 'web_long_description', 'web_image', 'live_for_web',
            'is_offer', 'offer_label', 'stock_quantity', 'is_best_offer', 'is_new_arrival',
        ];

        $product->update($request->only($allowed));
        return response()->json($product->fresh(['brand', 'category']));
    }

    public function toggleWeb(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $new = $product->live_for_web ? 0 : 1;
        $product->update(['live_for_web' => $new]);
        return response()->json(['id' => $id, 'live_for_web' => $new]);
    }

    public function toggleOffer(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $new = $product->is_offer ? 0 : 1;
        $data = ['is_offer' => $new];
        if ($request->filled('offer_label')) $data['offer_label'] = $request->offer_label;
        if (!$new) $data['offer_label'] = null; // Clear label when removing offer
        $product->update($data);
        return response()->json(['id' => $id, 'is_offer' => $new, 'offer_label' => $product->offer_label]);
    }

    public function clearOffers(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        Product::where('is_offer', 1)->update(['is_offer' => 0, 'offer_label' => null]);
        return response()->json(['success' => true]);
    }

    public function toggleBestOffer(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $new = $product->is_best_offer ? 0 : 1;
        $product->update(['is_best_offer' => $new]);
        return response()->json(['id' => $id, 'is_best_offer' => $new]);
    }

    public function toggleNewArrival(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $new = $product->is_new_arrival ? 0 : 1;
        $product->update(['is_new_arrival' => $new]);
        return response()->json(['id' => $id, 'is_new_arrival' => $new]);
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

    // Soft-delete a product (marks deleted=true)
    public function softDeleteProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update(['deleted' => true, 'live_for_web' => 0]);
        return response()->json(['id' => $id, 'deleted' => true]);
    }

    // Hard-delete a product (permanent)
    public function hardDeleteProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Product::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // Restore a soft-deleted product
    public function restoreProduct(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $product = Product::findOrFail($id);
        $product->update(['deleted' => false]);
        return response()->json(['id' => $id, 'deleted' => false]);
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    public function users(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $q = User::query();
        if ($request->filled('status')) $q->where('status', $request->status);
        if ($request->filled('search')) {
            $s = $request->search;
            $q->where(function ($sub) use ($s) {
                $sub->where('name', 'like', "%$s%")
                    ->orWhere('email', 'like', "%$s%")
                    ->orWhere('company_name', 'like', "%$s%");
            });
        }
        return $q->orderBy('created_at', 'desc')->paginate(25);
    }

    public function updateUser(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $user = User::findOrFail($id);
        $data = $request->only(['status', 'company_name', 'phone']);
        if (isset($data['status']) && $data['status'] === 'approved') {
            $data['approved_at'] = now();
        }
        $user->update($data);
        return response()->json($user->fresh());
    }

    public function deleteUser(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        User::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // ── Brands ────────────────────────────────────────────────────────────────

    public function brands(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $q = Brand::withCount('products');
        if (!$request->filled('show_deleted')) {
            $q->where(function ($sub) { $sub->where('deleted', false)->orWhereNull('deleted'); });
        }
        return $q->orderBy('brand_name')->get();
    }

    public function createBrand(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $brand = Brand::create(['brand_name' => trim($request->brand_name), 'status' => 1, 'deleted' => false]);
        return response()->json($brand->loadCount('products'), 201);
    }

    public function updateBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $brand = Brand::findOrFail($id);
        $brand->update($request->only(['brand_name', 'status']));
        return response()->json($brand->loadCount('products'));
    }

    public function softDeleteBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Brand::findOrFail($id)->update(['deleted' => true, 'status' => 0]);
        return response()->json(['id' => $id, 'deleted' => true]);
    }

    public function hardDeleteBrand(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Brand::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // ── Categories ────────────────────────────────────────────────────────────

    public function categories(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $q = Category::withCount('products');
        if (!$request->filled('show_deleted')) {
            $q->where(function ($sub) { $sub->where('deleted', false)->orWhereNull('deleted'); });
        }
        return $q->orderBy('category_name')->get();
    }

    public function createCategory(Request $request)
    {
        if (!$this->auth($request)) return $this->deny();
        $cat = Category::create(['category_name' => trim($request->category_name), 'status' => 1, 'deleted' => false]);
        return response()->json($cat->loadCount('products'), 201);
    }

    public function updateCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        $cat = Category::findOrFail($id);
        $cat->update($request->only(['category_name', 'status']));
        return response()->json($cat->loadCount('products'));
    }

    public function softDeleteCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Category::findOrFail($id)->update(['deleted' => true, 'status' => 0]);
        return response()->json(['id' => $id, 'deleted' => true]);
    }

    public function hardDeleteCategory(Request $request, $id)
    {
        if (!$this->auth($request)) return $this->deny();
        Category::findOrFail($id)->delete();
        return response()->json(['id' => $id, 'destroyed' => true]);
    }

    // ── PDFs ──────────────────────────────────────────────────────────────────

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
                ->limit(4)
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

        if (
            $validated['type'] === 'deal'
            && $isActive
            && Pdf::where('type', 'deal')->where('is_active', true)->count() >= 4
        ) {
            return response()->json([
                'error' => 'Only four deal PDFs can be active at the same time. Hide an existing deal first.',
            ], 422);
        }

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
        $nextActive = $request->has('is_active')
            ? $request->boolean('is_active')
            : (bool) $pdf->is_active;

        if (
            $nextType === 'deal'
            && $nextActive
            && (!$pdf->is_active || $pdf->type !== 'deal')
            && Pdf::where('type', 'deal')
                ->where('is_active', true)
                ->whereKeyNot($pdf->id)
                ->count() >= 4
        ) {
            return response()->json([
                'error' => 'Only four deal PDFs can be active at the same time. Hide an existing deal first.',
            ], 422);
        }

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

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:51200'
        ]);

        @set_time_limit(600);
        @ini_set('memory_limit', '1024M');

        $file = $request->file('file');
        $filePath = $file->getRealPath();

        try {
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($filePath);
            if (method_exists($reader, 'setReadDataOnly')) {
                $reader->setReadDataOnly(true);
            }
            $spreadsheet = $reader->load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, false);

            if (empty($rows)) {
                return response()->json(['error' => 'The uploaded file is empty.'], 422);
            }

            $headers = array_shift($rows);
            $total = count($rows);

            $importedCount = 0;
            $createdCount  = 0;
            $updatedCount  = 0;
            $skippedCount  = 0;
            $errorCount    = 0;
            $unknownCodes  = [];

            $suppliers = Supplier::pluck('id', 'id')->toArray();
            $brands    = Brand::pluck('id', 'brand_name')->toArray();

            $subCategoryMap = [];
            $hasGroupCode = \Illuminate\Support\Facades\Schema::hasColumn('sub_categories', 'group_code');
            $cols = $hasGroupCode ? ['id', 'group_code', 'category_id'] : ['id', 'sub_category_name', 'category_id'];

            foreach (SubCategory::select($cols)->get() as $sc) {
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

            $headerMap = [];
            foreach ($headers as $idx => $h) {
                $headerMap[trim((string)$h)] = $idx;
            }

            foreach ($rows as $rowIndex => $row) {
                try {
                    $refIdx   = $headerMap['Reference'] ?? ($headerMap['PrimarySupplierIndex'] ?? 1);
                    $descIdx  = $headerMap['Description'] ?? ($headerMap['WebShortDescription'] ?? 2);
                    $barIdx   = $headerMap['BarcodeEAN'] ?? 7;
                    $grpIdx   = $headerMap['GroupDesc'] ?? 9;
                    $priceIdx = $headerMap['Price'] ?? ($headerMap['Cost'] ?? 22);

                    $reference   = trim((string) ($row[$refIdx] ?? ''));
                    $description = trim((string) ($row[$descIdx] ?? ''));

                    if (empty($description) && empty($reference)) {
                        $skippedCount++;
                        continue;
                    }

                    $barcodeEan = trim((string) ($row[$barIdx] ?? ''));
                    $groupDesc  = trim((string) ($row[$grpIdx] ?? ''));
                    $price      = $this->toNumberOrNull($row[$priceIdx] ?? null);
                    $cost       = $this->toNumberOrNull($row[$headerMap['Cost'] ?? 14] ?? null);

                    $unitsOf    = trim((string) ($row[$headerMap['UnitsOf'] ?? 3] ?? ''));
                    $innerCase  = $this->toNumberOrNull($row[$headerMap['InnerCaseQuantity'] ?? 4] ?? null);
                    $outerCase  = $this->toNumberOrNull($row[$headerMap['OuterCaseQuantity'] ?? 5] ?? null);
                    $qtyDesc    = trim((string) ($row[$headerMap['QtyDesc'] ?? 6] ?? ''));
                    $barcodeCase= trim((string) ($row[$headerMap['BarcodeCase'] ?? 8] ?? ''));
                    $vatCode    = trim((string) ($row[$headerMap['VatCode'] ?? 10] ?? ''));
                    $layerQty   = $this->toNumberOrNull($row[$headerMap['LayerQuantity'] ?? 11] ?? null);
                    $palletQty  = $this->toNumberOrNull($row[$headerMap['PalletQuantity'] ?? 12] ?? null);
                    $supplierRef= trim((string) ($row[$headerMap['PrimarySupplierReference'] ?? 13] ?? ''));
                    $costFromDate= $this->toDateOrNull($row[$headerMap['CostFromDate'] ?? 15] ?? null);
                    $costToDate  = $this->toDateOrNull($row[$headerMap['CostToDate'] ?? 16] ?? null);
                    $weight     = $this->toNumberOrNull($row[$headerMap['Weight'] ?? 17] ?? null);
                    $volume     = $this->toNumberOrNull($row[$headerMap['Volume'] ?? 18] ?? null);
                    $shelfLife  = $this->toNumberOrNull($row[$headerMap['ShelfLife'] ?? 19] ?? null);
                    $bbd        = $this->toDateOrNull($row[$headerMap['BBD'] ?? 20] ?? null);
                    $priceList   = trim((string) ($row[$headerMap['PriceList'] ?? 21] ?? ''));
                    $fromDate    = $this->toDateOrNull($row[$headerMap['FromDate'] ?? 23] ?? null);
                    $toDate      = $this->toDateOrNull($row[$headerMap['ToDate'] ?? 24] ?? null);
                    $commCode   = trim((string) ($row[$headerMap['CommCode'] ?? 25] ?? ''));
                    $intraCountry= trim((string) ($row[$headerMap['IntraCountry'] ?? 26] ?? ''));
                    $webShort   = trim((string) ($row[$headerMap['WebShortDescription'] ?? 28] ?? ''));
                    $webLong    = trim((string) ($row[$headerMap['WebLongDescription'] ?? 29] ?? ''));
                    $webImage   = trim((string) ($row[$headerMap['WebImage'] ?? 30] ?? ''));
                    $liveForWeb = isset($headerMap['LiveForWeb']) && isset($row[$headerMap['LiveForWeb']]) ? (int)$row[$headerMap['LiveForWeb']] : 1;

                    $reference = !empty($reference) ? $reference : null;

                    $brandName     = null;
                    $categoryId    = null;
                    $subCategoryId = null;
                    $storageType   = 'Ambient';

                    if (!empty($groupDesc)) {
                        $cleanGroup = preg_replace('/\s+/', ' ', trim($groupDesc));

                        if (preg_match('/^\S+\s+(.+)$/', $cleanGroup, $matches)) {
                            $brandName = trim($matches[1]);
                        }

                        $groupCode = strtoupper(substr($cleanGroup, 0, 5));
                        $storageType = $storageMap[$groupCode] ?? 'Ambient';

                        if (isset($subCategoryMap[$groupCode])) {
                            $categoryId    = $subCategoryMap[$groupCode]['category_id'];
                            $subCategoryId = $subCategoryMap[$groupCode]['sub_category_id'];
                        } else {
                            $unknownCodes[$groupCode] = ($unknownCodes[$groupCode] ?? 0) + 1;
                        }
                    }

                    $brandId = null;
                    if (!empty($brandName)) {
                        if (!isset($brands[$brandName])) {
                            $brand = Brand::firstOrCreate(
                                ['brand_name' => $brandName],
                                ['status' => 1]
                            );
                            $brands[$brandName] = $brand->id;
                        }
                        $brandId = $brands[$brandName];
                    }

                    $matchKey = !empty($reference)
                        ? ['reference' => $reference]
                        : ['description' => $description];

                    $existing = Product::where($matchKey)->first();

                    Product::updateOrCreate(
                        $matchKey,
                        [
                            'reference'             => $reference,
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
                            'vat_code'              => $vatCode ?: null,
                            'layer_quantity'        => $layerQty,
                            'pallet_quantity'       => $palletQty,
                            'supplier_reference'    => $supplierRef ?: null,
                            'cost'                  => $cost,
                            'cost_from_date'        => $costFromDate,
                            'cost_to_date'          => $costToDate,
                            'weight'                => $weight,
                            'volume'                => $volume,
                            'shelf_life'            => $shelfLife,
                            'bbd'                   => $bbd,
                            'price_list'            => $priceList ?: null,
                            'from_date'             => $fromDate,
                            'to_date'               => $toDate,
                            'comm_code'             => $commCode ?: null,
                            'intra_country'         => $intraCountry ?: null,
                            'price'                 => $price,
                            'web_short_description' => $webShort ?: null,
                            'web_long_description'  => $webLong ?: null,
                            'web_image'             => $webImage ?: null,
                            'live_for_web'          => $liveForWeb ? 1 : 0,
                        ]
                    );

                    if ($existing) {
                        $updatedCount++;
                    } else {
                        $createdCount++;
                    }
                    $importedCount++;

                } catch (\Exception $e) {
                    $errorCount++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'ERP Products imported successfully!',
                'total' => $total,
                'imported' => $importedCount,
                'created' => $createdCount,
                'updated' => $updatedCount,
                'skipped' => $skippedCount,
                'errors' => $errorCount,
                'unknown_group_codes' => $unknownCodes
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process Excel file: ' . $e->getMessage()], 500);
        }
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
        if (is_numeric($value)) {
            try {
                return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }
        $timestamp = strtotime((string) $value);
        return $timestamp ? date('Y-m-d', $timestamp) : null;
    }
}