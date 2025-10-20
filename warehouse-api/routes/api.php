<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ItemTransactionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;

Route::prefix('v1')->group(function () {

    // ------------------------------
    // Public: Register & Login
    // ------------------------------
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('dashboard/stock-movement', [DashboardController::class, 'stockMovementPerWeek']);
    });

    // ------------------------------
    // Routes yang butuh auth
    // ------------------------------
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        // ------------------------------
        // Admin routes
        // ------------------------------
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('items', ItemController::class);
            Route::put('transactions/{transaction}', [ItemTransactionController::class, 'update']);
            Route::delete('transactions/{transaction}', [ItemTransactionController::class, 'destroy']);
            // Route::post('items/{itemId}/transactions', [ItemTransactionController::class, 'store']);
            // Route::post('items/{itemId}/transactions', [ItemTransactionController::class, 'store'])
            //     ->middleware('role:admin');
        });
        // Admin + Staff
        Route::post('items/{itemId}/transactions', [ItemTransactionController::class, 'store'])
            ->middleware('role:admin,staff');

        // ------------------------------
        // Staff routes
        // ------------------------------
        // Route::middleware('role:staff')->group(function () {
        //     // Staff hanya bisa tambah transaksi
        //     // Route::post('items/{itemId}/transactions', [ItemTransactionController::class, 'store']);
        // });

        // ------------------------------
        // Routes untuk Admin & Staff
        // ------------------------------
        Route::get('items', [ItemController::class, 'index']); // lihat semua item
        Route::get('items/{itemId}', [ItemController::class, 'show']); // lihat detail item
        Route::get('items/{itemId}/transactions', [ItemTransactionController::class, 'index']); // lihat transaksi item
    });
});
