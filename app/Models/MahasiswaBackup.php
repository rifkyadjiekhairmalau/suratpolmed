<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MahasiswaBackup extends Model
{
    // Tentukan koneksi database yang dipakai untuk model ini (koneksi ke db_polmed_backup)
    protected $connection = 'pgsql_backup'; 

    // Nama tabel di database backup
    protected $table = 'ms_mahasiswa';

    // Kalau tabel ini gak pakai timestamps (created_at, updated_at)
    public $timestamps = false;

    // Kolom-kolom yang boleh diisi (optional tapi bagus untuk proteksi mass assignment)
    protected $fillable = [
        'nim',
        'nama',
        'program_studi', // karena ini yang ada di db backup
        // tambahkan kolom lain kalau perlu, contoh email kalau ada
    ];
}