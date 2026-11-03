# 🍵 Komorebi Café & Roastery (木漏れ日 喫茶)
### Full Stack Minimalist Japanese Cafe Management Platform

Aplikasi web manajemen kafe profesional, modern, responsif, dan full-stack dengan estetika **Minimalist Japanese Cafe (Wabi-Sabi)**. Memiliki frontend pelanggan lengkap, dashboard pengelola/admin terpadu, backend API, sistem reservasi meja anti double-booking, pemesanan menu online & pelacakan status, serta fitur unggulan **Pencarian Foto Produk Otomatis**.

---

## 📸 Fitur Utama

### 1. Desain & Estetika Japanese Wabi-Sabi
- Palet warna hangat: Background cream (`#FAF7F2`), beige (`#E8DDCB`), sage green (`#536B54`), secondary putih, dan teks dark charcoal (`#232724`).
- Tipografi modern dan elegan dengan aksen kanji otentik (木漏れ日 喫茶).
- Sudut rounded halus (`rounded-2xl`, `rounded-3xl`), bayangan lembut, dan micro-interactions.
- Tampilan 100% responsif di desktop, tablet, dan smartphone.

### 2. Multilingual & Kompatibilitas Google Chrome Translate
- **Bahasa Indonesia sebagai bahasa utama & default**.
- Mendukung peralihan ke **English** secara instan via header toggle (disimpan di `localStorage`).
- **Kompatibel Penuh dengan Google Chrome Translate**:
  - Semantic HTML standar (`<html lang="id">`, `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
  - Tidak memblokir / menonaktifkan fitur terjemahan Chrome.
  - Bebas atribut `notranslate`.
  - Semua teks dirender sebagai teks HTML asli yang dapat dibaca browser.

### 3. Dynamic Cafe Settings (Sinkronisasi Realtime)
Admin dapat mengatur identitas kafe secara dinamis dan langsung sinkron ke seluruh website:
- Nama kafe & nama kanji Jepang
- Tagline & deskripsi filosofi kafe
- Ganti / upload logo kafe
- Ganti banner hero homepage
- Alamat & tautan Google Maps
- Nomor WhatsApp pemesanan (terintegrasi otomatis ke link wa.me)
- Jam operasional (hari kerja & akhir pekan)
- Warna primer branding

### 4. Automatic Product Image Search (Fitur Unggulan)
- Ketika admin mengetik nama produk (misal: *"Iced Matcha Latte"*, *"Souffle Pancake"*, *"Dorayaki"*, *"Cold Brew"*), sistem otomatis mencari dan menampilkan pilihan foto relevan.
- Didukung oleh Unsplash API & kurasi koleksi foto kuliner Jepang berkualitas tinggi.
- Preview foto langsung ditampilkan.
- Pilihan multiple thumbnail foto rekomendasi.
- Mendukung upload manual file foto dari perangkat.
- CRUD produk lengkap: tambah, edit harga, kelola stok, varian (ukuran, tingkat kemanisan, es, susu oat/fresh milk), dan toggle ketersediaan (*Tersedia* / *Habis*).

### 5. Sistem Booking Meja Online & Anti Double-Booking
- Customer memilih tanggal, jam kunjungan (slot 09:00 - 21:00), jumlah tamu, area meja (Tatami, Main Hall, Garden Terrace, Bar Counter).
- **Validasi Anti Double-Booking**: Sistem mencegah pemesanan ganda pada meja dan waktu yang sama. Jika slot telah terisi, sistem memberikan peringatan ramah dan menyarankan meja/jam alternatif.
- Konfirmasi instan via WhatsApp.
- Admin dapat melihat, mengonfirmasi, menolak (disertai alasan), dan melakukan check-in reservasi.

### 6. Sistem Pemesanan Menu & Pelacakan Pesanan (Order Management)
- Customer dapat memilih varian minuman/makanan, kustomisasi gula, es, dan susu.
- Opsi *Makan di Tempat (Dine-In)* dengan pilihan nomor meja, atau *Bawa Pulang (Takeaway)*.
- Metode pembayaran: **QRIS** (dilengkapi popup simulasi QRIS & timer pembayaran), Transfer Bank, atau Bayar di Kasir.
- Halaman Pelacakan Pesanan (`/track`): status real-time (*Confirmed* -> *Preparing* -> *Ready* -> *Completed*).
- Kirim rincian pesanan langsung ke WhatsApp kasir kafe.
- Admin dapat mencetak struk thermal kasir (*Thermal Receipt Print*).

### 7. Dashboard Admin & Analitik Finansial
Sidebar navigasi lengkap:
1. **Overview**: Total omset pendapatan, total pesanan, total produk, total reservasi, grafik tren omset mingguan, produk terlaris, pesanan terbaru.
2. **Products**: Pengelolaan katalog menu & pencarian foto otomatis.
3. **Categories**: Pengelolaan kategori & urutan menu.
4. **Orders**: Pengelolaan antrean pesanan dapur/barista & cetak struk.
5. **Bookings**: Manajemen reservasi meja & balas WhatsApp tamu.
6. **Tables**: Tata ruang meja kafe, kapasitas, dan area duduk.
7. **Customers**: Database riwayat pelanggan, total order, dan akumulasi belanja.
8. **Transactions**: Log mutasi transaksi masuk.
9. **Reports**: Analitik omset harian, mingguan, bulanan, **Export ke file CSV**, dan **Cetak PDF**.
10. **Cafe Settings**: Pengaturan identitas dan jam buka kafe.
11. **Language Settings**: Kamus translasi & verifikasi kompatibilitas Chrome.
12. **Admin Profile**: Keamanan, ganti password, dan info sistem.

---

## 📁 Struktur Folder Proyek

```
kafe/
├── data/
│   └── db.json                    # Persistent local storage (auto fallback)
├── public/                        # Aset statis & favicon
├── src/
│   ├── app/
│   │   ├── (customer routes)
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── menu/page.tsx      # Halaman Menu Lengkap
│   │   │   ├── booking/page.tsx   # Halaman Reservasi Meja
│   │   │   ├── checkout/page.tsx  # Halaman Checkout & Pembayaran
│   │   │   ├── track/page.tsx     # Halaman Lacak Pesanan Realtime
│   │   │   ├── about/page.tsx     # Halaman Filosofi & Tentang Kafe
│   │   │   ├── gallery/page.tsx   # Halaman Galeri Foto
│   │   │   └── contact/page.tsx   # Halaman Kontak & Lokasi
│   │   ├── admin/
│   │   │   ├── layout.tsx         # Layout Admin & Sidebar
│   │   │   ├── page.tsx           # Overview Dashboard
│   │   │   ├── products/page.tsx  # Manajemen Produk & Auto Image Search
│   │   │   ├── categories/page.tsx# Manajemen Kategori
│   │   │   ├── orders/page.tsx    # Manajemen Pesanan & Struk Kasir
│   │   │   ├── bookings/page.tsx  # Manajemen Reservasi Meja
│   │   │   ├── tables/page.tsx    # Manajemen Meja & Kapasitas
│   │   │   ├── customers/page.tsx # Database Pelanggan
│   │   │   ├── transactions/page.tsx # Log Transaksi Finansial
│   │   │   ├── reports/page.tsx   # Laporan, Export CSV & Print PDF
│   │   │   ├── settings/page.tsx  # Dynamic Cafe Settings
│   │   │   ├── language/page.tsx  # Pengaturan Bahasa & Chrome Translate
│   │   │   ├── profile/page.tsx   # Profil Admin & Keamanan
│   │   │   └── login/page.tsx     # Halaman Login Admin
│   │   ├── api/                   # RESTful API Endpoints
│   │   │   ├── settings/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── products/route.ts
│   │   │   ├── bookings/route.ts
│   │   │   ├── orders/route.ts
│   │   │   ├── tables/route.ts
│   │   │   ├── reports/route.ts
│   │   │   ├── auth/login/route.ts
│   │   │   ├── auth/logout/route.ts
│   │   │   ├── admin/search-images/route.ts
│   │   │   └── admin/upload-image/route.ts
│   │   ├── globals.css            # Tailwind CSS v4 & theme variables
│   │   └── layout.tsx             # Root layout dengan lang="id" & Provider
│   ├── components/                # Reusable UI Components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductModal.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── QRISModal.tsx
│   │   ├── HomeClient.tsx
│   │   ├── MenuClient.tsx
│   │   ├── BookingClient.tsx
│   │   ├── CheckoutClient.tsx
│   │   ├── TrackClient.tsx
│   │   └── admin/                 # Admin specific components
│   ├── context/
│   │   ├── LanguageContext.tsx    # Multilingual provider & state
│   │   └── CartContext.tsx        # Shopping cart provider & calculations
│   ├── lib/
│   │   ├── db.ts                  # Dual Database Layer (Supabase + Local fallback)
│   │   ├── supabase.ts            # Supabase Client & Admin Init
│   │   ├── seed-data.ts           # Initial seed data kafe Jepang
│   │   ├── translations.ts        # Indonesian & English dictionary
│   │   └── image-search.ts        # Unsplash API & curated image search engine
│   └── types/
│       └── index.ts               # TypeScript data definitions & models
├── supabase/
│   └── schema.sql                 # PostgreSQL Schema, RLS, Indexes, & Tables
├── .env.example                   # Contoh konfigurasi environment
├── package.json
└── README.md
```

---

## 🛠️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** versi 18 ke atas (Direkomendasikan Node.js 20 atau 22+)
- **NPM** atau PNPM / Yarn

### 2. Clone atau Buka Folder Proyek
```bash
cd c:\Users\user\Desktop\kafe
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser di:
- **Website Pelanggan**: [http://localhost:3000](http://localhost:3000)
- **Portal Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

> **Kredensial Default Login Admin:**
> - Email: `admin@komorebi.id`
> - Kata Sandi: `adminpassword123`

---

## 🗄️ Panduan Konfigurasi Supabase PostgreSQL

Aplikasi ini menggunakan arsitektur **Smart Dual-Engine**:
- Secara bawaan, aplikasi telah dilengkapi *Persistent Local Data Engine* sehingga **langsung berfungsi 100% tanpa perlu konfigurasi awal**.
- Ketika Anda ingin menghubungkannya ke cloud database Supabase:

1. Buat akun & proyek baru di [https://supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor** di dashboard Supabase.
3. Buka file `supabase/schema.sql` di proyek ini, salin seluruh kodenya, lalu klik **Run** di SQL Editor Supabase.
   - Script ini otomatis membuat tabel `cafe_settings`, `categories`, `products`, `product_images`, `tables`, `bookings`, `orders`, `order_items`, `customers`, `transactions`, `translations`, index pencegah double-booking, serta Row Level Security (RLS).
4. Buat Storage Bucket bernama `products` dengan public access aktif.
5. Masuk ke **Project Settings -> API**, lalu salin:
   - `Project URL` ke `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` ke `SUPABASE_SERVICE_ROLE_KEY`
6. Masukkan nilai tersebut ke file `.env.local`.

---

## 🔍 Panduan API Image Search (Unsplash)

Sistem pencarian foto otomatis telah dilengkapi kurasi galeri internal berkualitas tinggi untuk makanan & minuman kafe Jepang.

Untuk mengaktifkan pencarian live tak terbatas ke jutaan foto di Unsplash:
1. Daftar akun developer gratis di [https://unsplash.com/developers](https://unsplash.com/developers).
2. Buat aplikasi baru untuk mendapatkan **Access Key**.
3. Masukkan ke file `.env.local`:
   ```env
   UNSPLASH_ACCESS_KEY="kunci_akses_unsplash_anda"
   ```
4. Restart server Next.js. Sekarang saat admin mengetik nama produk apa pun di menu produk, sistem akan otomatis melakukan pencarian foto langsung dari Unsplash API!

---

## 🚀 Panduan Deployment (Vercel / Cloud)

Aplikasi Next.js App Router ini dioptimalkan untuk di-deploy ke Vercel atau server Node.js:

### Deploy ke Vercel:
1. Push repository ke GitHub / GitLab.
2. Buka [https://vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Import repository kafe ini.
4. Pada bagian **Environment Variables**, tambahkan variabel dari `.env.example`.
5. Klik **Deploy**. Website kafe Anda langsung online dengan HTTPS aktif!

---

## 🛡️ Keamanan & Validasi
- Proteksi otentikasi admin berbasis sesi cookie terenkripsi.
- Pencegahan bentrok jadwal meja (*Double-booking prevention*) menggunakan validasi level database.
- Input validation pada seluruh server-side API handlers.
- Sanitasi input dan proteksi data pribadi pemesan.
#   k a f e  
 