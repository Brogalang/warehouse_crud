<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $fillable = ['nama_barang', 'sku', 'stok', 'lokasi_rak'];

    protected $casts = [
        'stok' => 'integer',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(ItemTransaction::class);
    }
}
