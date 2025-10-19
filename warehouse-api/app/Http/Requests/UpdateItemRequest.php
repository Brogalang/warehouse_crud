<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItemRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules(): array
    {
        $id = $this->route('id') ?? $this->route('item');

        return [
            'nama_barang' => 'sometimes|required|string|max:255',
            'sku' => ['sometimes','required','string','max:100', Rule::unique('items','sku')->ignore($id)],
            'stok' => 'sometimes|integer|min:0',
            'lokasi_rak' => 'nullable|string|max:255',
        ];
    }
}
