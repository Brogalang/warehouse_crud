<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Item;
use App\Models\ItemTransaction;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // === USERS ===
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('123456'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@staff.com'],
            [
                'name' => 'Staff',
                'password' => Hash::make('123456'),
                'role' => 'staff',
            ]
        );

        // === ITEMS ===
        $items = [
            ['nama_barang' => 'Masker Medis', 'sku' => 'MSK001', 'stok' => 100, 'lokasi_rak' => 'A1'],
            ['nama_barang' => 'Sarung Tangan', 'sku' => 'SGT001', 'stok' => 150, 'lokasi_rak' => 'B2'],
            ['nama_barang' => 'Face Shield', 'sku' => 'FSD001', 'stok' => 75,  'lokasi_rak' => 'C3'],
        ];

        foreach ($items as $index => $itemData) {
            // Jika sudah ada item dengan SKU ini, ambil saja tanpa insert baru
            $item = \App\Models\Item::firstOrCreate(
                ['sku' => $itemData['sku']],
                $itemData
            );

            // Tambahkan transaksi masuk sebagian dari stok
            $inQuantity = min(20, $item->stok);

            \App\Models\ItemTransaction::create([
                'item_id' => $item->id,
                'type' => 'in',
                'quantity' => $inQuantity,
                'reference' => 'PO-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'note' => 'Stok awal ditambahkan oleh seeder',
            ]);
        }

        $this->command->info('✅ Seeder berhasil dijalankan! Data admin, staff, item, dan transaksi sudah dibuat.');
    }
}
