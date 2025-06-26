<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JenisPegawaiBackup;
use App\Models\JenisPegawai;

class ImportJenisPegawai extends Command
{
    protected $signature = 'import:jenispegawai';
    protected $description = 'Import data jenis pegawai dari db_polmed_backup ke database utama';

    public function handle()
    {
        $data = JenisPegawaiBackup::select('jenispegawai')->get();

        foreach ($data as $item) {
            JenisPegawai::updateOrCreate(
                ['jenis_pegawai' => $item->jenispegawai],
                ['jenis_pegawai' => $item->jenispegawai]
            );
        }

        $this->info('Import data jenis pegawai selesai.');
    }
}