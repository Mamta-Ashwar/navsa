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
                // Fill any null/empty reference values before altering to NOT NULL
                DB::statement("UPDATE products SET reference = CONCAT('PROD-', id) WHERE reference IS NULL OR reference = ''");

                Schema::table('products', function (Blueprint $table) {
                    $table->renameColumn('reference', 'navsa_product_code');
                });
            }

            if (Schema::hasColumn('products', 'navsa_product_code')) {
                DB::statement("ALTER TABLE products MODIFY navsa_product_code VARCHAR(100) NOT NULL");
            }
        }

        if (Schema::hasTable('erp_products_raw') && Schema::hasColumn('erp_products_raw', 'reference')) {
            Schema::table('erp_products_raw', function (Blueprint $table) {
                $table->renameColumn('reference', 'navsa_product_code');
            });
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
