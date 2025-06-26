<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JabatanBackup;
use App\Models\Jabatan;

class ImportJabatan extends Command
{
    protected $signature = 'import:jabatan';
    protected $description = 'Import data jabatan dari db_polmed_backup ke database utama';

    public function handle()
    {
        $data = JabatanBackup::select('jabatan')->get();

        foreach ($data as $item) {
            Jabatan::updateOrCreate(
                ['nama_jabatan' => $item->jabatan],
                ['nama_jabatan' => $item->jabatan]
            );
        }

        $this->info('Import data jabatan selesai.');
    }
}