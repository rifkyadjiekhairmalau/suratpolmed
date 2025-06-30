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
    public function index()
    {
        $user = Auth::user();

        $suratMasuk = SuratMasuk::with([
            'jenisSurat',
            'urgensi',
            'tujuan',
            'tracking.status'
        ])
        ->where('pengaju_user_id', $user->id)
        ->orderByDesc('created_at')
        ->get();

        $jenisSurat = JenisSurat::where('level_user_id', $user->level_user_id)->get();
        $urgensi = UrgensiSurat::all();

        // Ambil user dengan level Direktur atau Wakil Direktur DAN jabatan struktural tertentu
        $levelDirekturDanWadir = [5, 6]; // Ganti sesuai level_user_id untuk Direktur dan Wadir
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

        return Inertia::render('Pengaju/SuratMasuk/Index', [
            'suratMasuk' => $suratMasuk,
            'jenisSurat' => $jenisSurat,
            'urgensi' => $urgensi,
            'tujuan' => $tujuan,
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'jenis_surat_id' => 'nullable|exists:jenis_surat,id',
            'jenis_surat_manual' => 'nullable|string|max:255',
            'urgensi_surat_id' => 'required|exists:urgensi_surat,id',
            'tujuan_user_id' => 'required|exists:users,id',
            'tanggal_pengajuan' => 'required|date',
            'keterangan' => 'nullable|string|max:500',
            'nomor_surat' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        // Generate nomor agenda otomatis per tahun
        $tahun = now()->year;
        $jumlahTahunIni = SuratMasuk::whereYear('created_at', $tahun)->count() + 1;
        $nomorAgenda = $jumlahTahunIni . '/' . $tahun;

        // Upload file jika ada
        $filePath = null;
        if ($request->hasFile('file_surat')) {
            $filePath = $request->file('file_surat')->store('surat_masuk', 'public');
        }

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

        // Status awal: 'diajukan'
        $status = StatusSurat::where('kode', 'diajukan')->first();
        if ($status) {
            $surat->tracking()->create([
                'status_surat_id' => $status->id,
                'tanggal' => now(),
                'catatan' => 'Surat berhasil diajukan',
                'user_id' => $user->id,
            ]);
        }

        // PERBAIKAN: Mengubah nama route menjadi lowercase sesuai definisi di web.php
        return redirect()->route('pengaju.suratmasuk.index')->with('success', 'Surat berhasil diajukan!');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $surat = SuratMasuk::where('id', $id)
            ->where('pengaju_user_id', $user->id)
            ->firstOrFail();

        $request->validate([
            'jenis_surat_id' => 'nullable|exists:jenis_surat,id',
            'jenis_surat_manual' => 'nullable|string|max:255',
            'urgensi_surat_id' => 'required|exists:urgensi_surat,id',
            'tujuan_user_id' => 'required|exists:users,id',
            'tanggal_pengajuan' => 'required|date',
            'keterangan' => 'nullable|string|max:500',
            'nomor_surat' => 'nullable|string|max:100',
            'perihal' => 'required|string|max:255',
            'file_surat' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file_surat')) {
            if ($surat->file_path) {
                Storage::disk('public')->delete($surat->file_path);
            }
            $surat->file_path = $request->file('file_surat')->store('surat_masuk', 'public');
        }

        $surat->update([
            'jenis_surat_id' => $request->jenis_surat_id,
            'jenis_surat_manual' => $request->jenis_surat_manual,
            'urgensi_surat_id' => $request->urgensi_surat_id,
            'tujuan_user_id' => $request->tujuan_user_id,
            'tanggal_pengajuan' => $request->tanggal_pengajuan,
            'keterangan' => $request->keterangan,
            'nomor_surat' => $request->nomor_surat,
            'perihal' => $request->perihal,
            'file_path' => $surat->file_path,
        ]);

        return redirect()->route('pengaju.suratmasuk.index')->with('success', 'Surat berhasil diperbarui!');
    }
}
