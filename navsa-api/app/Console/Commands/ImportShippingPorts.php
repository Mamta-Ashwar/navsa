<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportShippingPorts extends Command
{
    protected $signature = 'shipping:import-ports
                            {file : Full path to the Excel file}
                            {--dry-run : Validate the Excel file and show totals without changing the database}';

    protected $description = 'Import shipping countries and ports from Excel using NAVSA 3-zone shipping rules';

    /**
     * NAVSA shipping zones:
     * Zone 1 = United Kingdom -> minimum order 5000.00
     * Zone 2 = Europe         -> minimum order 5000.00
     * Zone 3 = Rest of World  -> minimum order 10000.00
     *
     * UK is handled separately.
     * This list is used so every future ports import keeps the same zone mapping.
     */
    private const EUROPE_COUNTRIES = [
        'albania',
        'andorra',
        'austria',
        'belarus',
        'belgium',
        'bosnia and herzegovina',
        'bulgaria',
        'croatia',
        'czechia',
        'denmark',
        'estonia',
        'faroe islands',
        'finland',
        'france',
        'germany',
        'gibraltar',
        'greece',
        'guernsey',
        'holy see',
        'hungary',
        'iceland',
        'ireland',
        'isle of man',
        'italy',
        'jersey',
        'latvia',
        'liechtenstein',
        'lithuania',
        'luxembourg',
        'malta',
        'moldova',
        'republic of moldova',
        'monaco',
        'montenegro',
        'netherlands',
        'netherlands (kingdom of the)',
        'north macedonia',
        'norway',
        'poland',
        'portugal',
        'romania',
        'russia',
        'russian federation',
        'san marino',
        'serbia',
        'slovakia',
        'slovenia',
        'spain',
        'sweden',
        'switzerland',
        'ukraine',
        'åland islands',
        'svalbard and jan mayen islands',
    ];

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

        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        if (count($rows) < 2) {
            $this->error('The Excel file does not contain any data rows.');
            return self::FAILURE;
        }

        $headers = array_shift($rows);

        $normaliseHeader = static function ($value): string {
            $value = trim((string) $value);
            $value = preg_replace('/[^a-z0-9]+/i', ' ', $value);
            return strtolower(trim((string) $value));
        };

        $cleanText = static function ($value): string {
            $value = trim((string) $value);
            $value = preg_replace('/\s+/u', ' ', $value);
            return trim((string) $value);
        };

        $normaliseCountry = static function ($value): string {
            $value = trim((string) $value);
            $value = preg_replace('/\s+/u', ' ', $value);
            return mb_strtolower(trim((string) $value), 'UTF-8');
        };

        $countryIndex = null;
        $portIndexes = [];

        foreach ($headers as $index => $header) {
            $normalised = $normaliseHeader($header);

            if ($normalised === 'country') {
                $countryIndex = $index;
                continue;
            }

            if ($normalised !== '' && str_contains($normalised, 'port')) {
                $portIndexes[] = $index;
            }
        }

        if ($countryIndex === null) {
            $this->error('Could not find a "Country" column in the Excel header.');
            return self::FAILURE;
        }

        if (count($portIndexes) === 0) {
            $this->error('Could not find any port columns in the Excel header.');
            return self::FAILURE;
        }

        $this->info('Detected country column: ' . ($countryIndex + 1));
        $this->info('Detected port columns: ' . count($portIndexes));

        $parsedCountries = [];
        $seenCountries = [];
        $totalPorts = 0;

        foreach ($rows as $rowOffset => $row) {
            $excelRowNumber = $rowOffset + 2;
            $countryName = $cleanText($row[$countryIndex] ?? '');

            if ($countryName === '') {
                $hasAnyValue = false;

                foreach ($row as $cell) {
                    if ($cleanText($cell) !== '') {
                        $hasAnyValue = true;
                        break;
                    }
                }

                if (!$hasAnyValue) {
                    continue;
                }

                $this->error("Row {$excelRowNumber}: country is blank.");
                return self::FAILURE;
            }

            $countryKey = $normaliseCountry($countryName);

            if (isset($seenCountries[$countryKey])) {
                $firstRow = $seenCountries[$countryKey];

                $this->error(
                    "Duplicate country \"{$countryName}\" found on rows {$firstRow} and {$excelRowNumber}."
                );

                return self::FAILURE;
            }

            $seenCountries[$countryKey] = $excelRowNumber;

            $ports = [];
            $seenPorts = [];

            foreach ($portIndexes as $portIndex) {
                $portName = $cleanText($row[$portIndex] ?? '');

                if ($portName === '') {
                    continue;
                }

                $portName = preg_replace('/^Port of\s+/iu', '', $portName);
                $portName = $cleanText($portName);

                if ($portName === '') {
                    continue;
                }

                $portKey = mb_strtolower($portName, 'UTF-8');

                if (isset($seenPorts[$portKey])) {
                    $this->error(
                        "Row {$excelRowNumber}: duplicate port \"{$portName}\" for {$countryName}."
                    );

                    return self::FAILURE;
                }

                $seenPorts[$portKey] = true;
                $ports[] = $portName;
            }

            if (count($ports) === 0) {
                $this->error("Row {$excelRowNumber}: {$countryName} has no ports.");
                return self::FAILURE;
            }

            $parsedCountries[] = [
                'country_name' => $countryName,
                'ports' => $ports,
            ];

            $totalPorts += count($ports);
        }

        if (count($parsedCountries) === 0) {
            $this->error('No countries were found in the Excel file.');
            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Excel validation passed.');
        $this->line('Countries found: ' . count($parsedCountries));
        $this->line('Ports found: ' . $totalPorts);

        if ($this->option('dry-run')) {
            $this->warn('DRY RUN ONLY - database was not changed.');
            return self::SUCCESS;
        }

        $ukZone = DB::table('shipping_zones')
            ->whereRaw('LOWER(TRIM(zone_name)) = ?', ['united kingdom'])
            ->first();

        $europeZone = DB::table('shipping_zones')
            ->whereRaw('LOWER(TRIM(zone_name)) = ?', ['europe'])
            ->first();

        $restOfWorldZone = DB::table('shipping_zones')
            ->whereRaw('LOWER(TRIM(zone_name)) = ?', ['rest of world'])
            ->first();

        if (!$ukZone || !$europeZone || !$restOfWorldZone) {
            $this->error(
                'Required shipping zones were not found. Expected "United Kingdom", "Europe", and "Rest of World".'
            );
            return self::FAILURE;
        }

        if (
            (float) $ukZone->minimum_order !== 5000.00 ||
            (float) $europeZone->minimum_order !== 5000.00 ||
            (float) $restOfWorldZone->minimum_order !== 10000.00
        ) {
            $this->error(
                'Shipping-zone minimum orders are not configured as expected: UK=5000, Europe=5000, Rest of World=10000.'
            );
            $this->warn(
                'Run NAVSA_3_Shipping_Zones_FINAL.sql before importing countries and ports.'
            );
            return self::FAILURE;
        }

        $basketShippingCount = DB::table('basket_shipping')->count();

        if ($basketShippingCount > 0) {
            $this->error(
                "Import stopped: basket_shipping currently contains {$basketShippingCount} row(s)."
            );

            $this->warn(
                'No database changes were made. Review those basket shipping records before replacing countries/ports.'
            );

            return self::FAILURE;
        }

        $ukZoneId = $ukZone->id;
        $europeZoneId = $europeZone->id;
        $restOfWorldZoneId = $restOfWorldZone->id;

        try {
            DB::transaction(function () use (
                $parsedCountries,
                $ukZoneId,
                $europeZoneId,
                $restOfWorldZoneId,
                $normaliseCountry
            ) {
                DB::table('shipping_ports')->delete();
                DB::table('shipping_countries')->delete();

                foreach ($parsedCountries as $country) {
                    $countryName = $country['country_name'];
                    $countryKey = $normaliseCountry($countryName);

                    if ($countryKey === 'united kingdom') {
                        $zoneId = $ukZoneId;
                    } elseif (in_array($countryKey, self::EUROPE_COUNTRIES, true)) {
                        $zoneId = $europeZoneId;
                    } else {
                        $zoneId = $restOfWorldZoneId;
                    }

                    $countryId = DB::table('shipping_countries')->insertGetId([
                        'zone_id' => $zoneId,
                        'country_code' => 'XX',
                        'country_name' => $countryName,
                        'active' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    foreach ($country['ports'] as $portName) {
                        DB::table('shipping_ports')->insert([
                            'country_id' => $countryId,
                            'port_name' => $portName,
                            'active' => 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            });
        } catch (\Throwable $e) {
            $this->error('Import failed. Database transaction was rolled back.');
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Shipping countries and ports imported successfully.');
        $this->line('Countries imported: ' . DB::table('shipping_countries')->count());
        $this->line('Ports imported: ' . DB::table('shipping_ports')->count());

        $zoneCounts = DB::table('shipping_countries as c')
            ->join('shipping_zones as z', 'z.id', '=', 'c.zone_id')
            ->select('z.zone_name', DB::raw('COUNT(c.id) AS countries_count'))
            ->groupBy('z.id', 'z.zone_name')
            ->orderBy('z.id')
            ->get();

        foreach ($zoneCounts as $zone) {
            $this->line($zone->zone_name . ': ' . $zone->countries_count . ' countries');
        }

        return self::SUCCESS;
    }
}
