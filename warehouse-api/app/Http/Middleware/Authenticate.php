<?php
// app/Http/Middleware/Authenticate.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class Authenticate
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $user = Auth::guard('sanctum')->user();
       \Log::info('Authenticated User:', ['user' => $user]);
        if (!$user) {
            return response()->json(['message' => 'Unauthorized Auth'], 401);
        }
        return $next($request);
    }
}
