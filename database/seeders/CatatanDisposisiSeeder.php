<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CatatanDisposisi;

class CatatanDisposisiSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['isi_catatan' => 'Mohon Pertimbangan'],
            ['isi_catatan' => 'Mohon Pendapat'],
            ['isi_catatan' => 'Mohon Keputusan'],
            ['isi_catatan' => 'Mohon Petunjuk'],
            ['isi_catatan' => 'Mohon Saran'],
            ['isi_catatan' => 'Bicarakan'],
            ['isi_catatan' => 'Teliti/Ikuti Perkembangan'],
            ['isi_catatan' => 'Untuk Perhatian'],
            ['isi_catatan' => 'Siapkan Laporan'],
            ['isi_catatan' => 'Untuk Diproses'],
            ['isi_catatan' => 'Selesaikan Sesuai Pembicaraan'],
            ['isi_catatan' => 'Edaran'],
            ['isi_catatan' => 'Tik/Gandakan'],
            ['isi_catatan' => 'File'],
            ['isi_catatan' => 'Siapkan Konsep'],
        ];

        foreach ($data as $item) {
            CatatanDisposisi::create($item);
        }
    }
}