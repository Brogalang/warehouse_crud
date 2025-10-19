<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemTransactionRequest;
use App\Models\Item;
use App\Models\ItemTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ItemTransactionController extends Controller
{
    // buat transaksi (in/out) yang otomatis update stok
    public function store(StoreItemTransactionRequest $request, $itemId): JsonResponse
    {
        $data = $request->validated();

        return DB::transaction(function () use ($itemId, $data) {
            // lock row untuk menghindari race condition
            $item = Item::where('id', $itemId)->lockForUpdate()->first();

            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }

            $quantity = (int) $data['quantity'];
            if ($data['type'] === 'out') {
                // validasi stok tidak boleh minus
                if ($item->stok < $quantity) {
                    return response()->json(['message' => 'Insufficient stock'], 422);
                }
                $item->stok -= $quantity;
            } else { // type == in
                $item->stok += $quantity;
            }

            // simpan perubahan stok
            $item->save();

            // simpan record transaksi
            $transaction = ItemTransaction::create([
                'item_id' => $item->id,
                'type' => $data['type'],
                'quantity' => $quantity,
                'reference' => $data['reference'] ?? null,
                'note' => $data['note'] ?? null,
            ]);

            return response()->json([
                'item' => $item,
                'transaction' => $transaction,
            ], 201);
        });
    }

    // list transaksi item
    public function index($itemId): JsonResponse
    {
        $item = Item::find($itemId);
        if (!$item) return response()->json(['message' => 'Item not found'], 404);

        $tx = $item->transactions()->orderBy('created_at','desc')->paginate(20);
        return response()->json($tx);
    }

    // Update transaksi
    public function update(StoreItemTransactionRequest $request, ItemTransaction $transaction): JsonResponse
    {
        $data = $request->validated();

        return DB::transaction(function () use ($transaction, $data) {
            $item = Item::where('id', $transaction->item_id)->lockForUpdate()->first();

            if (!$item) return response()->json(['message' => 'Item not found'], 404);

            // rollback stok lama
            if ($transaction->type === 'in') $item->stok -= $transaction->quantity;
            else $item->stok += $transaction->quantity;

            // hitung stok baru
            if ($data['type'] === 'in') $item->stok += $data['quantity'];
            else {
                if ($item->stok < $data['quantity'])
                    return response()->json(['message' => 'Insufficient stock'], 422);
                $item->stok -= $data['quantity'];
            }

            $item->save();
            $transaction->update($data);

            return response()->json(['transaction' => $transaction, 'item' => $item]);
        });
    }

    // Delete transaksi
    public function destroy(ItemTransaction $transaction): JsonResponse
    {
        return DB::transaction(function () use ($transaction) {
            $item = Item::where('id', $transaction->item_id)->lockForUpdate()->first();
            if (!$item) return response()->json(['message' => 'Item not found'], 404);

            // rollback stok
            if ($transaction->type === 'in') $item->stok -= $transaction->quantity;
            else $item->stok += $transaction->quantity;

            $item->save();
            $transaction->delete();

            return response()->json(['message' => 'Transaction deleted']);
        });
    }

}
