<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StatusSurat;

class StatusSuratSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            [
                'kode' => 'diajukan',
                'nama_status' => 'Surat berhasil diajukan',
                'urutan' => 1,
                'final' => false,
            ],
            [
                'kode' => 'verifikasi',
                'nama_status' => 'Menunggu verifikasi bagian umum',
                'urutan' => 2,
                'final' => false,
            ],
            [
                'kode' => 'ditolak',
                'nama_status' => 'Surat ditolak bagian umum',
                'urutan' => 3,
                'final' => true,
            ],
            [
                'kode' => 'disposisi',
                'nama_status' => 'Menunggu disposisi pejabat',
                'urutan' => 4,
                'final' => false,
            ],
            [
                'kode' => 'proses',
                'nama_status' => 'Sedang diproses oleh kasubbag',
                'urutan' => 5,
                'final' => false,
            ],
            [
                'kode' => 'selesai',
                'nama_status' => 'Surat selesai diproses',
                'urutan' => 6,
                'final' => true,
            ],
        ];

        foreach ($statuses as $status) {
            StatusSurat::create($status);
        }
    }
}