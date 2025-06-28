<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MahasiswaController;


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
    return redirect()->route('login'); // Mengarahkan ke rute 'login'
})->name('home');


// --- ROUTE UNTUK TESTING (BISA DIHAPUS NANTI) ---
// Ini akan digantikan oleh rute dashboard spesifik per level
// Route::get('dashboard-admin', function () {
//     return Inertia::render('Admin/Dashboard');
// })->name('admin.dashboard');


// ========================================================================
// GROUP UNTUK SEMUA ROUTE YANG MEMBUTUHKAN LOGIN
// ========================================================================

Route::middleware(['auth', 'verified'])->group(function () {
    // Rute Profil (umum untuk semua yang login)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Dashboard Umum: Mengarahkan ke dashboard spesifik sesuai level user
     Route::get('/dashboard', function (Request $request) {
        $userLevel = $request->user()->levelUser->nama_level ?? null; // Asumsi relasi levelUser

        switch ($userLevel) {
            case 'administrator': return redirect()->route('admin.dashboard');
            case 'mahasiswa': return redirect()->route('mahasiswa.dashboard');
            case 'pegawai': return redirect()->route('pegawai.dashboard');
            case 'administrasi umum': return redirect()->route('administrasi_umum.dashboard');
            case 'direktur': return redirect()->route('direktur.dashboard');
            case 'wakil direktur': return redirect()->route('wakil_direktur.dashboard');
            case 'kepala bagian': return redirect()->route('kepala_bagian.dashboard');
            case 'kepala sub bagian': return redirect()->route('kepala_sub_bagian.dashboard');
            default: return Inertia::render('Welcome'); // Halaman default jika level tidak dikenal
        }
    })->name('dashboard');
});


