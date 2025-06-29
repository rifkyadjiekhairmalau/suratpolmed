<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UrgensiSurat extends Model
{
    protected $table = 'urgensi_surat';

    protected $fillable = [
        'nama_urgensi',
    ];

    public function suratMasuk()
    {
        return $this->hasMany(SuratMasuk::class, 'urgensi_surat_id');
    }

}