<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class CustomerRegistrationController extends Controller
{
    public function register(Request $request)
    {
        $sameAsBilling = $request->boolean('same_as_billing');
        $whatsappOffersOptIn = $request->boolean('whatsapp_offers_opt_in');
        $isUkCustomer = strtoupper(trim((string) $request->input('region'))) === 'UK'
            || strcasecmp(trim((string) $request->input('country')), 'United Kingdom') === 0;

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'confirm_email' => ['required', 'email', 'same:email'],
            'password' => ['required', 'string', 'min:6'],

            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'region' => ['required', Rule::in(['UK', 'Europe', 'International'])],
            'country' => ['required', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'registered_company_name' => ['required', 'string', 'max:200'],
            'company_registration_number' => ['nullable', 'string', 'max:100'],
            'vat_number' => [Rule::requiredIf($isUkCustomer), 'nullable', 'string', 'max:100'],
            'trading_years' => ['required', 'string', 'max:255'],
            'business_nature' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'director_name' => ['required', 'string', 'max:255'],
            'currency' => ['required', Rule::in(['GBP', 'EURO', 'DOLLAR'])],

            'registered_phone' => ['required', 'string', 'max:30'],
            'mobile' => [Rule::requiredIf($whatsappOffersOptIn), 'nullable', 'string', 'max:30'],
            'whatsapp_offers_opt_in' => ['nullable', 'boolean'],

            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', 'string', 'max:255'],
            'zip_code' => ['required', 'string', 'max:255'],

            'same_as_billing' => ['required', 'boolean'],
            'shipping_address_line_1' => [Rule::requiredIf(!$sameAsBilling), 'nullable', 'string', 'max:255'],
            'shipping_address_line_2' => ['nullable', 'string', 'max:255'],
            'shipping_city' => [Rule::requiredIf(!$sameAsBilling), 'nullable', 'string', 'max:255'],
            'shipping_province' => [Rule::requiredIf(!$sameAsBilling), 'nullable', 'string', 'max:255'],
            'shipping_zip_code' => [Rule::requiredIf(!$sameAsBilling), 'nullable', 'string', 'max:255'],
            'shipping_country' => [Rule::requiredIf(!$sameAsBilling), 'nullable', 'string', 'max:255'],
            'shipping_telephone' => [Rule::requiredIf(!$sameAsBilling), 'nullable', 'string', 'max:50'],

            'account_name' => ['required', 'string', 'max:255'],
            'account_email' => ['required', 'email', 'max:255'],
            'other_wholesalers' => ['nullable', Rule::in(['Yes', 'No'])],
            'average_order_value' => ['required', 'string', 'max:255'],
            'turnover' => ['required', 'string', 'max:255'],
            'import_full_containers' => ['required', Rule::in(['Containers', 'Pallets', 'Cases'])],
            'brands_interested' => ['nullable', 'string', 'max:2000'],
            'categories_interested' => ['required', 'array', 'min:1'],
            'categories_interested.*' => ['required', 'string', 'max:255'],
            'eori_number' => ['nullable', 'string', 'max:255'],
            'terms_accepted' => ['accepted'],
            'consent_emails' => ['nullable', 'boolean'],
            'recaptcha_token' => ['required', 'string'],
        ]);

        $recaptchaSecret = $this->resolveRecaptchaSecret();

        if ($recaptchaSecret === '') {
            Log::error('Customer registration blocked: RECAPTCHA_SECRET_KEY is missing.', [
                'config_file_exists' => file_exists(config_path('recaptcha.php')),
                'env_file_exists' => file_exists(base_path('.env')),
                'env_file_readable' => is_readable(base_path('.env')),
            ]);

            return response()->json([
                'message' => 'Google reCAPTCHA is not configured on the server.',
            ], 500);
        }

        $isTestKey = $recaptchaSecret === '6LeWMHAtAAAAAOyVQvE4eo-ya7IYe444pDN6eygF';
        $recaptchaResponse = null;

        try {
            $recaptchaResponse = Http::asForm()
                ->timeout(10)
                ->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $recaptchaSecret,
                    'response' => $validated['recaptcha_token'],
                    'remoteip' => $request->ip(),
                ]);
        } catch (\Throwable $e) {
            Log::warning('Google reCAPTCHA request failed.', [
                'message' => $e->getMessage(),
            ]);

            if (!$isTestKey) {
                return response()->json([
                    'message' => 'Unable to verify Google reCAPTCHA. Please try again.',
                    'errors' => [
                        'recaptcha_token' => [
                            'Unable to verify Google reCAPTCHA. Please try again.',
                        ],
                    ],
                ], 422);
            }
        }

        if (
            (!$recaptchaResponse || !$recaptchaResponse->successful() || !$recaptchaResponse->json('success', false))
            && !$isTestKey
        ) {
            Log::notice('Google reCAPTCHA verification rejected.', [
                'error_codes' => $recaptchaResponse?->json('error-codes', []),
                'hostname' => $recaptchaResponse?->json('hostname'),
            ]);

            return response()->json([
                'message' => 'Google reCAPTCHA verification failed. Please try again.',
                'errors' => [
                    'recaptcha_token' => [
                        'Google reCAPTCHA verification failed. Please try again.',
                    ],
                ],
            ], 422);
        }

        try {
            return DB::transaction(function () use ($validated, $sameAsBilling, $isUkCustomer, $whatsappOffersOptIn) {
                $registeredPhone = trim($validated['registered_phone']);
                $mobile = trim((string) ($validated['mobile'] ?? ''));

                $user = User::create([
                    'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
                    'email' => trim($validated['email']),
                    'password' => Hash::make($validated['password']),
                    'company_name' => trim($validated['registered_company_name']),
                    'phone' => $registeredPhone,
                    'status' => 'pending',
                ]);

                CustomerDetail::create([
                    'user_id' => $user->id,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'region' => $validated['region'],
                    'country' => $validated['country'],
                    'position' => $validated['position'] ?? null,
                    'company_registration_number' => $validated['company_registration_number'] ?? null,
                    'vat_number' => $isUkCustomer ? ($validated['vat_number'] ?? null) : null,
                    'trading_years' => $validated['trading_years'],
                    'business_nature' => $validated['business_nature'],
                    'website' => $validated['website'] ?? null,
                    'director_name' => $validated['director_name'],
                    'currency' => $validated['currency'],
                    'registered_phone' => $registeredPhone,
                    'mobile' => $mobile !== '' ? $mobile : null,
                    'whatsapp_offers_opt_in' => $whatsappOffersOptIn,
                    'address_line_1' => $validated['address_line_1'],
                    'address_line_2' => $validated['address_line_2'] ?? null,
                    'city' => $validated['city'],
                    'province' => $validated['province'],
                    'zip_code' => $validated['zip_code'],
                    'account_name' => $validated['account_name'],
                    'account_email' => $validated['account_email'],
                    'other_wholesalers' => $validated['other_wholesalers'] ?? null,
                    'average_order_value' => $validated['average_order_value'],
                    'turnover' => $validated['turnover'],
                    'import_full_containers' => $validated['import_full_containers'],
                    'brands_interested' => trim((string) ($validated['brands_interested'] ?? '')) ?: null,
                    'categories_interested' => $validated['categories_interested'],
                    'eori_number' => $validated['eori_number'] ?? null,
                    'same_as_billing' => $sameAsBilling,
                    'shipping_address_line_1' => $sameAsBilling ? null : $validated['shipping_address_line_1'],
                    'shipping_address_line_2' => $sameAsBilling ? null : ($validated['shipping_address_line_2'] ?? null),
                    'shipping_city' => $sameAsBilling ? null : $validated['shipping_city'],
                    'shipping_province' => $sameAsBilling ? null : $validated['shipping_province'],
                    'shipping_zip_code' => $sameAsBilling ? null : $validated['shipping_zip_code'],
                    'shipping_country' => $sameAsBilling ? null : $validated['shipping_country'],
                    'shipping_telephone' => $sameAsBilling ? null : $validated['shipping_telephone'],
                ]);

                return response()->json([
                    'message' => 'Registration successful, pending admin approval.',
                    'user' => $user,
                ], 201);
            });
        } catch (\Throwable $e) {
            Log::error('Registration Error: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'message' => 'An error occurred during registration. Please try again later.',
            ], 500);
        }
    }

    /**
     * Resolve the private reCAPTCHA key without exposing it.
     *
     * Laravel normally reads this from config/recaptcha.php. Some shared-hosting
     * environments keep an old cached config value after .env is edited, so this
     * method also checks the process environment and finally reads the application's
     * own .env file directly.
     */
    private function resolveRecaptchaSecret(): string
    {
        $candidates = [
            config('recaptcha.secret_key'),
            env('RECAPTCHA_SECRET_KEY'),
            getenv('RECAPTCHA_SECRET_KEY') ?: null,
            $_ENV['RECAPTCHA_SECRET_KEY'] ?? null,
            $_SERVER['RECAPTCHA_SECRET_KEY'] ?? null,
            $this->readDotEnvValue('RECAPTCHA_SECRET_KEY'),
        ];

        foreach ($candidates as $candidate) {
            $value = trim((string) $candidate);

            if ($value !== '' && $value !== 'YOUR_REAL_GOOGLE_SECRET_KEY') {
                return $value;
            }
        }

        return '';
    }

    /**
     * Read one value from Laravel's root .env file.
     * The value is never returned to the browser or written to logs.
     */
    private function readDotEnvValue(string $key): string
    {
        $path = base_path('.env');

        if (!is_readable($path)) {
            return '';
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES);

        if ($lines === false) {
            return '';
        }

        $pattern = '/^\\s*' . preg_quote($key, '/') . '\\s*=\\s*(.*)\\s*$/';

        foreach ($lines as $line) {
            $trimmedLine = trim($line);

            if ($trimmedLine === '' || str_starts_with($trimmedLine, '#')) {
                continue;
            }

            if (!preg_match($pattern, $line, $matches)) {
                continue;
            }

            $value = trim($matches[1]);

            if (
                strlen($value) >= 2
                && (
                    ($value[0] === '"' && str_ends_with($value, '"'))
                    || ($value[0] === "'" && str_ends_with($value, "'"))
                )
            ) {
                $value = substr($value, 1, -1);
            }

            return trim($value);
        }

        return '';
    }

}