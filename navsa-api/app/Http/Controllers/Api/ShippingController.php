<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ShippingController extends Controller
{
    public function containers()
    {
        return DB::table('shipping_containers')
            ->where('active',1)
            ->orderBy('id')
            ->get();
    }

    public function countries()
    {
        return DB::table('shipping_countries as c')
            ->join('shipping_zones as z', 'z.id', '=', 'c.zone_id')
            ->where('c.active', 1)
            ->select(
                'c.id',
                'c.zone_id',
                'c.country_code',
                'c.country_name',
                'c.active',
                'z.zone_name',
                'z.minimum_order'
            )
            ->orderBy('c.country_name')
            ->get();
    }

    public function ports($countryId)
    {
        return DB::table('shipping_ports')
            ->where('country_id',$countryId)
            ->where('active',1)
            ->orderBy('port_name')
            ->get();
    }
}