// ========================================================================
// GROUP ROUTE UNTUK ADMINISTRATOR
// ========================================================================
Route::middleware(['auth', 'verified', 'level:administrator'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard Administrator
    Route::get('dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard'); // Akan menjadi 'admin.dashboard'

    // Manajemen Pengguna (Users) - Khusus Administrator
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggleStatus');

    // Manajemen Mahasiswa - Khusus Administrator
    Route::get('mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::post('mahasiswa', [MahasiswaController::class, 'store'])->name('mahasiswa.store');
    Route::put('mahasiswa/{id}', [MahasiswaController::class, 'update'])->name('mahasiswa.update');
    Route::delete('mahasiswa/{id}', [MahasiswaController::class, 'destroy'])->name('mahasiswa.destroy');

    // Manajemen Pegawai - Khusus Administrator
    Route::get('/pegawai', [PegawaiController::class, 'index'])->name('pegawai.index');
    Route::post('/pegawai', [PegawaiController::class, 'store'])->name('pegawai.store');
    Route::put('/pegawai/{id}', [PegawaiController::class, 'update'])->name('pegawai.update');
    Route::delete('/pegawai/{id}', [PegawaiController::class, 'destroy'])->name('pegawai.destroy');

});


// // ========================================================================
// // GROUP UNTUK SEMUA ROUTE YANG MEMBUTUHKAN LOGIN
// // ========================================================================
// Route::middleware(['auth', 'verified'])->group(function () {

//     // ROUTE DEFAULT SETELAH LOGIN
//     Route::get('dashboard', function () {
//         return Inertia::render('Admin/Dashboard'); // Ini sudah benar
//     })->name('dashboard');

//     // --- ROUTE UNTUK ADMIN ---
//     Route::prefix('admin')->name('admin.')->group(function () {
//         // Route untuk Manajemen Pengguna
//         Route::get('users', function() {
//             return Inertia::render('Admin/Pengguna/index'); // Mengarahkan ke Admin/Pengguna/index.jsx
//         })->name('users.index');

//         // Route untuk Manajemen Mahasiswa
//         Route::get('mahasiswa', function() {
//             return Inertia::render('Admin/Mahasiswa/index'); // Mengarahkan ke Admin/Mahasiswa/index.jsx
//         })->name('mahasiswa.index');

//         // --- PENAMBAHAN ROUTE UNTUK MANAJEMEN PEGAWAI ---
//         Route::get('pegawai', function() {
//             return Inertia::render('Admin/Pegawai/index'); // Mengarahkan ke Admin/Pegawai/index.jsx
//         })->name('pegawai.index');
//         // --- AKHIR PENAMBAHAN ---
//     });

//     // --- ROUTE UNTUK PENGAJU ---
//     Route::get('dashboard-pengaju', function () {
//         $dummySurat = [
//             ['id' => 1, 'perihal' => 'Permohonan Izin Penelitian', 'tanggal_pengajuan' => '2025-06-08', 'status_terkini' => 'Didisposisikan ke Wadir PKU'],
//             ['id' => 2, 'perihal' => 'Surat Keterangan Aktif Kuliah', 'tanggal_pengajuan' => '2025-06-05', 'status_terkini' => 'Selesai (Ambil Surat di TU)'],
//         ];
//         return Inertia::render('Pengaju/Dashboard', [
//             'surat' => $dummySurat
//         ]);
//     })->name('pengaju.dashboard');

//     Route::get('surat/ajukan', function () {
//         return Inertia::render('Surat/Create');
//     })->name('surat.create');

//     Route::get('notifikasi', function () {
//         return Inertia::render('Pengaju/Dashboard');
//     })->name('notifications.index');

//     // --- ROUTE UNTUK KEPALA BAGIAN ---
//     Route::get('dashboard-kabag', function () {
//         return Inertia::render('KepalaBagian/Dashboard');
//     })->name('kabag.dashboard');

//     Route::get('notifikasi-kabag', function () {
//         return Inertia::render('KepalaBagian/Dashboard');
//     })->name('kabag.notifications');

//     // --- ROUTE UNTUK DIREKTUR ---
//     Route::get('dashboard-direktur', function () {
//         return Inertia::render('Direktur/Dashboard');
//     })->name('direktur.dashboard');

//     Route::get('notifikasi-direktur', function () {
//         return Inertia::render('Direktur/Dashboard');
//     })->name('direktur.notifications');

//     // --- ROUTE UNTUK WAKIL DIREKTUR ---
//     Route::get('dashboard-wadir', function () {
//         return Inertia::render('WakilDirektur/Dashboard');
//     })->name('wadir.dashboard');

//     Route::get('notifikasi-wadir', function () {
//         return Inertia::render('WakilDirektur/Dashboard');
//     })->name('wadir.notifications');

//     // --- ROUTE UNTUK TATA USAHA (TU) ---
//     Route::get('dashboard-tu', function () {
//         $dummySuratData = [
//             'S/2025/005' => ['no_agenda' => 'S/2025/005', 'tgl_pengajuan' => '2025-06-02', 'perihal' => 'Permohonan Izin Kunjungan Industri', 'pengaju' => 'Mahasiswa Cici', 'status_terkini' => 'Diajukan ke Direktur (Menunggu Verifikasi TU)'],
//             'S/2025/006' => ['no_agenda' => 'S/2025/006', 'tgl_pengajuan' => '2025-06-01', 'perihal' => 'Surat Undangan Rapat Kerja', 'pengaju' => 'Dosen Doni', 'status_terkini' => 'Diajukan ke Wadir PKU (Menunggu Verifikasi TU)'],
//         ];
//         return Inertia::render('TU/Dashboard', [
//             'suratMenungguVerifikasi' => array_values($dummySuratData),
//             'semuaSurat' => array_values($dummySuratData)
//         ]);
//     })->name('tu.dashboard');

//     Route::get('tu/surat-masuk', function () {
//         return Inertia::render('TU/SemuaSuratMasuk');
//     })->name('tu.surat-masuk');

//     Route::get('tu/surat-keluar', function () {
//         return Inertia::render('TU/SuratKeluar');
//     })->name('tu.surat-keluar');

//     Route::get('notifikasi-tu', function () {
//         return Inertia::render('TU/Notifikasi');
//     })->name('tu.notifications');

//     // --- ROUTE UNTUK KASUBAG ---
//     Route::get('dashboard-kasubag', function () {
//         return Inertia::render('Kasubag/Dashboard');
//     })->name('kasubag.dashboard');

// });

// FILE ROUTE TAMBAHAN
require __DIR__.'/auth.php';
// require __DIR__.'/settings.php';
