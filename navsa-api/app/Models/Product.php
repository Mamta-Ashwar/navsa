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
        'primary_supplier_index',
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

        // Website promotion price
        'promotion_price',

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
        'promotion_price' => 'decimal:2',

        'cost_from_date' => 'date:Y-m-d',
        'cost_to_date' => 'date:Y-m-d',
        'from_date' => 'date:Y-m-d',
        'to_date' => 'date:Y-m-d',
        'obsolete' => 'date:Y-m-d',

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
    | Obsolete-date catalogue lifecycle
    |--------------------------------------------------------------------------
    |
    | NAVSA sells worldwide, so the ERP Obsolete date uses one neutral global
    | cut-off: UTC. The date itself remains valid through that UTC date.
    | Example: Obsolete = 2026-08-14 stays active on 14 Aug UTC and expires
    | from 2026-08-15 UTC onward.
    */

    public static function obsoleteTodayUtc(): string
    {
        return Carbon::now('UTC')->toDateString();
    }

    public static function isObsoleteDateExpired($value): bool
    {
        if ($value === null || trim((string) $value) === '') {
            return false;
        }

        try {
            $date = $value instanceof \DateTimeInterface
                ? Carbon::instance($value)->utc()->startOfDay()
                : Carbon::parse((string) $value, 'UTC')->startOfDay();

            return $date->lt(Carbon::now('UTC')->startOfDay());
        } catch (\Throwable $e) {
            // Invalid legacy values are never auto-deleted. Imports validate
            // new Obsolete values before they reach the database.
            return false;
        }
    }

    public static function constrainToNonExpiredObsolete($query)
    {
        $today = static::obsoleteTodayUtc();

        return $query->where(function ($obsoleteQuery) use ($today) {
            $obsoleteQuery
                ->whereNull('obsolete')
                ->orWhere('obsolete', '')
                // Keep invalid legacy values visible rather than deleting them.
                ->orWhereRaw("obsolete NOT REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}'")
                ->orWhereRaw(
                    "STR_TO_DATE(SUBSTRING(obsolete, 1, 10), '%Y-%m-%d') >= ?",
                    [$today]
                );
        });
    }

    public static function expireObsoleteProducts(): int
    {
        $today = static::obsoleteTodayUtc();

        return static::query()
            ->whereNotNull('obsolete')
            ->where('obsolete', '<>', '')
            ->whereRaw("obsolete REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}'")
            ->whereRaw(
                "STR_TO_DATE(SUBSTRING(obsolete, 1, 10), '%Y-%m-%d') < ?",
                [$today]
            )
            ->where(function ($stateQuery) {
                $stateQuery
                    ->where('deleted', false)
                    ->orWhere('live_for_web', 1);
            })
            ->update([
                'deleted' => true,
                'live_for_web' => 0,
                'updated_at' => now(),
            ]);
    }

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

        return $this->price !== null
            ? (float) $this->price
            : null;
    }

    public function getEffectivePriceListAttribute(): string
    {
        $priceList = $this->normalisePriceList($this->price_list);

        if ($priceList === null || $priceList === 'STD') {
            return 'STD';
        }

        if ($this->isDatedPromotionType($priceList)) {
            return $this->promotion_active ? $priceList : 'STD';
        }

        // WIGIG and NEW remain active unless ERP FromDate / ToDate restrict them.
        if (in_array($priceList, ['WIGIG', 'NEW'], true)) {
            if ($this->from_date !== null || $this->to_date !== null) {
                return $this->promotion_active ? $priceList : 'STD';
            }

            return $priceList;
        }

        return 'STD';
    }

    public function getPromotionActiveAttribute(): bool
    {
        $priceList = $this->normalisePriceList($this->price_list);

        if ($priceList === null || $priceList === 'STD') {
            return false;
        }

        $today = Carbon::today();

        if ($this->from_date !== null && $today->lt($this->from_date)) {
            return false;
        }

        if ($this->to_date !== null && $today->gt($this->to_date)) {
            return false;
        }

        return true;
    }

    public function getPromotionExpiredAttribute(): bool
    {
        if ($this->to_date === null) {
            return false;
        }

        return Carbon::today()->gt($this->to_date);
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
            'MONTHLY PROMOTION' => $this->to_date
                ? [
                    'label' => 'Ends on',
                    'date' => $this->to_date->format('d M Y'),
                ]
                : null,

            'PRESELL' => $this->from_date
                ? [
                    'label' => 'Available from',
                    'date' => $this->from_date->format('d M Y'),
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