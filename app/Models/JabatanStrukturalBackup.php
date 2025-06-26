<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JabatanStrukturalBackup extends Model
{
    protected $connection = 'pgsql_backup'; // koneksi db backup
    protected $table = 'ref_jabatanstruktural'; // nama tabel di db backup
    public $timestamps = false;
}