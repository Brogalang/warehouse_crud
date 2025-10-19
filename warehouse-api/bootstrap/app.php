<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // ------------------------------
        // Route Middleware alias
        // ------------------------------
        $middleware->alias([
            'auth' => App\Http\Middleware\Authenticate::class,
            'auth:sanctum' => \Illuminate\Auth\Middleware\Authenticate::class,
            'role' => App\Http\Middleware\CheckRole::class,
            'bindings' => Illuminate\Routing\Middleware\SubstituteBindings::class,
            'throttle' => Illuminate\Routing\Middleware\ThrottleRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
