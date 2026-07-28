<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pdfs', function (Blueprint $table) {
            if (!Schema::hasColumn('pdfs', 'badge')) {
                $table->string('badge', 50)->nullable()->after('type');
            }

            if (!Schema::hasColumn('pdfs', 'valid_from')) {
                $table->date('valid_from')->nullable()->after('badge');
            }

            if (!Schema::hasColumn('pdfs', 'valid_to')) {
                $table->date('valid_to')->nullable()->after('valid_from');
            }

            if (!Schema::hasColumn('pdfs', 'validity_text')) {
                $table->string('validity_text', 255)->nullable()->after('valid_to');
            }

            if (!Schema::hasColumn('pdfs', 'description')) {
                $table->text('description')->nullable()->after('validity_text');
            }

            if (!Schema::hasColumn('pdfs', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(1)->after('description');
            }

            if (!Schema::hasColumn('pdfs', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('sort_order');
            }
        });

        // Preserve existing catalogue records while moving them into the
        // new Deals & Promotion PDFs section.
        DB::table('pdfs')
            ->where('type', 'catalog')
            ->update(['type' => 'deal']);
    }

    public function down(): void
    {
        Schema::table('pdfs', function (Blueprint $table) {
            $columns = [
                'badge',
                'valid_from',
                'valid_to',
                'validity_text',
                'description',
                'sort_order',
                'is_active',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('pdfs', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};