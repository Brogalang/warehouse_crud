<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ItemTransactionController;

Route::prefix('v1')->group(function () {
    Route::apiResource('items', ItemController::class);

    // transaksi item
    Route::get('items/{itemId}/transactions', [ItemTransactionController::class, 'index']);
    Route::post('items/{itemId}/transactions', [ItemTransactionController::class, 'store']);

    // update & delete transaksi
    Route::put('transactions/{transaction}', [ItemTransactionController::class, 'update']);
    Route::delete('transactions/{transaction}', [ItemTransactionController::class, 'destroy']);
});
