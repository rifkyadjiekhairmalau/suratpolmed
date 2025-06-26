<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPegawaiBackup extends Model
{
    protected $connection = 'pgsql_backup'; // koneksi db backup
    protected $table = 'ref_jenispegawai'; // nama tabel di db backup
    public $timestamps = false;
}