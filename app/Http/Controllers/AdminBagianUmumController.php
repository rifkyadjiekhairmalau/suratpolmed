<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\StatusSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminBagianUmumController extends Controller
{
    /**
     * Menampilkan dashboard Admin Bagian Umum dengan statistik
     * dan daftar surat yang belum diverifikasi.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        // Hitung total surat masuk
        $totalSuratMasuk = SuratMasuk::count();

        // Hitung total surat keluar
        $totalSuratKeluar = SuratKeluar::count();

        // Ambil ID status 'verifikasi'
        $statusVerifikasiId = StatusSurat::where('kode', 'verifikasi')->value('id');

        // Hitung jumlah surat yang belum diverifikasi
        // PERBAIKAN: Menggunakan whereRaw dengan alias eksplisit untuk korelasi
        $suratBelumVerifikasiCount = SuratMasuk::whereHas('tracking', function ($query) use ($statusVerifikasiId) {
            $query->where('status_surat_id', $statusVerifikasiId)
                ->whereRaw('tracking_surat.id = (SELECT MAX(t2.id) FROM tracking_surat AS t2 WHERE t2.surat_masuk_id = tracking_surat.surat_masuk_id)');
        })->count();

        // Mengambil daftar surat masuk yang belum diverifikasi (status terakhir 'verifikasi')
        // PERBAIKAN: Menggunakan whereRaw dengan alias eksplisit untuk korelasi
        $suratUntukVerifikasi = SuratMasuk::with([
            'jenisSurat',
            'urgensi',
            'tujuan',
            'tujuan.jabatanStruktural',
            'pengaju',
            'tracking' => function ($query) {
                $query->latest();
            }, // Memastikan entri tracking terbaru selalu di paling atas
            'tracking.status',
            'tracking.user',
            'tracking.dariUser',
            'tracking.keUser',
        ])
            ->whereHas('tracking', function ($query) use ($statusVerifikasiId) {
                $query->where('status_surat_id', $statusVerifikasiId)
                    ->whereRaw('tracking_surat.id = (SELECT MAX(t2.id) FROM tracking_surat AS t2 WHERE t2.surat_masuk_id = tracking_surat.surat_masuk_id)');
            })
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('AdminBagianUmum/Dashboard', [
            'totalSuratMasuk' => $totalSuratMasuk,
            'totalSuratKeluar' => $totalSuratKeluar,
            'suratBelumVerifikasiCount' => $suratBelumVerifikasiCount,
            'suratUntukVerifikasi' => $suratUntukVerifikasi,
            'adminUser' => Auth::user(),
        ]);
    }

    /**
     * Memproses verifikasi surat oleh Admin Bagian Umum.
     * Mengubah status surat menjadi 'disposisi' dan mencatatnya di tracking.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SuratMasuk  $suratMasuk Model SuratMasuk yang akan diverifikasi (route model binding)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(Request $request, SuratMasuk $suratMasuk)
    {
        $adminUser = Auth::user();

        // Opsional: Validasi apakah surat memang dalam status 'verifikasi'
        $latestTracking = $suratMasuk->tracking()->latest()->first();
        if (!$latestTracking || $latestTracking->status->kode !== 'verifikasi') {
            return redirect()->back()->with('error', 'Surat tidak dalam status untuk diverifikasi.');
        }

        // 1. Dapatkan user tujuan dari surat yang diverifikasi
        $userTujuan = $suratMasuk->tujuan; // Asumsi relasi 'tujuan' sudah ada di model SuratMasuk

        if (!$userTujuan || !$userTujuan->jabatanStruktural) {
            return redirect()->back()->with('error', 'Pejabat tujuan surat tidak ditemukan atau tidak memiliki jabatan.');
        }

        // 2. Buat nama status baru secara dinamis berdasarkan jabatan tujuan
        $namaJabatanTujuan = $userTujuan->jabatanStruktural->jabatan_struktural;
        $statusNamaBaru = 'Menunggu disposisi ' . $namaJabatanTujuan;
        $kodeStatusBaru = 'disposisi_' . strtolower(str_replace(' ', '_', $namaJabatanTujuan));

        // 3. Gunakan firstOrCreate untuk membuat status jika belum ada, atau ambil jika sudah ada.
        // Ini lebih aman daripada membuat status duplikat.
        $statusDisposisiBaru = StatusSurat::firstOrCreate(
            ['nama_status' => $statusNamaBaru],
            [
                'kode' => $kodeStatusBaru,
                'urutan' => 3, // Sesuaikan urutan jika perlu
                'final' => false
            ]
        );

        // 4. Buat entri tracking baru dengan status yang sudah dinamis
        $suratMasuk->tracking()->create([
            'status_surat_id' => $statusDisposisiBaru->id, // Gunakan ID dari status yang baru dibuat/ditemukan
            'catatan' => 'Surat diverifikasi oleh Bagian Umum, silahkan antar hardcopy surat ke Bagian Umum Gedung Z Lantai 1, diteruskan ke ' . $namaJabatanTujuan,
            'user_id' => $adminUser->id,
            'dari_user_id' => $adminUser->id,
            'ke_user_id' => $suratMasuk->tujuan_user_id,
        ]);

        // Redirect kembali ke dashboard (karena daftar verifikasi ada di dashboard sekarang)
        return redirect()->route('administrasi_umum.dashboard')->with('success', 'Surat berhasil diverifikasi dan diteruskan ke pejabat.');
    }

    /**
     * Memproses penolakan surat oleh Admin Bagian Umum.
     * Mengubah status surat menjadi 'ditolak' dan mencatatnya di tracking.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SuratMasuk  $suratMasuk Model SuratMasuk yang akan ditolak (route model binding)
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Request $request, SuratMasuk $suratMasuk)
    {
        // Validasi catatan penolakan
        $request->validate([
            'catatan_penolakan' => 'required|string|max:500',
        ]);

        $adminUser = Auth::user();

        // Opsional: Validasi apakah surat memang dalam status 'verifikasi'
        $latestTracking = $suratMasuk->tracking()->latest()->first();
        if (!$latestTracking || $latestTracking->status->kode !== 'verifikasi') {
            return redirect()->back()->with('error', 'Surat tidak dalam status untuk ditolak verifikasi.');
        }

        // Mendapatkan objek StatusSurat untuk 'ditolak'
        $statusDitolak = StatusSurat::where('kode', 'ditolak')->first();

        if ($statusDitolak) {
            // Membuat entri tracking baru untuk mencatat penolakan
            $suratMasuk->tracking()->create([
                'status_surat_id' => $statusDitolak->id, // Status berubah menjadi 'ditolak'
                'catatan' => 'Surat ditolak oleh Bagian Umum: ' . $request->catatan_penolakan,
                'user_id' => $adminUser->id, // User yang menolak (Admin Bagian Umum)
                'dari_user_id' => $adminUser->id, // Dari Admin Bagian Umum
                'ke_user_id' => $suratMasuk->pengaju_user_id, // Dikembalikan ke pengaju surat
            ]);
        } else {
            return redirect()->back()->with('error', 'Status "ditolak" tidak ditemukan di database.');
        }

        // Redirect kembali ke dashboard (karena daftar verifikasi ada di dashboard sekarang)
        return redirect()->route('administrasi_umum.dashboard')->with('success', 'Surat berhasil ditolak.');
    }

    /**
     * Menampilkan daftar surat masuk yang sudah diverifikasi oleh Admin Bagian Umum.
     *
     * @return \Inertia\Response
     */
    public function verifiedSuratMasukIndex()
    {
        $suratMasukTerverifikasi = SuratMasuk::with([
            'urgensi',
            'jenisSurat',
            'tujuan.jabatanStruktural',
            'pengaju',
            'tracking' => fn($q) => $q->latest(),
            'tracking.status',
            'tracking.user',
        ])
            ->whereHas('tracking', function ($query) {
                $query->whereIn('status_surat_id', function ($subQuery) {
                    $subQuery->select('id')
                        ->from('status_surat')
                        ->where('kode', '!=', 'verifikasi') // Kecualikan yang belum diverifikasi
                        ->where('kode', '!=', 'ditolak');    // Kecualikan yang sudah ditolak
                })
                    ->whereRaw('tracking_surat.id = (SELECT MAX(t2.id) FROM tracking_surat AS t2 WHERE t2.surat_masuk_id = tracking_surat.surat_masuk_id)');
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($surat) {
                $latestStatus = $surat->tracking->first();
                return [
                    'id' => $surat->id,
                    'no_agenda' => $surat->nomor_agenda,
                    'tgl_pengajuan' => $surat->created_at->translatedFormat('d F Y'),
                    'perihal' => $surat->perihal,
                    'jenis_surat' => $surat->jenisSurat->nama_jenis ?? 'N/A',
                    'pengaju' => $surat->pengaju->name ?? 'N/A',
                    'status_terkini' => $latestStatus->status->nama_status ?? 'N/A',
                    'ditujukan_kepada' => $surat->tujuan->jabatanStruktural->jabatan_struktural ?? 'N/A',
                    'urgensi' => $surat->urgensi->nama_urgensi ?? '',
                    'isi_surat' => $surat->keterangan,
                    'file_surat' => $surat->file_path ? Storage::url($surat->file_path) : '#',
                    'tracking_history' => $surat->tracking->map(fn($t) => [
                        'tanggal' => $t->created_at,
                        'aksi_oleh' => $t->user->name ?? 'Sistem',
                        'status' => $t->status->nama_status ?? 'N/A',
                        'catatan' => $t->catatan,
                    ]),
                ];
            });

        return Inertia::render('AdminBagianUmum/SuratMasuk/Terverifikasi', [
            // Nama prop diubah menjadi 'daftarSurat' agar lebih deskriptif
            'daftarSurat' => $suratMasukTerverifikasi,
        ]);
    }

    /**
     * Menampilkan daftar surat keluar.
     *
     * @return \Inertia\Response
     */
    public function suratKeluarIndex()
    {
        $suratKeluar = SuratKeluar::with('pengirim')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('AdminBagianUmum/SuratKeluar/Index', [
            'suratKeluar' => $suratKeluar,
            'adminUser' => Auth::user(),
        ]);
    }

    /**
     * Menyimpan surat keluar baru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function suratKeluarStore(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'nomor_surat' => 'required|string|max:100',
            'perihal_surat' => 'required|string|max:255',
            'tanggal_keluar' => 'required|date_format:Y-m-d',
            'tujuan' => 'required|string|max:255',
            'keterangan_tambahan' => 'nullable|string|max:500',
            'file_surat' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        $tahun = now()->year;
        $jumlahTahunIni = SuratKeluar::whereYear('created_at', $tahun)->count() + 1;
        $nomorAgenda = $jumlahTahunIni . '/' . $tahun;

        $filePath = null;
        if ($request->hasFile('file_surat')) {
            $filePath = $request->file('file_surat')->store('surat_keluar_files', 'public');
        }

        SuratKeluar::create([
            'nomor_agenda' => $nomorAgenda,
            'nomor_surat' => $request->nomor_surat,
            'perihal_surat' => $request->perihal_surat,
            'tanggal_keluar' => $request->tanggal_keluar,
            'tujuan' => $request->tujuan,
            'keterangan_tambahan' => $request->keterangan_tambahan,
            'file_surat' => $filePath,
            'pengirim_user_id' => $user->id,
        ]);

        return redirect()->route('administrasi_umum.suratkeluar.index')->with('success', 'Surat Keluar berhasil ditambahkan!');
    }

    /**
     * Memperbarui surat keluar.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SuratKeluar  $suratKeluar
     * @return \Illuminate\Http\RedirectResponse
     */
    public function suratKeluarUpdate(Request $request, SuratKeluar $suratKeluar)
    {
        $request->validate([
            'nomor_surat' => 'nullable|string|max:100',
            'perihal_surat' => 'required|string|max:255',
            'tanggal_keluar' => 'required|date_format:Y-m-d',
            'tujuan' => 'required|string|max:255',
            'keterangan_tambahan' => 'nullable|string|max:500',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file_surat')) {
            if ($suratKeluar->file_surat) {
                Storage::disk('public')->delete($suratKeluar->file_surat);
            }
            $suratKeluar->file_surat = $request->file('file_surat')->store('surat_keluar_files', 'public');
        }

        $suratKeluar->update([
            'nomor_surat' => $request->nomor_surat,
            'perihal_surat' => $request->perihal_surat,
            'tanggal_keluar' => $request->tanggal_keluar,
            'tujuan' => $request->tujuan,
            'keterangan_tambahan' => $request->keterangan_tambahan,
            'file_surat' => $suratKeluar->file_surat,
        ]);

        return redirect()->route('administrasi_umum.suratkeluar.index')->with('success', 'Surat Keluar berhasil diperbarui!');
    }

    /**
     * Menghapus surat keluar.
     *
     * @param  \App\Models\SuratKeluar  $suratKeluar
     * @return \Illuminate\Http\RedirectResponse
     */
    public function suratKeluarDestroy(SuratKeluar $suratKeluar)
    {
        if ($suratKeluar->file_surat) {
            Storage::disk('public')->delete($suratKeluar->file_surat);
        }
        $suratKeluar->delete();

        return redirect()->route('administrasi_umum.suratkeluar.index')->with('success', 'Surat Keluar berhasil dihapus!');
    }
}
