<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UrgensiSurat;

class UrgensiSuratSeeder extends Seeder
{
    public function run(): void
    {
        $urgensi = [
            ['nama_urgensi' => 'Penting'],
            ['nama_urgensi' => 'Segera'],
            ['nama_urgensi' => 'Biasa/Rutin'],
        ];

        foreach ($urgensi as $item) {
            UrgensiSurat::create($item);
        }
    }
}