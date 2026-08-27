<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'total_amount',
        'total_items',
        'total_weight_kg',
        'total_volume_m3',
        'customer_country',
        'vat_applied',
        'subtotal',
        'vat_total',
        'grand_total',
        'deleted',
        'shipping_method',
        'shipping_address',
        'notes',
    ];

    protected $casts = [
        'vat_applied' => 'boolean',
        'deleted' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
