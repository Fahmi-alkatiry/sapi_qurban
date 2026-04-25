Saran-saran yang kamu berikan sangat tajam dan membuat sistem ini jauh lebih siap untuk skala produksi (*production-ready*). Dengan menggunakan **Cloudinary**, kamu tidak perlu pusing memikirkan manajemen file di server, dan **NextAuth.js** adalah standar emas untuk keamanan di ekosistem Next.js.

Berikut adalah pembaruan **PRD v3.0** yang sudah mengintegrasikan semua poin teknis tersebut:

---

# Product Requirements Document (PRD) - Sapi Qurban Daengmakku (v3.0)

| Project Name | Sapi Qurban Daengmakku (Web Catalog & Custom QR System) |
| :--- | :--- |
| **Tech Stack** | Next.js (App Router), Prisma, MySQL, NextAuth.js, Cloudinary, GoQR API |
| **Target User** | Calon Pembeli (Public), Admin/Owner (Authenticated) |

---

## 1. Spesifikasi Otentikasi & Keamanan (Admin)
Mengingat aplikasi ini ditujukan untuk owner tunggal/tim kecil, kita akan menggunakan sistem login sederhana namun aman.
* **Provider:** **NextAuth.js (Credentials Provider)**.
* **Auth Flow:** Admin melakukan login menggunakan *username* dan *password* yang tersimpan di environment variable atau tabel khusus `User`.
* **Proteksi Route:** Seluruh folder `/admin/*` akan diproteksi menggunakan Middleware Next.js agar tidak bisa diakses tanpa sesi yang valid.

## 2. Manajemen Media & Storage
Untuk menjaga performa web tetap ringan dan cepat:
* **Provider:** **Cloudinary**.
* **Fungsi:** * Menyimpan foto sapi (mendukung banyak foto per sapi).
    * Optimasi gambar otomatis (WebP/AVIF format) untuk mempercepat *loading* di HP pembeli.
    * Admin melakukan upload langsung dari dashboard ke Cloudinary (Client-side upload atau Server Action).

## 3. Fitur Filter & Sorting (Phase 3)
Untuk mempermudah pembeli saat jumlah sapi sudah banyak:
* **Sorting:**
    * Harga: Terendah ke Tertinggi & sebaliknya.
    * Bobot: Terberat ke Teringan.
* **Filtering:**
    * **Jenis Sapi:** (Limosin, Bali, Simental, dll).
    * **Status:** Toggle "Tampilkan yang Tersedia Saja".

## 4. Integrasi WhatsApp (Template Pesan)
Sistem akan men-generate link WhatsApp otomatis dengan format pesan:
> *"Halo Admin Daengmakku, saya tertarik dengan sapi jenis **[Breed]** dengan nomor tag **[TagNumber]**. Apakah masih tersedia? Berikut linknya: **[URL_DETAIL]**"*

---

## 5. Struktur Data (Prisma Schema - Revised)

```prisma
model Cattle {
  id           String   @id @default(cuid())
  tagNumber    String   @unique
  breed        String
  weight       Float    // Dalam KG
  ageInMonths  Int      // Disimpan dalam bulan untuk kemudahan filtering
  price        Decimal
  youtubeId    String?  // ID Video YouTube
  imageUrls    String   // Disimpan sebagai String (JSON stringify) atau model terpisah
  status       Status   @default(AVAILABLE)
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt // Melacak perubahan terakhir (misal: saat terjual)
}

enum Status {
  AVAILABLE
  SOLD
}

model User {
  id       String @id @default(cuid())
  username String @unique
  password String // Hashed password
}
```

---

## 6. Persyaratan Fungsional yang Diperbarui

### 6.1 Dashboard Admin (Enhanced)
1.  **Login Page:** Form sederhana untuk akses admin.
2.  **Upload Center:** Integrasi widget Cloudinary untuk upload foto sapi.
3.  **QR Generator:** Form input ukuran (pixel) -> Fetch GoQR API -> Preview & Download.
4.  **Inventory Overview:** Tabel dengan indikator `updatedAt` untuk melihat kapan data terakhir diperbarui.

### 6.2 Halaman Katalog Publik (Enhanced)
1.  **Search Bar:** Mencari berdasarkan nomor tag.
2.  **Filter Sidebar/Dropdown:** Berdasarkan jenis dan bobot.
3.  **Card Sapi:** Menampilkan foto utama, tag harga, bobot, dan label "SOLD" jika status sudah terjual.

---

## 7. Strategi Implementasi Umur (Age)
Sesuai saranmu, `age` disimpan dalam `Int` (bulan).
* **Input Admin:** Admin memasukkan "24" (bulan).
* **Display User:** Sistem melakukan konversi otomatis di frontend: 
    * `24 bulan` -> `2 Tahun`.
    * `18 bulan` -> `1 Tahun 6 Bulan`.
* **Keuntungan:** Kamu bisa menambahkan filter *"Sapi usia > 2 tahun"* dengan logika `where: { ageInMonths: { gt: 24 } }`.

---

PRD ini sudah sangat komprehensif untuk level project *freelance* atau bisnis pribadi. 

Karena kamu menggunakan **NextAuth**, apakah kamu berencana menggunakan sistem **Environment Variables** untuk menyimpan satu akun admin saja, atau ingin dibuatkan fitur registrasi admin di dalam database juga?