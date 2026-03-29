Berikut adalah **Product Requirements Document (PRD)** yang disusun berdasarkan spesifikasi teknis dan kebutuhan bisnis Anda. Dokumen ini dirancang untuk pengembangan menggunakan *stack* **Next.js (Fullstack)**, **MySQL**, **Prisma**, **shadcn/ui**, **Tailwind**, **React Query**, dan **Zod**.

# ---

**Product Requirements Document (PRD): QurbanQR Platform**

**Status:** Draft | **Versi:** 1.0 | **Owner:** Fahmi Abdillah | **Tanggal:** 29 Maret 2026

## ---

**1\. Ringkasan Proyek**

Aplikasi web ini dirancang untuk mendigitalisasi inventaris hewan kurban (sapi/kambing) agar calon pembeli dapat melihat detail spesifik hewan secara transparan melalui pemindaian QR Code di kandang maupun melalui katalog online. Aplikasi ini memfasilitasi komunikasi langsung ke penjual via WhatsApp dan manajemen data inventaris bagi pemilik.

## **2\. Target Pengguna**

1. **Publik (Calon Pembeli):** Mengakses halaman profil hewan tanpa login untuk melihat spesifikasi, foto, dan video timbang.  
2. **Admin (Pemilik):** Mengelola data hewan, mengunggah media ke VPS, mencetak barcode, dan memantau status penjualan.

## **3\. Fitur Utama (Functional Requirements)**

### **A. Fitur Publik (User Facing)**

* **Katalog Hewan:** Menampilkan daftar sapi dan kambing yang tersedia.  
* **Profil Hewan (Scan QR):** Halaman detail yang menampilkan:  
  * Kode unik hewan (e.g., SAPI-001).  
  * Bobot riil (kg) dan Usia.  
  * Galeri foto dan **Video proses penimbangan**.  
  * Status ketersediaan (**Available** atau **Sold Out**).  
* **Integrasi WhatsApp:** Tombol "Hubungi Penjual" yang otomatis mengisi teks pesan berdasarkan data hewan yang dilihat.

### **B. Fitur Admin (Management)**

* **Manajemen Inventaris:** CRUD (Create, Read, Update, Delete) data hewan menggunakan form tervalidasi.  
* **Media Management:** Upload foto dan video langsung ke penyimpanan lokal VPS.  
* **Sistem QR Code:** Otomatis generate QR code yang mengarah ke URL unik setiap hewan.  
* **Cetak Barcode:** Fitur *print-friendly* untuk mencetak label QR yang akan ditempel di kandang.  
* **Laporan Sales:** Dashboard sederhana untuk melihat statistik hewan terjual dan total pendapatan (Tunai/WA).

## ---

**4\. Spesifikasi Teknis (Technical Stack)**

| Komponen | Teknologi | Keterangan |
| :---- | :---- | :---- |
| **Framework** | Next.js (App Router) | Fullstack (Frontend & Backend). |
| **Database** | MySQL | Penyimpanan data relasional. |
| **ORM** | Prisma | Manajemen skema database dan *query*. |
| **UI Library** | shadcn/ui & Tailwind CSS | Komponen UI modern dan responsif. |
| **State & Fetching** | React Query (TanStack) | Manajemen *caching* dan sinkronisasi data server. |
| **Validation** | Zod | Validasi skema pada form dan API. |
| **Storage** | VPS Local Storage | Video dan foto disimpan di direktori /public/uploads atau folder statis VPS. |

## ---

**5\. Skema Data (Data Schema)**

### **Model: Animal**

* id: String (CUID/UUID) \- Primary Key.  
* code: String (Unique) \- Kode fisik hewan.  
* type: Enum (SAPI, KAMBING).  
* weight: Float \- Berat dalam KG.  
* age: String \- Deskripsi usia.  
* price: Decimal \- Harga jual.  
* photoUrl: String \- Path file foto di VPS.  
* videoUrl: String \- Path file video timbang di VPS.  
* status: Enum (AVAILABLE, SOLD\_OUT).

## ---

**6\. Alur Kerja (User Journey)**

### **Alur Admin:**

1. Admin login ke dashboard.  
2. Mengisi form data hewan baru (Input: Kode, Berat, Usia, Harga).  
3. Mengunggah foto dan video proses timbang (Zod melakukan validasi tipe file).  
4. Klik "Simpan", data masuk ke MySQL via Prisma.  
5. Klik "Cetak QR", sistem menampilkan halaman QR code untuk ditempel di kandang.

### **Alur Pembeli:**

1. Pembeli melihat sapi di kandang dan melakukan scan QR Code menggunakan HP.  
2. Browser mengarahkan ke halaman profil publik hewan tersebut.  
3. Pembeli melihat detail dan menonton video penimbangan sebagai bukti transparansi.  
4. Pembeli klik "Hubungi via WhatsApp" untuk negosiasi atau konfirmasi pembelian.  
5. Pembelian diselesaikan secara tunai atau transfer (di luar sistem).

## ---

**7\. Keamanan & Akses**

* **Halaman Profil:** Terbuka untuk umum (Public Access).  
* **Halaman Admin:** Dilindungi oleh autentikasi (Next-Auth atau Middleware) agar hanya pemilik yang bisa mengubah data dan melihat laporan sales.

## ---

**8\. Kriteria Penerimaan (Acceptance Criteria)**

* QR Code harus mengarah ke URL yang valid dan menampilkan data yang sesuai dengan ID sapi.  
* Status "Sold Out" harus segera terlihat secara *real-time* setelah admin melakukan update.  
* Video penimbangan harus dapat diputar di perangkat *mobile* (Android/iOS) dengan lancar dari VPS.  
* Form input harus menolak data jika ada kolom wajib yang kosong (Validasi Zod).