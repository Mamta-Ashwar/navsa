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
            ->where('deleted', 0)
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
            'user_id' => 'required|integer|exists:users,id',
            'items' => 'required|array|min:1',
            'total_amount' => 'required|numeric',
            'shipping_method' => 'nullable|string',
            'shipping_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $customerDetail = CustomerDetail::where('user_id', $validated['user_id'])->first();
            $registeredCountry = trim((string) ($customerDetail?->country ?? ''));
            $normalizedCountry = strtolower(preg_replace('/\\s+/', ' ', $registeredCountry));
            $isUkCustomer = in_array($normalizedCountry, [
                'united kingdom', 'uk', 'u k', 'great britain', 'gb', 'gbr'
            ], true);

            $vatMap = DB::table('vat_codes')
                ->where('active', 1)
                ->get()
                ->keyBy(fn ($row) => strtoupper(trim((string) $row->code)));

            $orderNumber = 'NAV-' . strtoupper(uniqid());

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $validated['user_id'],
                'status' => 'processing',
                'total_amount' => 0,
                'total_items' => count($validated['items']),
                'total_weight_kg' => 0,
                'total_volume_m3' => 0,
                'customer_country' => $registeredCountry ?: null,
                'vat_applied' => $isUkCustomer ? 1 : 0,
                'subtotal' => 0,
                'vat_total' => 0,
                'grand_total' => 0,
                'deleted' => 0,
                'shipping_method' => $validated['shipping_method'] ?? 'Standard Delivery',
                'shipping_address' => $validated['shipping_address'] ?? '',
                'notes' => $validated['notes'] ?? '',
            ]);

            $netSubtotal = 0.0;
            $vatTotal = 0.0;
            $totalWeightKg = 0.0;
            $totalVolumeM3 = 0.0;

            foreach ($validated['items'] as $item) {
                $productId = $item['product_id'] ?? $item['id'] ?? null;
                $product = $productId ? Product::find($productId) : null;

                if (!$product && !empty($item['navsa_product_code'])) {
                    $product = Product::where('navsa_product_code', $item['navsa_product_code'])->first();
                }

                if (!$product) {
                    throw new \RuntimeException('One of the basket products could not be found in the current catalogue. Please refresh your basket and try again.');
                }

                $cases = (int) ($item['case_quantity'] ?? $item['quantity'] ?? 0);
                if ($cases <= 0) {
                    $cases = 1;
                }

                $unitPrice = (float) ($product->effective_price ?? $product->price ?? 0);
                if ($unitPrice < 0) {
                    $unitPrice = 0;
                }

                $unitsPerCase = (int) (
                    $product->units_of
                    ?? $product->inner_case_quantity
                    ?? $item['units_per_case']
                    ?? 1
                );
                if ($unitsPerCase <= 0) {
                    $unitsPerCase = 1;
                }

                $lineNet = round($unitPrice * $cases, 2);
                $vatCode = strtoupper(trim((string) ($product->vat_code ?? '')));
                $vatRate = 0.0;

                if ($isUkCustomer) {
                    if ($vatCode === '' || !$vatMap->has($vatCode)) {
                        throw new \RuntimeException(
                            'VAT configuration is missing for product ' . $product->navsa_product_code . '. Please contact NAVSA before placing this UK order.'
                        );
                    }

                    $vatRow = $vatMap->get($vatCode);
                    $vatRate = (bool) $vatRow->charge_for_uk ? (float) $vatRow->percentage : 0.0;
                }

                $vatAmount = $isUkCustomer ? round($lineNet * $vatRate / 100, 2) : 0.0;
                $lineTotal = round($lineNet + $vatAmount, 2);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'navsa_product_code' => $product->navsa_product_code,
                    'product_name' => $product->description ?: ($item['product_name'] ?? 'Product'),
                    'quantity' => $cases,
                    'qty_desc' => 'Case',
                    'unit_price' => $unitPrice,
                    'case_quantity' => $cases,
                    'units_per_case' => $unitsPerCase,
                    'subtotal' => $lineNet,
                    'vat_code' => $vatCode ?: null,
                    'vat_rate' => $isUkCustomer ? $vatRate : 0,
                    'vat_amount' => $vatAmount,
                    'line_total' => $lineTotal,
                ]);

                $netSubtotal += $lineNet;
                $vatTotal += $vatAmount;
                $totalWeightKg += (float) ($product->weight ?? 0) * $unitsPerCase * $cases;
                $totalVolumeM3 += (float) ($product->volume ?? 0) * $cases;
            }

            $netSubtotal = round($netSubtotal, 2);
            $vatTotal = round($vatTotal, 2);
            $grandTotal = round($netSubtotal + $vatTotal, 2);

            $order->update([
                'subtotal' => $netSubtotal,
                'vat_total' => $isUkCustomer ? $vatTotal : 0,
                'grand_total' => $grandTotal,
                'total_amount' => $grandTotal,
                'total_weight_kg' => round($totalWeightKg, 3),
                'total_volume_m3' => round($totalVolumeM3, 3),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully!',
                'order' => $order->fresh()->load('items.product'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Create Order Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Reorder past order with updated current prices
     */
    public function reorder(Request $request, $id)
    {
        $order = Order::with('items')->where('deleted', 0)->find($id);

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
                'units_per_case' => $product
                    ? ((int) ($product->units_of ?? $product->inner_case_quantity ?? $item->units_per_case ?? 1))
                    : ((int) ($item->units_per_case ?? 1)),
                'web_image' => $product ? $product->web_image : null,
                'brand_name' => $product ? $product->brand_name : '',
                'storage_type' => $product ? $product->storage_type : 'Ambient',
                'vat_code' => $product ? $product->vat_code : $item->vat_code,
                'vat_rate' => $product && $product->vat_code
                    ? (float) (DB::table('vat_codes')
                        ->where('active', 1)
                        ->where('code', strtoupper(trim((string) $product->vat_code)))
                        ->where('charge_for_uk', 1)
                        ->value('percentage') ?? 0)
                    : (float) ($item->vat_rate ?? 0),
                'vat_charge_for_uk' => $product && $product->vat_code
                    ? (bool) (DB::table('vat_codes')
                        ->where('active', 1)
                        ->where('code', strtoupper(trim((string) $product->vat_code)))
                        ->value('charge_for_uk') ?? 0)
                    : ((float) ($item->vat_rate ?? 0) > 0),
            ];
        }

        return response()->json([
            'message' => 'Order items retrieved with current pricing!',
            'items' => $reorderItems,
        ]);
    }
}
