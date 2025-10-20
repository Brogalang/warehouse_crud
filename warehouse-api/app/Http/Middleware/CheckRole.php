<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::guard('sanctum')->user();
        echo"<pre>";
        print_r($roles);
        echo"</pre>";

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        \Log::info('User role: '.$user->role.' | Allowed roles: '.implode(',', $roles));

        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Unauthorized CheckRole'], 403);
        }

        return $next($request);
    }

}

