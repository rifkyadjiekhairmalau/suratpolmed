<?php

namespace App\Http\Controllers;

use App\Models\SuratMasuk;
use App\Models\StatusSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KasubagController extends Controller
{
    /**
     * Menampilkan halaman surat yang MENUNGGU tindak lanjut oleh Kasubag.
     */
    public function menunggu()
    {
        $user = Auth::user();
        $jabatan = $user->jabatanStruktural->jabatan_struktural ?? '';
        $namaStatus = 'Menunggu Tindak Lanjut oleh ' . $jabatan;

        $relationsToLoad = [
            'pengaju',
            'jenisSurat',
            'urgensi',
            'latestTracking', // Cukup panggil ini, karena sub-relasinya sudah otomatis dimuat oleh model
            'tracking' => fn($q) => $q->with(['status', 'user', 'dariUser', 'keUser'])->latest(),
        ];

        $suratMenunggu = SuratMasuk::with($relationsToLoad)
            ->whereHas('latestTracking.status', fn($q) => $q->where('nama_status', $namaStatus))
            ->get();

        return Inertia::render('Kasubag/Menunggu', [
            'suratMenunggu' => $suratMenunggu,
        ]);
    }

    /**
     * Menampilkan halaman RIWAYAT surat yang SUDAH ditindaklanjuti oleh Kasubag.
     */
    public function riwayat()
    {
        $user = Auth::user();

        // Terapkan perbaikan yang sama di sini
        $relationsToLoad = [
            'pengaju',
            'jenisSurat',
            'urgensi',
            'latestTracking', // Cukup panggil ini
            'tracking' => fn($q) => $q->with(['status', 'user', 'dariUser', 'keUser'])->latest(),
        ];

        $suratSudahTindakLanjut = SuratMasuk::whereHas('tracking', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->whereHas('status', fn($q_status) => $q_status->where('kode', 'selesai'));
        })
            ->with($relationsToLoad)
            ->get();

        return Inertia::render('Kasubag/Riwayat', [
            'suratSudahTindakLanjut' => $suratSudahTindakLanjut,
        ]);
    }

    /**
     * Menyelesaikan surat dan menyimpan catatan tindak lanjut.
     */
    public function selesaikan(Request $request, SuratMasuk $suratMasuk)
    {
        $request->validate([
            'catatan_tindak_lanjut' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        DB::beginTransaction();
        try {
            $statusSelesai = StatusSurat::firstOrCreate(
                ['kode' => 'selesai'],
                ['nama_status' => 'Selesai', 'urutan' => 5, 'final' => true]
            );

            $suratMasuk->tracking()->create([
                'status_surat_id' => $statusSelesai->id,
                'catatan' => $request->catatan_tindak_lanjut,
                'user_id' => $user->id,
            ]);

            DB::commit();

            return redirect()->route('kasubag.riwayat')->with('success', 'Surat berhasil ditindaklanjuti dan diselesaikan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyelesaikan surat: ' . $e->getMessage()]);
        }
    }
}
