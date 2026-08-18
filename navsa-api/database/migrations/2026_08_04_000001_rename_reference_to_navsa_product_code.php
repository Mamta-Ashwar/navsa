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
        if (Schema::hasTable('products')) {
            if (Schema::hasColumn('products', 'reference') && !Schema::hasColumn('products', 'navsa_product_code')) {
                DB::statement("UPDATE products SET reference = CONCAT('PROD-', id) WHERE reference IS NULL OR reference = ''");
                try {
                    DB::statement("ALTER TABLE products CHANGE reference navsa_product_code VARCHAR(100) NOT NULL");
                } catch (\Throwable $e) {
                }
            }

            if (Schema::hasColumn('products', 'navsa_product_code')) {
                try {
                    DB::statement("ALTER TABLE products MODIFY navsa_product_code VARCHAR(100) NOT NULL");
                } catch (\Throwable $e) {
                }
            }
        }

        if (Schema::hasTable('erp_products_raw') && Schema::hasColumn('erp_products_raw', 'reference') && !Schema::hasColumn('erp_products_raw', 'navsa_product_code')) {
            try {
                DB::statement("ALTER TABLE erp_products_raw CHANGE reference navsa_product_code VARCHAR(255)");
            } catch (\Throwable $e) {
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('products') && Schema::hasColumn('products', 'navsa_product_code')) {
            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('navsa_product_code', 'reference');
            });
            DB::statement("ALTER TABLE products MODIFY reference VARCHAR(100) NULL");
        }

        if (Schema::hasTable('erp_products_raw') && Schema::hasColumn('erp_products_raw', 'navsa_product_code')) {
            Schema::table('erp_products_raw', function (Blueprint $table) {
                $table->renameColumn('navsa_product_code', 'reference');
            });
        }
    }
};
