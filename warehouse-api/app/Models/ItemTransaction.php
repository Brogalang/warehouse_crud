<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemTransaction extends Model
{
    protected $fillable = ['item_id', 'type', 'quantity', 'reference', 'note'];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
