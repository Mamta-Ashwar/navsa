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
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'total_items')) {
                    $table->integer('total_items')->default(0)->after('total_amount');
                }
                if (!Schema::hasColumn('orders', 'total_weight_kg')) {
                    $table->decimal('total_weight_kg', 10, 2)->nullable()->after('total_items');
                }
                if (!Schema::hasColumn('orders', 'total_volume_m3')) {
                    $table->decimal('total_volume_m3', 10, 2)->nullable()->after('total_weight_kg');
                }
                if (!Schema::hasColumn('orders', 'shipping_method')) {
                    $table->string('shipping_method')->nullable()->after('total_volume_m3');
                }
                if (!Schema::hasColumn('orders', 'shipping_address')) {
                    $table->text('shipping_address')->nullable()->after('shipping_method');
                }
                if (!Schema::hasColumn('orders', 'notes')) {
                    $table->text('notes')->nullable()->after('shipping_address');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $columns = ['total_items', 'total_weight_kg', 'total_volume_m3', 'shipping_method', 'shipping_address', 'notes'];
                foreach ($columns as $col) {
                    if (Schema::hasColumn('orders', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};
