<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuth
{
    /**
     * Authenticate and authorize NAVSA administrators using Laravel Sanctum.
     *
     * IONOS strips the standard Authorization header during the public /api
     * rewrite. The public API bridge restores the Bearer token from
     * X-Navsa-Auth before Laravel boots.
     *
     * No legacy admin key or hardcoded admin impersonation is accepted here.
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->filled('token') && !$request->headers->has('Authorization')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->query('token'));
        }
        if ($request->hasHeader('X-Navsa-Auth') && !$request->headers->has('Authorization')) {
            $request->headers->set('Authorization', $request->header('X-Navsa-Auth'));
        }

        $adminUser = Auth::guard('sanctum')->user();

        if (!$adminUser) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if (
            $adminUser->status !== 'approved' ||
            $adminUser->role !== 'admin'
        ) {
            return response()->json([
                'message' => 'Forbidden.'
            ], 403);
        }

        Auth::setUser($adminUser);

        $request->setUserResolver(function () use ($adminUser) {
            return $adminUser;
        });

        return $next($request);
    }
}