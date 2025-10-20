<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, $roles)
    {
        $user = Auth::guard('sanctum')->user();

        // pastikan $roles selalu array
        if (is_string($roles)) {
            $roles = explode(',', $roles);
        }
        \Log::info('User role: '.$user->role.' | Allowed roles: '.implode(',', $roles));
        echo"<pre>";
        print_r($roles);
        echo"</pre>";
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Unauthorized CheckRole'], 403);
        }

        return $next($request);
    }

}

