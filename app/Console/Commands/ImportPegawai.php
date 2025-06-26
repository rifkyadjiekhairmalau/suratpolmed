<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Pegawai;
use App\Models\User;
use App\Models\PegawaiBackup;
use App\Models\JabatanBackup;
use App\Models\JabatanStrukturalBackup;
use App\Models\JenisPegawaiBackup;

class ImportPegawai extends Command
{
    protected $signature = 'import:pegawai';
    protected $description = 'Impor data pegawai dari db_polmed_backup ke database utama';

    public function handle()
    {
        $pegawaiData = PegawaiBackup::all();

        $imported = 0;
        $skipped = 0;

        foreach ($pegawaiData as $item) {
            // Ambil nama jabatan dari tabel backup
            $jabatanBackup = JabatanBackup::find($item->idjabatan);
            $namaJabatan = $jabatanBackup?->jabatan;

            // Ambil nama jabatan struktural dari tabel backup
            $jabatanStrukturalBackup = JabatanStrukturalBackup::find($item->idjabstruktural);
            $namaJabatanStruktural = $jabatanStrukturalBackup?->struktural;

            // Ambil nama jenis pegawai dari tabel backup
            $jenisPegawaiBackup = JenisPegawaiBackup::find($item->idjenis_pegawai);
            $namaJenisPegawai = $jenisPegawaiBackup?->jenispegawai;

            // Lewatkan data jika salah satu nama tidak ditemukan
            if (!$namaJabatan || !$namaJabatanStruktural || !$namaJenisPegawai) {
                $this->warn("Nama jabatan/struktural/jenis tidak ditemukan untuk NIP {$item->nip}");
                $skipped++;
                continue;
            }

            // Cari ID jabatan, struktural, dan jenis pegawai berdasarkan nama di tabel utama
            $jabatan = DB::table('jabatan')->where('nama_jabatan', $namaJabatan)->first();
            $jabatanStruktural = DB::table('jabatan_struktural')->where('jabatan_struktural', $namaJabatanStruktural)->first();
            $jenisPegawai = DB::table('jenis_pegawai')->where('jenis_pegawai', $namaJenisPegawai)->first();

            // Lewatkan jika tidak ditemukan ID yang cocok di tabel utama
            if (!$jabatan || !$jabatanStruktural || !$jenisPegawai) {
                $this->warn("Tidak menemukan ID di tabel utama untuk NIP {$item->nip}");
                $skipped++;
                continue;
            }

            // Lewatkan jika NIP sudah pernah diinput
            if (Pegawai::where('nip', $item->nip)->exists()) {
                $skipped++;
                continue;
            }

            // Simpan data ke tabel pegawai
            $pegawai = Pegawai::create([
                'nip' => $item->nip,
                'gelar_depan' => $item->gelar_dpn,
                'nama' => $item->nama,
                'gelar_belakang' => $item->gelar_blk,
                'tempat_lahir' => $item->tempat_lahir,
                'email' => $item->email,
                'jabatan_id' => $jabatan->id,
                'jabatan_struktural_id' => $jabatanStruktural->id,
                'jenis_pegawai_id' => $jenisPegawai->id,
            ]);

            // Buat akun user otomatis setelah data pegawai berhasil ditambahkan
            User::create([
                'username' => $pegawai->nip,
                'name' => $pegawai->nama,
                'password' => Hash::make('pegawai123'), 
                'level_user_id' => 3, // ID level_user untuk pegawai
                'pegawai_id' => $pegawai->id,
                'mahasiswa_id' => null,
                'jabatan_struktural_id' => $pegawai->jabatan_struktural_id,
                'status' => 'aktif',
            ]);

            $this->info("Berhasil impor NIP {$item->nip}");
            $imported++;
        }

        $this->info("Import selesai. Sukses: {$imported}, Dilewati: {$skipped}");
    }
}