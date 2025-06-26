<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\LevelUser;
use App\Models\Mahasiswa;
use App\Models\MahasiswaBackup;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ImportMahasiswa extends Command
{
    protected $signature = 'import:mahasiswa';
    protected $description = 'Import mahasiswa data from backup';

    public function handle()
    {
        // Cari ID level user "mahasiswa"
        $levelUserId = LevelUser::where('nama_level', 'mahasiswa')->value('id');

        if (!$levelUserId) {
            $this->error('Level user "mahasiswa" tidak ditemukan!');
            return 1;
        }

        $data = MahasiswaBackup::where('nim', 'ILIKE', '220510%')
                    ->orderBy('nim')
                    ->get();

        foreach ($data as $item) {
            $mahasiswa = Mahasiswa::updateOrCreate(
                ['nim' => $item->nim],
                [
                    'nama' => $item->nama,
                    'prodi_id' => 16,
                    'jurusan_id' => 6,
                ]
            );

            User::updateOrCreate(
                ['username' => $item->nim],
                [
                    'name' => $item->nama,
                    'password' => Hash::make('polmed123'),
                    'level_user_id' => $levelUserId,
                    'mahasiswa_id' => $mahasiswa->id,
                    'status' => 'aktif', // ← pakai string, bukan boolean
                ]
            );
        }

        $this->info('Import mahasiswa TI selesai.');
    }
}