<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $fillable = ['category_name', 'image_path', 'parent_id', 'status', 'deleted'];

    protected $casts = [
        'status' => 'boolean',
        'deleted' => 'boolean',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        $path = trim((string) ($this->image_path ?? ''));

        if ($path === '') {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $path) || str_starts_with($path, '/')) {
            // Existing images in React public/categories remain served by the site.
            return $path;
        }

        // New admin uploads use Laravel's public storage, exactly like banners.
        return url('/storage/' . ltrim($path, '/'));
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
}
