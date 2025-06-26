<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sinilah Anda bisa mendaftarkan route untuk aplikasi Anda.
|
*/

// RUTE HALAMAN UTAMA (HOMEPAGE)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// --- ROUTE UNTUK TESTING (BISA DIHAPUS NANTI) ---
Route::get('dashboard-admin', function () {
    return Inertia::render('Admin/Dashboard');
})->name('admin.dashboard');


// ========================================================================
// GROUP UNTUK SEMUA ROUTE YANG MEMBUTUHKAN LOGIN
// ========================================================================
Route::middleware(['auth', 'verified'])->group(function () {

    // ROUTE DEFAULT SETELAH LOGIN
    Route::get('dashboard', function () {
        return Inertia::render('Admin/Dashboard'); // Ini sudah benar
    })->name('dashboard');

    // --- ROUTE UNTUK ADMIN ---
    Route::prefix('admin')->name('admin.')->group(function () {
        // Route untuk Manajemen Pengguna
        Route::get('users', function() {
            return Inertia::render('Admin/Pengguna/index'); // Mengarahkan ke Admin/Pengguna/index.jsx
        })->name('users.index');

        // Route untuk Manajemen Mahasiswa
        Route::get('mahasiswa', function() {
            return Inertia::render('Admin/Mahasiswa/index'); // Mengarahkan ke Admin/Mahasiswa/index.jsx
        })->name('mahasiswa.index');

        // --- PENAMBAHAN ROUTE UNTUK MANAJEMEN PEGAWAI ---
        Route::get('pegawai', function() {
            return Inertia::render('Admin/Pegawai/index'); // Mengarahkan ke Admin/Pegawai/index.jsx
        })->name('pegawai.index');
        // --- AKHIR PENAMBAHAN ---
    });

    // --- ROUTE UNTUK PENGAJU ---
    Route::get('dashboard-pengaju', function () {
        $dummySurat = [
            ['id' => 1, 'perihal' => 'Permohonan Izin Penelitian', 'tanggal_pengajuan' => '2025-06-08', 'status_terkini' => 'Didisposisikan ke Wadir PKU'],
            ['id' => 2, 'perihal' => 'Surat Keterangan Aktif Kuliah', 'tanggal_pengajuan' => '2025-06-05', 'status_terkini' => 'Selesai (Ambil Surat di TU)'],
        ];
        return Inertia::render('Pengaju/Dashboard', [
            'surat' => $dummySurat
        ]);
    })->name('pengaju.dashboard');

    Route::get('surat/ajukan', function () {
        return Inertia::render('Surat/Create');
    })->name('surat.create');

    Route::get('notifikasi', function () {
        return Inertia::render('Pengaju/Dashboard');
    })->name('notifications.index');

    // --- ROUTE UNTUK KEPALA BAGIAN ---
    Route::get('dashboard-kabag', function () {
        return Inertia::render('KepalaBagian/Dashboard');
    })->name('kabag.dashboard');

    Route::get('notifikasi-kabag', function () {
        return Inertia::render('KepalaBagian/Dashboard');
    })->name('kabag.notifications');

    // --- ROUTE UNTUK DIREKTUR ---
    Route::get('dashboard-direktur', function () {
        return Inertia::render('Direktur/Dashboard');
    })->name('direktur.dashboard');

    Route::get('notifikasi-direktur', function () {
        return Inertia::render('Direktur/Dashboard');
    })->name('direktur.notifications');

    // --- ROUTE UNTUK WAKIL DIREKTUR ---
    Route::get('dashboard-wadir', function () {
        return Inertia::render('WakilDirektur/Dashboard');
    })->name('wadir.dashboard');

    Route::get('notifikasi-wadir', function () {
        return Inertia::render('WakilDirektur/Dashboard');
    })->name('wadir.notifications');

    // --- ROUTE UNTUK TATA USAHA (TU) ---
    Route::get('dashboard-tu', function () {
        $dummySuratData = [
            'S/2025/005' => ['no_agenda' => 'S/2025/005', 'tgl_pengajuan' => '2025-06-02', 'perihal' => 'Permohonan Izin Kunjungan Industri', 'pengaju' => 'Mahasiswa Cici', 'status_terkini' => 'Diajukan ke Direktur (Menunggu Verifikasi TU)'],
            'S/2025/006' => ['no_agenda' => 'S/2025/006', 'tgl_pengajuan' => '2025-06-01', 'perihal' => 'Surat Undangan Rapat Kerja', 'pengaju' => 'Dosen Doni', 'status_terkini' => 'Diajukan ke Wadir PKU (Menunggu Verifikasi TU)'],
        ];
        return Inertia::render('TU/Dashboard', [
            'suratMenungguVerifikasi' => array_values($dummySuratData),
            'semuaSurat' => array_values($dummySuratData)
        ]);
    })->name('tu.dashboard');

    Route::get('tu/surat-masuk', function () {
        return Inertia::render('TU/SemuaSuratMasuk');
    })->name('tu.surat-masuk');

    Route::get('tu/surat-keluar', function () {
        return Inertia::render('TU/SuratKeluar');
    })->name('tu.surat-keluar');

    Route::get('notifikasi-tu', function () {
        return Inertia::render('TU/Notifikasi');
    })->name('tu.notifications');

    // --- ROUTE UNTUK KASUBAG ---
    Route::get('dashboard-kasubag', function () {
        return Inertia::render('Kasubag/Dashboard');
    })->name('kasubag.dashboard');

});

// FILE ROUTE TAMBAHAN
require __DIR__.'/auth.php';
// require __DIR__.'/settings.php';