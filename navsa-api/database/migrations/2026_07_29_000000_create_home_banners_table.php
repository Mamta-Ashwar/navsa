<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_banners', function (Blueprint $table) {
            // The existing NAVSA brands.id column is a signed INT, not BIGINT.
            $table->integer('id', true);
            $table->enum('position', ['hero', 'middle', 'bottom']);
            $table->integer('brand_id')->nullable();
            $table->string('image_path', 500);
            $table->string('link_url', 2048)->nullable();
            $table->string('button_text', 80)->nullable();
            $table->enum('overlay_position', ['left', 'center', 'right'])->default('left');
            $table->unsignedInteger('sort_order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['position', 'sort_order'], 'home_banners_position_order_index');
            $table->index('brand_id', 'home_banners_brand_id_index');
            $table->foreign('brand_id', 'home_banners_brand_fk')
                ->references('id')
                ->on('brands')
                ->nullOnDelete();
        });

        $now = now();

        // Preserve the eight current homepage images only. Brand and link values
        // remain null so the administrator can choose any brand dynamically.
        DB::table('home_banners')->insert([
            ['position' => 'hero', 'brand_id' => null, 'image_path' => '/banners/hero-1.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 1, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'hero', 'brand_id' => null, 'image_path' => '/banners/hero-2.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 2, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'hero', 'brand_id' => null, 'image_path' => '/banners/hero-3.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 3, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'middle', 'brand_id' => null, 'image_path' => '/banners/middle-1.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 1, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'middle', 'brand_id' => null, 'image_path' => '/banners/middle-2.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 2, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'middle', 'brand_id' => null, 'image_path' => '/banners/middle-3.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 3, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'bottom', 'brand_id' => null, 'image_path' => '/banners/bottom-1.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 1, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['position' => 'bottom', 'brand_id' => null, 'image_path' => '/banners/bottom-2.jpg', 'link_url' => null, 'button_text' => null, 'overlay_position' => 'left', 'sort_order' => 2, 'is_active' => 1, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('home_banners');
    }
};