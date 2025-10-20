<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stockMovementPerWeek(): JsonResponse
    {
        $startDate = Carbon::now()->subWeeks(8)->startOfWeek();

        $transactions = ItemTransaction::select(
                'item_id',
                DB::raw("YEAR(created_at) as year"),
                DB::raw("WEEK(created_at, 1) as week"),
                'type',
                DB::raw("SUM(quantity) as total")
            )
            ->with('item:id,nama_barang')
            ->where('created_at', '>=', $startDate)
            ->groupBy('item_id', 'year', 'week', 'type')
            ->orderBy('year')
            ->orderBy('week')
            ->get();

        $labels = [];
        for ($i = 7; $i >= 0; $i--) {
            $week = Carbon::now()->subWeeks($i)->weekOfYear;
            $labels[] = "Minggu $week";
        }

        $items = $transactions->groupBy('item_id');
        $datasets = [];

        foreach ($items as $itemId => $itemTrans) {
            $itemName = $itemTrans->first()->item->nama_barang ?? 'Tidak diketahui';

            $dataIn = [];
            $dataOut = [];

            for ($i = 7; $i >= 0; $i--) {
                $week = Carbon::now()->subWeeks($i)->weekOfYear;
                $year = Carbon::now()->subWeeks($i)->year;
                $weekData = $itemTrans->where('week', $week)->where('year', $year);

                $dataIn[] = $weekData->where('type', 'in')->sum('total');
                $dataOut[] = $weekData->where('type', 'out')->sum('total');
            }

            $color = sprintf('#%06X', mt_rand(0, 0xFFFFFF));

            $datasets[] = [
                'label' => "{$itemName} Masuk",
                'data' => $dataIn,
                'backgroundColor' => $color . 'CC', // warna solid
            ];

            $datasets[] = [
                'label' => "{$itemName} Keluar",
                'data' => $dataOut,
                'backgroundColor' => $color . '77', // warna lebih muda
            ];
        }

        return response()->json([
            'labels' => $labels,
            'datasets' => array_values($datasets),
        ]);
    }
}
