<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'region',
        'country',
        'position',
        'company_registration_number',
        'vat_number',
        'customer_group',
        'trading_years',
        'business_nature',
        'website',
        'director_name',
        'currency',
        'registered_phone',
        'mobile',
        'whatsapp_offers_phone',
        'whatsapp_offers_opt_in',
        'address_line_1',
        'address_line_2',
        'city',
        'province',
        'zip_code',
        'account_name',
        'account_email',
        'other_wholesalers',
        'average_order_value',
        'turnover',
        'import_full_containers',
        'brands_interested',
        'categories_interested',
        'eori_number',
        'same_as_billing',
        'shipping_address_line_1',
        'shipping_address_line_2',
        'shipping_city',
        'shipping_province',
        'shipping_zip_code',
        'shipping_country',
        'shipping_telephone',
    ];

    protected $casts = [
        'categories_interested' => 'array',
        'same_as_billing' => 'boolean',
        'whatsapp_offers_opt_in' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}