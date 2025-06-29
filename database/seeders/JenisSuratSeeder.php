<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JenisSurat;

class JenisSuratSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Mahasiswa
            ['nama_jenis' => 'Surat Keterangan Aktif Kuliah', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Permohonan Cuti Akademik ', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Rekomendasi', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Cuti Akademik', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Izin Penelitian', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Permohonan Penundaan Pembayaran UKT', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Permohonan Penurunan Besaran UKT', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Pengunduran Diri Mahasiswa', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Permohonan Salinan Transkrip/Ijazah', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Penundaan Kegiatan Akademik', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Permohonan Aktif Kuliah Kembali', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Izin Kegiatan Kemahasiswaan', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Peminjaman Tempat dari Unit / Jurusan', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Permohonan Dana Kegiatan Kemahasiswaan', 'level_user_id' => 2],
            ['nama_jenis' => 'Surat Pengantar Proposal Kegiatan', 'level_user_id' => 2],
            ['nama_jenis' => 'Proposal Kegiatan Kemahasiswaan', 'level_user_id' => 2],
            ['nama_jenis' => 'Laporan Kegiatan Kemahasiswaan', 'level_user_id' => 2],

            
            // Pegawai
            ['nama_jenis' => 'Surat Tugas', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Permohonan Cuti', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Rekomendasi Pegawai', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Permohonan Penggantian Jadwal', 'level_user_id' => 3],
            ['nama_jenis' => 'Permohonan SK (Surat Keputusan)', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Permohonan Pindah/Mutasi', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Permohonan Kenaikan Pangkat/Golongan', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Pengajuan Jabatan Fungsional', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Keterangan Aktif Tridharma', 'level_user_id' => 3],
            ['nama_jenis' => 'Surat Izin Tidak Masuk Kerja', 'level_user_id' => 3],
            

            
        ];

        foreach ($data as $item) {
            JenisSurat::create($item);
        }
    }
}