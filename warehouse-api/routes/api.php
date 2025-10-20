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

    // Dashboard (perlu login, tapi tidak perlu role khusus)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('dashboard/stock-movement', [DashboardController::class, 'stockMovementPerWeek']);
    });

    // ------------------------------
    // Protected routes (auth + token valid)
    // ------------------------------
    Route::middleware(['auth:sanctum', 'token.expired'])->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        // =======================================================
        // ADMIN ONLY
        // =======================================================
        Route::middleware('role:admin')->group(function () {
            // CRUD khusus admin
            Route::put('items/{item}', [ItemController::class, 'update']);
            Route::delete('items/{item}', [ItemController::class, 'destroy']);

            Route::put('transactions/{transaction}', [ItemTransactionController::class, 'update']);
            Route::delete('transactions/{transaction}', [ItemTransactionController::class, 'destroy']);
        });

        // =======================================================
        // ADMIN + STAFF
        // =======================================================
        Route::middleware('role:admin,staff')->group(function () {
            Route::post('items', [ItemController::class, 'store']); // tambah item
            Route::post('items/{itemId}/transactions', [ItemTransactionController::class, 'store']); // tambah transaksi
        });

        // =======================================================
        // COMMON (ADMIN + STAFF + VIEWER)
        // =======================================================
        Route::get('items', [ItemController::class, 'index']); // semua item
        Route::get('items/{itemId}', [ItemController::class, 'show']); // detail item
        Route::get('items/{itemId}/transactions', [ItemTransactionController::class, 'index']); // daftar transaksi
    });
});
