<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Supplier;
use Carbon\Carbon;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class SyncErpProductMetadata extends Command
{
    protected $signature = 'erp:sync-product-metadata
                            {file : Full path to the ERP Excel file}
                            {--dry-run : Validate and count matching products without changing the database}';

    protected $description = 'Update existing products with PrimarySupplierIndex, PrimarySupplierReference and Obsolete from ERP Excel';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return self::FAILURE;
        }

        try {
            $spreadsheet = IOFactory::load($filePath);
        } catch (\Throwable $e) {
            $this->error('Unable to open Excel file: ' . $e->getMessage());
            return self::FAILURE;
        }

        $rows = $spreadsheet->getActiveSheet()->toArray(null, true, true, false);

        if (count($rows) < 2) {
            $this->error('The Excel file does not contain product rows.');
            return self::FAILURE;
        }

        $headers = array_shift($rows);
        $headerMap = [];

        foreach ($headers as $index => $header) {
            $normalised = strtolower(
                preg_replace('/[^a-z0-9]+/i', '', trim((string) $header))
            );

            if ($normalised !== '') {
                $headerMap[$normalised] = $index;
            }
        }

        $codeCol = $headerMap['reference'] ?? $headerMap['navsaproductcode'] ?? null;
        $supplierIndexCol = $headerMap['primarysupplierindex'] ?? null;
        $supplierReferenceCol = $headerMap['primarysupplierreference'] ?? null;
        $obsoleteCol = $headerMap['obsolete'] ?? null;

        $missing = [];

        if ($codeCol === null) {
            $missing[] = 'Reference / NAVSA Product Code';
        }
        if ($supplierIndexCol === null) {
            $missing[] = 'PrimarySupplierIndex';
        }
        if ($supplierReferenceCol === null) {
            $missing[] = 'PrimarySupplierReference';
        }
        if ($obsoleteCol === null) {
            $missing[] = 'Obsolete';
        }

        if (!empty($missing)) {
            $this->error('Missing required column(s): ' . implode(', ', $missing));
            return self::FAILURE;
        }

        $todayLondon = Carbon::now('Europe/London')->toDateString();
        $matched = 0;
        $missingProducts = 0;
        $invalidDates = 0;
        $expired = 0;
        $prepared = [];

        foreach ($rows as $rowIndex => $row) {
            $code = trim((string) ($row[$codeCol] ?? ''));

            if ($code === '') {
                continue;
            }

            $product = Product::where('navsa_product_code', $code)->first();

            if (!$product) {
                $missingProducts++;
                continue;
            }

            $supplierIndex = trim((string) ($row[$supplierIndexCol] ?? ''));
            $supplierReference = trim((string) ($row[$supplierReferenceCol] ?? ''));
            $rawObsolete = $row[$obsoleteCol] ?? null;
            $obsolete = $this->toDateOrNull($rawObsolete);

            $rawObsoleteHasValue = $rawObsolete !== null
                && (!is_string($rawObsolete) || trim($rawObsolete) !== '');

            if ($rawObsoleteHasValue && $obsolete === null) {
                $invalidDates++;
                $this->warn(
                    'Row ' . ($rowIndex + 2)
                    . " ({$code}) has an invalid Obsolete date and was skipped."
                );
                continue;
            }

            $obsoleteExpired = $obsolete !== null && $obsolete < $todayLondon;

            if ($obsoleteExpired) {
                $expired++;
            }

            $supplierId = null;
            if ($supplierIndex !== '') {
                $supplierId = Supplier::whereRaw(
                    'TRIM(supplier_index) = ?',
                    [$supplierIndex]
                )->value('id');
            }

            $updates = [
                'primary_supplier_index' => $supplierIndex ?: null,
                'supplier_reference' => $supplierReference ?: null,
                'obsolete' => $obsolete,
            ];

            if ($supplierId !== null) {
                $updates['supplier_id'] = $supplierId;
            }

            if ($obsoleteExpired) {
                $updates['deleted'] = true;
                $updates['live_for_web'] = 0;
            }

            $prepared[] = [$product, $updates];
            $matched++;
        }

        $this->info("Existing products matched: {$matched}");
        $this->info("ERP rows for products not currently in the database: {$missingProducts}");
        $this->info("Invalid Obsolete dates: {$invalidDates}");
        $this->info("Matched products already past their Obsolete date: {$expired}");

        if ($this->option('dry-run')) {
            $this->warn('DRY RUN ONLY - database was not changed.');
            return $invalidDates > 0 ? self::FAILURE : self::SUCCESS;
        }

        foreach ($prepared as [$product, $updates]) {
            $product->update($updates);
        }

        $this->info("Metadata updated for {$matched} existing product(s).");

        return $invalidDates > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function toDateOrNull($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        if (is_numeric($value)) {
            try {
                return ExcelDate::excelToDateTimeObject($value)->format('Y-m-d');
            } catch (\Throwable $e) {
                return null;
            }
        }

        $timestamp = strtotime((string) $value);

        return $timestamp ? date('Y-m-d', $timestamp) : null;
    }
}
