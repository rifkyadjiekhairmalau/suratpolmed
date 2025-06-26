<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JurusanBackup;
use App\Models\Jurusan;

class ImportJurusan extends Command
{
    protected $signature = 'import:jurusan';
    protected $description = 'Import data jurusan dari db_polmed_backup ke db utama';

    public function handle()
    {
        $data = JurusanBackup::select('jurusan')->get();

        foreach ($data as $item) {
            Jurusan::updateOrCreate(
                ['nama_jurusan' => $item->jurusan],
                ['nama_jurusan' => $item->jurusan]
            );
        }

        $this->info('Import jurusan selesai.');
    }
}