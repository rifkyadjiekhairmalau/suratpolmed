<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JabatanStruktural;
use App\Models\JabatanStrukturalBackup;

class ImportJabatanStruktural extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:struktural';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data jabatan struktural dari DB backup';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $data = JabatanStrukturalBackup::select('struktural')->get();

        foreach ($data as $item) {
            JabatanStruktural::updateOrCreate(
                ['jabatan_struktural' => $item->struktural],
                ['jabatan_struktural' => $item->struktural]
            );
        }

        $this->info('Import jabatan struktural selesai.');
    }
}