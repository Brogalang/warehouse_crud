<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class CheckTokenExpired
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        $personalToken = PersonalAccessToken::findToken($token);

        if (!$personalToken) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        if ($personalToken->expires_at && Carbon::now()->gt($personalToken->expires_at)) {
            return response()->json(['message' => 'Token expired'], 401);
        }

        return $next($request);
    }
}
