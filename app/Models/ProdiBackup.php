<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdiBackup extends Model
{
    protected $connection = 'pgsql_backup'; // nama koneksi db backup dari .env / config
    protected $table = 'ref_ej_prodi'; // nama tabel di db backup
    public $timestamps = false; // diasumsikan tabel backup tidak pakai timestamps
}