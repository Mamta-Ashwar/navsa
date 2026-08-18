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
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_number')->unique();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('status')->default('pending');
                $table->decimal('total_amount', 10, 2)->default(0.00);
                $table->integer('total_items')->default(0);
                $table->decimal('total_weight_kg', 10, 2)->nullable();
                $table->decimal('total_volume_m3', 10, 2)->nullable();
                $table->string('shipping_method')->nullable();
                $table->text('shipping_address')->nullable();
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
                $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
                $table->string('navsa_product_code')->nullable();
                $table->string('product_name');
                $table->decimal('unit_price', 10, 2)->default(0.00);
                $table->integer('case_quantity')->default(1);
                $table->integer('units_per_case')->default(1);
                $table->decimal('subtotal', 10, 2)->default(0.00);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
