<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\CustomerDetail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Get logged-in user profile with details
     */
    public function getProfile(Request $request)
    {
        $userId = $request->query('user_id');
        $email = $request->query('email');

        $user = null;

        if ($userId) {
            $user = User::with(['customerDetail', 'supplierDetail'])->find($userId);
        } elseif ($email) {
            $user = User::with(['customerDetail', 'supplierDetail'])->where('email', $email)->first();
        }

        if (!$user && $request->user()) {
            $user = User::with(['customerDetail', 'supplierDetail'])->find($request->user()->id);
        }

        if (!$user) {
            return response()->json(['message' => 'User profile not found.'], 404);
        }

        return response()->json([
            'user' => $user,
            'customer_detail' => $user->customerDetail,
            'supplier_detail' => $user->supplierDetail,
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $userId = $request->input('user_id') ?? $request->user()?->id;
        $email = $request->input('email');

        $user = null;
        if ($userId) {
            $user = User::find($userId);
        } elseif ($email) {
            $user = User::where('email', $email)->first();
        }

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:100',
            'company_name' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            if (!empty($validated['name'])) {
                $user->name = $validated['name'];
            }
            if (!empty($validated['phone'])) {
                $user->phone = $validated['phone'];
                $customerDetail->mobile = $validated['phone'];
            }
            if (!empty($validated['address_line_1'])) $customerDetail->address_line_1 = $validated['address_line_1'];
            if (!empty($validated['address_line_2'])) $customerDetail->address_line_2 = $validated['address_line_2'];
            if (!empty($validated['city'])) $customerDetail->city = $validated['city'];
            if (!empty($validated['province'])) $customerDetail->province = $validated['province'];
            if (!empty($validated['zip_code'])) $customerDetail->zip_code = $validated['zip_code'];
            if (!empty($validated['country'])) $customerDetail->country = $validated['country'];
            $customerDetail->save();

            DB::commit();

            return response()->json([
                'message' => 'Profile updated successfully!',
                'user' => $user->fresh(['customerDetail', 'supplierDetail']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Profile Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update profile.'], 500);
        }
    }

    /**
     * Get order history for user
     */
    public function getOrders(Request $request)
    {
        $userId = $request->query('user_id');
        $email = $request->query('email');

        $user = null;
        if ($userId) {
            $user = User::find($userId);
        } elseif ($email) {
            $user = User::where('email', $email)->first();
        }

        if (!$user && $request->user()) {
            $user = $request->user();
        }

        if (!$user) {
            return response()->json([], 200);
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Create new order
     */
    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'items' => 'required|array|min:1',
            'total_amount' => 'required|numeric',
            'shipping_method' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $orderNumber = 'NAV-' . strtoupper(uniqid());

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $validated['user_id'],
                'status' => 'processing',
                'total_amount' => $validated['total_amount'],
                'total_items' => count($validated['items']),
                'shipping_method' => $validated['shipping_method'] ?? 'Standard Delivery',
                'shipping_address' => $validated['shipping_address'] ?? '',
                'notes' => $validated['notes'] ?? '',
            ]);

            foreach ($validated['items'] as $item) {
                $unitPrice = (float) ($item['price'] ?? $item['unit_price'] ?? 0);
                $givenSubtotal = isset($item['subtotal']) ? (float) $item['subtotal'] : 0;
                $cases = (int) ($item['case_quantity'] ?? $item['quantity'] ?? 0);

                if ($cases <= 0) {
                    if ($givenSubtotal > 0 && $unitPrice > 0) {
                        $cases = (int) round($givenSubtotal / $unitPrice);
                    } else {
                        $cases = 1;
                    }
                }

                $subtotal = $givenSubtotal > 0 ? $givenSubtotal : ($unitPrice * $cases);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'] ?? $item['id'] ?? null,
                    'navsa_product_code' => $item['navsa_product_code'] ?? $item['reference'] ?? null,
                    'product_name' => $item['product_name'] ?? $item['description'] ?? 'Product',
                    'unit_price' => $unitPrice,
                    'case_quantity' => $cases,
                    'units_per_case' => $item['units_per_case'] ?? 1,
                    'subtotal' => $subtotal,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully!',
                'order' => $order->load('items.product'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Create Order Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create order.'], 500);
        }
    }

    /**
     * Reorder past order with updated current prices
     */
    public function reorder(Request $request, $id)
    {
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        $reorderItems = [];

        foreach ($order->items as $item) {
            // Find latest current product data in database
            $product = null;
            if ($item->product_id) {
                $product = Product::find($item->product_id);
            }
            if (!$product && $item->navsa_product_code) {
                $product = Product::where('navsa_product_code', $item->navsa_product_code)->first();
            }

            // Price priority: current database product price > item price
            $currentPrice = $product ? (float) $product->price : (float) $item->unit_price;

            $reorderItems[] = [
                'id' => $product ? $product->id : $item->product_id,
                'navsa_product_code' => $product ? $product->navsa_product_code : $item->navsa_product_code,
                'description' => $product ? $product->description : $item->product_name,
                'price' => $currentPrice,
                'old_order_price' => (float) $item->unit_price,
                'case_quantity' => $item->case_quantity,
                'units_per_case' => $product ? ($product->unit_per_case ?? $item->units_per_case) : $item->units_per_case,
                'web_image' => $product ? $product->web_image : null,
                'brand_name' => $product ? $product->brand_name : '',
                'storage_type' => $product ? $product->storage_type : 'Ambient',
            ];
        }

        return response()->json([
            'message' => 'Order items retrieved with current pricing!',
            'items' => $reorderItems,
        ]);
    }
}
