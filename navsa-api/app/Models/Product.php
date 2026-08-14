<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        // Core identifiers
        'navsa_product_code',
        'description',
        'supplier_id',
        'category_id',
        'sub_category_id',
        'brand_id',

        // Quantities / units
        'units_of',
        'inner_case_quantity',
        'outer_case_quantity',
        'qty_desc',
        'order_qty_allowed',

        // Barcodes
        'barcode_ean',
        'barcode_case',

        // Classification
        'group_desc',
        'vat_code',

        // Pallet / logistics
        'layer_quantity',
        'pallet_quantity',
        'supplier_reference',
        'storage_type',

        // ERP pricing
        'cost',
        'cost_from_date',
        'cost_to_date',
        'price_list',
        'price',
        'from_date',
        'to_date',

        // Manual website pricing
        'manual_price_list',
        'manual_standard_price',
        'promotion_price',
        'promotion_start_date',
        'promotion_finish_date',

        // Import tracking
        'last_erp_import_at',
        'last_manual_import_at',

        // Physical attributes
        'weight',
        'volume',
        'shelf_life',
        'bbd',

        // Trade / customs
        'comm_code',
        'intra_country',
        'intra_type',

        // Web-specific
        'web_short_description',
        'web_long_description',
        'web_image',
        'live_for_web',
        'encore_image',
        'obsolete',

        // Existing admin-managed fields
        'is_offer',
        'offer_label',
        'stock_quantity',
        'deleted',
        'is_best_offer',
        'is_new_arrival',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
        'manual_standard_price' => 'decimal:2',
        'promotion_price' => 'decimal:2',

        'cost_from_date' => 'date:Y-m-d',
        'cost_to_date' => 'date:Y-m-d',
        'from_date' => 'date:Y-m-d',
        'to_date' => 'date:Y-m-d',
        'promotion_start_date' => 'date:Y-m-d',
        'promotion_finish_date' => 'date:Y-m-d',

        'last_erp_import_at' => 'datetime',
        'last_manual_import_at' => 'datetime',

        'live_for_web' => 'boolean',
        'deleted' => 'boolean',
        'is_offer' => 'boolean',
        'is_best_offer' => 'boolean',
        'is_new_arrival' => 'boolean',
    ];

    protected $appends = [
        'effective_price',
        'effective_price_list',
        'promotion_active',
        'promotion_expired',
        'product_banner',
        'promotion_display_date',
        'order_quantity_options',
        'order_qty_allowed',
    ];

    /*
    |--------------------------------------------------------------------------
    | Pricing accessors
    |--------------------------------------------------------------------------
    */

    public function getEffectivePriceAttribute(): ?float
    {
        if ($this->promotion_active && $this->promotion_price !== null) {
            return (float) $this->promotion_price;
        }

        if ($this->manual_standard_price !== null) {
            return (float) $this->manual_standard_price;
        }

        return $this->price !== null
            ? (float) $this->price
            : null;
    }

    public function getEffectivePriceListAttribute(): string
    {
        $manualType = $this->normalisePriceList($this->manual_price_list);

        if ($manualType === null || $manualType === 'STD') {
            return 'STD';
        }

        if ($this->isDatedPromotionType($manualType)) {
            return $this->promotion_active ? $manualType : 'STD';
        }

        // WIGIG and NEW remain active until manually changed,
        // unless dates were supplied.
        if (in_array($manualType, ['WIGIG', 'NEW'], true)) {
            if (
                $this->promotion_start_date !== null ||
                $this->promotion_finish_date !== null
            ) {
                return $this->promotion_active ? $manualType : 'STD';
            }

            return $manualType;
        }

        return 'STD';
    }

    public function getPromotionActiveAttribute(): bool
    {
        $manualType = $this->normalisePriceList($this->manual_price_list);

        if ($manualType === null || $manualType === 'STD') {
            return false;
        }

        $today = Carbon::today();

        if (
            $this->promotion_start_date !== null &&
            $today->lt($this->promotion_start_date)
        ) {
            return false;
        }

        if (
            $this->promotion_finish_date !== null &&
            $today->gt($this->promotion_finish_date)
        ) {
            return false;
        }

        return true;
    }

    public function getPromotionExpiredAttribute(): bool
    {
        if ($this->promotion_finish_date === null) {
            return false;
        }

        return Carbon::today()->gt($this->promotion_finish_date);
    }

    public function getProductBannerAttribute(): ?string
    {
        return match ($this->effective_price_list) {
            'EDLP' => 'Every Day Low Price',
            'MONTHLY PROMOTION' => 'Monthly Promotion',
            'CLEARANCE' => 'Clearance',
            'WIGIG' => 'WIGIG',
            'NEW' => 'New',
            'PRESELL' => 'Presell',
            default => null,
        };
    }

    public function getPromotionDisplayDateAttribute(): ?array
    {
        if (!$this->promotion_active) {
            return null;
        }

        return match ($this->effective_price_list) {
            'MONTHLY PROMOTION' => $this->promotion_finish_date
                ? [
                    'label' => 'Ends on',
                    'date' => $this->promotion_finish_date->format('d M Y'),
                ]
                : null,

            'PRESELL' => $this->promotion_start_date
                ? [
                    'label' => 'Available from',
                    'date' => $this->promotion_start_date->format('d M Y'),
                ]
                : null,

            default => null,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Order quantity logic
    |--------------------------------------------------------------------------
    */

    public function getOrderQuantityOptionsAttribute(): array
    {
        $rule = $this->getOrderQtyAllowedAttribute();

        return [
            'case' => [
                'enabled' => $rule === 'CASE',
                'quantity' => $this->outer_case_quantity,
            ],

            'layer' => [
                'enabled' => in_array($rule, ['DEFAULT', 'CASE'], true),
                'quantity' => $this->layer_quantity,
            ],

            'pallet' => [
                'enabled' => true,
                'quantity' => $this->pallet_quantity,
            ],
        ];
    }

    public function getOrderQtyAllowedAttribute(): string
    {
        $val = strtoupper(trim((string) ($this->attributes['order_qty_allowed'] ?? 'DEFAULT')));

        if (in_array($val, ['CASE', 'PALLET', 'DEFAULT'], true)) {
            return $val;
        }

        return 'DEFAULT';
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    private function normalisePriceList(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return strtoupper(trim($value));
    }

    private function isDatedPromotionType(string $type): bool
    {
        return in_array(
            $type,
            [
                'EDLP',
                'MONTHLY PROMOTION',
                'CLEARANCE',
                'PRESELL',
            ],
            true
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}