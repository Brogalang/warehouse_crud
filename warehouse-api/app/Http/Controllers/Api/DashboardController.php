<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get stock movement summary per week.
     *
     * @return JsonResponse
     */
    public function stockMovementPerWeek(): JsonResponse
    {
        // Ambil tanggal 8 minggu terakhir
        $startDate = Carbon::now()->subWeeks(8)->startOfWeek();

        // Ambil data transaksi, kelompokkan berdasarkan minggu dan tipe
        $transactions = ItemTransaction::select(
                DB::raw("YEAR(created_at) as year"),
                DB::raw("WEEK(created_at, 1) as week"), // 1 = minggu dimulai Senin
                'type',
                DB::raw("SUM(quantity) as total")
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('year', 'week', 'type')
            ->orderBy('year')
            ->orderBy('week')
            ->get();

        // Siapkan array data untuk frontend
        $labels = [];
        $dataIn = [];
        $dataOut = [];

        // Generate label minggu terakhir 8 minggu
        for ($i = 7; $i >= 0; $i--) {
            $week = Carbon::now()->subWeeks($i)->weekOfYear;
            $year = Carbon::now()->subWeeks($i)->year;
            $labels[] = "Week $week";

            $weekData = $transactions->where('week', $week)->where('year', $year);

            $dataIn[] = $weekData->where('type', 'in')->sum('total') ?? 0;
            $dataOut[] = $weekData->where('type', 'out')->sum('total') ?? 0;
        }

        return response()->json([
            'labels' => $labels,
            'data_in' => $dataIn,
            'data_out' => $dataOut,
        ]);
    }
}
