<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    private function applyManualImageOverrides($products): void
    {
        $collection = collect($products);
        $ids = $collection->pluck('id')->filter()->values()->all();

        if (empty($ids)) {
            return;
        }

        $manualImages = DB::table('product_images')
            ->whereIn('product_id', $ids)
            ->where('is_primary', 1)
            ->orderByDesc('id')
            ->get()
            ->unique('product_id')
            ->keyBy('product_id');

        foreach ($collection as $product) {
            $erpImage = $product->web_image;
            $manualImage = optional($manualImages->get($product->id))->image_name;

            $product->setAttribute('erp_web_image', $erpImage);
            $product->setAttribute('manual_web_image', $manualImage);
            $product->setAttribute('effective_web_image', $manualImage ?: $erpImage);

            // Existing React pages already render product.web_image from
            // /products/<filename>. Replace only the serialized/public value;
            // products.web_image in MySQL remains the ERP WebImage filename.
            if ($manualImage) {
                $product->setAttribute('web_image', $manualImage);
            }
        }
    }

    public function index(Request $request)
    {
        // Automatic lifecycle enforcement: no daily manual command required.
        Product::expireObsoleteProducts();

        $query = Product::with(['brand', 'category', 'subCategory', 'supplier'])
            ->where('deleted', false)
            ->where('live_for_web', 1);

        if ($request->filled('search')) {

            $search = trim($request->search);

            $query->where(function ($q) use ($search) {

                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('navsa_product_code', 'like', "%{$search}%")
                    ->orWhere('barcode_ean', 'like', "%{$search}%")
                    ->orWhere('group_desc', 'like', "%{$search}%")

                    ->orWhereHas('brand', function ($b) use ($search) {
                        $b->where('brand_name', 'like', "%{$search}%");
                    })

                    ->orWhereHas('category', function ($c) use ($search) {
                        $c->where('category_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('category')) {

            $category = trim($request->category);

            $query->whereHas('category', function ($q) use ($category) {
                $q->where('category_name', 'like', "%{$category}%");
            });
        }

        if ($request->filled('sub_category')) {

            $subCategory = trim($request->sub_category);

            $query->whereHas('subCategory', function ($q) use ($subCategory) {
                $q->where('sub_category_name', 'like', "%{$subCategory}%");
            });
        }

        if ($request->filled('brand')) {

            $brand = trim($request->brand);

            $query->whereHas('brand', function ($q) use ($brand) {
                $q->where('brand_name', 'like', "%{$brand}%");
            });
        }

        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('sub_category_id')) {
            $query->where('sub_category_id', $request->sub_category_id);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('is_offer')) {
            $query->where('is_offer', $request->is_offer);
        }

        if ($request->filled('is_new_arrival')) {
            $query->where('is_new_arrival', $request->is_new_arrival);
        }

        if ($request->filled('is_best_offer')) {
            $query->where('is_best_offer', $request->is_best_offer);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortBy = $request->get('sort_by', 'id');
        $order = strtolower($request->get('order', 'asc'));

        $allowedSorts = [
            'id',
            'price',
            'cost',
            'description',
            'navsa_product_code',
            'created_at'
        ];

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        if (!in_array($order, ['asc', 'desc'])) {
            $order = 'asc';
        }

        $query->orderBy($sortBy, $order);

        $products = $query->paginate(
            $request->get('per_page', 20)
        );

        $this->applyManualImageOverrides($products->getCollection());

        return response()->json($products);
    }

    public function show($id)
    {
        // Expire before returning a product so an overdue item can never be shown.
        Product::expireObsoleteProducts();

        $product = Product::with([
            'brand',
            'category',
            'subCategory',
            'supplier'
        ])
            ->where('deleted', false)
            ->where('live_for_web', 1)
            ->findOrFail($id);

        $this->applyManualImageOverrides(collect([$product]));

        return response()->json($product);
    }
}