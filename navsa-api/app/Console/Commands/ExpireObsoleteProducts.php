<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class ExpireObsoleteProducts extends Command
{
    protected $signature = 'products:expire-obsolete
                            {--dry-run : Show products that would be moved to Deleted Items without changing the database}';

    protected $description = 'Move products whose Obsolete date has completed to Deleted Items';

    public function handle()
    {
        $today = Product::obsoleteTodayUtc();

        $query = Product::query()
            ->whereNotNull('obsolete')
            ->where('obsolete', '<>', '')
            ->whereRaw("obsolete REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}'")
            ->whereRaw(
                "STR_TO_DATE(SUBSTRING(obsolete, 1, 10), '%Y-%m-%d') < ?",
                [$today]
            )
            ->where(function ($stateQuery) {
                $stateQuery
                    ->where('deleted', false)
                    ->orWhere('live_for_web', 1);
            });

        $count = (clone $query)->count();

        if ($this->option('dry-run')) {
            $this->info("UTC date: {$today}");
            $this->info("Products that would be moved to Deleted Items: {$count}");
            $this->warn('DRY RUN ONLY - database was not changed.');
            return self::SUCCESS;
        }

        $updated = Product::expireObsoleteProducts();

        $this->info("{$updated} product(s) moved to Deleted Items because their Obsolete date has passed.");
        return self::SUCCESS;
    }
}
