<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Pdf extends Model
{
    protected $fillable = [
        'title',
        'file_path',
        'type',
        'badge',
        'valid_from',
        'valid_to',
        'validity_text',
        'description',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'valid_from' => 'date:Y-m-d',
        'valid_to' => 'date:Y-m-d',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'file_url',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        return Storage::disk('public')->url($this->file_path);
    }
}
