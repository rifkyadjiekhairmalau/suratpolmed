<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\SuratMasukController;
use App\Http\Controllers\AdminBagianUmumController;
use App\Http\Controllers\KasubagController;

// RUTE HALAMAN UTAMA (HOMEPAGE)
Route::get('/', function () {
    return redirect()->route('login'); // Mengarahkan ke rute 'login'
})->name('home');

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
        $userLevel = $request->user()->levelUser->nama_level ?? null;

        switch ($userLevel) {
            case 'administrator':
                return redirect()->route('admin.dashboard');
            case 'mahasiswa':
            case 'pegawai':
                return redirect()->route('pengaju.suratmasuk.index');
            case 'administrasi umum':
                return redirect()->route('administrasi_umum.dashboard');
            case 'direktur':
            case 'wakil direktur':
            case 'kepala bagian':
                return redirect()->route('disposisi.menunggu');
            case 'kepala sub bagian':
                return redirect()->route('kasubag.menunggu');
            default:
                return Inertia::render('Welcome');
        }
    })->name('dashboard');

    // ========================================================================
    // GROUP ROUTE UNTUK ADMINISTRATOR
    // ========================================================================
    Route::middleware(['auth', 'verified', 'level:administrator'])->prefix('admin')->name('admin.')->group(function () {

        // Dashboard Administrator
        Route::get('dashboard', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');

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


    // ========================================================================
    // GROUP ROUTE UNTUK MAHASISWA DAN PEGAWAI
    // ========================================================================

    Route::middleware(['auth', 'verified', 'level:mahasiswa,pegawai'])->prefix('pengaju')->name('pengaju.')->group(function () {
        Route::get('suratmasuk', [SuratMasukController::class, 'index'])->name('suratmasuk.index');
        Route::post('suratmasuk', [SuratMasukController::class, 'store'])->name('suratmasuk.store');
        Route::put('suratmasuk/{id}', [SuratMasukController::class, 'update'])->name('suratmasuk.update');
    });

    // ========================================================================
    // >>>>>>> GROUP ROUTE BARU UNTUK ADMINISTRASI UMUM (ADMIN BAGIAN UMUM) <<<<<<<
    // ========================================================================
    Route::middleware(['auth', 'verified', 'level:administrasi umum'])->prefix('administrasi-umum')->name('administrasi_umum.')->group(function () {

        // Dashboard Admin Bagian Umum (akan menampilkan statistik DAN daftar surat belum verifikasi)
        Route::get('dashboard', [AdminBagianUmumController::class, 'dashboard'])->name('dashboard');

        // Rute Aksi Verifikasi dan Penolakan Surat Masuk
        Route::post('suratmasuk/{suratMasuk}/verify', [AdminBagianUmumController::class, 'verify'])->name('suratmasuk.verify');
        Route::post('suratmasuk/{suratMasuk}/reject', [AdminBagianUmumController::class, 'reject'])->name('suratmasuk.reject');

        // Daftar Surat Masuk yang Sudah Terverifikasi (halaman terpisah dari dashboard)
        Route::get('suratmasuk/terverifikasi', [AdminBagianUmumController::class, 'verifiedSuratMasukIndex'])->name('suratmasuk.terverifikasi.index');

        // CRUD Surat Keluar
        Route::get('suratkeluar', [AdminBagianUmumController::class, 'suratKeluarIndex'])->name('suratkeluar.index');
        Route::post('suratkeluar', [AdminBagianUmumController::class, 'suratKeluarStore'])->name('suratkeluar.store');
        Route::put('suratkeluar/{suratKeluar}', [AdminBagianUmumController::class, 'suratKeluarUpdate'])->name('suratkeluar.update');
        Route::delete('suratkeluar/{suratKeluar}', [AdminBagianUmumController::class, 'suratKeluarDestroy'])->name('suratkeluar.destroy');
    });

    // ========================================================================
    // >>>>>>> GROUP ROUTE BARU UNTUK PROSES DISPOSISI (PIMPINAN) <<<<<<<
    // ========================================================================
    Route::middleware(['auth', 'verified', 'level:direktur,wakil direktur,kepala bagian'])
        ->prefix('disposisi')
        ->name('disposisi.')
        ->group(function () {

            // Halaman untuk surat yang menunggu disposisi
            Route::get('/menunggu', [DisposisiController::class, 'menunggu'])->name('menunggu');

            // Halaman untuk riwayat surat yang sudah didisposisi
            Route::get('/riwayat', [DisposisiController::class, 'riwayat'])->name('riwayat');

            // Route untuk menyimpan data dari form disposisi (tetap sama)
            Route::post('/', [DisposisiController::class, 'store'])->name('store');
        });

    // ========================================================================
    // >>>>>>> GROUP ROUTE BARU UNTUK KEPALA SUB BAGIAN (KASUBAG) <<<<<<<
    // ========================================================================
    Route::middleware(['auth', 'verified', 'level:kepala sub bagian'])
        ->prefix('kasubag')
        ->name('kasubag.')
        ->group(function () {

            // Halaman untuk surat yang menunggu tindak lanjut
            Route::get('/menunggu', [KasubagController::class, 'menunggu'])->name('menunggu');

            // Halaman untuk riwayat surat yang sudah ditindaklanjuti
            Route::get('/riwayat', [KasubagController::class, 'riwayat'])->name('riwayat');

            // Route untuk memproses dan menyelesaikan surat
            Route::post('/{suratMasuk}/selesaikan', [KasubagController::class, 'selesaikan'])->name('selesaikan');
        });


});

require __DIR__ . '/auth.php';
// require __DIR__.'/settings.php';
