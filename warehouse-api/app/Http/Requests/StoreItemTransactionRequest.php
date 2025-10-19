<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemTransactionRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules(): array
    {
        return [
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'reference' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ];
    }
}
