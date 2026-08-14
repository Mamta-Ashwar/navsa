<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Brand;
use App\Models\SubCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ImportErpProducts extends Command
{
    protected $signature = 'erp:import {file} {--mode=auto : auto, erp or step1}';
    protected $description = 'Import products from ERP Excel file';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return 1;
        }

        $this->info("Loading Excel file...");
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        $headers = array_shift($rows);

        $this->info("Detected columns from file header:");
        foreach ($headers as $i => $h) {
            $this->line("  [$i] => $h");
        }
        $this->newLine();

        $total = count($rows);
        $this->info("Found {$total} products to import.");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $imported = 0;
        $skipped  = 0;
        $errors   = 0;
        $unknownCodes = [];
        $unknownBrands = [];

        $suppliers = Supplier::pluck('id', 'supplier_index')->toArray();
        $brandLookupMaps = $this->buildBrandLookupMaps();

        // Single source of truth: group_code => [category_id, sub_category_id]
        $subCategoryMap = [];
        foreach (SubCategory::where('status', 1)->select('id', 'group_code', 'category_id')->get() as $sc) {
            $subCategoryMap[strtoupper($sc->group_code)] = [
                'category_id'     => $sc->category_id,
                'sub_category_id' => $sc->id,
            ];
        }

        $storageMap = DB::table('storage_group_mapping')
    ->pluck('storage_type', 'group_code')
    ->mapWithKeys(fn ($value, $key) => [strtoupper($key) => $value])
    ->toArray();

        if (isset($rows[0])) {
            $this->info("First raw data row (for debugging):");
            foreach ($rows[0] as $i => $val) {
                $label = $headers[$i] ?? "col_$i";
                $this->line("  [$i] $label => " . var_export($val, true));
            }
            $this->newLine();
        }

        $headerMap = [];
        foreach ($headers as $i => $h) {
            $cleanHeader = strtolower(trim(preg_replace('/\s+/', ' ', (string)$h)));
            $headerMap[$cleanHeader] = $i;
        }

        $codeCol = $headerMap['navsa product code'] ?? ($headerMap['reference'] ?? null);
        $descriptionCol = $headerMap['description'] ?? null;
        $orderQtyAllowedCol =
            $headerMap['order qty allowed']
            ?? ($headerMap['orderqtyallowed'] ?? null);

        $barcodeEanCol = $headerMap['barcodeean'] ?? $headerMap['barcode_ean'] ?? 7;
        $liveForWebCol = $headerMap['liveforweb'] ?? $headerMap['live_for_web'] ?? 31;

        if ($codeCol === null) {
            $bar->finish();
            $this->newLine(2);
            $this->error('Import requires a NAVSA Product Code or Reference column.');
            return 1;
        }

        $requestedMode = strtolower(trim((string) $this->option('mode')));
        if (!in_array($requestedMode, ['auto', 'erp', 'step1'], true)) {
            $bar->finish();
            $this->newLine(2);
            $this->error('Invalid --mode. Use auto, erp or step1.');
            return 1;
        }

        $looksLikeStep1 =
            isset($headerMap['navsa product code'])
            && $orderQtyAllowedCol !== null
            && !isset($headerMap['primarysupplierindex']);

        $isStep1 = $requestedMode === 'step1'
            || ($requestedMode === 'auto' && $looksLikeStep1);

        if ($isStep1) {
            if ($orderQtyAllowedCol === null) {
                $bar->finish();
                $this->newLine(2);
                $this->error('Step 1 import requires an ORDER QTY ALLOWED column.');
                return 1;
            }

            foreach ($rows as $rowIndex => $row) {
                try {
                    $navsaProductCode = trim((string) ($row[$codeCol] ?? ''));
                    $description = $descriptionCol !== null
                        ? trim((string) ($row[$descriptionCol] ?? ''))
                        : '';

                    if ($navsaProductCode === '' && $description === '') {
                        $skipped++;
                        $bar->advance();
                        continue;
                    }

                    if ($navsaProductCode === '') {
                        $errors++;
                        $this->newLine();
                        $this->error(
                            'Row ' . ($rowIndex + 2)
                            . ' skipped: missing NAVSA Product Code / Reference.'
                        );
                        $bar->advance();
                        continue;
                    }

                    $product = Product::where('navsa_product_code', $navsaProductCode)->first();

                    if (!$product) {
                        $errors++;
                        $this->newLine();
                        $this->error(
                            'Row ' . ($rowIndex + 2)
                            . " skipped: NAVSA Product Code {$navsaProductCode} does not exist."
                        );
                        $bar->advance();
                        continue;
                    }

                    $orderQtyAllowed = $this->normalizeOrderQtyAllowed(
                        $row[$orderQtyAllowedCol] ?? null
                    );

                    if ($orderQtyAllowed === null) {
                        $errors++;
                        $this->newLine();
                        $this->error(
                            'Row ' . ($rowIndex + 2)
                            . ' skipped: invalid ORDER QTY ALLOWED. Use blank, DEFAULT, PALLET or CASE.'
                        );
                        $bar->advance();
                        continue;
                    }

                    $updates = [
                        'order_qty_allowed' => $orderQtyAllowed,
                        'deleted' => false,
                    ];

                    if ($description !== '') {
                        $updates['description'] = $description;
                    }

                    $product->update($updates);
                    $imported++;
                } catch (\Exception $e) {
                    $errors++;
                    $this->newLine();
                    $this->error(
                        "Step 1 row error at index {$rowIndex}: " . $e->getMessage()
                    );
                }

                $bar->advance();
            }

            $bar->finish();
            $this->newLine(2);
            $this->info("✅ Step 1 ORDER QTY ALLOWED import complete!");
            $this->info("Updated  : {$imported}");
            $this->info("Skipped  : {$skipped}");
            $this->info("Errors   : {$errors}");

            return $errors > 0 ? 1 : 0;
        }

        foreach ($rows as $rowIndex => $row) {
            try {
                $supplierIndex    = trim((string) ($row[0] ?? ''));
                $navsaProductCode = trim((string) ($row[$codeCol] ?? $row[1] ?? ''));
                $description      = trim((string) ($row[2] ?? ''));
                $unitsOf          = trim((string) ($row[3] ?? ''));
                $innerCase        = $this->toNumberOrNull($row[4] ?? null);
                $outerCase        = $this->toNumberOrNull($row[5] ?? null);
                $qtyDesc          = $this->normalizeQtyDesc($row[6] ?? null);
                $orderQtyAllowed  = null;
                if ($orderQtyAllowedCol !== null) {
                    $orderQtyAllowed = $this->normalizeOrderQtyAllowed(
                        $row[$orderQtyAllowedCol] ?? null
                    );

                    if ($orderQtyAllowed === null) {
                        $errors++;
                        $this->newLine();
                        $this->error(
                            'Row ' . ($rowIndex + 2)
                            . ' skipped: invalid ORDER QTY ALLOWED. Use blank, DEFAULT, PALLET or CASE.'
                        );
                        $bar->advance();
                        continue;
                    }
                }
                $barcodeEan       = trim((string) ($row[$barcodeEanCol] ?? ''));
                $barcodeCase      = trim((string) ($row[8] ?? ''));
                $groupDesc        = trim((string) ($row[9] ?? ''));
                $vatCode          = trim((string) ($row[10] ?? ''));
                $layerQty         = $this->toNumberOrNull($row[11] ?? null);
                $palletQty        = $this->toNumberOrNull($row[12] ?? null);
                $supplierRef      = trim((string) ($row[13] ?? ''));
                $cost             = $this->toNumberOrNull($row[14] ?? null);
                $costFromDate     = $this->toDateOrNull($row[15] ?? null);
                $costToDate       = $this->toDateOrNull($row[16] ?? null);
                $weight           = $this->toNumberOrNull($row[17] ?? null);
                $volume           = $this->toNumberOrNull($row[18] ?? null);
                $shelfLife        = $this->toNumberOrNull($row[19] ?? null);
                $bbd              = $this->toDateOrNull($row[20] ?? null);
                $priceList        = trim((string) ($row[21] ?? ''));
                $price            = $this->toNumberOrNull($row[22] ?? null);
                $fromDate         = $this->toDateOrNull($row[23] ?? null);
                $toDate           = $this->toDateOrNull($row[24] ?? null);
                $commCode         = trim((string) ($row[25] ?? ''));
                $intraCountry     = trim((string) ($row[26] ?? ''));
                $intraType        = trim((string) ($row[27] ?? ''));
                $webShortDesc     = trim((string) ($row[28] ?? ''));
                $webLongDesc      = trim((string) ($row[29] ?? ''));
                $webImage         = trim((string) ($row[30] ?? ''));
                $liveForWeb       = $this->toBoolean01($row[$liveForWebCol] ?? 0);
                $encoreImage      = trim((string) ($row[32] ?? ''));

                if (empty($description) && empty($navsaProductCode)) {
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                if ($navsaProductCode === '') {
                    $errors++;
                    $this->newLine();
                    $this->error('Row ' . ($rowIndex + 2) . ' skipped: missing Reference / NAVSA Product Code.');
                    $bar->advance();
                    continue;
                }

                $supplierId = !empty($supplierIndex)
                    ? ($suppliers[trim($supplierIndex)] ?? null)
                    : null;

                $brandName     = '';
                $groupCode     = '';
                $categoryId    = null;
                $subCategoryId = null;
                $storageType   = 'Ambient';

                if (!empty($groupDesc)) {
                    $cleanGroup = preg_replace('/\s+/u', ' ', trim($groupDesc));
                    $groupCode  = strtoupper(substr($cleanGroup, 0, 5));

                    if (strlen($cleanGroup) > 11) {
                        $brandName = trim(substr($cleanGroup, 11));
                    }

                    if ($brandName === '' && preg_match('/^\S+\s+(.+)$/u', $cleanGroup, $matches)) {
                        $brandName = trim($matches[1]);
                    }

                    $storageType = $storageMap[$groupCode] ?? 'Ambient';

                    if (isset($subCategoryMap[$groupCode])) {
                        $categoryId    = $subCategoryMap[$groupCode]['category_id'];
                        $subCategoryId = $subCategoryMap[$groupCode]['sub_category_id'];
                    } else {
                        $unknownCodes[$groupCode] = ($unknownCodes[$groupCode] ?? 0) + 1;
                    }
                }

                $brandId = $this->resolveBrandId($brandName, $brandLookupMaps);
                if ($brandName !== '' && $brandId === null) {
                    $unknownBrands[$brandName] = ($unknownBrands[$brandName] ?? 0) + 1;
                }

                $matchKey = !empty($navsaProductCode)
                    ? ['navsa_product_code' => $navsaProductCode]
                    : ['description' => $description];

                $existing = Product::where($matchKey)->first();

                if ($existing) {
                    if ($categoryId === null) {
                        $categoryId = $existing->category_id;
                    }
                    if ($subCategoryId === null) {
                        $subCategoryId = $existing->sub_category_id;
                    }
                    if ($brandId === null) {
                        $brandId = $existing->brand_id;
                    }
                    if ($groupCode !== '' && !isset($storageMap[$groupCode]) && !empty($existing->storage_type)) {
                        $storageType = $existing->storage_type;
                    }
                }

                $payload = [
                    'navsa_product_code'    => $navsaProductCode,
                    'supplier_id'           => $supplierId,
                    'category_id'           => $categoryId,
                    'sub_category_id'       => $subCategoryId,
                    'brand_id'              => $brandId,
                    'description'           => $description,
                    'units_of'              => $unitsOf ?: null,
                    'inner_case_quantity'   => $innerCase,
                    'outer_case_quantity'   => $outerCase,
                    'qty_desc'              => $qtyDesc,
                    'barcode_ean'           => $barcodeEan ?: null,
                    'barcode_case'          => $barcodeCase ?: null,
                    'group_desc'            => $groupDesc ?: null,
                    'storage_type'          => $storageType,
                    'vat_code'              => $vatCode ?: null,
                    'layer_quantity'        => $layerQty,
                    'pallet_quantity'       => $palletQty,
                    'supplier_reference'    => $supplierRef ?: null,
                    'cost'                  => $cost,
                    'cost_from_date'        => $costFromDate,
                    'cost_to_date'          => $costToDate,
                    'weight'                => $weight,
                    'volume'                => $volume,
                    'shelf_life'            => $shelfLife,
                    'bbd'                   => $bbd,
                    'price_list'            => $priceList ?: null,
                    'price'                 => $price,
                    'from_date'             => $fromDate,
                    'to_date'               => $toDate,
                    'comm_code'             => $commCode ?: null,
                    'intra_country'         => $intraCountry ?: null,
                    'intra_type'            => $intraType ?: null,
                    'web_short_description' => $webShortDesc ?: null,
                    'web_long_description'  => $webLongDesc ?: null,
                    'web_image'             => $webImage ?: null,
                    'live_for_web'          => $liveForWeb,
                    'encore_image'          => $encoreImage ?: null,
                    'obsolete'              => null,

                    // A product present in the ERP file belongs in the active catalogue.
                    // Re-importing therefore restores any matching soft-deleted product.
                    'deleted'               => false,
                ];

                // ORDER QTY ALLOWED is independent from QtyDesc.
                // If the ERP workbook does not contain the column, preserve the
                // existing database value (new products use the DB DEFAULT).
                if ($orderQtyAllowedCol !== null) {
                    $payload['order_qty_allowed'] = $orderQtyAllowed;
                }

                Product::updateOrCreate($matchKey, $payload);

                $imported++;

            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("Row error at index {$rowIndex}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Import complete!");
        $this->info("Imported : {$imported}");
        $this->info("Skipped  : {$skipped}");
        $this->info("Errors   : {$errors}");

        if (!empty($unknownCodes)) {
            $this->newLine();
            $this->warn("⚠️  Unrecognized group codes (no active sub_category mapping found):");
            foreach ($unknownCodes as $code => $count) {
                $this->line("  {$code} — {$count} product(s)");
            }
            $this->warn("Update the official sub_categories mapping, then re-run this import.");
        }

        if (!empty($unknownBrands)) {
            $this->newLine();
            $this->warn("⚠️  Unrecognized GroupDesc brand names (no official brand / alias match found):");
            foreach ($unknownBrands as $name => $count) {
                $this->line("  {$name} — {$count} product(s)");
            }
            $this->warn("Add an explicit brand_aliases row if the ERP uses a shortened/alternate name.");
        }

        return 0;
    }


    private function buildBrandLookupMaps(): array
    {
        $exact = [];
        $normalisedBuckets = [];

        foreach (Brand::where('deleted', false)->where('status', 1)->select('id', 'brand_name')->get() as $brand) {
            $name = trim((string) $brand->brand_name);
            if ($name === '') {
                continue;
            }

            $exact[Str::lower($name)] = (int) $brand->id;

            $normalised = $this->normaliseBrandLookupKey($name);
            if ($normalised !== '') {
                $normalisedBuckets[$normalised] ??= [];
                $normalisedBuckets[$normalised][(int) $brand->id] = true;
            }
        }

        $normalisedUnique = [];
        foreach ($normalisedBuckets as $key => $ids) {
            if (count($ids) === 1) {
                $normalisedUnique[$key] = (int) array_key_first($ids);
            }
        }

        $aliases = [];
        if (
            \Illuminate\Support\Facades\Schema::hasTable('brand_aliases')
            && \Illuminate\Support\Facades\Schema::hasColumn('brand_aliases', 'alias_name')
            && \Illuminate\Support\Facades\Schema::hasColumn('brand_aliases', 'brand_id')
        ) {
            $rows = DB::table('brand_aliases')
                ->join('brands', 'brands.id', '=', 'brand_aliases.brand_id')
                ->where('brands.deleted', false)
                ->where('brands.status', 1)
                ->select('brand_aliases.alias_name', 'brand_aliases.brand_id')
                ->get();

            foreach ($rows as $row) {
                $key = $this->normaliseBrandLookupKey($row->alias_name);
                if ($key !== '') {
                    $aliases[$key] = (int) $row->brand_id;
                }
            }
        }

        return [
            'exact' => $exact,
            'normalised' => $normalisedUnique,
            'aliases' => $aliases,
        ];
    }

    private function resolveBrandId(?string $rawBrandName, array $maps): ?int
    {
        $name = trim((string) $rawBrandName);
        if ($name === '') {
            return null;
        }

        $normalised = $this->normaliseBrandLookupKey($name);

        if ($normalised !== '' && isset($maps['aliases'][$normalised])) {
            return (int) $maps['aliases'][$normalised];
        }

        $exactKey = Str::lower($name);
        if (isset($maps['exact'][$exactKey])) {
            return (int) $maps['exact'][$exactKey];
        }

        if ($normalised !== '' && isset($maps['normalised'][$normalised])) {
            return (int) $maps['normalised'][$normalised];
        }

        return null;
    }

    private function normaliseBrandLookupKey(?string $value): string
    {
        $value = Str::ascii((string) ($value ?? ''));
        $value = strtoupper(trim($value));
        $value = str_replace('&', ' AND ', $value);
        $value = preg_replace('/[^A-Z0-9]+/', ' ', $value);
        return trim(preg_replace('/\s+/', ' ', (string) $value));
    }

    private function normalizeQtyDesc($value): ?string
    {
        $raw = trim((string) ($value ?? ''));

        if ($raw === '') {
            return null;
        }

        return match (strtolower($raw)) {
            'case'   => 'Case',
            'layer'  => 'Layer',
            'pallet' => 'Pallet',
            default  => $raw,
        };
    }

    private function normalizeOrderQtyAllowed($value): ?string
    {
        $raw = strtoupper(trim((string) ($value ?? '')));

        if ($raw === '') {
            return 'DEFAULT';
        }

        return in_array($raw, ['DEFAULT', 'PALLET', 'CASE'], true)
            ? $raw
            : null;
    }

    private function toBoolean01($value): int
    {
        if (is_bool($value)) {
            return $value ? 1 : 0;
        }

        if (is_numeric($value)) {
            return ((int) $value) === 1 ? 1 : 0;
        }

        $normalised = strtolower(trim((string) $value));

        return in_array($normalised, ['1', 'true', 'yes', 'y', 'live'], true) ? 1 : 0;
    }

    private function toNumberOrNull($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        $cleaned = preg_replace('/[^\d.\-]/', '', (string) $value);

        if ($cleaned === '' || !is_numeric($cleaned)) {
            return null;
        }

        return (float) $cleaned;
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
            } catch (\Exception $e) {
                return null;
            }
        }

        $timestamp = strtotime((string) $value);
        return $timestamp ? date('Y-m-d', $timestamp) : null;
    }
}