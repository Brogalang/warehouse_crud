<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        Item::create(['nama_barang' => 'Mouse Wireless', 'sku' => 'MS-0001', 'stok' => 50, 'lokasi_rak' => 'A1-01']);
        Item::create(['nama_barang' => 'Keyboard Mechanical', 'sku' => 'KB-0001', 'stok' => 30, 'lokasi_rak' => 'A1-02']);
    }
}
