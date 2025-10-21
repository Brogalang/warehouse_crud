
📁 Struktur Project.
├── warehouse-api/          # Source code backend (Laravel)
├── warehouse-frontend/     # Source code frontend (React)
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Dokumentasi proyek

🚀 Cara Menjalankan Aplikasi
1. Kebutuhan Sistem

Pastikan sudah terpasang di komputer kamu:

Docker
 (versi 20+)

Docker Compose
 (versi 1.29+)

Git (opsional, jika clone dari repository)


2. Clone Repository
git clone https://github.com/Brogalang/warehouse_crud.git
cd warehouse_crud

3. Build & Jalankan Semua Layanan
docker compose up --build


4. Akses Aplikasi
Layanan	URL	Keterangan
🧠 Backend (Laravel API)	http://localhost:8000
	API utama
⚛️ Frontend (React.js)	http://localhost:3000
	Antarmuka pengguna
🗄️ MySQL Database	localhost:3307	Port database (root/secret)


📬 Kontributor

Galang Satria Wibowo
galang.s.wibowo@gmail.com
🔗 https://github.com/Brogalang