<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisSurat extends Model
{
    protected $table = 'jenis_surat';

    protected $fillable = [
        'nama_jenis',
        'level_user_id',
    ];

    public function levelUser()
    {
        return $this->belongsTo(LevelUser::class, 'level_user_id');
    }

    public function suratMasuk()
    {
        return $this->hasMany(SuratMasuk::class, 'jenis_surat_id');
    }
}