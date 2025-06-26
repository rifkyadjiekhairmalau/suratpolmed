<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PegawaiBackup extends Model
{
    // Gunakan koneksi ke database cadangan (misalnya PostgreSQL atau MySQL)
    protected $connection = 'pgsql_backup'; // ganti ke 'backup' kalau kamu pakai MySQL backup

    // Nama tabel di database backup
    protected $table = 'ms_pegawai';

    // Kalau tabel tidak punya created_at dan updated_at
    public $timestamps = false;

    // Kolom-kolom yang diizinkan untuk mass assignment
    protected $fillable = [
        'nip',
        'nama',
        'gelar_depan',
        'gelar_blk',
        'tempat_lahir',
        'email',
        'idjabatan',
        'idjabstruktural',
        'idjenis_pegawai',
    ];
}