<?php

namespace Database\Seeders;

use App\Models\LevelUser;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class LevelUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            'administrator',
            'mahasiswa',
            'pegawai',
            'administrasi umum',
            'direktur',
            'wakil direktur',
            'kepala bagian',
            'kepala sub bagian',
        ];

        foreach ($levels as $level) {
            LevelUser::updateOrCreate(['nama_level' => $level]);
        }
    }
}