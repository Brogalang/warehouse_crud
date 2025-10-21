# Warehouse Management System (WMS) CRUD Sederhana

Sistem **Warehouse Management System (WMS)** ini terdiri dari tiga komponen utama:  
- **Backend** menggunakan **Laravel**  
- **Frontend** menggunakan **React.js**  
- **Database** menggunakan **MySQL 8**

Semua layanan dijalankan menggunakan **Docker Compose**, sehingga mudah di-deploy dan dikembangkan di berbagai lingkungan.

---

## Fitur Utama Sistem WMS

- **Notifikasi Stok Minimum:** Otomatis mendeteksi produk low stock dan memberi alert ke warehouse & procurement manager.  
- **Automasi Minimum Stock:** Menghitung minimum stock berdasarkan data historis dan lead time supplier dengan safety stock dinamis.  
- **Prediksi Kebutuhan Bulanan:** Memperkirakan pengeluaran barang tiap bulan berdasarkan tren, pola rata-rata, dan faktor musiman.  
- **Dashboard Interaktif:** Menampilkan status stok, low stock alert, dan rekomendasi pengadaan.

---

## Cara Menjalankan Aplikasi

### 1. **Kebutuhan Sistem**
Pastikan sudah terpasang di komputer kamu:
- [Docker](https://www.docker.com/) (versi 20+)
- [Docker Compose](https://docs.docker.com/compose/) (versi 1.29+)
- Git *(opsional, jika clone dari repository)*

---

### 2. **Clone Repository**
```bash
git clone https://github.com/Brogalang/warehouse_crud.git
cd warehouse_crud
 ```




### Kontributor
Galang Satria Wibowo  
galang.s.wibowo@gmail.com  
https://github.com/Brogalang