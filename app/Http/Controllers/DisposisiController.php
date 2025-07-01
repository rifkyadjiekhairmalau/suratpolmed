<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\StatusSurat;
use App\Models\TrackingSurat;
use App\Models\CatatanDisposisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DisposisiController extends Controller
{
    public function menunggu()
    {
        $user = Auth::user();
        $jabatan = $user->jabatanStruktural->jabatan_struktural ?? '';
        $namaStatus = 'Menunggu disposisi ' . $jabatan;

        $relationsToLoad = [
            'pengaju',
            'jenisSurat',
            'urgensi',
            'disposisi',
            'latestTracking.status',
            'tracking' => function ($query) {
                $query->with(['status', 'user', 'dariUser', 'keUser'])->latest();
            },
        ];

        $suratMenunggu = SuratMasuk::with($relationsToLoad)
            ->whereHas('latestTracking.status', fn($q) => $q->where('nama_status', $namaStatus))
            ->get();

        $tujuanDisposisi = $this->getTujuanDisposisi();
        $catatanDisposisi = CatatanDisposisi::all();

        return Inertia::render('Disposisi/Menunggu', [
            'suratMenunggu' => $suratMenunggu,
            'tujuanDisposisi' => $tujuanDisposisi,
            'catatanDisposisi' => $catatanDisposisi,
        ]);
    }

    public function riwayat()
    {
        $user = Auth::user();

        $relationsToLoad = [
            'pengaju',
            'jenisSurat',
            'urgensi',
            'disposisi',
            'latestTracking.status',
            'tracking' => function ($query) {
                $query->with(['status', 'user', 'dariUser', 'keUser'])->latest();
            },
        ];

        $suratSudahDisposisi = SuratMasuk::whereHas('disposisi', fn($q) => $q->where('dari_user_id', $user->id))
            ->with($relationsToLoad)
            ->get();

        return Inertia::render('Disposisi/Riwayat', [
            'suratSudahDisposisi' => $suratSudahDisposisi,
        ]);
    }

    public function getTujuanDisposisi()
    {
        $user = Auth::user();
        $level = strtolower($user->levelUser->nama_level ?? '');

        // PENTING: Sesuaikan ID ini dengan yang ada di tabel `level_users` Anda
        $levelDirekturId = 5;
        $levelWadirId = 6;
        $levelKabagId = 7;
        $levelKasubagId = 8; // Asumsi ID untuk Kepala Sub Bagian

        $query = User::query()->with('jabatanStruktural');

        if ($level === 'direktur') {
            // Direktur hanya bisa disposisi ke user dengan LEVEL 'wakil direktur'
            $daftarJabatan = [
                'Wakil Direktur Bidang Akademik',
                'Wakil Direktur Bidang Perencanaan, Keuangan, dan Umum',
                'Wakil Direktur Bidang Kemahasiswaan',
                'Wakil Direktur Bidang Kerjasama dan Hubungan Masyarakat',
            ];
            $query->where('level_user_id', $levelWadirId)
                ->whereHas('jabatanStruktural', fn($q) => $q->whereIn('jabatan_struktural', $daftarJabatan));
        } elseif ($level === 'wakil direktur') {
            // Wakil Direktur bisa ke Direktur, Wadir lain, atau Kepala Bagian
            $query->where(function ($q) use ($levelDirekturId, $levelWadirId, $levelKabagId) {
                // Kondisi untuk Direktur (LEVEL direktur DAN JABATAN direktur)
                $q->orWhere(function ($subQ) use ($levelDirekturId) {
                    $subQ->where('level_user_id', $levelDirekturId)
                        ->whereHas('jabatanStruktural', fn($q2) => $q2->where('jabatan_struktural', 'Direktur'));
                });
                // Kondisi untuk Wakil Direktur (LEVEL wadir DAN JABATAN wadir)
                $q->orWhere(function ($subQ) use ($levelWadirId) {
                    $daftarJabatanWadir = ['Wakil Direktur Bidang Akademik', 'Wakil Direktur Bidang Perencanaan, Keuangan, dan Umum', 'Wakil Direktur Bidang Kemahasiswaan', 'Wakil Direktur Bidang Kerjasama dan Hubungan Masyarakat'];
                    $subQ->where('level_user_id', $levelWadirId)
                        ->whereHas('jabatanStruktural', fn($q2) => $q2->whereIn('jabatan_struktural', $daftarJabatanWadir));
                });
                // Kondisi untuk Kepala Bagian (LEVEL kabag DAN JABATAN kabag)
                $q->orWhere(function ($subQ) use ($levelKabagId) {
                    $daftarJabatanKabag = ['Kepala Bagian Perencanaan, Keuangan, dan Umum', 'Kepala Bagian Akademik, Kemahasiswaan, dan Kerjasama'];
                    $subQ->where('level_user_id', $levelKabagId)
                        ->whereHas('jabatanStruktural', fn($q2) => $q2->whereIn('jabatan_struktural', $daftarJabatanKabag));
                });
            });
        } elseif ($level === 'kepala bagian') {
            // Kepala Bagian hanya bisa disposisi ke user dengan LEVEL 'kepala sub bagian'
            $daftarJabatan = ['Kepala Sub Bagian Umum', 'Kepala Sub Bagian Akademik'];
            $query->where('level_user_id', $levelKasubagId)
                ->whereHas('jabatanStruktural', fn($q) => $q->whereIn('jabatan_struktural', $daftarJabatan));
        } else {
            return collect();
        }

        // Jangan tampilkan diri sendiri di dalam dropdown
        $query->where('id', '!=', $user->id);

        return $query->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'surat_masuk_id' => 'required|exists:surat_masuk,id',
            'ke_user_id' => 'required|exists:users,id',
            'catatan_disposisi_id' => 'nullable|exists:catatan_disposisi,id',
            'catatan_manual' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        DB::beginTransaction();
        try {
            $catatanFinal = null;
            if ($request->filled('catatan_manual')) {
                $catatanFinal = $request->catatan_manual;
            } elseif ($request->filled('catatan_disposisi_id')) {
                $catatanTerpilih = CatatanDisposisi::find($request->catatan_disposisi_id);
                if ($catatanTerpilih) {
                    $catatanFinal = $catatanTerpilih->isi_catatan;
                }
            }

            Disposisi::create([
                'surat_masuk_id' => $request->surat_masuk_id,
                'dari_user_id' => $user->id,
                'ke_user_id' => $request->ke_user_id,
                'catatan_disposisi_id' => $request->catatan_disposisi_id,
                'catatan_manual' => $request->catatan_manual,
            ]);

            // --- PERBAIKAN UTAMA DI SINI ---
            // Ambil data user tujuan beserta level dan jabatannya
            $userTujuan = User::with(['jabatanStruktural', 'levelUser'])->findOrFail($request->ke_user_id);
            $namaTujuan = $userTujuan->jabatanStruktural->jabatan_struktural ?? $userTujuan->name;
            $levelTujuan = strtolower($userTujuan->levelUser->nama_level ?? '');

            $statusNama = '';
            $kodeStatusBaru = '';

            // Cek apakah tujuan adalah Kepala Sub Bagian
            if ($levelTujuan === 'kepala sub bagian') {
                // Jika ya, statusnya adalah "Menunggu Tindak Lanjut"
                $statusNama = 'Menunggu Tindak Lanjut oleh ' . $namaTujuan;
                $kodeStatusBaru = 'tindak_lanjut_' . strtolower(str_replace(' ', '_', $namaTujuan));
            } else {
                // Jika bukan, gunakan format "Menunggu disposisi" seperti biasa
                $statusNama = 'Menunggu disposisi ' . $namaTujuan;
                $kodeStatusBaru = 'disposisi_' . strtolower(str_replace(' ', '_', $namaTujuan));
            }

            $status = StatusSurat::firstOrCreate(
                ['nama_status' => $statusNama],
                [
                    'kode' => $kodeStatusBaru,
                    'urutan' => 5, // Urutan bisa disesuaikan
                    'final' => false,
                ]
            );
            // --- AKHIR PERBAIKAN ---

            TrackingSurat::create([
                'surat_masuk_id' => $request->surat_masuk_id,
                'status_surat_id' => $status->id,
                'user_id' => $user->id,
                'dari_user_id' => $user->id,
                'ke_user_id' => $request->ke_user_id,
                'catatan' => $catatanFinal,
            ]);

            DB::commit();

            return redirect()->route('disposisi.riwayat')->with('success', 'Disposisi berhasil diberikan dan tracking dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memberikan disposisi: ' . $e->getMessage()]);
        }
    }
}
