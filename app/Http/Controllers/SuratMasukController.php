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
     * Menampilkan daftar surat masuk.
     */
    public function index()
    {
        // $user = Auth::user()->load('levelUser');
        // Kode yang Diperbaiki
        $user = User::with('levelUser')->find(Auth::id());

        $suratMasuk = SuratMasuk::with([
            'jenisSurat',
            'urgensi',
            'tujuan',
            'tujuan.jabatanStruktural',
            'pengaju',
            'tracking' => fn($q) => $q->latest(),
            'tracking.status',
            'tracking.user.levelUser',
            'tracking.dariUser.levelUser',
            'tracking.keUser.levelUser'
        ])
            ->where('pengaju_user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        $jenisSurat = JenisSurat::where('level_user_id', $user->level_user_id)->get();
        $urgensi = UrgensiSurat::all();

        $levelDirekturDanWadir = [5, 6];
        $jabatanFilter = [
            'Direktur',
            'Wakil Direktur Bidang Akademik',
            'Wakil Direktur Bidang Perencanaan, Keuangan, dan Umum',
            'Wakil Direktur Bidang Kemahasiswaan',
            'Wakil Direktur Bidang Kerjasama dan Hubungan Masyarakat',
        ];

        $tujuan = User::with('jabatanStruktural')
            ->whereIn('level_user_id', $levelDirekturDanWadir)
            ->whereHas('jabatanStruktural', fn($q) => $q->whereIn('jabatan_struktural', $jabatanFilter))
            ->get();

        return Inertia::render('Pengaju/SuratMasuk/Index', [
            'suratMasuk' => $suratMasuk,
            'jenisSurat' => $jenisSurat,
            'urgensi' => $urgensi,
            'tujuan' => $tujuan,
            'user' => $user,
        ]);
    }

    /**
     * Menyimpan surat masuk baru.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // ====================================================================
        // LOGIKA BARU: Jika ada jenis surat manual, buat entri baru
        // ====================================================================
        if ($request->input('jenis_surat_id') === 'other' && $request->filled('jenis_surat_manual')) {
            // Cek dulu apakah jenis surat manual ini sudah ada, biar gak duplikat
            $existingJenis = JenisSurat::firstOrCreate(
                ['nama_jenis' => $request->input('jenis_surat_manual')],
                ['level_user_id' => $user->level_user_id]
            );

            // Timpa request dengan ID yang baru atau yang sudah ada
            $request->merge(['jenis_surat_id' => $existingJenis->id]);
        }
        // ====================================================================

        // Validasi sekarang lebih ketat, karena ID pasti ada
        $validatedData = $request->validate([
            'jenis_surat_id' => 'required|exists:jenis_surat,id', // Diubah jadi required
            'jenis_surat_manual' => 'nullable|string|max:255',
            'urgensi_surat_id' => 'required|exists:urgensi_surat,id',
            'tujuan_user_id' => 'required|exists:users,id',
            'tanggal_pengajuan' => 'required|date_format:Y-m-d',
            'keterangan' => 'nullable|string|max:500',
            'nomor_surat' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'file_surat' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        $tahun = now()->year;
        $jumlahTahunIni = SuratMasuk::whereYear('created_at', $tahun)->count() + 1;
        $nomorAgenda = $jumlahTahunIni . '/' . $tahun;

        $validatedData['nomor_agenda'] = $nomorAgenda;
        $validatedData['pengaju_user_id'] = $user->id;

        if ($request->hasFile('file_surat')) {
            $validatedData['file_path'] = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        $surat = SuratMasuk::create($validatedData);

        $statusVerifikasi = StatusSurat::where('kode', 'verifikasi')->first();
        if ($statusVerifikasi) {
            $surat->tracking()->create([
                'status_surat_id' => $statusVerifikasi->id,
                'catatan' => 'Surat berhasil diajukan, menunggu verifikasi Bagian Umum.',
                'user_id' => $user->id,
            ]);
        }

        return redirect()->route('pengaju.suratmasuk.index')->with('success', 'Surat berhasil diajukan!');
    }

    /**
     * Memperbarui detail surat masuk.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $surat = SuratMasuk::where('id', $id)->where('pengaju_user_id', $user->id)->firstOrFail();

        // ====================================================================
        // LOGIKA BARU DI-APPLY DI SINI JUGA
        // ====================================================================
        if ($request->input('jenis_surat_id') === 'other' && $request->filled('jenis_surat_manual')) {
            $existingJenis = JenisSurat::firstOrCreate(
                ['nama_jenis' => $request->input('jenis_surat_manual')],
                ['level_user_id' => $user->level_user_id]
            );
            $request->merge(['jenis_surat_id' => $existingJenis->id]);
        }
        // ====================================================================

        $validatedData = $request->validate([
            'jenis_surat_id' => 'required|exists:jenis_surat,id',
            'jenis_surat_manual' => 'nullable|string|max:255',
            'urgensi_surat_id' => 'required|exists:urgensi_surat,id',
            'tujuan_user_id' => 'required|exists:users,id',
            'tanggal_pengajuan' => 'required|date_format:Y-m-d',
            'keterangan' => 'nullable|string|max:500',
            'nomor_surat' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'file_surat' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        $validatedData['file_path'] = $surat->file_path; // Bawa path file lama
        if ($request->hasFile('file_surat')) {
            if ($surat->file_path) {
                Storage::disk('public')->delete($surat->file_path);
            }
            $validatedData['file_path'] = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        $surat->update($validatedData);

        return redirect()->route('pengaju.suratmasuk.index')->with('success', 'Surat berhasil diperbarui!');
    }
}
