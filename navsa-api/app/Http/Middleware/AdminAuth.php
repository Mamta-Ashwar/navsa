<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $adminKey = env('ADMIN_API_KEY', 'navsa2024');
        $key = $request->header('X-Admin-Key') ?? $request->query('admin_key');

        if ($key && $key === $adminKey) {
            if (!$request->user()) {
                $user = User::where('email', 'info@navsainternational.com')
                    ->orWhere('email', 'admin@navsa.com')
                    ->first();
                if ($user) {
                    Auth::setUser($user);
                }
            }
            return $next($request);
        }

        if ($request->user()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
}
