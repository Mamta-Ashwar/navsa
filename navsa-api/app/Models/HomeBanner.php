<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class HomeBanner extends Model
{
    protected $table = 'home_banners';

    protected $fillable = [
        'position',
        'brand_id',
        'image_path',
        'link_url',
        'button_text',
        'overlay_position',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'brand_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'brand_name',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $this->image_path) || str_starts_with($this->image_path, '/')) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    public function getBrandNameAttribute(): ?string
    {
        if ($this->relationLoaded('brand')) {
            return $this->brand?->brand_name;
        }

        return $this->brand()->value('brand_name');
    }
}