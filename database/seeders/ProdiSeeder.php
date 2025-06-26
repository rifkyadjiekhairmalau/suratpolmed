<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        Prodi::insert([
            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA PENGELASAN DAN FABRIKASI',
                'jurusan_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA ENERGI TERBARUKAN',
                'jurusan_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA KIMIA INDUSTRI',
                'jurusan_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA MANUFAKTUR',
                'jurusan_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA JARINGAN TELEKOMUNIKASI',
                'jurusan_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA INSTALASI LISTRIK',
                'jurusan_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama_prodi' => 'D4 TEKNOLOGI REKAYASA OTOMASI',
                'jurusan_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'nama_prodi' => 'MAGISTER TERAPAN SISTEM INFORMASI AKUNTANSI',
                'jurusan_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}