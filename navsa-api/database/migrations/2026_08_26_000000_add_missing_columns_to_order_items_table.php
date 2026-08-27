<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (!Schema::hasColumn('order_items', 'case_quantity')) {
                    $table->integer('case_quantity')->default(1)->after('unit_price');
                }
                if (!Schema::hasColumn('order_items', 'units_per_case')) {
                    $table->integer('units_per_case')->default(1)->after('case_quantity');
                }
            });

            // Backfill case_quantity from quantity for any existing records if needed
            if (Schema::hasColumn('order_items', 'quantity') && Schema::hasColumn('order_items', 'case_quantity')) {
                DB::statement('UPDATE order_items SET case_quantity = quantity WHERE case_quantity IS NULL OR case_quantity = 0 OR case_quantity = 1');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                $columns = ['case_quantity', 'units_per_case'];
                foreach ($columns as $col) {
                    if (Schema::hasColumn('order_items', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};
