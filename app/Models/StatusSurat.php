<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusSurat extends Model
{
    protected $table = 'status_surat';

    protected $fillable = [
        'kode',
        'nama_status',
        'urutan',
        'final',
    ];
}