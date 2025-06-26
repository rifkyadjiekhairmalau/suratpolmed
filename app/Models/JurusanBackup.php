<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JurusanBackup extends Model
{
    protected $connection = 'pgsql_backup';      // pakai koneksi db backup
    protected $table = 'ref_ej_jurusan';         // nama tabel sesuai db backup
    public $timestamps = false;                   // kalau gak pakai created_at/updated_at

    // Kalau cuma mau kolom jurusan saja, bisa atur fillable atau guarded, misal:
    protected $fillable = ['jurusan'];

    // Kalau kamu mau query cuma ambil kolom jurusan, bisa lakukan di querynya nanti
}