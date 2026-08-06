<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('products')) {
            if (!Schema::hasColumn('products', 'order_qty_allowed')) {
                Schema::table('products', function (Blueprint $table) {
                    $table->string('order_qty_allowed', 50)->nullable()->default('DEFAULT')->after('qty_desc');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('products')) {
            if (Schema::hasColumn('products', 'order_qty_allowed')) {
                Schema::table('products', function (Blueprint $table) {
                    $table->dropColumn('order_qty_allowed');
                });
            }
        }
    }
};
