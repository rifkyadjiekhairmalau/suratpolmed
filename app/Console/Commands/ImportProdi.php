<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProdiBackup;
use App\Models\JurusanBackup;
use App\Models\Prodi;
use App\Models\Jurusan;

class ImportProdi extends Command
{
    protected $signature = 'import:prodi';
    protected $description = 'Import data prodi dari db_polmed_backup ke database utama';

    public function handle()
    {
        $data = ProdiBackup::select('prodi', 'idjurusan')->get();

        foreach ($data as $item) {
            // Cari nama jurusan dari DB backup
            $jurusanBackup = JurusanBackup::where('id', $item->idjurusan)->first();

            if (!$jurusanBackup) {
                $this->warn("Jurusan backup dengan ID {$item->idjurusan} tidak ditemukan. Melewati...");
                continue;
            }

            // Cocokkan nama jurusan ke DB utama
            $jurusanUtama = Jurusan::where('nama_jurusan', $jurusanBackup->jurusan)->first();

            if (!$jurusanUtama) {
                $this->warn("Nama jurusan '{$jurusanBackup->jurusan}' tidak ditemukan di DB utama. Melewati...");
                continue;
            }

            // Simpan prodi ke DB utama
            Prodi::updateOrCreate(
                ['nama_prodi' => $item->prodi],
                [
                    'nama_prodi' => $item->prodi,
                    'jurusan_id' => $jurusanUtama->id,
                ]
            );
        }

        $this->info('Import data prodi selesai.');
    }
}