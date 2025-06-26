<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JabatanStruktural;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class JabatanStrukturalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'Wakil Direktur Bidang Akademik',
            'Wakil Direktur Bidang Perencanaan, Keuangan, dan Umum',
            'Wakil Direktur Bidang Kemahasiswaan',
            'Wakil Direktur Bidang Kerjasama dan Hubungan Masyarakat',
            'Kepala Bagian Perencanaan, Keuangan, dan Umum',
            'Kepala Bagian Akademik, Kemahasiswaan, dan Kerjasama',
            'Kepala Sub Bagian Umum',
            'Kepala Sub Bagian Akademik',
        ];

        foreach ($data as $jabatan) {
            JabatanStruktural::updateOrCreate(
                ['jabatan_struktural' => $jabatan],
                ['jabatan_struktural' => $jabatan]
            );
        }
    }
}