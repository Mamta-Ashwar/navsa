<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Google reCAPTCHA v2
    |--------------------------------------------------------------------------
    |
    | The site key is used by the Vite frontend at build time. The secret key
    | stays only in Laravel and is used to verify each submitted token.
    |
    */

    'site_key' => env('RECAPTCHA_SITE_KEY', '6LeWMHAtAAAAABfORIlP3B4Vc72uUhpSzlxwO7l8'),
    'secret_key' => env('RECAPTCHA_SECRET_KEY', '6LeWMHAtAAAAAOyVQvE4eo-ya7IYe444pDN6eygF'),
];