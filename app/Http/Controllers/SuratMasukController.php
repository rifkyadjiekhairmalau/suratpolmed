<?php

namespace App\Http\Controllers;

use App\Models\JenisSurat;
use App\Models\UrgensiSurat;
use App\Models\User;
use App\Models\SuratMasuk;
use App\Models\StatusSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SuratMasukController extends Controller
{
    /**
     * Menampilkan daftar surat masuk yang diajukan oleh pengguna yang sedang login.
     * Juga menyiapkan data master untuk form pengajuan surat baru.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();

        // Mengambil semua surat masuk yang diajukan oleh pengguna ini
        // Memuat semua relasi yang diperlukan untuk tampilan tabel dan detail
        $suratMasuk = SuratMasuk::with([
            'jenisSurat',          // Untuk nama jenis surat (dari ID)
            'urgensi',             // Untuk nama urgensi surat
            'tujuan',              // Untuk detail user tujuan
            'tujuan.jabatanStruktural', // Untuk jabatan struktural user tujuan
            'pengaju',             // Untuk detail user pengaju (jika ditampilkan)
            'tracking' => function ($query) {
                $query->latest(); // Memastikan entri tracking terbaru selalu di paling atas
            },
            'tracking.status',     // Untuk detail status surat dari tracking
            'tracking.user',       // Untuk user yang melakukan aksi tracking
            'tracking.dariUser',   // Untuk user 'dari' di tracking (disposisi)
            'tracking.keUser'      // Untuk user 'ke' di tracking (disposisi)
        ])
            ->where('pengaju_user_id', $user->id)
            ->orderByDesc('created_at') // Urutkan surat berdasarkan tanggal pengajuan terbaru
            ->get();

        // Mengambil jenis surat yang relevan dengan level user yang sedang login
        $jenisSurat = JenisSurat::where('level_user_id', $user->level_user_id)->get();
        // Mengambil semua daftar urgensi surat
        $urgensi = UrgensiSurat::all();

        // Mengambil user yang dapat menjadi tujuan surat (Direktur/Wakil Direktur dengan jabatan struktural tertentu)
        $levelDirekturDanWadir = [5, 6]; // Sesuaikan dengan level_user_id untuk Direktur dan Wadir di sistem Anda
        $jabatanFilter = [
            'Direktur',
            'Wakil Direktur Bidang Akademik',
            'Wakil Direktur Bidang Perencanaan, Keuangan, dan Umum',
            'Wakil Direktur Bidang Kemahasiswaan',
            'Wakil Direktur Bidang Kerjasama dan Hubungan Masyarakat',
        ];

        $tujuan = User::with('jabatanStruktural')
            ->whereIn('level_user_id', $levelDirekturDanWadir)
            ->whereHas('jabatanStruktural', function ($query) use ($jabatanFilter) {
                $query->whereIn('jabatan_struktural', $jabatanFilter);
            })
            ->get();

        // Mengirim data ke tampilan Inertia
        return Inertia::render('Pengaju/SuratMasuk/Index', [
            'suratMasuk' => $suratMasuk,
            'jenisSurat' => $jenisSurat,
            'urgensi' => $urgensi,
            'tujuan' => $tujuan,
            'user' => $user, // Mengirim data user yang sedang login
        ]);
    }

    /**
     * Menyimpan surat masuk baru ke database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validasi data input dari form
        $request->validate([
            // 'jenis_surat_id' dan 'jenis_surat_manual' ditangani dengan validasi custom di frontend
            'jenis_surat_id' => 'nullable|exists:jenis_surat,id', // Masih perlu divalidasi kalau ada ID
            'jenis_surat_manual' => 'nullable|string|max:255', // Untuk input manual
            'urgensi_surat_id' => 'required|exists:urgensi_surat,id',
            'tujuan_user_id' => 'required|exists:users,id',
            'tanggal_pengajuan' => 'required|date_format:Y-m-d', // Pastikan format YYYY-MM-DD
            'keterangan' => 'nullable|string|max:500',
            'nomor_surat' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048', // Maks 2MB
        ]);

        // Generate nomor agenda otomatis per tahun
        $tahun = now()->year;
        // Hitung jumlah surat masuk di tahun ini + 1 untuk nomor agenda baru
        $jumlahTahunIni = SuratMasuk::whereYear('created_at', $tahun)->count() + 1;
        $nomorAgenda = $jumlahTahunIni . '/' . $tahun;

        // Upload file jika ada
        $filePath = null;
        if ($request->hasFile('file_surat')) {
            $filePath = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        // Membuat entri baru di tabel surat_masuk
        $surat = SuratMasuk::create([
            'nomor_agenda' => $nomorAgenda,
            'jenis_surat_id' => $request->jenis_surat_id,
            'jenis_surat_manual' => $request->jenis_surat_manual,
            'urgensi_surat_id' => $request->urgensi_surat_id,
            'pengaju_user_id' => $user->id,
            'tujuan_user_id' => $request->tujuan_user_id,
            'tanggal_pengajuan' => $request->tanggal_pengajuan,
            'keterangan' => $request->keterangan,
            'nomor_surat' => $request->nomor_surat,
            'perihal' => $request->perihal,
            'file_path' => $filePath,
        ]);

        // Merekam status awal surat sebagai 'verifikasi'
        // Ini berarti begitu surat diajukan, statusnya langsung "Menunggu verifikasi bagian umum"
        $statusVerifikasi = StatusSurat::where('kode', 'verifikasi')->first();
        if ($statusVerifikasi) {
            $surat->tracking()->create([
                'status_surat_id' => $statusVerifikasi->id,
                'catatan' => 'Surat berhasil diajukan, menunggu verifikasi Bagian Umum.',
                'user_id' => $user->id, // User yang mengajukan surat ini
                // 'dari_user_id' dan 'ke_user_id' akan null pada tahap ini
            ]);
        }

        // Redirect kembali ke halaman indeks dengan pesan sukses
        return redirect()->route('pengaju.suratmasuk.index')->with('success', 'Surat berhasil diajukan!');
    }

    /**
     * Memperbarui detail surat masuk yang sudah ada.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        // Cari surat berdasarkan ID dan pastikan pengguna yang sedang login adalah pengaju surat
        $surat = SuratMasuk::where('id', $id)
            ->where('pengaju_user_id', $user->id)
            ->firstOrFail(); // Akan melempar 404 jika tidak ditemukan atau bukan milik user ini

        // Validasi data input untuk pembaruan
        $request->validate([
            'jenis_surat_id' => 'nullable|exists:jenis_surat,id',
            'jenis_surat_manual' => 'nullable|string|max:255',
            'urgensi_surat_id' => 'required|exists:urgensi_surat,id',
            'tujuan_user_id' => 'required|exists:users,id',
            'tanggal_pengajuan' => 'required|date_format:Y-m-d', // Pastikan format YYYY-MM-DD
            'keterangan' => 'nullable|string|max:500',
            'nomor_surat' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        // Tangani update file surat
        if ($request->hasFile('file_surat')) {
            // Hapus file lama jika ada
            if ($surat->file_path) {
                Storage::disk('public')->delete($surat->file_path);
            }
            // Simpan file baru
            $surat->file_path = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        // Perbarui data surat
        $surat->update([
            'jenis_surat_id' => $request->jenis_surat_id,
            'jenis_surat_manual' => $request->jenis_surat_manual,
            'urgensi_surat_id' => $request->urgensi_surat_id,
            'tujuan_user_id' => $request->tujuan_user_id,
            'tanggal_pengajuan' => $request->tanggal_pengajuan,
            'keterangan' => $request->keterangan,
            'nomor_surat' => $request->nomor_surat,
            'perihal' => $request->perihal,
            'file_path' => $surat->file_path, // Pastikan path file baru atau lama disimpan
        ]);

        // Redirect kembali ke halaman indeks dengan pesan sukses
        // Catatan: route 'surat-masuk.index' di update perlu disesuaikan dengan route yang benar
        return redirect()->route('pengaju.suratmasuk.index')->with('success', 'Surat berhasil diperbarui!');
    }
}
