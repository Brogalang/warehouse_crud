<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules(): array
    {
        return [
            'nama_barang' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:items,sku',
            'stok' => 'nullable|integer|min:0',
            'lokasi_rak' => 'nullable|string|max:255',
        ];
    }
}
