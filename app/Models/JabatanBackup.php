<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JabatanBackup extends Model
{
    protected $connection = 'pgsql_backup'; // dari database backup
    protected $table = 'ref_jabatan';       // nama tabel di db backup
    public $timestamps = false;
}