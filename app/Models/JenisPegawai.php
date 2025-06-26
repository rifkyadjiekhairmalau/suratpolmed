<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPegawai extends Model
{
    protected $table = 'jenis_pegawai';

    protected $fillable = [
        'jenis_pegawai',
    ];

    public function pegawai()
    {
        return $this->hasMany(Pegawai::class, 'jenis_pegawai_id');
    }
}