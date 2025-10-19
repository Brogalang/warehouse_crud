<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Item::all();
        return response()->json($items);
    }

    public function store(StoreItemRequest $request): JsonResponse
    {
        $item = Item::create($request->validated());
        return response()->json($item, 201);
    }

    public function show($id): JsonResponse
    {
        $item = Item::find($id);
        if (!$item) return response()->json(['message' => 'Item not found'], 404);
        return response()->json($item);
    }

    public function update(UpdateItemRequest $request, $id): JsonResponse
    {
        $item = Item::find($id);
        if (!$item) return response()->json(['message' => 'Item not found'], 404);

        $item->update($request->validated());
        return response()->json($item);
    }

    public function destroy($id): JsonResponse
    {
        $item = Item::find($id);
        if (!$item) return response()->json(['message' => 'Item not found'], 404);

        $item->delete();
        return response()->json(['message' => 'Item deleted']);
    }
}
